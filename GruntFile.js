'use strict';


module.exports = function (grunt) {

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			dist: {
				files: {
					'dist/minicart.js': ['src/**/*.js']
				}
			}
		},

		concat: {
			dist: {
				src: ['dist/minicart.js', 'lib/json2.js'],
				dest: 'dist/minicart.js'
			}
		},

		jshint: {
			options: grunt.file.readJSON('.jshintrc'),
			all: ['src/**/*.js', 'test/**/*.js']
		},

		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>\n *\n * <%= pkg.description %>\n *\n * @version <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n * @url <%= pkg.homepage %> \n * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n */\n'
			},
			dist: {
				files: {
					'dist/minicart.min.js': ['dist/minicart.js']
				}
			}
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.js']
			}
		}
	});

	// Dependencies
	grunt.task.loadNpmTasks('grunt-contrib-concat');
	grunt.task.loadNpmTasks('grunt-contrib-jshint');
	grunt.task.loadNpmTasks('grunt-contrib-uglify');
	grunt.task.loadNpmTasks('grunt-mocha-test');
	grunt.task.loadNpmTasks('grunt-browserify');

	// Tasks
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('test', ['browserify', 'mochaTest']);
	grunt.registerTask('build', ['jshint', 'mochaTest', 'browserify', 'uglify']);

};