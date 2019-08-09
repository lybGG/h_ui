<template>
  <!-- <div :class="['h-input-group-prepend']" v-if="prepend"><slot name="prepend"></slot></div> -->
  <div :class="wrapClasses">
    <div :class="handlerClasses">
      <div :class="arrowClasser">
        <a @click="up" @mouse.down="preventDefault" :class="upClasses">
          <span :class="innerUpClasses" @click="preventDefault"></span>
        </a>
        <a @click="down" @mouse.down="preventDefault" :class="downClasses">
          <span :class="innerDownClasses" @click="preventDefault"></span>
        </a>
      </div>
      <div :class="[prefixCls + '-append']" v-if="append">
        <slot name="append"></slot>
      </div>
    </div>
    <div :class="inputWrapClasses">
      <input
        ref="input"
        :class="inputClasses"
        :disabled="disabled"
        autocomplete="off"
        :autofocus="autofocus"
        @focus="focus"
        @blur="blur"
        @keydown.stop="keyDown"
        @input="change"
        @change="change"
        :value="viewValue==null?'':viewValue"
        :readonly="!editable ||readonly"
        :tabindex="tabindex"
      />
    </div>
  </div>
</template>
<script>
import {
  oneOf,
  scientificNotationToString,
  toFixedForString
} from "../../util/tools";
import Emitter from "../../mixins/emitter";

const prefixCls = "h-input-number";
const iconPrefixCls = "h-icon";

// function isValueNumber(value) {
//   return /(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/.test(value + '')
// }

function addNum(num1, num2) {
  let sq1, sq2, m;
  try {
    sq1 = num1.toString().split(".")[1].length;
  } catch (e) {
    sq1 = 0;
  }
  try {
    sq2 = num2.toString().split(".")[1].length;
  } catch (e) {
    sq2 = 0;
  }
  m = Math.pow(10, Math.max(sq1, sq2));
  return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
}

