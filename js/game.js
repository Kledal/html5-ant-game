"use strict";

var tileSize = 16;

var minGridX = -40;
var maxGridX = 40;

var dirtStartY = -15;
var minGridY = -30;
var maxGridY = 80;

var gridW = this.maxGridX - this.minGridX;
var gridH = this.maxGridY - this.minGridY;

function Game() {
  var phaser;
  var cursor;
}

Game.prototype.init = function() {
  this.phaser = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
    preload: this.preload,
    create: this.create,
    update: this.update,
    render: this.render
    });
};

Game.prototype.preload = function() {
  this.game.load.spritesheet('dirt', '../img/dirt.png', 16, 16, 10)
  this.game.load.spritesheet('ant', '../img/ant.png', 16, 16, 2)
  this.game.load.image('cursor', '../img/cursor.png')
  this.game.load.image('dig', '../img/dig.png')
  this.game.load.image('grass', '../img/grass.png')
};

Game.prototype.create = function() {
    this.game.world.setBounds(minGridX * tileSize,
                              minGridY * tileSize,
                              gridW * tileSize,
                              gridH * tileSize);

    // Create "world"
    this.game.stage.backgroundColor = '#00B2D3';

    var ants = this.game.add.group();

    var tile;
    for(var x = minGridX; x < maxGridX; x++) {
      for (var y = minGridY; y < maxGridY; y++) {
        if (y >= dirtStartY) {
          var height = y;

          var clr = game.intBetween(0, 11);
          tile = this.game.add.sprite(x*tileSize, y*tileSize, 'dirt', clr);
          game.onTileSelected(tile);

          if (height == dirtStartY) {
            tile = this.game.add.sprite(x*tileSize, y*tileSize, 'grass');
            game.onTileSelected(tile);
          }
        }
      }
    }

    // Create cursor object
    game.cursor = this.game.add.sprite(0, 0, 'cursor');
    game.cursor.visible = false;

    this.cursors = this.game.input.keyboard.createCursorKeys();
    // Set the camera to top
    this.game.camera.x = gridW / 2;
    this.game.camera.y = minGridY * tileSize;
    // this.game.input.onDown.add(toggle, this);
};

Game.prototype.intBetween = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

Game.prototype.onTileSelected = function(tile) {
  function handle(sprite, e) {
    var cursor = game.cursor;
    cursor.visible = true;
    cursor.x = sprite.x;
    cursor.y = sprite.y;

    if (e.isDown) {
      if (!sprite.workIcon) {
        var workIcon = game.phaser.add.sprite(sprite.x, sprite.y, 'dig');
        workIcon.visible = true;
        sprite.workIcon = workIcon;
      } else {
        sprite.workIcon.destroy();
      }
      // sprite.tint = 0xAEAEAE;
    }
  };
  tile.inputEnabled = true;
  tile.input.priorityID = 1;
  tile.events.onInputOver.add(handle);
  tile.events.onInputDown.add(handle);
};

Game.prototype.update = function() {
  if (this.cursors.up.isDown) {
    this.game.camera.y -= 10;
  }
  if (this.cursors.down.isDown) {
    this.game.camera.y += 10;
  }
  if (this.cursors.left.isDown) {
    this.game.camera.x -= 10;
  }
  if (this.cursors.right.isDown) {
    this.game.camera.x += 10;
  }
};

Game.prototype.render = function() {
  this.game.debug.cameraInfo(this.game.camera, 400, 32);
}
