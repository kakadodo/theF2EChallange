let game, emitter, controller, alignGrid;
// store game data
class GameModal {
  constructor() {
    this.gameDueTime = 0;
    this.isPlay = false;
    this.duckMoveSpeed = 150;
    this.objSpeed = 150;
    this.fireBallTime = 3;
    this.isSuperDuck = false;
  }
}
// emitter controler
class Controller {
  constructor() {
    emitter.on("setDuckMoveSpeed", this.setDuckMoveSpeed);
    emitter.on("restartGame", this.restartGame);
  }
  setDuckMoveSpeed(speed) {
    modal.duckMoveSpeed = speed;
  }
  restartGame() {
    modal.gameDueTime = 0;
    modal.isPlay = false;
    modal.duckMoveSpeed = 150;
    modal.objSpeed = 100;
    modal.fireBallTime = 3;
    modal.isSuperDuck = false;
    game.scene.start("SceneStart", true);
  }
}
const modal = new GameModal();
const uiConfig = {
  canvasBgColor: "0x000000",
  fontFamily: "Roboto, 'Microsoft JhengHei'",
  gridColWidth: 75,
  gridColHeight: 150,
  gameTime: 90
};

window.onload = function () {
  WebFont.load({
    google: {
      families: ["Roboto"]
    }
  });
  // Phaser game config
  const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    backgroundColor: uiConfig.canvasBgColor,
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
    parent: "game",
    scale: {
      parent: "game",
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1200,
      height: 900
    },
    scene: [SceneLoad, SceneStart]
  };

  game = new Phaser.Game(config);
};

class SceneLoad extends Phaser.Scene {
  constructor() {
    super("SceneLoad");
  }
  preload() {
    // progress bar event listener
    this.progressText = this.add.text(
      game.config.width / 2,
      game.config.height / 2,
      "0%", {
        color: "#ffffff",
        fontFamily: uiConfig.fontFamily,
        fontSize: game.config.width / 40
      }
    );
    this.progressText.setOrigin(0.5);
    this.load.on("progress", this.onProgress, this);
    // 場景加載的資源
    this.load.image("bgTop", "./img/2nd-week5/bg_top.png");
    this.load.image("bgMiddle", "./img/2nd-week5/bg_middle.png");
    this.load.image("bgBottom", "./img/2nd-week5/bg_bottom.png");
    this.load.image("boss1", "./img/2nd-week5/boss1.png");
    this.load.image("boss2", "./img/2nd-week5/boss2.png");
    this.load.image("goal", "./img/2nd-week5/goal.png");
    this.load.image("superStar", "./img/2nd-week5/superStar.png");
    this.load.spritesheet("ballSprite", "./img/2nd-week5/ball_sprite.png", {
      frameWidth: 110,
      frameHeight: 110
    });
    this.load.spritesheet("duckSprite", "./img/2nd-week5/duck_sprite.png", {
      frameWidth: 124,
      frameHeight: 150
    });
    this.load.spritesheet(
      "btnLeftSprite",
      "./img/2nd-week5/btnLeft_sprite.png", {
        frameWidth: 50,
        frameHeight: 55
      }
    );
    this.load.spritesheet(
      "btnRightSprite",
      "./img/2nd-week5/btnRight_sprite.png", {
        frameWidth: 50,
        frameHeight: 55
      }
    );
    this.load.spritesheet("btnStart", "./img/2nd-week5/btnStart_sprite.png", {
      frameWidth: 150,
      frameHeight: 55
    });
    this.load.spritesheet("clearSprite", "./img/2nd-week5/clear_sprite.png", {
      frameWidth: 190,
      frameHeight: 155
    });
  }
  create() {
    // create event emitter
    emitter = new Phaser.Events.EventEmitter();
    // create emitter controler
    controller = new Controller();
    this.title = this.add.text(
      game.config.width / 2,
      game.config.height / 2 - 250,
      "90sec Game", {
        color: "#FDD23F",
        stroke: "#F49C24",
        strokeThickness: 6,
        fontFamily: uiConfig.fontFamily,
        fontSize: 72,
        shadow: {
          color: "#9A7B5D",
          blur: 2,
          fill: true,
          offsetY: 5
        }
      }
    );
    this.title.setOrigin(0.5);
    this.duck = this.add.sprite(
      game.config.width / 2,
      game.config.height / 2 - 110,
      "duckSprite"
    );
    this.anims.create({
      key: "walk",
      frames: [{
        key: "duckSprite",
        frame: 0
      },
      {
        key: "duckSprite",
        frame: 1
      },
      {
        key: "duckSprite",
        frame: 2
      }
      ],
      frameRate: 8,
      repeat: -1
    });
    this.duck.play("walk");
    this.btnStart = new FlatButton({
      scene: this,
      key: "btnStart",
      text: "開始遊戲",
      x: game.config.width / 2,
      y: game.config.height / 2 + 100,
      event: "startGame"
    });
    emitter.on("startGame", this.startGame, this);
  }
  onProgress(val) {
    this.progressText.setText(Math.floor(val * 100) + "%");
  }
  startGame() {
    this.scene.start("SceneStart");
  }
}

