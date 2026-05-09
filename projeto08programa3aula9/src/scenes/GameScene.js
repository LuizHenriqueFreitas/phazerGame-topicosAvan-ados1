import Phaser from "phaser";

export default class GameScene extends Phaser.Scene{
    constructor(config){
        super({key: 'GameScene'}, config);

        this.config = config;
    }

    init(){
        this.gravity = 500;

        this.distanceToAttack = 250;

        this.player = null;
        this.playerSpeed = 200;
        this.playerJumpForce = 520;

        this.enemy = null;
        this.enemySpeed = 80;
    }

    create(){
        this.createBackground();

        this.createPlayer()
        this.createEnemy()

        const centerX = this.cameras.main.width /2;
        const centerY = this.cameras.main.height /2;

        this.add.text(
            centerX,
            centerY - 200,
            'Animation by Spritesheet',
            {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.enemy.body.setGravityY(this.gravity);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.enemy.on ('animationstart', (anim) => {
            if (anim.key === 'enemy_attack') {
                this.enemy.body.setSize(160, 100);
                const offsetX = this.enemy.flipX ? 85 : 40;
                this.enemy.body.setOffset(offsetX, 60);
            }
        });

        this.enemy.on ('animationstart', (anim) => {
            if (anim.key === 'enemy_walk') {
                this.enemy.body.setSize(90, 100);
                this.enemy.body.setOffset(100, -60);
            }
        });

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.mouse.disableContextMenu();

        this.setupTouchEvents();
    }

    update(time, delta){
        this.playerManager()
    }

    createBackground(){
        this.add.image(
            this.config.width* 0.5,
            this.config.height*0.5,
            'background'
        );

        //
    }

    createEnemy(){
        this.enemy = this.add.sprite(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'enemy'
        ).setScale(2);

        this.anims.create({
            key: 'cleave',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 44,
                    end: 58
                }
            ),
            frameRate: 8,
            repeat: -1
        });

        this.enemy.play('cleave')
    }

    update() {
        const { left, right, up, donw, space } = this.cursorKeys;

        const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);

        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

        const PlayerOnFloor = this.player.body.onFloor;

        const currentPlayerAnim = this.player.anims.currentPlayerAnim?.key;

        const isPlayerPlaying = animKey => this.player.anims.isPlaying && currentPlayerAnim === animKey;
    }

    playerManager(){
        this.player.y += Math.cos((time/1000) *2) * 5;

        const distancia = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.targetPosition.x,
            this.targetPosition.y
        )

        if(distancia > this.minDistance) {
            const angle = Phaser.Math.Angle.Between(
                this.player.x,
                this.player.y,
                this.targetPosition.x,
                this.targetPosition.y
            );

            this.player.rotation = Phaser.Math.Angle.RotateTo(
            this.player.rotation,
            angle + Phaser.Math.DegToRad(-90),
            0.03
            );
            const moveAngle = this.player.rotation - Phaser.Math.Angle.RotateTo(-90);

            const velocity = this.physics.velocityFromRotation(
                moveAngle,
                this.playerSpeed,
                this.player.body.velocity
            );

        }

        else{
            this.player.body.setVelocity(0,0);
        }
    }
}