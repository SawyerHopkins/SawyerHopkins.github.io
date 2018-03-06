<template>
  <section>
    <div class="edu-list">
      <div class="edu-card" v-for="edu in education" :key="edu.id">
        <img :src="edu.img">
        <div>
          <h6>{{ edu.name }}</h6>
          <div>{{ edu.level }}</div>
        </div>
        <svg>
          <line class="slash-center" stroke-linecap="round" x1="10" y1="10" x2="290" y2="290" stroke-width="5" stroke="#2d75c3"/>
          <line class="slash-top" stroke-linecap="round" x1="80" y1="20" x2="270" y2="210" stroke-width="5" stroke="#2d75c3"/>
          <line class="slash-bottom" stroke-linecap="round" x1="50" y1="110" x2="180" y2="240" stroke-width="5" stroke="#2d75c3"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped lang="stylus">
  .edu-list
    display: flex
    flex-wrap: wrap
    justify-content: center
    .edu-card
      width: 300px
      position: relative
      text-align: center
      padding-bottom: 25px
      h6
        margin-bottom: 0
      img
        z-index 1
        padding: 3px
        min-width: 200px
        max-width: 200px
        min-height: 200px
        max-height: 200px
        border-radius: 50%
        position: relative
        transform: scale(0.8)
        transition: transform 0.5s ease-in-out
      svg
        left: 0
        top: -31.5px
        width: 300px
        height: 300px
        position: absolute
      line
        transition: transform 0.5s ease-in-out
      &:hover
        img
          transform: scale(1)
        .slash-center
          transform: translateX(-10px) translateY(-10px)
        .slash-top
          transform: translateX(10px) translateY(10px)
        .slash-bottom
          transform: translateX(-10px) translateY(-10px)

</style>

<script>
  import { EDUCATION } from '~/assets/constants/lists'

  export default {
    data () {
      return {
        education: EDUCATION
      }
    }
  }
</script>