class SceneStart extends Phaser.Scene {
  constructor() {
    super("SceneStart");
  }
  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    // 限制邊界在池塘中
    this.physics.world.setBounds(
      uiConfig.gridColWidth * 3,
      - uiConfig.gridColHeight * 5,
      uiConfig.gridColWidth * 10,
      uiConfig.gridColHeight * 15
    );
    this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
  }
  create() {
    // gridSystem
    var gridConfig = {
      rows: 6,
      cols: 16,
      scene: this
    };
    alignGrid = new AlignGrid(gridConfig);

    // create game objects
    this.bgMiddle = this.add.tileSprite(
      game.config.width / 2,
      game.config.height / 2,
      game.config.width,
      game.config.height,
      "bgMiddle"
    );
    this.bgBottom = new Wall({
      scene: this,
      x: game.config.width / 2,
      y: game.config.height - 121,
      key: "bgBottom",
      origin: {
        x: 0.5,
        y: 0
      }
    });
    this.bgTop = new Wall({
      scene: this,
      x: game.config.width / 2,
      y: -121,
      key: "bgTop",
      origin: {
        x: 0.5,
        y: 0
      }
    });

    this.ballGroup = this.physics.add.group();
    this.superStarGroup = this.physics.add.group();

    this.duck = this.physics.add.sprite(
      game.config.width / 2,
      game.config.height / 2 - 110,
      "duckSprite"
    );
    this.duck.setCollideWorldBounds(true);
    this.duck.setImmovable(true);
    this.duck.setSize(60, 120);
    this.anims.create({
      key: "swim",
      frames: [{
        key: "duckSprite",
        frame: 0
      },
      {
        key: "duckSprite",
        frame: 1
      },
      {
        key: "duckSprite",
        frame: 2
      }
      ],
      frameRate: 5,
      repeat: -1
    });
    this.duck.play("swim");
    this.anims.create({
      key: "rush",
      frames: [{
        key: "duckSprite",
        frame: 3
      },
      {
        key: "duckSprite",
        frame: 4
      },
      {
        key: "duckSprite",
        frame: 5
      }
      ],
      frameRate: 8,
      repeat: -1
    });

    this.createTimeBoxCon();

    // alignGrid.showNumbers();
    alignGrid.placeAt(7, 4, this.duck);

    // set Timer
    this.countDownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.checkCountDownTimer,
      callbackScope: this,
      repeat: 3
    });

    this.btnLeft = this.add.sprite(
      game.config.width - 200,
      game.config.height - 100,
      "btnLeftSprite"
    );

    this.btnRight = this.add.sprite(
      game.config.width - 145,
      game.config.height - 100,
      "btnRightSprite"
    );

    this.physics.add.collider(
      this.ballGroup
    );
    this.physics.add.collider(
      this.duck,
      this.ballGroup,
      this.hitTheBall.bind(this)
    );
    this.physics.add.collider(
      this.ballGroup,
      this.superStarGroup,
    );
    this.physics.add.overlap(
      this.duck,
      this.superStarGroup,
      this.hitTheSuperStar.bind(this)
    );
  }
  update() {
    if (modal.isPlay) {
      if (modal.isSuperDuck) {
        this.bgMiddle.tilePositionY -= 0.02 * modal.objSpeed;
      } else {
        this.bgMiddle.tilePositionY -= 0.005 * modal.objSpeed;
      }
      this.duck.body.velocity.x = 0;
      if (this.cursors.left.isDown) {
        this.duck.body.velocity.x = -modal.duckMoveSpeed;
        this.btnLeft.setFrame(1);
        this.btnLeft.y = game.config.height - 95;
      } else if (this.cursors.right.isDown) {
        this.duck.body.velocity.x = modal.duckMoveSpeed;
        this.btnRight.setFrame(1);
        this.btnRight.y = game.config.height - 95;
      } else {
        this.btnLeft.setFrame(0);
        this.btnRight.setFrame(0);
        this.btnLeft.y = game.config.height - 100;
        this.btnRight.y = game.config.height - 100;
      }
      if (
        this.boss1 &&
        this.boss1.y > game.config.height + this.boss1.height / 2
      ) {
        this.boss1.setActive(false);
        this.boss1.setVisible(false);
        this.boss1.destroy();
      }
      if (
        this.boss2 &&
        this.boss2.y > game.config.height + this.boss2.height / 2
      ) {
        this.boss2.setActive(false);
        this.boss2.setVisible(false);
        this.boss2.destroy();
      }
      this.ballGroup.children.iterate(function (ball) {
        if (ball && ball.y > game.config.height + ball.height / 2) {
          ball.setActive(false);
          ball.setVisible(false);
          ball.destroy();
        }
      }, this);
      this.superStarGroup.children.iterate(function (star) {
        if (star && star.y > game.config.height + star.height / 2) {
          star.setActive(false);
          star.setVisible(false);
          star.destroy();
        }
      }, this);

      // physics collider
      this.physics.add.collider(
        this.ballGroup,
        this.boss1,
      );
      this.physics.add.collider(
        this.ballGroup,
        this.boss2,
      );
      this.physics.add.collider(
        this.duck,
        this.boss1,
        this.hitTheBoss.bind(this)
      );
      this.physics.add.collider(
        this.duck,
        this.boss2,
        this.hitTheBoss.bind(this)
      );
    }
  }
  checkGameTime() {
    if (this.countDueTimer) {
      const elapsedTime = uiConfig.gameTime - modal.gameDueTime;
      if (elapsedTime >= 0) {
        let minute = "0" + Math.floor(elapsedTime / 60);
        let second = (elapsedTime - minute * 60).toString();
        second = second.length === 2 ? second : "0" + second;
        this.timeText.setText(`${minute}:${second}`);
      } else {
        this.countDueTimer.remove();
        modal.isPlay = false;
      }
    }
  }
  checkCountDownTimer() {
    if (this.countDownText) {
      this.countDownText.destroy();
    }
    this.countDownText = this.add.text(
      game.config.width / 2,
      game.config.height / 2,
      this.countDownTimer.getRepeatCount(), {
        fontFamily: uiConfig.fontFamily,
        fontSize: 150
      }
    );
    this.countDownText.setOrigin(0.5);
    if (this.countDownTimer.getRepeatCount() === 0) {
      this.countDownText.destroy();
      this.countDueTimer = this.time.addEvent({
        delay: 1000,
        callback: this.checkCountDueTimer,
        callbackScope: this,
        repeat: uiConfig.gameTime
      });
      modal.isPlay = true;
      this.tweens.add({
        targets: this.bgBottom,
        duration: 1000,
        y: game.config.height
      });
      this.fireBall();
    }
  }
  checkCountDueTimer() {
    if (modal.isPlay) {
      // console.log(this.ballGroup.getChildren());
      modal.gameDueTime++;
      if (modal.gameDueTime % 20 === 0) {
        modal.objSpeed += 50;
      }
      if (
        modal.gameDueTime % modal.fireBallTime === 0 &&
        modal.gameDueTime < 80
      ) {
        this.fireBall();
      }
      if (modal.gameDueTime % 10 === 0 && modal.gameDueTime < 85) {
        this.fireSuperStar();
      }
      if (modal.gameDueTime === 30) {
        modal.fireBallTime = 2;
      }
      if (modal.gameDueTime === 50) {
        this.fireBoss1();
      }
      if (modal.gameDueTime === 60) {
        modal.fireBallTime = 1;
      }
      if (modal.gameDueTime === 82) {
        this.fireBoss2();
      }
      if (modal.gameDueTime === uiConfig.gameTime) {
        this.tweens.add({
          targets: this.bgTop,
          duration: 1000,
          y: 0
        });
        this.createGoal();
        this.endGame();
      }
      this.checkGameTime();
    }
  }
  checkBecomeSuperTimer() {
    if (this.becomeSuperTimer.getRepeatCount() === 0) {
      this.duck.anims.stop();
      this.duck.play("swim");
      modal.isSuperDuck = false;
      modal.duckMoveSpeed = 150;
    }
  }
  createTimeBoxCon() {
    this.timeBox = this.add.graphics();
    this.timeBox.fillStyle(0x535353);
    this.timeBox.fillRoundedRect(
      0,
      10,
      uiConfig.gridColWidth * 3,
      uiConfig.gridColHeight,
      30
    );
    this.timeBox.fillStyle(0x000000);
    this.timeBox.fillRoundedRect(
      0,
      0,
      uiConfig.gridColWidth * 3,
      uiConfig.gridColHeight,
      30
    );
    this.subTimeText = this.add.text(uiConfig.gridColWidth / 2, 40, "TIME", {
      fontFamily: uiConfig.fontFamily,
      fontSize: 20
    });
    this.timeText = this.add.text(
      uiConfig.gridColWidth + uiConfig.gridColWidth / 2,
      uiConfig.gridColHeight - 50,
      "01:30", {
        fontFamily: uiConfig.fontFamily,
        fontSize: 60
      }
    );
    this.timeText.setOrigin(0.5);
    this.timeBoxCon = this.add.container();
    this.timeBoxCon.add(this.timeBox);
    this.timeBoxCon.add(this.subTimeText);
    this.timeBoxCon.add(this.timeText);
    this.timeBoxCon.x = uiConfig.gridColWidth * 13;
    this.timeBoxCon.y = -20;
  }
  createGoal() {
    this.goal = this.add.image(0, 0, "goal");
    alignGrid.placeAt(8, 1, this.goal);
    this.goal.setScale(0);
    this.goal.opacity = 0;
    this.tweens.add({
      targets: this.goal,
      duration: 1000,
      delay: 1000,
      scale: 1,
      opacity: 1
    });
  }
  endGame() {
    if (modal.isPlay) {
      this.tweens.add({
        targets: this.duck,
        duration: 1500,
        delay: 2000,
        x: 650,
        y: 370
      });
      setTimeout(() => {
        this.gameOverScreen = new GameOverScreen({
          scene: this,
          x: game.config.width / 2,
          y: game.config.height / 2,
          title: "Congratulations! 恭喜過關!",
          btnText: "再來一次..",
          gameSuccess: true
        });
        for (let i = 1; i <= 3; i++) {
          this.tweens.add({
            targets: this.gameOverScreen[`clear${i}`],
            duration: 1500,
            delay: i * 500,
            alpha: 1
          });
        }
      }, 4200);
    }
  }
  fireBall() {
    let amount = Math.floor(Math.random() * 3 + 1);
    for (let i = 0; i < amount; i++) {
      let ball = this.ballGroup.getFirstDead(false);
      if (!ball) {
        ball = this.ballGroup.create(0, 0, "ballSprite");
      }
      alignGrid.placeAt(getRandomColumn(3, 10), 0, ball);
      ball.y = -ball.height;
      ball.setSize(90, 90);
      ball.setScale(0.7);
      ball.setCollideWorldBounds(true);
      ball.setFrame(Math.floor(Math.random() * 4));
      ball.setActive(true);
      ball.setVisible(true);
      ball.setVelocityY(modal.objSpeed);
      if (modal.gameDueTime > 60) {
        const randomDirection = Math.random() < 0.5;
        ball.setVelocityX(randomDirection ? modal.objSpeed / 2 : -modal.objSpeed / 2);
        ball.setBounceX(0.5);
      }
    }
  }
  fireBoss1() {
    this.boss1 = this.physics.add.sprite(0, 0, "boss1");
    alignGrid.placeAt(getRandomColumn(4, 7), 0, this.boss1);
    this.boss1.y = -this.boss1.height;
    this.boss1.setSize(350, 250);
    this.boss1.setActive(true);
    this.boss1.setVisible(true);
    this.boss1.setCollideWorldBounds(true);
    this.boss1.setVelocityY(modal.objSpeed * 0.8);
  }
  fireBoss2() {
    this.boss2 = this.physics.add.sprite(0, 0, "boss2");
    alignGrid.placeAt(getRandomColumn(5, 5), 0, this.boss2);
    this.boss2.y = -this.boss2.height;
    this.boss2.setSize(550, 300);
    this.boss2.setScale(0.9);
    this.boss2.setActive(true);
    this.boss2.setVisible(true);
    this.boss2.setCollideWorldBounds(true);
    this.boss2.setVelocityY(modal.objSpeed * 0.8);
  }
  fireSuperStar() {
    let superStar = this.superStarGroup.getFirstDead(false);
    if (!superStar) {
      superStar = this.superStarGroup.create(0, 0, "superStar");
    }
    alignGrid.placeAt(getRandomColumn(3, 10), 0, superStar);
    superStar.y = -superStar.height;
    superStar.setSize(70, 70);
    superStar.setActive(true);
    superStar.setVisible(true);
    superStar.setVelocityY(modal.objSpeed * 0.6);
  }
  hitTheBall(duck, ball) {
    if (modal.isPlay) {
      modal.isPlay = false;
      this.ballGroup.setVelocityY(0);
      this.superStarGroup.setVelocityY(0);
      if (this.boss1 && this.boss1.body) {
        this.boss1.setVelocityY(0);
      }
      if (this.boss2 && this.boss2.body) {
        this.boss2.setVelocityY(0);
      }
      this.duck.anims.stop();
      this.duck.setFrame(6);
      duck.body.velocity.x = 0;
      this.gameOverScreen = new GameOverScreen({
        scene: this,
        x: game.config.width / 2,
        y: game.config.height / 2,
        title: "UH-OH! 觸礁了",
        subTitle: "勝敗乃鴨家常事，大俠重新來過吧~",
        btnText: "重新挑戰",
        gameSuccess: false
      });
    }
  }
  hitTheBoss(duck, boss) {
    if (modal.isPlay) {
      modal.isPlay = false;
      boss.setVelocityY(0);
      this.ballGroup.setVelocityY(0);
      this.superStarGroup.setVelocityY(0);
      this.duck.anims.stop();
      this.duck.setFrame(6);
      duck.body.velocity.x = 0;
      this.gameOverScreen = new GameOverScreen({
        scene: this,
        x: game.config.width / 2,
        y: game.config.height / 2,
        title: "UH-OH! 觸礁了",
        subTitle: "勝敗乃鴨家常事，大俠重新來過吧~",
        btnText: "重新挑戰",
        gameSuccess: false
      });
    }
  }
  hitTheSuperStar(duck, star) {
    if (modal.isPlay) {
      this.duck.anims.stop();
      this.duck.play("rush");
      modal.duckMoveSpeed = 300;
      modal.isSuperDuck = true;
      this.killSprite("ballGroup");
      this.killSprite("superStarGroup");
      if (this.boss1) {
        this.tweens.add({
          targets: this.boss1,
          duration: 500,
          alpha: 0,
          onComplete: () => {
            this.boss1.body = null;
            this.boss1.destroy();
          }
        });
      }
      if (this.boss2) {
        this.tweens.add({
          targets: this.boss2,
          duration: 500,
          alpha: 0,
          onComplete: () => {
            this.boss2.body = null;
            this.boss2.destroy();
          }
        });
      }
      this.becomeSuperTimer = this.time.addEvent({
        delay: 1000,
        callback: this.checkBecomeSuperTimer,
        callbackScope: this,
        repeat: 3
      });
    }
  }
  killSprite(groupName) {
    this[groupName].getChildren().map(child => child.destroy());
  }
}

