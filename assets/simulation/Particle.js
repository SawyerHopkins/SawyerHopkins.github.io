/**
 * Particle.js
 * Defines a single spherical particle
 */

import Point from './Point'
import Random from './Random'
import { pbcCurrent, pbcPrevious } from './Helpers'
import { PARTICLE_MASS, PARTICLE_RADIUS,  SYSTEM_BASIS } from './Constants'

export default class Particle {
    constructor(position, velocity, mass = PARTICLE_MASS, radius = PARTICLE_RADIUS) {
        this.mass = mass
        this.radius = radius
        this.velocity = velocity
        this.position = position
        this.force = new Point()
        this.previousForce = new Point()
        this.previousPosition = new Point()
    }

    /**
     * Places a particle randomly in a region
     * @param point Defines the top left corner of the region
     * @param spacing Defines the width of the region
     * @returns {Particle}
     */
    static aroundPoint(point, spacing = 0) {
      // Impose minimum spacing restrictions to prevent overlap
      /* istanbul ignore else */
      if (spacing < PARTICLE_RADIUS * 2.0) {
          spacing = PARTICLE_RADIUS * 2.0
      }

      // We consider the given point to be have all neighboring points
      // located one spacing away in a given direction. We randomly place the particle
      // anywhere from on the point to halfway between the point and its neighbor.
      // To prevent overlap we must subtract off the particle radius from the applied offset
      let position = new Point()
      for (let basis of SYSTEM_BASIS) {
        let offset = (Random.get(0, spacing / 2)) - PARTICLE_RADIUS
        position[basis] = point[basis] + (offset > 0 ? offset : 0)
      }

      return new Particle(position, new Point())
    }

    /**
    * Wrapper function for setting velocity
    */
    setVelocity(velocity) {
        this.velocity = velocity
    }

    /**
    * Wrapper function for setting position
    * Always set position through this function to ensure PBC
    * requirements are satisfied
    */
    setPosition(position, boxSize) {
      let tempPos = this.position.clone()

      for (let basis of SYSTEM_BASIS) {
        position[basis] = pbcCurrent(position[basis], boxSize)
      }
      this.position = position

      for (let basis of SYSTEM_BASIS) {
        this.previousPosition[basis] = pbcPrevious(tempPos[basis], this.position[basis], boxSize)
      }
    }

    /**
    * Adds the to total net force on the particle this tick
    */
    addForce(force) {
        this.force.add(force)
    }

    /**
    * Resets the particle force for use in the next tick
    */
    clearForce() {
        this.previousForce = this.force
        this.force = new Point()
    }
}
