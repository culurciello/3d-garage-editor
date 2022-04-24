<template>
  <div class="game">
    <canvas ref="gameCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import { Game } from "../Scenes/Game";
import {
  PossibleGameState,
  useGameStateContext,
} from "../Providers/GameStateProvider";
import { useInputMapContext } from "../Providers/InputMapProvider";
import { useGamePlayContext } from "../Providers/GamePlayProvider";

/**
 * This is where we host our BabylonJS canvas 
 */
export default {
  setup() {
    const gameState = useGameStateContext();
    const inputMap = useInputMapContext();
    const gamePlay = useGamePlayContext();
    const gameCanvas = ref();
    const isLoading = ref(false)
    let game: Game = null;

    onMounted(() => {
      if (gameCanvas.value) {
        game = new Game(gameCanvas.value, {
          gameState,
          inputMap,
          gamePlay,
        });
        // game.toggleDebugger();
        game.loadGameAsset();
      }
    });

    const gameWatch = watch(gameState.GameState, (cur, pre) => {
      if (
        pre === PossibleGameState.startMenu &&
        cur === PossibleGameState.ongoing
      ) {
        //start the game
        game.startGame();
      }
      if (cur === PossibleGameState.pause) {
        game.pauseGame();
      }
      if (
        pre === PossibleGameState.pause &&
        cur === PossibleGameState.ongoing
      ) {
        game.resumeGame();
      }
      if (pre === PossibleGameState.done && cur === PossibleGameState.ongoing) {
        //start the game
       gamePlay.resetGame();
       game.startGame();
      }
    });

    return {
      gameCanvas,
      gameWatch,
    };
  },
};
</script>

<style>
.game {
  height: 100vh;
  width: 100vw;
}

canvas {
  height: 100%;
  width: 100%;
}
</style>