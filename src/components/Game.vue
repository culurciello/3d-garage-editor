<template>
  <div class="game">
    <canvas ref="gameCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import { Game } from "../Scenes/Game";

// This is where we host our BabylonJS canvas 
export default {
  setup() {
    const gameCanvas = ref();
    const isLoading = ref(false)
    let game: Game = null;

    onMounted(() => {
      if (gameCanvas.value) {
        game = new Game(gameCanvas.value, {});
      }
    });

    return {
      gameCanvas,
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