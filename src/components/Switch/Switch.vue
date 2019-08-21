<template>
  <span :class="wrapClasses" :style="styles" @click="toggle" tabindex=0 ref="core" @focus="focus" @blur="blur">
    <span :class="slideClasses" :style="styleSlide"></span>
    <span :class="innerClasses">
      <slot name="open" v-if="currentValue"></slot>
      <slot name="close" v-if="!currentValue"></slot>
    </span>
  </span>
</template>
<script>
  import { oneOf } from '../../util/tools';
  import { on, off } from '../../util/dom';
  import Emitter from '../../mixins/emitter';

  const prefixCls = 'h-switch';

  export default {
    name: 'Switchs',
    mixins: [ Emitter ],
    props: {
      value: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
          type: [String, Number],
          default: 48
      },
      height: {
          type: [String, Number],
          default: 24
      },
      type: {
        validator (value) {
          return oneOf(value, ['info', 'success', 'warning', 'error']);
        }
      },
      size: {
        validator (value) {
          return oneOf(value, ['large', 'small', 'default']);
        }
      }
    },
    data () {
      return {
        currentValue: this.value,
        slideWidth: this.height-4,
        slideHeight: this.height-4,
        slideLeft: this.width-this.height+1,
        isSwitchFocus: false
      };
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-checked`]: this.currentValue,
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-${this.size}`]: !!this.size,
            [`${prefixCls}-${this.type}`]: !!this.type,
            [`${prefixCls}-focused`]: this.isSwitchFocus&&window.isO45
          }
        ];
      },
      innerClasses () {
        return `${prefixCls}-inner`;
      },
      slideClasses () {
        return `slide`;
      },
      styles () {
        return {
            width: `${this.width}px`,
            height: `${this.height}px`,
        };
      },
      styleSlide () {
        return {
            width: `${this.slideWidth}px`,
            height: `${this.slideHeight}px`,
            left: this.currentValue ? `${this.slideLeft}px` : `1px`
        }
      }
    },
    mounted() {
      on(this.$refs.core, 'keyup', this.handleKeyup);
    },
    beforeDestroy() {
      off(this.$refs.core, 'keyup', this.handleKeyup)
    },
    methods: {
      toggle () {
        if (this.disabled) {
            return false;
        }
        const checked = !this.currentValue;
        this.currentValue = checked;
        this.$emit('input', checked);
        this.$emit('on-change', checked);
        this.dispatch('FormItem', 'on-form-change', checked);
      },
      focus(event) {
        this.$refs.core.focus()
        this.$refs.core.isFocus = true
        this.isSwitchFocus = true
        this.$emit('on-focus', event)
      },
      blur(event) {
        this.$refs.core.isFocus = false
        this.isSwitchFocus = false
        this.$emit('on-blur', event)
      },
      handleKeyup(e) {
        if (this.disabled) {
          return false
        }
        if (!e.shiftKey) {
          const keyCode = e.keyCode
          // space
          if (keyCode === 32) {
            e.preventDefault()
            e.stopPropagation()
            const swi = this.$refs.core.isFocus
            if (swi) {
              this.toggle()
            }
          }
        }
      }
    },
    watch: {
      value (val) {
        this.currentValue = val;
      }
    }
  };
</script>
