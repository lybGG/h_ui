<template>
  <div v-transfer-dom :data-transfer="transfer">
    <transition :name="transitionNames[1]">
      <div :class="maskClasses" v-show="visible" @click="mask" :style="stylecls"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick" :style="stylecls" ref="wrap">
      <transition :name="transitionNames[0]" @after-leave="animationFinish">
        <!-- <div :class="classes"> -->
        <div
          :class="[prefixCls + '-content']"
          v-show="visible"
          v-if="rendered || !lazyload"
          :style="mainStyles"
          ref="content"
        >
          <a :class="[prefixCls + '-maximize']" v-if="maximize" @click="switchSize">
            <slot name="maximize">
              <Icon :name="maxName"></Icon>
            </slot>
          </a>
          <a :class="[prefixCls + '-close']" v-if="closable" @click="close">
            <slot name="close">
              <Icon name="close"></Icon>
            </slot>
          </a>
          <div
            :class="[prefixCls + '-header']"
            ref="msgHeader"
            v-if="showHead"
            v-drag="[this.canDrag,this.isBeyond,this.closeDrop]"
          >
            <slot name="header">
              <div :class="[prefixCls + '-header-inner']">{{ title }}</div>
            </slot>
          </div>
          <div :class="[prefixCls + '-body']" :style="contentStyle">
            <slot></slot>
          </div>
          <div :class="[prefixCls + '-footer']" v-if="!footerHide" ref="msgFooter">
            <slot name="footer">
              <h-button type="text" size="large" @click="cancel">{{ localeCancelText }}</h-button>
              <h-button
                type="primary"
                size="large"
                :loading="buttonLoading"
                @click="ok"
              >{{ localeOkText }}</h-button>
            </slot>
          </div>
        </div>
        <!-- </div> -->
      </transition>
    </div>
  </div>
</template>
<script>
import Icon from "../Icon/Icon.vue";
import hButton from "../Button/Button.vue";
import TransferDom from "../../directives/transfer-dom";
import ScrollbarMixins from "./mixins-scrollbar";
import Locale from "../../mixins/locale";
import Emitter from "../../mixins/emitter";
import Drag from "../../directives/drag.js";
import { on, off } from "../../util/dom";
const prefixCls = "h-modal";

