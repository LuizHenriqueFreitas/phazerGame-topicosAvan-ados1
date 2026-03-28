import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor(){
        super({key: 'PreloadScene'});
    }

    preload(){
        this.displayProgressBar();

        this.load.image('cenario', 'assets/imagens/background.png');
        this.load.image('player', 'assets/imagens/garota.png');
    }

    create(){
        this.scene.start('GameScene');
    }

    displayProgressBar() {
        const {width, height} = this.cameras.main;

        const progressBarBg = this.add.graphics();
        progressBarBg.fillStyle(0x222222, 0.8);
        progressBarBg.fillRect(width / 4-2, height /2 -12, width /2 + 4, 24);

        const progressBar = this.add.graphics();
        const loadingText = this.add.text(
            widht /2,
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
            progressBar.fillRect(widht / 4, height / 2 -10, (widht /2) * value, 20);
        });


        this.load.on('complete', () => {
            progressBar.destroy();
            progressBarBg.destroy();
            loadingText.destroy();
        })
    }
}