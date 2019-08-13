<template>
  <div id="input" class="wrapper">
    <h1>TypeField 组件</h1>
    <h1>金额</h1>
    <h2>基本用法</h2>
    <h1>algin设置左中右</h1>
    <p>未开启四舍五入 整数位3位，小数位3为</p>
    <h-typefield  v-model="valuetest1" integerNum="3" suffixNum="3" type="money" placeholder="金额" bigTips setNull></h-typefield>
    <p>开启四舍五入</p>
    <h-typefield  v-model="valuetest2" integerNum="2" suffixNum="2" type="money" placeholder="金额" bigTips isround></h-typefield>

    <!-- {{value11}}
      <h-typefield v-model="value11" hoverTips immeDivided focusAllSelect integerNum="17" suffixNum="2" type="money" bigTips placeholder="金额"  @on-blur="s" style="width:300px" algin="left" ref="test"></h-typefield>
      <Button @on-click="testClick(true)">获取焦点</Button>
      <Button @on-click="testClick(false)">失去焦点</Button>
      {{value12}}
      <h-typefield v-model="value12" bigTips focusAllSelect integerNum="13" suffixNum="2" type="money"  @on-blur="s" style="width:300px" algin="center"></h-typefield>
      {{value13}}
      <h-typefield v-model="value13" focusAllSelect integerNum="7" suffixNum="1" type="money" placeholder="金额" bigTips @on-blur="s" style="width:300px" algin="right"></h-typefield>
    <h1>divided 和 isround设置四舍五入 整数位7位，小数位3为</h1>
    {{value0}}
      <h-typefield v-model="value0" integerNum="16" suffixNum="3" bigTips @on-blur="s" style="width:300px" isround>
        <h-select v-model="select1" slot="prepend" style="width: 80px">
          <h-option value="http">http://</h-option>
          <h-option value="https">https://</h-option>
        </h-select>
        <h-select v-model="select2" placeholder="" slot="append" style="width: 45px" :isArrow="false" :clearable="false" :tranfer="true">
          <h-option value="com">.com</h-option>
          <h-option value="org">.org</h-option>
          <h-option value="io">.io</h-option>
        </h-select>
      </h-typefield>
      {{value00}}
      <h-typefield v-model="value00" integerNum="16" suffixNum="3" bigTips @on-blur="s" immeDivided style="width:300px">
      </h-typefield>
      <h-typefield v-model="value000" integerNum="16" suffixNum="3" bigTips @on-blur="s" divided isround style="width:300px">
      </h-typefield>
    {{value}}
    <h1>notFillin设置金额时，当小数点少于指定位数是否需要补0</h1>
      <h-typefield v-model="value1" integerNum="7" suffixNum="2" placeholder="金额" bigTips @on-blur="s" style="width:300px" isround notFillin>
      </h-typefield>
      <h-typefield v-model="value2" integerNum="7" suffixNum="3" placeholder="金额" bigTips @on-blur="s" style="width:300px" >
      </h-typefield>
      <h-typefield v-model="value3" integerNum="7" suffixNum="4" placeholder="金额" bigTips @on-blur="s" style="width:300px" notFillin>
      </h-typefield>
      {{value3}}
    <h1>notFormat设置金额时，输入什么就是什么</h1>
      <h-typefield v-model="value4" integerNum="7" suffixNum="3" placeholder="金额" bigTips @on-blur="s" style="width:300px" notFormat></h-typefield>

    <h1>setNull设置空值为0.xxx</h1>
    <h-typefield v-model="value10" integerNum="2" placeholder="金额" setNull></h-typefield>
    <h-typefield integerNum="2" type="money" placeholder="金额" ></h-typefield>
    <h-typefield integerNum="2" type="money" placeholder="金额" ></h-typefield>
    <p>未开启四舍五入 整数位3位，小数位3为</p>
    <h-typefield integerNum="3" suffixNum="3" type="money" placeholder="金额" bigTips setNull></h-typefield>
    <h-typefield integerNum="3" suffixNum="2" type="money" placeholder="金额" readonly setNull></h-typefield>
    <h-typefield integerNum="3" suffixNum="1" type="money" placeholder="金额" disabled setNull></h-typefield>
    <p>开启四舍五入</p>
    <h-typefield integerNum="2" suffixNum="2" type="money" placeholder="金额" bigTips isround></h-typefield>
    <h-typefield integerNum="2" suffixNum="3" type="money" placeholder="金额" bigTips isround></h-typefield>
    <h-typefield integerNum="2" suffixNum="4" type="money" placeholder="金额" bigTips isround></h-typefield>
    <br>
    <h1>卡号</h1>
    <h2>基本用法</h2>
    {{cardNo}}
    <h-typefield v-model="cardNo" type="cardNo" maxlength="11" :cardFormat="false" placeholder="卡号" bigTips></h-typefield>
    <br>
    <h1>事件</h1>
    <h-typefield placeholder="焦点事件" @on-blur="bChange" @on-focus="fChange" @on-keyup="kChange"></h-typefield>-->
  </div>
</template>

<script>
export default {
  name: "inputs",
  data() {
    return {
      value: "",
      value10: "",
      value0: "1234",
      value00: "1234",
      value000: "1234",
      value1: "1234",
      value2: "1234",
      value3: "1234",
      value4: "1234",
      msg: "this is input component",
      select1: "",
      select2: "",
      input1: "px",
      value11: "1111111111111111111",
      value12: "",
      value13: "",
      cardNo: "",
      valuetest1:0,
      valuetest2:0
    };
  },
  methods: {
    testClick(val) {
      if (val) {
        this.$refs.test.focus();
      } else {
        this.$refs.test.blur();
      }
    },
    getValue() {
      console.log(this.value);
    },
    bChange() {
      console.log("输入框已失去焦点");
    },
    fChange() {
      console.log("输入框已获得焦点");
    },
    kChange(val) {
      console.log("按钮事件已触发" + val);
    },
    s(e) {
      console.log(e);
    }
  }
};
</script>
