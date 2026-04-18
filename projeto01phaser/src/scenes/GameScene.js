import Phaser from "phaser";

export default class GameScene extends Phaser.Scene{
    constructor(config){
        super({key: 'GameScene'});

        this.config = config;
    }

    init(){
        this.cursors = null;
        this.spaceKey = null;
        this.player = null;
        this.playerSpeed = 80;
    }

    create(){
        this.createBackground();

        this.createPlayer();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta){
        this.movePlayerManager();
    }

    createBackground(){
        this.add.image(
            this.config.width* 0.5,
            this.config.height*0.5,
            'background'
        );

        //
    }

    createPlayer(){
        this.player = this.physics.add.sprite(this.config.width * 0.5, 300, "player");

        //this.player = this.physics.add.sprite(this.config.width * 0.5, 300, "player");
        //this.player.setCollideWorldBounds(true);
    }

    movePlayerManager(){
        this.player.setVelocity(0);

        if(this.cursors.left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
        }

        else if(this.cursors.right.isDown){
            this.player.setVelocityX(this.playerSpeed);
        }

        if(this.cursors.up.isDown){
            this.player.setVelocityY(-this.playerSpeed);
        }

        else if(this.cursors.down.isDown){
            this.player.setVelocityY(this.playerSpeed);
        }

        if (this.spaceKey.isDown){
            console.log('Tiro continuo!');
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            console.log('barra de espaco pressionad!');
        }
    }
}