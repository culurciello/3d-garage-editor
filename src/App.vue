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
import Game from "./components/Game.vue";

export default defineComponent({
  name: "App",
  components: { Game },//, GameHUD },
  setup() {
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