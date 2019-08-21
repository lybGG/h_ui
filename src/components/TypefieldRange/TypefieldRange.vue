<template>
  <div :class="wrapClasss" ref="wrap">
    <div :class="`${prefixCls}-inner`">
      <Typefield
        ref="lTypefield"
        v-model="minValue"
        :placeholder="rLocalPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :editable="editable"
        :hidden="hidden"
        :isround="isround"
        :integerNum="integerNum"
        :suffixNum="suffixNum"
        :divided="divided"
        :immeDivided="immeDivided"
        :notFillin="notFillin"
        :notFormat="notFormat"
        :setNull="setNull"
        @on-blur="rangeBlur"
      ></Typefield>
    </div>
    <div :class="`${prefixCls}-inner split`">{{this.split}}</div>
    <div :class="`${prefixCls}-inner`">
      <Typefield
        v-model="maxValue"
        ref="rTypefield"
        :placeholder="lLocalPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :editable="editable"
        :hidden="hidden"
        :isround="isround"
        :integerNum="integerNum"
        :suffixNum="suffixNum"
        :divided="divided"
        :immeDivided="immeDivided"
        :notFillin="notFillin"
        :notFormat="notFormat"
        :setNull="setNull"
        @on-blur="rangeBlur"
      ></Typefield>
    </div>
    <div :class="[prefixCls + '-content']">
        <!-- <slot></slot> -->
        <transition name="fade">
            <div class="verify-tip verify-bottom"  v-if="isShowError">
                <div class="verify-tip-arrow"></div>
                <div class="verify-tip-inner">{{tipMessage}}</div>
            </div>
        </transition>
    </div>
  </div>
</template>
<script>
import {oneOf,formatnumber} from '../../util/tools'
import Emitter from '../../mixins/emitter';
import Locale from '../../mixins/locale';
import Typefield from '../Typefield/Typefield.vue'
const prefixCls = 'h-typefield-range';
export default {
  name: 'TypefieldRange',
  data(){
    return {
      prefixCls:prefixCls,
      minValue:'',
      maxValue:'',
      isShowError:false,
    }
  },
  mixins: [ Emitter,Locale ],
  components:{Typefield},
  props: {
    value: {
      type:Array,
      default:()=>{
        return [];
      },
    },
    disabled: {
      type:Boolean,
      default:false
    },
    readonly: {
      type:Boolean,
      default:false
    },
    editable: {
      type:Boolean,
      default:true
    },
    rPlaceholder: String,
    lPlaceholder: String,
    hidden: Boolean,
    isround:Boolean,
    integerNum: {
      type: [Number,String],
      default: 13
    },
    suffixNum:{
      type: [Number,String],
      default: 2
    },
    errorTip:{//错误提示
      type:Boolean,
      default:true,
    },
    tipMessage:{
      type:String,
      default:"最高值不能低于最低值"
    },
    divided: {//是否添加分隔符
      type: Boolean,
      default: false,
    },
    immeDivided: {//是否添加分隔符
      type: Boolean,
      default: true,
    },
    algin:{//金额组件内部显示
      type:String,
      default:'left',
    },
    notFillin:{//格式化金额时，当小数点少于指定位数是否需要补0
      type: Boolean,
      default: false,
    },
    notFormat:{//不对数据进行格式化,输入什么是什么
      type: Boolean,
      default: false,
    },
    setNull:{
      type: Boolean,//设置空值为0
      default: false,
    },
    split:{
      type: String,
      default:'--'
    }
  },
  computed: {
    wrapClasss(){
      return [
        `${prefixCls} clearfix`,
        {
          [`${prefixCls}-error`]:this.isShowError
        }
      ]
    },
    rLocalPlaceholder(){
      if (this.rPlaceholder === undefined) {
          return this.t('i.typefieldRange.rPlaceholder');
      } else {
          return this.rPlaceholder;
      }
    },
    lLocalPlaceholder(){
      if (this.lPlaceholder === undefined) {
          return this.t('i.typefieldRange.lPlaceholder');
      } else {
          return thislrPlaceholder;
      }
    },
  },
  watch: {
    value(val){
      this.initValue(val);
    },
  },
  mounted () {
    this.initValue(this.value);
  },
  methods:{
    initValue(arr){
      this.minValue = arr[0]||'';
      this.maxValue = arr[1]||'';
    },
    getMax(min,max){
      let status = false;
      if(max.length>min.length){
        status = true;
      }else if(max.length==min.length){
        if(Number(max.slice(0,8))>Number(min.slice(0,8))){
          status = true;
        }else if(Number(max.slice(0,8))==Number(min.slice(0,8))){
          if(Number(max.slice(8))>=Number(min.slice(8))){
            status = true;
          }
        }
      }
      return status;
    },
    getStatus(){
      let status = false;
      if(this.integerNum>=16){
        let minfirstChar = this.minValue.substring(0,1)||'';
        let maxfirstChar = this.maxValue.substring(0,1)||'';
        let minNum = this.minValue.replace(/-/g,'').replace(/,/,'');
        let maxNum = this.maxValue.replace(/-/g,'').replace(/,/,'');
        let maxIsmax = this.getMax(minNum,maxNum);
        if(maxfirstChar=='-'&& minfirstChar!='-') status = true;
        if(maxfirstChar=='-'&& minfirstChar=='-'&&maxIsmax)status = true;
        if(maxfirstChar!='-'&& minfirstChar!='-'&&!maxIsmax)status = true;
      }else{
        status = Number(this.maxValue)<Number(this.minValue)?true:false;
      }
      return status;
    },
    rangeBlur(){
      this.$nextTick(()=>{
        if(this.$refs.rTypefield.havefocused) return false;
        let status = this.getStatus();
        this.isShowError = this.errorTip&&status;
        this.$emit('input',[this.minValue,this.maxValue]);
        this.$emit('on-blur')
        let curValue = [];
        if(this.minValue!=''&&this.maxValue!=""){
          curValue = [this.minValue,this.maxValue];
        }
        this.dispatch('FormItem', 'on-form-blur', curValue);
      });
    },
    focus(){
      this.$nextTick(()=>{
        this.$refs.lTypefield.focus();
      })
    },
    blur(){
      this.$refs.rTypefield.blur();
      this.$refs.lTypefield.blur();
    }
  }
}
</script>
