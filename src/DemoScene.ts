import Phaser from 'phaser';
import shipUrl from '../assets/ship.png';

export class DemoScene extends Phaser.Scene {
  gamepad: Phaser.Input.Gamepad.Gamepad | null = null;
  player = {} as Phaser.Physics.Arcade.Image;

  leftStick = {
    x: {} as Phaser.Input.Gamepad.Axis,
    y: {} as Phaser.Input.Gamepad.Axis,
  };

  rightStick = {
    x: {} as Phaser.Input.Gamepad.Axis,
    y: {} as Phaser.Input.Gamepad.Axis,
  };

  // @ts-ignore
  inputText: Phaser.GameObjects.Text;

  preload() {
    this.load.image('ship', shipUrl);
  }

  create() {
    this.inputText = this.add.text(10, 10, [], {
      fill: '#ffffff',
    });

    // Create the player
    this.player = this.physics.add.image(
      +this.game.config.width / 2,
      +this.game.config.height / 2,
      'ship',
    );
    this.player.setDamping(true);
    this.player.setDrag(0.95);
    this.player.setMaxVelocity(400);
    this.player.setCollideWorldBounds(true);

    // Seems to require button press to fire this off
    this.input.gamepad.on('connected', () => {
      console.log('connected');
      console.log(this.input.gamepad.gamepads[0].id);
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
          pad.setAxisThreshold(0.5);

          this.gamepad = pad;
          this.leftStick = {
            x: pad.axes[0],
            y: pad.axes[1],
          };
          this.rightStick = {
            x: pad.axes[2],
            y: pad.axes[3],
          };
        }
      },
      this,
    );
  }

  update() {
    if (!this.gamepad) return;

    this.inputText.setText([
      `left: ${this.leftStick.x.value}, ${this.leftStick.y.value}`,
      `right: ${this.rightStick.x.value}, ${this.rightStick.y.value}`,
      `axes: ${this.gamepad.axes.length}`,
    ]);

    this.player.setAngularVelocity(200 * this.gamepad!.rightStick.x);

    if (this.gamepad.leftStick.y <= 0) {
      this.physics.velocityFromRotation(
        this.player.rotation,
        Math.abs(900 * this.gamepad.leftStick.y),
        (this.player.body as Phaser.Physics.Arcade.Body).acceleration,
      );
    }
  }
}
