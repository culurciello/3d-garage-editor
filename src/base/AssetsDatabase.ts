import type { Game } from '@/Scenes/Game';
import type { Scene } from 'babylonjs';
import { addLabel, generateRandomPosition } from '@/base/utils';

export default class AssetsDatabase {
    
    constructor(scene: Scene, game: Game, finishCallback) {

        this.scene = scene;
        this.game = game;

        this.meshes = [];
        this.sounds = [];
        this.animatedMeshes = [];

        this.manager = new BABYLON.AssetsManager(this.scene);

        this.manager.onFinish = (tasks) => {
            if(finishCallback) finishCallback(tasks);
        };
        
    }

    // place a previously loaded mesh in an experience setupAssets function or similar
    placeItem(name, position,
            rotation = new BABYLON.Vector3(0, 0, 0), 
            scaling = new BABYLON.Vector3(1.0, 1.0, 1.0),
            mass = 1, restitution = 0.4, friction = 10) {

        var mesh = this.getMesh(name);//.clone();
        // mesh.name = name;
        mesh.id = BABYLON.Tools.RandomId();
        mesh.setEnabled(true);
        mesh.isVisible = true;
        BABYLON.Tags.AddTagsTo(mesh, name);
        mesh.checkCollisions = true;
        BABYLON.Tags.AddTagsTo(mesh, this.assetsTag);
        //mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.MeshImpostor, { mass: mass, restitution: restitution, friction: friction }, this.scene);

        if (!position) { mesh.position = generateRandomPosition(); }
        else {
            mesh.position = position;
            mesh.rotation = rotation;
            mesh.scaling = scaling;
        }

        console.log('Placed mesh:', mesh.name);
        // GAME.currentLevel.items[name] = mesh
        // return mesh;
    }

    /**
     * Adds a sound to be loaded
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */
    addSound(name, file, options) {
        let fileTask = this.manager.addBinaryFileTask(name + '__SoundTask', file);

        fileTask.onSuccess = (task) => {
            this.sounds[name] = new BABYLON.Sound(name, task.data, this.scene, null, options);
            
            // Execute a success callback
            if(options.onSuccess) {
                options.onSuccess(this.sounds[name]);
            }
        }

        return this.sounds[name];
    }

    /**
     * Adds a music (sound with some predefined parametes that can be overwriten)
     * By default, musics are automatically played in loop
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */
    addMusic(name, file, options = {}) {

        options.loop = (typeof options.loop !== 'undefined') ? options.loop : true;
        options.volume = (typeof options.volume !== 'undefined') ? options.volume : 0.5;
        options.autoplay = (typeof options.autoplay !== 'undefined') ? options.autoplay : true;

        return this.addSound(name, file, options);

    }

    addMergedMesh(name, file, options) {
        return this.addMesh(name, file, options, true);
    }

    addMesh(name, file, options = {}, mergeMeshes = false) {
        let fileTask = this.manager.addMeshTask(name + '__MeshTask', '', file);

        fileTask.onSuccess = (task) => {
            
            let mesh = null;
            
            try {
                if(mergeMeshes) {
                    mesh = BABYLON.Mesh.MergeMeshes(task.loadedMeshes);   
                } else {
                    mesh = task.loadedMeshes[0];
                }

                mesh.setEnabled(false);
    
                this.meshes[name] = mesh;
                
                // Execute a success callback
                if(options.onSuccess) {
                    options.onSuccess(this.meshes[name]);
                }
            } catch (error) {
                console.error(error)
            }

        }

        return this.meshes[name];
    }

    addAnimatedMesh(name, file, options = {}) {
        let fileTask = this.manager.addMeshTask(name + '__AnimatedMeshTask', '', file);

        fileTask.onSuccess = (task) => {
            try {
                let mesh = task.loadedMeshes[0];
                mesh.setEnabled(false);
    
                this.animatedMeshes[name] = this.buildAnimatedMeshData(mesh, task, options);
                
                // Execute a success callback
                if(options.onSuccess) {
                    options.onSuccess(this.animatedMeshes[name]);
                }
            } catch (error) {
                console.error(error)
            }

        }

        return this.animatedMeshes[name];
    }

    buildAnimatedMeshData(mesh, task, options) {
        let start = 0,
            end = 0;

        if(options.start || options.startFrame) {
            start = options.startFrame ? options.startFrame / 30 : options.start;
            end = options.endFrame ? options.endFrame / 30 : options.end;
        }

        mesh.animationGroups = task.loadedAnimationGroups;

        mesh.animationGroups.forEach(function (animationGroup) {
            // console.log('animationgroup', animationGroup) // show animations in array
            if(options.normalized) {
                animationGroup.normalize(start, end);
            }

            animationGroup.pause();
        });

        return mesh;

    }

    playMeshAnimation(meshName, start, end, loop = false) {
        let mesh = this.getAnimatedMesh(meshName);

        start = start / 30;
        end = end / 30;

        mesh.animationGroups.forEach(function (animationGroup) {
            animationGroup.stop();
            animationGroup.start(loop, 1, start, end);
        });
    }

    playMeshAnimationNum(meshName, anum, start, end, loop = false) {
        let mesh = this.getAnimatedMesh(meshName);

        start = start / 30;
        end = end / 30;

        mesh.animationGroups[anum].stop();
        mesh.animationGroups[anum].start(loop, 1, start, end);
    }

    getMesh(name) {
        if(!this.meshes[name]) {
            this.game.log.debugError('There is no mesh called "' + name + '"');
            return;
        }

        return this.meshes[name];     
    }

    getAnimatedMesh(name) {
        if(!this.animatedMeshes[name]) {
            this.game.log.debugError('There is no animated mesh called "' + name + '"');
            return;
        }

        return this.animatedMeshes[name];     
    }

    getSound(name) {
        return this.sounds[name];
    }

    load() {
        this.manager.load();
    }

}