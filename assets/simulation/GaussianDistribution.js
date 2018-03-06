/**
 * GaussianDistrubtion.js
 * Transforms a random number generator with a normal distribution
 * into one that has a guassian distribution.
 * "Polar" version without trigonometric calls, 1 at a time
 * Defaults to a one sigma spread about zero
 */
import Random from './Random'

let storedDeviate = null
let deviateAvailable = false

export default (mu = 0, sigma = 1) => {
  if (!deviateAvailable) {
    let var1, var2
    let rSquared = 0
    while(rSquared === 0 || rSquared >= 1.0) {
      var1 = (2.0 * Random.get()) - 1.0
      var2 = (2.0 * Random.get()) - 1.0
      rSquared = (var1 * var1) + (var2 * var2)
    }

    // Create the deviate
    let polar = Math.sqrt(-2 * Math.log(rSquared) / rSquared)
    storedDeviate = var1 * polar
    deviateAvailable = true

    return (var2 * polar * sigma) + mu
  } else {
    // Unset the deviate
    deviateAvailable = false
    return (storedDeviate * sigma) + mu
  }
}
