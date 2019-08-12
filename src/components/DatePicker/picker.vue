<template>
  <div :class="[prefixCls]"
       v-clickoutside="handleClose"
       ref='wrapper'>
    <div ref="reference"
         :class="[prefixCls + '-rel']">
      <slot>
        <h-input ref="input"
                 :key="forceInputRerender"
                 :element-id="elementId"
                 :class="[prefixCls + '-editor']"
                 :readonly="readonly"
                 :editable="editable"
                 :disabled="disabled"
                 :size="size"
                 :placeholder="localePlaceholder"
                 :value="visualValue"
                 :name="name"
                 @click.native="clickHandler"
                 @on-keyup.prevent="keyUpHandler"
                 @on-input-change="handleInputChange"
                 @on-focus="handleFocus"
                 @on-blur="handleBlur"
                 @on-click="handleIconClick"
                 @mouseenter.native="handleInputMouseenter"
                 @mouseleave.native="handleInputMouseleave"
                 :icon="iconType"></h-input>
      </slot>
    </div>
    <transition :name="transition">
      <Drop @click.native="handleTransferClick"
            v-show="opened"
            :class="{ [prefixCls + '-transfer']: transfer }"
            :placement="fPlacement"
            ref="drop"
            :data-transfer="transfer"
            v-transfer-dom>
        <div @click="handleclick">
          <component :is="panel"
                     ref="pickerPanel"
                     :visible="visible"
                     :showTime="type === 'datetime' || type === 'datetimerange'"
                     :confirm="isConfirm"
                     :showLong="showLong"
                     :longValue="longValue"
                     :selectionMode="selectionMode"
                     :steps="steps"
                     :format="format"
                     :value="internalValue"
                     :start-date="startDate"
                     :split-panels="splitPanels"
                     :show-week-numbers="showWeekNumbers"
                     :picker-type="type"
                     :showTwoPanel="this.showTwoPanel"
                     :range-num="controlRange?selectRange:0"
                     :pickMode="pickMode"
                     :tabindex="tabindex"
                     v-bind="ownPickerProps"
                     @on-pick="onPick"
                     @on-pick-clear="handleClear"
                     @on-pick-success="onPickSuccess"
                     @on-pick-click="disableClickOutSide = true"
                     @on-selection-mode-change="onSelectionModeChange"
                     @on-select-range="handleSelectRange"
                     @on-pick-long="handleLongDate"></component>
          <slot name="footer"></slot>
        </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
import hInput from '../../components/Input/Input.vue'
import Drop from '../../components/Select/Dropdown.vue'
import clickoutside from '../../directives/clickoutside'
import TransferDom from '../../directives/transfer-dom'
import { oneOf, indexOf } from '../../util/tools'
import { on, off } from '../../util/dom'
import { DEFAULT_FORMATS, TYPE_VALUE_RESOLVER_MAP, formatDate } from './util'
import Emitter from '../../mixins/emitter'
import Locale from '../../mixins/locale'

const prefixCls = 'h-date-picker'
const isEmptyArray = val =>
  val.reduce(
    (isEmpty, str) =>
      (isEmpty && !str) || (typeof str === 'string' && str.trim() === ''),
    true
  )

