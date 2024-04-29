import { Component } from "@angular/core";
import Phaser from "phaser";

@Component({
    selector: "app-hero-section",
    standalone: true,
    imports: [],
    templateUrl: "./hero-section.component.html",
    styleUrl: "./hero-section.component.css",
})
export class HeroSectionComponent {
    config: Phaser.Types.Core.GameConfig;
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            height: 600,
            width: 800,
            scene: [MainScene],
            parent: "gameContainer",
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { x: 0, y: 500 },
                },
            },
        };
    }
    phaserGame: Phaser.Game | undefined;
    async ngOnInit(): Promise<void> {
        this.config.height = document.body.clientHeight;
        this.config.width = document.body.clientWidth;
        this.phaserGame = new Phaser.Game(this.config);

        window.addEventListener("resize", () => {
            this.config.height = document.body.clientHeight;
            this.config.width = document.body.clientWidth;
            this.phaserGame?.scale.resize(
                this.config.width,
                this.config.height
            );
        });
    }
}

interface MainScene {
    totalPlayers: number;
    currentRank: number;
    height: number;
    width: number;
    beardedMan: BeardedMan;
    hatMan: HatMan;
    layer1: Phaser.Tilemaps.TilemapLayer;
    layer2: Phaser.Tilemaps.TilemapLayer;
}

