/*global game, app */
'use strict';

var menuState = {
    create: function() {
        app.version = '0.2.0';

        // Call the 'start' function when pressing the spacebar
        // var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // space_key.onDown.add(this.start, this);
        game.input.onTap.add(this.start, this);

        var text = this.game.add.text(game.world.centerX, 90, 'GRAVtoo - Bar version', {
            font: '40px Arial',
            fill: '#999',
            'strokeThickness': 2
        });
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        text.anchor.setTo(0.5, 0.5);

        text = this.game.add.text(game.world.centerX, game.world.centerY,
            '- Arrow keys and space -', {
            font: '30px Arial',
            fill: '#333'
        });
        text.anchor.setTo(0.5, 0.5);

        text = this.game.add.text(game.world.centerX, game.world.centerY - 20,
            'v' + app.version, {
            font: '12px Arial',
            fill: '#333'
        });
        text.anchor.setTo(0.5, 0.5);

        // If the user already played
        if (app.score > 0) {
            // Display its score
            var scoreLabel = this.game.add.text(game.world.centerX, game.world.centerY + 50,
                'Final score: ' + app.score.toString(), {
                font: '12px Arial',
                fill: '#ccc'
            });
            scoreLabel.anchor.setTo(0.5, 0.5);
        }
    },

    // Start the actual game
    start: function() {
        this.game.state.start('play');
    }
};