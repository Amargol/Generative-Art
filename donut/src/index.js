import "./lib/p5.min.js";
import { getSlider, getSliderVals } from "./lib/sliders.js";
import Spool from "./lib/spool.js";

// these are the variables you can use as inputs to your algorithms
// console.log(fxhash)   // the 64 chars hex number fed to your algorithm
// console.log(fxrand()) // deterministic PRNG function, use it instead of Math.fxrand()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//

/*
let res = {}
for (var z = 0; z < 1000000; z++) {
    let r = weighted_random([1, 2], [20, 1])
    let t = res[r]
    res[r] = (t || 0) + 1
}
for (const k in res) {
  res[k] /= 1000000
}
res
*/
window.weighted_random = (items, weights) => {
  var i;

  for (i = 0; i < weights.length; i++)
      weights[i] += weights[i - 1] || 0;
  
  var random = fxrand() * weights[weights.length - 1];
  
  for (i = 0; i < weights.length; i++)
      if (weights[i] > random)
          break;
  
  return items[i];
}


const layout = ["Random", "Random", "Diagonal", "Diagonal", "Sequential"][(fxrand() * 4) >> 0]
var color = ["Saturated", "Bright", "Pastel", "Pastel", "Pastel", "Pastel"][(fxrand() * 6) >> 0]
var angularity = 6
if (fxrand() < (4/50)) {
  angularity = 1000
}
const angularityString = angularity == 6 ? "Round" : "Square"
const gradient = fxrand() < (7/50) && layout == "Diagonal" ? "Rainbow" : "Gradient"
if (layout == "Random" && fxrand() < 1/3) {
  color= "Saturated"
}
const GridSize = fxrand() < (3/6) ? 18 : 24
const View = fxrand() < 3/50 ? "Blurred" : "Default"

window.$fxhashFeatures = {
  "Layout": layout,
  "Color": color,
  "Gradient": gradient,
  "Shape": angularityString,
  "View": View
}

// this code writes the values to the DOM as an example
// const container = document.createElement("div")
// container.innerText = `
//   random hash: ${fxhash}\n
//   some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
// `
// document.body.prepend(container)

const dimensionality = Math.min(window.innerWidth, window.innerHeight)
const borderWidth = dimensionality/30
const shapePadding = dimensionality/80
const drawingWidth = dimensionality - (dimensionality <= 500 ? 2 : 3) * borderWidth
var seed = fxrand() * 100_000_000

var cnvs

window.setup = () => {
  let canvasSize = drawingWidth + borderWidth + borderWidth
  cnvs = createCanvas(canvasSize, canvasSize)
  randomSeed(seed) >> 0
  noiseSeed(seed) >> 0
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100);
  
  // draw()
  rectMode(CENTER)

  background(255)
  stroke(0, 100)
  noFill()

  noLoop()
  frameRate(10)
}

var baseColor = (fxrand() * 360) >> 0

while (baseColor >= 50 && baseColor <= 100) {
  baseColor = (fxrand() * 360) >> 0
}

// Draw circle at cell x y with cell width w and cell height h
window.drawCircleAt = (x, y, w, h, numCells, position) => {

  // Claim Positions
  if (position) {
    for (let i2 = x; i2 < x+w; i2++) {
      for (let j2 = y; j2 < y+h; j2++) {
        position[i2][j2] = true
      }
    }
  }

  let pixelX = map(x + w/2, 0, numCells, 0, drawingWidth)
  let pixelY = map(y + h/2, 0, numCells, 0, drawingWidth)

  let pixelW = w * (drawingWidth/numCells)
  let pixelH = h * (drawingWidth/numCells)

  var options = {
    x: pixelX,
    y: pixelY,
    width: pixelW - shapePadding,
    height: pixelH - shapePadding,
    color: baseColor,
    dx: 1,
    dy: 1,  
    rotationFactor: 0,
    dCenter: (View == "Blurred" ? 17 : 2.5) * dimensionality / 884,
    borderRadius: angularity,
    hueRandomizer: getSlider("HueRandomizer", 0, 360, 0, .01),
    minSaturation: getSlider("MinSaturation", 0, 100, 0, .01),
    maxSaturation: {"Saturated": 70, "Bright": 40, "Pastel": 30}[color],
    minBrightness: getSlider("MinBrightness", 0, 100, 0, .01),
    maxBrightness: getSlider("MaxBrightness", 0, 100, 100, .01),
  }

  // Gradient the to the bottom right corner
  // if (baseColor >= 100 && baseColor <= 270) {
    if (x != y) {
      options["color"] += map((min(x,y)/numCells), 0, 1, .2, 1) * (gradient == "Gradient" ? 100 : 360)
    }
  // }

  options["rotationFactor"] = getSlider("RotationFactor", 0, 20, 0, .1)

  new Spool(options)
}

