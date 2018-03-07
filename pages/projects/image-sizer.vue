<template>
  <div>
    <div class="centered">
      <image-sizer @draw="revoke" @loaderror="onReset" ref="sizer" :width="250" :height="250" :file="file"/>
    </div>
    <div class="centered">
      <div v-if="!file" class="btn btn-upload">
        <span>Upload Image</span>
        <input type="file" title=" " @change="onFileChange">
      </div>
      <div v-if="file" class="btn btn-upload btn-small" @click="onFileSave">Generate</div>
      <div v-if="file" class="btn btn-accent btn-upload btn-small" @click="onReset">Reset</div>
    </div>
    <div class="centered crop-link" v-if="urls.length > 0">
      <a class="btn" v-for="url of urls" :key="url.name" :href="url.url" target="_blank">Download {{ url.name }}</a>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .btn-upload
    cursor: pointer
    position: relative
    span
      cursor: pointer
    input
      top: 0
      left: 0
      opacity: 0
      width: 100%
      height: 100%
      cursor: pointer
      position: absolute
  .crop-link
    padding-top: 10px
</style>

<script>
  import ImageSizer from 'vue-image-sizer'

  export default {
    components: { ImageSizer },
    data () {
      return {
        file: null,
        urls: []
      }
    },
    methods: {
      async onFileSave (e) {
        const blobs = await this.$refs.sizer.exportCanvas([
          { width: 250, height: 250 },
          { width: 75, height: 75 },
        ])

        this.revoke()
        this.urls.push({
          name: 'Cropped',
          url: window.URL.createObjectURL(blobs[1])
        })
        this.urls.push({
          name: 'Thumb',
          url: window.URL.createObjectURL(blobs[2])
        })
      },
      revoke () {
        for (const url of this.urls) {
          window.URL.revokeObjectURL(url)
        }
        this.urls = []
      },
      onReset () {
        this.revoke()
        this.file = null
      },
      onFileChange (e) {
        this.revoke()

        if (!e.target.files || e.target.files.length === 0) {
          this.file = null
          return
        }

        this.file = e.target.files[0]
      }
    }
  }
</script>