import Phaser from 'phaser';
import { DemoScene } from './DemoScene';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Spacefighters',
  type: Phaser.AUTO, // Uses WebGL with Canvas2DRenderingContext fallback
  width: window.innerWidth,
  height: window.innerHeight,
  scene: DemoScene,
  parent: '#container', // Where to inject the canvas element
  fps: {
    target: 60,
  },
  input: {
    gamepad: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
