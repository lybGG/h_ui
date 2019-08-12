<template>
  <div :class="classes">
    <label :class="[prefixCls + '-label']"
           :style="labelStyles"
           v-if="label || $slots.label"
           :title="labelTitle">
      <slot name="label">{{ label }}</slot>
    </label>
    <div :class="[prefixCls + '-requiredIcon']"
         v-else
         v-show="isRequired"><span>*</span></div>
    <div :class="[prefixCls + '-content']"
         :style="contentStyles">
      <slot></slot>
      <transition name="fade">
        <div class="verify-tip verify-bottom"
             v-if="isShowError&&showModal"
             :style="{left: `${msgOffset}px`}">
          <div class="verify-tip-arrow"></div>
          <div class="verify-tip-inner" :style="verifyTipStyle" :title="validateMessage">
            <h-icon v-if="showCloseIcon" :name="closeName" @on-click="closeTip" :size="12"></h-icon>
            {{validateMessage}}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator'
import Emitter from '../../mixins/emitter'
import {
  is,
  // findComponentChildren,
  findComponentParent,
  deepCopy,
  typeOf
} from '../../util/tools'
import Validate from './validate'
const prefixCls = 'h-form-item'
const parentPrefixCls = 'h-form'

function getPropByPath(obj, path) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  let keyArr = path.split('.')
  let i = 0

  for (let len = keyArr.length; i < len - 1; ++i) {
    let key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      throw new Error(
        '[HUI warn]: please transfer a valid prop path to form item!'
      )
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj[keyArr[i]]
  }
}

