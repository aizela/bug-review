<template>
  <view
    class="container"
    id="editor-container"
    :style="{
      backgroundColor: props.backgroundColor,
      borderRadius: props.borderRadius,
      maxHeight: props.maxHeight ? props.maxHeight + 'px' : ''
    }"
    @longpress="handleLongPress"
  >
    <view class="page-body">
      <view class="wrapper">
        <view v-if="props.showBar" class="toolbar" @tap="format">
          <view
            :class="formats.bold ? 'ql-active' : ''"
            class="iconfont icon-zitijiacu"
            data-name="bold"
          />
          <view
            :class="formats.fontSize === '24px' ? 'ql-active' : ''"
            class="iconfont icon-fontsize"
            data-name="fontSize"
            data-value="24px"
          />

          <view
            :class="formats.list === 'ordered' ? 'ql-active' : ''"
            class="iconfont icon-youxupailie"
            data-name="list"
            data-value="ordered"
          />
          <view
            :class="formats.list === 'bullet' ? 'ql-active' : ''"
            class="iconfont icon-wuxupailie"
            data-name="list"
            data-value="bullet"
          />
          <view class="iconfont icon-charutupian" @tap="insertImage" />
          <view
            :class="formats.header === 1 ? 'ql-active' : ''"
            class="iconfont icon-format-header-1"
            data-name="header"
            :data-value="1"
          />

          <view class="iconfont icon-shanchu" @tap="clear" />
        </view>

        <view class="editor-wrapper">
          <editor
            id="editor"
            class="custom-editor ql-container"
            show-img-size
            show-img-toolbar
            show-img-resize
            adjust-position
            @statuschange="onStatusChange"
            @ready="onEditorReady"
            @input="onInput"
            @focus="handleEditorFocus"
          ></editor>
          <view v-if="limit > 0" class="limit-wrapper">
            {{ currentLength }} /
            <text class="limit">{{ limit }}</text>
          </view>
        </view>
        <view>
          <!-- <button @tap="getCon">打印文本内容</button> -->
        </view>
      </view>
    </view>
    <view class="mask" v-if="showBtn" @tap="handleClickMask">
      <view
        class="float-btn flex flex-a-c"
        :style="{
          left: `${floatBtnPosition.x}px`,
          top: `${floatBtnPosition.y}px`
        }"
      >
        <view class="rewrite-btn flex flex-a-c" @click="handleReplaceSelection">
          <image src="/static/images/rewrite.png" class="rewrite-icon" />
          <text>AI改写</text>
        </view>
        <view class="line" />
        <view @click="handleCopy">复制</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue'
const instance = getCurrentInstance().proxy

interface Props {
  limit?: number
  showBar?: boolean
  height?: number | string
  backgroundColor?: string
  borderRadius?: number | string
  maxHeight?: number
  isAi?: boolean
}

onMounted(() => {
  uni.$off('keyboardheightchange')
})

const emit = defineEmits(['copy', 'focus'])

const props = withDefaults(defineProps<Props>(), {
  limit: 0,
  showBar: true,
  backgroundColor: '',
  borderRadius: '',
  maxHeight: 0,
  isAi: true
})

const isReadonly = ref(false)

const formats = ref({} as any)
let editorCtx = null

// 编辑器内容获取
const getCon = () => {
  editorCtx?.getContents({
    success: (res: any) => {
      console.log('文本详情：', res)
      uni.$emit('editor-context', res)
    },
    fail: (err: any) => {
      console.error('获取富文本失败', err)
    }
  })
}

const currentLength = ref(0)
const onInput = (e: any) => {
  // console.log('onInput', e)
  const { detail } = e
  currentLength.value = detail.html === '<p><br></p>' ? 0 : detail.text.length
}

// 编辑器初始化

const onEditorReady = () => {
  const query = uni.createSelectorQuery().in(instance)
  query
    .select('#editor')
    .context((res: any) => {
      editorCtx = res.context
    })
    .exec()
  setTimeout(() => {
    editorCtx?.setContents({
      html: '<h1>标题</h1><p>测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容</p>'
    })
  }, 500)
}

// 编辑器操作方法
const undo = () => {
  editorCtx?.undo()
}

const redo = () => {
  editorCtx?.redo()
}

const format = (e: any) => {
  // console.log('111111111111111', e)
  const { name, value } = e.target.dataset
  if (!name) return
  editorCtx?.format(name, value)
}

const showBtn = ref(false)
const floatBtnPosition = ref({ x: 0, y: 0 })
const screenWidth = uni.getSystemInfoSync().windowWidth
const screenHeight = uni.getSystemInfoSync().windowHeight
const btnWidth = 158 // 按钮宽度
const btnHeight = 40 // 按钮高度

watch(showBtn, newVal => {
  if (!newVal) {
    isReadonly.value = true
  }
})

