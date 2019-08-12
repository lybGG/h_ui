<template>
  <div :class="classes"
       v-clickoutside="{trigger: 'mousedown', handler: handleClose}"
       :style="multiplestyle"
       ref="select">
    <div :class="selectionCls"
         ref="reference"
         :tabindex="selectTabindex"
         @keyup="keyup"
         @keydown="keydown"
         @click="showdrop">
      <span v-if="showTotal" :class="[prefixCls + '-selected-num']">共选择 {{selectedMultiple.length}} 项</span>
      <!-- 多选时输入框内选中值模拟 -->
      <div class="h-tag"
           v-if="!newSearchModel"
           v-for="(item, index) in selectedMultiple"
           v-show="item.label&&!showTotal"
           :key="index">
        <span class="h-tag-text" v-if="!showValue">{{ item.label }}</span>
        <span class="h-tag-text" v-if="showValue">{{ item.value }}</span>
        <Icon name="close"
              @click.native.stop="removeTag(index)"></Icon>
      </div>
      <!-- 下拉输入框模拟（非远程搜索时渲染）  -->
      <span :class="[prefixCls + '-placeholder']"
            v-show="showPlaceholder && (!filterable&&!newSearchModel||showBottom)">{{ localePlaceholder }}</span>
      <span :class="[prefixCls + '-selected-value']"
            v-show="!showPlaceholder && !multiple && !(filterable && !showBottom)">{{ selectedSingle }}</span>
      <!--搜索框开启newSearchModel时渲染-->
          <input type="text"
             v-if="newSearchModel&&multiple"
             v-model="selectedResult"
             :disabled="disabled"
             :readonly="!editable||readonly"
             :class="[prefixCls + '-input']"
             style="width:100%"
             search="multiSelect"
             :placeholder="showPlaceholder?localePlaceholder:''"
             @focus="handleFocus"
             @blur="handkeSearchBlur"
             @keydown="resetInputState"
             :tabindex="tabindex"
             ref="input">
      <!-- 下拉输入框(远程搜索时渲染) -->
      <input type="text"
             v-if="filterable && !showBottom &&!newSearchModel"
             v-model="query"
             :disabled="disabled"
             :readonly="!editable||readonly"
             :class="[prefixCls + '-input']"
             :placeholder="showPlaceholder?localePlaceholder:''"
             @focus="handleFocus"
             @blur="handleBlur"
             @keydown="resetInputState"
             @keydown.delete="handleInputDelete"
             :tabindex="tabindex"
             ref="input">
      <Icon name="close"
            :class="[prefixCls + '-arrow']"
            v-if="showCloseIcon"
            @click.native.stop="clearSingleSelect"></Icon>
      <Icon name="unfold"
            :class="[prefixCls + '-arrow']"
            v-if="!searchIcon && (!remote || showArrow ||newSearchModel)"
            @click.native.stop="arrowClick"
            ref="arrowb"></Icon>
      <Icon ref="searchIcon"
            :name="searchIcon"
            :class="[prefixCls + '-arrow']"
            v-if="filterable && searchIcon && !showArrow"></Icon>
    </div>
    <transition :name="transitionName">
      <Drop :class="dropdownCls"
            :dropWidth="dropWidth"
            :multiple="multiple"
            v-show="dropVisible"
            :placement="fPlacement"
            :data-transfer="transfer"
            :widthAdaption="widthAdaption"
            :maxDropWidth="maxDropWidth"
            ref="dropdown"
            v-transfer-dom>
        <div :class="content"
             ref="content"
             @click="handleclick">
          <!-- 单选时清空按钮 -->
          <!-- <ul v-show="notFoundShow" :class="[prefixCls + '-not-found']"><li>{{ localeNotFoundText }}</li></ul> -->
          <span :class="searchClass"
                ref='search'
                v-if="filterable && showBottom&&!hideMult">
            <Checkbox v-model="selectHead"
                      :size="checkboxSize"
                      @on-change="toggleSelect"
                      v-if="checkToHead&&multiple"></Checkbox>
            <input type="text"
                   v-model="query"
                   :disabled="disabled"
                   :readonly="!editable||readonly"
                   :class="[prefixCls + '-input']"
                   :placeholder="localeSearchHolder"
                   @blur="handleBlur"
                   @keydown="resetInputState"
                   @keydown.delete="handleInputDelete"
                   :tabindex="tabindex"
                   ref="input">
            <!-- <input type="text" placeholder="请输入..." class="h-input h-input-left">  -->
          </span>
          <span v-if="hideMult&&multiple" :class="hideMultHead" @click="toggleSelect(!isSelectAll)">全选</span>
          <div v-if="showHeader"
               :class="headerSlotCls">
            <slot name="header">
            </slot>
          </div>
          <div v-if="!isBlock"
               v-show="(!notFound && !remote) || (remote && !loading && !notFound)"
               :class="[prefixCls + '-dropdown-list']"
               :style="listStyle"
               ref='list'
               @scroll="handleSelectScroll">
            <slot></slot>
            <ul v-show="isComputed"
                :class="[prefixCls + '-not-data']">{{ localeNoMoreText }}</ul>
          </div>
          <div v-if="isBlock"
               id="blockWrapper"
               v-show="(!notFound && !remote) || (remote && !notFound)"
               :class="[prefixCls + '-dropdown-list']"
               :style="listStyle"
               ref='blockWrapper'>
            <slot></slot>
          </div>
          <div v-show="loading && isBlock" :class="[prefixCls+'-block-loading']">{{localeLoadingText}}</div>
          <ul v-show="loading && !isBlock"
              :class="[prefixCls + '-loading']">{{ localeLoadingText }}</ul>
        </div>
        <div v-if="showFooter"
             :class="checkAll">
          <slot name="footer">
          </slot>
        </div>
        <div v-if="isCheckall&&multiple&&!notFoundShow"
             :class="checkAll">
          <Button size="small"
                  @click="toggleSelect(false)">全不选</Button>
          <Button type="primary"
                  size="small"
                  @click="toggleSelect(true)">全选</Button>
        </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
