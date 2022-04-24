import { inject, provide, reactive } from 'vue';

const InputMapContext = Symbol();

export enum GameControls {
  Up,
  Right,
  Left,
  Down,
  SpeedUp
}

export class InputMapProvider {
  inputMap: Map<GameControls, boolean>

  constructor() {
    this.inputMap = reactive<Map<GameControls, boolean>>(new Map());
  }

  setInput(key: GameControls) {
    this.inputMap.set(key, true);
  }

  resetControls() {
    this.inputMap.clear();
  }

  captureKeyUp(key: any) {
    switch (key) {
      case "s":
        this.setInput(GameControls.Down);
        break;
      case "d":
        this.setInput(GameControls.Right);
        break;
      case "w":
        this.setInput(GameControls.Up)
        break;
      case "a":
        this.setInput(GameControls.Left)
        break;
      default:
        console.log("no key detected");
    }
  }
}

export function useInputMapProvider() {
  const provider = new InputMapProvider();
  provide(InputMapContext, provider);
  return provider;
}

export function useInputMapContext(): InputMapProvider  {
  const context = inject<InputMapProvider>(InputMapContext);
  if (!context) {
    throw new Error('Provider need context');
  }
  return context;
}