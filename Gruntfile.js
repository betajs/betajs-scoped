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
					'src/fragments/end.js-fragment'
				]
			}
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
		clean: {
			raw: "dist/scoped-raw.js",
			closure: "dist/scoped-closure.js",
			browserstack : [ "./browserstack.json", "BrowserStackLocal" ]
		},
		uglify : {
			options : {
				banner : module.banner
			},
			dist : {
				files : {
					'dist/scoped.min.js' : [ 'dist/scoped.js' ]					
				}
			}
		},
		jshint : {
			options: {
				es5: false,
				es3: true
			},
			source : [ "./src/main/*.js"],
			dist : [ "./dist/scoped.js" ],
			gruntfile : [ "./Gruntfile.js" ],
			tests : [ "./tests/*.js" ]
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
		},
		'node-qunit' : {
			dist : {
				code : './dist/scoped.js',
				tests : grunt.file.expand("./tests/*.js"),
				done : function(err, res) {
					publishResults("node", res, this.async());
				}
			}
		},
		shell : {
			browserstack : {
				command : 'browserstack-runner',
				options : {
					stdout : true,
					stderr : true
				}
			}
		},
		template : {
			browserstack : {
				options : {
					data: {
						data: {
							"test_path" : "tests/tests.html",
							"test_framework" : "qunit",
							"timeout": 10 * 60,
							"browsers": [
				              	'firefox_latest',
							    'firefox_4',
				                'chrome_latest',
					            'chrome_14',
				                'safari_latest',
					            'safari_4',
				                'opera_latest', 
							    'opera_12_15',
				                'ie_11',
				                'ie_10',
				                'ie_9',
				                'ie_8',
				                'ie_7',
				                'ie_6',
							    {"os": "ios", "os_version": "8.0"}, 
/*							    {"os": "ios", "os_version": "6.1"},
							    {"os": "android", "os_version": "5.0"}, */
							    {"os": "android", "os_version": "4.0"}
				            ]
						}
					}
				},
				files : {
					"browserstack.json" : ["json.tpl"]
				}
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-node-qunit');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-template');

	grunt.registerTask('default', ['revision-count', 'concat', 'preprocess', 'clean:raw', 'uglify']);
	grunt.registerTask('qunit', [ 'node-qunit' ]);
	grunt.registerTask('lint', [ 'jshint:source', 'jshint:dist',
			'jshint:tests', 'jshint:gruntfile' ]);
	grunt.registerTask('check', [ 'lint', 'qunit' ]);
	grunt.registerTask('closure', ['closureCompiler', 'clean:closure']);
	grunt.registerTask('browserstack', [ 'template:browserstack', 'shell:browserstack', 'clean:browserstack' ]);

};