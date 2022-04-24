import { UI } from '../Providers/UI.ts';
import { ConstructionBlock } from '../Providers/ConstructionBlock';

// import { GameStateProvider, PossibleGameState } from '@Providers/GameStateProvider';
// import { AbstractMesh, FadeInOutBehavior, Scene, SceneLoader, TimerState, Vector3, Animation, Mesh, Animatable } from 'babylonjs';

// const scenaryXLocations = [16, 13, 11, -9, -8, -7, -6, 6, 7, 8, 9, 11, 13, 16];

export default class TestLevel {

    // scene: Scene;
    // meshes: Mesh[] = []
    // gameState: GameStateProvider;
    // animations: Animatable[] = [];
    // lastFrames: number[] = [];

    constructor(scene: Scene, gameState: GameStateProvider) {
        this.scene = scene;
        this.gameState = gameState;

        this.menu = null;
        this.selectedObject = null; // object selected by user to edit / visual code
        this.editMode = false; // false == game, true == edit

        // level elements:
        this.blocks = []; // list of blocks used
        this.items = {}; // list of all placed items (clones of this level meshes)
        this.lenBlocks = 0; // how many blocks used
    }

    // async loadScenary() {
    //     const promises = ["DeadTree_1", "DeadTree_2", "DeadTree_3"].map(fileName => {
    //         return SceneLoader.ImportMeshAsync(fileName, `${window.location.origin}${window.location.pathname}model/`, `${fileName}.babylon`, this.scene).then(obj => {
    //             const mesh = obj.meshes[0] as Mesh
    //             mesh.isVisible = false
    //             mesh.position = new Vector3(0, -100, 0);
    //             this.meshes.push(mesh)
    //         })
    //     })
    //     return Promise.all(promises)
    // }

    GenerateLevel() {
        this.scene.clearColor = new BABYLON.Color3.FromHexString('#777');
        
        // Adding lights
        var dirLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);
        dirLight.intensity = 3;

