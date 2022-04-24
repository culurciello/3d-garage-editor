<template>
  <div class="instruction">
    <div class="instruction-text">
      <p>Drive your car into the right answer!</p>
      <p>Use KEY "A" and "D" to move sideways</p>
      <p>W to speed up</p>
      <p>S to slow down</p>
    </div>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script>
import {
  useGameStateContext,
  PossibleGameState,
} from "@/Providers/GameStateProvider";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

export default {
  setup() {
    const gameState = useGameStateContext();
    const router = useRouter();

    onMounted(() => {
      if (
        gameState.GameState.value === PossibleGameState.ongoing ||
        gameState.GameState.value === PossibleGameState.pause
      ) {
        gameState.pauseGame();
        router.push("play");
      }
    });

    const startGame = () => {
      gameState.startGame();
      router.push("play");
    };

    return {
      startGame,
    };
  },
};
</script>

<style scoped>
.instruction {
  margin-top: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.instruction-text {
  color: white;
  margin-bottom: 5vh;
}
</style>