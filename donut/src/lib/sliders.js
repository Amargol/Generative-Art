import "./p5.min.js";

var sliders = {}

var prevVals = 
{
  // "BaseColor": 260,
  DCenter: 0,
  HueRandomizer: 20,
  DCenter: 3,
  MaxBrightness: 76.87,
  MaxSaturation: 40,
  MinBrightness: 100,
  MinSaturation: 54.67,
  RotationFactor: 0,
  HueGradientDelta: 104.5,
  borderRadius: 6
}

var getSlider = (name, min=0, max=0, value=0, step=0) => {
  return prevVals[name]

  if (!(name in sliders)) {
    createElement('p', name);
    sliders[name] = createSlider(min, max, name in prevVals ? prevVals[name] : value, step)
  }

  return sliders[name].value()
}

var getSliderVals = () => {
  let res = {}
  for (let key in sliders) {
    res[key] = sliders[key].value()
  }
  print(res)
  return res
}

export { getSlider, getSliderVals }