export default {
  name: 'FormItem',
  mixins: [Emitter, Validate],
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: Number
    },
    prop: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Object, Array]
    },
    error: {
      type: String
    },
    validateStatus: {
      type: Boolean
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    // 自定义rules,并将自定义对接至asyc-valid库
    validRules: {
      type: Array
    },
    cols: {
      type: [String, Number]
    },
    labelWrap: {
      type: Boolean,
      default: null
    },
    requiredTrigger: {
      type: String
    },
    onlyBlurRequire: {
      type: Boolean,
      default: false
    },
    labelTitle: String,
    /* 校验信息向右偏移距离 */
    msgOffset: {
      type: [Number, String],
      default: 0
    },
    // 父子 require 是否不联动
    strictly: {
      type: Boolean,
      default: false
    },
    // 设置 margin-left 使用 !important
    marginLeftForce: {
      type: Boolean,
      default: false
    },
    closeName: {
      type: String,
      default: 'close'
    },
    showCloseIcon:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      isRequired: false,
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      transCustRules: [],
      reqRules: [],
      curCols: this.cols,
      mustShowError: false,
      mustShowErrorList: [],
      modeChanged: false,
      showModal:true,
    }
  },
  watch: {
    error(val) {
      this.validateMessage = val
      this.validateState = 'error'
    },
    validateStatus(val) {
      this.validateState = val
    },
    cols(val) {
      this.curCols = val
    },
    required(val) {
      if (val) {
        this.isRequired = true
        const reqRule = { required: true, message: '输入不能为空' }
        // const reqRule = {required: true, message: '输入不能为空', trigger: this.requiredTrigger}
        this.reqRules.push(reqRule)
      } else {
        this.isRequired = false
        this.validateState = ''
        this.reqRules = []
      }
      this.commonRule()
    },
    rules() {
      this.commonRule()
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-required`]: this.required || this.isRequired,
          [`${prefixCls}-error`]: this.validateState === 'error',
          [`${prefixCls}-changed`]: this.modeChanged,
          [`${prefixCls}-validating`]: this.validateState === 'validating',
          [`${prefixCls}-reqNoLabel`]:
            !(this.label || this.$slots.label) && this.isRequired,
          [`${parentPrefixCls}-col-` + this.form.cols]:
            parseInt(this.form.cols) <= 12,
          [`${prefixCls}-col-` + this.curCols]:
            this.curCols &&
            parseInt(this.curCols) <= 12 &&
            parseInt(this.curCols) <= parseInt(this.form.cols) &&
            parseInt(this.form.cols) <= 12
              ? true
              : false,
          [`${prefixCls}-labelWrap`]:
            this.labelWrap != null
              ? this.labelWrap
              : this.labelWrap == null && this.form.labelWrap != null
              ? this.form.labelWrap
              : false
        }
      ]
    },
    form() {
      let parent = this.$parent
      while (parent.$options.name !== 'Form') {
        parent = parent.$parent
      }
      return parent
    },
    fieldValue: {
      cache: false,
      get() {
        const model = this.form.model
        if (!model || !this.prop) {
          return
        }

        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        return getPropByPath(model, path).v
      }
    },
    labelStyles() {
      let style = {}
      const labelWidth = this.labelWidth || this.form.labelWidth
      if (labelWidth) {
        style.width = `${labelWidth}px`
      }
      return style
    },
    contentStyles() {
      let style = {}
      const labelWidth = this.labelWidth || this.form.labelWidth
      if (labelWidth) {
        let temp = `${labelWidth}px`
        if (this.marginLeftForce) temp += '!important'
        style.marginLeft = temp
      }

      return style
    },
    isShowError() {
      return this.mustShowError
        ? this.mustShowError
        : this.validateState === 'error' &&
            this.showMessage &&
            this.form.showMessage
    },
    isOnlyBlurRequire() {
      return this.onlyBlurRequire
        ? true
        : false || this.form.onlyBlurRequire
        ? true
        : false
    },
    isNotChecked() {
      return this.form.isCheck ? false : true
    },
    verifyTipStyle(){
       let style={}
       style.maxWidth=(this.$children[0].$el.clientWidth-15)+"px"
       return  style
    }
  },
  methods: {
    // rules为String类型时，自定义rules
    customRules() {
      for (let rule of this.validRules) {
        this.custRuleValid(rule)
      }
    },
    custRuleValid(rule) {
      // 默认支持验证的，有intege等,同时是blur触发
      /**
       *自定义验证规则
       *{
       *	 test:FuncOrRegExp,
       *	 message:'',// 若有mustShowFlag时,必填
       *    trigger:'', //可选值:blur/change,不配置时默认blur及change时均触发
       *    mustShowFlag: false // 是否必须显示提示，此时showMessage无效 --by 估值:某些校验必须提示，解决：现在遍历rule时保存必须显示校验提示的message，然后在校验完后（返回的error只有message）进行检索比对
       *}
       */
      let isString = is('String', rule)
      let isObj = is('Object', rule)
      if (isString) {
        this.stringRuleValid(rule)
      } else if (isObj && rule.test) {
        //test:为正则表达式
        let isRegExp =
          rule.test.constructor && rule.test.constructor.name === 'RegExp'
        // test:为定义函数
        let isFunc = is('Function', rule.test)
        // 保存必须显示校验提示的message
        if (rule.mustShowFlag) {
          this.mustShowErrorList.push(rule.message)
        }

        if (isRegExp) {
          this.regularValid(rule.test, rule.message, rule.trigger)
        } else if (isFunc) {
          const funcRule = { validator: rule.test, trigger: rule.trigger }
          this.transCustRules.push(funcRule)
        }
      }
    },
    regularValid(pattern, message, trigger) {
      const rule = { pattern: pattern, message: message, trigger: trigger }
      this.transCustRules.push(rule)
    },
    getRules() {
      let formRules = this.form.rules
      const selfRules = this.rules
      // --自定义封装规则
      let cuRules
      if (this.validRules && this.validRules.length > 0) {
        cuRules = this.transCustRules
      }
      // --自定义封装规则
      formRules = formRules ? formRules[this.prop] : []

      return []
        .concat(this.reqRules)
        .concat(cuRules || selfRules || formRules || [])
    },
    getFilteredRule(trigger) {
      const rules = this.getRules()

      return rules.filter(
        rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1
      )
    },
    validate(trigger, callback = function() {}) {
      this.showModal = true
      if (this.isNotChecked) return
      const rules = this.getFilteredRule(trigger)

      if (!rules || rules.length === 0) {
        callback()
        return true
      }
      this.validateState = 'validating'

      let descriptor = {}
      descriptor[this.prop] = rules
      const validator = new AsyncValidator(descriptor)
      let model = {}

      // 允许由事件传值
      model[this.prop] = this.fieldValue
      if (typeOf(this.fieldValue) == 'array' && this.fieldValue.length == 2) {
        if (this.fieldValue[0] == '' && this.fieldValue[1] == '')
          model[this.prop] = []
      }
      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''
        // error是否为必须显示的校验
        if (this.mustShowErrorList && this.mustShowErrorList.length) {
          if (this.mustShowErrorList.indexOf(this.validateMessage) >= 0) {
            this.mustShowError = true
          } else {
            this.mustShowError = false
          }
        }
        // 外部可通过this.$ref.form.validMsgList获取验证信息
        this.form.validMsgList.push(errors)
        callback(this.validateMessage)
      })
      this.validateDisabled = false
    },
    resetField(isResetReadonlyOrDisabled = false) {
      this.validateState = ''
      this.validateMessage = ''
      let model = this.form.model
      let value = this.fieldValue
      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }
      if (
        isResetReadonlyOrDisabled &&
        this.$children &&
        this.$children.length > 0
      ) {
        if (this.$children[0].readonly || this.$children[0].disabled) return
      }
      let prop = getPropByPath(model, path)
      if(this.$el.querySelector('input')){
        let input=this.$el.querySelector('input')
         if(input.getAttribute('search')==='multiSelect'){
              this.$children[0].isResetField=true
         }
      }
      if (Array.isArray(value)) {
        this.validateDisabled = true
        prop.o[prop.k] = [].concat(this.initialValue)
      } else {
        this.validateDisabled = true
        prop.o[prop.k] = this.initialValue
      }
    },
    /**
     * @description 重置校验结果
     */
    resetValidate(cb) {
      this.validateState = ''
      this.validateMessage = ''

      if (cb) cb()
    },
    onFieldBlur(val) {
      this.validate('blur', () => {})
    },
    onFieldChange(val) {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return
      }
      if (this.isOnlyBlurRequire) return
      this.validate('change', () => {})
    },
    commonRule(str) {
      let rules = this.getRules()
      if (rules.length) {
        rules.every(rule => {
          if (rule.required) {
            this.isRequired = true
            return false
          } else {
            this.isRequired = false
          }
        })
        if (str === 'ruleChange' && !this.isRequired) {
          this.validateState = ''
          let parentFormItem = findComponentParent(this, 'FormItem')
          if (parentFormItem && !parentFormItem.strictly) {
            parentFormItem.isRequired = this.isRequired
          }
        }
        this.$off('on-form-blur').$on('on-form-blur', this.onFieldBlur)
        this.$off('on-form-change').$on('on-form-change', this.onFieldChange)
      }
    },
    closeTip(){
      this.showModal = false
    }
  },
  mounted() {
    // 当form设置cols时，忽略textarea，slider中设置的cols,该组件独占一行,默认formItem子组件仅有一个textarea/slider/upload
    if (this.form.cols) {
      this.$nextTick(() => {
        if (
          (this.$children[0] &&
            this.$children[0].$options.name == 'Input' &&
            this.$children[0].type == 'textarea') ||
          (this.$children[0] && this.$children[0].$options.name == 'Slider') ||
          (this.$children[0] && this.$children[0].$options.name == 'Upload')
        ) {
          this.curCols = this.form.cols
        }
      })
    }
    // this.onlyBlurRequire = this.onlyBlurRequire?true:false||this.form.onlyBlurRequire?true:false;
    if (this.prop) {
      this.dispatch('Form', 'on-form-item-add', this)

      Object.defineProperty(this, 'initialValue', {
        value: deepCopy(this.fieldValue)
      })
      if (this.validRules && this.validRules.length > 0) {
        this.customRules()
      }
      if (this.required) {
        this.isRequired = true
        const reqRule = { required: true, message: '输入不能为空' }
        // const reqRule = {required: true, message: '输入不能为空', trigger: this.requiredTrigger}
        this.reqRules.push(reqRule)
      }
      let rules = this.getRules()

      if (rules.length) {
        rules.every(rule => {
          if (rule.required) {
            this.isRequired = true
            return false
          }
        })
          this.$off('on-form-blur').$on('on-form-blur', this.onFieldBlur)
          this.$off('on-form-change').$on('on-form-change', this.onFieldChange)
      }
      // 组合formItem时，将自身requiredIcon隐藏，同时，将父元素的formItem的图标显示
      let parentFormItem = findComponentParent(this, 'FormItem')
      if (parentFormItem && this.isRequired && !parentFormItem.strictly) {
        parentFormItem.isRequired = true
        this.isRequired = false
      }
    }
  },
  beforeDestroy() {
    this.dispatch('Form', 'on-form-item-remove', this)
  },
  created() {}
}
</script>
