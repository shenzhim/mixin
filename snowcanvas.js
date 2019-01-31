class SnowFlake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 0;
    this.alpha = 0;

    this.reset();
  }

  reset() {
    this.x = this.randBetween(0, window.innerWidth);
    this.y = this.randBetween(0, -window.innerHeight);
    this.vx = this.randBetween(-3, 3);
    this.vy = this.randBetween(2, 5);
    this.radius = this.randBetween(1, 3);
    this.alpha = this.randBetween(0.1, 0.9);
  }

  randBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.radius > window.innerHeight) {
      this.reset();
    }
  }
}

class Snow {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);

    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();

    this.updateBound = this.update.bind(this);
    this.createSnowflakes();
    requestAnimationFrame(this.updateBound);
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.createVignette();
  }

  createSnowflakes() {
    const flakes = window.innerWidth / 4;
    this.snowflakes = Array.from({ length: flakes }, _ => new SnowFlake());
  }

  createVignette() {
    const xMid = this.width * 0.5;
    const yMid = this.height * 0.5;
    const radius = Math.sqrt(xMid * xMid + yMid * yMid);
    this.vignette = this.ctx.createRadialGradient(
      xMid,
      yMid,
      0,
      xMid,
      yMid,
      radius
    );

    this.vignette.addColorStop(0.49, `rgba(0,0,0,0)`);

    for (let i = 0; i <= 1; i += 0.1) {
      const alpha = Math.pow(i, 3);
      this.vignette.addColorStop(0.5 + i * 0.5, `rgba(0,0,0,${alpha})`);
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const flake of this.snowflakes) {
      flake.update();

      this.ctx.save();
      this.ctx.fillStyle = "#FFF";
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.globalAlpha = flake.alpha;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.ctx.fillStyle = this.vignette;
    this.ctx.fillRect(0, 0, this.width, this.height);

    requestAnimationFrame(this.updateBound);
  }
}

new Snow();
