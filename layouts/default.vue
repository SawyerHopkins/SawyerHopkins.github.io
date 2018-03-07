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
    height: 40px
    width: 150px
    cursor: pointer
    margin: 5px 10px
    font-weight: 500
    line-height: 40px
    font-size: 1.1rem
    position: relative
    text-align: center
    background: #2d75c3
    display: inline-block
    text-decoration: none
    color: white !important
    transform: skewX(-3deg) skewY(-3deg)
    transition: transform 0.3s ease-in-out
    &:hover
      transform: skewX(-3deg) skewY(-3deg) scale(1.2)
    &.btn-accent
      background: #bf6f9d
    &.btn-small
      width: 100px
      height: 30px
      font-size: 0.9rem
      line-height: 30px
  .centered
    display: flex; 
    justify-content: center
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