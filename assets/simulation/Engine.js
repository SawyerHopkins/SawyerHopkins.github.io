/**
 * Engine.js
 * The simulation container
 */

import Maxwell from './Maxwell'
import Integrator from './Integrator'
import { TEMPERATURE, FPS } from './Constants'

export default class Engine {
    constructor() {
        this.size = 0
        this.time = 0
        this.forces = []
        this.particles = []
        this.realTemperature = 0
        this.temperature = TEMPERATURE
        this.integrator = new Integrator(this.temperature)
    }

    /**
     * Sets the dimensional size of the simulation box
     * @param size
     */
    setSize(size) {
        this.size = size
    }

    /**
     * Adds a particle to the simulation
     * @param particle
     */
    addParticle(particle) {
        this.particles.push(particle)
    }

    /**
     * Adds a force to apply to the particles each tick
     * @param force
     */
    addForce(force) {
        this.forces.push(force)
    }

    /**
     * Normalize the velocity of the particles based on a maxwell distribution
     * @param temperature
     */
    normalizeTemperature()
    {
        Maxwell(this.particles, this.temperature)
    }

    /**
     * Perform one timestep of the simulation
     */
    tick() {
      // First we calculate the force each particle is under
      for (let particle of this.particles) {
        for (let force of this.forces) {
          force(particle, this.particles, {
            boxSize: this.size
          })
        }
      }
      // Then we integrate
      this.integrator.step(this.particles, {
        time: this.time,
        boxSize: this.size,
      })
      // Calculate temperature
      this.getTemperature()
      // Update time
      this.time++
    }

    getTemperature() {
      let totalEnergy = 0
      for (let particle of this.particles) {
        let velocity = particle.velocity.magnitude()
        totalEnergy += (0.5 * particle.mass * velocity * velocity)
      }
      this.realTemperature = (totalEnergy / this.particles.length)
    }
}
