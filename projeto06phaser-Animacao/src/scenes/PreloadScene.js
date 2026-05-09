import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor(config){
        super({key: 'GameScene'}, config);

        this.config = config;
    }

    preload(){
        this.displayProgressBar();

        this.load.image('background', 'assets/images/background.png');

        this.load.image('enemy_idle_1', 'assets/images/enemy/idle_1.png');
        this.load.image('enemy_idle_2', 'assets/images/enemy/idle_2.png');
        this.load.image('enemy_idle_3', 'assets/images/enemy/idle_3.png');
        this.load.image('enemy_idle_4', 'assets/images/enemy/idle_4.png');
        this.load.image('enemy_idle_5', 'assets/images/enemy/idle_5.png');
    }

    init() {
        this.cursors = null;

        this.player = null;
        this.playerSpeed = 50;

        this.cheese = null;
        this.cheeseCollected = 0;
        this.TOTAL_CHEESE = 5;

        this.score = 0;
        this.scoreText = null;
    }

    create(){
        this.createBackground();
        this.createPlayer();
        this.createCheese();
        this.add.image(
            0,
            this.config.height -241,
            'fence'
        ).setOrigin(0).setDepth(10);

        this.scoreText =this.add.text (
            10,
            10,
            'QUEIJOS: 0',
            {
                fontSize: '32px',
                fill: '#ffffff'
            }
        ).setShadow( 1, 1, '#000000', 3);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createPlayer(){
        this.player = this.physics.add.sprite(
            this.config.width * 0.5,
            300,
            'player'
        );
        this.player.setCollideWorldBounds(true);

        const newWidht = this.player.width * 0.85;
        const newHeight = this.player.height * 0.5;

        this.player.body.setSize(newWidht, newHeight);

        const offsetX = (this.player.width - newWidht) / 2;
        const offsetY = (this.player.height - newHeight) / 2;
        
        this.player.body.setOffset(offsetX, offsetY + 30);
    }

    movePlayerManager(){
        this.player.setVelocity(0);

        if(this.cursors.left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
            this.player.flipX = true;
        }
        
        if(this.cursors.right.isDown){
            this.player.setVelocityX(this.playerSpeed);
            this.player.flipX = false;
        }

        if(this.cursors.up.isDown){
            this.player.setVelocityY(-this.playerSpeed);
        }

        if(this.cursors.down.isDown){
            this.player.setVelocityY(this.playerSpeed);
        }
    }

    createCheese() {
        if (this.cheese) {
            this.cheese.destroy();
        }

        const randomCheeseType = Phaser.Math.Between(1, this.TOTAL_CHEESE);
        const cheeseKey = 'cheese' + randomCheeseType;

        const x = Phaser.Math.Between(
            60,
            this.config.width - 60
        );

        const y = Phaser.Math.Between(
            150,
            this.config.height - 40,
        );

        //
        const offsetX = (this.cheese.width - newWidht) / 2;
        const offsetY = (this.cheese.height - newHeight) / 2;

        this.physics.add.overlap(
            this.player,
            this.cheese,
            this.collectCheese,
            null,
            this
        );

        this.time.delayedCall(
            3000,
            this.createCheese,
            [],
            this
        );
    }

    collectCheese(player, cheeseToColletc){
        this.cheeseCollected++;
        this.scoreText.setText('QUEIJOS: ' + this.cheeseCollected);
        cheeseToColletc.disableBody(true, true);
    }



    displayProgressBar() {
        const {width, height} = this.cameras.main;

        const progressBarBg = this.add.graphics();
        progressBarBg.fillStyle(0x222222, 0.8);
        progressBarBg.fillRect(width / 4-2, height /2 -12, width /2 + 4, 24);

        const progressBar = this.add.graphics();
        const loadingText = this.add.text(
            width /2,
            height /2 -30,
            'Loading...',
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4, height / 2 -10, (width /2) * value, 20);
        });


        this.load.on('complete', () => {
            progressBar.destroy();
            progressBarBg.destroy();
            loadingText.destroy();
        })
    }
}