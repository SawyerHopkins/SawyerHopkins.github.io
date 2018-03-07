<template>
  <div id="simulation">
    <svg
      :viewBox="viewBox"
      :width="engine.size * scale"
      :height="engine.size * scale"
      style="border: 1px solid rgb(51, 51, 51)"
    >
      <circle
        fill="none"
        :key="index"
        stroke="#2d75c3"
        :stroke-width="scale / 20"
        :r="particle.radius * scale"
        :cx="particle.position.x * scale"
        :cy="particle.position.y * scale"
        v-for="(particle, index) in engine.particles"
      ></circle>
      <svg width="150" height="150">
        <rect
          id="stats-container" x="0" y="0" width="150" height="150" fill="#222"  fill-opacity="0.9"
        >
        </rect>
        <text x="50%" text-anchor="middle" y="20" stroke="white">
          System Stats
        </text>
        <line x1="2" x2="148" y1="30" y2="30" stroke-width="1" stroke="white"></line>
        <text x="50%" text-anchor="middle" y="50" stroke="white">
          # Particles: {{ engine.particles.length }}
        </text>
        <text x="50%" text-anchor="middle" y="70" stroke="white">
          Temperature: {{ engine.realTemperature.toFixed(2) }}
        </text>
        <text x="50%" y="110" text-anchor="middle" stroke="white">
          Velocity Distribution
        </text>
        <rect
          width="5"
          :key="index"
          fill="#bf6f9d"
          :x="40 + (7*index)"
          :height="60 * value"
          class="velocity-bin"
          :y="140 - (60 * value)"
          v-for="(value, key, index) in velocityBins"
        ></rect>
      </svg>
    </svg>
    <div class="action-buttons">
      <div class="btn btn-small" @click="simRun">Run</div>
      <div class="btn btn btn-accent btn-small" @click="simStop">Stop</div>
      <div class="btn btn btn-accent btn-small" @click="simReset">Reset</div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  #simulation
    display: flex
    align-items: center
    flex-direction: column
    justify-content: center
  #stats-container
    transition: all 1s
    &:hover
      fill: #444

  .velocity-bin
    transition: all 0.8s
  .action-buttons
    display flex
</style>

<script>
  import Simulation from '~/assets/simulation/SimulationCore'

  const HISTOGRAM_MAX = 4
  const HISTOGRAM_MIN = 1
  const HISTOGRAM_BINS = 8

  export default {
    data() {
      return {
        scale: 50,
        engine: null,
        runTimeout: null,
      }
    },
    computed: {
      viewBox() {
        return ['0', '0', this.engine.size * this.scale, this.engine.size * this.scale].join(' ')
      },
      velocityBins() {
        let magnitudes = []

        // Get the magnitude of each particles velocity
        // also find the maximum and minimum velocity
        for (let particle of this.engine.particles) {
          let magnitude = particle.velocity.magnitude()
          magnitudes.push(magnitude)
        }

        // Determine the bin size
        let binWidth = (HISTOGRAM_MAX - HISTOGRAM_MIN) / HISTOGRAM_BINS
        let bins = {}

        // Create each bin
        for (let i = 0; i < HISTOGRAM_BINS; i++) {
          bins[`BIN${i}`] = 0
          // Define bin bounds
          let lowerBound = (i * binWidth) + HISTOGRAM_MIN
          let upperBound = lowerBound + binWidth
          // Check each particles bin status
          for (let magnitude of magnitudes) {
            let greaterThanLower = lowerBound <= magnitude
            // We want the last bin to be inclusive of the upper bound
            let lessThanUpper = i === (HISTOGRAM_BINS - 1) ? magnitude <= upperBound : magnitude < upperBound
            // Check the bin size
            if (greaterThanLower && lessThanUpper) {
              bins[`BIN${i}`]++
            }
          }

          // Normalize bin
          bins[`BIN${i}`] /= magnitudes.length
        }

        return bins
      }
    },
    created() {
      this.simReset()
    },
    mounted() {
      this.onResize()
      window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
      this.simStop()
      window.removeEventListener('resize', this.onResize)
    },
    methods: {
      simRun() {
        if (!this.runTimeout) {
          console.log('running')
          this.simTick()
        }
      },
      simTick() {
        this.engine.tick()
        this.runTimeout = setTimeout(this.simTick, 40)
      },
      simStop() {
        if (this.runTimeout) {
          console.log('stopping')
          clearTimeout(this.runTimeout)
          this.runTimeout = null
        }
      },
      simReset() {
        this.engine = Simulation()
      },
      onResize() {
        let availableWidth = document.getElementById('simulation').clientWidth
        this.scale = ((availableWidth / this.engine.size) / 2.0)
      }
    }
  }
</script>
