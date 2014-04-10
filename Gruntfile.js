'use strict';

require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        data: {
            // for example we can add config here too:
            mocha: {
                all: {
                    options: {
                        log: true,
                        reporter: 'Spec',
                        run: false,
                        timeout: 10000,
                        urls: ['http://localhost:8888/index.html']
                    }
                }
            },
            'mocha_phantomjs': {
                all: ['app/scripts/modules/{,*/}test/*.html']
            }
        }
    });

};