// btn class
class FlatButton extends Phaser.GameObjects.Container {
  constructor(config) {
    if (!config.scene) {
      return;
    }
    super(config.scene);
    this.scene = config.scene;
    this.config = config;
    this.btn = this.scene.add.sprite(0, 0, config.key);
    this.add(this.btn);
    if (config.text) {
      this.text = this.scene.add.text(0, 0, config.text, {
        fontFamily: uiConfig.fontFamily,
        fontSize: 30
      });
      this.text.setOrigin(0.5);
      this.add(this.text);
    }
    if (config.x) {
      this.x = config.x;
    }
    if (config.y) {
      this.y = config.y;
    }
    if (config.event) {
      this.btn.setInteractive({
        cursor: "pointer"
      });
      this.btn.on("pointerdown", this.onPointerdown, this);
      this.btn.on("pointerup", this.onPointerup, this);
    }
    this.scene.add.existing(this);
  }
  onPointerdown() {
    this.btn.setFrame(1);
    this.y += 5;
  }
  onPointerup() {
    this.btn.setFrame(0);
    this.y -= 5;
    emitter.emit(this.config.event);
  }
}

// wall class
class Wall extends Phaser.GameObjects.Container {
  constructor(config) {
    if (!config.scene) {
      return;
    }
    super(config.scene);
    this.scene = config.scene;
    this.config = config;
    this.wall = this.scene.add.image(0, 0, config.key);
    this.graphics = this.scene.add.graphics();
    this.graphics.fillStyle(0x000000);
    this.graphics.fillRect(
      -game.config.width,
      0,
      game.config.width + game.config.width / 2,
      121
    );
    this.add(this.graphics);
    this.add(this.wall);
    if (config.x) {
      this.x = config.x;
    }
    if (config.y) {
      this.y = config.y;
    }
    if (config.origin) {
      const {
        x,
        y
      } = config.origin;
      this.wall.setOrigin(x, y);
    }
    this.scene.add.existing(this);
  }
  onPointerdown() {
    this.btn.setFrame(1);
    this.y += 5;
  }
  onPointerup() {
    this.btn.setFrame(0);
    emitter.emit(this.config.event);
  }
}