class MainScene extends Phaser.Scene {
    private player!: Phaser.Physics.Matter.Sprite;
    private characters!: Phaser.Physics.Matter.Sprite[];
    private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
    constructor() {
        super({ key: "MainScene" });
        this.totalPlayers = 0;
        this.currentRank = 0;
        this.height = document.body.clientHeight;
        this.width = document.body.clientWidth;
        this.layer1;
        this.layer2;
        this.beardedMan;
        this.hatMan;
    }
    create(): void {
        console.log("create method");
        this.physics.world.setBounds(0, 0, this.width*1.5, this.height);
         this.keys = {
            up: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)!,
            down: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)!,
            left: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)!,
            right: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)!,
            space: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)!,
            shift: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)!,
         }!;
        const background = this.add.sprite(0, 0, "background");
        const background2 = this.add.sprite(this.width, 0, "background");
        const middleground = this.add.sprite(0, 0, "middleground");
        const middleground2 = this.add.sprite(this.width, 0, "middleground");
        background.setOrigin(0, 0);
        middleground.setOrigin(0, 0);
        background.displayHeight = this.height;
        background.displayWidth = this.width;
        middleground.displayHeight = this.height;
        middleground.displayWidth = this.width;
        background2.setOrigin(0, 0);
        middleground2.setOrigin(0, 0);
        background2.displayHeight = this.height;
        background2.displayWidth = this.width;
        middleground2.displayHeight = this.height;
        middleground2.displayWidth = this.width;

        this.cameras.main.setBounds(0, 0, this.width*1.5, this.height);

        window.addEventListener("resize", () => {
            this.height = document.body.clientHeight;
            this.width = document.body.clientWidth;
            background.displayHeight = this.height;
            background.displayWidth = this.width;
            middleground.displayHeight = this.height;
            middleground.displayWidth = this.width;
            background2.displayHeight = this.height;
            background2.displayWidth = this.width;
            middleground2.displayHeight = this.height;
            middleground2.displayWidth = this.width;
        });

        const map = this.add.tilemap("map");
        map.addTilesetImage("tileset");
        this.layer1 = map.createLayer("Tile Layer 1", "tileset")!;
        // map.setCollision([1, 354, 356, 203, 204, 206, 208, 209, 270, 271, 272]);
        this.layer2 = map.createLayer("Tile Layer 2", "tileset")!;
        this.layer1.setCollision([
            354, 356, 203, 204, 206, 208, 209, 270, 271, 272,
        ]);
        this.layer2.setCollision([
            354, 356, 203, 204, 206, 208, 209, 270, 271, 272,
        ]);
        this.add.image(25 * 16 + 128, 495 + 105, "atlas-props", "house-a");
        this.add.image(35 * 16 + 128, 465 + 105, "atlas-props", "house-b");
        this.add.image(48 * 16 + 128, 495 + 105, "atlas-props", "house-a");
        this.add.image(
            1 * 16 - 32 + 128,
            550 + 105,
            "atlas-props",
            "crate-stack"
        );
        this.add.image(
            76 * 16 - 32 + 128,
            550 + 105,
            "atlas-props",
            "crate-stack"
        );
        this.add.image(1 * 16 + 128, 530 + 105, "atlas-props", "street-lamp");
        this.add.image(26 * 16 + 128, 530 + 105, "atlas-props", "street-lamp");
        this.add.image(60 * 16 + 128, 530 + 105, "atlas-props", "street-lamp");
        this.add.image(17 * 16 + 128, 555 + 105, "atlas-props", "well");
        this.add.image(42 * 16 - 5 + 128, 500 + 105, "atlas-props", "sign");
        this.add.image(3 * 16 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(5 * 16 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(70 * 16 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(71 * 16 + 8 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(54 * 16 + 8 + 128, 555 + 105, "atlas-props", "wagon");
        this.add.image(23 * 16 + 128, 570 + 105, "atlas-props", "crate");
        this.add.image(25 * 16 + 128, 495 + 105, "atlas-props", "house-a");
        this.add.image(35 * 16 + 128, 465 + 105, "atlas-props", "house-b");
        this.add.image(48 * 16 + 128, 495 + 105, "atlas-props", "house-a");
        this.add.image(
            1 * 16 - 32 + 128,
            550 + 105,
            "atlas-props",
            "crate-stack"
        );
        this.add.image(
            76 * 16 - 32 + 128,
            550 + 105,
            "atlas-props",
            "crate-stack"
        );
        this.add.image(1 * 16 + 128, 530 + 105, "atlas-props", "street-lamp");
        this.add.image(26 * 16 + 128, 530 + 105, "atlas-props", "street-lamp");
        this.add.image(60 * 16 + 128, 530 + 105, "atlas-props", "street-lamp");
        this.add.image(17 * 16 + 128, 555 + 105, "atlas-props", "well");
        this.add.image(42 * 16 - 5 + 128, 500 + 105, "atlas-props", "sign");
        this.add.image(3 * 16 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(5 * 16 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(70 * 16 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(71 * 16 + 8 + 128, 570 + 105, "atlas-props", "barrel");
        this.add.image(54 * 16 + 8 + 128, 555 + 105, "atlas-props", "wagon");
        this.add.image(23 * 16 + 128, 570 + 105, "atlas-props", "crate");
        this.beardedMan = new BeardedMan(this, 200, 400);
        this.hatMan = new HatMan(this, 400, 400);
    }
    preload(): void {
        console.log("preload method");
        this.load.image(
            "background",
            "../../../assets/game/environment/background.png"
        );
        this.load.image(
            "middleground",
            "../../../assets/game/environment/middleground.png"
        );
        this.load.image(
            "tileset",
            "../../../assets/game/environment/tileset.png"
        );
        this.load.tilemapTiledJSON(
            "map",
            "../../../assets/game/maps/map.json"
        );
        this.load.atlas(
            "atlas",
            "../../../assets/game/atlas/atlas.png",
            "../../../assets/game/atlas/atlas.json"
        );
        this.load.atlas(
            "atlas-props",
            "../../../assets/game/atlas/atlas-props.png",
            "../../../assets/game/atlas/atlas-props.json"
        );
        this.load.audio("music", [
            "../../../assets/game/sounds/rpg_village02__loop.ogg",
            "../../../assets/game/sounds/rpg_village02__loop.mp3",
        ]);
    }
    override update(): void {
        console.log("update method");
        this.physics.add.collider(this.beardedMan, this.layer1);
        this.physics.add.collider(this.beardedMan, this.layer2);
        this.physics.add.collider(this.hatMan, this.layer1);
        this.physics.add.collider(this.hatMan, this.layer2);
        this.cameras.main.startFollow(this.beardedMan);
        if(this.keys.left.isDown) {
            this.beardedMan.setVelocityX(-200);
            this.beardedMan.anims.play("bearded-walk", true);
            this.beardedMan.flipX = true;
        } else if(this.keys.right.isDown) {
            this.beardedMan.setVelocityX(200);
            this.beardedMan.anims.play("bearded-walk", true);
            this.beardedMan.flipX = false;
        }
        else {
            this.beardedMan.setVelocityX(0);
            this.beardedMan.anims.play("bearded-idle", true);
        }
    }
}

class BeardedMan extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "atlas", "bearded-idle-1");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true)

        scene.anims.create({
            key: "bearded-idle",
            frames: scene.anims.generateFrameNames("atlas", {
                prefix: "bearded-idle-",
                start: 1,
                end: 5,
            }),
            frameRate: 7,
            repeat: -1,
        });

        scene.anims.create({
            key: "bearded-walk",
            frames: scene.anims.generateFrameNames("atlas", {
                prefix: "bearded-walk-",
                start: 1,
                end: 6,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.play("bearded-idle");
    }
}

class HatMan extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "atlas", "hat-man-idle-1");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        scene.anims.create({
            key: "hat-man-idle",
            frames: scene.anims.generateFrameNames("atlas", {
                prefix: "hat-man-idle-",
                start: 1,
                end: 4,
            }),
            frameRate: 7,
            repeat: -1,
        });

        scene.anims.create({
            key: "hat-man-walk",
            frames: scene.anims.generateFrameNames("atlas", {
                prefix: "hat-man-walk-",
                start: 1,
                end: 6,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.play("hat-man-idle");
    }
}