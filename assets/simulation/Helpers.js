/**
 * Helpers.js
 * Mathematical helper fuctions for calculation forces.
 */

import Point from './Point'
import { SYSTEM_BASIS } from './Constants'

/**
 * Gets the distance between two particles
 * Respects periodic boundary conditions
 */
export const distanceBetween = (particle1, particle2, boxSize) => {
  return Point.pbcDiff(particle1.position, particle2.position, boxSize).magnitude()
}

/**
 * Gets the unit vector from particle1 to particle 2
 * Respects periodic boundary conditions
 * Useful for converting spherical forces into cartesian components
 */
export const unitVector = (particle1, particle2, r, boxSize) => {
  let unit = Point.pbcDiff(particle1.position, particle2.position, boxSize)
  unit.scale(1 / r)
  return unit
}

/**
 * Accepts a vector component (aka position component) and the boxSize
 * returns the vector compoent respecting periodic boundary conditions
 */
export const pbcCurrent = (value, boxSize) => {
  if (value < 0) {
    // if this particle is outside of the lower bounds
    return (value + boxSize)
  } else if (value >= boxSize) {
    // if the particle is outside of the upper bounds
    return (value - boxSize)
  } else {
    return value
  }
}

/**
 * Accepts a non PBC complient vector, a PBC complient vector, and the boxSize
 * returns a PBC complient previous position vector via ghosting
 */
export const pbcPrevious = (preModValue, postModValue, boxSize) => {
  let dValue = postModValue - preModValue

  // If the particle has moved more than half the boxSize
  // we assume its position has been altered by the function
  // pbcCurrent (this is a good assumption as the change is position
  // of a particle should be much smaller than the boxSize in a good
  // simulation). If this is the case we 'ghost' the previous position
  // of the particle outside of the box
  // |----------|
  //G|-0------X-|
  // |----------|
  // Above: if a particles wraps from X to 0, we ghost the previous position
  // of the particle a G
  if (Math.abs(dValue) > (boxSize / 2)) {
    return (dValue < 0) ? preModValue - boxSize : preModValue + boxSize
  } else {
    return preModValue
  }
}
