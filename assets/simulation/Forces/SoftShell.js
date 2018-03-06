/**
 * SoftShell.js
 * Provides a repulsive soft shell interaction between a reference particle and the system particles
 * based on a r^-36 potential
 * @param referenceParticle
 * @param particles
 */

import { STABLE_OVERLAP } from '../Constants'
import { distanceBetween, unitVector } from '../Helpers'

export default (referenceParticle, particles, systemInfo = {}) => {
  /**
   * In a refined simulation we would assign particles to some
   * grid system to get a better operation time than N^2. For the
   * first revision, considering a low value of N (N < 100), we will
   * use this unoptimized solution
   */

  for (let particle of particles) {
    // No self interactions
    if (particle === referenceParticle) {
      continue
    }

    let minSeparation = referenceParticle.radius + particle.radius
    let r = distanceBetween(referenceParticle, particle, systemInfo.boxSize)

    if (r < minSeparation) {
      /* istanbul ignore next */
      if (r < (STABLE_OVERLAP * minSeparation)) {
          console.error('Unstable overlap between particles detected')
      }

      // Math
      let rInv = 1/r
      let r37 = 36 * Math.pow(rInv, 37)
      let forceMagnitude = r37

      /**
       * Normalize the force based on the unit vector
       * to convert the radially calculated force to the
       * system basis
       */
      let force = unitVector(referenceParticle, particle, r, systemInfo.boxSize)
      force.scale(forceMagnitude)

      referenceParticle.addForce(force)
    }
  }
}
