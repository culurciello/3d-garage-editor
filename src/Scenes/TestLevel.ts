import { UI } from '../Providers/UI.ts';
import { ConstructionBlock } from '../Providers/ConstructionBlock';


export default class TestLevel {

    constructor(scene: Scene) {
        this.scene = scene;

        this.menu = null;
        this.selectedObject = null; // object selected by user to edit / visual code
        this.editMode = false; // false == game, true == edit
        this.gizmoManager = null;

        // level elements:
        this.blocks = []; // list of blocks used
        this.items = {}; // list of all placed items (clones of this level meshes)
        this.lenBlocks = 0; // how many blocks used
    }

    start() {
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

        // mouse events - select objects and such!
        this.setupEventListeners();

        // add items:
        this.addTestBlocks();

    }

    createCamera() {

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

    reStart() {
        // clean up previous scene:
        console.log("restarting");
        this.blockly = null;
        GAME.engine.stopRenderLoop();
        this.scene.dispose();
        // and re-start:
        GAME.startLevel();
    }

    // beforeRender() {
    //     if(!GAME.isPaused()) {
    //         if(this.cam.camera.position.y < -30) {
    //             console.log('Game over!')
    //             // this.gameOver();
    //         }
    //     }
    // }

    setupEventListeners() {
        // mouse clicks:
        this.scene.onPointerObservable.add((eventData) => {
            if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                // console.log('start X,Y: ', this.scene.pointerX, this.scene.pointerY)
                const result = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
                if (result.hit) {
                    var n = result.pickedMesh.name;
                    if (this.selectedObject != null) { 
                        this.highlight.removeMesh(this.selectedObject);
                        this.selectedObject.selected = false;
                    }
                    // do not pick on ground or sky - use them to unselect!
                    if (!(n=='ground' || n=='skyBox')) {
                        this.highlight.addMesh(result.pickedMesh, BABYLON.Color3.White())
                        result.pickedMesh.selected = true;
                        this.selectedObject = result.pickedMesh;
                        console.log('Selected:', n)
                    }
                }
            } 
        })
    }

    // custom save function  - not BabylonJS default json save scene!
    saveScene() {
        // console.log('save scene - custom');
        var data = []

        // save construction blocks
        this.blocks.forEach( (block) => {
            var block_data = {"type":"ConstructionBlock", 
                                "name":block.name, 
                                "size":block.mesh.scaling,
                                "position":block.mesh.position,
                                "rotation":block.mesh.rotation, 
                                "color":block.mesh.material.emissiveColor};
            data.push(block_data);
            // console.log('block:', block, data);
        });

        // save visual programming
        // TBD

        // save to file via web interface:
        var json = JSON.stringify(data);
        var blob = new Blob([json], {type: "application/json"});
        var url  = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.download    = "backup.json";
        a.href        = url;
        a.textContent = "Download backup.json";
        a.click();

    }

    // custom load function  - not BabylonJS default json save scene!
    loadScene() {

        console.log("Loading saved scene");
        this.reStart();

        this.scene.executeWhenReady(function () {

            // load saved data:
            // cannot make dialog get full path, so have to save in a pre-defined location:
            fetch('./static/assets/save/backup.json')
                .then(response => response.json())
                .then(data => {
                    console.log('fetched:', data);
                    data.forEach( (block) => {
                        if (block["type"] == "ConstructionBlock") {
                            console.log('loaded block:', block);
                            var position = block["position"];
                            var rotation = block["rotation"];
                            var size = new BABYLON.Vector3(block["size"]["_x"], block["size"]["_y"], block["size"]["_z"]);
                            var color = block["color"];
                            // console.log(size, position, rotation, color)
                            var b = GAME.currentLevel.addBlock(size, position, rotation, color);
                            b.name = block["name"]
                        };
                    });
                });


            // // load file via dialog:
            // var fileInput = document.getElementById("loadFile");

            // if(!fileInput){
            //     fileInput = document.createElement("INPUT");
            //     fileInput.setAttribute("id", "loadFile");
            //     fileInput.setAttribute("type", "file");
            //     fileInput.style.position = "absolute";
            //     fileInput.style.top = "80px";
            //     fileInput.style.width = "200px"
            //     fileInput.style.height = "100px";
            //     fileInput.style.right = "40px"
            //     document.body.children[0].appendChild(fileInput);
            // }

            // var loadButton = document.getElementById('loadFile');

            // loadButton.onchange = function(evt){
            //     var files = evt.target.files;
            //     var filename = files[0].name;
            //     // var blob = new Blob([files[0]]);

            //     console.log(files[0], filename)

            //     fetch(filename)//'./static/assets/save/scene.json')
            //         .then(response => response.json())
            //         .then(data => {
            //             console.log('fetched:', data);
            //             var sceneString = "data:" + JSON.stringify(data);
            //             });
            // };
            // loadButton.click(); // opening dialog
        });
    }

} 