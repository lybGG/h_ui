<template>
  <div :class="classes" :style="multiplestyle" ref="select" v-clickoutside="{trigger: 'mousedown', handler: handleClose}">
    <div
      :class="[prefixCls + '-selection']"
      ref="reference"
      :tabindex="tabIndex"
      @click="toggleMenu"
      @keyup="keyup"
      @keydown="keydown">
      <!-- 多选时输入框内选中值模拟 -->
      <div class="h-tag" v-for="(item, index) in selectedMultiple" :key="index">
        <span class="h-tag-text">{{ item }}</span>
        <!-- <Icon name="close" @click.native.stop="removeTag(index)"></Icon>  -->
      </div>
      <!-- 输入框模拟 -->
      <span :class="[prefixCls + '-placeholder']" v-show="showPlaceholder && (!filterable ||showBottom)">{{ localePlaceholder }}</span>
      <span :class="[prefixCls + '-selected-value']" v-show="!showPlaceholder && !showCheckbox && (!filterable ||showBottom)">{{ selectedSingle }}</span>
      <!-- 模糊匹配输入框模拟 -->
      <input
        type="text"
        v-if="filterable && !showBottom"
        v-model="query"
        :disabled="disabled"
        :readonly = "!editable||readonly"
        :class="[prefixCls + '-input']"
        :placeholder="showPlaceholder?localePlaceholder:''"
        :style="inputStyle"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInputDown"
        @keydown.delete="handleInputDelete"
        :tabindex="tabIndex"
        ref="input">
      <!-- 单选时清空按钮 -->
      <Icon name="close" :class="[prefixCls + '-arrow']" v-show="showCloseIcon" @click.native.stop="clearSingleSelect"
      ref="close"></Icon>
      <Icon name="unfold" :class="[prefixCls + '-arrow']" ref="arrowb" v-if="!remote"></Icon>
    </div>
    <transition :name="transitionName">
      <Drop v-show="dropVisible"
        :placement="fPlacement"
        :dropWidth="dropWidth"
        :class="dropdownCls"
        :data-transfer="transfer"
        ref="dropdown"
        v-transfer-dom>
        <!--  <ul v-show="notFountShow" :class="[prefixCls + '-not-found']"><li>{{ localeNotFoundText }}</li></ul> -->
        <div :class="[prefixCls + '-dropdown-content']" ref="content" @click="handleclick">
          <div :class="searchClass" ref='search' v-if="filterable && showBottom">
            <input
                type="text"
                v-model="query"
                :disabled="disabled"
                :readonly = "!editable||readonly"
                :class="[prefixCls + '-input']"
                :placeholder="localeSearchHolder"
                :style="inputStyle"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInputDown"
                @keydown.delete="handleInputDelete"
                :tabindex="tabIndex"
                ref="input">
          </div>
          <div class="h-selectTree-dropdown-list" ref="list" :style="listStyle">
            <Tree ref="tree" :data="baseDate" :show-checkbox="showCheckbox" :multiple="multiple" :isAlwaysSelect="isAlwaysSelect" :checkStrictly="checkStrictly" :showIndeterminate="!checkIndeter" @on-select-change="selectChange" @on-check-change="checkChange" @on-toggle-expand="toggleExpand" v-show="remote && !loading || !remote" isFormSelect>
            </Tree>
          </div>
          <!-- 远程搜索loading -->
          <ul v-show="loading" :class="[prefixCls + '-loading']">{{ localeLoadingText }}</ul>
        </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
