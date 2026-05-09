import Phaser from "phaser";

export default class GameScene extends Phaser.Scene{
    constructor(config){
        super({key: 'GameScene'});

        this.config = config;
    }

    init(){
        //vazio
    }

    create(){
        this.createBackground();

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

        this.cursors = this.input.keyboard.createCursorKeys();

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

    setupTouchEvents(){
        this.input.on('pointerdown', (pointer) => {
            this.targetPosition.set(pointer.x, pointer.y);

            const xMark  = this.add.text(pointer.x, pointer.y, 'X', {
                font: '60px Arial',
                fill: '#ff0000',
            }).setOrigin(0,5);

            this.time.delayedCall(3000, () => xMark.destroy());
        });
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