<template>
  <div class="project-container">
    <div class="project-item" v-for="project in projects" :key="project.id">
      <div class="project-info">
        <h6>{{ project.name }}</h6>
        <div>{{ project.lang }}</div>
      </div>
      <div class="btn"><router-link tag="div" :to="project.demo">Demo</router-link></div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .project-container
    display: flex
    flex-wrap: wrap
    justify-content: center
  .project-item
    display: flex
    align-items: center
    flex-direction: column
    justify-content: center
  .project-info
    width: 160px
    padding: 30px 0px 20px 0px
    margin: 10px 80px
    position: relative
    text-align: center
    h6
      margin-bottom: 0
    &:after
      top: 0
      left: -25%
      content: ''
      width: 150%
      height: 100%
      position: absolute
      border: 4px solid white
      transform: skewX(-3deg) skewY(-3deg)
</style>

<script>
  import { PROJECTS } from '~/assets/constants/lists'

  export default {
    data () {
      return {
        projects: PROJECTS
      }
    }
  }
</script>