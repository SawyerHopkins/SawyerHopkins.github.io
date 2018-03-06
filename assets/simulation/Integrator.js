/**
 * Integrator.js
 * Integrates the current force on a particle system.
 */

import Point from './Point'
import Gaussian from './GaussianDistribution'
import { pbcCurrent, pbcPrevious } from './Helpers'
import { SYSTEM_BASIS, SEED, TIME_STEP, VISCOSITY, TEMPERATURE } from './Constants'

let RANDOM_FORCE_ACCESSOR = 'mem'
let RANDOM_FORCE_CORRELATION_ACCESSOR = 'memCoor'

export default class Integrator {
    constructor(temperature) {
      this.setTemperature(temperature)
    }

    setTemperature(temperature) {
      this.init = false
      this.dt = TIME_STEP
      this.dtSquare = this.dt * this.dt

      for (let basis of SYSTEM_BASIS) {
        this[RANDOM_FORCE_ACCESSOR + basis] = new Map()
        this[RANDOM_FORCE_CORRELATION_ACCESSOR + basis] = new Map()
      }

      let y = VISCOSITY * this.dt
      this.initialSetup()
      /* istanbul ignore else */
      if (y < 0.05) {
          this.setupLow()
      }
      /* istanbul ignore next: implement for completeness */
      if (y === 0) {
          this.setupZero()
      }

      // Variable names correspond to variables names in
      // GUNSTEREN AND BERENDSEN 1981
      this.sig1 = Math.sqrt(temperature * this.sig1 / (VISCOSITY * VISCOSITY))
      this.sig2 = Math.sqrt(-1 * temperature * this.sig2 / (VISCOSITY * VISCOSITY))
      this.coor = (temperature / (VISCOSITY * VISCOSITY)) * (this.gn / (this.sig1 * this.sig2))
      this.dev = Math.sqrt(1 - (this.coor * this.coor))
    }

    initialSetup() {
      let y = VISCOSITY * this.dt

      this.coEff0 = Math.exp(-y)
      this.coEff1 = (1.0 - this.coEff0) / y
      this.coEff2 = ((0.5 * y * (1 + this.coEff0)) - (1.0 - this.coEff0)) / ( y * y )
      this.coEff3 = (y - (1.0 - this.coEff0)) / ( y * y )

      this.sig1 = 2 * y - 3 + 4 * Math.exp(-y) - Math.exp(- 2 * y)
      this.sig2 = -2 * y - 3 + 4 * Math.exp(y) - Math.exp(2 * y)

      this.gn = Math.exp(y) - (2 * y) - Math.exp(-y)

      this.goy2 = this.gn / ( y * y )
      this.goy3 = this.gn / ( y * y * y )

      this.hn = y / (Math.exp(y) - Math.exp(-y))
    }

    /**
     * Coefficients for Low Gamma (from series expansion).
     * SEE GUNSTEREN AND BERENDSEN 1981
     */
    setupLow() {
        // create powers of y = dt * VISCOSITY
        let y = []
        for (let i = 0; i < 9; i ++) {
            y.push(Math.pow(this.dt * VISCOSITY, i + 1))
        }

        this.coEff1 = (
            1.0 -
            0.5 * y[0] +
            (1/6) * y[1] -
            (1/24) * y[2] +
            (1/120) * y[3]
        )

        this.coEff2 = (
            (1/12) * y[0] -
            (1/24) * y[1] +
            (1/80) * y[2] -
            (1/360) * y[3]
        )

        this.coEff3 = (
            0.5 -
            (1/6) * y[0] +
            (1/24) * y[1] -
            (1/120) * y[2]
        )

        this.sig1 = (
            (2/3) * y[2] -
            0.5 * y[3] +
            (7/30) * y[4] -
            (1/12) * y[5] +
            (31/1260) * y[6] -
            (1/160) * y[7] +
            (127/90720) * y[8]
        )

        this.sig2 = (
            (-2/3) * y[2] -
            0.5 * y[3] -
            (7/30) * y[4] -
            (1/12) * y[5] -
            (31/1260) * y[6] -
            (1/160) * y[7] -
            (127/90720) * y[8]
        )

        this.goy2 = (1/3) * y[0] + (1/60) * y[2]
        this.goy3 = (1/3) + (1/60) * y[1]

        this.hn = 0.5 - (1/12) * y[1] + (7/720) * y[3]
        this.gn = (1/3) * y[2] + (1/60) * y[4]
    }

