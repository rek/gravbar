/*global app, game, Phaser */
'use strict';
var playState = {

    // now done in loader state
    preload: function() {

    },
    // Fuction called after 'preload' to setup the game
    create: function() {
        this.settings = {
            pipeDelay: 2.8,
        };
        app.level = 1;
        app.score = 0;

    },

    // This function is called 60 times per second
    update: function() {

    }

};