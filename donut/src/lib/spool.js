import "./p5.min.js";
import { getSlider } from "./sliders.js";

var extremeRandom = () => {
  const numIterations = 5

  let polls = []

  for (let i = 0; i < numIterations; i++) {
    polls.push(random())
  }

  let res = polls[0]
  let maxDist = abs(.5 - polls[0])

  for (var poll of polls) {
    let dist = abs(.5 - poll)
    if (dist > maxDist) {
      maxDist = dist
      res = poll
    }
  }

  return res
}

const defaultOptions = {
  x: 0,
  y: 0,
  width: 30,
  height: 30,
  color: 0,
  dx: 1, // space between threads of the spool
  dy: 1,
  rotationFactor: 0, // Amount to rotate each square by
  dCenter: 5,
  borderRadius: 5,
  HueRandomizer: 20,
  MaxBrightness: 76.87,
  MaxSaturation: 31.14,
  MinBrightness: 100,
  MinSaturation: 54.67,
}

class Spool {

  constructor (options) {
    // Set default options
    this.options = defaultOptions

    for (const option in options) {
      this.options[option] = options[option]
    }

    this.display()
  }

  display () {

    var {x, y, width, height, color, dx, dy, rotationFactor, dCenter, borderRadius, hueRandomizer, minSaturation, maxSaturation, minBrightness, maxBrightness} = this.options

    push()
    translate(x, y)

    // Rotate the square by a random amount
    rotate(random() >= .5 ? rotationFactor : -rotationFactor)

    // Set up spool dimensions
    let best = min(width, height)
    let donutWidth = (best - best/3)/2

    let minWidth = width-donutWidth*2
    let minHeight = height-donutWidth*2

    let wx = minWidth
    let wy = minHeight

    while (wx < width && wy < height) {
      push()
      let delta = dCenter
      translate(extremeRandom() * delta - delta/2, extremeRandom() * delta - delta/2)
      let h = (color + (extremeRandom() * hueRandomizer) >> 0) % 360
      let s = map(extremeRandom(), 0, 1, minSaturation, maxSaturation)
      let b = map(extremeRandom(), 0, 1, minBrightness, maxBrightness)

      stroke(h, s, b, 1)
      rect(0, 0, wx, wy, min(wx, wy)/borderRadius)

      wx += dx
      wy += dy

      pop()
    }

    pop()
  }
}

export default Spool