"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      state: {
        testTime: ""
      }
    };
  },
  onLoad() {
    setTimeout(() => {
      const time = (/* @__PURE__ */ new Date("2024/03/12 19:23:22")).getTime();
      this.$nextTick(() => {
        this.state.testTime = time;
      });
      console.log(time);
    }, 100);
  },
  methods: {}
};
if (!Array) {
  const _easycom_wd_datetime_picker2 = common_vendor.resolveComponent("wd-datetime-picker");
  _easycom_wd_datetime_picker2();
}
const _easycom_wd_datetime_picker = () => "../../uni_modules/wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.js";
if (!Math) {
  _easycom_wd_datetime_picker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.state.testTime = $event),
    b: common_vendor.p({
      placeholder: "请选择检查时间",
      ["min-date"]: "",
      ["max-date"]: (/* @__PURE__ */ new Date()).getTime(),
      ["default-value"]: $data.state.testTime,
      modelValue: $data.state.testTime
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
