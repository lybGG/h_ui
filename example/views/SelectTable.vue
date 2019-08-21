<template>
<div>
  <h1>Select组件</h1>
  <p>选择器支持单选、多选、搜索，以及键盘快捷操作。</p>
  <!-- <h1>基础用法</h1>
  <p>使用v-model双向绑定数据,默认为单选</p>
  <br>
  <p>单选时，value只接受字符串和数字类型，多选时，value只接受数组类型</p>
  <h2>多选</h2>
  <Button @on-click="testClick(true)">获取焦点</Button>
  <Button @on-click="testClick(false)">失去焦点</Button> -->
<!--   <h-select-table v-model="model1" width="800" @on-change="change" dropWidth="850" :multiple="true" @on-scroll="scroll" isCheckall :isComputed="isComputed" disabled >
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" @on-selection-change="selsetChange" :highlightRow="true"></h-table-option>
  </h-select-table>
  <h-button @click="ceshi">清空</h-button> -->
  <!-- <h-select-table v-model="model1" width="800" @on-change="change" dropWidth="850" :multiple="true" @on-scroll="scroll" isCheckall :isComputed="isComputed" readonly>
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" @on-selection-change="selsetChange" :highlightRow="true"></h-table-option>
  </h-select-table> -->
 <!--  <h-select-table v-model="model1" width="800" @on-change="change" dropWidth="850" :multiple="true" @on-scroll="scroll" isCheckall :isComputed="isComputed" :editable="false">
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" @on-selection-change="selsetChange" :highlightRow="true"></h-table-option>
  </h-select-table> -->
  {{model1}}
  <h2>单选</h2>
  <!-- <h-select-table v-model="model2" @on-change="change" disabled>
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" @on-selection-change="selsetChange"></h-table-option>
  </h-select-table> -->
  {{model2}}
  <h1>筛选框在上</h1>
  <h2>模糊多列匹配</h2>
  <h-select-table v-model="model3" :filterable="true"  matchable :matchCol="matchCol" :multiple="true" isCheckall ref="test" placement="bottom-start" :dropWidth='800'>
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-selection-change="selsetChange"></h-table-option>
  </h-select-table>
  <h2>左列多列搜索</h2>
  <h-select-table v-model="model4" :filterable="true" :matchCol="matchCol"  matchWay="left" placement="top-start" @on-focus="focusEvent" @on-blur="blurEvent">
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" @on-selection-change="selsetChange" :highlightRow="true"></h-table-option>
  </h-select-table>
  <h2>全匹配多列搜索</h2>
  <h-select-table v-model="model5" :filterable="true" :matchCol="matchCol" matchWay="all" :format="format">
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-selection-change="selsetChange" :highlightRow="true"></h-table-option>
  </h-select-table>
  {{model5}}
  <h1>筛选框在下</h1>
  <h2>模糊多列匹配</h2>
  <h-select-table v-model="model6" checkboxSize="small" :filterable="true" showBottom matchable :matchCol="matchCol" :multiple="true" isCheckall searchHolder="123" checkToHead transfer>
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-selection-change="selsetChange"></h-table-option>
  </h-select-table>
  <h2>左列多列搜索</h2>
  <h-select-table v-model="model7" :filterable="true" showBottom :matchCol="matchCol" matchWay="left"
  searchHolder="123">
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-selection-change="selsetChange" :highlightRow="true" showBorder></h-table-option>
  </h-select-table>
  <h2>全匹配多列搜索</h2>
  <h-select-table v-model="model8" :filterable="true" showBottom showBorder :matchCol="matchCol" matchWay="all" :format="format">
    <h-table-option border :columns="columns1" :data="data1" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-selection-change="selsetChange" :highlightRow="true"></h-table-option>
  </h-select-table>
  {{model5}}
  <br><br><br><br><br><br><br><br><br><br><br><br>
