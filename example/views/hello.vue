<template>
<div>
  <Button @on-click="changeShow">打开弹框</Button>
  <Button @on-click="changeData">改变数值</Button>
  <h-msg-box v-model="show" escClose>
    <h-form ref="formValidate" :model="formValidate" cols="2" :label-width="80">
      <h-form-item label="input" prop="name">
          <h-input v-model="formValidate.name" placeholder="请输入姓名" class="curItemClass" ></h-input>
      </h-form-item>
      <h-form-item label="typefield" prop="mail">
          <h-typefield v-model="formValidate.mail" placeholder="请输入邮箱" class="curItemClass" ></h-typefield >
      </h-form-item>
      <h-form-item label="select" prop="city1">
          <h-select v-model="formValidate.city1"  multiple placeholder="请选择所在地" class="curItemClass" >
              <h-option value="beijing">北京市</h-option>
              <h-option value="shanghai">上海市</h-option>
              <h-option value="shenzhen">深圳市</h-option>
          </h-select>
      </h-form-item>
      <h-form-item prop="date" label="data">
        <h-date-picker type="date" placeholder="选择日期" v-model="formValidate.date" class="curItemClass" iconVisible></h-date-picker>
      </h-form-item>
      <h-form-item label="singleSelect" prop="city" required>
        <h-single-select v-model="formValidate.city" placeholder="请选择所在地" class="curItemClass" widthAdaption>
          <h-select-block :data="bigData" :showCol="showCol" :colWidth="colWidth"></h-select-block>
        </h-single-select>
      </h-form-item>
      <h-form-item label="valueRemote1" prop="valueRemote1" required>
        <h-multi-select v-model="formValidate.valueRemote1" :isString="isstring" widthAdaption class="curItemClass" specialIndex specialVal="value1" accuFilter newSearchModel>
          <h-multi-block :data="remotebigData"></h-multi-block>
        </h-multi-select>
      </h-form-item>
      <h-form-item prop="time" label="time">
        <h-time-picker type="time" placeholder="选择时间" v-model="formValidate.time" class="curItemClass" ></h-time-picker>
      </h-form-item>
      <h-form-item label="radio" prop="gender">
        <h-radio-group v-model="formValidate.gender">
          <h-radio label="male" class="curItemClass" >男</h-radio>
          <h-radio label="female" class="curItemClass" >女</h-radio>
        </h-radio-group>
      </h-form-item>
      <h-form-item label="checkbox" prop="interest">
          <h-checkbox-group v-model="formValidate.interest">
              <h-checkbox label="吃饭" class="curItemClass" ></h-checkbox>
              <h-checkbox label="睡觉" class="curItemClass" ></h-checkbox>
              <h-checkbox label="跑步" class="curItemClass" ></h-checkbox>
              <h-checkbox label="看电影" class="curItemClass" ></h-checkbox>
          </h-checkbox-group>
      </h-form-item>
      <h-form-item>
          <h-button type="primary" canFocus @click="handleSubmit('formValidate')" class="curItemClass" >提交</h-button>
          <h-button type="ghost"  canFocus  @click="handleReset('formValidate')" style="margin-left: 8px" class="curItemClass" >重置</h-button>
          <h-button @click="focusFirst">焦点定位到第一项</h-button>
          <h-button @click="clear">清空当前选项</h-button>
      </h-form-item>
    </h-form>
  </h-msg-box>
</div>
</template>
<script>
import { enterHandler1 } from "../../src/util/tools.js";
let bigData = [];
bigData.push({label:'全选',value:'-1'})
for(let i=0;i<2000;i++){
  let obj={};
  obj.value="value"+i;
  obj.label=i==1?"label"+i+'000000000000000000000000000000000000000000000000000':"label"+i;
  bigData.push(obj);
}
export default {
  data() {
    return {
      show:false,
      value:'value0',
      showCol:['label1'],
      formValidate: {
        name: "",
        mail: "",
        city1:'',
        city: '',
        gender: "",
        interest: [],
        date: "",
        time: "",
        desc: "",
        valueRemote1:[],
      },
      bigData: [
        { value: "value1", label: "label1",label1: "多列11111111111111111111111111111111111111111111111111111111"},
        { value: "value2", label: "label2",label1: "多列2" },
        { value: "value3", label: "label3",label1: "多列3" },
        { value: "value4", label: "label4",label1: "多列4" },
        { value: "value5", label: "label5",label1: "多列5" },
        { value: "value6", label: "label6",label1: "多列6" },
        { value: "value7", label: "label7",label1: "多列7" },
        { value: "value8", label: "label8",label1: "多列8" },
        { value: "value9", label: "label9",label1: "多列9" },
        { value: "value10", label: "label10",label1: "多列10" },
        { value: "value11", label: "label11",label1: "多列11" },
      ],
      colWidth:['200','200'],
      isstring:false,
      remotebigData:bigData,
      value111:'value0',
    }
  },
  mounted() {
     window.isO45 = false;
    document.addEventListener("keydown", event => {
      enterHandler1(this.$refs.formValidate, event);
    });
    setTimeout(()=>{
        this.formValidate.city="value11"
    },1000)
  },
  methods:{
    getFocus() {
      this.$refs.test.focus()
    },
    mounted() {
      window.isO45 = false;
      document.addEventListener("keydown", event => {
        enterHandler1(this.$refs.formValidate, event);
      });
      setTimeout(()=>{
        this.formValidate.city="value11"
      },1000)
    },
    methods:{
      getFocus() {
        this.$refs.test.focus()
      },
      blurtest(){
        console.log("lsjflsja;");
      },
      handleSubmit(){
        this.formValidate.city="value1"
      },
      changeData(){
        this.bigData = this.bigData.slice(0,2)
      },
      focusFirst(){
        this.$refs.formValidate.firstNodeFocused()
      },
      clear(){
        this.formValidate.city=''
    },
    changeShow(){
      this.show=true
    }
  }
}
}
</script>

