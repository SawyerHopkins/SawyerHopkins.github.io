/**
 * Random.js
 * Wraps the Math.random function to allow for easier testing
 */

export default {
    get(min = 0, max = 1) {
        // Comments at
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // Would lead me to believe that Math.Random() is close to a uniform distribution
        return (Math.random() * (max - min)) + min
    }
}