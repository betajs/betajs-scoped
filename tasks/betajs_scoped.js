module.exports = function(grunt) {
	var Scoped = require(__dirname + "/../dist/scoped.js");
	var Path = require("path");
	grunt.registerMultiTask('betajs_scoped', 'Scoped compilation', function() {
		this.files.forEach(function (fileObj) {
			var sources = fileObj.orig.src;
			var dest = fileObj.dest;
			var result = [];
			for (var i = 0; i < sources.length; ++i) {
				var sub = Scoped.nextScope();
				sub.options.compile = true;
				sub.options.lazy = true;
				var current = sources[i];
				require(Path.resolve(current.src));
				sub.require(current.require);
				result.push(sub.compiled);
			}
			grunt.file.write(dest, result.join("\n"));
		});
	});
};