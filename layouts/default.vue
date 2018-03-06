<template>
  <div class="container my-website">
    <my-header/>
    <my-nav/>
    <nuxt/>
  </div>
</template>

<style scoped>
  .my-website {
    padding: 15px;
  }
</style>

<style lang="stylus">
  .btn
    z-index: 1
    margin: 5px
    height 40px
    width: 150px
    cursor: pointer
    font-weight: 500
    line-height: 40px
    font-size: 1.1rem
    position: relative
    text-align: center
    background: #2d75c3
    display: inline-block
    transform: skewX(-3deg) skewY(-3deg)
    transition: transform 0.3s ease-in-out
    &:hover {
      transform: skewX(-3deg) skewY(-3deg) scale(1.1)
    }
</style>

<script>
  import MyNav from '~/components/my-nav'
  import MyHeader from '~/components/my-header'

  export default {
    components: { MyNav, MyHeader },
    computed: {
      version () {
        return this.$store.state.ui.version
      }
    },
    mounted () {
      console.log('I like javascript.')
      console.log(`This is version ${this.version}`)
    }
  }
</script>