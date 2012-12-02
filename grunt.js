/*jshint node:true, browser:false */

var grunt = require('grunt'),
	fs = require('fs'),
	jshintOptions = JSON.parse(fs.readFileSync('./.jshintrc'));


module.exports = function (grunt) {
	'use strict';

	// Project configuration
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: "/*!\n * <%= pkg.name %>\n *\n * <%= pkg.description %>\n *\n * @version <%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd, h:MM:ss TT') %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n * @url <%= pkg.url %> \n * @license <<%= pkg.license %>>\n */"
		},
		lint: {
			all: [ 'src/*.js', 'test/*.js' ]
		},
		jshint: {
			options: jshintOptions
		},
		concat: {
			dist: {
				src: [ 'src/minicart.js', 'lib/json2.js' ],
				dest: 'dist/minicart.js'
			}
		},
		min: {
			dist: {
				src: [ '<banner:meta.banner>', 'src/minicart.js', 'lib/json2.js' ],
				dest: 'dist/minicart.min.js'
			}
		}
	});


	// Tasks
	grunt.registerTask('default', 'lint');
	grunt.registerTask('dist', 'lint concat min');

};