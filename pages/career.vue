<template>
  <section>
    <div class="job-list">
      <div class="job-card" v-for="(job, index) in jobs" :key="job.id">
        <img :src="job.img">
        <div>
          <h6>{{ job.name }}</h6>
          <div>{{ job.position }}</div>
          <div class="caption">{{ job.date }}</div>
        </div>
        <svg :class="[index % 2 ? 'rotate' : '']">
          <line stroke-linecap="round" x1="10" y1="10" x2="20" y2="20" stroke-width="5" stroke="#2d75c3"/>
          <line x1="20" y1="20" x2="54" y2="54" stroke-width="5" stroke="#2d75c3"/>
          <line x1="171" y1="171" x2="205" y2="205" stroke-width="5" stroke="#2d75c3"/>
          <line stroke-linecap="round" x1="205" y1="205" x2="215" y2="215" stroke-width="5" stroke="#2d75c3"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped lang="stylus">
  .job-list
    display: flex
    flex-wrap: wrap
    justify-content: center
    .job-card
      width: 225px
      position: relative
      text-align: center
      padding-bottom: 25px
      h6
        margin-bottom: 0
      .caption
        opacity: 0.75
        font-size: 0.85rem
      img
        z-index: 1
        padding: 3px
        min-width: 150px
        max-width: 150px
        min-height: 150px
        max-height: 150px
        background: white
        position: relative
        border-radius: 50%
        border: 3px solid #2d75c3
        transition: transform 0.5s ease-in-out
        transform: scale(0.8) rotateX(180deg) rotateY(180deg) rotateZ(180deg)
      &:hover img
        transform: scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
      svg
        left: 0
        top: -31.5px
        width: 225px
        height: 225px
        position: absolute
        transition: transform 0.5s ease-in-out
        &.rotate
          transform: rotate(90deg)
      &:hover svg
        transform: scale(0.8)
      &:hover svg.rotate
        transform: scale(0.8) rotate(90deg)
</style>

<script>
  import { JOBS } from '~/assets/constants/lists'

  export default {
    data () {
      return {
        jobs: JOBS
      }
    }
  }
</script>