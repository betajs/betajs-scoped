module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile');
	var dist = 'scoped';

	gruntHelper.init(pkg, grunt)
	
	
    /* Compilation */    
    .concatTask('concat-raw', [
        'src/fragments/begin.js-fragment',
		'src/main/globals.js',
		'src/main/helper.js',
		'src/main/attach.js',
		'src/main/namespace.js',
		'src/main/scopes.js',
		'src/main/public.js',
		'src/main/init.js',
        'src/fragments/end.js-fragment'
	], 'dist/' + dist + '-raw.js')
    .preprocessrevisionTask(null, 'dist/' + dist + '-raw.js', 'dist/' + dist + '.js')
    .uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
    .packageTask()

    /* Testing */
    .qunitjsTask(null, ['dist', 'tests'])
    .closureTask(null, ["./dist/" + dist + ".js"])
    .browserstackTask(null, 'tests/tests.html', {desktop: true, mobile: true})
    .lintTask(null, ['./src/**/*.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])

    /* External Configurations */
    .codeclimateTask()
	.autoincreasepackageTask(null, "package-source.json")
    .travisTask(null, "4.0")
    
    /* Markdown Files */
	.readmeTask()
    .licenseTask()
    
    /* Documentation */
    .docsTask();

	grunt.initConfig(gruntHelper.config);	

	grunt.registerTask('default', ['autoincreasepackage', 'package', 'readme', 'license', 'codeclimate', 'travis', 'concat-raw', 'preprocessrevision', 'uglify-scoped']);
	grunt.registerTask('check', ['lint', 'qunitjs']);

};
