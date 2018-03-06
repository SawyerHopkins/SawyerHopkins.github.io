/**
 * Point.js
 * Defines a point. Pretty straight forward.
 */

import {SYSTEM_BASIS} from './Constants'

export default class Point {
    /**
     * Constructs an n dimensional point
     * @param position
     */
    constructor(...position) {
      // Set default two dimensional position
      if (position.length === 0) {
          position = [0, 0]
      }

      let smallestBasis = Math.min(SYSTEM_BASIS.length, position.length)
      for (let i = 0; i < smallestBasis; i++) {
          this[SYSTEM_BASIS[i]] = position[i]
      }
    }

    /**
     * Returns the magnitude of the vector
     * @returns {number}
     */
    magnitude() {
      let value = 0
      for (let basis of SYSTEM_BASIS) {
          value += (this[basis] * this[basis])
      }
      return Math.sqrt(value)
    }

    /**
    * Multiples each component by the provided scalar value
    */
    scale(value) {
      for (let basis of SYSTEM_BASIS) {
          this[basis] *= value
      }
    }

    /**
    * Adds the basis vectors of a point to this point
    */
    add(point) {
      for (let basis of SYSTEM_BASIS) {
          this[basis] += point[basis]
      }
    }

    /**
    * Creates a clone of this point
    */
    clone() {
      let newPoint = new Point()
      for (let basis of SYSTEM_BASIS) {
          newPoint[basis] = this[basis]
      }
      return newPoint
    }

    static pbcDiff(point1, point2, boxSize) {
      let diff = new Point()
      let halfBox = boxSize / 2

      for (let basis of SYSTEM_BASIS) {
        let d =  point1[basis] - point2[basis]
        let dAbs = Math.abs(d)

        // Check for periodic boundary conditions
        // |----------|
        // |-0------0-|
        // |----------|
        // To the system the zeros above are separated by 6 dashes
        // However when we consider the system folder there is only
        // a two dash separation between the zeros
        if (dAbs > halfBox) {
            d = (d < 0)? d + boxSize : d - boxSize
        }

        diff[basis] = d
      }

      return diff
    }
}
