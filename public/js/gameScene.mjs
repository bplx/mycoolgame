export class Game extends Phaser.Scene {
    constructor() {
        // I don't know what this does but errors told me to!
        super("GameScene");
    }

    preload() {
        this.load.image("bg", "img/bg.png");
        this.load.image("player1Sprite", "img/player.png");
        this.load.image("puckSprite", "img/ball.png");
        this.load.image("player2Goal", "img/p2goal.png");
        this.load.image("player1Goal", "img/p1goal.png");
        this.load.image("posts", "img/posts.png");
        this.load.image("post", "img/post.png");
    }

    create() {
        // Reset
        this.resetHard = function () {
            this.registry.destroy(); // destroy registry
            this.events.off(); // disable all active events
            this.scene.restart(); // restart current scene
        };
        // Create the background.
        this.add.image(0, 0, "bg").setOrigin(0, 0);

        this.paused = false;

        // Create our way to read the cursor keys.
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create the player 1.
        this.player1 = {
            obj: this.physics.add
                .sprite(600, 300, "player1Sprite")
                .setCollideWorldBounds(true)
                .setDamping(true)
                .setDrag(0.1),
            speed: 300,
            hasPuck: false,
            dir: "none",
            kbd: {
                shoot: this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.PERIOD,
                ),
            },
            text: this.add.text(20, 50, "P1", { color: "#000" }),
            score: 0,
        };
        this.player1.obj.body.setMaxVelocity(this.player1.speed);

        // Create the player 2.
        this.player2 = {
            obj: this.physics.add
                .sprite(200, 300, "player1Sprite")
                .setCollideWorldBounds(true)
                .setDamping(true)
                .setDrag(0.1),
            speed: 300,
            hasPuck: false,
            dir: "none",
            kbd: {
                shoot: this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.SHIFT,
                ),
                up: this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.W,
                ),
                left: this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.A,
                ),
                down: this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.S,
                ),
                right: this.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.D,
                ),
            },
            text: this.add.text(20, 50, "P2", { color: "#000" }),
            score: 0,
        };
        this.player2.obj.body.setMaxVelocity(this.player2.speed);

        // Create the bal- i mean PUCK i mean PUCK.
        this.puck = this.physics.add
            .sprite(400, 300, "puckSprite")
            .setCollideWorldBounds(true)
            .setDamping(true)
            .setDrag(0.9)
            .setBounce(1, 1);

        // Goals and posts..
        this.posts = this.physics.add.staticGroup();
        this.p1posts = {
            top: this.posts.create(645, 210, "post").setScale(3),
            bot: this.posts.create(645, 390, "post").setScale(3),
        };
        this.p1posts.top.flipX = true;
        this.p1posts.bot.flipY = true;
        this.p1posts.bot.flipX = true;
        this.p2posts = {
            top: this.posts.create(155, 210, "post").setScale(3),
            bot: this.posts.create(155, 390, "post").setScale(3),
        };
        this.p2posts.bot.flipY = true;

        //this.p1posts.obj.body.immovable = true;
        //this.p2posts.body.immovable = true;

        this.p1goal = this.physics.add
            .sprite(700, 300, "player1Goal")
            .setScale(3);
        this.p1goal.body.immovable = true;
        this.p2goal = this.physics.add
            .sprite(100, 300, "player2Goal")
            .setScale(3);
        this.p2goal.body.immovable = true;

        // Goal text!
        this.goalText = this.add
            .text(400, 300, "GOAL!!!", { color: "#000" })
            .setScale(2);
        this.goalText.visible = false;

        // Player1 collisions.
        this.physics.add.collider(this.player1.obj, this.puck, () => {
            if (!this.player2.hasPuck) {
                this.player1.hasPuck = true;
            } else if (this.player2.hasPuck) {
                this.player2.hasPuck = false;
                this.player1.hasPuck = true;
            }
        });
        this.physics.add.collider(this.player1.obj, this.player2.obj, () => {
            if (this.player2.hasPuck) {
                this.player2.hasPuck = false;
                this.player1.hasPuck = true;
            }
            if (this.player1.hasPuck) {
                this.player1.hasPuck = false;
                this.player2.hasPuck = true;
            }
        });

        // Reset func.
        this.reset = function () {
            this.player1.obj.x = 600;
            this.player1.obj.y = 300;
            this.player2.obj.x = 200;
            this.player2.obj.y = 300;

            this.player1.hasPuck = false;
            this.player2.hasPuck = false;

            this.puck.x = 400;
            this.puck.y = 300;
        };

        // Player2 collisions.
        this.physics.add.collider(this.player2.obj, this.puck, () => {
            if (!this.player1.hasPuck) {
                this.player2.hasPuck = true;
            } else if (this.player1.hasPuck) {
                this.player1.hasPuck = false;
                this.player1.hasPuck = true;
            }
        });

        // Goal collisions.
        this.physics.add.collider(this.puck, this.p1goal, () => {
            if (
                !this.player2.hasPuck &&
                !this.player1.hasPuck &&
                this.puck.body.touching.right
            ) {
                console.log("p2 SCORES!!!!!!!!!!!!!!!!!!!!!!");

                this.goalText.setText("P2 GOAL!!!");
                this.player2.score += 1;
                this.goalText.visible = true;
                this.goalHappening = true;

                this.player1.obj.setAcceleration(0);
                this.player2.obj.setAcceleration(0);
                this.player1.obj.setVelocity(0);
                this.player2.obj.setVelocity(0);

                this.puck.setVelocity(0);
                this.puck.setAcceleration(0);

                function reset() {
                    this.player1.x = 600;
                    this.player1.y = 300;
                    this.player2.x = 200;
                    this.player2.y = 300;

                    this.puck.x = 400;
                    this.puck.y = 300;
                }
            }
        });

        this.physics.add.collider(this.puck, this.p2goal, () => {
            if (
                !this.player2.hasPuck &&
                !this.player1.hasPuck &&
                this.puck.body.touching.left
            ) {
                console.log("p1 SCORES!!!!!!!!!!!!!!!!!!!!!!");

                this.goalText.setText("P1 GOAL!!!");
                this.player1.score += 1;
                this.goalText.visible = true;
                this.goalHappening = true;

                this.player1.obj.setAcceleration(0);
                this.player2.obj.setAcceleration(0);
                this.player1.obj.setVelocity(0);
                this.player2.obj.setVelocity(0);

                this.puck.setVelocity(0);
                this.puck.setAcceleration(0);
            }
        });

        // Posts
        this.physics.add.collider(this.puck, this.posts);

        // Player-goal collision
        this.physics.add.collider(this.p1goal, this.player1);
        this.physics.add.collider(this.p2goal, this.player1);

        this.physics.add.collider(this.p1goal, this.player2);
        this.physics.add.collider(this.p2goal, this.player2);

        // Score displays

        this.scoreP2 = this.add
            .text(0, 600, this.player2.score, {
                color: "#000",
            })
            .setScale(3)
            .setOrigin(0, 1);

        this.scoreP1 = this.add
            .text(800, 600, this.player1.score, { rtl: true, color: "#000" })
            .setOrigin(1, 1)
            .setScale(3);

        // Stuff for pausing

        // Pausing mask
        this.pmask = this.add.rectangle(0, 0, 800 * 2, 600 * 2, 0x000000);
        this.pmask.alpha = 0;
        this.pmask.setDepth(9998);

        // Create some pause buttons!
        this.resetButton = this.add
            .text(100, 100, "Reset the game", { fill: "#0f0" })
            .setInteractive()
            .on("pointerover", () =>
                this.resetButton.setStyle({ fill: "#ff0" }),
            )
            .on("pointerout", () => this.resetButton.setStyle({ fill: "#0f0" }))
            .on("pointerdown", () => {
                if (this.paused) this.resetHard();
                console.log(
                    "Restarting game!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1",
                );
            });
        this.resetButton.setDepth(9999);
    }

    update() {
        // Pause items.
        this.resetButton.visible = false;
        if (this.paused) {
            this.resetButton.visible = true;
        }
        // Pause key.
        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.P,
        );

        this.previousVelocityP1;
        this.previousAccelerationP1;
        this.previousVelocityP2;
        this.previousAccelerationP2;
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            if (this.paused) {
                console.log("Unpausing");
                this.physics.resume();
                this.paused = false;
            } else {
                console.log("Pausing");
                this.physics.pause();
                this.paused = true;
            }
        }

        // Update score displays.
        this.scoreP1.text = this.player1.score;
        this.scoreP2.text = this.player2.score;

        if (this.paused) {
            this.pmask.alpha = 0.5;
        }
        if (!this.paused) {
            this.pmask.alpha = 0;
            if (!this.goalHappening) {
                // Input for Player 1.
                if (this.cursors.left.isDown) {
                    this.player1.obj.setAccelerationX(-this.player1.speed);
                } else if (this.cursors.right.isDown) {
                    this.player1.obj.setAccelerationX(this.player1.speed);
                } else {
                    this.player1.obj.setAccelerationX(0);
                }
                if (this.cursors.up.isDown) {
                    this.player1.obj.setAccelerationY(-this.player1.speed);
                } else if (this.cursors.down.isDown) {
                    this.player1.obj.setAccelerationY(this.player1.speed);
                } else {
                    this.player1.obj.setAccelerationY(0);
                }
                if (this.player1.kbd.shoot.isDown) {
                    if (this.player1.hasPuck) {
                        this.player1.hasPuck = false;
                        console.log(
                            this.physics.velocityFromRotation(
                                this.player1.obj.body.angle * (180 / Math.PI),
                                600,
                            ),
                        );
                        this.puck.setVelocity(
                            this.physics.velocityFromRotation(
                                this.player1.obj.body.angle,
                                600,
                            ).x,
                            this.physics.velocityFromRotation(
                                this.player1.obj.body.angle,
                                600,
                            ).y,
                        );
                        console.log("P1 shot puck!");
                    }
                }

                // Input for Player 2.
                if (this.player2.kbd.left.isDown) {
                    this.player2.obj.setAccelerationX(-this.player2.speed);
                } else if (this.player2.kbd.right.isDown) {
                    this.player2.obj.setAccelerationX(this.player2.speed);
                } else {
                    this.player2.obj.setAccelerationX(0);
                }
                if (this.player2.kbd.up.isDown) {
                    this.player2.obj.setAccelerationY(-this.player2.speed);
                } else if (this.player2.kbd.down.isDown) {
                    this.player2.obj.setAccelerationY(this.player2.speed);
                } else {
                    this.player2.obj.setAccelerationY(0);
                }
                if (this.player2.kbd.shoot.isDown) {
                    if (this.player2.hasPuck) {
                        this.player2.hasPuck = false;
                        console.log(
                            this.physics.velocityFromRotation(
                                this.player2.obj.body.angle * (180 / Math.PI),
                                600,
                            ),
                        );
                        this.puck.setVelocity(
                            this.physics.velocityFromRotation(
                                this.player2.obj.body.angle,
                                600,
                            ).x,
                            this.physics.velocityFromRotation(
                                this.player2.obj.body.angle,
                                600,
                            ).y,
                        );
                        console.log("P2 shot puck!");
                    }
                }
            }

            this.restartKey = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.G,
            );

            if (this.restartKey.isDown) {
                console.log("bean!");
                if (this.goalHappening) {
                    this.reset();
                    this.goalHappening = false;
                    this.goalText.visible = false;
                }
            }

            // Puck logic.
            if (this.player1.hasPuck) {
                this.puck.x = this.player1.obj.x;
                this.puck.y = this.player1.obj.y;
                this.puck.setVelocity(0, 0);
                this.puck.setAcceleration(0, 0);
            }

            if (this.player2.hasPuck) {
                this.puck.x = this.player2.obj.x;
                this.puck.y = this.player2.obj.y;
                this.puck.setVelocity(0, 0);
                this.puck.setAcceleration(0, 0);
            }

            // Text.
            this.player1.text.x = this.player1.obj.x;
            this.player1.text.y = this.player1.obj.y - 40;
            this.player2.text.x = this.player2.obj.x;
            this.player2.text.y = this.player2.obj.y - 40;
        }
    }
}
