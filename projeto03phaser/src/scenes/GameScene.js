import Phaser from "phaser";

export default class GameScene extends Phaser.Scene{
    constructor(config){
        super({key: 'GameScene'});

        this.config = config;
    }

    init(){
        this.player = null;
    }

    create(){
        this.createBackground();

        this.createPlayer();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.mouse.disableContextMenu();

        this.setupTouchEvents();
    }

    update(time, delta){
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

    setupTouchEvents(){
        this.input.on('pointerdown', (pointer) => {
            
        })

        this.player.setPosition(pointer.x, pointer.y);

        this.input.on('pointerup', (pointer) => {
            
        })

        this.input.on('pointermove', (pointer) => {
            if(pointer.isDown){

            }
        })
    }
}