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
				banner : "/* @flow */" + module.banner
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
			    dest : 'dist/scoped-flowtype.js'
			}
		},	
		clean: {
			raw: "dist/scoped-raw.js",
			browserstack : [ "./browserstack.json", "BrowserStackLocal" ],
			jsdoc : ['./jsdoc.conf.json']
		},
		jsdoc : {
			dist : {
				src : [ './README.md', './src/main/*.js' ],					
				options : {
					destination : 'docs',
					template : "node_modules/grunt-betajs-docs-compile",
					configure : "./jsdoc.conf.json",
					tutorials: "./docsrc/tutorials",
					recurse: true
				}
			}
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
			//source : [ "./src/main/*.js"],
			dist : [ "./dist/scoped.js" ],
			gruntfile : [ "./Gruntfile.js" ],
			tests : [ "./tests/*.js" ]
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
			"jsdoc": {
				options: {
					data: {
						data: {
							"tags": {
								"allowUnknownTags": true
							},
							"plugins": ["plugins/markdown"],
							"templates": {
								"cleverLinks": false,
								"monospaceLinks": false,
								"dateFormat": "ddd MMM Do YYYY",
								"outputSourceFiles": true,
								"outputSourcePath": true,
								"systemName": "BetaJS",
								"footer": "",
								"copyright": "BetaJS (c) - MIT License",
								"navType": "vertical",
								"theme": "cerulean",
								"linenums": true,
								"collapseSymbols": false,
								"inverseNav": true,
								"highlightTutorialCode": true,
								"protocol": "fred://",
								"singleTutorials": true,
								"emptyTutorials": true
							},
							"markdown": {
								"parser": "gfm",
								"hardwrap": true
							}
						}
					}
				},
				files : {
					"jsdoc.conf.json": ["compile/json.tpl"]
				}
			},
			"readme" : {
				options : {
					data: {
						indent: "",
						framework: grunt.file.readJSON('package.json')
					}
				},
				files : {
					"README.md" : ["compile/readme.tpl"]
				}
			},
			"license" : {
				options : {
					data: grunt.file.readJSON('package.json')
				},
				files : {
					"LICENSE" : ["compile/license.tpl"]
				}
			},
			"browserstack-desktop" : {
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
				                'ie_6'
				            ]
						}
					}
				},
				files : {
					"browserstack.json" : ["compile/json.tpl"]
				}
			},
			"browserstack-mobile" : {
				options : {
					data: {
						data: {
							"test_path" : "tests/tests.html",
							"test_framework" : "qunit",
							"timeout": 10 * 60,
							"browsers": [
							    {"os": "ios", "os_version": "8.0"}, 
							    {"os": "ios", "os_version": "7.0"},
							    {"os": "android", "os_version": "4.4"},
							    {"os": "android", "os_version": "4.0"}
				            ]
						}
					}
				},
				files : {
					"browserstack.json" : ["compile/json.tpl"]
				}
			}			
		},
		babel: {
			options: {
				sourceMap: false,
				plugins: ["transform-flow-strip-types"]
			},
			dist: {
				files: {
					'dist/scoped.js': 'dist/scoped-flowtype.js'
				}
			}
		},
		flow: {
			dist: {
				src: 'dist/',            // `.flowconfig` folder
				options: {
					background: false,    // Watch/Server mode
					all: false,           // Check all files regardless
					lib: '',              // Library directory
					stripRoot: false,     // Relative vs Absolute paths
					weak: false,          // Force weak check
					showAllErrors: true // Show more than 50 errors
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-node-qunit');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-flow-type-check');

	grunt.registerTask('default', ['revision-count', 'concat', 'preprocess', 'babel', 'clean:raw', 'uglify']);
	grunt.registerTask('docs', ['template:jsdoc', 'jsdoc', 'clean:jsdoc']);
	grunt.registerTask('qunit', [ 'node-qunit' ]);
	grunt.registerTask('lint', [ /*'jshint:source',*/ 'jshint:dist',
			'jshint:tests', 'jshint:gruntfile' ]);
	grunt.registerTask('check', [ 'lint', 'qunit' ]);
	grunt.registerTask('flowcheck', ['flow:dist']);
	grunt.registerTask('browserstack-desktop', [ 'template:browserstack-desktop', 'shell:browserstack', 'clean:browserstack' ]);
	grunt.registerTask('browserstack-mobile', [ 'template:browserstack-mobile', 'shell:browserstack', 'clean:browserstack' ]);
	grunt.registerTask('readme', [ 'template:readme' ]);
	grunt.registerTask('license', [ 'template:license' ]);

};