'use strict';


module.exports = function (grunt) {

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			all: {
				files: {
					'dist/minicart.js': ['src/**/*.js']
				}
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
			all: {
				files: {
					'dist/minicart.min.js': ['dist/minicart.js'],
					'dist/minicart.classic.min.js': ['dist/minicart.classic.js']
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
		},

		replace: {
			classic: {
				src: ['dist/minicart.js'],
				dest: 'dist/minicart.classic.js',
				options: {
					processTemplates: false
				},
				replacements: [
					{
						from: '$TEMPLATE$',
						to: function (word) {
							return grunt.file.read('src/themes/classic/index.html').replace(/(^\s+|\s+$)/g, '').replace(/(\r\n|\n|\r)/g, '');
						}
					},
					{
						from: '$STYLES$',
						to: function (word) {
							return grunt.file.read('src/themes/classic/styles.css').replace(/(^\s+|\s+$)/g, '').replace(/(\r\n|\n|\r)/g, '');
						}
					}
				]
			},
			default: {
				src: ['dist/minicart.js'],
				overwrite: true,
				options: {
					processTemplates: false
				},
				replacements: [
					{
						from: '$TEMPLATE$',
						to: function (word) {
							return grunt.file.read('src/themes/default/index.html').replace(/(^\s+|\s+$)/g, '').replace(/(\r\n|\n|\r)/g, '');
						}
					},
					{
						from: '$STYLES$',
						to: function (word) {
							return grunt.file.read('src/themes/default/styles.css').replace(/(^\s+|\s+$)/g, '').replace(/(\r\n|\n|\r)/g, '');
						}
					}
				]
			}
		}
	});

	// Dependencies
	grunt.task.loadNpmTasks('grunt-contrib-jshint');
	grunt.task.loadNpmTasks('grunt-contrib-uglify');
	grunt.task.loadNpmTasks('grunt-mocha');
	grunt.task.loadNpmTasks('grunt-mocha-test');
	grunt.task.loadNpmTasks('grunt-browserify');
	grunt.task.loadNpmTasks('grunt-text-replace');

	// Tasks
	grunt.registerTask('lint',  ['jshint']);
	grunt.registerTask('test',  ['lint', 'build', 'mochaTest', 'mocha']);
	grunt.registerTask('build', ['browserify', 'replace', 'uglify']);

};