// gameOver class
class GameOverScreen extends Phaser.GameObjects.Container {
  constructor(config) {
    if (!config.scene) {
      return;
    }
    super(config.scene);
    this.scene = config.scene;
    this.config = config;
    this.graphics = this.scene.add.graphics();
    this.graphics.fillStyle(0x000000, 0.5);
    this.graphics.fillRect(
      -game.config.width / 2,
      -game.config.height / 2,
      game.config.width,
      game.config.height
    );
    this.graphics.fillStyle(0xffffff);
    this.graphics.fillRoundedRect(
      0 - uiConfig.gridColWidth * 4,
      0 - uiConfig.gridColHeight,
      uiConfig.gridColWidth * 8,
      uiConfig.gridColHeight * 2,
      30
    );
    this.add(this.graphics);
    if (config.gameSuccess) {
      this.title = this.scene.add.text(0, -110, config.title, {
        color: "#ff952b",
        fontFamily: uiConfig.fontFamily,
        fontSize: 36
      });
    } else {
      this.title = this.scene.add.text(0, -60, config.title, {
        color: "#ff952b",
        fontFamily: uiConfig.fontFamily,
        fontSize: 36
      });
    }
    this.title.setOrigin(0.5);
    this.add(this.title);
    if (config.gameSuccess) {
      this.clear1 = this.scene.add.sprite(-200, 0, "clearSprite", 0);
      this.clear2 = this.scene.add.sprite(0, 0, "clearSprite", 1);
      this.clear3 = this.scene.add.sprite(200, 0, "clearSprite", 2);
      this.clear1.alpha = 0;
      this.clear2.alpha = 0;
      this.clear3.alpha = 0;
      this.add(this.clear1);
      this.add(this.clear2);
      this.add(this.clear3);
    } else {
      this.subTitle = this.scene.add.text(0, -10, config.subTitle, {
        color: "#707070",
        fontFamily: uiConfig.fontFamily,
        fontSize: 20
      });
      this.subTitle.setOrigin(0.5);
      this.add(this.subTitle);
    }
    if (config.gameSuccess) {
      this.btnRestart = new FlatButton({
        scene: config.scene,
        key: "btnStart",
        text: config.btnText,
        x: 0,
        y: 110,
        event: "restartGame"
      });
    } else {
      this.btnRestart = new FlatButton({
        scene: config.scene,
        key: "btnStart",
        text: config.btnText,
        x: 0,
        y: 50,
        event: "restartGame"
      });
    }
    this.add(this.btnRestart);
    if (config.x) {
      this.x = config.x;
    }
    if (config.y) {
      this.y = config.y;
    }
    this.scene.add.existing(this);
  }
  onPointerdown() {
    this.btn.setFrame(1);
    this.y += 5;
  }
  onPointerup() {
    this.btn.setFrame(0);
    emitter.emit(this.config.event);
  }
}

