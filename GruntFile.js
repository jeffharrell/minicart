'use strict';


module.exports = function (grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/config.js', 'src/product.js', 'src/cart.js', 'src/ui.js', 'lib/json2.js'],
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

    // Tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('build', ['jshint', 'mochaTest', 'concat', 'uglify']);

};