import Icon from '../Icon/Icon.vue'
import Drop from '../Select/Dropdown.vue'
import clickoutside from '../../directives/clickoutside'
import TransferDom from '../../directives/transfer-dom'
import Checkbox from '../Checkbox/Checkbox.vue'
import { on, off } from '../../util/dom'
import {
  oneOf,
  getScrollBarSize,
  getStyle,
  getBarBottom,
  scrollAnimate
} from '../../util/tools'
import Emitter from '../../mixins/emitter'
import Locale from '../../mixins/locale'
const prefixCls = 'h-selectTable'
export default {
  name: 'SelectTable',
  mixins: [Emitter, Locale],
  components: { Icon, Drop, Checkbox },
  directives: { clickoutside, TransferDom },
  props: {
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
    value: {
      type: [String, Number, Array],
      default: ''
    },
    // 使用时，也得设置 value 才行
    label: {
      type: [String, Number, Array],
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String
    },
    filterable: {
      type: Boolean,
      default: false
    },
    focusSelect: {
      type: Boolean,
      default: true,
    },
    matchable: {
      type: Boolean,
      default: false
    },
    filterMethod: {
      type: Function
    },
    remote: {
      type: Boolean,
      default: false
    },
    remoteMethod: {
      type: Function
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      }
    },
    labelInValue: {
      type: Boolean,
      default: false
    },
    notFoundText: {
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
      default: 'bottom'
    },
    width: {
      type: [String, Number]
    },
    transfer: {
      type: Boolean,
      default: false
    },
    autoComplete: {
      type: Boolean,
      default: false
    },
    isString: {
      //多选时支持string类型，选项并以','隔开
      type: Boolean,
      default: false
    },
    isCheckall: {
      //多选 是否显示全选
      type: Boolean,
      default: false
    },
    noMoreText: {
      //下拉加载完成数据提示
      type: String
    },
    isComputed: {
      //是否显示加载完成数据提示
      type: Boolean,
      default: false
    },
    dropWidth: {
      //下拉框的宽度
      type: [String, Number]
    },
    format: {
      type: [Array, String],
      default: function() {
        return ['name,age', '_']
      }
    },
    matchWay: {
      validator(value) {
        return oneOf(value, ['left', 'blurry', 'all'])
      },
      default: 'blurry'
    },
    matchCol: {
      type: [String, Array, Number],
      default: ''
    },
    searchHolder: {
      type: String
    },
    showBottom: {
      type: Boolean,
      default: false
    },
    showBorder: {
      type: Boolean,
      default: false
    },
    checkToHead: {
      type: Boolean,
      default: false
    },
    autoPlacement: {
      type: Boolean,
      default: false
    },
    widthAdaption: {
      type: Boolean,
      default: false
    },
    maxDropWidth: {
      type: [String, Number],
      default: 500
    },
    isSelectFilter: {
      type: Boolean,
      default: false
    },
    checkboxSize: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default: 'large'
    },
    hideMult:{
      type:Boolean,
      default:false,
    },
    // focusIndex 初始值
    focusInit: {
      type: Number,
      default: 0
    },
    specialIndex:{
      type:Boolean,
      default:false,
    },
    specialVal:{
      type:[String,Number],
      default:'-1'
    },
    // 多选时离开焦点显示选择多少项
    showTotalNum:{
      type:Boolean,
      default:false,
    },
    //一直显示arrow图标，包括远程搜索时
    showArrow:{
      type:Boolean,
      default:false,
    },
    showValue: {
        type: Boolean,
        default: false
    },
    accuFilter:{
      type: Boolean,
      default: false
    },
    // 需求 148437 特殊属性
    // 远程搜索不需要执行 query
    remoteNoQuery: {
      type: Boolean,
      default: false
    },
    isBackClear: {
      type: Boolean,
      default: false,
    },
    newSearchModel:{
      type:Boolean,
      dafault:false,
    },
    valueToString:{
      type:Boolean,
      dafault:false,
    },
    searchIcon: {
      type: [Boolean, String],
      default: false
    },
    tabindex: {
      type: [String, Number],
      default: "-1",
      validator(value) {
        let num = parseInt(value);
        return num <= 32767 && num >= -1;
      }
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      visible: false,
      options: [],
      optionInstances: [],
      selectedSingle: '',
      selectedMultiple: [],
      // focusInit 不为 0 时触发 watch，这里不用 immediate 的原因是，一开始渲染就触发 on-focus-index-change block 不会有选中状态
      focusIndex: 0,
      focusValue: '', // simple select 用于选值
      query: '',
      lastQuery: '',
      selectToChangeQuery: false, // 选择一个值后执行过滤，false: 不执行 true: 执行
      availableOptions: [], // simple select 用于上下键选择时选择可用（过滤后）的options
      inputLength: 56,
      notFound: false,
      slotChangeDuration: false,
      model: null,
      currentLabel: this.label,
      isInputFocus: false, //是否焦点，为false时触发blur校验
      isLi: true,
      scrollBarWidth: getScrollBarSize(),
      highlightRow: false,
      tabIndex: 0,
      selectHead: false,
      fPlacement: this.placement,
      isBlock: false,
      allClick: false,
      viewValue:null,
      isSelectAll:false,
      showTotal:false,
      selectedResult:'',
       isSearchDelete:false,
       isQuerySelect:false,
       isMultiSpecial:false,
      // newSearchModelselectItem:{},
      // isCopy:false,
      // newSearchCheckAll:false,
      // newSearchUnCheckAll:false,
    }
  },
  computed: {
    hideMultHead(){
      return {
        [`${prefixCls}-hideMultHead`]:this.hideMult&&this.multiple,
        [`${prefixCls}-hideMultHead-select`]:this.isSelectAll,
      }
    },
    searchClass() {
      return [
        `${prefixCls}-search`,
        {
          [`${prefixCls}-checkHead`]:
            this.checkToHead && this.showBottom && this.filterable
        }
      ]
    },
    listStyle() {
      let style = {}
      if (!this.showHeader&&!this.hideMult) {
        if (this.showBorder) {
          style.paddingTop = this.showBottom ? '52px' : '0'
        } else {
          style.paddingTop = this.showBottom ? '38px' : '0'
        }
      }
      return style
    },
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-readonly`]: this.readonly,
          [`${prefixCls}-editable`]: !this.editable,
          [`${prefixCls}-multiple`]: this.multiple,
          [`${prefixCls}-single`]: !this.multiple,
          [`${prefixCls}-show-clear`]: this.showCloseIcon,
          [`${prefixCls}-${this.size}`]: !!this.size,
        }
      ]
    },
    dropdownCls() {
      return {
        ['h-select-dropdown-transfer']: this.transfer,
        [prefixCls + '-multiple']: this.multiple && this.transfer,
        ['h-auto-complete']: this.autoComplete
      }
    },
    content() {
      return {
        [`${prefixCls}-dropdown-content`]: this.showBorder,
        [`${prefixCls}-dropdown-noline-content`]: !this.showBorder
      }
    },
    selectionCls() {
      return {
        [`${prefixCls}-selection`]: !this.autoComplete
      }
    },
    showPlaceholder() {
      let status = false
      if (typeof this.model === 'string') {
        if (this.model === '') {
          status = true
        }
      } else if (Array.isArray(this.model)) {
        if (!this.model.length) {
          status = true
        }
      } else if (this.model === null) {
        status = true
      }

      return status
    },
    showCloseIcon() {
      return (
        !this.multiple &&
        this.clearable &&
        !this.showPlaceholder &&
        !this.readonly &&
        !this.disabled&&
        !this.isSingleSelect
      )
    },
    inputStyle() {
      let style = {}
      if (this.multiple) {
        if (this.showPlaceholder) {
          style.width = '100%'
        } else {
          style.width = `${this.inputLength}px`
        }
      }
      return style
    },
    localePlaceholder() {
      if (this.placeholder === undefined) {
        return this.t('i.select.placeholder')
      } else {
        return this.placeholder
      }
    },
    localeSearchHolder() {
      if (this.searchHolder === undefined) {
        return this.t('i.select.searchHolder')
      } else {
        return this.searchHolder
      }
    },
    localeNotFoundText() {
      if (this.notFoundText === undefined) {
        return this.t('i.select.noMatch')
      } else {
        return this.notFoundText
      }
    },
    localeLoadingText() {
      if (this.loadingText === undefined) {
        return this.t('i.select.loading')
      } else {
        return this.loadingText
      }
    },
    localeNoMoreText() {
      if (this.noMoreText === undefined) {
        return this.t('i.select.noMoreData')
      } else {
        return this.noMoreText
      }
    },
    transitionName() {
      const bottomPlaced = this.fPlacement.match(/^bottom/)
      return bottomPlaced ? 'slide-up' : 'slide-down'
      // return this.placement === 'bottom' ? 'slide-up' : 'slide-down';
    },
    dropVisible() {
      let status = true
      const options = this.$slots.default || []
      if (!this.loading && this.remote && this.query === '' && !options.length)
        status = false
      return this.visible && status
    },
    multiplestyle() {
      return {
        width: `${this.width}px`
      }
    },
    checkAll() {
      return 'h-select-checkall'
    },
    selectTabindex() { 
      return this.disabled ? -1 : ((this.tabindex + "") !== "-1" ? this.tabindex : 0);
    },
    notFoundShow() {
      let options = this.options
      options = options || []
      let state =
        this.notFound || (!this.loading && !options.length) || !options.length
      return state
    },
    showFooter() {
      return this.$slots.footer
    },
    showHeader() {
      return this.$slots.header
    },
    headerSlotCls() {
      return {
        [`${prefixCls}-header-slot-top`]: this.showBottom,
        [`${prefixCls}-header-slot`]: !this.showBottom
      }
    }
  },
  methods: {
    selectedTop(status=true) {
      this.broadcast('Block', 'on-select-top',status)
    },
    handleclick(e) {
      e.stopPropagation()
    },
    keyup(event) {
      if (this.disabled || this.readonly || !this.editable) {
        return false
      }
      if (event.keyCode == 9&&!this.isSingleSelect) {
        this.toggleMenu()
      }
    },
    keydown(event) {
      if (event.keyCode == 9) {
        this.hideMenu()
      }
    },
    handleSelectScroll(event) {
      let num = getBarBottom(event.target, this.scrollBarWidth)
      this.$emit('on-scroll', num)
    },
    toggleSelect(val) {
      this.isSelectAll = !this.isSelectAll
      if (this.isBlock) {
        let hybridValue = []
        let curValue = []
        this.allClick = true
        this.findChild(child => {
          this.options.forEach((col, i) => {
            if(child.cloneData[i].disabled) return
            if(this.isSelectFilter && child.cloneData[i].hidden){
              return false
            }
            if(this.specialIndex&&child.cloneData[i].value==this.specialVal) {
              this.$set(child.cloneData[i], 'selected', false)
              return false
            }
            this.$set(child.cloneData[i], 'selected', val)
            if (val) {
              hybridValue.push({
                value: col.value,
                label: col.label
              })
              curValue.push(col.value)
            }
          })
        })
        this.model = curValue
        this.selectedMultiple = hybridValue.slice(0, 50)
        setTimeout(() => {
          this.selectedMultiple = hybridValue
        }, 500)
        if (this.labelInValue) {
          this.$emit('on-change', hybridValue)
          this.dispatch('FormItem', 'on-form-change', hybridValue)
        } else {
          this.$emit('on-change', curValue)
          this.dispatch('FormItem', 'on-form-change', curValue)
        }
      } else {
        if (val) {
          let arr = []
          this.options.forEach(item => {
            arr.push(item.value)
          })
          this.model = arr
        } else {
          this.model = []
        }
      }
    },
    showdrop(){
      if(!this.isSingleSelect){
        this.toggleMenu();
      }
    },
    arrowClick(){
      this.toggleMenu();
    },
    offsetArrow() {
      if (!this.multiple) return
      let el = this.$refs.reference
      if (el.scrollHeight > el.clientHeight) {
        if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right = '22px'
        if (this.$refs.searchIcon) this.$refs.searchIcon.$el.style.right = '22px'
      } else {
        if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right = '8px'
        if (this.$refs.searchIcon) this.$refs.searchIcon.$el.style.right = '8px'
      }
    },
    toggleMenu() {
      if (this.disabled || !this.editable || this.readonly) {
        return false
      }
      this.visible = !this.visible
      this.isInputFocus = false
      if(this.newSearchModel){
        this.isInputFocus = true
      }
      if (this.visible && this.filterable && this.showBottom&&this.$refs.input) {
        this.$nextTick(() => {
          this.isInputFocus = true
          this.$refs.input.focus()
        })
      }
    },
    hideMenu() {
      this.visible = false
      // if(!window.isO45){
      if(!this.isSingleSelect){
        if (this.optionInstances.length > 0) {
          this.$refs.list && (this.$refs.list.scrollTop = 0);
          this.optionInstances[0].$refs.table.changeHover(this.focusIndex - 1, false)
        }
        this.focusIndex = this.focusInit
      }

      // 单选 恢复 query 值
      if (!this.multiple && this.query !== this.selectedSingle) {
        this.query = this.selectedSingle

        if (!this.remote) {
          this.selectToChangeQuery = true
        }
      }

      this.broadcast('TabelOption', 'on-select-close')
    },
    findChild(cb) {
      const find = function(child) {
        const name = child.$options.componentName
        if (name) {
          cb(child)
        } else if (child.$children.length) {
          child.$children.forEach(innerChild => {
            find(innerChild, cb)
          })
        }
      }

      if (this.optionInstances.length) {
        this.optionInstances.forEach(child => {
          find(child)
        })
      } else {
        this.$children.forEach(child => {
          find(child)
        })
      }
    },
    updateOptions(init, slot = false) {
      let _this = this
      let options = []

      this.findChild(child => {
        let data = []
        if (_this.isBlock) {
          data = child.cloneData
          data.forEach((col, i) => {
            options.push({
              value: col.value,
              label: col.label || col.value,
              disabled: col.disabled || false,
              index: i
            })
          })
        } else {
          data = child.rebuildData
          data.forEach((col, i) => {
            options.push({
              value: _this.getFormatValue(col),
              label: _this.getFormatValue(col),
              index: i
            })
          })
          if (init) {
            this.optionInstances.push(child)
          }
        }
      })

      this.options = options
      this.availableOptions = options
      
      if (init) {
        if (!this.remote || this.isBlock) {
          this.updateSingleSelected(true, slot)
          this.updateMultipleSelected(true, slot)
           //if(this.newSearchModel&&this.selectedMultiple.length>0&&!this.visible){
            if(this.newSearchModel&&!this.visible){
              let multipleAry=[];
                this.selectedMultiple.forEach(item=>{
                    multipleAry.push(item["label"]);
              })
              this.selectedResult=multipleAry.join(',');
           }
        }
      }
    },
    updateSingleSelected(init = false, slot = false) {
      const type = typeof this.model
      if (type === 'string' || type === 'number') {
        let findModel = false
        let curSingle = ''
        for (let i = 0; i < this.options.length; i++) {
          if (this.model === this.options[i].value) {
            curSingle = this.options[i].label
            findModel = true
            break
          }
        }

        if (this.model === '') {
          this.selectedSingle = ''
        } else if(this.remote && curSingle) {
          this.selectedSingle = curSingle
        } else if(!this.remote) {
          this.selectedSingle = curSingle
        }

        if (slot && !findModel) {
          this.model = ''
          this.query = ''
        }
      }
      this.toggleSingleSelected(this.model, init)
    },
    clearSingleSelect() {
      if (this.readonly || this.disabled) return
      if (this.showCloseIcon) {
        if (this.isBlock) {
          this.toggleSingleSelected('')
        } else {
          this.findChild(child => {
            child.$refs.table.clearAllRow()
          })
        }
        this.model = ''

        if (this.filterable) {
          this.query = ''
          this.selectedSingle = ''
        }
        this.hideMenu()
        this.isInputFocus = true
      }
    },
    updateMultipleSelected(init = false, slot = false) {
      if (this.multiple && Array.isArray(this.model)) {
        let selected = this.remote ? this.selectedMultiple.filter(item => this.model.filter(v => v === item.value).length) : []

        for (let i = 0; i < this.model.length; i++) {
          const model = this.model[i]

          for (let j = 0; j < this.options.length; j++) {
            const option = this.options[j]

            if (model === option.value) {
              selected.push({
                value: option.value,
                label: option.label
              })
            }
          }
        }

        const selectedArray = []
        const selectedObject = {}
        selected.forEach(item => {
          selectedObject[item.value] = item
        })
        for (let key in selectedObject) {
          selectedArray.push(selectedObject[key])
        }
        this.selectedMultiple = this.remote ? selectedArray : selected

        if (slot) {
          let selectedModel = []

          for (let i = 0; i < selected.length; i++) {
            selectedModel.push(selected[i].value)
          }

          if (this.model.length === selectedModel.length) {
            this.slotChangeDuration = true
          }
          this.model = selectedModel
        }
      }
      this.toggleMultipleSelected(this.model, init)
    },
    removeTag(index) {
      if (this.disabled || !this.editable || this.readonly) {
        return false
      }

      if (this.remote) {
        const tag = this.model[index]
        this.selectedMultiple = this.selectedMultiple.filter(
          item => item.value !== tag
        )
      }

      this.model.splice(index, 1)

      if (this.filterable && this.visible && this.$refs.input) {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }

      this.broadcast('Drop', 'on-update-popper')
    },
    toggleSingleSelected(value, init = false) {
      // let _this = this
      if (!this.multiple) {
        let label = value
        if (this.options.length) {
          let option = this.options.filter(opt => opt.value === value)[0]
          if (option) {
            label = option.label
          }
        }
        if (this.isBlock) {
          this.findChild(child => {
            this.options.forEach((col, i) => {
              if (value == col.value) {
                this.$set(child.cloneData[i], 'selected', true)
              } else {
                this.$set(child.cloneData[i], 'selected', false)
              }
            })
          })
        } else {
          this.findChild(child => {
            this.options.forEach(col => {
              let index = value.indexOf(col.value)
              if (index >= 0) {
                child.$refs.table.clearSelect(col.index, true)
                child.$refs.table.clearSingle(col.index, true)
              } else {
                child.$refs.table.clearSelect(col.index, false)
                child.$refs.table.clearSingle(col.index, false)
              }
            })
          })
        }
        if (!init) {      
          if (this.labelInValue) {
            this.$emit('on-change', {
              value: value,
              label: label
            })
            this.dispatch('FormItem', 'on-form-change', {
              value: value,
              label: label
            })
          } else {
            this.$emit('on-change', value)
            this.dispatch('FormItem', 'on-form-change', value)
          }
        }
      }
    },
    toggleMultipleSelected(value, init = false) {
      let _this = this
      if (this.multiple) {
        let hybridValue = []
        for (let i = 0; i < value.length; i++) {
          hybridValue.push({
            value: value[i]
          })
        }
        this.findChild(child => {
          if (this.isBlock) {
            let curSelect = true;
            _this.options.forEach((col, i) => {
              let index = value.indexOf(col.value)
              if (index > -1) {
                this.$set(child.cloneData[i], 'selected', true)
                hybridValue[index].label = col.label
              } else {
                this.$set(child.cloneData[i], 'selected', false)
                if(curSelect){
                  curSelect=false;
                }
              }
            })
            if(_this.options.length==0) curSelect = false
            this.isSelectAll = curSelect;
          } else {
            _this.options.forEach(col => {
              let index = value.indexOf(col.value)
              if (index >= 0) {
                child.$refs.table.clearSelect(col.index, true)
                hybridValue[index].label = col.label
              } else {
                child.$refs.table.clearSelect(col.index, false)
              }
            })
          }
        })
        if (!init) {
          if (this.labelInValue) {
            this.$emit('on-change', hybridValue)
            this.dispatch('FormItem', 'on-form-change', hybridValue)
          } else {
            let changeItem=value
            if(this.valueToString){
              changeItem=changeItem.join(",");
            }
            this.$emit('on-change', changeItem)
            this.dispatch('FormItem', 'on-form-change', changeItem)
          }
        }
      }
    },
    handleClose() {
      this.hideMenu()
      if (this.isInputFocus) {
        if (this.multiple) {
          // 多选返回数组
          this.dispatch('FormItem', 'on-form-blur', this.selectedMultiple)
        } else {
          // 单选返回字符串
          this.dispatch('FormItem', 'on-form-blur', this.selectedSingle)
        }
        this.isInputFocus = false
        if(this.isSingleSelect&&this.model==''){
          this.query=''
        }
      }
    },
    handleKeydown(e) {
      const keyCode = e.keyCode
      if(this.visible){
        // Esc slide-up
        if (keyCode === 27) {
          e.preventDefault()
          this.hideMenu()
        }
      }
      if(this.isSingleSelect){
        if (keyCode === 39) {
          e.preventDefault();
          this.navigateOptions('next');
        }
        // left
        if (keyCode === 37) {
          e.preventDefault();
          this.navigateOptions('prev');
        }
        if(keyCode === 39||keyCode === 37){
          this.selectBlockSingle(this.focusValue)
        }
        return false
      }
      if (this.visible) {
        // if(window.isO45){
          // right
          // if (keyCode === 39) {
          //   e.preventDefault();
          //   this.navigateOptions('next');
          // }
          // // left
          // if (keyCode === 37) {
          //   e.preventDefault();
          //   this.navigateOptions('prev');
          // }
          // if(!this.multiple && (keyCode === 39||keyCode === 37)){
          //   this.model = this.focusValue
          // }
          // if(this.multiple&&keyCode === 32){
          //   let index = this.focusIndex - 1
          //   if (index < 0) return false
          //   if(!this.focusValue) {
          //     this.focusValue = this.availableOptions[this.focusIndex - 1].value
          //   }
          //   if(this.availableOptions[this.focusIndex - 1].disabled) return
          //   this.selectBlockMultiple(this.focusValue)
          // }
          // return false;
        // }
        // next
        if (keyCode === 40) {
          e.preventDefault()
          this.navigateOptions('next')
        }
        // prev
        if (keyCode === 38) {
          e.preventDefault()
          this.navigateOptions('prev')
        }
        // enter
        if (keyCode === 13||(this.newSearchModel&&keyCode==32)) {
          e.preventDefault()

          let index = this.focusIndex - 1
          if (index < 0) return false

          // 设置 focusInit 后直接回车取不到 focusValue
          if(!this.focusValue) {
            this.focusValue = this.availableOptions[this.focusIndex - 1].value
          }
          if(this.availableOptions[this.focusIndex - 1].disabled) return

          if (this.isBlock) {
            if (!this.multiple) {
              if(window.IS_LICAI){
                this.model = this.focusValue
              }else{
                this.selectBlockSingle(this.focusValue)
              }
            } else {
              this.selectBlockMultiple(this.focusValue)
            }
            if(this.filterable){
              this.$nextTick(()=>{
                this.$refs.input.focus()
              })
            }
            return
          }

          this.findChild(child => {
            if (!this.multiple) {
              child.$refs.table.enterSingle(index, true)
            } else {
              child.$refs.table.enterSelect(index, true)
            }
          })
        }
      }
      if (this.visible || this.isInputFocus) {
        this.handleBack(e);
      }
    },
    navigateOptions(direction) {
      if (this.isBlock) {
        if (direction === 'next') {
          const next = this.focusIndex + 1
          this.focusIndex =
            this.focusIndex === this.availableOptions.length ? 1 : next
        } else if (direction === 'prev') {
          const prev = this.focusIndex - 1
          this.focusIndex =
            this.focusIndex <= 1 ? this.availableOptions.length : prev
        }

        this.focusValue = this.availableOptions[this.focusIndex - 1].value

        // 处理滚动条
        this.findChild(child => {
          // let curTop = child.$el.scrollTop
          let itemHeight = child.itemHeight
          let top = itemHeight * (this.focusIndex - 1)
          child.$el.scrollTop = top
        })

        return
      }

      let curTop = this.$refs.list.scrollTop
      if (this.focusIndex - 1 >= 0) {
        this.findChild(child => {
          child.$refs.table.changeHover(this.focusIndex - 1, false)
        })
      }

      if (direction === 'next') {
        const next = this.focusIndex + 1
        this.focusIndex = this.focusIndex === this.options.length ? 1 : next
      } else if (direction === 'prev') {
        const prev = this.focusIndex - 1
        this.focusIndex = this.focusIndex <= 1 ? this.options.length : prev
      }
      let top = this.$refs.list.children[0].querySelectorAll('.h-table-row')[
        this.focusIndex - 1
      ].offsetTop
      this.findChild(child => {
        child.$refs.table.changeHover(this.focusIndex - 1, true)
      })

      // this.$refs.list.scrollTop = top;
      scrollAnimate(this.$refs.list, curTop, top)
    },
    resetScrollTop() {
      const index = this.focusIndex - 1
      let bottomOverflowDistance =
        this.optionInstances[index].$el.getBoundingClientRect().bottom -
        this.$refs.dropdown.$el.getBoundingClientRect().bottom
      let topOverflowDistance =
        this.optionInstances[index].$el.getBoundingClientRect().top -
        this.$refs.dropdown.$el.getBoundingClientRect().top

      if (bottomOverflowDistance > 0) {
        this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance
      }
      if (topOverflowDistance < 0) {
        this.$refs.dropdown.$el.scrollTop += topOverflowDistance
      }
    },
    handleFocus(e) {
      e.target.selectionStart = 0
      e.target.selectionEnd = this.query.length
    },
     handleBlur() {
      this.$emit('on-blur')
    },
    handkeSearchBlur(){
       let multipleAry=[];
      this.selectedMultiple.forEach(item=>{
            multipleAry.push(item["label"]);
      })
      let modelstr=multipleAry.join(",");
      if(modelstr!=this.selectedResult){
        this.selectedResult=modelstr;
      }
       this.isInputFocus = false

    },
    resetInputState(e) {
      this.inputLength = this.$refs.input.value.length * 12 + 56
      if(this.visible &&this.showBottom&&e.keyCode==9){ //153789 【TS:201907180097-资管业委会（资管）_贺文能-【需求类型】需求【需求描述】simple-select tab切换时失去焦点，不会将下拉框收起， 详见附件】
        this.hideMenu();
         this.isInputFocus = false
      }
      if(this.newSearchModel&&!this.isInputFocus){
        this.isInputFocus=true;
      }
      if(this.newSearchModel&&e.keyCode=="86"&&e.ctrlKey){
         this.handleNewSearchCopy(e);
      }
      if(this.newSearchModel&&e.keyCode=="65"&&e.ctrlKey){
         this.handleNewSearchCheckAll(e);
         this.toggleSelect(true);
         let multipleAry=[];
          this.selectedMultiple.forEach(item=>{
                multipleAry.push(item["label"]);
          })
          let modelstr=multipleAry.join(",");
          if(modelstr!=this.selectedResult){
            this.selectedResult=modelstr;
          }
          e.preventDefault();
      }
      if(this.newSearchModel&&e.keyCode=="68"&&e.ctrlKey){
          this.handleNewSearchUnCheckAll(e);
          this.toggleSelect(false)
          this.selectedResult=''
          e.preventDefault();
          
      }
    },
    handleInputDelete() {
      if (this.multiple && this.model.length && this.query === '') {
        this.removeTag(this.model.length - 1)
      }
    },
    handleNewSearchCopy(e){
      this.isCopy=true;
    },
    handleNewSearchCheckAll(e){
      this.newSearchCheckAll=true;
    },
    handleNewSearchUnCheckAll(){
      this.newSearchUnCheckAll=true;
    },
    handleNewSearchSelect(changeitem){
      if(!changeitem) return;
       let label=changeitem.label;
       let selectAry=this.selectedResult.trim().split(",");
       let index=selectAry.indexOf(label);
       if(index>=0){
           selectAry.splice(index,1);
       }else{
           selectAry.push(label);
       }
       this.selectedResult=selectAry.join(",")
    },
    // handleSearchDelete(){
    //   this.isSearchDelete=true;
    // },
    newSearchUpdate(){
      setTimeout(()=> {
          this.$refs.dropdown.setWidthAdaption();
        },0);
    },
    newModelSearchDelete(multipleAry){
      if (this.multiple && this.selectedMultiple.length>0) {
        let searchAry=this.selectedResult.split(',');
            for(let i=0;i<multipleAry.length;i++){
              if(searchAry.indexOf(multipleAry[i])<0){
                  this.selectedMultiple.splice(i,1);
                  this.model.splice(i,1);
              }
          }
      }
      // this.isSearchDelete=false;
    },
    newModelhandleSearch(searchkey){
       if (this.remote && this.remoteMethod) {
        if (!this.selectToChangeQuery) {
          // 解决当通过表单方法firstNodeFocused定位到SimpleSelect时只能输入但不展示下拉选项的问题
          if (!this.visible && searchkey) this.visible = true;
          this.remoteMethod(searchkey)
          if(searchkey!=","){
             setTimeout(()=> {
                this.$emit('on-query-change', searchkey)
                this.broadcastQuery(searchkey)
                this.newSearchUpdate();
                //this.$refs.dropdown.setWidthAdaption(true);
              }, 300);
          }
          //this.$emit('on-query-change', searchkey)
         // this.broadcastQuery(searchkey)
        }
        this.findChild(child => {
          child.isFocus = false
        })
      } else {
        if (!this.selectToChangeQuery) {
          if (!this.visible && searchkey) this.visible = true;
          this.$emit('on-query-change', searchkey)
          this.broadcastQuery(searchkey)
        }

        if (!this.isBlock) {
          if (this.filterable && searchkey) {
            this.$nextTick(() => {
              this.findChild(child => {
                if (this.focusIndex > 0)
                  child.$refs.table.changeHover(this.focusIndex - 1, false)
                this.focusIndex = 1
                child.$refs.table.changeHover(this.focusIndex - 1, true)
              })
            })
          }
        }
      }

    },
    getLabel(val){
     let item=  this.options.filter(item=>item.value==val)
      return item?item[0].label:'';
    },
    // use when slot changed
    slotChange() {
      this.options = []
      this.optionInstances = []
    },
    setQuery(query) {
      if (!this.filterable) return
      this.query = query
    },
    modelToQuery() {
      if (!this.multiple && this.filterable && this.model !== undefined) {
        this.findChild(child => {
          if (this.model === child.value) {
            if (child.label) {
              this.query = child.label
            } else if (child.searchLabel) {
              this.query = child.searchLabel
            } else {
              this.query = child.value
            }
            this.selectToChangeQuery = true
          }
        })
      }
    },
    broadcastQuery(val) {
      this.focusIndex = this.focusInit
      if (this.isBlock) {
        this.broadcast('Block', 'on-query-change', val)
        if(this.isSelectFilter){
          this.findChild(child => {
            let isAll = child.cloneData.length==0?false:true
            for(let i=0; i<child.cloneData.length; i++){
              if(!child.cloneData[i].selected && !child.cloneData[i].hidden){
                isAll = false
                break
              }
            }
            this.selectHead = isAll
          })
        }
      } else {
        this.broadcast('TabelOption', 'on-query-change', val)
      }
    },
    // 处理 remote 初始值
    updateLabel() {
      if (this.remote) {
        if (!this.multiple && this.model !== '') {
          this.selectToChangeQuery = true
          if (this.currentLabel === '') this.currentLabel = this.model
          this.lastQuery = this.currentLabel
          this.query = this.currentLabel
        } else if (this.multiple && this.model.length) {
          if (this.currentLabel.length !== this.model.length) {
            let tmp = []
            for (let i = 0; i < this.model.length; i++) {
              tmp.push('')
            }
            this.currentLabel = tmp
          }

          this.selectedMultiple = this.model.map((item, index) => {
            return {
              value: item,
              label: this.currentLabel[index]
            }
          })
        }
      }
    },
    strtoArr(val) {
      if (this.multiple && this.isString) {
        if (val == '' || val == ' ' || val == null || val == undefined) {
          return []
        } else if (val.length > 0 && val.indexOf(',') == -1) {
          return new Array(val)
        } else {
          return val.split(',')
        }
      } else {
        return val
      }
    },
    arrtoStr(val) {
      if (this.multiple && this.isString) {
        if (val.length == 0) {
          return ''
        } else {
          return val.join(',')
        }
      } else {
        return val
      }
    },
    handleBack(e){
      if(!this.isBackClear ||this.readonly||this.disable) return;
      if (e.keyCode == 8) {
        if(this.multiple){
          this.clearMultipleSelect();
        }else{
          this.model=''
        }
      }
    },
    clearMultipleSelect(){
      if (this.disabled || !this.editable || this.readonly) {
        return false
      }
      this.model=[]
    },
    getFormatValue(value) {
      let val = ''
      let keyArr = this.format[0].split(',')
      let split = this.format[1]
      keyArr.forEach(col => {
        val += value[col] + split
      })
      return val.slice(0, val.length - 1)
    },
    searchStyle() {
      if (this.filterable && this.showBottom && !this.hideMult) {
        if (this.isBlock) {
          this.$refs.search.style.width = '100%'
          if (this.multiple && this.checkToHead) {
            this.$refs.input.style.width = 'calc(100% - 40px)'
          } else {
            this.$refs.input.style.width = '100%'
          }
        } else {
          let width =
            this.dropWidth > 0
              ? this.dropWidth
              : parseInt(getStyle(this.$el, 'width'))
          width = width - getScrollBarSize() + 'px'
          this.$refs.search.style.width = width
        }
      }
    },
    focus() {
      if (this.disabled || this.readonly) return
      this.$nextTick(() => {
        this.isInputFocus = true
        if(!this.isSingleSelect){
          this.visible = true
        }
        if (this.filterable) {
          this.$refs.input.focus()
        } else {
          this.$refs.reference.focus()
        }
      })
    },
    blur() {
      if (this.multiple) {
        // 多选返回数组
        this.dispatch('FormItem', 'on-form-blur', this.selectedMultiple)
      } else {
        // 单选返回字符串
        this.dispatch('FormItem', 'on-form-blur', this.selectedSingle)
      }
      this.isInputFocus = false
      this.visible = false
      if (this.filterable) {
        this.$refs.input.blur()
      } else {
        this.$refs.reference.blur()
      }
      if(this.isSingleSelect&&this.model==''){
        this.query=''
      }
    },
     select() {
      if (this.filterable) {
        this.$refs.input.select()
      }
    },
    selectBlockSingle(value,status=false,str) {
      this.isQuerySelect = status
      this.availableOptions = this.options
      this.selectToChangeQuery = true

      if (this.model === value) {
      } else {
        this.model = value
        // if (this.filterable && !this.showBorder) {
        // this.query = value
        // this.findChild((child) => {
        //   console.log(child.value)
        //   if (child.value === value) {
        //     if (this.query !== '') this.selectToChangeQuery = true;
        //     this.lastQuery = this.query = child.label === undefined ? child.searchLabel : child.label;
        //   }
        // });
        // }
      }
     if(!this.isSingleSelect||str=='click'){
        this.hideMenu()
      }
    },
    selectBlockMultiple(value,changeitem) {
      const index = this.model.indexOf(value)
      if(this.newSearchModel){
        this.newSearchModelselectItem=false;
        this.newSearchModelselectItem=changeitem;
      }
      let searchAry=this.selectedResult.split(",");
      if (index >= 0) {
        this.removeTag(index)
        if(this.newSearchModel){
          
          //let itemidx=searchAry.indexOf()
        }
      } else {
        if(this.specialIndex){
          if(value==this.specialVal){
            let arr = []
            arr.push(this.specialVal)
            this.model=arr
            if(!changeitem){ this.selectedResult=this.getLabel(this.specialVal);}
           
            return false
          }
          if (value!=this.specialVal && this.model.indexOf(this.specialVal)>=0) {
            const index = this.model.indexOf(this.specialVal);
            const specialItem = this.selectedMultiple.filter(item=>item["value"]==this.specialVal)
            if(searchAry.indexOf(specialItem[0].label)>-1){
                let idx=searchAry.indexOf(specialItem[0].label)
                searchAry.splice(idx,1);
                this.isMultiSpecial=true;
                this.selectedResult=searchAry.join(',');
            }
            this.removeTag(index);
          }
        }
        this.model.push(value)
        this.broadcast('Drop', 'on-update-popper')
      }
    },
    setPlacement(top = 0) {
      if (this.autoPlacement) {
        let obj = this.$refs.select
        // let allWidth = document.body.clientWidth
        let allHeight = document.body.clientHeight
        let curbottom = allHeight - obj.offsetTop - obj.clientHeight - top
        let bottomNum = this.isCheckall ? 250 : 210
        if (curbottom < bottomNum) {
          this.fPlacement = 'top'
        }
      }
    },
    firstVisibleDom(doms) {
      for (let i = 0; i < doms.length; i++) {
        if (doms[i].style.display !== 'none') return doms[i]
      }
    }
  },
  mounted() {
    this.isBlock = this.block ? true : false
    this.modelToQuery()
    // 处理 remote 初始值
    this.updateLabel()
    this.$nextTick(() => {
      if(!this.isSingleSelect) this.broadcastQuery('')
    })
    this.updateOptions(true) 
    this.$on('append', () => {
      this.slotChange()
      this.updateOptions(true, true)
    })
    this.$on('remove', () => {
      // this.findChild(child => {
      //   child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
      // });

      this.slotChange()
      this.updateOptions(true, true)
    })
    on(this.$refs.select, 'keydown', this.handleKeydown)
    // document.addEventListener('keydown', this.handleKeydown);
    this.$on('on-select-selected', (value, status) => {
      value = this.isBlock ? value : this.getFormatValue(value)
      // if (this.model === value && !window.isO45) {
      if (this.model === value && !this.isSingleSelect) {
        this.hideMenu()
      } else {
        if (this.multiple && !status) {
          const index = this.model.indexOf(value)
          if (index >= 0) {
            this.removeTag(index)
          } else {
            this.model.push(value)
            this.broadcast('Drop', 'on-update-popper')
          }
          if (this.filterable) {
            // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
            // if (this.query !== '') this.selectToChangeQuery = true;
            // this.query = '';
            // this.$refs.input.focus();
          }
        } else if (this.multiple && status == 'highlight') {
          const index = this.model.indexOf(value)
          if (index >= 0 && this.model.length == 1) {
            this.removeTag(index)
          } else {
            let curArr = []
            curArr.push(value)
            this.model = curArr
          }
          // if (this.filterable) {
          // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
          // if (this.query !== '') this.selectToChangeQuery = true;
          // this.query = '';
          // this.$refs.input.focus();
          // }
        } else {
          this.model = value

          if (this.filterable) {
            this.findChild(child => {
              if (child.value === value) {
                if (this.query !== '') this.selectToChangeQuery = true
                this.lastQuery = this.query =
                  child.label === undefined ? child.searchLabel : child.label
              }
            })
          }
          this.hideMenu()
        }
      }
    })
    // this.swidth = parseInt(this.$refs.select.getBoundingClientRect().width)||0;

    this.$nextTick(() => {
      this.offsetArrow()
      this.searchStyle()
    })
    // if (this.disabled) {
    //   this.tabIndex = -1
    // }
    this.setPlacement()
    this.$on('on-visible-change', (val, top) => {
      if (val) {
        this.$nextTick(() => {
          this.setPlacement(parseInt(top))
        })
      }
    })

    if (this.isBlock) {
      this.$on('on-options-visible-change', arg => {
        this.availableOptions = arg.data.filter(option => !option.hidden)
      })
    }
  },
  beforeDestroy() {
    off(this.$refs.select, 'keydown', this.handleKeydown)
    // document.removeEventListener('keydown', this.handleKeydown);
    this.broadcast('Drop', 'on-destroy-popper')
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if(this.model==!val){
          this.isQuerySelect = false
        }
        if (this.multiple && this.isString) {
          this.model = this.strtoArr(val)
        } else {
          this.model = val
          // TODO
        }       
        if (val === ''&&!this.visible) this.query = ''
      }
    },
    label(val) {
      this.currentLabel = val
      this.updateLabel()
    },
    model() {
      let backModel = this.arrtoStr(this.model)
      this.$emit('input', backModel)
      this.modelToQuery()
      if (this.multiple) {
        if (this.slotChangeDuration || this.allClick) {
          this.allClick = false
          this.slotChangeDuration = false
        } else {
          this.updateMultipleSelected()
        }
      } else {
        this.updateSingleSelected()
      }
    },
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          let content = this.$refs.content
          if (content.scrollHeight > content.clientHeight) {
            let cur =
              this.dropWidth > 0
                ? this.dropWidth
                : parseInt(getStyle(this.$el, 'width'))
            this.findChild(child => {
              child.hasWidth = cur - this.scrollBarWidth
            })
          }
        })
        setTimeout(() => {
          this.dispatch('Msgbox', 'on-esc-real-close', false)
        }, 0)
        this.broadcast('Drop', 'on-update-popper')
      } else {
        if (this.filterable) {
          if (this.$refs.input) {
            this.$refs.input.blur()
          }

          setTimeout(() => {
            if (this.remote && this.remoteMethod) return
            if (this.showBottom || this.multiple) {
              this.query = ''
            }
            // if(!window.isO45){
            if(!this.isSingleSelect){
              this.broadcastQuery('')
            }
          }, 300)
        }
        setTimeout(() => {
          this.dispatch('Msgbox', 'on-esc-real-close', true)
        }, 0)
        // this.broadcast('Drop', 'on-destroy-popper');
      }
      this.$emit('on-drop-change', val)
    },
    query(val) {
      if(this.isSingleSelect&&this.isInputFocus){
        if (!this.visible && val) this.visible = true;
      }
      if (this.remote && this.remoteMethod) {
        if (!this.selectToChangeQuery) {
          // 解决当通过表单方法firstNodeFocused定位到SimpleSelect时只能输入但不展示下拉选项的问题
          if (!this.visible && val) this.visible = true;
          this.remoteMethod(val)
          this.$emit('on-query-change', val)
          if (!this.remoteNoQuery) {
            this.broadcastQuery(val)
          }
        }
        this.findChild(child => {
          child.isFocus = false
        })
      } else {
        if (!this.isBlock) {
          if (this.filterable && val) {
            let focusIndex = this.focusIndex
            this.$nextTick(() => {
              this.findChild(child => {
                if (focusIndex > 0)
                  child.$refs.table.changeHover(focusIndex - 1, false)
                this.focusIndex = this.focusInit
              })
            })
          }
        }
        if (!this.selectToChangeQuery) {
          if (!this.visible && val) this.visible = true;
          this.$emit('on-query-change', val)
          this.broadcastQuery(val)
        }else if(this.isQuerySelect){
          this.broadcastQuery(val)
        }
      }

      this.selectToChangeQuery = false

      // this.broadcast('Drop', 'on-update-popper');
    },
    selectedSingle(val) {
     if (this.filterable && !this.showBottom && !this.isQuerySelect) {
        this.query = val
        if (this.query !== '') this.selectToChangeQuery = true
      }
      this.viewValue = val
    },
    // options(val) {
    //   console.log('options', val)
    // },
    // eslint-disable-next-line
    selectedMultiple(val) {
      this.$nextTick(() => {
        this.offsetArrow()
      })
      this.viewValue = val
      if(this.showTotalNum&&this.multiple&&!this.isInputFocus&&val.length>2){
        this.showTotal = true
      }else{
        this.showTotal = false
      }
    },
    selectHead(val) {
      // this.toggleSelect(val)
    },
    placement(val) {
      this.fPlacement = val
    },
    focusIndex: {
      handler(nv) {
        if (this.isBlock) {
          this.broadcast('Block', 'on-focus-index-change', nv - 1)
        }
      }
    },
    isInputFocus(val){
      if(this.showTotalNum&&this.multiple){
        if(!val&&this.selectedMultiple.length>2){
          this.showTotal = true
        }else{
          this.showTotal = false
        }
      }
      if(this.newSearchModel&&val){
        this.$emit("on-input-focus");
      }
    },
  }
}
</script>
