module.banner = '/*!\n<%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\nCopyright (c) <%= pkg.contributors %>\n<%= pkg.license %> Software License.\n*/\n';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat : {
			options : {
				banner : module.banner
			},
			dist : {
				dest : 'dist/scoped.js',
				src : [
					'src/fragments/begin.js-fragment',
					'src/main/globals.js',
					'src/main/helper.js',
					'src/main/scoped.js',
					'src/main/namespace.js',
					'src/main/scopes.js',
					'src/main/public.js',
					'src/main/init.js',
					'src/fragments/end.js-fragment',
				]
			},
		},
		uglify : {
			options : {
				banner : module.banner
			},
			dist : {
				files : {
					'dist/scoped.min.js' : [ 'dist/scoped.js' ],					
				}
			}
		},
		shell: {
			qunit: {
		    	command: 'qunit -c Scoped:./dist/scoped.js -t ./tests/*.js',
		    	options: {
                	stdout: true,
                	stderr: true,
            	},
            	src: [
            		"src/*.js",
            		"tests/*.js"
            	]
			},
			lint: {
		    	command: "jsl +recurse --process ./src/*.js",
		    	options: {
                	stdout: true,
                	stderr: true,
            	},
            	src: [
            		"src/*/*.js"
            	]
			}
		},
	});

	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-shell');	

	grunt.registerTask('default', ['newer:concat', 'newer:uglify']);
	grunt.registerTask('qunit', ['shell:qunit']);
	grunt.registerTask('lint', ['shell:lint']);	
	grunt.registerTask('check', ['lint', 'qunit']);

};