export default {
  name: "Msgbox",
  mixins: [Locale, Emitter, ScrollbarMixins],
  components: { Icon, hButton },
  directives: { TransferDom, Drag },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    width: {
      type: [Number, String],
      default: 520
    },
    okText: {
      type: String
    },
    cancelText: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object
    },
    className: {
      type: String
    },
    // for instance
    footerHide: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    transitionNames: {
      type: Array,
      default() {
        return ["ease", "fade"];
      }
    },
    transfer: {
      type: Boolean,
      default: true
    },
    top: {
      top: [String, Number],
      default: 100
    },
    escClose: {
      type: Boolean,
      default: false
    },
    canDrag: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 1000
    },
    isBeyond: {
      type: Boolean,
      default: false
    },
    isOriginal: {
      type: Boolean,
      default: false
    },
    height: [String, Number],
    maxHeight: [String, Number],
    maximize: {
      type: Boolean,
      default: false
    },
    left: [String, Number],
    closeDrop: {
      type: Boolean,
      default: false
    },
    disableTabEvent: {
      type: Boolean, //禁止tab点击事件
      default: false
    },
    maskTop: {
      top: [String, Number],
      default: null
    },
    maskLeft: {
      top: [String, Number],
      default: null
    },
    // escClose 触发前调用的函数，其返回结果影响弹窗关闭与否
    beforeEscClose: {
      type: Function,
      default: () => true
    },
    /* 是否开启内容懒加载 */
    lazyload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      wrapShow: false,
      showHead: true,
      buttonLoading: false,
      visible: this.value,
      screenWidth: null,
      curWidth: this.width,
      curHeight: 0,
      tpLeft: 0,
      isMax: false,
      realClose: true, // esc时是否真正需要关闭弹出窗口
      // 弹框内容渲染标识
      rendered: false,
      WindosInnerHeight: window.innerHeight,
      headerHeight: 0,
      footerHeight: 0
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}-wrap`,
        {
          [`${prefixCls}-hidden`]: !this.wrapShow,
          [`${this.className}`]: !!this.className
        }
      ];
    },
    maskClasses() {
      return `${prefixCls}-mask`;
    },
    classes() {
      return `${prefixCls}`;
    },
    mainStyles() {
      this.screenWidth = document.documentElement.clientWidth;
      let style = {};
      const width = parseInt(this.curWidth);
      let offsetWidth = width <= 100 ? (this.screenWidth * width) / 100 : width;
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`,
        height: this.curHeight ? this.curHeight + "px" : "auto"
      };
      if (this.height && this.height < 100 && !this.curHeight) {
        styleWidth.height = `${this.height}%`;
      }
      style.top = this.isMax ? "0" : this.actualTop + "px";
      if (this.isMax) {
        style.left = "0px";
      } else {
        style.left =
          this.left == undefined
            ? (this.screenWidth - offsetWidth) / 2 + "px"
            : this.left + "px";
      }

      const customStyle = this.styles ? this.styles : {};
      Object.assign(style, styleWidth, customStyle);
      return style;
    },
    localeOkText() {
      if (this.okText === undefined) {
        return this.t("i.modal.okText");
      } else {
        return this.okText;
      }
    },
    localeCancelText() {
      if (this.cancelText === undefined) {
        return this.t("i.modal.cancelText");
      } else {
        return this.cancelText;
      }
    },
    stylecls() {
      let style = {};
      style.zIndex = this.zIndex;
      if (this.maskTop) {
        style.top = this.maskTop + "px";
      }
      if (this.maskLeft) {
        style.left = this.maskLeft + "px";
      }
      return style;
    },
    contentStyle() {
      let style = {};
      style.overflowY = "auto";
      if (this.isMax) {
        let mHeigth = this.curHeight - this.headerHeight - this.footerHeight;
        style.height = `${mHeigth}px`;
        style.maxHeight = `${mHeigth}px`;
      } else {
        if (this.height) {
          style.height = this.height <= 100 ? `auto` : `${this.height}px`;
        }
        if (this.maxHeight) {
          style.maxHeight = `${this.maxHeight}px`;
        }
      }
      return style;
    },
    maxName() {
      return this.isMax ? "max" : "min";
    },
    actualTop() {
      if (this.height < this.WindosInnerHeight) {
        return this.top;
      }
      let hHeight = this.showHead ? this.headerHeight : 0;
      let fHeight = this.footerHide ? 0 : this.headerHeight;
      let allHeight = hHeight + fHeight + this.height;
      return this.top + (allHeight - this.WindosInnerHeight) / 2;
    },
    actualHeight() {}
  },
  methods: {
    close() {
      // 如果是 js 调用的 msgbox 则调用 Msgbox-js 的 cancel
      if (
        this.$parent &&
        this.$parent.$options &&
        this.$parent.$options.name === "Msgbox-js"
      ) {
        this.$parent.cancel();
        return;
      }

      this.$emit("on-close");
      this.visible = false;
      this.$emit("input", false);
    },
    headClick() {},
    switchSize() {
      if (!this.isMax) {
        this.curWidth = this.screenWidth;
        this.curHeight = document.documentElement.clientHeight;
      } else {
        this.curWidth = this.width;
        this.curHeight = 0;
      }
      this.$nextTick(() => {
        this.isMax = !this.isMax;
        this.$emit("on-maximize", this.isMax);
      });
    },
    backOrigin() {
      const obj = this.$refs.content;
      const width = parseInt(this.curWidth);
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`
      };
      if (Number(this.top) <= 0) this.$refs.wrap.style.display = "flex";
      obj.style.top = this.actualTop + "px";

      if (this.isMax) {
        obj.style.left = "0px";
      } else {
        obj.style.left =
          this.left == undefined
            ? (this.screenWidth - width) / 2 + "px"
            : this.left + "px";
      }
    },
    mask() {
      if (this.maskClosable) {
        this.close();
      }
    },
    handleWrapClick(event) {
      // use indexOf,do not use === ,because h-modal-wrap can have other custom className
      const className = event.target.getAttribute("class");
      if (className && className.indexOf(`${prefixCls}-wrap`) > -1) this.mask();
    },
    cancel() {
      this.$emit("on-cancel");
      this.visible = false;
      this.$emit("input", false);
    },
    ok() {
      if (this.loading) {
        this.buttonLoading = true;
      } else {
        this.visible = false;
        this.$emit("input", false);
      }
      this.$emit("on-ok");
    },
    EscClose(e) {
      if (this.visible && this.escClose && this.realClose) {
        if (e.keyCode === 27) {
          // esc 关闭前判断 beforeEscClose 函数返回
          let flag = this.beforeEscClose && this.beforeEscClose();
          if (!flag) return;

          this.$emit("on-cancel");
          this.close();
        }
      }
    },
    tabClose(e) {
      if (e.keyCode == 9 && this.visible) {
        event.preventDefault();
      }
    },
    animationFinish() {
      this.$emit("on-hidden");
    },
    ScreenRes() {
      this.screenWidth = document.documentElement.clientWidth;
      this.WindosInnerHeight = window.innerHeight;
    }
  },
  mounted() {
    if (this.visible) {
      this.wrapShow = true;
      this.rendered = true;
      this.$nextTick(() => {
        this.$emit("on-open");
      });
    }
    let showHead = true;

    if (this.$slots.header === undefined && !this.title) {
      showHead = false;
    }

    this.showHead = showHead;

    // ESC close
    // document.addEventListener('keydown', this.EscClose);
    this.$on("on-esc-real-close", status => {
      this.realClose = status;
    });
    on(document, "keydown", this.EscClose);
    on(window, "resize", this.ScreenRes);
    if (this.disableTabEvent) {
      on(document.querySelector("#app"), "keydown", this.tabClose);
    }
  },
  beforeDestroy() {
    off(document, "keydown", this.EscClose);
    off(window, "resize", this.ScreenRes);
    this.removeScrollEffect();
    if (this.disableTabEvent) {
      off(document.querySelector("#app"), "keydown", this.tabClose);
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.$nextTick(() => {
          if (this.showHead) {
            this.footerHeight = this.$refs.msgFooter.offsetHeight;
          }
          if (!this.footerHide) {
            this.headerHeight = this.$refs.msgHeader.offsetHeight;
          }
        });
      }

      if (val && this.isOriginal) {
        // 开启了懒加载以后首次渲染时需要在nextTick中执行
        if (!this.rendered && this.lazyload) {
          this.$nextTick(() => {
            this.backOrigin();
          });
          return;
        }
        this.backOrigin();
      }
    },
    visible(val) {
      if (val === false) {
        this.buttonLoading = false;
        this.timer = setTimeout(() => {
          this.wrapShow = false;
          this.removeScrollEffect();
        }, 300);
      } else {
        this.rendered = true;
        this.$nextTick(() => {
          this.$emit("on-open");
        });
        if (this.timer) clearTimeout(this.timer);
        this.wrapShow = true;
        if (!this.scrollable) {
          this.addScrollEffect();
        }
      }
      this.broadcast("Table", "on-visible-change", val);
      this.broadcast("EditGird", "on-visible-change", val);
      this.broadcast(
        "SimpleSelect",
        "on-visible-change",
        val,
        this.mainStyles.top
      );
      this.broadcast("Select", "on-visible-change", val, this.mainStyles.top);
    },
    loading(val) {
      if (!val) {
        this.buttonLoading = false;
      }
    },
    scrollable(val) {
      if (!val) {
        this.addScrollEffect();
      } else {
        this.removeScrollEffect();
      }
    },
    title(val) {
      if (this.$slots.header === undefined) {
        this.showHead = !!val;
      }
    },
    width(val) {
      this.curWidth = val;
    }
  }
};
</script>