</div>
</template>
<script>
const data = [
  {
    name: '王小明',
    age: 18,
    address: '北京市朝阳区芍药居'
    // _highlight: true//默认选择当前项
  },
  {
    name: '张小刚',
    age: 25,
    address: '北京市海淀区西二旗'
  },
  {
    name: '李小红',
    age: 30,
    address: '上海市浦东新区世纪大道'
  },
  {
    name: '周小伟',
    age: 26,
    address: '深圳市南山区深南大道'
  },
  {
    name: '王小明1',
    age: 18,
    address: '北京市朝阳区芍药居'
    // _highlight: true//默认选择当前项
  },
  {
    name: '张小刚1',
    age: 25,
    address: '北京市海淀区西二旗'
  },
  {
    name: '李小红2',
    age: 30,
    address: '上海市浦东新区世纪大道'
  },
  {
    name: '周小伟2',
    age: 26,
    address: '深圳市南山区深南大道'
  },
];
const cdata = [
  {
    name: '王小明3',
    age: 18,
    address: '北京市朝阳区芍药居'
    // _highlight: true//默认选择当前项
  },
  {
    name: '张小刚3',
    age: 25,
    address: '北京市海淀区西二旗'
  },
  {
    name: '李小红3',
    age: 30,
    address: '上海市浦东新区世纪大道'
  },
  {
    name: '周小伟3',
    age: 26,
    address: '深圳市南山区深南大道'
  },
  {
    name: '王小明4',
    age: 18,
    address: '北京市朝阳区芍药居'
    // _highlight: true//默认选择当前项
  },
  {
    name: '张小刚4',
    age: 25,
    address: '北京市海淀区西二旗'
  },
  {
    name: '李小红4',
    age: 30,
    address: '上海市浦东新区世纪大道'
  },
  {
    name: '周小伟4',
    age: 26,
    address: '深圳市南山区深南大道'
  },
];
export default {
  data () {
    return {
      matchCol:['name','age'],
      columns1: [
        {
          title: '姓名',
          key: 'name',
          ellipsis: true
        },
        {
          title: '年龄',
          key: 'age',
          hiddenCol:true
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      data1:[],
      data2: data,
      model1:['王小明_18','张小刚_25'],
      model2:'王小明_18',
      model3:[],
      model4:'',
      model5:'',
      model6:[],
      model7:'',
      model8:'',
      format:['name,age','/'],
      isComputed:false,
      canPage:true,
      index:0
    }
  },
  methods: {
    focusEvent() {
      console.log('获取焦点')
    },
    blurEvent() {
      console.log('失去焦点')
    },
    testClick(val){
      if (val) {
        this.$refs.test.focus();
      }else{
        this.$refs.test.blur();
      }
    },
    ceshi(){
      this.model1 = [];
      this.model2 = '';
    },
    change(e){
      console.log(e);
    },
    select(e){
      console.log(e);
    },
    allSelect(e){
      console.log(e);
    },
    selsetChange(e){
      console.log(e);
    },
    scroll(num){
      console.log(num);
      let _this = this;
      if (num<=1 && _this.canPage) {
          _this.canPage = false;
          setTimeout(() => {
            console.log(_this.index);
              if (_this.index==0) {
                  _this.data1=_this.data1.concat(cdata);
                  _this.canPage = true;
                  _this.index =1;
              }else{
                  this.isComputed = true;
              }
          }, 200);
      }
    }

  },
  mounted(){
    this.data1 = data;
    // this.uList=[
    //   {id:'1',name:"中国"},
    //   {id:'2',name:"美国"},
    //   {id:'3',name:"韩国"},
    //   {id:'4',name:"韩国"},
    //   {id:'5',name:"韩国"},
    //   {id:'6',name:"韩国"},
    //   {id:'7',name:"韩国"},
    //   {id:'8',name:"韩国"}
    // ];
  },
  watch:{
    data1(val){
    }
  }
}
</script>
<style>
    p{
        font-size: 18px;
    }
</style>
