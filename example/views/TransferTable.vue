<template>
  <div>
    <p>概述：双栏穿梭选择框，常用于将多个项目从一边移动到另一边</p>
    <p>
      <i>:data：总体数据，数组，每项为一个对象，且必须含有 key 值，组件基于此做索引。</i>
      <br>
      <i>:target-keys：目标列索引集合，数组，每项为数据的 key 值，Transfer 会将含有这些 key 值的数据筛选到右边。</i>
      <br>
      <i>:render-format：每行数据显示的格式函数，默认优先显示 label 值，没有时显示 key 值，可以自己组合出需要的数据格式。</i>
      <br>
      <i>@on-change：当点击转移按钮时，组件本身并不会转移数据，而是触发事件，由用户来操作数据。</i>
    </p>
    <Button @on-click="clear">清除搜索框</Button>
    <h2>noEdit</h2>
    <h-transfer-table
      ref="transfer"
      filterable
      :filterMethod="filter"
      :lColumns="columns"
      :rColumns="columns"
      :lData="data0"
      :rData="data1"
      :showTitle="false"
      :beforeMove="sureMove"
      not-data-text="123"
      noEdit
      @on-change="handleChange1"
    ></h-transfer-table>
    <h2>基本用法</h2>
    <h-transfer-table
      :lColumns="columns1"
      :rColumns="columns1"
      :lData="data0"
      :rData="data1"
      :showTitle="false"
      not-data-text="123"
      showEditInput
      @on-change="handleChange1"
    ></h-transfer-table>
    <h2>搜索</h2>
    <p>通过设置属性 filterable 可以进行搜索，可以自定义搜索函数</p>
    <h-transfer-table
      filterable
      :filterMethod="filter"
      :lColumns="columns2"
      :rColumns="columns2"
      :lData="data2"
      :rData="data2"
      showEditInput
      @on-change="handleChange2"
    >12342412
      <br>12342412
      <br>12342412
      <br>
    </h-transfer-table>

    <h2>高级用法</h2>
    <p>穿梭框高级用法，可以自定义两列的宽高、操作文案，以及底部自定义操作，更多配置见 API。</p>
    <h-transfer-table
      :lColumns="columns3"
      :rColumns="columns3"
      :lData="data3"
      :rData="data3"
      :operations="['向左移动','向右移动']"
      :option="options1"
      :treeOption="treeOption"
      @on-change="handleChange3"
    >
      <div :style="{float: 'right', margin: '5px'}">
        <h-button type="ghost" size="small" @click="reloadMockData">刷新</h-button>
      </div>
    </h-transfer-table>
  </div>
