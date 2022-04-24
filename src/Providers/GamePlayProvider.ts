import { inject, provide, reactive, ref} from 'vue';
// import { generateProblem, Problem } from '../helpers/ProblemGenerator';

export class GamePlayProvider {

    // public problemQueue: Problem[];
    public timer: Ref<number>;
    public animationTimeFrame: Ref<number>;
    public health: Ref<number>;
    public problem: Ref<Problem>;
    public playerChoiceindex: Ref<number>
    public rightAnswer: Ref<number>

    constructor() {
        this.timer = ref(0);
        this.rightAnswer = ref(0);
        this.animationTimeFrame = ref(1);
        this.health = ref(3);
        this.problem = ref(null);
        this.playerChoiceindex = ref(1);
    }

    updateTimer(delta: number) {
        this.timer.value += delta;
    }

    setAnimationTimeFrame(timeFrame: number) {
        this.animationTimeFrame.value = timeFrame;
    }

    resetGame() {
        this.timer.value = 0;
        this.animationTimeFrame.value = 1;
        this.health.value = 3;
        this.rightAnswer.value = 0;
    }
}

const GamePlay_Context = Symbol("gameplay");

export function useGamePlayProvider() {
    const provider = new GamePlayProvider();
    provide(GamePlay_Context, provider);
    return provider;
}

export function useGamePlayContext(): GamePlayProvider {
    const context = inject<GamePlayProvider>(GamePlay_Context);
    if (!context) {
        throw new Error('Provider need context');
    }
    return context;
}