<template>
  <form :class="classes">
    <slot></slot>
  </form>
</template>
<script>
import { oneOf, hasClass, cmp } from '../../util/tools'

const prefixCls = 'h-form'

export default {
  name: 'Form',
  props: {
    model: {
      type: Object
    },
    compareModel: {
      type: Object
    },
    rules: {
      type: Object
    },
    labelWidth: {
      type: Number
    },
    labelPosition: {
      validator(value) {
        return oneOf(value, ['left', 'right', 'top'])
      },
      default: 'right'
    },
    inline: {
      type: Boolean,
      default: false
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    cols: {
      type: [String, Number]
    },
    placement: {
      validator(value) {
        return oneOf(value, [
          'null',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'left',
          'left-start',
          'left-end',
          'right',
          'right-start',
          'right-end'
        ])
      },
      default: 'null'
    },
    errorFocus: {
      type: Boolean,
      default: false
    },
    labelWrap: {
      type: Boolean,
      default: null
    },
    onlyBlurRequire: {
      type: Boolean,
      default: false
    },
    closeRuleChangeValidate: {//关闭rule改变时的校验
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fields: [],
      validMsgList: [],
      changeObj: {},
      isCheck: true
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-label-${this.labelPosition}`,
        {
          [`${prefixCls}-inline`]: this.inline,
          [`${prefixCls}-row`]: this.cols && parseInt(this.cols) <= 12
        }
      ]
    }
  },
  methods: {
    resetFields(isResetReadonlyOrDisabled = false) {
      this.fields.forEach(field => {
        field.resetField(isResetReadonlyOrDisabled)
      })
      this.validMsgList = []
      this.isCheck = false
      setTimeout(() => {
        this.isCheck = true
      }, 0)
    },
    validate(callback) {
      this.validMsgList = []
      let valid = true
      let count = 0
      this.fields.forEach(field => {
        if (field.$children && field.$children.length > 0) {
          for (let fidleChild of field.$children) {
            if (fidleChild.disabled) {
              // ++count;
              if (++count === this.fields.length) {
                callback(valid)
              }
              return
            }
          }
        }
        field.commonRule()
        field.validate('', errors => {
          if (errors) {
            valid = false
          }
          if (
            typeof callback === 'function' &&
            ++count === this.fields.length
          ) {
            callback(valid)
          }
        })
      })
      // if (typeof callback === 'function') {
      //   callback(valid);
      // }
      if (this.errorFocus) {
        this.$nextTick(() => {
          for (var i = 0; i < this.fields.length; i++) {
            if (hasClass(this.fields[i].$el, 'h-form-item-error')) {
              this.fields[i].$children[0].focus()
              break
            }
          }
        })
      }
    },
    validateField(prop, cb) {
      this.validMsgList = []
      const field = this.fields.filter(field => field.prop === prop)[0]
      if (!field) {
        throw new Error(
          '[HUI warn]: must call validateField with valid prop string!'
        )
      }
      field.validate('', cb)
    },
    /**
     * @description 重置单个字段校验
     */
    resetValidateField(prop, cb = null) {
      const field = this.fields.filter(field => field.prop === prop)[0]
      if (!field) {
        throw new Error(
          '[HUI warn]: must call resetValidate with valid prop string!'
        )
      }
      field.resetValidate(cb)
    },
    /**
     * @description 重置所有字段校验
     */
    resetValidate(cb = null) {
      this.fields.forEach(field => {
        field.resetValidate(cb)
      })
    },
    setPlacement() {
      this.$nextTick(() => {
        this.fields.forEach(field => {
          if (field.$children && field.$children.length > 0) {
            for (let fidleChild of field.$children) {
              if (fidleChild.placement) {
                fidleChild.fPlacement = this.placement
              }
            }
          }
        })
      })
    },
    changeStyle(obj) {
      if (!this.compareModel || this.compareModel == {}) return
      for (let item in obj) {
        let status = true
        // if (obj[item] == this.compareModel[item] || this.compareModel[item] == undefined) {
        //   status = false;
        // }
        if (
          cmp(obj[item], this.compareModel[item]) ||
          this.compareModel[item] == undefined
        ) {
          status = false
        }
        this.changeObj[item] = status
      }
      this.fields.forEach(col => {
        col.modeChanged = this.changeObj[col.prop]
      })
    },
    firstNodeFocused() {
      this.$nextTick(() => {
        // let index = 0
        for (var i = 0; i < this.fields.length; i++) {
          if (
            !this.fields[i].$children[0].disabled &&
            !this.fields[i].$children[0].readonly
          ) {
            // index = i
            break
          }
        }
        if(this.fields[i].$children[0].focus) {
          this.fields[i].$children[0].focus()
        }
        if(window.isO45) {
          //【TS:201907290055-资管业委会（资管）_孔磊-【需求类型】需求【需求描述】在form中调用 firstNodeFocused 时选中第一个输入框，同时全选输入框中内容】
          if(this.fields[i].$children[0].value && this.fields[i].$children[0].select) {
            this.fields[i].$children[0].select()
          }
        }
        if (this.fields[i].$children[0].opened)
          this.fields[i].$children[0].opened = false
        this.$nextTick(() => {
          if (this.fields[i].$children[0].visible)
            this.fields[i].$children[0].visible = false
        })
      })
    }
  },
  watch: {
    rules: {
      deep: true,
      handler() {
        if(this.closeRuleChangeValidate){
          this.fields.forEach((field)=>{
            field.commonRule('ruleChange');
          });
        }else{
          this.validate();
        }
      }
    },
    placement() {
      if (this.placement == 'null') return
      this.setPlacement()
    },
    model: {
      deep: true,
      handler(val) {
        this.changeStyle(val)
      }
    }
  },
  created() {
    this.$on('on-form-item-add', field => {
      if (field) this.fields.push(field)
      return false
    })
    this.$on('on-form-item-remove', field => {
      if (field.prop) this.fields.splice(this.fields.indexOf(field), 1)
      return false
    })
  },
  mounted() {
    if (this.placement != 'null') {
      this.setPlacement()
    }
  }
}
</script>
