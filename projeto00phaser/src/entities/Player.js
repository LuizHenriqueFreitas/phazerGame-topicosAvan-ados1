import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        super (scene, x, y, 'player');

        this.scene = scene;
        this.init();
    }

    init() {
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this);

        this.serImmovable(true);

        this.setCollideWorldBounds(true);

        this.body.allowGravity = false;
    }

    update(){

    }
}