export default {
  name: 'CalendarPicker',
  mixins: [Emitter, Locale],
  components: { hInput, Drop },
  directives: { clickoutside, TransferDom },
  props: {
    format: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    confirm: {
      type: Boolean,
      default: false
    },
    showLong: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showWeekNumbers: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: [Date, String]
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large'])
      }
    },
    placeholder: {
      type: String
    },
    placement: {
      validator(value) {
        return oneOf(value, [
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
      default: 'bottom-start'
    },
    options: {
      type: Object
    },
    transfer: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    elementId: {
      type: String
    },
    steps: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Date, String, Array]
    },
    longValue: {
      type: [Date, String, Array]
    },
    showFormat: {
      type: Boolean,
      default: false
    },
    controlRange: {
      type: Boolean,
      default: false
    },
    selectRange: {
      //可选择范围 多系统交易
      type: [String, Number],
      default: 1
    },
    showTwoPanel: {
      type: Boolean,
      default: false
    },
    autoPlacement: {
      type: Boolean,
      default: false
    },
    clearOnIllegal: {
      type: Boolean,
      default: false
    },
    iconVisible: {
      //是否只能通过点击图标打开弹框
      type: Boolean,
      default: false
    },
    pickMode: {
      type: String,
      validator(value) {
        return oneOf(value, [
          'click',
          'move'
        ])
      },
      default: 'click'
    },
    tabindex: {
      type: [String, Number],
      default: "0",
      validator(value) {
        let num = parseInt(value);
        return num <= 32767 && num >= -1;
      }
    }
  },
  data() {
    const isRange = this.type.indexOf('range') > -1 ? true : false
    const emptyArray = isRange ? [null, null] : [null]
    let initialValue = isEmptyArray((isRange ? this.value : [this.value]) || [])
      ? emptyArray
      : this.parseDate(this.value)
    if (this.name == 'splicePanel') initialValue = this.parseDate(this.value)
    return {
      prefixCls: prefixCls,
      showClose: false,
      visible: false,
      internalValue: initialValue,
      disableClickOutSide: false, // fixed when click a date,trigger clickoutside to close picker
      disableCloseUnderTransfer: false, // transfer 模式下，点击Drop也会触发关闭
      selectionMode: this.onSelectionModeChange(this.type),
      forceInputRerender: 1,
      isFocus: false,
      rangeNum: 0,
      fPlacement: this.placement,
      viewValue: null,
      // 记录 input 光标位置
      cursorPos: 19
    }
  },
  computed: {
    publicVModelValue() {
      if (this.multiple) {
        return this.internalValue.slice()
      } else {
        // const isRange = this.type.includes('range');
        const isRange = this.type.indexOf('range') > -1 ? true : false
        let val = this.internalValue.map(date =>
          date instanceof Date ? new Date(date) : date || ''
        )
        if (this.type.match(/^time/)) val = val.map(this.formatDate)
        return isRange || this.multiple ? val : val[0]
      }
    },
    publicStringValue() {
      const { formatDate, publicVModelValue, type } = this
      if (type.match(/^time/)) return publicVModelValue
      return Array.isArray(publicVModelValue)
        ? publicVModelValue.map(formatDate)
        : formatDate(publicVModelValue)
    },
//    opened() {
//      return this.open === null ? this.visible : this.open
//    },
    opened: {
      get:function() {
        return this.open === null ? this.visible : this.open
      },
      set:function(val) {
        this.visible = val
      }
    },
    iconType() {
      let icon = 'activity'
      if (this.type === 'time' || this.type === 'timerange') icon = 'time'
      if (this.showClose) icon = 'close'
      return icon
    },
    transition() {
      const bottomPlaced = this.fPlacement.match(/^bottom/)
      return bottomPlaced ? 'slide-up' : 'slide-down'
    },
    visualValue() {
      // console.log('internalValue', this.internalValue)
      this.viewValue = this.formatDate(this.internalValue)
      return this.formatDate(this.internalValue)
    },
    isConfirm() {
      return (
        this.confirm ||
        this.type === 'datetime' ||
        this.type === 'datetimerange' ||
        this.multiple ||
        this.showLong
      )
    }
  },
  methods: {
    clickHandler() {
      this.cursorPos = this.$refs.input.$el.querySelector('input').selectionStart
    },
    keyUpHandler(e) {
      // console.log('cursorPos', this.cursorPos)
      let $input = this.$refs.input.$el.querySelector('input')

      switch(e.keyCode) {
        case 38:
          e.preventDefault()
          $input.setSelectionRange(0, this.cursorPos)
          setTimeout(() => {
            $input.setSelectionRange(this.cursorPos, this.cursorPos)
            this.changeValue('up')
          }, 100)
          break
        case 40:
          e.preventDefault()
          $input.setSelectionRange(0, this.cursorPos)
          setTimeout(() => {
            $input.setSelectionRange(this.cursorPos, this.cursorPos)
            this.changeValue('down')
          }, 100)
          break
        case 37:
          e.preventDefault()
          switch(this.cursorPos) {
            case 13:
              this.cursorPos -= 5
              break
            default:
              this.cursorPos -= 3
          }

          this.cursorPos < 0 && (this.cursorPos = 0)
          $input.setSelectionRange(this.cursorPos, this.cursorPos)
          // this.cursorPos = $input.selectionStart
          break
        case 39:
          e.preventDefault()
          switch(this.cursorPos) {
            case 6:
              this.cursorPos += 5
              break
            default:
              this.cursorPos += 3
          }

          this.cursorPos > 19 && (this.cursorPos = 19)
          $input.setSelectionRange(this.cursorPos, this.cursorPos)
          // this.cursorPos = $input.selectionStart
          break
      }
    },
    /**
     * @description 根据上下方向改变 visibleValue
     * @param {String} drection up|down
     */
    changeValue(drection) {
      // 追加基准值
      let append = drection === 'up' ? 1000 : -1000
      // // 可变项
      // let sections = this.visualValue.match(/\d+/g)
      // 待改变项索引
      let sectionIndex = -1
      if (this.cursorPos < 9) {
        sectionIndex = Math.ceil((this.cursorPos + 1) / 3) - 1 // 0 - 2
      } else if(this.cursorPos > 10) {
        sectionIndex = Math.ceil((this.cursorPos - 10) / 3) + 3 - 1 // 3 - 5
      }

      if (sectionIndex === -1) return

      // // 待改变项值
      // let targetValue = sections[sectionIndex]
      // // +1 | -1
      // targetValue = Number(targetValue) + append
      // if (targetValue === 60) {
      //   targetValue = 0
      // } else if (targetValue === 0) {
      //   targetValue = 60
      // }
      // // 补零
      // targetValue = '00' + targetValue
      // targetValue = targetValue.substr(targetValue.length - 2, targetValue)
      // // 反填
      // sections[sectionIndex] = targetValue
      // let tmpPre = sections.slice(0, 2)
      // let tmpAfter = sections.slice(3, 5)
      // this.visualValue = tmpPre.join(':') + ' - ' + tmpAfter.join(':')

      // console.log('sectionIndex', sectionIndex)
      if (sectionIndex < 3) {
        let tmp;
        if (this.internalValue[0] !== null) {
          tmp = new Date(this.internalValue[0]).getTime() + append * Math.pow(60, 2 - sectionIndex);
        } else {
          tmp = new Date(1970, 1, 1, 0, 0, 0);
        }
        this.$set(this.internalValue, 0, new Date(tmp))
      } else {
        let tmp;
        if (this.internalValue[1] !== null) {
          tmp = new Date(this.internalValue[1]).getTime() + append * Math.pow(60, 5 - sectionIndex)
        } else {
          tmp = new Date(1970, 1, 1, 0, 0, 0);
        }
        this.$set(this.internalValue, 1, new Date(tmp))
      }

      this.$nextTick(() => {
        this.$refs.input.$el.querySelector('input').setSelectionRange(this.cursorPos, this.cursorPos)
      })
    },
    onSelectionModeChange(type) {
      if (type.match(/^date/)) type = 'date'
      if (type.match(/^month/)) type = 'month'
      this.selectionMode =
        oneOf(type, ['year', 'month', 'date', 'time']) && type
      return this.selectionMode
    },
    // 开启 transfer 时，点击 Drop 即会关闭，这里不让其关闭
    handleTransferClick() {
      if (this.transfer) this.disableCloseUnderTransfer = true
    },
    handleClose() {
      if (this.disableCloseUnderTransfer) {
        this.disableCloseUnderTransfer = false
        return false
      }
      if (this.open !== null) return
      //if (!this.disableClickOutSide) this.visible = false;
      this.visible = false
      this.disableClickOutSide = false
      if (this.isFocus) {
        this.dispatch('FormItem', 'on-form-blur', this.currentValue)
        this.isFocus = false
        this.$emit('on-blur')
      }
    },
    handleFocus() {
      this.isFocus = true
      if (this.iconVisible) return
      this.handleVisible()
    },
    handleVisible() {
      if (this.readonly || this.disabled) return
      this.visible = true
      this.$refs.pickerPanel.onToggleVisibility(true)
    },
    focus() {
      if (this.disabled) return false
//       this.$nextTick(()=>{
      // 为了支持o45模式下form的firstNodeFocused()窗体不弹出
      if(this.value !== '' && window.isO45) return false
      setTimeout(() => {
        if (!this.iconVisible) {
          this.visible = true
          this.$refs.pickerPanel.onToggleVisibility(true)
        }
        this.isFocus = true
        if (this.$refs.input) this.$refs.input.focus()
      }, 0)
//        this.visible =status =='notShow'?false:true;
//      })
    },
    blur() {
      if (this.isFocus) {
        this.dispatch('FormItem', 'on-form-blur', this.currentValue)
      }
      this.visible = false
      this.$refs.pickerPanel.onToggleVisibility(false)
      this.isFocus = false
      if (this.$refs.input) this.$refs.input.blur()
    },
    select() {
      this.$refs.input.select()
    },
    handleBlur() {
      this.visible = false
      this.onSelectionModeChange(this.type)
      this.internalValue = this.internalValue.slice() // trigger panel watchers to reset views
      this.reset()
      this.$refs.pickerPanel.onToggleVisibility(false)
    },
    reset() {
      this.$refs.pickerPanel.reset && this.$refs.pickerPanel.reset()
    },
    /**
     * 检查输入值合法性
     *
     * @param text 输入值
     * @param date 输入值转换后的Date对象(Array)
     */
    checkLegality(text, date) {
      if (
        this.clearOnIllegal &&
        ['date', 'daterange', 'datetime', 'datetimerange'].indexOf(this.type) >
          -1
      ) {
        const dateFormat = ['yyyyMMdd', 'yyyy-MM-dd', 'yyyy/MM/dd']
        const timeFormat = 'HH:mm:ss'
        const isRange = this.type.indexOf('range') > -1

        if (date[0] instanceof Date && (!isRange || date[1] instanceof Date)) {
          for (let dFormat of dateFormat) {
            let format =
              this.type.indexOf('time') > -1
                ? dFormat + ' ' + timeFormat
                : dFormat
            if (
              (isRange
                ? formatDate(date[0].toString(), format) +
                  ' - ' +
                  formatDate(date[1].toString(), format)
                : formatDate(date[0].toString(), format)) === text
            ) {
              if (isRange) {
                return date[0] <= date[1]
              }
              return true
            }
          }
        }
        return false
      }
      return true
    },
    handleInputChange(event) {
      // if (value==''||String(value).length==0) {
      //   this.handleClear();
      //   return false;
      // }
      // const isArrayValue = this.type.includes('range') || this.multiple;
      const isArrayValue =
        this.type.indexOf('range') > -1 ? true : false || this.multiple
      const oldValue = this.visualValue
      const newValue = event.target.value
      const newDate = this.parseDate(newValue)
      const disabledDateFn =
        this.options &&
        typeof this.options.disabledDate === 'function' &&
        this.options.disabledDate
      const valueToTest = isArrayValue ? newDate : newDate[0]
      const isDisabled = disabledDateFn && disabledDateFn(valueToTest)
      const isValidDate = this.checkLegality(newValue, newDate)
      if (newValue !== oldValue && !isDisabled && isValidDate) {
        this.internalValue = newDate
        this.emitChange()
      } else {
        if (this.clearOnIllegal && (!isValidDate || isDisabled)) {
          this.handleClear()
          this.$emit('on-illegal-input', newValue)
        }
        this.forceInputRerender++
      }
    },
    handleInputMouseenter() {
      if (this.readonly || this.disabled) return
      if (this.visualValue && this.clearable) {
        this.showClose = true
      }
    },
    handleInputMouseleave() {
      this.showClose = false
    },
    handleIconClick() {
      if (this.showClose) {
        this.handleClear()
      } else if (!this.disabled) {
        this.isFocus = true
        this.handleVisible()
      }
    },
    handleClear() {
      this.visible = false
      this.internalValue = this.internalValue.map(() => null)
      this.$emit('on-clear')
      this.dispatch('FormItem', 'on-form-change', '')
      this.emitChange()
      this.reset()
      setTimeout(
        () => this.onSelectionModeChange(this.type),
        500 // delay to improve dropdown close visual effect
      )
    },
    emitChange() {
      this.$nextTick(() => {
        // on-change事件触发移至watcher:publicVModelValue，用于v-model绑定值修改后触发on-change
        // this.$emit('on-change', this.publicStringValue);
        this.dispatch('FormItem', 'on-form-change', this.publicStringValue)
      })
    },
    parseDate(val) {
      // const isRange = this.type.includes('range');
      const isRange = this.type.indexOf('range') > -1 ? true : false
      const type = this.type
      const parser = (
        TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']
      ).parser
      const format = this.format || DEFAULT_FORMATS[type]
      const multipleParser = TYPE_VALUE_RESOLVER_MAP['multiple'].parser

      if (val && type === 'time' && !(val instanceof Date)) {
        val = parser(val, format)
      } else if (this.multiple && val) {
        val = multipleParser(val, format)
      } else if (isRange) {
        if (!val) {
          val = [null, null]
        } else {
          if (typeof val === 'string') {
            val = parser(val, format)
          } else if (type === 'timerange') {
            val = parser(val, format)
          } else if (
            Array.isArray(val) &&
            format.toLowerCase() === 'yyyymmdd'
          ) {
            /* FIX: TS:201902280227: yyyyMMdd类型的范围类型的日期处理出错 */
            val = parser(val, format)
          } else {
            val = val.map(date => new Date(date)) // try to parse
            val = val.map(date => (isNaN(date.getTime()) ? null : date)) // check if parse passed
          }
        }
      } else if (typeof val === 'string' && type.indexOf('time') !== 0) {
        val = parser(val, format) || null
      }

      return isRange || this.multiple ? val || [] : [val]
    },
    formatDate(value) {
      const format = DEFAULT_FORMATS[this.type]

      if (this.multiple) {
        const formatter = TYPE_VALUE_RESOLVER_MAP.multiple.formatter
        return formatter(value, this.format || format)
      } else {
        const { formatter } =
          TYPE_VALUE_RESOLVER_MAP[this.type] ||
          TYPE_VALUE_RESOLVER_MAP['default']
        return formatter(value, this.format || format)
      }
    },
    onPick(dates, visible = false) {
      if (this.multiple) {
        const pickedTimeStamp = dates.getTime()
        const indexOfPickedDate = this.internalValue.findIndex(
          date => date && date.getTime() === pickedTimeStamp
        )
        const allDates = [...this.internalValue, dates].filter(Boolean)
        const timeStamps = allDates
          .map(date => date.getTime())
          .filter(
            (ts, i, arr) => arr.indexOf(ts) === i && i !== indexOfPickedDate
          ) // filter away duplicates
        this.internalValue = timeStamps.map(ts => new Date(ts))
      } else {
        this.internalValue = Array.isArray(dates) ? dates : [dates]
      }

      // 选中值初始化光标位置
      if (this.internalValue.length === 2) {
        this.cursorPos = 19
      } else {
        this.cursorPos = 8
      }

      if (!this.isConfirm) this.onSelectionModeChange(this.type) // reset the selectionMode
      if (!this.isConfirm) this.visible = visible
      this.emitChange()
    },
    onPickSuccess() {
      this.visible = false
      this.$emit('on-ok')
      this.reset()
    },
    handleSelectRange(val, status) {
      this.$emit('on-select-range', val, status)
    },
    handleclick(e) {
      e.stopPropagation()
    },
    setPlacement() {
      // 自动适配逻辑调整
      if (this.autoPlacement) {
        let clientHeight = document.documentElement.clientHeight
        let clienWidth = document.documentElement.clientWidth
        let rect = this.$refs.wrapper.getBoundingClientRect()
        let curbottom = clientHeight - rect.top - rect.height
        let bottomNum = this.confirm ? 300 : 250

        let rightNum = this.type.indexOf('range') > -1 ? 436 : 220
        let isShortcuts =
          this.options &&
          this.options.shortcuts &&
          this.options.shortcuts.length > 0
        rightNum = isShortcuts ? rightNum + 95 : rightNum

        if (curbottom < bottomNum && rect.right < rightNum && rect.top > bottomNum ) {
          this.fPlacement = 'top-end'
        } else if (curbottom < bottomNum && rect.top > bottomNum) {
          this.fPlacement = 'top-start'
        } else if (clienWidth - rect.left < rightNum) {
          this.fPlacement = 'bottom-end'
        } else {
          this.fPlacement = 'bottom-start'
        }
      }
    },
    handleKeydown(e) {
      if (this.visible) {
        const keyCode = e.keyCode
        // Esc slide-up
        if (keyCode === 27) {
          e.preventDefault()
          this.visible = false
        }
      }
    },
    handleLongDate() {
      let isdateRange = this.type.indexOf('range') > -1 ? true : false
      let emptyAry = isdateRange ? [null, null] : [null]
      let date = isdateRange
        ? this.parseDate([this.longValue, this.longValue])
        : this.parseDate(this.longValue)
      let longtime = isEmptyArray([this.longValue] || []) ? emptyAry : date
      if (!longtime[0]) return
      if (isdateRange) {
        let start = this.internalValue[0] ? this.internalValue[0].getTime() : 0
        let long = longtime[0].getTime()
        if (start === 0 || long - start < 0) return
        this.$set(this.internalValue, 1, longtime[0])
      } else {
        this.internalValue = longtime
      }
      this.emitChange()
    }
  },
  watch: {
    visible(state) {
      if (state === false) {
        //   this.$refs.drop.destroy();
        const input = this.$el.querySelector('input')
        if (input) input.blur()
        setTimeout(() => {
          this.dispatch('Msgbox', 'on-esc-real-close', true)
        }, 0)
      } else {
        // 显示前才计算位置
        this.setPlacement()

        setTimeout(() => {
          this.dispatch('Msgbox', 'on-esc-real-close', false)
        }, 0)
      }
      this.$refs.drop.update()
      this.$emit('on-open-change', state)
    },
    value: {
      handler(val) {
        this.internalValue = this.parseDate(val)
      }
    },
    open(val) {
      this.visible = val === true
    },
    type(type) {
      this.onSelectionModeChange(type)
    },
    publicVModelValue(now, before) {
      const newValue = JSON.stringify(now)
      const oldValue = JSON.stringify(before)
      const shouldEmitInput =
        newValue !== oldValue || typeof now !== typeof before
      const strValue = this.showFormat == true ? this.visualValue : now
      if (shouldEmitInput) {
        this.$emit('input', strValue) // to update v-model
        this.$emit('on-change', this.publicStringValue)
        // this.$emit('input', now); // to update v-model
      }
    },
    placement(val) {
      this.fPlacement = val
    }
  },
  beforeDestroy() {
    if (this.picker) {
      this.picker.$destroy()
    }
    this.$refs.drop.destroy()
    off(document, 'keydown', this.handleKeydown)
  },
  mounted() {
    const initialValue = this.value
    const parsedValue = this.publicVModelValue
    if (
      typeof initialValue !== typeof parsedValue ||
      JSON.stringify(initialValue) !== JSON.stringify(parsedValue)
    ) {
      if (this.showFormat) {
        this.$emit('input', this.visualValue) // to update v-model
      } else {
        this.$emit('input', this.publicVModelValue) // to update v-model
      }
    }
    if (this.open !== null) this.visible = this.open
    on(document, 'keydown', this.handleKeydown)
  }
}
</script>
