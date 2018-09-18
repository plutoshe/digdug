import { LevelBackground } from "../sprites/levelBackground.js"
import { Player } from "../sprites/player.js"
import {collisionHandlers} from "../collisionHandlers.js"
import { Enemy } from "../enemy.js"
import { Lava } from "../lava.js"

export var levelScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
    function levelScene()
    {
        Phaser.Scene.call(this, { key: 'levelScene' });
    },
    preload: preload,
    create: create,
    update: update,
});

let blockTextures = {
    0 : {
        group: "empty",
        texture: "empty",
        createFunction: function(v) {
            return true;
        }
    },
    1 : {
        group: "full",
        texture: "full_default",
        createFunction: function(v) {
            if (v.group == "rock" || v.group == "full") {
                if (v.group == "full" && v.texture != "full_default") {
                    return false;
                }
                return true;
            }
            else return false;
        }
    },
    2 : {
        group: "full_red",
        texture: "lava",//full_red
        createFunction: function(v) {
            if (v.texture == "lava") 
                return true;
            else return false;
        }
    },
    3 : {
        group: "full",
        texture: "full_orange",
        createFunction: function(v) {
            if (v.texture == "full_orange") 
                return true;
            else return false;
        }
    },
    4 : {
        group: "full",
        texture: "full_pink",
        createFunction: function(v) {
            if (v.texture == "full_pink") 
                return true;
            else return false;
        }
    },
}

let entityTextures = [
    {
        group: "rock",
        texture: "rock_static",
        backgroundBlockGroup: "full",
        pos: [[2, 2], [3, 2], [2, 3], [4,2]],
    },
    {
        group: "knight",
        texture: "knight",
        backgroundBlockGroup: "empty",
        pos: [[10, 8]],
    },
]


let backgroundConfig = { 
    leftTopX: 0, 
    leftTopY: 0,  
    displayBlockWidth: 14, 
    displayBlockHeight: 18, 
    blockWidth: 14,
    blockHeight: 24,
    levelMap:  [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,1,1,0,1,1,1],
        [1,1,3,3,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,3,1,1,0,1,1,1],
        [1,1,0,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,2,2,1,0,0,0,0,1,1,1],
        [1,1,4,4,1,1,1,0,0,0,0,1,1,1],
        [1,1,4,1,1,2,1,1,1,1,0,1,1,1],
        [1,1,4,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1]],

}

let playerConfig = {
    x: 0,
    y: 5,
    playerTexture: 'star',
    cameraBoundry: 2,
}

function preload ()
{
    this.load.image('star', 'assets/star.png');
    this.load.image('full_default', 'assets/full.png');
    this.load.image('full_orange', 'assets/FullTile_7.png');
    this.load.image('full_red', 'assets/FullTile_2.png');
    this.load.image('full_pink', 'assets/FullTile_3.png');
    this.load.image('lava', 'assets/MagmaTiled.png');
    this.load.image('empty', 'assets/empty.png');
    this.load.image("knight", "assets/bomb.png")
    this.load.image("rock_static", "assets/rock_static.png")
    this.load.spritesheet('rock_shaking', 'assets/rock_shaking.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('rock_broken', 'assets/rock_broken.png', { frameWidth: 64, frameHeight: 64 });

    this.background = new LevelBackground();
    this.player = new Player();
    this.enemy = new Enemy();
}



function create ()
{
    this.anims.create({
        key: 'rock_shaking',
        // frames: [ { key: 'rock_shaking'} ],
        frames: this.anims.generateFrameNumbers('rock_shaking'),
        frameRate: 10,
        repeat: 1,
        // OnComplete: this.background.rockShakingDone,
    });

    this.anims.create({
        key: 'rock_broken',
        // frames: [ { key: 'rock_shaking'} ],
        frames: this.anims.generateFrameNumbers('rock_broken'),
        frameRate: 10,
        hideOnComplete: true,
        // OnComplete: this.background.rockShakingDone,
    });
    this.cameras.main.setBounds(
        0,
        0, 
        this.game.config.width,
        this.game.config.height / backgroundConfig.displayBlockHeight * backgroundConfig.blockHeight);
    // background config
    backgroundConfig.width = this.game.config.width, 
    backgroundConfig.height = this.game.config.height,
    backgroundConfig.blockTextures = blockTextures;
    backgroundConfig.entityTextures = entityTextures;
    backgroundConfig.scene = this;
    

    backgroundConfig.levelMap = backgroundConfig.levelMap[0].map(
        (col, i) => backgroundConfig.levelMap.map(row => row[i]));
    this.background.create(backgroundConfig);

    this.backgroundCellWidth = this.background.blockTextureWidth;
    this.backgroundCellHeight = this.background.blockTextureHeight;
    // player config
    playerConfig.backgroundCellWidth = this.background.blockTextureWidth;
    playerConfig.backgroundCellHeight = this.background.blockTextureHeight;

    playerConfig.scene = this;
    this.player.create(playerConfig);    
    if (this.background.blocks["full"][this.player.bx][this.player.by])
        this.background.blocks["full"][this.player.bx][this.player.by].destroy();

    // enemy config
     let enemyConfig = {
        scene: this,
        x: 9,
        y: 7,
        playerTexture: 'star',
        backgroundCellWidth: this.background.blockTextureWidth,
        backgroundCellHeight: this.background.blockTextureHeight,
        speed: 50
    }   
    this.enemy.create(enemyConfig); 
    
    // key binding setting
    this.cursors = this.input.keyboard.addKeys({
        "up": Phaser.Input.Keyboard.KeyCodes.UP,
        "down": Phaser.Input.Keyboard.KeyCodes.DOWN,
        "left": Phaser.Input.Keyboard.KeyCodes.LEFT,
        "right": Phaser.Input.Keyboard.KeyCodes.RIGHT,
        "space": Phaser.Input.Keyboard.KeyCodes.SPACE});

    // conllision setting
    // console.log(collisionHandlers["collision"]["player"]["rock"]);

    this.physics.add.overlap(
        this.player.sprite,
        this.background.blockGroups["knight"],
        collisionHandlers["overlap"]["player"]["knight"]);


    this.physics.add.overlap(
        this.player.sprite,
        this.background.blockGroups["rock"],
        collisionHandlers["collision"]["player"]["rock"]);

    this.physics.add.overlap(
        this.enemy.sprite,
        this.background.blockGroups["rock"],
        collisionHandlers["collision"]["enemy"]["rock"]);
    

    // initialization
    this.background.initialization();
    
    this.player.initialization();    
}


function update (){
    this.background.update();
    this.player.update();
    this.enemy.update();
}