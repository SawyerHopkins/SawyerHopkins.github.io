<template>
  <div class="header-container">
    <img src="~/assets/media/logo.jpg">
    <h5 class="header-title">Sawyer Hopkins</h5>
    <div>Code. Test. Repeat.</div>
    <div class="social-icons">
      <a href="https://www.linkedin.com/in/sawyerhopkins" target="_blank"><i class="fab fa-linkedin"></i></a>
      <a href="https://github.com/SawyerHopkins" target="_blank"><i class="fab fa-github-square"></i></a>
    </div>
    <svg viewBox="0 0 930 60" preserveAspectRatio="none">
      <path d="M 50 10 L 20 20 L 920 50 Z" stroke-width="1.5" stroke="#bf6f9d" fill="#bf6f9d"/>
    </svg>
  </div>
</template>

<style scoped lang="stylus">
  .header-container
    padding-top: 15px
    text-align: center
    img
      min-width: 100px
      min-height: 100px
      border-radius: 10%
      border: 2px solid white
    svg
      width: 100%
      height: 60px
      margin: auto
      display: block
      max-height: 60px
  .header-title
    margin-bottom: 0
  .social-icons
    a
      color: white
    i
      margin: 10px 5px
      font-size: 1.25rem
</style>

<script>
  export default {
    name: 'my-header'
  }
</script>