// gridSystem
class AlignGrid {
  constructor(config) {
    if (!config.scene) {
      return;
    }
    this.config = config;
    this.config.row = config.rows || 6;
    this.config.cols = config.cols || 5;
    this.config.width = config.width || game.config.width;
    this.config.height = config.height || game.config.height;

    this.scene = config.scene;
    this.cw = this.config.width / this.config.cols;
    this.ch = this.config.height / this.config.rows;
  }
  show() {
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(2, 0x00ff00);
    for (let i = 0; i < this.config.width; i += this.cw) {
      this.graphics.moveTo(i, 0);
      this.graphics.lineTo(i, this.config.height);
    }
    for (let i = 0; i < this.config.height; i += this.ch) {
      this.graphics.moveTo(0, i);
      this.graphics.lineTo(this.config.width, i);
    }
    this.graphics.strokePath();
  }
  placeAt(xx, yy, obj) {
    obj.x = this.cw * xx + this.cw / 2;
    obj.y = this.ch * yy + this.ch / 2;
  }
  placeAtIndex(index, obj) {
    // 另一種指定位置的方式，以格數來指定
    var xx = index % this.cols;
    var yy = Math.floor(index / this.cols);
    this.placeAt(xx, yy, obj);
  }
  showNumbers() {
    // 在每一格中呈現當前的 index 數字
    this.show();
    var count = 0;
    for (var i = 0; i < this.config.rows; i++) {
      for (var j = 0; j < this.config.cols; j++) {
        var numText = this.scene.add.text(0, 0, count, "#00ff00");
        numText.setOrigin(0.5, 0.5);
        this.placeAtIndex(count, numText);
        count++;
      }
    }
  }
}

function getRandomColumn(min, max) {
  return Math.floor(Math.random() * max) + min;
}