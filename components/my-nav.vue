<template>
  <div class="nav-header">
    <router-link to="/education"><h6>Education</h6></router-link>
    <router-link to="/career"><h6>Career</h6></router-link>
    <router-link to="/projects"><h6>Projects</h6></router-link>
  </div>
</template>

<style scoped lang="stylus">
  .nav-header
    display: flex
    padding-bottom: 25px
    justify-content: center
    a
      color: white
      opacity: 0.75
      text-decoration: none
      &.nuxt-link-active
        opacity: 1
    h6
      cursor: pointer
      padding: 10px 15px
</style>

<script>
  export default {
    name: 'my-name'
  }
</script>