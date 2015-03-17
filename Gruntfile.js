module.banner = '/*!\n<%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\nCopyright (c) <%= pkg.contributors %>\n<%= pkg.license %> Software License.\n*/\n';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		'revision-count': {
		    options: {
		      property: 'revisioncount',
		      ref: 'HEAD'
		    }
		},
		concat : {
			options : {
				banner : module.banner
			},
			dist : {
				dest : 'dist/scoped-raw.js',
				src : [
					'src/fragments/begin.js-fragment',
					'src/main/globals.js',
					'src/main/helper.js',
					'src/main/attach.js',
					'src/main/namespace.js',
					'src/main/scopes.js',
					'src/main/public.js',
					'src/main/init.js',
					'src/fragments/end.js-fragment',
				]
			},
		},
		preprocess : {
			options: {
			    context : {
			    	MAJOR_VERSION: '<%= revisioncount %>',
			    	MINOR_VERSION: (new Date()).getTime()
			    }
			},
			dist : {
			    src : 'dist/scoped-raw.js',
			    dest : 'dist/scoped.js'
			}
		},	
		clean: ["dist/scoped-raw.js", "dist/scoped-closure.js"],
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
			},
			lintfinal: {
		    	command: "jsl --process ./dist/scoped.js",
		    	options: {
                	stdout: true,
                	stderr: true,
            	},
            	src: [
            		"src/*/*.js"
            	]
			}
		},
		closureCompiler:  {
			options: {
			    compilerFile: process.env.CLOSURE_PATH + "/compiler.jar",
			    compilerOpts: {
			       compilation_level: 'ADVANCED_OPTIMIZATIONS',
			       warning_level: 'verbose',
			       externs: ["./src/fragments/closure.js-fragment"]
			    }
		    },
		    dist: {
		    	src: "./dist/scoped.js",
		    	dest: "./dist/scoped-closure.js"
		    }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-git-revision-count');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-closure-tools');

	grunt.registerTask('default', ['revision-count', 'concat', 'preprocess', 'clean', 'uglify']);
	grunt.registerTask('qunit', ['shell:qunit']);
	grunt.registerTask('lint', ['shell:lint', 'shell:lintfinal']);	
	grunt.registerTask('check', ['lint', 'qunit']);
	grunt.registerTask('closure', ['closureCompiler', 'clean']);

};