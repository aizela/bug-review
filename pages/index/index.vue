<template>
	<view class="content">
		<wd-datetime-picker placeholder="请选择检查时间" min-date="" :max-date="new Date().getTime()" :default-value="state.testTime"
			v-model="state.testTime" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				state: {
					testTime: ''
				}
			}
		},
		onLoad() {
			setTimeout(() => {
				const time = new Date('2024/03/12 19:23:22').getTime()
				this.$nextTick((() => {

					this.state.testTime = time
				}))
				console.log(time);
			}, 100)
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>