import "./p5.min.js";

// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

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
// window.$fxhashFeatures = {
//   "Background": "Black",
//   "Number of lines": 10,
//   "Inverted": true
// }

// this code writes the values to the DOM as an example
// const container = document.createElement("div")
// container.innerText = `
//   random hash: ${fxhash}\n
//   some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
// `
// document.body.prepend(container)

/*
TODO
Prioritize flag ones
Add feature
Remove sliders
*/

const width = Math.min(window.innerWidth, window.innerHeight, 500)

let distanceBetweenLinesSlider;
var perlinDeltaXSlider;
var perlinDeltaYSlider;
var amplitudeSlider;

var perlinDeltaZSlider;
var perlinDeltaXTranslateSlider;


window.setup = () => {
  let canvasSize = width
  createCanvas(canvasSize, canvasSize)
  randomSeed(fxrand() * 100_000) >> 0
  noiseSeed(fxrand() * 100_000) >> 0
  angleMode(RADIANS);
  colorMode(HSB, 360, 1, 1);
  
  // distanceBetweenLinesSlider = createSlider(1, 200, 22, 1)
  // perlinDeltaXSlider = createSlider(0, .05, .01, .0001)
  // perlinDeltaYSlider = createSlider(0, .5, .1, .0001)
  // amplitudeSlider = createSlider(0, 1000, 190, .1)

  // perlinDeltaZSlider = createSlider(0, .01, .003, .0001)
  // perlinDeltaXTranslateSlider = createSlider(0, .02, 0, .0001)

  // need to find a few line one
  // only 3 things 197 0.0231 0.1 774.2 0.003

  draw()

  background(255)
  stroke(0, 100)
  // noFill()
}

var distanceBetweenLines = 50
var perlinDeltaX = .1
var perlinDeltaY = .1
var amplitude = 10

var perlinDeltaZ = .1
var zOff = 0
var xTranslate = 0
var deltaXTranslate = 0

var hue = fxrand() * 360 >> 0
var lineResolution = 10 //lower is better res

var states = [
  [200, 0.01, 0.2169, 350, 0.003, false], // 3 things
  [100, 0.013, 0.1, 800, .003, false], // wavy
  [100, 0.0078, 0.5, 517.8, 0.003, false], // overlapped
  // [45, 0.011, 0.15, 1000, 0.003, true], // circular
  [23, 0.01, 0.5, 260.5, 0.01, true], // speaker
  [180, 0.01, 0.2169, 600, 0.006, false], // 3 things
]

var state = states[(fxrand() * states.length) >> 0]

while (state[0] != 200 && hue >= 200 && hue <= 300) {
  hue = fxrand() * 360 >> 0
}


window.draw = () => {
  if (frameRate() < 50) {
    // console.log(frameRate())
  }

  background(255)

  // distanceBetweenLines = distanceBetweenLinesSlider.value()
  // perlinDeltaX = perlinDeltaXSlider.value()
  // perlinDeltaY = perlinDeltaYSlider.value()
  // amplitude = amplitudeSlider.value()

  // perlinDeltaZ = perlinDeltaZSlider.value()
  // deltaXTranslate = perlinDeltaXTranslateSlider.value()

  distanceBetweenLines = state[0]
  perlinDeltaX = state[1]
  perlinDeltaY = state[2]
  amplitude = state[3]
  perlinDeltaZ = state[4]

  // print(distanceBetweenLines, perlinDeltaX, perlinDeltaY, amplitude, perlinDeltaZ, hue)


  // For each line
  var yOff = 0
  for (var y = -distanceBetweenLines * 10; y < width + distanceBetweenLines * 10; y += distanceBetweenLines) {
    let temp = amplitude
    // if (distanceBetweenLines == 200 && y < 0) {
    //   amplitude = 0
    // }
    // Draw line
    var xOff = 0
    fill((hue + map(y-width, 0, width, 0, 50))%360, map(y, 0, width, .2, .9), map(y, 0, width, .2, .9))
    if (distanceBetweenLines == 100) {
      stroke((hue + map(y-width, 0, width, 0, 50))%360, map(y, 0, width, .2, .9), map(y, 0, width, .2, .9))
    }  
    
    if (distanceBetweenLines == 45) {
      stroke(0, .5)
    }

    if (distanceBetweenLines == 23) {
      stroke(0, .3)
    }

    beginShape()
    // strokeWeight(50)
    for (var x = -50; x < width/lineResolution + 50; x++) {
      let tempX = x * lineResolution
      let ampScale = (sin(map(tempX, 0, width, 0, Math.PI)) * sin(map(y, 0, width, 0, Math.PI)))
      ampScale = map(ampScale - 0.5, 0, 0.5, 0, 1, true)
      if (!state[5]) {
        ampScale = 1
      }
      var r =  ampScale * amplitude * noise(xOff + xTranslate, yOff, zOff) - ampScale*amplitude/2
      if (y <= 0 || y >= width) {
        r = 0
      }
      curveVertex(tempX, y + r)
      xOff += perlinDeltaX * 10
    }
    yOff += perlinDeltaY
    y += distanceBetweenLines
    for (var x = width/lineResolution + 50; x >= -50 ; x--) {
      let tempX = x * lineResolution
      let ampScale = (sin(map(tempX, 0, width, 0, Math.PI)) * sin(map(y, 0, width, 0, Math.PI)))
      ampScale = map(ampScale - 0.5, 0, 0.5, 0, 1, true)
      if (!state[5]) {
        ampScale = 1
      }
      var r =  ampScale * amplitude * noise(xOff + xTranslate, yOff, zOff) - ampScale*amplitude/2
      if (y >= width) {
        r = 0
      }
      curveVertex(tempX, y + r)
      xOff -= perlinDeltaX * 10
    }
    y -= distanceBetweenLines
    endShape(CLOSE)

    amplitude = temp
  }
  
  zOff += perlinDeltaZ
  
  xTranslate += deltaXTranslate
  // noLoop()
}

document.body.onkeyup = function(e){
  if(e.keyCode == 32){
      if (isLooping()) {
        noLoop()
      } else {
        loop()
      }
  }
}
