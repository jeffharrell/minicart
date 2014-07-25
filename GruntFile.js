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
            all: {
                files: {
                    'dist/minicart.min.js': ['dist/minicart.js']
                }
            }
        },

        usebanner: {
            all: {
                options: {
                    banner: grunt.file.read('.banner')
                },
                files: {
                    src: [ 'dist/**/*.js' ]
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

        watch: {
            scripts: {
                files: ['src/**/*'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            }
        }
    });


    // Dependencies
    grunt.task.loadNpmTasks('grunt-contrib-jshint');
    grunt.task.loadNpmTasks('grunt-contrib-uglify');
    grunt.task.loadNpmTasks('grunt-contrib-watch');
    grunt.task.loadNpmTasks('grunt-banner');
    grunt.task.loadNpmTasks('grunt-mocha');
    grunt.task.loadNpmTasks('grunt-mocha-test');
    grunt.task.loadNpmTasks('grunt-browserify');
    grunt.task.loadTasks('./tasks');


    // Tasks
    grunt.registerTask('lint',  ['jshint']);
    grunt.registerTask('test',  ['lint', 'build', 'mochaTest', 'mocha']);
    grunt.registerTask('build', ['browserify', 'themify', 'uglify', 'usebanner']);

};
