"use strict";
function Ant(x, y, group) {
  this.ants = group;
  this.sprite;

  this.prevPos = {x: x, y: y};
  this.reverseX = false;
  this.lastMove = this.ants.game.time.time;

  this.route = [];
};

Ant.prototype = {
  create: function() {
    this.sprite = this.ants.create(this.prevPos.x*tileSize, this.prevPos.y*tileSize, 'ant', 0);
    this.sprite.animations.add('walk');
  },
  get_speed: function() {
    // Speed in pixels pr. ms
    return 0.03;
  },
  on_route: function() {
    return this.route.length > 0;
  },
  set_route: function(route) {
    this.route = route;
    this.route_started();
  },
  route_started: function() {
    // play animation
    this.sprite.animations.play('walk', 5, true);
  },
  route_ended: function() {
    this.sprite.animations.stop(null, true);
  },
  move_to: function(pos) {
    var time = this.ants.game.time;
    var deltaT = time.elapsed;

    var xDir = this.prevPos.x < pos.x ? 1 : -1;
    var yDir = pos.y - this.prevPos.y;

    this.sprite.x += (this.get_speed() * deltaT) * xDir;
  },
  update: function() {

    if (this.on_route()) {
      var nextGridPos = {x: this.route[0][0], y: this.route[0][1]};
      var nextPos = {x: this.route[0][0]*tileSize, y: this.route[0][1]*tileSize};

      if (nextGridPos.x < this.prevPos.x) this.reverseX = true;
      if (nextGridPos.x > this.prevPos.x) this.reverseX = false;

      this.move_to(nextGridPos);

      if (Math.floor(this.sprite.x) === nextPos.x && Math.floor(this.sprite.y) === nextPos.y) {
        this.prevPos = nextGridPos;
        this.route.splice(0, 1);
        this.lastMove = this.ants.game.time;

        if (!this.on_route()) {
          this.route_ended();
        }
      }
    }

    this.sprite.scale.x = this.reverseX ? -1 : 1;
    this.sprite.pivot.x = this.reverseX ? -this.sprite.width : 0;
    //this.sprite.x += game.intBetween(-1, 2);
  }
};
