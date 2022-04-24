<template>
  <div class="app">
    <!-- router holds the game HUD -->
    <div class="vue-hud">
      <router-view></router-view>
    </div>
    <!--Our babylonJS game -->
    <Game />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import { useGamePlayProvider } from "./Providers/GamePlayProvider";
import { useGameStateContext, useGameStateProvider, PossibleGameState } from "./Providers/GameStateProvider";
import { useInputMapProvider } from "./Providers/InputMapProvider";
import Game from "./components/Game.vue";
// import GameHUD from "./components/GameHUD.vue";

export default defineComponent({
  name: "App",
  components: { Game },//, GameHUD },
  setup() {
    const inputMap = useInputMapProvider();
    useGamePlayProvider();
    const { GameState } = useGameStateProvider();


    const captureKeys = (event) => {
      if(GameState.value === PossibleGameState.ongoing) {
        inputMap.captureKeyUp(event.key);
      }
    };

    onMounted(() => {
      document.addEventListener("keyup", captureKeys);
    });
  
    onUnmounted(() => {
      document.removeEventListener("keyup", captureKeys)
    });
  },
});
</script>

<style scoped>
.vue-hud {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>