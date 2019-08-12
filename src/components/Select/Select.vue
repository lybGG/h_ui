<template>
  <div :class="classes" v-clickoutside="{trigger: 'mousedown', handler: handleClose}" :style="multiplestyle" ref="select">
    <div
      :title="titleTip"
      :class="selectionCls"
      ref="reference"
      :tabindex="tabIndex"
      :style="selectInputStyles"
      @click="toggleMenu"
      @keyup="keyup"
      @keydown="keydown">
      <!-- 多选时输入框内选中值模拟 -->
      <template  v-if="multiple && !collapseTags">
        <div class="h-tag" v-for="(item, index) in selectedMultiple" :key="index">
          <span class="h-tag-text" v-if="showValue">{{ item.value }}</span>
           <span class="h-tag-text" v-if="!showValue">{{ item.label }}</span>
          <Icon name="close" @click.native.stop="removeTag(index)"></Icon>
        </div>
      </template>
      <!-- 多选时输入框压缩展示个数 -->
      <template v-if="multiple && collapseTags && selectedMultiple.length > 0">
        <div class="h-tag">
          <span class="h-tag-text">{{ selectedMultiple[0].label }}</span>
          <Icon name="close" @click.native.stop="removeTag(index)"></Icon>
        </div>
        <div class="h-tag" v-if="multiple && collapseTags && selectedMultiple && selectedMultiple.length > 1">
          <span class="h-tag-text">+{{ selectedMultiple.length - 1 }}</span>
        </div>
      </template>
      <!-- 下拉输入框模拟（非远程搜索时渲染）  -->
      <span :class="[prefixCls + '-placeholder']" v-show="showPlaceholder && (!filterable || showBottom)">{{ localePlaceholder }}</span>
      <span :class="[prefixCls + '-selected-value']" v-show="!showPlaceholder && !multiple && !(filterable && !showBottom)">{{ selectedSingle }}</span>
      <!-- 下拉输入框(远程搜索时渲染) -->
      <input
        type="text"
        v-if="filterable && !showBottom"
        v-model="query"
        :disabled="disabled"
        :readonly = "readonly || !editable"
        :class="[prefixCls + '-input']"
        :placeholder="showPlaceholder?localePlaceholder:''"
        autocomplete="off"
        @blur="handleBlur"
        @keydown.delete="handleInputDelete"
        :tabindex="tabindex"
        ref="input">
      <!-- 单选时清空按钮 -->
      <Icon name="close" :class="[prefixCls + '-arrow']" v-if="showCloseIcon" @click.native.stop="handleIconClose" ref="close"></Icon>
      <Icon name="unfold" :class="[prefixCls + '-arrow']" v-if="!remote && isArrow" ref="arrowb"></Icon>
      <Icon :name="remoteIcon" :class="[prefixCls + '-arrow']" v-if="showRemoteIcon" ref="searchb"></Icon>
    </div>
    <transition :name="transitionName">
      <Drop
        :class="dropdownCls"
        v-show="dropVisible"
        :dropWidth="dropWidth"
        :placement="fPlacement"
        :data-transfer="transfer"
        ref="dropdown"
        :widthAdaption="widthAdaption"
        :maxDropWidth="maxDropWidth"
        v-transfer-dom>
        <div :class="content" @scroll="handleSelectScroll" ref="content" @click="handleclick">
          <span v-if="filterable && showBottom" :class="checkHeadClass">
            <Checkbox v-model="selectHead" v-if="checkToHead&&multiple"></Checkbox>
            <input
              type="text"
              v-model="query"
              :disabled="disabled"
              :readonly = "!editable||readonly"
              :class="[prefixCls + '-content-input']"
              :placeholder="localeSearchHolder"
              autocomplete="off"
              @blur="handleBlur"
              @keydown.delete="handleInputDelete"
              :tabindex="tabindex"
              ref="input">
          </span>
          <span v-if="hideMult&&multiple" :class="hideMultHead" @click="toggleSelect(!isSelectAll)">全选</span>
          <div v-if="showHeader">
            <slot name="header"></slot>
          </div>
          <ul v-show="notFoundShow && !enableCreate" :class="[prefixCls + '-not-found']"><li>{{ localeNotFoundText }}</li></ul>
          <ul v-show="(!notFound && !remote) || (remote && !loading && !notFound) || enableCreate" :class="[prefixCls + '-dropdown-list']">
            <!-- 多选、支持搜索和新建条目的情况下，如果检索词不匹配任何一个条目时，显示此项供用户选择 -->
            <h-option ref="createdOption" v-if="enableCreate && showNewOption" :value="query" created>{{query}}</h-option>
            <slot></slot>
          </ul>
          <ul v-show="loading" :class="[prefixCls + '-loading']">{{ localeLoadingText }}</ul>
          <ul v-show="isComputed" :class="[prefixCls + '-not-data']">{{ localeNoMoreText }}</ul>
        </div>
        <div v-if="showFooter" :class="checkAll">
          <slot name="footer">
            <template  v-if="(isCheckall&&multiple&&!notFoundShow) || (enableCreate && showNewOption)">
              <Button size="small" @click="toggleSelect(false)">全不选</Button>
              <Button type ="primary" size="small" @click="toggleSelect(true)">全选</Button>
            </template>
          </slot>
        </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
  import Icon from '../Icon/Icon.vue';
  import Button from '../Button/Button.vue';
  import Drop from './Dropdown.vue';
  import clickoutside from '../../directives/clickoutside';
  import TransferDom from '../../directives/transfer-dom';
  import Checkbox from '../Checkbox/Checkbox.vue';
  import { on, off } from '../../util/dom';
  import { oneOf, findComponentChildren, getScrollBarSize, getStyle,getBarBottom,scrollAnimate,typeOf, findInx} from '../../util/tools';
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';
  const prefixCls = 'h-select';
  export default {
    name: 'Select',
    mixins: [ Emitter, Locale ],
    components: { Icon, Drop, Checkbox},
    directives: { clickoutside,TransferDom},
    props: {
      disabled:{
        type:Boolean,
        default:false
      },
      readonly:{
        type:Boolean,
        default:false
      },
      editable:{
        type:Boolean,
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
      multClearable: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String
      },
      filterable: {
        type: Boolean,
        default: false
      },
      accuFilter:{
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
      remoteIcon:{
         type: String,
         default: ""
      },
      loading: {
          type: Boolean,
          default: false
      },
      loadingText: {
          type: String
      },
      size: {
          validator (value) {
              return oneOf(value, ['small', 'large', 'default']);
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
          validator (value) {
              return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
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
      isString:{//多选时支持string类型，选项并以','隔开
        type: Boolean,
        default: false
      },
      isCheckall:{//多选 是否显示全选
        type:Boolean,
        default:false
      },
      noMoreText: {//下拉加载完成数据提示
          type: String
      },
      isComputed:{//是否显示加载完成数据提示
        type:Boolean,
        default:false
      },
      isArrow:{//typefield时有需求不显示箭头
        type:Boolean,
        default:true,
      },
      algin:{
        type:String,
        default:'left',
      },
      setDefSelect:{//如果选择为空
        type:Boolean,
        default:false,
      },
      dropWidth:{//下拉框的宽度
        type:[String,Number],
      },
      searchHolder:{
        type:String,
      },
      showBottom:{
        type:Boolean,
        default:false
      },
      specialIndex:{
        type:Boolean,
        default:false,
      },
      checkToHead:{//只在多选且筛选框下有效
        type:Boolean,
        default:false,
      },
      showTitle:{
        type:Boolean,
        default:false,
      },
      hideMult:{
        type:Boolean,
        default:false,
      },
      focusSelect: {
        type: Boolean,
        default: true,
      },
      // o45证券代码--远程搜索时，点击输入框后不显示下拉列表，值改变时才显示，搜索值清空后隐藏
      remoteFocusNotShowList: {
        type: Boolean,
        default: false,
      },
      // 滚动时先固定滚动条，只有滚动至当屏最上方或者最下方时进行滚动条滚动，否则滚动条不动，只改变focusIndex值
      scrollFix: {
        type: Boolean,
        default: false,
      },
      isBackClear: {
        type: Boolean,
        default: false,
      },
      autoPlacement: {
        type: Boolean,
        default: false
      },
      zeroToNull:{
        type: Boolean,
        default: false
      },
      // 宽度自适应
      widthAdaption: {
        type: Boolean,
        default: false,
      },
      maxDropWidth: {
        type:[String,Number],
        default: 500
      },
      /* 条目不存在时允许增加新条目 */
      allowCreate: {
        type: Boolean,
        default: false
      },
      /* 多选时是否将选项压缩展示个数 */
      collapseTags: {
        type: Boolean,
        default: false
      },
      /* 搜索时是否不将焦点放在第一搜索项 */
      notAutoFocus:{
        type: Boolean,
        default: false
      },
      /* 全选和取消全选是否根据检索后展示选项 */
      isSelectFilter: {
        type: Boolean,
        default: false
      },
      showValue: {
        type: Boolean,
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
    data () {
      return {
        prefixCls: prefixCls,
        visible: false,
        options: [],
        disabledOpts: [],
        optionInstances: [],
        selectedSingle: '',
        selectedMultiple: [],
        focusIndex: 0,
        query: '',
        lastQuery: '',
        selectToChangeQuery: false,
        slotChangeDuration: false,
        model: null,
        currentLabel: this.label,
        isInputFocus: false, //是否焦点，为false时触发blur校验
        isLi:true,
        scrollBarWidth: getScrollBarSize(),
        isfirstSelect: false,
        tabIndex: 0,
        selectHead:false,
        titleTip:'',
        fPlacement:this.placement,
        isSelectAll:false,
        typeValue:'string',
        focusValue:'',
        viewValue:null,
        lastScrollTop: 0
      };
    },
    computed: {
      notFound() {
        return this.optionInstances.every(op => op.hidden);
      },
      showHeader() {
        return this.$slots.header
      },
      classes () {
        return [
          `${prefixCls}`,
          {
              [`${prefixCls}-visible`]: this.visible,
              [`${prefixCls}-disabled`]: this.disabled,
              [`${prefixCls}-editable`]: !this.editable,
              [`${prefixCls}-readonly`]: this.readonly,
              [`${prefixCls}-multiple`]: this.multiple,
              [`${prefixCls}-single`]: !this.multiple,
              [`${prefixCls}-show-clear`]: this.showCloseIcon,
              [`${prefixCls}-${this.size}`]: !!this.size,
              [`${prefixCls}-hideMult`]:this.hideMult&&this.multiple
          }
        ];
      },
      checkHeadClass(){
        return {[`${prefixCls}-checkHead`]:this.checkToHead&&this.showBottom&&this.filterable}
      },
      hideMultHead(){
        return {
          [`${prefixCls}-hideMultHead`]:this.hideMult&&this.multiple,
          [`${prefixCls}-hideMultHead-select`]:this.isSelectAll,
        }
      },
      dropdownCls () {
        return {
          [prefixCls + '-dropdown-transfer']: this.transfer,
          [prefixCls + '-multiple']: this.multiple && this.transfer,
          ['h-auto-complete']: this.autoComplete,
        };
      },
      content(){
        return `${prefixCls}-dropdown-content`
      },
      selectionCls () {
        return [
          `${prefixCls}-${this.algin}`,
          {
            [`${prefixCls}-selection`]: !this.autoComplete
          }
        ];
      },
      showPlaceholder () {
          let status = false;
          if ((typeof this.model) === 'string') {
              if (this.model === '') {
                  status = true;
              }
          } else if (Array.isArray(this.model)) {
              if (!this.model.length) {
                  status = true;
              }
          } else if( this.model === null){
              status = true;
          }
          return status;
      },
      showCloseIcon () {
          return (!this.multiple && this.clearable||this.multiple&&this.multClearable) && !this.showPlaceholder;
      },
      showRemoteIcon(){
        if(this.remote&&this.remoteIcon!=""){
          return true;
        }else{
            return false;
        }
      },
      localePlaceholder () {
          if (this.placeholder === undefined) {
              return this.t('i.select.placeholder');
          } else {
              return this.placeholder;
          }
      },
      localeSearchHolder () {
          if (this.searchHolder === undefined) {
              return this.t('i.select.searchHolder');
          } else {
              return this.searchHolder;
          }
      },
      localeNotFoundText () {
          if (this.notFoundText === undefined) {
              return this.t('i.select.noMatch');
          } else {
            return this.notFoundText;
          }
      },
      localeLoadingText () {
          if (this.loadingText === undefined) {
              return this.t('i.select.loading');
          } else {
              return this.loadingText;
          }
      },
      localeNoMoreText () {
          if (this.noMoreText === undefined) {
              return this.t('i.select.noMoreData');
          } else {
              return this.noMoreText;
          }
      },
      transitionName () {
        const bottomPlaced = this.fPlacement.match(/^bottom/);
        return bottomPlaced ? 'slide-up' : 'slide-down';
        // return this.placement === 'bottom' ? 'slide-up' : 'slide-down';
      },
      dropVisible () {
        let status = true;
        const options = this.$slots.default || [];
        if (!this.loading && this.remote && this.query === '' && !options.length) status = false;
        if(this.remote && this.showBottom) status =true;
        return this.visible && status;
      },
      selectInputStyles () {
        return {
            width: `${this.width}px`,
        };
      },
      multiplestyle () {
        return {
            width: `${this.width}px`,
        };
      },
      checkAll(){
        return `${prefixCls}-checkall`
      },
      notFoundShow () {
        let options = this.options||this.$slots.default;
        options = options || [];
        let state= (this.notFound && !this.remote) || (this.remote && !this.loading && !options.length)||(!this.remote&&!options.length);
        return state;
      },
      showFooter () {
        return this.$slots.footer || this.isCheckall;
      },
      /* 是否开启新建条目功能 */
      enableCreate() {
        return this.allowCreate && this.filterable;
      },
      showNewOption() {
        const model = this.model;
        const query = this.query;
        const optionInstances = this.optionInstances;
        let existed = false;
        for (let i in optionInstances) {
          let option = optionInstances[i];
          if (option.searchLabel === query || option.value === query) {
            existed = true;
            break;
          }
        }
        return query && !existed;
      }
    },
    methods: {
      handleclick(e){
        e.stopPropagation();
      },
      keyup(event){
        if (event.keyCode == 9) {
          if (this.disabled || this.readonly||!this.editable) {
            return false;
          }else{
            this.toggleMenu();
          }
        }
      },
      keydown(event){
        if (event.keyCode == 9) {
          this.hideMenu();
        }
      },
      focus(){
        this.isInputFocus = true;
        if (this.disabled || this.readonly) return;
        this.$nextTick(()=>{
          this.visible = true;
          if (this.filterable) {
            this.$refs.input.focus();
          }else{
            this.$refs.reference.focus();
          }
          this.$emit('on-focus')
        })
      },
      blur(){
        if (this.multiple) {
        // 多选返回数组
        this.dispatch('FormItem', 'on-form-blur', this.selectedMultiple)
        } else {
        // 单选返回字符串
        this.dispatch('FormItem', 'on-form-blur', this.selectedSingle)
        }
        this.isInputFocus = false;
        this.visible = false;
        if (this.filterable) {
          this.$refs.input.blur();
        }else{
          this.$refs.reference.blur();
        }
      },
      select() {
        if (this.filterable) {
          this.$refs.input.focus()
          this.$refs.input.select()
        }
      },
      handleSelectScroll(event){
        let num = getBarBottom(event.target,this.scrollBarWidth);
        this.$emit('on-scroll', num, this.lastScrollTop !== event.target.scrollTop ? "y" : "x");
        this.lastScrollTop = event.target.scrollTop;
      },
      toggleSelect(val){
        this.isSelectAll = !this.isSelectAll
        const createdOption = this.$refs.createdOption;
        const isSelectFilter = this.isSelectFilter;
        if (val) {
          if (this.specialIndex) {
            this.model=this.typeValue=='string'?['-1']:[-1];
          }else{
            let arr=[];
            this.optionInstances.forEach((item)=>{
              if (isSelectFilter) {
                if (!item.hidden) {
                  if (findInx(this.model, val => val == item.value) === -1) {
                    this.model.push(item.value);
                  }
                }
              } else {
                arr.push(item.value);
              }
            })
            if (!isSelectFilter) this.model = arr;
            if (createdOption) {
              createdOption.select();
              createdOption.selected = true;
            }
          }
        }else{
          if (createdOption) {
            createdOption.selected = false;
            let index = findInx(this.model, val => val == createdOption.value);
            if (index > -1) {
              this.model.splice(index, 1);
            }
          }
          if (isSelectFilter) {
            this.optionInstances.forEach(item => {
              if (!item.hidden) {
                let index = findInx(this.model, val => val == item.value);
                if (index > -1) {
                  this.model.splice(index, 1);
                }
              }
            })
          } else {
            this.model=[];
          }
        }
      },
      offsetArrow(){
        if (!this.multiple) return;
        let el = this.$refs.reference;
        if (el.scrollHeight>el.clientHeight) {
          if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right="22px";
          if (this.$refs.close) this.$refs.close.$el.style.right="22px";
        }else{
          if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right="8px";
          if (this.$refs.close) this.$refs.close.$el.style.right="8px";
        }
      },
      toggleMenu () {
        if (this.disabled || this.readonly||!this.editable) {
            return false;
        }
        // 展开时计算是否足够空间展开
        if (!this.dropVisible) this.setPlacement()
        // this.visible = !this.visible;
        // o45证券代码--点击时,若输入框值==当前选中value,则需要隐藏下拉列表
        if (this.model == this.query && this.model == this.value && typeof this.value == 'string' && this.remoteFocusNotShowList && !this.multiple) {
          this.visible = false;
          // focusSelect为false时，表明输入框获取焦点后直接进行搜索
          if (!this.focusSelect) this.selectToChangeQuery = false
        } else {
          this.visible = !this.visible;
        }
        this.isInputFocus = true
      },
      hideMenu () {
          this.visible = false;
          if(!window.isO45){
            this.focusIndex = 0;
          }
          this.broadcast('Option', 'on-select-close');
      },
      findChild (cb) {
          const find = function (child) {
              const name = child.$options.componentName;
              if (name) {
                  if (child.created) return;
                  cb(child);
              } else if (child.$children.length) {
                  child.$children.forEach((innerChild) => {
                      find(innerChild, cb);
                  });
              }
          };
          if (this.optionInstances.length) {
              this.optionInstances.forEach((child) => {
                  find(child);
              });
          } else {
              this.$children.forEach((child) => {
                  find(child);
              });
          }
      },
      updateOptions (init, slot = false) {
          let options = [];
          let disabledOpts = [];
          let index = this.enableCreate && typeof this.$refs.createdOption !== 'undefined' ? 2 : 1;
          this.findChild((child) => {
              options.push({
                value: child.value,
                // label: (child.label === undefined) ? child.$el.innerHTML.slice(Number(child.$el.innerHTML.indexOf('</label>')+8)) : child.label
                label: (child.label === undefined) ? child.$el.innerText.replace(/\s*\w{4,5} /, '') : child.label
              });
              if(child.disabled){
                disabledOpts.push(child.value);
              }
              child.index = index++;
              if (init) {
                  this.optionInstances.push(child);
              }
          });
          this.options = options;
          this.disabledOpts = disabledOpts;
          if(this.specialIndex&&this.options.length>0){
            this.typeValue = typeOf(this.options[0].value);
          }
          if (init) {
            if (!this.remote) {
              this.updateSingleSelected(true, slot);
              this.updateMultipleSelected(true, slot);
            }
          }
      },
      updateSingleSelected (init = false, slot = false) {
          const type = typeof this.model;
          if (type === 'string' || type === 'number') {
              let findModel = false;
              let curSingle = ''
              for (let i = 0; i < this.options.length; i++) {
                  if (this.model === this.options[i].value) {
                      curSingle = this.options[i].label;
                      findModel = true;
                      break;
                  }
              }
              this.selectedSingle = curSingle;
              if (this.enableCreate && !findModel) {
                this.selectedSingle = this.model;
                findModel = true;
              }
              if (slot && !findModel) {
                  this.model = '';
                  this.query = '';
              }
          }
          this.toggleSingleSelected(this.model, init);
      },
      handleIconClose(){
        if (this.readobly ||this.disabled|| !this.editable) return false;
        if(this.multiple){
          this.clearMultipleSelect();
        }else{
          this.clearSingleSelect();
        }
        this.isInputFocus = true
      },
      clearMultipleSelect () {
        let disArr=[];
        this.model.forEach((col)=>{
          if(this.disabledOpts.indexOf(col)!=-1){
            disArr.push(col);
          }
        })
        this.model=disArr;
      },
      clearSingleSelect () {
        if (this.showCloseIcon) {
            this.findChild((child) => {
                child.selected = false;
            });
            this.model = '';
            if (this.filterable && !this.showBottom) {
                this.query = '';
            }
            this.hideMenu();
            this.titleTip='';
        }
      },
      updateMultipleSelected (init = false, slot = false) {
        if (this.multiple && Array.isArray(this.model)) {
            // let selected = this.remote && this.model.length > 0 ? this.selectedMultiple : [];
            let selectedMultiple = this.selectedMultiple;
            let selected = [];
            for (let i = 0; i < this.model.length; i++) {
                const model = this.model[i];
                const options = this.options;
                let option;
                for (let op of this.options) {
                  if (op.value == model) {
                    option = op;
                    break;
                  }
                }
                // 处理远程搜索已选中选项不在当前展示的选项列表中的情况
                if (!option && this.remote) {
                  for (let op of selectedMultiple) {
                    if (op.value === model) {
                      option = op;
                      break;
                    }
                  }
                }
                if (option) {
                  selected.push({
                    value: option.value,
                    label: option.label
                  });
                } else if (this.enableCreate) {
                  selected.push({
                    value: model,
                    label: model
                  })
                }
            }
            const selectedArray = [];
            const selectedObject = {};
            selected.forEach(item => {
                if (!selectedObject[item.value]) {
                    selectedArray.push(item);
                    selectedObject[item.value] = 1;
                }
            });
            this.selectedMultiple = this.remote ? selectedArray : selected;
            if (slot) {
                let selectedModel = [];
                for (let i = 0; i < selected.length; i++) {
                    selectedModel.push(selected[i].value);
                }
                if (this.model.length === selectedModel.length) {
                    this.slotChangeDuration = true;
                }
                this.model = selectedModel;
            }
        }
        this.toggleMultipleSelected(init && this.multiple && this.model === "" ? [] : this.model, init);
      },
      removeTag (index) {
        if (this.disabled || this.readonly || !this.editable) {
          return false;
        }
        if (this.remote || this.enableCreate) {
          const tag = this.model[index];
          this.selectedMultiple = this.selectedMultiple.filter(item => item.value !== tag);
        }
        if(this.disabledOpts.indexOf(this.model[index])==-1){
          this.model.splice(index, 1);
        }else{
          return;
        }
        if (this.filterable && this.visible && !this.showBottom) {
          this.$refs.input.focus();
        }
        this.broadcast('Drop', 'on-update-popper');
        this.isInputFocus = true;
      },
      toggleSingleSelected (value, init = false) {
        if (!this.multiple) {
          let label = '';
          const createdOption = this.$refs.createdOption;
          if (createdOption) {
            if (value.indexOf(createdOption.value) > -1) {
              createdOption.selected = true;
            }
          }
          this.findChild((child) => {
              if (child.value === value) {
                  child.selected = true;
                  // label: (child.label === undefined) ? child.$el.innerHTML.slice(Number(child.$el.innerHTML.indexOf('</label>')+8)) : child.label
                  label = (child.label === undefined) ? child.$el.innerText.replace(/\s*\w{4,5} /, '') : child.label;
              } else {
                  child.selected = false;
              }
          });
          // this.hideMenu();
          if (!init) {
              if (this.labelInValue) {
                  this.$emit('on-change', {
                      value: value,
                      label: label ? label : value
                  });
                  this.dispatch('FormItem', 'on-form-change', {
                      value: value,
                      label: label ? label : value
                  });
              } else {
                  this.$emit('on-change', value);
                  this.dispatch('FormItem', 'on-form-change', value);
              }
          }
        }
      },
      toggleMultipleSelected (value, init = false) {
        if (this.multiple) {
          let curSelect = true;
          let hybridValue = [];
          for (let i = 0; i < value.length; i++) {
              hybridValue.push({
                value: value[i]
              });
          }
          this.findChild((child) => {
              const index = findInx(value, val => val == child.value);
              if (index >= 0) {
                  child.selected = true;
                  hybridValue[index].label  = (child.label === undefined) ? child.$el.innerText.replace(/\s*\w{4,5} /, '') : child.label;
                  // hybridValue[index].label = (child.label === undefined) ? child.$el.innerHTML.slice(Number(child.$el.innerHTML.indexOf('</label>')+8)) : child.label;
              } else {
                  child.selected = false;
              }
              if(curSelect && child.selected==false){
                curSelect=false;
              }
          });
          // 新建条目的label等于value
          if (this.enableCreate) {
            hybridValue.forEach(v => {
              if (typeof v.label === 'undefined') {
                v.label = v.value;
              }
            })
            const createdOption = this.$refs.createdOption;
            if (createdOption) {
              createdOption.selected = value.indexOf(createdOption.value) >= 0;
              if(curSelect && !createdOption.selected){
                curSelect = false;
              }
            }
          }
          this.isSelectAll = curSelect;
          if (!init) {
              if (this.labelInValue) {
                  this.$emit('on-change', hybridValue);
                  this.dispatch('FormItem', 'on-form-change', hybridValue);
              } else {
                  this.$emit('on-change', value);
                  this.dispatch('FormItem', 'on-form-change', value);
              }
          }
        }
      },
      handleClose () {
          this.hideMenu();
          if (this.isInputFocus) {
            if (this.multiple) {
            // 多选返回数组
            this.dispatch('FormItem', 'on-form-blur', this.selectedMultiple)
            } else {
            // 单选返回字符串
            this.dispatch('FormItem', 'on-form-blur', this.selectedSingle)
            }
            this.isInputFocus = false
          }
      },
      handleKeydown (e) {
        if (this.visible) {
          const keyCode = e.keyCode;
          // Esc slide-up
          if (keyCode === 27) {
              e.preventDefault();
              this.hideMenu();
          }
          if(window.isO45){
            // right
            if (keyCode === 39) {
              e.preventDefault();
              this.navigateOptions('next');
            }
            // left
            if (keyCode === 37) {
              e.preventDefault();
              this.navigateOptions('prev');
            }
            if((keyCode === 39||keyCode === 37)&&!this.multiple){
              this.model = this.focusValue
              this.selectToChangeQuery = true
            }
            if(this.multiple&&keyCode === 32){//空格键
              e.preventDefault();
              const createdOption = this.$refs.createdOption;
              if (createdOption && createdOption.isFocus) {
                createdOption.select();
                // 单选时，enter不需要取消选择
                if (this.multiple || !createdOption.selected) {
                  createdOption.selected = !createdOption.selected;
                }
              } else {
                this.findChild((child) => {
                  if (child.isFocus) {
                    child.select();
                  }
                });

              }
            }
            return false;
          }
          // next
          if (keyCode === 40) {
              e.preventDefault();
              this.navigateOptions('next');
          }
          // prev
          if (keyCode === 38) {
              e.preventDefault();
              this.navigateOptions('prev');
          }
          // enter
          if (keyCode === 13) {
              e.preventDefault();
              const createdOption = this.$refs.createdOption;
              if (createdOption && createdOption.isFocus) {
                createdOption.select();
                // 单选时，enter不需要取消选择
                if (this.multiple || !createdOption.selected) {
                  createdOption.selected = !createdOption.selected;
                }
              } else {
                if(!this.multiple&&window.IS_LICAI){
                  this.model = this.focusValue
                  this.selectToChangeQuery = true
                }else{
                  this.findChild((child) => {
                  if (child.isFocus) {
                    child.select();
                  }
                });
                }
              }
          }
        }
        if (this.visible || this.isInputFocus) {
          this.handleBack(e);
        }
      },
      navigateOptions (direction) {
        let curTop = this.$refs.content.scrollTop ? this.$refs.content.scrollTop : 0;
        const createdOption = this.$refs.createdOption;
        let maxIndex = createdOption ? this.options.length + 1 : this.options.length;
          if (direction === 'next') {
            const next = this.focusIndex + 1;
            this.focusIndex = (this.focusIndex === maxIndex) ? 1 : next;
          } else if (direction === 'prev') {
            const prev = this.focusIndex - 1;
            this.focusIndex = (this.focusIndex <= 1) ? maxIndex : prev;
          }
          let child_status = {
            disabled: false,
            hidden: false
          };
          let find_deep = false;
          if (createdOption && this.focusIndex === 1) {
            createdOption.isFocus = true;
            this.findChild(child => {
              child.isFocus = false;
            })
          } else {
            if (createdOption) {
              createdOption.isFocus = false;
            }
            this.findChild((child) => {
              if (child.index === this.focusIndex) {
                child_status.disabled = child.disabled;
                child_status.hidden = child.hidden;
                if (!child.disabled && !child.hidden) {
                  child.isFocus = true;
                }
              } else {
                child.isFocus = false;
              }
              if (!child.hidden && !child.disabled) {
                find_deep = true;
              }
            });
          }

          this.focusValue = this.options[this.focusIndex - 1].value
          let top = 30*(this.focusIndex-1);
          let contentHeight = 0
          let selectItemHeight = 1
          if (this.scrollFix) {
            // 距离底部5px
            selectItemHeight = ((!this.notFound && !this.remote) || (this.remote && !this.loading && !this.notFound)) && this.$refs.content.getElementsByClassName('h-select-item').length > 0 ?  this.$refs.content.getElementsByClassName('h-select-item')[0].clientHeight : 30
            contentHeight = this.showBottom ? (this.$refs.content.clientHeight - 10 - selectItemHeight) : (this.$refs.content.clientHeight - 10)
            if (direction == 'next') {
              let conNum = Math.floor(contentHeight / selectItemHeight)
              let topNum = Math.floor(curTop / selectItemHeight)
              top = this.focusIndex == 1 ? 0 : this.focusIndex <  conNum + topNum ? curTop : (this.focusIndex - conNum) * selectItemHeight
            } else if (direction === 'prev') {
              let maxnum = Math.floor((contentHeight + curTop) / selectItemHeight)
              let minnum = Math.floor(curTop/ selectItemHeight)
              top = this.focusIndex > minnum && this.focusIndex < maxnum ? curTop : (this.focusIndex -1) * selectItemHeight
            }
          }
          if (curTop != top) {
            this.$refs.content.scrollTop = top;
          }
          this.resetScrollTop();
          if ((child_status.disabled || child_status.hidden) && find_deep) {
              this.navigateOptions(direction);
          }
      },
      resetScrollTop () {
        const index = this.focusIndex - 1;
        let bottomOverflowDistance = this.optionInstances[index] ? this.optionInstances[index].$el.getBoundingClientRect().bottom - this.$refs.dropdown.$el.getBoundingClientRect().bottom : 0;
        let topOverflowDistance = this.optionInstances[index] ? this.optionInstances[index].$el.getBoundingClientRect().top - this.$refs.dropdown.$el.getBoundingClientRect().top : 0;
        if (bottomOverflowDistance > 0) {
            this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
            this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
        }
      },
      handleBlur () {
        if (this.multiple && this.filterable) this.$refs.reference.scrollTop = 0
        this.isInputFocus = false
        this.$emit('on-blur');
        if (this.showBottom) return false;
        // this.isInputFocus = false
        setTimeout(() => {
          const model = this.model;

          if (this.multiple) {
            this.query = '';
          } else {
            if (model !== '') {
                let found = false;
                this.findChild((child) => {
                  if (child.value === model) {
                    found = true;
                    this.query = child.label === undefined ? child.searchLabel : child.label;
                    this.query = this.query.trim();
                  }
                });
                // 如果删除了搜索词，下拉列表也清空了，所以强制调用一次remoteMethod
                if ((this.remote || this.enableCreate) && !found && this.query !== this.lastQuery) {
                    this.$nextTick(() => {
                        this.query = this.lastQuery.trim();
                    });
                }
            } else {
              this.query = '';
            }
          }
        }, 300);
      },
      resetInputState () {
        this.inputLength = this.$refs.input.value.length * 12 + 56;
      },
      handleInputDelete () {
        if (this.multiple && this.model.length && this.query === '') {
          this.removeTag(this.model.length - 1);
        }
      },
      // use when slot changed
      slotChange () {
        this.options = [];
        this.optionInstances = [];
      },
      setQuery (query) {
        if (!this.filterable) return;
        this.query = query;
      },
      modelToQuery() {
        if (!this.multiple && this.filterable && this.model !== undefined &&!this.showBottom) {
          this.findChild((child) => {
            if (this.model === child.value) {
                if (child.label) {
                    this.query = child.label.trim();
                } else if (child.searchLabel) {
                    this.query = child.searchLabel.trim();
                } else {
                    this.query = child.value.trim();
                }
                this.selectToChangeQuery = true
            }
          });
        }
      },
      broadcastQuery (val) {
          if (findComponentChildren(this, 'OptionGroup')) {
              this.broadcast('Option', 'on-query-change', val);
              this.broadcast('OptionGroup', 'on-query-change', val);
          } else {
              this.broadcast('Option', 'on-query-change', val);
          }
      },
      // 处理 remote 初始值
      updateLabel () {
        if (this.remote) {
          if (!this.multiple && this.model !== '') {
            this.selectToChangeQuery = true;
            if(this.options.length>0){
              this.model=this.value;
            }else{
              if (this.currentLabel === '') this.currentLabel = this.model;
              this.lastQuery = this.currentLabel;
              this.query = this.currentLabel;
            }
          } else if (this.multiple && this.model.length) {
            if (this.currentLabel.length !== this.model.length) this.currentLabel = this.model;
            this.selectedMultiple = this.model.map((item, index) => {
              return {
                value: item,
                label: this.currentLabel[index]
              };
            });
          }
        }
      },
      strtoArr(val){
        if (this.multiple && this.isString) {
          if (val==''||val==' '||val == null||val == undefined) {
            return [];
          }else if(val.length>0&&val.indexOf(',')==-1){
            return new Array(val);
          }else{
            return val.split(',');
          }
        }else{
          return val;
        }
      },
      arrtoStr(val){
        if (this.multiple && this.isString) {
          if (val.length == 0) {
            return '';
          }else{
            return val.join(',');
          }
        }else{
          return val;
        }
      },
      handleBack(e){
        if(!this.isBackClear) return;
        if (e.keyCode == 8) {
          if(this.multiple){
            this.clearMultipleSelect();
          }else{
            this.clearSingleSelect();
          }
        }
      },
      checkOptionSelected() {
        const createdOption = this.$refs.createdOption;
        if (createdOption) {
          const model = this.model;
          const query = this.query;
          let selected = false;
          if (this.multiple) {
            for (let m of model) {
              if (m === query) {
                selected = true;
                break;
              }
            }
          } else {
            selected = model === query;
          }
          createdOption.selected = selected;
        }
      },
      reorderOptionIndex() {
        const createdOption = this.$refs.createdOption;
        let index = 1;
        if (createdOption) {
          createdOption.index = 1;
          index = 2;
        }
        this.findChild(child => {
          child.index = index++;
        })
      },
      setPlacement(top = 0){
        if(this.autoPlacement){
            let clientHeight = document.documentElement.clientHeight;
            let rect = this.$refs.select.getBoundingClientRect()
            let bottomNum = this.isCheckall ? 250 : 210;
            if (clientHeight - rect.top - rect.height < bottomNum){
              this.fPlacement = 'top';
            } else {
              this.fPlacement = 'bottom';
            }
        }
      }
    },
    mounted () {
      if (!this.multiple && this.setDefSelect && this.value == ''){
        this.isfirstSelect = true;
      }
      this.modelToQuery();
      // 处理 remote 初始值
      this.$nextTick(() => {
          this.broadcastQuery('');
      });
      this.updateOptions(true);
      this.updateLabel();
      on(document,'keydown', this.handleKeydown);
      this.$on('append', () => {
        if (!this.remote) {
          this.modelToQuery();
          this.$nextTick(() => {
              this.broadcastQuery('');
          });
        } else {
          this.findChild(child => {
              child.selected = this.multiple ? findInx(this.model, v => v == child.value) > -1 : this.model === child.value;
          });
        }
        this.slotChange();
        this.updateOptions(true, true);
      });
      this.$on('remove', () => {
          if (!this.remote) {
              this.modelToQuery();
              this.$nextTick(() => {
                  this.broadcastQuery('');
              });
          } else {
              this.findChild(child => {
                  child.selected = this.multiple ? findInx(this.model, v => v == child.value) > -1 : this.model === child.value;
              });
          }
          this.slotChange();
          this.updateOptions(true, true);
      });
      this.$on('on-select-selected', (value) => {
        if (this.model === value) {
          this.hideMenu();
        } else {
          if (this.multiple) {
            const index = findInx(this.model, v => v == value);
            if (index >= 0) {
              this.removeTag(index);
            } else {
              if (this.specialIndex) {
                let queryNum = this.typeValue=='string'?'-1':-1
                if (value==queryNum) {
                  this.model=this.typeValue=='string'?['-1']:[-1];
                  return false;
                }
                if (value!=queryNum && this.model.indexOf(queryNum)>=0) {
                  const index = this.model.indexOf(queryNum);
                  this.removeTag(index);
                }
              }
              this.model.push(value);
              this.broadcast('Drop', 'on-update-popper');
            }
            if (this.filterable && !this.showBottom) {
              // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
              if (this.query !== '') this.selectToChangeQuery = true;
              this.query = '';
              this.$refs.input.focus();
            }
            // if (this.filterable && this.showBottom) {
            //   this.selectToChangeQuery = false;
            // }
          } else {
            this.model = value;
            if (this.filterable && !this.showBottom) {
              this.selectToChangeQuery = true;
              let found = false;
              this.findChild((child) => {
                if (child.value === value) {
                  this.lastQuery = this.query = child.label === undefined ? child.searchLabel : child.label;
                  found = true;
                }
              });
              if (!found && this.enableCreate && value !== '') {
                this.lastQuery = this.query = value;
              }
            }
            this.$nextTick(() => {
              this.hideMenu()
            })
          }
        }
      });
      this.$nextTick(()=>{
        this.offsetArrow();
      });
      if (this.disabled) {
        this.tabIndex = -1;
      } else {
        if (("" + this.tabindex) !== '-1') {
          this.tabIndex = this.tabindex;
        }
      }
      // this.setPlacement();
      this.$on('on-visible-change', (val,top) => {
        if(val){
          this.$nextTick(()=>{
            this.setPlacement(parseInt(top));
          })
        }
      });
    },
    beforeDestroy () {
      off(document,'keydown',this.handleKeydown)
      this.broadcast('Drop', 'on-destroy-popper');
    },
    watch: {
      value:{
        immediate: true,
        handler(val) {
          if (this.multiple && this.isString) {
            this.model = this.strtoArr(val);
          }else{
            if(this.zeroToNull&&!this.multiple&&val=='0'){
              this.model = ''
            }else{
              this.model = val;
            }
          }
          if (val === '') this.query = '';
        }
      },
      label (val) {
        this.currentLabel = val;
        this.updateLabel();
      },
      selectedMultiple (val){
        this.$nextTick(()=>{
          this.offsetArrow();
        })
        if (val.length>0&&this.showTitle) {
          let labelarr=[]
          val.forEach((item)=>{
            labelarr.push(item.label);
          })
          this.titleTip = labelarr.join(',');
        }else{
          this.titleTip = '';
        }
        this.viewValue = val
      },
      model () {
        let backModel = this.arrtoStr(this.model);
        if(this.zeroToNull&&!this.multiple&&backModel==''){
          backModel = '0';
        }
        this.$emit('input', backModel);
        this.modelToQuery();
        if (this.multiple) {
          if (this.slotChangeDuration) {
              this.slotChangeDuration = false;
          } else {
              this.updateMultipleSelected();
          }
        } else {
          this.updateSingleSelected();
        }
        // if (!this.visible && this.filterable) {
        //   this.$nextTick(() => {
        //       this.broadcastQuery('');
        //   });
        // }
      },
      visible (val) {
        if (val) {
          if (this.filterable) {
            if (this.multiple && !this.showBottom) {
              this.$refs.input.focus();
            } else {
              if (this.focusSelect) this.$refs.input.select();
            }
            if (this.remote) {
              this.findChild(child => {
                  child.selected = this.multiple ? findInx(this.model, v => v == child.value) > -1 : this.model === child.value;
              });
              // remote下，设置了默认值，第一次打开时，搜索一次
              const options = this.$slots.default || [];
              if (this.query !== '' && !options.length) {
                  this.remoteMethod(this.query);
              }
            }
          }
          this.broadcast('Drop', 'on-update-popper');
          setTimeout(() => {
            this.dispatch('Msgbox', 'on-esc-real-close', false);
          }, 0);
        } else {
          if (this.filterable) {
            this.$refs.input.blur();
            // #566 reset options visible
            setTimeout(() => {
              if (this.showBottom) {this.query='';}
              this.broadcastQuery('');
            }, 300);
          }
          setTimeout(() => {
            this.dispatch('Msgbox', 'on-esc-real-close', true);
          }, 0);
          // this.broadcast('Drop', 'on-destroy-popper');
        }
      },
      query (val) {
        if (this.remote && this.remoteMethod) {
          // o45证券代码--点击时不显示下拉选项（手动隐藏），因此需要值改变后（手动显示）
          if (this.remoteFocusNotShowList && !this.multiple) { // 单选时适用，多选时query会清空，不适用
            if ( val != '' && !this.visible && val != this.value) {
                this.visible = true
            }
            if (this.visible && !this.isInputFocus) { //点击其他页面触发失去焦点事件
              this.visible = false
            }
          }
          if (!this.selectToChangeQuery) {
            this.$emit('on-query-change', val);
            if(this.readonly || this.disabled) return false;
            this.remoteMethod(val);
            this.focusIndex = 0;
            this.findChild(child => {
              child.isFocus = false;
            });
          }
          typeof this.$refs.createdOption !== 'undefined' && (this.$refs.createdOption.isFocus = false);
        } else {
            if (!this.selectToChangeQuery) {
              this.$emit('on-query-change', val);
              this.broadcastQuery(val);
            }
            // if(val.trim()) this.broadcastQuery(val);
        }
        this.$nextTick(() => {
          this.enableCreate && this.checkOptionSelected();
          this.enableCreate && this.reorderOptionIndex();
        })
        if (this.filterable&&!this.remote&&!this.selectToChangeQuery&&!this.notAutoFocus) {
          this.$nextTick(()=>{
            // 当没有选项的时候focusIndex应为0
            this.focusIndex = this.options.length > 0 || this.$refs.createdOption ? 1 : 0;
            if (typeof this.$refs.createdOption !== 'undefined') {
              this.$refs.createdOption.isFocus = true;
              this.findChild(child => {
                child.isFocus = false;
              })
            } else {
              let index = 0;
              this.findChild(child => {
                if (index==0&& !child.hidden) {
                  index++;
                  child.isFocus = true;
                }else{
                  child.isFocus = false;
                }
              });
            }
          })
        }
        this.selectToChangeQuery = false;
        this.broadcast('Drop', 'on-update-popper');
      },
      selectedSingle(val){
        // if(!window.isO45){
        //   this.hideMenu();
        // }
        if (val&&this.showTitle) {
          this.titleTip=val
        }
        this.viewValue = val
      },
      options(val){
        if (val.length!=0 && this.isfirstSelect) {
          this.model = val[0].value;
          this.isfirstSelect = false;
        }
        if (this.remote&&!this.notAutoFocus) {
          this.$nextTick(()=>{
            this.focusIndex = 1;
            const createdOption = this.$refs.createdOption;
            if (createdOption) {
              createdOption.isFocus = true;
            } else {
              this.findChild(child => {
                if (child.index == 1) {
                  child.isFocus = true;
                }
              });
            }
          })
        }
      },
      selectHead(val){
        this.toggleSelect(val);
      },
      placement(val){
        this.fPlacement = val;
      },
      fPlacement(val) {
        this.$refs.dropdown.update()
      },
      dropVisible(val){
        this.$emit('on-drop-change',val)
      }
    }
  };
</script>
