module.exports = function(grunt) {
	var Scoped = require(__dirname + "/../dist/scoped.js");
	var Path = require("path");
	
	grunt.registerMultiTask('scoped', 'Scoped compilation', function() {
		this.files.forEach(function (fileObj) {
			var sources = fileObj.orig.sources || fileObj.orig.src;
			var dest = fileObj.dest;
			var result = [];
			if (fileObj.orig.include_scoped)
				result.push(grunt.file.read(__dirname + "/../dist/scoped.js"));
			var subs = [];
			var externals = fileObj.externals || [];
			for (var j = 0; j < externals.length; ++j) {
				Scoped.define(externals[j], function () {
					return {};
				});
			}
			for (var i = 0; i < sources.length; ++i) {
				var sub = Scoped.nextScope();
				var current = sources[i];
				for (var bind in current.bindings || {})
					sub.binding(bind, current.bindings[bind], { readonly: true });
				sub.options.compile = true;
				sub.options.lazy = !current.full;
				require(Path.resolve(current.src));
				sub.require(current.require || []);
				subs.push(sub);
			}
			for (var i = 0; i < sources.length; ++i) {				
				var source = sources[i];
				if (source.hidden)
					continue;
				var sub = subs[i];
				result.push("(function () {");
				result.push("var Scoped = this.subScope();");
				for (var bind in source.bindings || {})
					result.push("Scoped.binding('" + bind + "', '" + source.bindings[bind] + "');");
				result.push(subs[i].compiled);
				result.push("}).call(Scoped);")
				
			}
			grunt.file.write(dest, result.join("\n"));
		});
	});
	
	grunt.registerMultiTask('scoped-closure', 'closure', function() {
		this.files.forEach(function(fileGroup) {
			var result = [];
			if (fileGroup.banner)
				result.push(fileGroup.banner);
			result.push("(function () {");
			result.push("var Scoped = this.subScope();");
			for (var bind in fileGroup.bindings || {})
				result.push("Scoped.binding('" + bind + "', '" + fileGroup.bindings[bind] + "');");
			for (var define in fileGroup.defines || {}) {
				result.push('Scoped.define("' + define + '", function () {');
				result.push('	return ' + JSON.stringify(fileGroup.defines[define], null, 4) + ';');
				result.push('});');
			}
			for (var module in fileGroup.version_assumptions || {})
				result.push("Scoped.assumeVersion('" + module + "', " + fileGroup.version_assumptions[module] + ");");
			
			if (fileGroup.exports) {
				result.push("Scoped.require(['" + fileGroup.exports + "'], function (mod) {");
				result.push("	this.exports(typeof module != 'undefined' ? module : null, mod);");
				result.push("}, this);");
			}

			var files = grunt.file.expand({nonull: true}, fileGroup.src);
			files.forEach(function (filepath) {
		        if (!grunt.file.exists(filepath)) {
		            grunt.log.error("Source file '" + filepath + "' not found.");
		            return "";
		        }
		        result.push(grunt.file.read(filepath));
			});
			
			result.push("}).call(Scoped);")
	        grunt.file.write(fileGroup.dest, result.join("\n"));			
		});
	});

};