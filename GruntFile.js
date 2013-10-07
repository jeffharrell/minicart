'use strict';


module.exports = function (grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: ['src/minicart.js', 'lib/json2.js'],
				dest: 'dist/minicart.js'
			}
		},
		jshint: {
			options: grunt.file.readJSON('.jshintrc'),
			all: ['src/*.js', 'test/*.js']
		},
		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>\n *\n * <%= pkg.description %>\n *\n * @version <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n * @url <%= pkg.url %> \n * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n */'
			},
			dist: {
				files: {
					'dist/minicart.min.js': ['dist/minicart.js']
				}
			}
		}
	});

	grunt.task.loadNpmTasks('grunt-contrib-concat');
	grunt.task.loadNpmTasks('grunt-contrib-jshint');
	grunt.task.loadNpmTasks('grunt-contrib-uglify');


	// Tasks
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('build', ['jshint', 'concat', 'uglify']);

};