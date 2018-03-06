/**
 * Maxwell.js
 * Gives the provided particle system a maxwell distribution for initial velocity
 */

import Point from './Point'
import Random from './Random'
import { SYSTEM_BASIS } from './Constants'

export default (particles, temperature) => {
    // For two dimensions we know
    // KE = 1/2MV^2
    // KE = kT
    // Setting k = 1 we get
    // V = SQRT(2T/M)

    // Set initial velocity based on maxwell distribution
    for (let particle of particles) {
      let velocity = new Point()

      // This will set the velocity in each direction based on a maxwell distribution
      for (let basis of SYSTEM_BASIS) {
        let maxwell1 = Random.get()
        let maxwell2 = Random.get()
        velocity[basis] = Math.sqrt(-2.0 * Math.log(maxwell1)) * Math.cos(8.0 * Math.atan(1) * maxwell2)
      }

      particle.setVelocity(velocity)
    }

    // Next calculate the total energy of the system

    let massSum = 0
    let velocitySum = new Point()
    let velocitySquaredSum = new Point()

    for (let particle of particles) {
      for (let basis of SYSTEM_BASIS) {
        massSum += particle.mass
        velocitySum[basis] = velocitySum[basis] + particle.velocity[basis]
        velocitySquaredSum[basis] = velocitySquaredSum[basis] + (particle.velocity[basis] * particle.velocity[basis])
      }
    }

    // Finally normalize the energy based on temperature
    let massAverage = massSum / particles.length

    for (let particle of particles) {
      let normalizedVelocity = new Point()

      for (let basis of SYSTEM_BASIS) {
        let basisAverage = velocitySum[basis] / particles.length
        let basisSquaredAverage = velocitySquaredSum[basis] / particles.length
        let kenEnergy = Math.sqrt(basisSquaredAverage - (basisAverage * basisAverage))
        let tempEnergy = Math.sqrt(2.0 * temperature / massAverage)
        // Ratio of the energy from the random velocities assigned previously
        // to the energy corresponding to the temperature
        let normalization = tempEnergy / kenEnergy

        normalizedVelocity[basis] = normalization * (particle.velocity[basis] - basisAverage)
      }

      particle.velocity = normalizedVelocity
    }
}