    /**
    * No viscosity corner case
    */
    /* istanbul ignore next: implement for completeness */
    setupZero() {
        this.coEff0 = 1
        this.coEff1 = 1
        this.coEff2 = 0
        this.coEff3 = 0.5
    }

    /**
    * The first step for this algorithm
    */
    initialStep(particles, systemInfo) {
      let boxSize = systemInfo.boxSize

      for (let particle of particles) {
        let newPosition = new Point()

        for (let basis of SYSTEM_BASIS) {
          // We map the particle to its brownian motion
          this[RANDOM_FORCE_CORRELATION_ACCESSOR + basis].set(particle, 0)
          this[RANDOM_FORCE_ACCESSOR + basis].set(particle, Gaussian())

          // We calculate the new position for this basis
          newPosition[basis] = (
              particle.position[basis] +
              (particle.velocity[basis] * this.coEff1 * this.dt) +
              (particle.force[basis] * this.coEff3 * this.dtSquare / particle.mass) +
              (this.sig1 * this[RANDOM_FORCE_ACCESSOR + basis].get(particle))
          )
        }

        particle.setPosition(newPosition, boxSize)
        // Now that we have integrated the force on this particle
        // we need to reset it or else force will tend towards infinity
        particle.clearForce()
      }
    }

    /**
    * The main integration routine
    */
    runningStep(particles, systemInfo) {
      let boxSize = systemInfo.boxSize
      let shouldUpdateVelocity = systemInfo.time % 10 === 0

      for (let particle of particles) {
        let newPosition = new Point()
        let newVelocity = new Point()

        for (let basis of SYSTEM_BASIS) {
          // We map the particle to its brownian motion
          // Get correlation between the brownian motion from times 't' and 't + dt'
          let correlation = this.sig2 * ((this.coor * this[RANDOM_FORCE_ACCESSOR + basis].get(particle)) + (this.dev * Gaussian()))
          this[RANDOM_FORCE_CORRELATION_ACCESSOR + basis].set(particle, correlation)
          this[RANDOM_FORCE_ACCESSOR + basis].set(particle, Gaussian())

          // We calculate the new position for this basis
          newPosition[basis] = (
              ((1 + this.coEff0) * particle.position[basis]) -
              (this.coEff0 * particle.previousPosition[basis]) +
              ((this.dtSquare * this.coEff1 / particle.mass) * particle.force[basis]) +
              ((this.dtSquare * this.coEff2 / particle.mass) * (particle.force[basis] - particle.previousForce[basis])) +
              (this.sig1 * this[RANDOM_FORCE_ACCESSOR + basis].get(particle)) +
              (this.coEff0 * this[RANDOM_FORCE_CORRELATION_ACCESSOR + basis].get(particle))
          )

          // Since velocity is calculated only for the statistics output
          // we can compute this information less often than the position data
          // and still maintain a good visual experience
          if (shouldUpdateVelocity) {
            // calculate difference between the previous position and current position
            let dx0 = particle.position[basis] - particle.previousPosition[basis]
            // calculate difference between the current position and the next position
            let x = pbcCurrent(newPosition[basis], boxSize)
            let x0 = pbcPrevious(particle.position[basis], x, boxSize)
            let dx = x - x0

            // Pre-compute some coefficients
            let g2 = particle.mass * this.dtSquare * this.goy2
            let g3 = particle.mass * this.dtSquare * this.dt * this.goy3

            newVelocity[basis] = (
              (dx + dx0) +
              (g2 * particle.force[basis]) -
              (g3 * (particle.force[basis] - particle.previousForce[basis])) +
              (this[RANDOM_FORCE_CORRELATION_ACCESSOR + basis].get(particle) - this.sig1 * this[RANDOM_FORCE_ACCESSOR + basis].get(particle))
            )
            newVelocity[basis] *= (this.hn / this.dt)
          }
        }

        if (shouldUpdateVelocity) {
          particle.setVelocity(newVelocity)
        }
        particle.setPosition(newPosition, boxSize)
        // Now that we have integrated the force on this particle
        // we need to reset it or else force will tend towards infinity
        particle.clearForce()
      }
    }

    step(particles, systemInfo) {
        if (!this.init) {
            this.init = true
            this.initialStep(particles, systemInfo)
        } else {
            this.runningStep(particles, systemInfo)
        }
    }
}