export default {
  name: "InputNumber",
  mixins: [Emitter],
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      default: 1
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large"]);
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      validator(value) {
        return value >= 0 && value <= 20;
      }
    },
    setzero: {
      type: Boolean,
      default: false
    },
    // 不使用科学计数法显示
    notScientificNotation: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: [String, Number],
      default: "0",
      validator(value) {
        let num = parseInt(value);
        return num <= 32767 && num >= -1;
      }
    },
    focusAllSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      focused: false,
      upDisabled: false,
      downDisabled: false,
      currentValue: this.value,
      prepend: true,
      append: true,
      viewValue: this.value, // 显示值
      oldValue: ""
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-readonly`]: this.readonly,
          [`${prefixCls}-editable`]: !this.editable,
          [`${prefixCls}-focused`]: this.focused,
          [`${prefixCls}-group`]: this.prepend || this.append,
          [`${prefixCls}-group-with-prepend`]: this.prepend,
          [`${prefixCls}-group-with-append`]: this.append
        }
      ];
    },
    handlerClasses() {
      return `${prefixCls}-handler-wrap`;
    },
    arrowClasser() {
      return `${prefixCls}-arrow-wrap`;
    },
    upClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-up`,
        {
          [`${prefixCls}-handler-up-disabled`]: this.upDisabled
        }
      ];
    },
    innerUpClasses() {
      return `${prefixCls}-handler-up-inner ${iconPrefixCls} iconfont icon-packup`;
    },
    downClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-down`,
        {
          [`${prefixCls}-handler-down-disabled`]: this.downDisabled
        }
      ];
    },
    innerDownClasses() {
      return `${prefixCls}-handler-down-inner ${iconPrefixCls} iconfont icon-unfold`;
    },
    inputWrapClasses() {
      return `${prefixCls}-input-wrap`;
    },
    inputClasses() {
      return `${prefixCls}-input`;
    }
    // precisionValue() {
    //   return this.precision
    //     ? this.currentValue.toFixed(this.precision)
    //     : this.currentValue
    // },
  },
  methods: {
    preventDefault(e) {
      e.preventDefault();
    },
    up(e) {
      console.log("============触发了 up===========");
      console.log(e);
      const targetVal = Number(e.target.value);
      if (this.upDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep("up", e);
    },
    down(e) {
      console.log("============触发了 down===========");
      console.log(e);
      const targetVal = Number(e.target.value);
      if (this.downDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep("down", e);
    },
    changeStep(type, e) {
      console.log("============触发了 changeStep===========");
      console.log("type:" + type);
      console.log("e:" + e);
      console.log(e);
      if (this.disabled || this.readonly) {
        return false;
      }
      const targetVal = Number(e.target.value);
      let val = Number(this.currentValue);
      const step = Number(this.step);
      if (isNaN(val)) {
        return false;
      }
      // input a number, and key up or down
      if (!isNaN(targetVal)) {
        if (type === "up") {
          if (addNum(targetVal, step) <= this.max) {
            val = targetVal;
          } else {
            return false;
          }
        } else if (type === "down") {
          if (addNum(targetVal, -step) >= this.min) {
            val = targetVal;
          } else {
            return false;
          }
        }
      }
      if (type === "up") {
        val = addNum(val, step);
      } else if (type === "down") {
        val = addNum(val, -step);
      }
      this.setValue(val);
    },
    setValue(val) {
      console.log("============触发了setValue===========");
      console.log("val:" + val);
      // 如果 step 是小数，且没有设置 precision ，是有问题的
      if (!isNaN(this.precision) && val !== null) {
        val = Number(Number(val).toFixed(this.precision));
        isNaN(val) && (val = 0);
      }
      this.$nextTick(() => {
        this.currentValue = val;
        this.$emit("input", val);
        this.$emit("on-change", val);
        this.dispatch("FormItem", "on-form-change", val);
      });
    },
    focus(event) {
      console.log("============触发了focus===========");
      if (this.focusAllSelect) {
        this.$refs.input.select();
      }
      this.focused = true;
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
      this.$emit("on-focus", event);
    },
    blur(event) {
      console.log("============触发了blur===========");
      console.log(event);
      if (event == undefined) {
        this.focused = false;
        return;
      }
      if (event.target.value.trim() == "" && !this.setzero) {
        this.setValue(null);
        this.focused = false;
        this.viewValue = null;
        return;
      }
      let val = Number(event.target.value.trim());
      this.focused = false;
      const { min, max } = this;
      if (val !== null) {
        if (val > max) {
          this.setValue(max);
        } else if (val < min) {
          this.setValue(min);
        } else {
          this.setValue(val);
        }
      }
    },
    keyDown(e) {
      console.log("============触发了keydown===========");
      console.log(e);
      if (e.keyCode === 38) {
        e.preventDefault();
        this.up(e);
      } else if (e.keyCode === 40) {
        e.preventDefault();
        this.down(e);
      }
    },
    change(event) {
      console.log("============触发了change===========");
      console.log(event);
      let val = event.target.value.trim();
      console.log("val:" + val);
      // 设置setzero后 清空后置为0(有min时置为min[后续判断])
      val = val == "" && this.setzero ? "0" : val;
      const isEmptyString = val.length === 0;
      if (isEmptyString) {
        this.setValue(null);
        this.oldValue = null;
        return;
      }
      if (event.type == "input" && val.match(/^\-?\.?$|\.$/)) return; // prevent fire early if decimal. If no more input the change event will fire later
      // if (event.type == "change" && Number(val) === this.currentValue) return; // already fired change for input event
      const { min, max } = this;
      val = Number(val);
      if (!isNaN(val)) {
        this.currentValue = val;
        if (val > max) {
          val = max;
          event.target.value = val;
          this.viewValue = val;
        } else if (val < min) {
          val = min;
          event.target.value = val;
          this.viewValue = val;
        } else {
          this.downDisabled = false;
          this.upDisabled = false;
        }
        this.oldValue = val;
      } else {
        if (this.oldValue === null || this.oldValue === "") {
          event.target.value = this.viewValue;
        } else {
          event.target.value = this.oldValue;
        }
      }
    },
    changeDisable() {},

    changeVal(val) {
      console.log("============触发了 changeVal===========");
      console.log("val:" + val);
      console.log("this.currentValue:" + val);
      console.log("this.viewValue:" + this.viewValue);
      if (this.currentValue == null && this.viewValue != this.currentValue) {
        this.viewValue = null;
        return;
      }
      val = Number(val);

      // this.$nextTick(
      //   () => {
      //   console.log("hhh");
      //   this.upDisabled = false;
      // });

      if (!isNaN(val)) {
        let step = this.step;

        if (val >= this.max) {
          // this.$nextTick(() => {
          //   console.log("hhh");
          //   this.upDisabled = true;
          // });
        }
        if (val <= this.max) {
          // this.$nextTick(() => {
          //   this.downDisabled = true;
          // });
        }
        // this.upDisabled = val + step > this.max;
      } else {
        this.upDisabled = false;
        this.downDisabled = false;
      }
      // this.viewValue = val;
    },
    /**
     * @description 计算显示值
     */
    calcViewValue() {
      console.log("============触发了 calcViewValue===========");
      if (this.notScientificNotation) {
        let s = scientificNotationToString(this.currentValue);
        this.viewValue = this.precision
          ? toFixedForString(s, this.precision)
          : s;
      } else {
        this.viewValue = this.precision
          ? this.currentValue.toFixed(this.precision)
          : this.currentValue;
      }
    }
  },
  mounted() {
    this.changeVal(this.currentValue);
    if (this.value < this.min) this.setValue(this.min);
    this.prepend = this.$slots.prepend !== undefined;
    this.append = this.$slots.append !== undefined;
  },
  watch: {
    value: {
      immediate: true,
      handler: function(val) {
        if (val == null) {
          this.currentValue = null;
          return;
        }
        this.currentValue = val < this.min ? this.min : val;
        this.calcViewValue();
      }
    },
    currentValue(val) {
      this.changeVal(val);
    },
    min() {
      this.changeVal(this.currentValue);
    },
    max() {
      this.changeVal(this.currentValue);
    }
  }
};
</script>
