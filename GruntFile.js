'use strict';


module.exports = function (grunt) {

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: grunt.file.readJSON('.jshintrc'),
			all: ['src/**/*.js', 'test/**/*.js']
		},

		browserify: {
			all: {
				files: {
					'dist/minicart.js': ['src/**/*.js']
				}
			}
		},

		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>\n *\n * <%= pkg.description %>\n *\n * @version <%= pkg.version %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n * @url <%= pkg.homepage %> \n * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n */\n'
			},
			all: {
				files: {
					'dist/minicart.min.js': ['dist/minicart.js']
				}
			}
		},

		mocha: {
			browser: [ 'test/functional/**/*.html' ],

			options: {
				bail: true,
				log: true,
				mocha: {},
				reporter: 'Spec',
				run: true,
				timeout: 10000
			}
		},

		mochaTest: {
			all: {
				options: {
					reporter: 'spec'
				},
				src: ['test/unit/**/*.js']
			}
		}
	});

	// Dependencies
	grunt.task.loadNpmTasks('grunt-contrib-jshint');
	grunt.task.loadNpmTasks('grunt-contrib-uglify');
	grunt.task.loadNpmTasks('grunt-mocha');
	grunt.task.loadNpmTasks('grunt-mocha-test');
	grunt.task.loadNpmTasks('grunt-browserify');
	grunt.task.loadTasks('./tasks');


	// Tasks
	grunt.registerTask('lint',  ['jshint']);
	grunt.registerTask('test',  ['lint', 'build', 'mochaTest', 'mocha']);
	grunt.registerTask('build', ['browserify', 'themify', 'uglify']);

};