</template>
<script>
var tData = [
  {
    name: '王小明',
    age: 18,
    address: '北京市朝阳区芍药居',
    money: '120.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
    // _highlight: true//默认选择当前项
  },
  {
    name: '张小刚',
    age: 25,
    address: '北京市海淀区西二旗',
    money: '130.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
  },
  {
    name: '李小红',
    age: 30,
    address: '上海市浦东新区世纪大道',
    money: '140.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
  },
  {
    name: '周小伟',
    age: 26,
    address: '深圳市南山区深南大道',
    money: '150.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
  },
  {
    name: '王小明',
    age: 18,
    address: '北京市朝阳区芍药居',
    money: '120.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
    // _highlight: true//默认选择当前项
  },
  {
    name: '张小刚',
    age: 25,
    address: '北京市海淀区西二旗',
    money: '130.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
  },
  {
    name: '李小红',
    age: 30,
    address: '上海市浦东新区世纪大道',
    money: '140.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
  },
  {
    name: '周小伟',
    age: 26,
    address: '深圳市南山区深南大道',
    money: '150.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating: '2018-03-07',
    timing: '16:00:00',
    tree: 'leaf1'
  }
];
var column = [
  {
    type: 'selection',
    width: 50,
  },
  {
    type: 'text',
    title: '姓名',
    key: 'name',
    width: 200,
    rule: { required: true, message: '姓名不能为空' },
    typeWidth: 150,
    render: (h, params) => {
      return h('div', [
        h('h-button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'click': () => {
              // this.show(params.index)
            }
          }
        }, '查看')
      ]);
    }
  },
  {
    width: 80,
    render: (h, params) => {
      return h('div', [
        h('h-button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'click': () => {
              this.show(params.index)
            }
          }
        }, '查看')
      ]);
    }
  },
  {
    type: 'number',
    title: '年龄',
    width: 200,
    key: 'age',
    hiddenCol: false,
    rule: { required: true, message: '年龄不能为空' },
  },
  {
    type: 'textArea',
    rows: 2,
    width: 200,
    title: '地址',
    key: 'address',
    rule: { required: true, message: '地址不能为空' },
  },
  {
    type: 'money',
    title: '金额',
    width: 200,
    integerNum: 14,
    suffixNum: 3,
    // suffixNum: 2,
    bigTips: true,
    key: 'money',
    rule: { required: true, message: '金额不能为空' },
  },
  {
    type: 'card',
    title: '卡号',
    key: 'cardId',
    rule: { required: true, message: '卡号不能为空' },
  },
  {
    type: 'select',
    title: '地区',
    width: 200,
    key: 'city',
    multiple: false,
    transfer: true,
    rule: { required: true, message: '请选择城市', trigger: 'blur,change' }
  },
  {
    type: 'date',
    title: '日期',
    width: 200,
    key: 'dating',
    dateType: 'date',
    format: 'yyyy-MM-dd',
    rule: { required: true, message: '请选择日期', trigger: 'blur,change' }
  },
  {
    type: 'time',
    title: '时间',
    width: 200,
    key: 'timing',
    dateType: 'time',
    format: 'HH:mm:ss',
    steps: [2, 2, 2],
    rule: { required: true, message: '请选择时间', trigger: 'blur,change' }
  },
  {
    type: 'selectTree',
    title: '下拉树',
    width: 200,
    key: 'tree',
    treeData: [{
      expand: true,
      title: 'parent 1',
      children: [{
        title: 'parent 1-0',
        expand: true,
        children: [{
          title: 'leaf1',
          disableCheckbox: true
        }, {
          title: 'leaf2',
        }]
      }, {
        title: 'parent 1-1',
        expand: true,
        checked: true,
        children: [{
          title: 'leaf3',
        }]
      }]
    }],
    showCheckbox: false,
    checkStrictly: false,
    rule: { required: true, message: '请选择子节点', trigger: 'blur,change' }
  }
]
var columns = [
  {
    type: 'selection',
    width: 50,
  },
  {
    type: 'text',
    title: '姓名',
    key: 'name'
  },
  {
    width: 80,
  },
  {
    title: '年龄',
    width: 200,
    key: 'age',

  },
  {
    width: 200,
    title: '地址',
    key: 'address',
  },
  {
    title: '金额',
    width: 200,
  },
  {
    title: '卡号',
    key: 'cardId',
  },
  {
    title: '地区',
    width: 200,
    key: 'city',
  },
  {
    title: '日期',
    width: 200,
    key: 'dating',
  },
  {
    title: '时间',
    width: 200,
    key: 'timing',
  },
  {
    title: '下拉树',
    width: 200,
    key: 'tree',
  }
]
export default {
  data() {
    return {
      columns: columns,
      columns1: column,
      columns2: column,
      columns3: column,
      data0: [],
      data1: tData,
      data2: tData,
      data3: tData,
      options1: [],
      treeOption: [],
    }
  },
  methods: {
    clear(){
      this.$refs.transfer.clearSearch('left')
      this.$refs.transfer.clearSearch('right')
    },
    sureMove(keys,dir,isAll){
      if(keys.length>1){
        return false
      }
      return true
    },
    filter(data, query) {
      return data.name.indexOf(query) > -1;
    },
    getMockData() {
      let mockData = [];
      for (let i = 1; i <= 20; i++) {
        mockData.push({
          key: i.toString(),
          label: '内容' + i,
          description: '内容' + i + '的描述信息',
          disabled: Math.random() * 3 < 1
        });
      }
      return mockData;
    },
    getTargetKeys() {
      return this.getMockData()
        .filter(() => Math.random() * 2 > 1)//arr.filter()实质删选返回值为true的项
        .map(item => item.key);
    },
    render1(item) {
      return item.label;
      //自定义渲染数据列
      // return item.label + ' - ' + item.description;
    },
    handleChange1(newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys);
      console.log(direction);
      console.log(moveKeys);
      this.targetKeys1 = newTargetKeys;
    },
    handleChange2(newTargetKeys, direction, moveKeys) {
      this.targetKeys2 = newTargetKeys;
      console.log(newTargetKeys);
      console.log(direction);
      console.log(moveKeys);
    },
    filterMethod(data, query) {
      return data.label.indexOf(query) > -1;
    },
    handleChange3(newTargetKeys) {
      this.targetKeys3 = newTargetKeys;
    },
    render3(item) {
      return item.label + ' - ' + item.description;
    },
    reloadMockData() {
      this.data3 = this.getMockData();
      this.targetKeys3 = this.getTargetKeys();
    }

  },
  mounted() {
    this.options1[7] = [{ value: 'Alabama', label: 'Alabama' }, { value: 'beijing', label: '北京' }, { value: 'Delaware', label: 'Delaware' }];
    this.treeOption[10] = [{
      expand: true,
      title: 'parent 1',
      children: [{
        title: 'parent 1-0',
        expand: true,
        children: [{
          title: 'leaf1',
          disableCheckbox: true
        }, {
          title: 'leaf2',
        }]
      }, {
        title: 'parent 1-1',
        expand: true,
        checked: true,
        children: [{
          title: 'leaf3',
        }]
      }]
    }]
  }
}
</script>