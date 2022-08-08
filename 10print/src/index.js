import "./p5.min.js";

const config = {
  frameRate: 60,
  noiseSeed: (fxrand() * 100_000) >> 0,

  /** number of items */
  num: (10 + fxrand() * 10) >> 0,

  /** noise scale  */
  noiseScale: 0.5 + fxrand() * 24,
};

window.$fxhashFeatures = {
  ...config,
};

const pos = {
  /** width */
  w: null,
  /** height */
  h: null,
  /** size */
  s: null,
  /** left */
  l: null,
  /** top */
  t: null,
};

function init() {
  pos.w = window.innerWidth;
  pos.h = window.innerHeight;
  pos.s = Math.min(window.innerWidth, window.innerHeight);
  pos.t = (pos.h - pos.s) / 2;
  pos.l = (pos.w - pos.s) / 2;
  createCanvas(pos.w, pos.h);
  frameRate(config.frameRate);
  randomSeed(config.noiseSeed);
  noiseSeed(config.noiseSeed);
  draw();
}

window.setup = () => {
  init();
  colorMode(HSB);
  print(config.noiseSeed)
  randomSeed(config.noiseSeed);
  noiseSeed(config.noiseSeed);
};

window.windowResized = () => {
  randomSeed(config.noiseSeed);
  noiseSeed(config.noiseSeed);
  init();
};

let x = 0
let y = 0
let spacing = 100


window.draw = () => {
  background(90, 10, 12.5);

  stroke(352, 48, 46)

  // top left of square
  translate(pos.l, pos.t);

  let size = pos.s

  let numBlocks = pos.s / spacing

  for (let i = 0; i < numBlocks; i++) {
    for (let j = 0; j < numBlocks; j++) {
      if (random(1) < .5) {
        line(i * spacing, j * spacing, i * spacing + spacing, j * spacing + spacing)
      } else {
        line(i * spacing + spacing, j * spacing, i * spacing, j * spacing + spacing)
      }
    }
  }

  noLoop();
};
