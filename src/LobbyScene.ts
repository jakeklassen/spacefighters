import Phaser from 'phaser';
import shipUrl from '../assets/ship.png';

class Player {
  public index = -1;

  leftStick = {
    x: {} as Phaser.Input.Gamepad.Axis,
    y: {} as Phaser.Input.Gamepad.Axis,
  };

  rightStick = {
    x: {} as Phaser.Input.Gamepad.Axis,
    y: {} as Phaser.Input.Gamepad.Axis,
  };

  constructor(
    public gamepad: Phaser.Input.Gamepad.Gamepad,
    public body: Phaser.Physics.Arcade.Image,
  ) {
    this.index = gamepad.index;
  }
}

export class LobbyScene extends Phaser.Scene {
  players: Player[] = [];

  // @ts-ignore
  inputText: Phaser.GameObjects.Text;

  preload() {
    this.load.image('ship', shipUrl);
  }

  create() {
    this.inputText = this.add.text(10, 10, [], {
      fill: '#ffffff',
    });

    console.log(this.input.gamepad.gamepads);

    // Seems to require button press to fire this off
    this.input.gamepad.on('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      console.log('connected');
      console.log(this.input.gamepad.gamepads.map(pad => pad.id));

      const existingPlayer = this.players.find(
        player => player.gamepad.id === pad.id,
      );

      if (existingPlayer != null) {
        return;
      }

      pad.setAxisThreshold(0.5);

      // Create a player
      const playerImage = this.physics.add.image(
        +this.game.config.width / 2,
        +this.game.config.height / 2,
        'ship',
      );

      playerImage.setDamping(true);
      playerImage.setDrag(0.95);
      playerImage.setMaxVelocity(400);
      playerImage.setCollideWorldBounds(true);

      const player = new Player(pad, playerImage);

      this.players.push(player);

      // this.input.gamepad.on(
      //   'down',
      //   (
      //     pad: Phaser.Input.Gamepad.Gamepad,
      //     button: Phaser.Input.Gamepad.Button,
      //     index: number,
      //   ) => {
      //     console.log({ pad, button, index });

      //     if (this.gamepad == null) {
      //       pad.setAxisThreshold(0.5);

      //       this.gamepad = pad;
      //       this.leftStick = {
      //         x: pad.axes[0],
      //         y: pad.axes[1],
      //       };
      //       this.rightStick = {
      //         x: pad.axes[2],
      //         y: pad.axes[3],
      //       };
      //     }
      //   },
      //   this,
      // );

      pad.on(
        'down',
        (index: number, value: number, button: Phaser.Input.Gamepad.Button) => {
          player.leftStick = {
            x: pad.axes[0],
            y: pad.axes[1],
          };

          player.rightStick = {
            x: pad.axes[2],
            y: pad.axes[3],
          };
        },
        this,
      );
    });
  }

  update() {
    for (const player of this.players) {
      if (player.gamepad == null) {
        continue;
      }

      player.body.setAngularVelocity(200 * player.gamepad.rightStick.x);

      if (player.gamepad.leftStick.y <= 0) {
        this.physics.velocityFromRotation(
          player.body.rotation,
          Math.abs(900 * player.gamepad.leftStick.y),
          ((player.body as unknown) as Phaser.Physics.Arcade.Body).acceleration,
        );
      }
    }
  }
}
