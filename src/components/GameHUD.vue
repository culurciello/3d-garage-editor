<template>
  <div class="game-hud">
    <div class="header">
      <div class="health" v-if="state === 2">
        <div>HP: {{ health }}</div>
        <div>Speed: {{ speed }}</div>
      </div>
      <div class="height" v-if="state === 2">Score: {{ rightAnswer }}</div>
      <div class="setting" v-if="state === 2">
        <button @click="pauseGame">Pause</button>
      </div>
    </div>
    <div class="content">
      <div v-if="state === 1">
        <button @click="startGame">Resume Game</button>
      </div>
      <div v-if="state === 3" class="game-over">
        <div>Game Over 😢</div>
        <button @click="startGame">Restart</button>
      </div>
    </div>
    <div class="footer">
      <div v-if="state === 2" class="problem">
        {{ gameProblem }}
      </div>
    </div>
  </div>
</template>

<script>
import { useGamePlayContext } from "@/Providers/GamePlayProvider";
import { computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useInputMapContext } from "@/Providers/InputMapProvider";
import {
  useGameStateContext,
  PossibleGameState,
} from "@/Providers/GameStateProvider";
export default {
  setup() {
    const gamePlay = useGamePlayContext();
    const inputState = useInputMapContext();
    const gameState = useGameStateContext();
    const router = useRouter();

    const state = gameState.GameState;

    onMounted(() => {
      if (gameState.GameState.value === PossibleGameState.startMenu) {
        router.push("menu");
      }
    });

    const gameProblem = computed(() => {
      if (!gamePlay.problem.value) {
        return "";
      }
      const { var1, var2, operator } = gamePlay.problem.value;
      return `${var1} ${operator} ${var2} = ?`;
    });

    const health = computed(() => {
      let hp = "";
      for (var i = 0; i < gamePlay.health.value; i++) {
        hp += "🚗";
      }
      return hp;
    });
    const speed = computed(() => {
      const v = gamePlay.animationTimeFrame.value;
      if (v === 1.5) {
        return "💨💨💨";
      } else if (v === 1) {
        return "💨💨";
      } else if (v === 0.75) {
        return "💨";
      }
    });
    const rightAnswer = gamePlay.rightAnswer;

    const startGame = () => {
      gameState.startGame();
    };

    const pauseGame = () => {
      gameState.pauseGame();
    };

    return {
      health,
      gameProblem,
      state,
      startGame,
      pauseGame,
      rightAnswer,
      speed,
    };
  },
};
</script>

<style scoped>
.game-hud {
  display: none;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  width: 100%;
  color: white;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 25px;
}

.content {
  display: flex;
  justify-content: center;
}

.footer {
  display: flex;
  justify-content: center;
}

.problem {
  font-size: 50px;
  color: white;
}

.game-over {
  display: flex;
  flex-direction: column;
  font-size: 60px;
}
</style>
