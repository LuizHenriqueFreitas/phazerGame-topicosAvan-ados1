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

        this.add.image(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'columns'
        ).setDepth(2);
        //
    }

    createGround(){
        const groundRect = this.add.rectangle(
            this.config.width / 2,
            this.config.height * 0.5 + 260,
            this.config.width,
            20,
            0x00ff00,
            0.25
        ).setVisible(false);

        this.physics.add.existing(groundRect, true);

        this.groud = groundRect;
    }

    createPlayer(){

    }

    registerPlayerAnimations(){
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 0,
                    end: 1
                }
            ),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 16,
                    end: 19
                }
            ),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player-duck',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 32,
                    end: 35
                }
            ),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'player-jump',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 40,
                    end: 47
                }
            ),
            frameRate: 4,
            repeat: 0
        });

        this.anims.create({
            key: 'player-attack',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 64,
                    end: 71
                }
            ),
            frameRate: 8,
            repeat: 0
        });
    }

    createEnemy(){
        this.enemy = this.add.sprite(
            this.config.width -200,
            this.config.height * 0.5 -55,
            'enemy'
        ).setScale(2);

        this.enemy.play('enemy_walk', true);
        this.enemy.body.setSize(90, 100);
        this.enemy.body.setOffset(100, 60);

        this.physics.add.collider(this.enemy, this.ground);
    }

    handleEnemyMovement() {
        this.enemy.setVelocityX(this.enemyDirection * this.enemySpeed);
        this.enemyDirection = this.enemy.x > this.player.x ? -1 : 1;

        if(this.enemyDirection === 1){
            this.enemy.setFlipX(true);
        }

        else {
            this.enemy.setFlipX(false);
        }
    }

    handleEnemyAttack() {
        const enemyIsAttacking = this.enemy.anims.currentAnim?.Key === 'enemy_attack';

        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.enemy.x, this.enemy.y,
            this.player.x, this.player.y
        );

        if (distanceToPlayer < this.distanceToAttack){
            if(!enemyIsAttacking){
                this.enemy.play('enemy_attack');
            }
            this.enemy.setVelocityX(0);
        }
        else {
            this.enemy.play('enemy_walk');
        }
    }

    regirsterEnemyAnimations() {
        this.anims.create({
            key: 'enemy-idle',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 0,
                    end: 5
                }
            ),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-walk',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 22,
                    end: 33
                }
            ),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-attack',
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
    }

    update() {
        const { left, right, up, donw, space } = this.cursorKeys;

        const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);

        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

        const PlayerOnFloor = this.player.body.onFloor;

        const currentPlayerAnim = this.player.anims.currentPlayerAnim?.key;

        const isPlayerPlaying = animKey => this.player.anims.isPlaying && currentPlayerAnim === animKey;

        if (left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setFlip(true);
        }

        else if (right.isDown){
            this.player.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
        }

        else{
            this.player.setVelocityX(0);
        }

        if(isUpJustDown && PlayerOnFloor){
            this.player.setVelocityX(-this.playerJumpForce);
        }

        if (donw.isDown && PlayerOnFloor){
            this.player.setVelocityX(0);
            if(currentPlayerAnim !== 'player_deuck'){
                this.player.play('player_duck');
            }
            return;
        }

        if (isSpaceJustDown && !isPlayerPlaying('player_attack')){
            this.player.play('player_attack');
            return;
        }

        if(isPlayerPlaying('player_attack')){
            return;
        }

        if(PlayerOnFloor){
            if(this.player.body.velocity.x !== 0){
                if(!isPlayerPlaying('player-walk')){
                    this.player.play('player-walk', true);
                }
            }
        }
        else {
            if(!isPlayerPlaying('player-idle')){
                this.player.play('player_idle', true);
            }
        }
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