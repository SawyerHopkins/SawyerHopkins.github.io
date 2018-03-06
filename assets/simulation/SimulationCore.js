/**
 * SimulationCore.js
 * Creates and initializes a simulation Engine
 * for rendering a two dimensional visualization.
 */

import Point from './Point'
import Engine from './Engine'
import Particle from './Particle'
import SoftShell from './Forces/SoftShell'
import { PARTICLE_COUNT, PARTICLE_RADIUS } from './Constants'

export default () => {
    let engine = new Engine()

    let latticeX = 0
    let latticeY = 0
    let latticeSpacing = 3 * PARTICLE_RADIUS
    let latticePointsPerRow = Math.ceil(Math.sqrt(PARTICLE_COUNT))
    let simulationBoxSize = latticeSpacing * latticePointsPerRow

    // Add all the particles needed by placing them roughly on a lattice
    // This should result in a somewhat normal spacial distribution
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Create a new point at the current lattice position
        let latticePoint = new Point(latticeX, latticeY)
        latticePoint.scale(latticeSpacing)
        // Add a particle somewhere near the lattice position
        engine.addParticle(Particle.aroundPoint(latticePoint, latticeSpacing))
        // Fill rows then columns
        if (latticeX === (latticePointsPerRow - 1)) {
            latticeX = 0
            latticeY++
        } else {
            latticeX++
        }
    }

    // Now that the particles are seeded we know the dimensions of the simulation box
    engine.setSize(simulationBoxSize)

    // We can now give the particles some initial velocity corresponding to system temperature
    engine.normalizeTemperature()

    // Add the soft shell potential
    engine.addForce(SoftShell)

    return engine
}
