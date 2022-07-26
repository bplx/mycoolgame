export class Game extends Phaser.Game {
    constructor() {
        // I don't know what this does but errors told me to!
        super("GameScene");
    }

    init() {
        this.cursors;
        this.player1;
        this.player1Goal;
        this.player2;
        this.player2Goal;
        this.puck;
        this.goalHappening = false;
        this.goalText;
        var player1,
            player1Goal,
            player2,
            player2Goal,
            cursors,
            puck,
            goalHappening,
            goalText;
    }

    preload() {
        this.load.image("bg", "img/bg.png");
        this.load.image("player1Sprite", "img/player.png");
        this.load.image("puckSprite", "img/ball.png");
        this.load.image("player2Goal", "img/p2goal.png");
        this.load.image("player1Goal", "img/p1goal.png");
    }

    create() {
        // Create the background.
        this.add.image(0, 0, "bg").setOrigin(0, 0);

        // Create our way to read the keys.
        // kbd = Phaser.Input.Keyboard.KeyboardPlugin()

        // Create our way to read the cursor keys.
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create the player 1.
        this.player1 = {
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
                .sprite(600, 300, "player1Sprite")
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

        // Goals.
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
            if (!this.player2.hasPuck && !this.player1.hasPuck) {
                console.log("p2 SCORES!!!!!!!!!!!!!!!!!!!!!!");

                this.goalText.setText("P2 GOAL!!!");
                this.goalText.visible = true;
                this.goalHappening = true;

                this.player1.obj.setAcceleration(0);
                this.player2.obj.setAcceleration(0);
                this.player1.obj.setVelocity(0);
                this.player2.obj.setVelocity(0);

                this.puck.setVelocity(0);
                this.puck.setAcceleration(0);

                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        this.player1.x = 200;
                        this.player1.y = 300;
                        this.player2.x = 600;
                        this.player2.y = 300;
                    },
                });
            }
        });
    }

    update() {
        // Input block.
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