import Icon from '../Icon/Icon.vue';
import Drop from '../Select/Dropdown.vue';
import Tree from '../Tree/Tree.vue'
import clickoutside from '../../directives/clickoutside';
import TransferDom from '../../directives/transfer-dom';
import { oneOf, findComponentChildren,getScrollBarSize, getStyle,hasClass,typeOf,scrollAnimate,deepCopy} from '../../util/tools';
import Emitter from '../../mixins/emitter';
import Locale from '../../mixins/locale';
const prefixCls = 'h-selectTree';
export default{
  name:"SelectTree",
  mixins:[Emitter,Locale],
  directives:{clickoutside,TransferDom},
  components:{Icon,Drop,Tree},
  props:{
    value: {
      type: [String, Number, Array],
      default: ''
    },
    firstValue:{
      type: [String, Number, Array],
      default: ''
    },
    placeholder: {
      type: String
    },
    searchHolder:{
      type:String
    },
    clearable: {
      type: Boolean,
      default: true
    },
    data:{
      type: Array,
      default() {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    //父子组件关联
    checkStrictly:{
      type:Boolean,
      default:false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    showIndeterminate:{
      type:Boolean,
      default: true
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default']);
      },
      default: 'default'
    },
    placement: {
      validator(value) {
        return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
      },
      default: 'bottom'
    },
    filterable: {
      type: Boolean,
      default: false
    },
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
      default:true,
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
    formatValue:{//设置v-model返回的值
      type:String,
      default:'title'
    },
    isString:{//多选专用，v-model输入输出值以逗号隔开
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
      default:false,
    },
    expanLevel:{
      type:[Number,String],
      default:2,
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
    onlyChild:{
      type:Boolean,
      default:false,
    },
    checkIndeter:{//显示半选中状态，并选中
      type:Boolean,
      default:false
    },
    isAlwaysSelect: {
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      prefixCls: prefixCls,
      visible: false,
      selectedSingle: '',
      selectedMultiple: [],
      query:'',
      inputLength: 20,
      notFound: false,
      model: this.value,
      currentLabel: this.label,
      scrollBarWidth:getScrollBarSize(),
      isFocus: false,
      isFirst: false,
      baseDate:[],
      tabIndex:0,
      lastquery: '',
      lastDataCopy: [],
      fPlacement:this.placement,
      viewValue:null,
    }
  },
  computed:{
    listStyle(){
      let style = {};
      style.paddingTop=this.showBottom?'30px':'0';
      return style;
    },
    searchClass(){
      return `${prefixCls}-search`
    },
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-readonly`]: this.readonly,
          [`${prefixCls}-editable`]: this.editable,
          [`${prefixCls}-multiple`]: this.showCheckbox,
          [`${prefixCls}-single`]: !this.showCheckbox,
          [`${prefixCls}-show-clear`]: this.showCloseIcon,
          [`${prefixCls}-${this.size}`]: !!this.size
        }
      ];
    },
    dropdownCls() {
      return {
        ['h-select-dropdown-transfer']: this.transfer,
        // [prefixCls + '-multiple']: this.multiple && this.transfer,
        ['h-auto-complete']: this.autoComplete,
      };
    },
    showPlaceholder() {
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
    showCloseIcon() {
      return this.clearable && !this.showPlaceholder;
    },
    inputStyle() {
      let style = {};
      if (this.multiple) {
        if (this.showPlaceholder) {
          style.width = '100%';
        } else {
          style.width = `${this.inputLength}px`;
        }
      }
      return style;
    },
    localePlaceholder() {
      if (this.placeholder === undefined) {
        return this.t('i.select.placeholder');
      } else {
        return this.placeholder;
      }
    },
    localeSearchHolder() {
      if (this.searchHolder === undefined) {
        return this.t('i.select.searchHolder');
      } else {
        return this.searchHolder;
      }
    },
    localeNotFoundText() {
      if (this.notFoundText === undefined) {
        return this.t('i.select.noMatch');
      } else {
        return this.notFoundText;
      }
    },
    localeLoadingText() {
      if (this.loadingText === undefined) {
        return this.t('i.select.loading');
      } else {
        return this.loadingText;
      }
    },
    dropVisible() {
      let status = true;
      const options = this.baseDate || [];
      if (!this.loading && this.remote && this.query === '' && !options.length) status = false;
      return this.visible && status;
    },
    transitionName() {
      const bottomPlaced = this.fPlacement.match(/^bottom/);
      return bottomPlaced ? 'slide-up' : 'slide-down';
        // return this.placement === 'bottom' ? 'slide-up' : 'slide-down';
    },
    multiplestyle() {
      return {
        width: `${this.width}px`,
      };
    }
  },
  methods:{
    handleclick(e){
      e.stopPropagation();
    },
    keyup(event){
      if (this.disabled || this.readonly||!this.editable) {
        return false;
      }
      if (event.keyCode == 9) {//tab
        this.toggleMenu();
      }
    },
    keydown(event){
      if (event.keyCode == 9) {
        this.hideMenu();
      }
    },
    offsetArrow(){
      if (!this.showCheckbox) return;
      if (navigator.userAgent.indexOf('Firefox') >= 0) return;//firefox scrollBar bug
      let el = this.$refs.reference;
      if (el.scrollHeight>el.clientHeight) {
        if (this.$refs.close) this.$refs.close.$el.style.right="22px";
        if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right="22px";
      }else{
        if (this.$refs.close) this.$refs.close.$el.style.right="8px";
        if (this.$refs.arrowb) this.$refs.arrowb.$el.style.right="8px";
      }
    },
    toggleMenu() {
      if (this.disabled || this.readonly ||!this.editable) {
        return false;
      }
      this.visible = !this.visible;
      this.isFocus = true
    },
    hideMenu() {
      this.visible = false;
      // this.focusIndex = 0;
      this.broadcast('Option', 'on-select-close');
    },
    handleClose() {
      this.hideMenu();
      if (this.isFocus) {
        // 点击其他地方时触发blur校验
        if (this.showCheckbox){
          // 多选返回数组
          this.dispatch('FormItem', 'on-form-blur', this.selectedMultiple)
        } else {
          // 单选返回字符串
          this.dispatch('FormItem', 'on-form-blur', this.selectedSingle)
        }
        this.isFocus = false
      }
    },
    selectChange(val){
      let strModel = this.formatValue;
      if (this.visible) {
        this.$emit('on-select-change', val);
      }
      if (!this.showCheckbox) {
        this.selectedSingle=val.length!=0?val[0].title:'';
        if (this.filterable&&!this.showBottom) {
          this.query = this.selectedSingle;
        }
        if(!this.filterable){
          this.query ='';
        }
        // this.query = this.filterable?this.selectedSingle:'';
        this.model = val.length!=0?val[0][strModel]:'';
        this.hideMenu();
        this.findQuery(this.baseDate,'');
      }
    },
    checkChange(val){
      let strModel = this.formatValue;
      this.lastquery = this.query
      if (this.filterable && !this.showBottom) {
        this.query='';
      }
      let arr=[];
      let arrModel = [];
      val.forEach(item=>{
        if (this.onlyChild && !this.checkStrictly) {
          if (!item.children || item.children.length==0) {
            arr.push(item.title);
            arrModel.push(item[strModel]);
          }
        }else {
          arr.push(item.title);
          arrModel.push(item[strModel]);
        }
      });
      if(this.checkIndeter && !this.checkStrictly){
        let interArr = this.$refs.tree.getIndeterminateNodes();
        interArr.forEach((ite)=>{
          arr.push(ite.title);
          arrModel.push(ite[strModel]);
        })
      }
      this.model=arrModel;
      this.selectedMultiple=arr;
      this.$emit('on-check-change', val);
    },
    toggleExpand(val){
      this.$emit('on-toggle-expand', val);
    },
    clearSingleSelect() {
      let _this = this;
      if (this.disabled || this.readonly || !this.editable) return false;
      if (this.showCloseIcon) {
        resetDate(this.baseDate);
        if (!this.showCheckbox) {
          this.model='';
        }else{
          this.model=[];
          this.selectedMultiple=[];
        }
        if (this.filterable&& !this.showBottom) {
          this.query = '';
          this.findQuery(this.baseDate,'');
        }
        if (this.remote) {
          this.lastquery = '';
        }
        this.isFocus = true
      }
      function resetDate(data) {
        data.forEach((col,i)=>{
          if (!!col.checked) {
            _this.$set(col,'checked',false)
          }
          if(!!col.selected){
            _this.$set(col,'selected',false)
          }
          if(!!col.indeterminate){
            _this.$set(col,'indeterminate',false)
          }
          if (col.children && col.children.length>0) {
            resetDate(col.children);
          }
        });
      }
    },
    handleFocus(){
      this.$emit('on-focus')
    },
    handleBlur() {
      this.$emit('on-blur')
    },
    handleInputDown() {
      var val = this.query;
      this.lastquery = this.query
      if (this.remote && this.remoteMethod) {
        this.visible = val == '' ? false : true
      } else {
        this.findQuery(this.baseDate,val);
      }
    },
    findQuery(data,val,parentKey){
      var that = this;
      data.forEach((col,i)=>{
        that.$set(col, 'filterable', false);
        if (val!=''&&!!col.title&& col.title.indexOf(val)!=-1) {
          that.$set(col, 'filterable', true);
          that.expandParent(that.baseDate,parentKey);
        }
        if (col.children && col.children.length>0) {
          this.findQuery(col.children,val,col.nodeKey);
        }
      });
    },
    expandParent(data,nodekey,parentKey){
      var that = this;
      data.forEach((col,i)=>{
        if (col.nodeKey==nodekey) {
          that.$set(col, 'expand', true);
          if(parentKey=="undefined") return;
          that.expandParent(that.baseDate,parentKey);
        }
        if (col.children && col.children.length>0) {
          that.expandParent(col.children,nodekey,col.nodeKey);
        }
      })
    },
    handleInputDelete() {
      if (this.multiple && this.model.length && this.query === '') {
        this.removeTag(this.model.length - 1);
      }
    },
    handleKeydown(e) {
      if (this.visible) {
        const keyCode = e.keyCode;
        // Esc slide-up
        if (keyCode === 27) {
          e.preventDefault();
          this.hideMenu();
        }
      }
    },
    strtoArr(val){
      if (this.showCheckbox && this.isString) {
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
      if (this.showCheckbox && this.isString && typeOf(val) == 'array') {
        if (val.length == 0) {
          return '';
        }else{
          return val.join(',');
        }
      }else{
        return val;
      }
    },
    setInit(data,value){
      let _this = this;
      function findDown(tdata,curValue){
        tdata.forEach((item)=>{
          ['expand','disabled','disableCheckbox','selected','checked'].forEach(col=>{
            if(item[col]&&item[col]=='false'){
              item[col] =false;
            }
            if(item[col]&&item[col]=='true'){
              item[col] =true;
            }
          });
          if ((typeOf(curValue) == 'string'||typeOf(curValue) == 'number')&&item[_this.formatValue] == curValue) {
            _this.$set(item,'selected',true);
          }else if(typeOf(curValue) == 'array'&&curValue.indexOf(item[_this.formatValue])!=-1){
            _this.$set(item,'checked',true);
          }else{
            _this.$set(item,'selected',false);
            _this.$set(item,'checked',false);
          }
          if (item.children&&item.children.length>0) {
            findDown(item.children,curValue);
          }
        });
      }
      findDown(data,value);
      this.$nextTick(()=>{
        let tree = this.$refs.tree;
        if (typeOf(value) == 'string'||typeOf(value) == 'number') {
          this.selectChange(tree.getSelectedNodes());
        }else{
          this.checkChange(tree.getCheckedNodes());
        }
      });
    },
    expandLevels(data){
      let index = 0;
      let _this = this;
      function findDown(tdata){
        index =index+1;
        tdata.forEach((item)=>{
          // _this.$set(item,'expand',true);
          item.expand = true;
          if (item.children&&item.children.length>0 && index<_this.expanLevel) {
            findDown(item.children);
          }
        });
      }
      if (index<_this.expanLevel) {
        findDown(data);
      }
      return data;
    },
    searchStyle(){
      if (this.filterable && this.showBottom) {
        let width =this.dropWidth>0?this.dropWidth:parseInt(getStyle(this.$el, 'width'));
        width = width-getScrollBarSize()+'px';
        this.$refs.search.style.width = width;
      }
    },
    focus(){
      if (this.disabled || this.readonly) return;
      this.$nextTick(()=>{
        this.isFocus = true;
        this.visible = true;
        if (this.filterable) {
          this.$refs.input.focus();
        }else{
          this.$refs.reference.focus();
        }
      })
    },
    blur(){
      this.isFocus = false;
      this.visible = false;
      if (this.filterable) {
        this.$refs.input.blur();
      }else{
        this.$refs.reference.blur();
      }
    },
    select() {
      if (this.filterable) {
        this.$refs.input.select()
      }
    }
  },
  watch:{
    firstValue:{
      immediate:true,
      handler(val){
        if (val && val != ' ' && val != []) {
          this.$nextTick(()=>{
            if(this.baseDate.length>0){
              this.setInit(this.baseDate,val);
            }
          });
        }
      }
    },
    value(val){
      this.model = this.strtoArr(val);
    },
    query(val) {
      let query = val || this.lastquery
      //  query改变时触发remote，兼容check选中后（lastquery有值）重复触发
      if (this.remote && this.remoteMethod && (!this.model || this.model.length == 0)) {
        this.remoteMethod(query)
      }
      this.$nextTick(()=>{
        let firstItem = this.$refs.tree.$el.querySelectorAll('.h-tree-title-filterable')[0];
        if (firstItem && this.dropVisible) {
          let top = firstItem.offsetTop;
          if (this.showBottom) {
            top = top -30;
          }
          this.$refs.list.scrollTop = top;
          // scrollAnimate(this.$refs.list,this.$refs.list.scrollTop,top)
        }else{
          this.$refs.list.scrollTop = 0;
        }
      });
    },
    model() {
      let backModel = this.arrtoStr(this.model);
      // this.$emit('input', this.model);
      this.$emit('input', backModel);
      // 初次会执行
      if (this.isFirst) {
        this.dispatch('FormItem', 'on-form-change', this.model);
      }
      if (!this.model || this.model.length == 0) {
        this.$nextTick(()=>{
          this.setInit(this.baseDate,'');
        });
      }
      this.isFirst = true
    },
    selectedMultiple(val){
      this.viewValue = val
      this.$nextTick(()=>{
        this.offsetArrow();
      })
    },
    visible(val){
      if (val) {
        this.broadcast('Drop', 'on-update-popper');
        // remote下，query设值时会自动触发监听搜索，若query无值且model存在时，下拉搜索用lastDataCopy
        if (this.remote && this.query == '') this.baseDate = this.lastquery != '' ?  this.lastDataCopy : [];
        setTimeout(() => {
          this.dispatch('Msgbox', 'on-esc-real-close', false);
        }, 0);
      } else {
        if (this.filterable) {
          if (this.showBottom) {
            this.query = '';
          }
          if (this.remote) {
            this.query = ''
            // model为空是清空lastquery(model有值时关闭后无法打开)
            if (!this.model || this.model.length == 0) {
              this.lastquery = ''
            } else {
              // model有值时保存当前数组
              this.lastDataCopy = deepCopy(this.baseDate)
            }
          }
        }
        setTimeout(() => {
          this.dispatch('Msgbox', 'on-esc-real-close', true);
        }, 0);
        // this.broadcast('Drop', 'on-destroy-popper');
      }
    },
    data : {
      deep: true,
      handler: function(cur) {
        if (cur&&cur.length!=0) {
          this.baseDate = this.expandLevels(deepCopy(cur));
        }else{
          this.baseDate =deepCopy(cur);
        }
        if (this.model===this.firstValue) {
          this.$nextTick(()=>{
            this.setInit(this.baseDate,this.firstValue);
          });
        }
      }
    },
    placement(val){
      this.fPlacement = val
    },
    selectedSingle(val){
      this.viewValue = val
    },
  },
  mounted(){
    if (this.data &&this.data.length!=0) {
      this.baseDate = this.expandLevels(deepCopy(this.data));
    }
    this.$nextTick(()=>{
      let tree = this.$refs.tree;
      if (!!this.showCheckbox) {
        this.checkChange(tree.getCheckedNodes());
      }else{
        this.selectChange(tree.getSelectedNodes());
      }
      this.offsetArrow();
      this.searchStyle();
    });
    document.addEventListener('keydown', this.handleKeydown);
    if (this.disabled) {
      this.tabIndex = -1;
    }

  },
  beforeDestroy(){
    document.removeEventListener('keydown', this.handleKeydown);
    this.broadcast('Drop', 'on-destroy-popper');
  }
}
</script>
