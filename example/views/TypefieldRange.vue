<template>
  <div id="input" class="wrapper">
    <h1>TypeFieldRange 组件</h1>
    <h1>金额范围</h1>
    <h2>基本用法</h2>
    <h-typefield-range v-model="val" :integerNum="23" @on-blur="bChange" ref="test"></h-typefield-range>
    {{val}}
    <Button @on-click="testClick(true)">获取焦点</Button>
    <Button @on-click="testClick(false)">失去焦点</Button>
    <br><br>
    <h-typefield-range v-model="val1"></h-typefield-range>
    {{val1}}
  </div>
</template>

<script>

export default {
  name: 'inputs',
  data() {
    return {
      val:[],
      val1:['12','13'],
    }
  },
  methods: {
    testClick(val){
      if (val) {
        this.$refs.test.focus();
      }else{
        this.$refs.test.blur();
      }
    },
    getValue(){
      console.log(this.value)
    },
    bChange(){
      console.log('输入框已失去焦点');
    },
    kChange(val){
      console.log('按钮事件已触发'+val);
    },
    s(){
      console.log(this.value);
    },
    foc() {
      this
    }
  }
}
</script>
