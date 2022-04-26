import * as BABYLON from "babylonjs"
// import { Color4, SceneLoader, Vector3, Vector4, AssetsManager, Sound } from 'babylonjs';
import "@babylonjs/loaders/glTF";
import TestLevel from '@/Scenes/TestLevel';
import Log from '@/base/Log';
import Helper from "@/base/Helper";
import type Level from "@/base/Level";
import type { int } from "babylonjs";

export class Game {

    engine: BABYLON.Engine
    scene: BABYLON.Scene
    level: Level
    currentLevel: Level
    log: Log
    levels: {}
    keys: {}
    options: null
    paused: boolean
    helper: Helper

    constructor(canvasDom: HTMLCanvasElement) {
        // Sets game options:
        this.options = {};

        // Keyboard pressed keys:
        this.keys = {};

        // Is game paused?
        this.paused = false;

        // Can be used to log objects and debug the game
        this.log = new Log(this);

        // Helper methods
        this.helper = new Helper();

        this.engine = new BABYLON.Engine(canvasDom, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);

        this.levels = {
            // 'HomeMenuLevel': new HomeMenuLevel(this.scene),
            // 'CreditsLevel': new CreditsLevel(this.scene),
            // 'FirstLevel': new FirstLevel(this.scene),
            'TestLevel': new TestLevel(this),
        };

        this.currentLevel = null;
        this.currentLevelName = 'TestLevel';
        
        this.startRenderLoop();

        this.start()
    }

    start() {
        // console.log('game opts', this.options)
        this.goToLevel('TestLevel');
        this.listenKeys();
        this.listenOtherEvents();    
    }

    restart(){
        this.stopRenderLoop();
        this.scene.dispose();
        // and re-start:
        this.scene = new BABYLON.Scene(this.engine);
        // this.startLevel();
        this.goToLevel('TestLevel');
    }

    pause() {
        this.paused = true;
    }

    isPaused() {
        return this.paused;
    }

    resume() {
        this.paused = false;
    }

    toggleDebugger() {
        if(this.scene.debugLayer.isVisible()) {
            this.scene.debugLayer.hide();
        } else {
            this.scene.debugLayer.show();
        }
    }
        
    listenKeys() {
        
        document.addEventListener('keydown', keyDown.bind(this));
        document.addEventListener('keyup', keyUp.bind(this));
    
        this.keys.up = false;
        this.keys.down = false;
        this.keys.left = false;
        this.keys.right = false;

        function keyDown(e) {
            if (e.keyCode == 87 || e.keyCode == 38) {//Arrow Up
                this.keys.up = 1;
                
            }else if (e.keyCode == 83 || e.keyCode == 40) {//Arrow Down
                this.keys.down = 1;
                
            } else if (e.keyCode == 65 || e.keyCode == 37) {//Arrow Left
                this.keys.left = 1;
                
            } else if (e.keyCode == 68 || e.keyCode == 39) {//Arrow Right
                this.keys.right = 1;
            }
        }

        function keyUp(e) {
            if (e.keyCode == 87 || e.keyCode == 38) {//Arrow Up
                this.keys.up = 0;
            }else if (e.keyCode == 83 || e.keyCode == 40) {//Arrow Down
                this.keys.down = 0;
            } else if (e.keyCode == 65 || e.keyCode == 37) {//Arrow Left
                this.keys.left = 0;
            } else if (e.keyCode == 68 || e.keyCode == 39) {//Arrow Right
                this.keys.right = 0;
            }
        }
    }

    listenOtherEvents() {
        window.addEventListener('blur', () => {
            this.pause();
        });

        window.addEventListener('focus', () => {
            this.resume();
        });

        window.addEventListener('resize', () => { 
            this.engine.resize();
        });
    }

    goToLevel(levelName) {

        if(!this.levels[levelName]) {
            console.error('A level with name ' + levelName + ' does not exists');
            return;
        }

        if(this.currentLevel) {
            this.currentLevel.exit();
        }

        this.currentLevelName = levelName;
        this.startLevel();
    }

    startLevel() {
        this.currentLevel = this.levels[this.currentLevelName];
        this.currentLevel.start();
    }

    startRenderLoop() {
        setTimeout(() => {
            this.engine.runRenderLoop(() => {
                this.currentLevel.scene.render();
            });
        }, 50);
    }

    stopRenderLoop() {
        this.engine.stopRenderLoop();
    }

    isMobile() {
        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }

        return false;
    }

}