<template>
  <div>
    <div class="centered">
      <image-sizer :width="250" :height="250"/>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .centered {
    display: flex; 
    justify-content: center
  }
</style>

<script>
  import ImageSizer from 'vue-image-sizer'

  export default {
    components: { ImageSizer }
  }
</script>