const handleLongPress = e => {
  if (!props.isAi) return
  console.log('长按', e)
  uni.hideKeyboard({
    success: () => {
      console.log('隐藏键盘成功')
    },
    complete: () => {
      console.log('隐藏键盘完成')
    }
  })
  // 等待一个再出现mask,不然mask出现时选中效果会消失
  const start = new Date().getTime()
  while (true) {
    if (new Date().getTime() - start >= 500) break
  }

  editorCtx?.getSelectionText({
    success: (res: any) => {
      console.log('选中的文本', res)
      if (res.text.length) {
        showBtn.value = true
        editorCtx?.format('backgroundColor', '#0777FF')
        // editorCtx?.blur()
        // isReadonly.value = true
      }
    }
  })
  // 获取触摸点位置
  const { clientX, clientY } = e.touches[0]

  // 计算按钮位置，考虑边界情况
  let x = clientX - btnWidth / 2 // 让按钮水平居中对齐
  let y = clientY + 30 // 放在手指正下方30px的位置

  // 处理水平边界
  if (x < 10) {
    x = 10 // 确保按钮不会超出左边界
  } else if (x + btnWidth > screenWidth) {
    x = screenWidth - btnWidth - 10 // 确保按钮不会超出右边界
  }

  // 处理底部边界
  if (y + btnHeight > screenHeight) {
    y = screenHeight - btnHeight - 10 // 确保按钮不会超出底部
  }

  floatBtnPosition.value = { x, y }
}
const handleClickMask = () => {
  // console.log('单击')
  showBtn.value = false
}

const handleReplaceSelection = () => {
  // console.log('替换选中的内容', editorCtx)
  console.log('editorContext实例:',editorCtx)
  // editorCtx?.blur()
  editorCtx?.getSelection({
    success: (res: any) => {
      console.log('选区位置', res)
    }
  })
  // editorCtx?.format('strike')

  // setTimeout(() => {
  //   editorCtx?.format('backgroundColor', '#0777FF')
  // }, 2000)

  // setTimeout(() => {
  //   editorCtx?.insertText({
  //     text: '替换选内容替换选内容替换选内容替换选内容替换选内容替换选内容替换选内容'
  //   })
  // }, 2000)
}

const handleCopy = () => {
  editorCtx?.getSelectionText({
    success: (res: any) => {
      uni.setClipboardData({
        data: res.text,
        success: () => {
          emit('copy')
        }
      })
    }
  })
}

const onStatusChange = (e: any) => {
  // console.log('11111111111111111', e)
  formats.value = e.detail
}

const insertDivider = () => {
  editorCtx?.insertDivider({
    success: () => {
      console.log('insert divider success')
    }
  })
}

const clear = () => {
  uni.showModal({
    title: '清空编辑器',
    content: '确定清空编辑器全部内容？',
    success: res => {
      if (res.confirm) {
        editorCtx?.clear({
          success: () => {
            console.log('clear success')
          }
        })
      }
    }
  })
}

const removeFormat = () => {
  editorCtx?.removeFormat()
}

const insertDate = () => {
  const date = new Date()
  const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  editorCtx?.insertText({
    text: formatDate
  })
}

const insertImage = () => {
  uni.chooseImage({
    count: 1,
    success: res => {
      editorCtx?.insertImage({
        src: res.tempFilePaths[0],
        alt: '图像',
        success: () => {
          console.log('insert image success')
        }
      })
    }
  })
}

const handleEditorFocus = e => {
  console.log('编辑器聚焦', e)
  if (props.isAi) {
    // 隐藏键盘
    uni.hideKeyboard()
    emit('focus')
  }
}

// const handleKeyboardHeightChange = (e) => {
//   console.log('富文本键盘高度变化', e)
// }
</script>

<style lang="scss" scoped>
@import './editor-icon.css';
.container {
  height: 300px;
  overflow-y: auto;
  // -webkit-user-select: none;
  -webkit-touch-callout: none;
}
.wrapper {
  height: 100%;
}

.editor-wrapper {
  position: relative;
}

.iconfont {
  display: inline-block;
  padding: 8px 8px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 20px;
}

.toolbar {
  box-sizing: border-box;
  border-bottom: 0;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}

.ql-container {
  box-sizing: border-box;
  padding: 12px 15px;
  width: 100%;
  height: 100%;
  font-size: 16px;
  user-select: text;
  -webkit-user-select: text;
}

.ql-active {
  color: #06c;
}

.limit-wrapper {
  position: absolute;
  bottom: 24rpx;
  right: 28rpx;
  color: #fff;
  font-size: 24rpx;
  .limit {
    color: rgba(255, 255, 255, 0.5);
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}
.float-btn {
  position: fixed;
  z-index: 999;
  background-color: #484a52;
  border-radius: 8px;
  color: #fff;
  font-size: 26rpx;
  padding: 24rpx 32rpx;
  column-gap: 36rpx;

  .rewrite-btn {
    column-gap: 12rpx;
    .rewrite-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }
  .line {
    background-color: #676973;
    width: 2rpx;
    height: 28rpx;
  }
}
</style>
