const WIDTH = 400;
const HEIGHT = 600;

// TODO
// - fix layout shift when the game values change decimal places
// - test responsiveness with screen sizes and mobile
// - change upgrading speed to upgrade fire rate
// - add explosion or effect to kiling enemy
// - introduce a new enemy type after a certain power level has been reached

document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.querySelector('.game-canvas');
  const ctx = canvas.getContext("2d");

  const healthAmount = document.querySelector('.health-amount');
  const healthBarAmount = document.querySelector('.health-bar-amount');

  const powerBar = document.querySelector('.power-amount');
  const powerBarAmount = document.querySelector('.power-bar-amount');
  powerBarAmount.style.width = "0%";

  const enemyPic = document.querySelector('.enemy-pic');

  const upButton = document.querySelector("#w");
  const leftButton = document.querySelector("#a");
  const downButton = document.querySelector("#s");
  const rightButton = document.querySelector("#d");

  const fruitMain = document.querySelector(".fruit-pic");

  class Input {
    constructor() {
      this.controls = {
        "w": false, "ArrowUp": false,
        "s": false, "ArrowDown": false,
        "a": false, "ArrowLeft": false,
        "d": false, "ArrowRight": false,
        "Enter": false
      }
      window.addEventListener('keydown', e => {
        e.preventDefault();
        if (this.controls[e.key] === false) {
          this.controls[e.key] = true;
        }
      })
      window.addEventListener('keyup', e => {
        e.preventDefault();
        if (this.controls[e.key] === true) {
          this.controls[e.key] = false;
        }
      })
      window.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (this.controls[e.target.id] === false) {
          this.controls[e.target.id] = true;
        }
      })
      window.addEventListener("touchend", (e) => {
        e.preventDefault();
        if (this.controls[e.target.id] === true) {
          this.controls[e.target.id] = false;
        }
      })
    }
  }


  class Background {
    constructor() {
      this.color = "#5060ff";
      this.width = WIDTH;
      this.height = HEIGHT;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }


  class Shot {
    constructor(x, y, direction, shotSpeed) {
      this.width = 5;
      this.height = 13;
      this.direction = direction;
      this.color = "#000000";
      this.x = x;
      this.y = y;
      this.speed = shotSpeed;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      if (this.direction === "up") {
        ctx.fillRect(this.x - (this.width / 2), this.y - this.height, this.width, this.height);
      }
      if (this.direction === "down") {
        ctx.fillRect(this.x - (this.width / 2), this.y + player.height, this.width, this.height);
      }
      if (this.direction === "left") {
        ctx.fillRect(this.x - player.width, this.y + (player.height / 2), this.height, this.width);
      }
      if (this.direction === "right") {
        ctx.fillRect(this.x + (player.width / 2), this.y + (player.height / 2), this.height, this.width);
      }
    }
    update() {
      if (this.direction === "up") {
        this.y = this.y - this.speed;
      }
      if (this.direction === "down") {
        this.y = this.y + this.speed;
      }
      if (this.direction === "left") {
        this.x = this.x - this.speed;
      }
      if (this.direction === "right") {
        this.x = this.x + this.speed;
      }
    }
  }


  class Player {
    constructor() {
      this.width = 30;
      this.height = 30;
      this.x = WIDTH / 2 - (this.width / 2);
      this.y = HEIGHT - this.height;
      this.speed = 5;
      this.shotBuffer = 0;
      this.activeShots = [];
      this.health = 100;
      this.shootDirection = "up";
      this.power = 0;
      this.shotSpeed = 5;
    }

    draw(ctx) {
      ctx.fillStyle = "#54f6d5";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(input) {

      // controls map
      if (input.controls["w"]) {
        this.y = this.y - this.speed;
      }
      if (input.controls["s"]) {
        this.y = this.y + this.speed;
      }
      if (input.controls["a"]) {
        this.x = this.x - this.speed;
      }
      if (input.controls["d"]) {
        this.x = this.x + this.speed;
      }

      if (input.controls["ArrowUp"]) {
        this.shootDirection = "up";
      }
      if (input.controls["ArrowDown"]) {
        this.shootDirection = "down";
      }
      if (input.controls["ArrowLeft"]) {
        this.shootDirection = "left";
      }
      if (input.controls["ArrowRight"]) {
        this.shootDirection = "right";
      }

      // OutOfBounds
      if (this.x + this.width > WIDTH) {
        this.x = this.x - this.speed;
      }
      else if (this.x < 0) {
        this.x = this.x + this.speed;
      }
      if (this.y + this.height > HEIGHT) {
        this.y = this.y - this.speed;
      }
      else if (this.y < 0) {
        this.y = this.y + this.speed;
      }

      // shot Buffer
      if (this.shotBuffer === 0 && input.controls["Enter"]) {
        this.shotBuffer = 10;
        // create shot
        const sh = new Shot(this.x + (this.width / 2), this.y, this.shootDirection, this.shotSpeed);
        this.activeShots.push(sh);
      }
      if (this.shotBuffer !== 0) {
        this.shotBuffer--;
      }

      // enemies1 hit detection
      for (let en of enemies1) {
        if (
          this.x + this.width >= en.x &&
          this.x <= en.x + en.width &&
          this.y + this.height >= en.y &&
          this.y <= en.y + en.height
        ) {
          this.health--;
          healthAmount.innerText = this.health;
          healthBarAmount.style.width = `${this.health}%`;
          // enemy dies on hit
          enemies1.splice(enemies1.indexOf(en), 1);
          if (this.health <= 0) {
            healthAmount.innerText = "💀";
            // TODO - restart functionality
          }
        }
      }

    }
    upgrade() {
      // update player power
      if (player.power >= 100) {
        player.shotSpeed += 5;
        player.health = 100;
        player.power = 0;
      } else {
        player.power += 10;
      }
      powerBar.innerText = player.power;
      powerBarAmount.style.width = `${this.power}`;
    }
  }


  class Enemy1 {
    constructor(player) {
      this.player = player;
      this.width = 30;
      this.height = 30;
      this.x = Math.floor(Math.random() * WIDTH);
      this.y = Math.floor(Math.random() * HEIGHT);
      this.speed = 1;
      this.dead = false;
      this.pic = enemyPic;
    }
    draw(ctx) {
      ctx.drawImage(this.pic, this.x, this.y, this.width, this.height);
    }
    update() {
      if (this.player.x !== this.x) {
        const distanceX = Math.abs(this.player - this.x);
        if (this.player.x < this.x) {
          this.x -= distanceX < this.speed ? distanceX : this.speed;
        } else {
          this.x += distanceX < this.speed ? distanceX : this.speed;
        }
      }
      if (this.player.y !== this.y) {
        if (this.player.y < this.y) {
          this.y -= this.speed;
        } else {
          this.y += this.speed;
        }
      }
    }
    detectHit(bullet) {
      if (
        this.x + this.width >= bullet.x &&
        this.x <= bullet.x + bullet.width &&
        this.y + this.height >= bullet.y &&
        this.y <= bullet.y + bullet.height
      ) {
        this.dead = true;
        player.activeShots.splice(player.activeShots.indexOf(bullet), 1);
      }
    }
  }

  class Fruit {
    constructor(vectorImg, player) {
      this.player = player;
      this.width = 30;
      this.height = 30;
      this.x = Math.floor(Math.random() * (WIDTH - this.width));
      this.y = Math.floor(Math.random() * (HEIGHT - this.height));
      this.vectorImg = vectorImg;
      this.widthPics = 4;
      this.heightPics = 4;
      this.picCoords = this.calculatePic();
      this.consumed = false;
    }
    calculatePic() {
      const arr = [];
      const w = this.vectorImg.width / this.widthPics;
      const h = this.vectorImg.height / this.heightPics;
      for (let y = 0; y < this.vectorImg.height; y += h) {
        for (let x = 0; x < this.vectorImg.width; x += w) {
          arr.push({ x: x, y: y });
        }
      }
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
    draw(ctx) {
      ctx.drawImage(
        this.vectorImg,
        this.picCoords.x,
        this.picCoords.y,
        this.vectorImg.width / this.widthPics,
        this.vectorImg.height / this.heightPics,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      if (
        this.x + (this.width / 2) <= this.player.x + this.player.width &&
        this.x + (this.width / 2) >= this.player.x &&
        this.y + (this.height / 2) <= this.player.y + this.player.height &&
        this.y + (this.height / 2) >= this.player.y
      ) {
        this.consumed = true;
      }
    }
  }

  const bg = new Background();
  const player = new Player();
  const input = new Input();

  let currentFruit = new Fruit(fruitMain, player);

  const enemies1 = [];
  const MAX_ENEMIES = 10;

  const spawnBuffer = 1000;
  let spawnReady = true;
  function spawnEnemies1() {
    if (enemies1.length < MAX_ENEMIES && spawnReady) {
      const en = new Enemy1(player);
      enemies1.push(en);
      spawnReady = false;
      setTimeout(() => {
        spawnReady = true;
      }, spawnBuffer)
    }
  }

  function animate() {

    bg.draw(ctx);


    player.draw(ctx);
    player.update(input);

    spawnEnemies1();

    for (let sh of player.activeShots) {
      sh.draw(ctx);
      sh.update();
      // remove shot if out of bounds
      if (sh.y < 0) {
        player.activeShots.shift();
      }
      // mark enemy dead
      for (let enmy of enemies1) {
        enmy.detectHit(sh);
      }
    }

    // for all enemies
    for (let enmy of enemies1) {
      enmy.draw(ctx);
      enmy.update();
      if (enmy.dead) {
        enemies1.splice(enemies1.indexOf(enmy), 1);
      }
    }

    // fruits spawn
    if (currentFruit.consumed) {
      currentFruit = new Fruit(fruitMain, player);
      player.upgrade();
    }
    currentFruit.update();
    currentFruit.draw(ctx);

    requestAnimationFrame(animate);
  }

  animate();

})
