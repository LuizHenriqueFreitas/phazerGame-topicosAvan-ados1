import Phaser from 'phaser'

import PreloadScene from "./scenes/PreloadScene"
import GameScene from "./scenes/GameScene"

const WIDTH = 1000;
const HEIGHT = 700;


const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    debug: true
}

const SCENES = [
    PreloadScene,
    GameScene
]

const createScene = Scene => new Scene(SHARED_CONFIG);

const initScenes = () => SCENES.map(createScene);

const config = {
    type: Phaser.AUTO,
        SHARED_CONFIG,
    backgroundColor: '#0080ff',
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: SHARED_CONFIG['debug'],
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: initScenes()
};

new Phaser.Game(config);