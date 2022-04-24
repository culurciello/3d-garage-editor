<template>
  <div class="menu">
    <h1>Math Runner</h1>
    <button @click="startGame">Start Game</button>
    <button @click="goToInstruction">Instruction</button>
    <!-- <button>High Scores</button> -->
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
      if (gameState.GameState.value === PossibleGameState.ongoing || gameState.GameState.value === PossibleGameState.pause) {
        gameState.pauseGame();
        router.push("play");
      }
    });

    const startGame = () => {
      gameState.startGame();
      router.push("play");
    };

    const goToInstruction = () => {
      router.push("instruction");
    };

    return {
      startGame,
      goToInstruction,
    };
  },
};
</script>

<style scoped>
.menu {
  margin-top: 45vh;
  /* background: rgba(255, 255, 255, 0.762); */
  /* border: 1px solid black; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.menu h1 {
  color: white;
}

.menu button {
  background: #ffffff;
  min-height: 40px;
  width: 250px;
}

.menu button:hover {
  background: #ffffff85;
}
</style>