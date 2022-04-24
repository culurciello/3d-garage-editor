import { inject, provide, ref} from 'vue';

export enum PossibleGameState {
    startMenu,
    pause,
    ongoing,
    done
}

export class GameStateProvider {
    public GameState: Ref<PossibleGameState> = ref();

    constructor(initialState: PossibleGameState = PossibleGameState.startMenu) {
        this.GameState.value = initialState;
    }

    startGame() {
        this.GameState.value = PossibleGameState.ongoing;
    }

    pauseGame() {
        this.GameState.value = PossibleGameState.pause;
    }

    gameComplete() {
        this.GameState.value = PossibleGameState.done;
    }
} 

const GAMESTATE_CONTEXT = Symbol("gamestate");

export function useGameStateProvider() {
    const gameStateProvider = new GameStateProvider();
    provide(GAMESTATE_CONTEXT, gameStateProvider);
    return gameStateProvider;
}

export function useGameStateContext(): GameStateProvider {
    const context = inject<GameStateProvider>(GAMESTATE_CONTEXT);
    if(!context) {
        throw new Error("provider need context")
    }
    return context;
}