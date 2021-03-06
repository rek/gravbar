/*global Phaser, navigator, window */
'use strict';

var mobileFound = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var game = {},
    app = {};

if (mobileFound) {
    console.log('MOBILE');
    // add cordova when using a mobile device
    // libsToLoad.push('../cordova');
} else {
    // console.log('NOT MOBILE');
    //libsToLoad.push('//localhost:35729/livereload.js');
}

define(function(require) {
// require(libsToLoad, function($) {
    var $ = require('jquery'),
        _ = require('lodash');
    require('Fireable');
    require('menu');
    require('play');
    require('phaser');

    app.dims = {
        maxWidth: 600,
        maxHeight: 490
    };

    // getWindowSizes = function() {
    //   var windowHeight = 0, windowWidth = 0;
    //   if (typeof (window.innerWidth) == 'number') {
    //       windowHeight = window.innerHeight;
    //       windowWidth = window.innerWidth;

    //   } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //       windowHeight = document.documentElement.clientHeight;
    //       windowWidth = document.documentElement.clientWidth;

    //   } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //      windowHeight = document.body.clientHeight;
    //      windowWidth = document.body.clientWidth;
    //   }
    //   return [windowWidth, windowHeight];
    // };

    if (mobileFound) {
        // $(window).bind('resize', function () {
        var a = getWindowSizes();
        app.width = a[0];
        app.height = a[1];
        // }).trigger('resize');​​​
    } else {
        app.width = $(window).width() > app.dims.maxWidth ? app.dims.maxWidth : $(window).width();
        app.height = $(window).height() > app.dims.maxHeight ? app.dims.maxHeight : $(window).height();
    }

    // Initialize Phaser, and creates a 400x490px game
    game = new Phaser.Game(app.width, app.height, Phaser.AUTO, 'game_div');

    var loadState = {
        preload: function() {
            game.stage.backgroundColor = '#111';

            // game.load.atlas('atlas', 'img/atlas/images.png', 'img/atlas/images.json');

            // game.load.spritesheet('bug1walk', 'img/bug-1-sprite.png', 40, 41, 6);
            // game.load.spritesheet('sentry1deploy', 'img/turret-1-deploy-sprite.png', 16, 16, 9);
            // game.load.image('sentry1', 'img/turret-1.png');

            // game.load.audio('jump', 'assets/jump.wav');
        },
        create: function() {
            // When all assets are loaded, go to the 'menu' state
            game.state.start('menu');
        }
    };

    game.state.add('load', loadState);
    game.state.add('menu', menuState);
    game.state.add('play', playState);

    if (mobileFound) {
        document.addEventListener('deviceready', function() {
            game.state.start('load');
        }, false);
    } else {
        $(function() {
            game.state.start('load');
        });
    }

});