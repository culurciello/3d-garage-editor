// import { GamePlayProvider } from '../Providers/GamePlayProvider';
// import { GameStateProvider } from '../Providers/GameStateProvider';
// import { InputMapProvider } from '../Providers/InputMapProvider';
import * as BABYLON from "babylonjs"
// import { Color4, SceneLoader, Vector3, Vector4, AssetsManager, Sound } from 'babylonjs';
import "@babylonjs/loaders/glTF";

// import { PlayerController } from './PlayerController';
// import { Wave } from './Wave';
// import { generateProblem } from '@/helpers/ProblemGenerator';
import TestLevel from './TestLevel';

export class Game {

    engine: BABYLON.Engine
    scene: BABYLON.Scene
    level: TestLevel
    // player: PlayerController;
    // camera: BABYLON.FreeCamera;
    // wave: Wave;
    
    // private crashSound: Sound
    // private correctSound: Sound
    // private carStart: Sound
    // private carGoing: Sound
    // private carStopped: Sound

    gameContext: {
        gameState: GameStateProvider,
        inputMap: InputMapProvider,
        gamePlay: GamePlayProvider
    }

    constructor(canvasDom: HTMLCanvasElement, gameContext: {
        gameState: GameStateProvider,
        inputMap: InputMapProvider,
        gamePlay: GamePlayProvider
    }) {
        this.gameContext = gameContext;
        this.engine = new BABYLON.Engine(canvasDom, true);
        this.scene = new BABYLON.Scene(this.engine);
        // this.camera = this.createCamera();
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        
        // this.crashSound = new BABYLON.Sound("wrong_answer", "wrong-answer.wav", this.scene)
        // this.correctSound = new BABYLON.Sound("correct_answer", "correct-answer.wav", this.scene)
        // this.carStart = new BABYLON.Sound("car_start", "car_start.wav", this.scene)
        // this.carGoing = new BABYLON.Sound("car_going", "car_idle.wav", this.scene, null, { loop: true })
        // this.carStopped = new BABYLON.Sound("car_off", "car_off.wav", this.scene)


        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.specular = new BABYLON.Color3(1,1,1)

        this.predefinedMaterial();
        // this.setGameScene();

        // this.wave = new Wave(this.scene, gameContext.gamePlay);
        // this.player = new PlayerController(this.scene, gameContext.inputMap, gameContext.gamePlay);
        this.level = new TestLevel(this.scene, gameContext.gameState);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        })

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.startGame()
    }

    public startGame() {
        // this.player.carOnScreen()
        //move car from offscreen to the screen
        // this.carStart.play(0, 0, 3);
        // this.carGoing.play(3, 0)

        // this.wave.createWave(); 
        this.level.GenerateLevel();     
        // this.wave.onWaveEnd.add(() => {
        //     //check if player get the right answer
        //     const { playerChoiceindex, problem, health, rightAnswer } = this.gameContext.gamePlay
        //     if (playerChoiceindex.value == problem.value.solutionIndex) {
        //         this.correctSound.play();
        //         rightAnswer.value += 1;
        //     } else {
        //         this.crashSound.play();
        //         this.player.crash()
        //         health.value -= 1;
        //     }
        //     //check lose condition
        //     if (health.value <= 0) {
        //         this.player.carOffScreen()
        //         this.carGoing.stop();
        //         this.carStopped.play();
        //         this.gameContext.gameState.gameComplete();
        //         this.wave.reset();
        //     } else {
        //         this.wave.setAnswer();
        //     }
        // })
    }

    public pauseGame() {
        // this.wave.pauseWave();
        // this.scenary.Pause();
    }

    public resumeGame() {
        // this.wave.resumeWave();
        // this.scenary.resume();
    }

    public toggleDebugger() {
        if(this.scene.debugLayer.isVisible()) {
            this.scene.debugLayer.hide();
        } else {
            this.scene.debugLayer.show();
        }
    }

    predefinedMaterial() {
        var mat = new BABYLON.StandardMaterial("player-material", this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString("#ffecd6");

        var enemymat = new BABYLON.StandardMaterial("sign", this.scene);
        enemymat.diffuseColor = BABYLON.Color3.FromHexString("#8d697a");

        var mat3 = new BABYLON.StandardMaterial("ground", this.scene);
        mat3.diffuseColor = BABYLON.Color3.FromHexString("#203c56");
    }

    // setGameScene() {
    //     this.scene.clearColor = new BABYLON.Color4(1, 0.667, 0.369);
    //     const ground = BABYLON.MeshBuilder.CreatePlane("road", {
    //         width: 11,
    //         height: 1000,
    //     }, this.scene)
    //     ground.material = this.scene.getMaterialByName("ground")
    //     ground.position = new BABYLON.Vector3(0, -1, 0);
    //     ground.rotate(new BABYLON.Vector3(1, 0, 0), 1.5708);
    // }

    async loadGameAsset() {
        // const loadPlayer = this.player.loadPlayer()
        // const loadScenary = this.scenary.loadScenary();
        // Promise.all([loadPlayer, loadScenary])
    }

}