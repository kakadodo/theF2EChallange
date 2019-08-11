"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var game = void 0,
    emitter = void 0,
    controller = void 0,
    alignGrid = void 0;
// store game data

var GameModal = function GameModal() {
  _classCallCheck(this, GameModal);

  this.gameDueTime = 0;
  this.isPlay = false;
  this.duckMoveSpeed = 150;
  this.objSpeed = 100;
  this.fireBallTime = 3;
};
// emitter controler


var Controller = function () {
  function Controller() {
    _classCallCheck(this, Controller);

    emitter.on("setDuckMoveSpeed", this.setDuckMoveSpeed);
    emitter.on("restartGame", this.restartGame);
  }

  _createClass(Controller, [{
    key: "setDuckMoveSpeed",
    value: function setDuckMoveSpeed(speed) {
      modal.duckMoveSpeed = speed;
    }
  }, {
    key: "restartGame",
    value: function restartGame() {
      modal.gameDueTime = 0;
      modal.isPlay = false;
      modal.duckMoveSpeed = 150;
      modal.objSpeed = 100;
      modal.fireBallTime = 3;
      game.scene.start("SceneStart", true);
    }
  }]);

  return Controller;
}();

var modal = new GameModal();
var uiConfig = {
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
  var config = {
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

var SceneLoad = function (_Phaser$Scene) {
  _inherits(SceneLoad, _Phaser$Scene);

  function SceneLoad() {
    _classCallCheck(this, SceneLoad);

    return _possibleConstructorReturn(this, (SceneLoad.__proto__ || Object.getPrototypeOf(SceneLoad)).call(this, "SceneLoad"));
  }

  _createClass(SceneLoad, [{
    key: "preload",
    value: function preload() {
      // progress bar event listener
      this.progressText = this.add.text(game.config.width / 2, game.config.height / 2, "0%", {
        color: "#ffffff",
        fontFamily: uiConfig.fontFamily,
        fontSize: game.config.width / 40
      });
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
      this.load.spritesheet("btnLeftSprite", "./img/2nd-week5/btnLeft_sprite.png", {
        frameWidth: 50,
        frameHeight: 55
      });
      this.load.spritesheet("btnRightSprite", "./img/2nd-week5/btnRight_sprite.png", {
        frameWidth: 50,
        frameHeight: 55
      });
      this.load.spritesheet("btnStart", "./img/2nd-week5/btnStart_sprite.png", {
        frameWidth: 150,
        frameHeight: 55
      });
      this.load.spritesheet("clearSprite", "./img/2nd-week5/clear_sprite.png", {
        frameWidth: 190,
        frameHeight: 155
      });
    }
  }, {
    key: "create",
    value: function create() {
      // create event emitter
      emitter = new Phaser.Events.EventEmitter();
      // create emitter controler
      controller = new Controller();
      this.title = this.add.text(game.config.width / 2, game.config.height / 2 - 250, "90sec Game", {
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
      });
      this.title.setOrigin(0.5);
      this.duck = this.add.sprite(game.config.width / 2, game.config.height / 2 - 110, "duckSprite");
      this.anims.create({
        key: "walk",
        frames: [{
          key: "duckSprite",
          frame: 0
        }, {
          key: "duckSprite",
          frame: 1
        }, {
          key: "duckSprite",
          frame: 2
        }],
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
  }, {
    key: "onProgress",
    value: function onProgress(val) {
      this.progressText.setText(Math.floor(val * 100) + "%");
    }
  }, {
    key: "startGame",
    value: function startGame() {
      this.scene.start("SceneStart");
    }
  }]);

  return SceneLoad;
}(Phaser.Scene);

var SceneStart = function (_Phaser$Scene2) {
  _inherits(SceneStart, _Phaser$Scene2);

  function SceneStart() {
    _classCallCheck(this, SceneStart);

    return _possibleConstructorReturn(this, (SceneStart.__proto__ || Object.getPrototypeOf(SceneStart)).call(this, "SceneStart"));
  }

  _createClass(SceneStart, [{
    key: "init",
    value: function init() {
      this.cursors = this.input.keyboard.createCursorKeys();
      // 限制邊界在池塘中
      this.physics.world.setBounds(uiConfig.gridColWidth * 2, uiConfig.gridColHeight * 1, uiConfig.gridColWidth * 12, uiConfig.gridColHeight * 4);
      this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
    }
  }, {
    key: "create",
    value: function create() {
      // gridSystem
      var gridConfig = {
        rows: 6,
        cols: 16,
        scene: this
      };
      alignGrid = new AlignGrid(gridConfig);

      // create game objects
      this.bgMiddle = this.add.image(game.config.width / 2, game.config.height / 2, "bgMiddle");
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

      this.duck = this.physics.add.sprite(game.config.width / 2, game.config.height / 2 - 110, "duckSprite");
      this.duck.setCollideWorldBounds(true);
      this.anims.create({
        key: "swim",
        frames: [{
          key: "duckSprite",
          frame: 0
        }, {
          key: "duckSprite",
          frame: 1
        }, {
          key: "duckSprite",
          frame: 2
        }],
        frameRate: 3,
        repeat: -1
      });
      this.duck.play("swim");
      this.anims.create({
        key: "rush",
        frames: [{
          key: "duckSprite",
          frame: 3
        }, {
          key: "duckSprite",
          frame: 4
        }, {
          key: "duckSprite",
          frame: 5
        }],
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

      this.btnLeft = this.add.sprite(game.config.width - 200, game.config.height - 100, "btnLeftSprite");

      this.btnRight = this.add.sprite(game.config.width - 145, game.config.height - 100, "btnRightSprite");
    }
  }, {
    key: "update",
    value: function update() {
      if (modal.isPlay) {
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
        if (this.boss1 && this.boss1.y > game.config.height + this.boss1.height / 2) {
          this.boss1.setActive(false);
          this.boss1.setVisible(false);
          this.boss1.destroy();
        }
        if (this.boss2 && this.boss2.y > game.config.height + this.boss2.height / 2) {
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
        this.physics.add.collider(this.duck, this.ballGroup, this.hitTheBall.bind(this));
        this.physics.add.collider(this.duck, this.boss1, this.hitTheBoss.bind(this));
        this.physics.add.collider(this.duck, this.boss2, this.hitTheBoss.bind(this));
        this.physics.add.overlap(this.duck, this.superStarGroup, this.hitTheSuperStar.bind(this));
      }
    }
  }, {
    key: "checkGameTime",
    value: function checkGameTime() {
      if (this.countDueTimer) {
        var elapsedTime = uiConfig.gameTime - modal.gameDueTime;
        if (elapsedTime >= 0) {
          var minute = "0" + Math.floor(elapsedTime / 60);
          var second = (elapsedTime - minute * 60).toString();
          second = second.length === 2 ? second : "0" + second;
          this.timeText.setText(minute + ":" + second);
        } else {
          this.countDueTimer.remove();
          modal.isPlay = false;
        }
      }
    }
  }, {
    key: "checkCountDownTimer",
    value: function checkCountDownTimer() {
      if (this.countDownText) {
        this.countDownText.destroy();
      }
      this.countDownText = this.add.text(game.config.width / 2, game.config.height / 2, this.countDownTimer.getRepeatCount(), {
        fontFamily: uiConfig.fontFamily,
        fontSize: 150
      });
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
  }, {
    key: "checkCountDueTimer",
    value: function checkCountDueTimer() {
      if (modal.isPlay) {
        // console.log(this.ballGroup.getChildren());
        modal.gameDueTime++;
        if (modal.gameDueTime % modal.fireBallTime === 0 && modal.gameDueTime < 80) {
          this.fireBall();
        }
        if (modal.gameDueTime % 5 === 0 && modal.gameDueTime < 80) {
          this.fireSuperStar();
        }
        if (modal.gameDueTime === 30) {
          modal.objSpeed += 50;
          modal.fireBallTime = 2;
        }
        if (modal.gameDueTime === 50) {
          this.fireBoss1();
        }
        if (modal.gameDueTime === 60) {
          modal.objSpeed += 50;
          modal.fireBallTime = 1;
        }
        if (modal.gameDueTime === 80) {
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
  }, {
    key: "checkBecomeSuperTimer",
    value: function checkBecomeSuperTimer() {
      if (this.becomeSuperTimer.getRepeatCount() === 0) {
        this.duck.anims.stop();
        this.duck.play("swim");
        modal.duckMoveSpeed = 150;
      }
    }
  }, {
    key: "createTimeBoxCon",
    value: function createTimeBoxCon() {
      this.timeBox = this.add.graphics();
      this.timeBox.fillStyle(0x535353);
      this.timeBox.fillRoundedRect(0, 10, uiConfig.gridColWidth * 3, uiConfig.gridColHeight, 30);
      this.timeBox.fillStyle(0x000000);
      this.timeBox.fillRoundedRect(0, 0, uiConfig.gridColWidth * 3, uiConfig.gridColHeight, 30);
      this.subTimeText = this.add.text(uiConfig.gridColWidth / 2, 40, "TIME", {
        fontFamily: uiConfig.fontFamily,
        fontSize: 20
      });
      this.timeText = this.add.text(uiConfig.gridColWidth + uiConfig.gridColWidth / 2, uiConfig.gridColHeight - 50, "01:30", {
        fontFamily: uiConfig.fontFamily,
        fontSize: 60
      });
      this.timeText.setOrigin(0.5);
      this.timeBoxCon = this.add.container();
      this.timeBoxCon.add(this.timeBox);
      this.timeBoxCon.add(this.subTimeText);
      this.timeBoxCon.add(this.timeText);
      this.timeBoxCon.x = uiConfig.gridColWidth * 13;
      this.timeBoxCon.y = -20;
    }
  }, {
    key: "createGoal",
    value: function createGoal() {
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
  }, {
    key: "endGame",
    value: function endGame() {
      var _this3 = this;

      if (modal.isPlay) {
        this.tweens.add({
          targets: this.duck,
          duration: 1500,
          delay: 2000,
          x: 650,
          y: 370
        });
        setTimeout(function () {
          _this3.gameOverScreen = new GameOverScreen({
            scene: _this3,
            x: game.config.width / 2,
            y: game.config.height / 2,
            title: "Congratulations! 恭喜過關!",
            btnText: "再來一次..",
            gameSuccess: true
          });
          for (var i = 1; i <= 3; i++) {
            _this3.tweens.add({
              targets: _this3.gameOverScreen["clear" + i],
              duration: 1500,
              delay: i * 500,
              alpha: 1
            });
          }
        }, 4200);
      }
    }
  }, {
    key: "fireBall",
    value: function fireBall() {
      var ball = this.ballGroup.getFirstDead(false);
      if (!ball) {
        ball = this.ballGroup.create(0, 0, "ballSprite");
      }
      alignGrid.placeAt(getRandomColumn(3, 9), 0, ball);
      ball.y = -ball.height;
      ball.setScale(0.7);
      ball.setImmovable();
      ball.setFrame(Math.floor(Math.random() * 4));
      ball.setActive(true);
      ball.setVisible(true);
      ball.setVelocityY(modal.objSpeed);
    }
  }, {
    key: "fireBoss1",
    value: function fireBoss1() {
      this.boss1 = this.physics.add.sprite(0, 0, "boss1");
      alignGrid.placeAt(getRandomColumn(4, 6), 0, this.boss1);
      this.boss1.y = -this.boss1.height;
      this.boss1.setImmovable();
      this.boss1.setActive(true);
      this.boss1.setVisible(true);
      this.boss1.setVelocityY(modal.objSpeed);
    }
  }, {
    key: "fireBoss2",
    value: function fireBoss2() {
      this.boss2 = this.physics.add.sprite(0, 0, "boss2");
      alignGrid.placeAt(getRandomColumn(5, 4), 0, this.boss2);
      this.boss2.y = -this.boss2.height;
      this.boss2.setScale(0.9);
      this.boss2.setImmovable();
      this.boss2.setActive(true);
      this.boss2.setVisible(true);
      this.boss2.setVelocityY(modal.objSpeed);
    }
  }, {
    key: "fireSuperStar",
    value: function fireSuperStar() {
      var superStar = this.superStarGroup.getFirstDead(false);
      if (!superStar) {
        superStar = this.superStarGroup.create(0, 0, "superStar");
      }
      alignGrid.placeAt(getRandomColumn(3, 9), 0, superStar);
      superStar.y = -superStar.height;
      superStar.setImmovable();
      superStar.setActive(true);
      superStar.setVisible(true);
      superStar.setVelocityY(modal.objSpeed);
    }
  }, {
    key: "hitTheBall",
    value: function hitTheBall(duck, ball) {
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
  }, {
    key: "hitTheBoss",
    value: function hitTheBoss(duck, boss) {
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
  }, {
    key: "hitTheSuperStar",
    value: function hitTheSuperStar(duck, star) {
      var _this4 = this;

      if (modal.isPlay) {
        this.duck.anims.stop();
        this.duck.play("rush");
        modal.duckMoveSpeed = 300;
        this.killSprite("ballGroup");
        this.killSprite("superStarGroup");
        if (this.boss1) {
          this.tweens.add({
            targets: this.boss1,
            duration: 500,
            alpha: 0,
            onComplete: function onComplete() {
              _this4.boss1.body = null;
              _this4.boss1.destroy();
            }
          });
        }
        if (this.boss2) {
          this.tweens.add({
            targets: this.boss2,
            duration: 500,
            alpha: 0,
            onComplete: function onComplete() {
              _this4.boss2.body = null;
              _this4.boss2.destroy();
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
  }, {
    key: "killSprite",
    value: function killSprite(groupName) {
      this[groupName].getChildren().map(function (child) {
        return child.destroy();
      });
    }
  }]);

  return SceneStart;
}(Phaser.Scene);

// btn class


var FlatButton = function (_Phaser$GameObjects$C) {
  _inherits(FlatButton, _Phaser$GameObjects$C);

  function FlatButton(config) {
    _classCallCheck(this, FlatButton);

    if (!config.scene) {
      return _possibleConstructorReturn(_this5);
    }

    var _this5 = _possibleConstructorReturn(this, (FlatButton.__proto__ || Object.getPrototypeOf(FlatButton)).call(this, config.scene));

    _this5.scene = config.scene;
    _this5.config = config;
    _this5.btn = _this5.scene.add.sprite(0, 0, config.key);
    _this5.add(_this5.btn);
    if (config.text) {
      _this5.text = _this5.scene.add.text(0, 0, config.text, {
        fontFamily: uiConfig.fontFamily,
        fontSize: 30
      });
      _this5.text.setOrigin(0.5);
      _this5.add(_this5.text);
    }
    if (config.x) {
      _this5.x = config.x;
    }
    if (config.y) {
      _this5.y = config.y;
    }
    if (config.event) {
      _this5.btn.setInteractive({
        cursor: "pointer"
      });
      _this5.btn.on("pointerdown", _this5.onPointerdown, _this5);
      _this5.btn.on("pointerup", _this5.onPointerup, _this5);
    }
    _this5.scene.add.existing(_this5);
    return _this5;
  }

  _createClass(FlatButton, [{
    key: "onPointerdown",
    value: function onPointerdown() {
      this.btn.setFrame(1);
      this.y += 5;
    }
  }, {
    key: "onPointerup",
    value: function onPointerup() {
      this.btn.setFrame(0);
      this.y -= 5;
      emitter.emit(this.config.event);
    }
  }]);

  return FlatButton;
}(Phaser.GameObjects.Container);

// wall class


var Wall = function (_Phaser$GameObjects$C2) {
  _inherits(Wall, _Phaser$GameObjects$C2);

  function Wall(config) {
    _classCallCheck(this, Wall);

    if (!config.scene) {
      return _possibleConstructorReturn(_this6);
    }

    var _this6 = _possibleConstructorReturn(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).call(this, config.scene));

    _this6.scene = config.scene;
    _this6.config = config;
    _this6.wall = _this6.scene.add.image(0, 0, config.key);
    _this6.graphics = _this6.scene.add.graphics();
    _this6.graphics.fillStyle(0x000000);
    _this6.graphics.fillRect(-game.config.width, 0, game.config.width + game.config.width / 2, 121);
    _this6.add(_this6.graphics);
    _this6.add(_this6.wall);
    if (config.x) {
      _this6.x = config.x;
    }
    if (config.y) {
      _this6.y = config.y;
    }
    if (config.origin) {
      var _config$origin = config.origin,
          x = _config$origin.x,
          y = _config$origin.y;

      _this6.wall.setOrigin(x, y);
    }
    _this6.scene.add.existing(_this6);
    return _this6;
  }

  _createClass(Wall, [{
    key: "onPointerdown",
    value: function onPointerdown() {
      this.btn.setFrame(1);
      this.y += 5;
    }
  }, {
    key: "onPointerup",
    value: function onPointerup() {
      this.btn.setFrame(0);
      emitter.emit(this.config.event);
    }
  }]);

  return Wall;
}(Phaser.GameObjects.Container);

// gameOver class


var GameOverScreen = function (_Phaser$GameObjects$C3) {
  _inherits(GameOverScreen, _Phaser$GameObjects$C3);

  function GameOverScreen(config) {
    _classCallCheck(this, GameOverScreen);

    if (!config.scene) {
      return _possibleConstructorReturn(_this7);
    }

    var _this7 = _possibleConstructorReturn(this, (GameOverScreen.__proto__ || Object.getPrototypeOf(GameOverScreen)).call(this, config.scene));

    _this7.scene = config.scene;
    _this7.config = config;
    _this7.graphics = _this7.scene.add.graphics();
    _this7.graphics.fillStyle(0x000000, 0.5);
    _this7.graphics.fillRect(-game.config.width / 2, -game.config.height / 2, game.config.width, game.config.height);
    _this7.graphics.fillStyle(0xffffff);
    _this7.graphics.fillRoundedRect(0 - uiConfig.gridColWidth * 4, 0 - uiConfig.gridColHeight, uiConfig.gridColWidth * 8, uiConfig.gridColHeight * 2, 30);
    _this7.add(_this7.graphics);
    if (config.gameSuccess) {
      _this7.title = _this7.scene.add.text(0, -110, config.title, {
        color: "#ff952b",
        fontFamily: uiConfig.fontFamily,
        fontSize: 36
      });
    } else {
      _this7.title = _this7.scene.add.text(0, -60, config.title, {
        color: "#ff952b",
        fontFamily: uiConfig.fontFamily,
        fontSize: 36
      });
    }
    _this7.title.setOrigin(0.5);
    _this7.add(_this7.title);
    if (config.gameSuccess) {
      _this7.clear1 = _this7.scene.add.sprite(-200, 0, "clearSprite", 0);
      _this7.clear2 = _this7.scene.add.sprite(0, 0, "clearSprite", 1);
      _this7.clear3 = _this7.scene.add.sprite(200, 0, "clearSprite", 2);
      _this7.clear1.alpha = 0;
      _this7.clear2.alpha = 0;
      _this7.clear3.alpha = 0;
      _this7.add(_this7.clear1);
      _this7.add(_this7.clear2);
      _this7.add(_this7.clear3);
    } else {
      _this7.subTitle = _this7.scene.add.text(0, -10, config.subTitle, {
        color: "#707070",
        fontFamily: uiConfig.fontFamily,
        fontSize: 20
      });
      _this7.subTitle.setOrigin(0.5);
      _this7.add(_this7.subTitle);
    }
    if (config.gameSuccess) {
      _this7.btnRestart = new FlatButton({
        scene: config.scene,
        key: "btnStart",
        text: config.btnText,
        x: 0,
        y: 110,
        event: "restartGame"
      });
    } else {
      _this7.btnRestart = new FlatButton({
        scene: config.scene,
        key: "btnStart",
        text: config.btnText,
        x: 0,
        y: 50,
        event: "restartGame"
      });
    }
    _this7.add(_this7.btnRestart);
    if (config.x) {
      _this7.x = config.x;
    }
    if (config.y) {
      _this7.y = config.y;
    }
    _this7.scene.add.existing(_this7);
    return _this7;
  }

  _createClass(GameOverScreen, [{
    key: "onPointerdown",
    value: function onPointerdown() {
      this.btn.setFrame(1);
      this.y += 5;
    }
  }, {
    key: "onPointerup",
    value: function onPointerup() {
      this.btn.setFrame(0);
      emitter.emit(this.config.event);
    }
  }]);

  return GameOverScreen;
}(Phaser.GameObjects.Container);

// gridSystem


var AlignGrid = function () {
  function AlignGrid(config) {
    _classCallCheck(this, AlignGrid);

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

  _createClass(AlignGrid, [{
    key: "show",
    value: function show() {
      this.graphics = this.scene.add.graphics();
      this.graphics.lineStyle(2, 0x00ff00);
      for (var i = 0; i < this.config.width; i += this.cw) {
        this.graphics.moveTo(i, 0);
        this.graphics.lineTo(i, this.config.height);
      }
      for (var _i = 0; _i < this.config.height; _i += this.ch) {
        this.graphics.moveTo(0, _i);
        this.graphics.lineTo(this.config.width, _i);
      }
      this.graphics.strokePath();
    }
  }, {
    key: "placeAt",
    value: function placeAt(xx, yy, obj) {
      obj.x = this.cw * xx + this.cw / 2;
      obj.y = this.ch * yy + this.ch / 2;
    }
  }, {
    key: "placeAtIndex",
    value: function placeAtIndex(index, obj) {
      // 另一種指定位置的方式，以格數來指定
      var xx = index % this.cols;
      var yy = Math.floor(index / this.cols);
      this.placeAt(xx, yy, obj);
    }
  }, {
    key: "showNumbers",
    value: function showNumbers() {
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
  }]);

  return AlignGrid;
}();

function getRandomColumn(min, max) {
  return Math.floor(Math.random() * max) + min;
}
//# sourceMappingURL=90sec-game.js.map
