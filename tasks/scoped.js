module.exports = function(grunt) {
	var Scoped = require(__dirname + "/../dist/scoped.js");
	var Path = require("path");
	grunt.registerMultiTask('scoped', 'Scoped compilation', function() {
		this.files.forEach(function (fileObj) {
			var sources = fileObj.orig.src;
			var dest = fileObj.dest;
			var result = [];
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
};