window.drawRandomCircleAt = (i, j, position, num) => {
  if (position[i][j]) {
    return
  }

  let options = getCircleDimensionOptions(i, j, position)
  if (options.length != 0) {
    let option = options[(fxrand() * options.length) >> 0]

    let w = option[0]
    let h = option[1]
    
    // Snap to corner
    if (num - i - w < 2 && num - j - h < 2) {
      w = num - i
      h = num - j
    }

    drawCircleAt(i, j, w, h, num, position)
  }
}

// Returns list of [width height]
window.getCircleDimensionOptions = (x, y, position) => {
  let res = []

  let maxHeight = position.length - y
  let maxWidth = position.length - x

  if (maxHeight > 17 && maxWidth > 17) {
    if (fxrand() > .5) {
      maxHeight = min(maxHeight, 15)
    } else {
      maxWidth = min(maxWidth, 15)
    }
  }

  for (let h = 0; h < maxHeight; h++) {
    for (let w = 0; w < maxWidth; w++) {
      if (!position[x + w][y + h]) {
        res.push([w+1, h+1])
      } else if (w == 0) {
        return res
      } else {
        maxWidth = w
      }
    }
  }

  return res
}

window.draw = () => {

  translate(borderWidth, borderWidth)

  background(0)
  randomSeed(seed) >> 0
  noiseSeed(seed) >> 0

  // rotates the frame so that the blocks are not all concentrated in the top left
  translate(-borderWidth, -borderWidth)
  translate(width/2, height/2)
  rotate(((fxrand() * 4) >> 0)*90, width/2)
  translate(-width/2, -height/2)
  translate(borderWidth, borderWidth)

  let num = GridSize
  
  let position = new Array(num).fill(false).map(() => new Array(num).fill(false))

  // drawCircleAt(0, 0, 24, 12, 24)
  // drawCircleAt(0, 12, 24, 12, 24)
  // drawCircleAt(0, 0, 12, 24, 24)
  // drawCircleAt(12, 0, 12, 24, 24)

  // return

  // drawCircleAt(4, 4, 16, 16, 24, position)
  // drawCircleAt(0, 0, 9, 9, 24, position)
  // drawCircleAt(15, 0, 9, 9, 24, position)
  // drawCircleAt(0, 15, 9, 9, 24, position)
  // drawCircleAt(15, 15, 9, 9, 24, position)
  // drawCircleAt(8, 8, 8, 8, 24, position)

  if (layout == "Random") {
    let numIterations = 1000000
    for (let i = 0; i < numIterations; i++) {
      let i = (fxrand() * num) >> 0
      let j = (fxrand() * num) >> 0
  
      if (position[i][j]) {
        continue
      }
  
      let options = getCircleDimensionOptions(i, j, position)
      if (options.length != 0) {
        let option = options[(fxrand() * options.length) >> 0]
    
        let w = option[0]
        let h = option[1]
    
        drawCircleAt(i, j, w, h, num, position)
      }
    }

    return
  }


  if (layout == "Diagonal") {
    for (let r = 0; r < num; r++) {
      for (let d = r; d >= 0; d--) {
        drawRandomCircleAt(r, d, position, num)
        if (r != d) {
          drawRandomCircleAt(d, r, position, num)
        }
      }
    }

    return 
  }
  
  if (layout == "Sequential") {
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        // Check if position is taken
        if (position[i][j]) {
          continue
        }

        let options = getCircleDimensionOptions(i, j, position)
        if (options.length != 0) {
          let option = options[(fxrand() * options.length) >> 0]
      
          let w = option[0]
          let h = option[1]
      
          drawCircleAt(i, j, w, h, num, position)
        }
      }
    }
  }
}


document.body.onkeyup = function(e){
  if(e.keyCode == 83) {
    saveCanvas(cnvs, "rectangle", "png")
  }
}