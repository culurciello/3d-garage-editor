import AssetsDatabase from '@/base/AssetsDatabase';
import type { Game } from '@/Scenes/Game';
import type { Scene } from 'babylonjs';

export default class Level {

    game: Game
    scene: Scene
    assets: null
    materials: BABYLON.Material

    constructor(game: Game) {
        this.scene = game.scene;
        this.game = game;
        this.assets = null;
        
        //We can use this object to store materials that can be reused along the Game
        this.materials = {};
    }

    start() {

        if(this.setProperties) {
            this.setProperties();
        } else {
            console.log('The setProperties method is recommended to initialize the Level properties');
        }

        this.createScene();
    }

    createScene() {
        // Create the scene space
        this.scene = this.game.scene;

        // Add assets management and execute beforeRender after finish
        this.assets = new AssetsDatabase(this.scene, this.game, () => {

            console.log('Level Assets loaded');

            if(this.buildScene) {
                this.buildScene();
            } else {
                console.log('You can add the buildScene method to your level to define your scene');
            }

            // If has the beforeRender method
            if(this.beforeRender) {
                this.scene.registerBeforeRender(
                    this.beforeRender.bind(this)
                );
            } else {
                console.log('You can define animations and other Game logics that happens inside the main loop on the beforeRender method');
            }

            this.game.resume();
            this.game.startRenderLoop();

        });

        this.buildScene();

        if(this.setupAssets) {
            this.setupAssets();
        }

        // Load the assets
        this.assets.load();

        return this.scene;
    }

    exit() {
        // Fix to blur the canvas to avoid issues with keyboard input
        // this.game.canvas.blur();

        this.game.stopRenderLoop();

        if(this.onExit) {
            this.onExit();
        }

        this.scene.dispose();
        this.scene = null;
    }

    /**
     * Adds a collider to the level scene. It will fire the options.onCollide callback
     * when the collider intersects options.collisionMesh. It can be used to fire actions when
     * player enters an area for example.
     * @param {*} name 
     * @param {*} options 
     */
    addCollider(name, options) {
        
        let collider = BABYLON.MeshBuilder.CreateBox(name, {
            width: options.width || 1, 
            height: options.height || 1, 
            depth: options.depth || 1
        }, this.scene);

        // Add a tag to identify the object as collider and to simplify group operations (like dispose)
        BABYLON.Tags.AddTagsTo(collider, 'collider boxCollider');

        collider.position.x = options.positionX || 0;
        collider.position.y = options.positionY || 0;
        collider.position.z = options.positionZ || 0;

        collider.isVisible = (options.visible) ? options.visible : false;

        if(collider.isVisible) {
            let colliderMaterial = new BABYLON.StandardMaterial(name + 'Material');
            colliderMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0);
            colliderMaterial.alpha = 0.5;

            collider.material = colliderMaterial;
        }

        options.timeToDispose = (options.timeToDispose) ? options.timeToDispose : 0;

        collider.actionManager = new BABYLON.ActionManager(this.scene);
        collider.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: options.collisionMesh
                },
                () => { 

                    // Runs onCollide callback if exists
                    if(options.onCollide) {
                        options.onCollide();
                    }
                    
                    // If true, will dispose the collider after timeToDispose
                    if(options.disposeAfterCollision) {
                        setTimeout(() => {
                            collider.dispose();
                        }, options.timeToDispose);
                    }
                }
            )
        );

        return collider;

    }

    disposeColliders() {
        let colliders = this.scene.getMeshesByTags('collider');

        for(var index = 0; index < colliders.length; index++) {
            colliders[index].dispose();
        }
    }

    addMaterial(material) {
        this.materials[material.name] = material;
    }

    getMaterial(materialName) {
        return this.materials[materialName];
    }

    removeMaterial(materialName) {
        let material = null;
        if(material = this.materials[materialName]) {
            material.dispose();
            delete this.materials[materialName];
        }
    }

    /**
     * Interpolate a value inside the Level Scene using the BABYLON Action Manager
     * @param {*} target The target object
     * @param {*} property The property in the object to interpolate
     * @param {*} toValue The final value of interpolation
     * @param {*} duration The interpolation duration in milliseconds
     * @param {*} afterExecutionCallback Callback executed after ther interpolation ends
     */
    interpolate(target, property, toValue, duration, afterExecutionCallback = null) {

        if(!this.scene.actionManager) {
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        }

        let interpolateAction = new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.NothingTrigger,
            target,
            property,
            toValue,
            duration
        );

        interpolateAction.onInterpolationDoneObservable.add(() => {
            this.game.log.debug('Interpolation done');
            if(afterExecutionCallback) afterExecutionCallback();
        });

        this.scene.actionManager.registerAction(interpolateAction);
        interpolateAction.execute();
        
    }

    /**
     * Enable pointer lock
     */
    enablePointerLock() {
        let canvas = this.game.canvas;
        
        if(!this.camera) {
            console.error('You need to add a camera to the level to enable pointer lock');
        }

        // On click event, request pointer lock
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        var pointerlockchange = (event) => {
            this.controlEnabled = (
                            document.mozPointerLockElement === canvas
                            || document.webkitPointerLockElement === canvas
                            || document.msPointerLockElement === canvas
                            || document.pointerLockElement === canvas);
            // If the user is alreday locked
            if (!this.controlEnabled) {
                this.camera.detachControl(canvas);
            } else {
                this.camera.attachControl(canvas);
            }
        };

        // Attach events to the document
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }

    exitPointerLock() {
        this.camera.detachControl(this.game.canvas);
    }

    //Remove any unwanted stuff
    cleanUpScene(serializedScene)
    {
        //comment out the keys to keep
        var keys = [
            "autoClear",
            "clearColor",
            "ambientColor",
            "gravity",
            "cameras",
            "activeCameraID",
            "lights",
            "reflectionProbes",
            "materials",
            "geometries",
            //"meshes",
            "multiMaterials",
            "shadowGenerators",
            "skeletons",
            "particleSystems",
            "lensFlareSystems",
            "actions",
            "sounds",
            "collisionsEnabled",
            "physicsEnabled",
            "physicsGravity",
            "physicsEngine",
            "morphTargetManagers",
            "animations",
            "autoAnimate",
            "autoAnimateFrom",
            "autoAnimateTo",
            "autoAnimateLoop",
            "autoAnimateSpeed",
            "environmentIntensity",
            "transformNodes",
            "postProcesses",
            "effectLayers"
        ];

        for(var i = 0; i < keys.length; i++){
            delete serializedScene[keys[i]];
        }        
    }

    saveScene()
    {
        console.log("Saving scene");
        if(this.savefile) {
            window.URL.revokeObjectURL(this.savefile);
        }
        
        var serializedScene = BABYLON.SceneSerializer.Serialize(this.scene);
        this.cleanUpScene(serializedScene);
        var strScene = JSON.stringify(serializedScene);
        var filename = "scene.json";
        var blob = new Blob([strScene], { type : "octet/stream" } );

        // turn blob into an object URL; saved as a member, so can be cleaned out later
        this.savefile = (window.webkitURL || window.URL).createObjectURL(blob);
        
        var link = document.createElement("a");
        link.href = this.savefile;
        link.download = filename;
        var click = document.createEvent("MouseEvents");
        click.initEvent("click", true, false);
        link.dispatchEvent(click);    
    }

}