/*global app, game, Phaser, Fireable */
'use strict';

var playState = {

    // now done in loader state
    preload: function() {
        game.load.image('stars', 'images/bigstarfield.png');
        // game.load.image('stars', 'images/tinystarfield.jpg');
        game.load.image('ship', 'images/ship.png');
    },

    // Fuction called after 'preload' to setup the game
    create: function() {
        this.settings = {
            paused: false,
        };

        app.level = 1;
        app.score = 0;

        game.world.setBounds(0, 0, 300, 300);

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.defaultRestitution = 0.8;
        game.physics.p2.gravity.y = 170;

        //  Turn on impact events for the world, without this we get no collision callbacks
        // game.physics.p2.setImpactEvents(true);

        this.starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');
        this.starfield.fixedToCamera = true;

        this.ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
        this.ship.scale.x = 0.4;
        this.ship.scale.y = 0.4;
        this.ship.fuel = 1000;
        this.ship.shield = 300;      // 300 / 3 / 60 = sheild time
        this.ship.shieldMax = 300;   // top upto
        this.ship.shielded = false;  // shield state off
        this.ship.shieldCooldown = 0;// cooldown after sheild has been maxed out
        this.ship.anchor.setTo(0.5, 0.5);

        game.physics.p2.enable(this.ship);

        // create a  pointer for the bullet target
        this.ingredients = [];
        this.ingredients[0] = game.add.sprite(150, 150, 'fake');
        this.ingredients[0].anchor.setTo(0.5, 0.5);
        game.physics.p2.enable(this.ingredients[0]);

        this.ingredients[1] = game.add.sprite(50, 150, 'fake');
        this.ingredients[1].anchor.setTo(0.5, 0.5);
        game.physics.p2.enable(this.ingredients[1]);

        // game.physics.enable(this.ingredients[0], Phaser.Physics.ARCADE);
        // this.ingredients[0].enableBody = true;
//     this.shipo.exists = false;
//     this.shipo.visible = false;

        // game.camera.follow(this.ship);

        // this.ship.fireable = new Fireable(this.ship);
        this.ship.body.onBeginContact.add(this.blockHit, this);
        // and control cursors
        this.cursors = game.input.keyboard.createCursorKeys();

        // add fire key
        // game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(this.fire, this);
        this.settings.tracking = false;
    },

    fire: function() {
        // console.log('firing;');
        this.ship.fireable.fire();
    },

    dead: function() {
        // Remove all timers
        // game.time.events.remove(this.settings.pipeTimer);

        this.settings.paused = true;

        this.scoreLabel = game.add.text(game.world.centerX-60, game.world.centerY,
           'Smoked', { font: '30px Arial', fill: '#ffffff' }
        );

        this.ship.body.rotation = 1;

        game.input.onDown.add(function(){
            // console.log('tapped');
            game.state.start('menu');
        }, this);

        // game.state.start('menu');
    },

    blockHit: function(guy) {
        // console.log('hit');
        // if not currently tracking a block
        if (!this.settings.tracking) {
            this.moveable = guy.sprite;
            game.time.events.add(Phaser.Timer.SECOND * 4, function() {
                // console.log('tractor disabled');
                this.moveable = false;
                this.settings.tracking = false;
            }, this);
        }
    },

    // when the tractor is on
    tractor: function() {
        // console.log('trying tractor');

        if (this.moveable) {
            this.settings.tracking = true;
            // console.log('tractor on');
            this.moveable.body.x = this.ship.x;
            this.moveable.body.y = this.ship.y + 20;
        }
        // this.shipo.rotation = this.ship.rotation;
    },

    // This function is called 60 times per second
    update: function() {
        if (!this.settings.paused) {
            if (this.cursors.left.isDown) {
                this.ship.body.rotateLeft(100);
            } else if (this.cursors.right.isDown) {
                this.ship.body.rotateRight(100);
            } else {
                this.ship.body.setZeroRotation();
            }

            if (this.cursors.up.isDown) {
                this.ship.body.thrust(480);
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
                // this.fire();
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
                this.ship.shield > 0 &&        // if we have shield
                this.ship.shieldCooldown === 0 // if it is not on cooldown
            ) {
                this.ship.shielded = true;
                --this.ship.shield;

                this.tractor();

                if (this.ship.shield === 0) { // if we have hit 0, then we need to cool off the sheild
                    this.ship.shieldCooldown = 120;
                }
            } else { // if shield is not pressed
                if(this.ship.shieldCooldown > 0) {
                    --this.ship.shieldCooldown;
                } else if (this.ship.shield < this.ship.shieldMax) { // when cooldown is finished, then start to build sheild again
                    this.ship.shield += 0.5;
                }

                this.ship.shielded = false;
            }

            if (0 === --this.ship.fuel) {
                this.dead();
            }

        }

        if (!game.camera.atLimit.x) {
            this.starfield.tilePosition.x += (this.ship.body.velocity.x * 16) * game.time.physicsElapsed;
        }

        if (!game.camera.atLimit.y) {
            this.starfield.tilePosition.y += (this.ship.body.velocity.y * 16) * game.time.physicsElapsed;
        }
    },

    render: function() {
        game.debug.text('Fuel: ' + this.ship.fuel, 32, 30);
        // game.debug.text('Shield: ' + Math.floor(this.ship.shield / 3), 32, 45);
        game.debug.text('Shield on: ' + this.ship.shielded, 32, 60);
        // game.debug.text('Shield CD: ' + this.ship.shieldCooldown, 32, 75);
    }
};