        let hemiLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(-1, 1, 0), this.scene);
        hemiLight.intensity = 2;

        // // Sky mesh (box)
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./src/assets/textures/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // ground:
        var groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture('src/assets/textures/tile.jpg', this.scene);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.diffuseTexture.uScale = 100.0; // tiling
        groundMaterial.diffuseTexture.vScale = 100.0; // tiling
        groundMaterial.diffuseTexture.uOffset = 0.5; // offset
        groundMaterial.diffuseTexture.vOffset = 0.5; // offset
        
        this.ground = BABYLON.Mesh.CreateGround('ground', 500, 500, 2, this.scene);
        this.ground.isPickable = true;
        // this.ground.checkCollisions = true; //dont check for collisions, dont allow for raycasting to detect it(cant land on it)
        this.ground.material = groundMaterial;

        // camera:
        this.camera = this.createCamera();

        // player node:
        this.player = new BABYLON.TransformNode("player", this.scene)

        // connect camera to player:
        this.camera.lockedTarget = this.player;

        // User Interface:
        this.createMenu();
        this.highlight = new BABYLON.HighlightLayer("hl1", this.scene);
        this.setEditGizmo();

        // add items:
        this.addTestBlocks();

    }

    createCamera() {
        // const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), this.scene);
        // camera.position = new BABYLON.Vector3(0, 9, -10);
        // camera.rotation = new BABYLON.Vector3(0.4653956558758062, 0, 0);
        // return camera;

        const fpsCameraPOS = new BABYLON.Vector3(0, 1.5, 5);
        const camera = new BABYLON.UniversalCamera("UniversalCamera", fpsCameraPOS, this.scene);
        
        camera.radius = 15;
        camera.heightOffset = 5;
        camera.rotationOffset = 180;

        // camera.attachControl(canvasDom, false);
        camera.setTarget(new BABYLON.Vector3(0,0,0));
        // camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(0.3, 0.75, 0.3); // size of FPS player!
        camera.checkCollisions = true;
        camera._needMoveForGravity = true;

        // Reducing the minimum visible FOV:
        camera.minZ = 0;

        // Remap keys to move with WASD
        camera.keysUp = [87, 38]; // W or UP Arrow
        camera.keysDown = [83, 40]; // S or DOWN ARROW
        camera.keysLeft = [65, 37]; // A or LEFT ARROW
        camera.keysRight = [68, 39]; // D or RIGHT ARROW

        camera.inertia = 0.1;
        camera.angularSensibility = 800;
        camera.speed = 1;

        return camera;
    }

    addTestBlocks() {
        // var b1 = this.addBlock();
        var rotation = new BABYLON.Vector3(0,0,0);
        var b1 = this.addBlock(new BABYLON.Vector3(2, 2, 5), new BABYLON.Vector3(10, 2, 0), rotation, null);
        // var b2 = this.addBlock(new BABYLON.Vector3(-10, 1, 0));
        // var b3 = this.addBlock(new BABYLON.Vector3(6, 0.2, 2), new BABYLON.Vector3(-3, 2, 0), rotation, null);
        // var b31 = this.addBlock(new BABYLON.Vector3(6, 0.2, 2), new BABYLON.Vector3(-3, 1, 4), rotation, null);
        // b3.movable = false;
    }

    addBlock(size, position, rotation, color){
        var b = new ConstructionBlock(this, size, position, rotation, color).create();
        b.name = "block_" + this.lenBlocks;
        this.blocks.push(b);
        this.lenBlocks++;
        this.selectedObject = b;
        return b;
    }

    setEditGizmo(){
        // edit gizmo
        this.gizmoManager = new BABYLON.GizmoManager(this.scene)
        // this.gizmoManager.boundingBoxGizmoEnabled=true
        // this.gizmoManager.usePointerToAttachGizmos = true;
        this.gizmoManager.sensitivity = 1
        this.gizmoManager.snapDistance = 0.5
        // Toggle gizmos with keyboard buttons
        document.onkeydown = (e)=>{
            if(e.key == 'f'){
                this.gizmoManager.positionGizmoEnabled = !this.gizmoManager.positionGizmoEnabled
            }
            if(e.key == 'e'){
                this.gizmoManager.rotationGizmoEnabled = !this.gizmoManager.rotationGizmoEnabled
            }
            if(e.key == 'r'){
                this.gizmoManager.scaleGizmoEnabled = !this.gizmoManager.scaleGizmoEnabled
            }
            if(e.key == 't'){
                this.gizmoManager.boundingBoxGizmoEnabled = !this.gizmoManager.boundingBoxGizmoEnabled
            }
        }
    }

    createMenu() {
        this.ui = new UI('testLevelUI');

        // restart:
        this.ui.addButton('backButton', 'Restart', {
            'top': '-45%',
            'left':'-40%',
            'onclick': () => this.reStart()
        });

        // add items:
        this.ui.addButton('addBlockButton', 'Add Block', {
            'top': '-35%',
            'left':'-40%',
            'onclick': () => this.addBlock()
        });
    
        // save scene
        this.ui.addButton('savesButton', 'Save Scene', {
            'top': '-45%',
            'left':'40%',
            'onclick': () => this.saveScene()
        });

        // load scene
        this.ui.addButton('loadsButton', 'Load Scene', {
            'top': '-35%',
            'left':'40%',
            'onclick': () => this.loadScene()
        });

        // add edit instructions:
        this.ui.addText('Edit Keys: select object with mouse, then: "t", "r": resize, "f": move, "e": rotate', {
            'top': '95%',
            'left':'-10%',
            'fontSize': '18'
        });

    }

    // beforeRender() {
    //     if(!GAME.isPaused()) {
    //         if(this.cam.camera.position.y < -30) {
    //             console.log('Game over!')
    //             // this.gameOver();
    //         }
    //     }
    // }

} 