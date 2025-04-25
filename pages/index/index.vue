<template>
  <view class="container">
    <wd-slider
      v-model="setting.speed"
      :min="160"
      :max="280"
      :step="30"
      hide-min-max
      active-color="#red"
      inactive-color="#53575C"
    ></wd-slider>
  </view>
</template>

<script>
export default {
  data() {
    return {
      setting: {
        speed: 220
      }
    }
  },
  methods: {}
}
</script>

<style>
.container {
  margin: 0 auto;
  width: 80vw;
  padding: 20rpx;
}
</style>
