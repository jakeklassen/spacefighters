import Phaser from 'phaser';
import blueShip from '../assets/blue_ship.png';

export class DemoScene extends Phaser.Scene {
  gamepad: Phaser.Input.Gamepad.Gamepad | null = null;
  player: Phaser.Physics.Arcade.Image | null = null;

  preload() {
    this.load.image('blue_ship', blueShip);
  }

  create() {
    // Create the player
    this.player = this.physics.add.image(
      +this.game.config.width / 2,
      +this.game.config.height / 2,
      'blue_ship',
    );
    this.player.setDamping(true);
    this.player.setDrag(0.95);
    this.player.setMaxVelocity(400);
    this.player.setCollideWorldBounds(true);

    // Seems to require button press to fire this off
    this.input.gamepad.once('connected', () => {
      console.log('connected');
    });

    this.input.gamepad.on(
      'down',
      (
        pad: Phaser.Input.Gamepad.Gamepad,
        button: Phaser.Input.Gamepad.Button,
        index: number,
      ) => {
        console.log({ pad, button, index });

        if (this.gamepad == null) {
          pad.setAxisThreshold(0.3);
          this.gamepad = pad;
        }
      },
      this,
    );
  }

  update() {
    if (!this.gamepad) return;

    this.player!.setAngularVelocity(300 * this.gamepad!.leftStick.x);

    if (this.gamepad.leftStick.y <= 0) {
      this.physics.velocityFromRotation(
        this.player!.rotation,
        Math.abs(800 * this.gamepad.leftStick.y),
        (this.player!.body as Phaser.Physics.Arcade.Body).acceleration,
      );
    }
  }
}
