<template>
  <div>
    <h2>基础</h2>
    <h3>单选</h3>
    <Button @click="addDate">增加数据</Button><Button @click="getChangeData">获取改变后的数据</Button>
    <Button @click="delDate">删除数据</Button>
    <!-- <Button @click="changeMsg">显示</Button> -->
    <!-- <h-msg-box v-model = "showMsgBox" width="1000"> -->
      <h-edit-gird ref="table" border height="600"
        :showEditInput=true
        :columns="columns1"
        :data="data2"
        :disabled-hover="true"
        :highlight-row="true"
        @on-current-change="click1"
        stripe
        :loading="loading"
        @on-expand="expand"
        :option="options1"
        :treeOption="treeOption"
        @on-sort-change="sortChange"
        @on-editselect-change="selectchange"
        @on-editinput-change="selectchange"
        @on-editinput-blur="selectchange"
        @on-editarea-change="selectchange"
        @on-editarea-blur="selectchange"
        @on-money-blur="selectchange"
        @on-money-change="selectchange"
        @on-editdate-change="selectchange">
        <p slot='loading'>我是自定义loading</p>
      </h-edit-gird>
    <!-- </h-msg-box> -->
    <Button @click="getData">获取数据</Button>
    <Button @click="setLoad">切换loading</Button>
    <p>小</p>
    <h-edit-gird :columns="columns1" :data="data1" @on-current-change="click1" @on-row-click="click1" ref="editGird" width="800" no-data-text="你好呀" :loading="loading"></h-edit-gird>
    <p>中</p>
    <h-edit-gird :columns="columns1" :data="data1" size="large" :disabled-hover="true" :highlight-row="true" @on-current-change="click1" @on-select-cancel="click1" ref="editGird" stripe :loading="loading"></h-edit-gird>
    <p>大</p>
<!--     <Button @click="getDate">获取数据</Button>
    <Button @click = "addDate">新增一行</Button> -->
    <h3>多选</h3>
    <h-edit-gird :columns="columns4" :data="data1" :showEditInput="true" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-select-cancel="select" height="200"></h-edit-gird>
    <h-edit-gird :columns="columns4" :data="data1" @on-select-all="allSelect" @on-selection-change="selsetChange" height="200" :loading="loading"></h-edit-gird>
    <h3>直接显示编辑框</h3>
    <Button @click="getChangeData">获取改变后的数据</Button>
    <h-edit-gird :columns="columns1" ref="table1" :data="data1" size="small" :disabled-hover="true" :highlight-row="true" @on-current-change="click1" :showEditInput="true" height="200" :loading="loading"></h-edit-gird>
    <Button @click="setLoad">切换loading</Button>
    <Button @click="addDate">添加一行</Button>
    <p>动态显示隐藏输入框</p>
    <h-row style="margin-top: 10px;margin-bottom: 10px;">
        <h-col span="24">
          <span>
            <h-button type="primary" style="margin-right: 5px;" @click="showInput">打开</h-button>
          </span>
          <span>
            <h-button type="primary" style="margin-right: 5px;" @click="hideInput">关闭</h-button>
          </span>
        </h-col>
      </h-row>

      <h-edit-gird :columns="columnsA" :data="datainput" size="small" :showEditInput="showEditInput" stripe></h-edit-gird>
  </div>
</template>

<script>
var tData= [
  {
    name: '王小明',
    age: 18,
    address: '北京市朝阳区芍药居',
    money: '120.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating:'2018-03-07',
    timing:'16:00:00.00',
    tree:'leaf1'
    // _highlight: true//默认选择当前项
  },
  {
    name: '张小刚',
    age: 25,
    address: '北京市海淀区西二旗',
    money: '130.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating:'2018-03-07',
    timing:'16:00:00.00',
    tree:'leaf1'
  },
  {
    name: '李小红',
    age: 30,
    address: '上海市浦东新区世纪大道',
    money: '140.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating:'2018-03-07',
    timing:'16:00:00.00',
    tree:'leaf1'
  },
  {
    name: '周小伟',
    age: 26,
    address: '深圳市南山区深南大道',
    money: '150.00',
    cardId: '6223 5678 1234 5678',
    city: '北京',
    dating:'2018-03-07',
    timing:'16:00:00.00',
    tree:'leaf1'
  }
];
var columns=[
        // {
        //   type: 'expand',
        //   width: 50,
        //   render: (h, params) => {
        //     return h(TexpandRow, {
        //       props: {
        //           row: params.row
        //       }
        //     })
        //   }
        // },
        {
          type: 'selection',
          width: 50,
        },
        {
          title: '姓名',
          key: 'name',
          width: 200,
          rule: { required: true, message: '姓名不能为空'},
          typeWidth:150,
          hiddenOther:true,
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
          width:80,
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
        // {
        //   type: 'number',
        //   title: '年龄',
        //   width: 200,
        //   key: 'age',
        //   hiddenCol:false,
        //   rule: { required: true, message: '年龄不能为空'},
        // },
        {
          type: 'textArea',
          rows: 4,
          title: '地址',
          key: 'address',
          ellipsis:true,
          rule: { required: true, message: '地址不能为空'},
        },
        {
          type: 'money',
          title: '金额',
          integerNum: 14,
          suffixNum: 3,
          // suffixNum: 2,
          bigTips: true,
          key: 'money',
          rule: { required: true, message: '金额不能为空'},
        },
        {
          type: 'card',
          title: '卡号',
          key: 'cardId',
          rule: { required: true, message: '卡号不能为空'},
        },
        // {
        //   type: 'select',
        //   title: '地区',
        //   width: 200,
        //   key: 'city',
        //   multiple:false,
        //   transfer:true,
        //   rule:{ required: true, message: '请选择城市', trigger: 'blur,change' }
        // },
        // {
        //   type: 'date',
        //   title: '日期',
        //   width: 200,
        //   key: 'dating',
        //   dateType:'date',
        //   format: 'yyyy-MM-dd',
        //   rule:{ required: true, message: '请选择日期', trigger: 'blur,change' }
        // },
        // {
        //   type: 'time',
        //   title: '时间',
        //   width: 200,
        //   key: 'timing',
        //   dateType:'time',
        //   format: 'HH:mm:ss',
        //   steps: [2,2,2],
        //   rule:{ required: true, message: '请选择时间', trigger: 'blur,change' }
        // },
        // {
        //   type: 'selectTree',
        //   title: '下拉树',
        //   width: 200,
        //   key: 'tree',
        //   treeData:[{
        //     expand: true,
        //     title: 'parent 1',
        //     children: [{
        //       title: 'parent 1-0',
        //       expand: true,
        //       children: [{
        //         title: 'leaf1',
        //         disableCheckbox: true
        //       }, {
        //         title: 'leaf2',
        //       }]
        //     }, {
        //       title: 'parent 1-1',
        //       expand: true,
        //       checked: true,
        //       children: [{
        //         title: 'leaf3',
        //       }]
        //     }]
        //   }],
        //   showCheckbox: false,
        //   checkStrictly: false,
        //   rule:{ required: true, message: '请选择子节点', trigger: 'blur,change' }
        // }
      ]
import TexpandRow from './Texpand-row.vue'
export default {
  data() {
    return {
      loading:false,
      showMsgBox:false,
      showEditInput:true,
      columns1: [
        // {
        //   type: 'expand',
        //   fixed: 'left',
        //   width: 50,
        //   render: (h, params) => {
        //     return h(TexpandRow, {
        //       props: {
        //           row: params.row
        //       }
        //     })
        //   }
        // },
        {
          type: 'text',
          title: '姓名',
          key: 'name',
          width: 200,
          filterRE:/[^\d]/g,
          sortable:true,
          // typeWidth:100,
          // hiddenOther:true,
          rule: { required: true, message: '姓名不能为空'},
          // render: (h, params) => {
          //   return h('div', [
          //     h('h-button', {
          //       props: {
          //         type: 'primary',
          //         size: 'small'
          //       },
          //       style: {
          //         marginRight: '5px'
          //       },
          //       on: {
          //         'click': () => {
          //           this.show(params.index)
          //         }
          //       }
          //     }, '查看')
          //   ]);
          // }
        },
        {
          width:100,
          typeWidth:0,
          render: (h, params) => {
            // return h('div', [
            //   h('h-button', {
            //     props: {
            //       type: 'primary',
            //       size: 'small'
            //     },
            //     style: {
            //       marginRight: '5px'
            //     },
            //     on: {
            //       'click': () => {
            //         this.show(params.index)
            //       }
            //     }
            //   }, '查看')
            // ]);
            return h('div', [
              h('h-switch', {
                on: {
                  'click': () => {
                    this.show(params.index)
                  }
                }
              })
            ]);
          }
        },
        {
          type: 'number',
          title: '年龄',
          key: 'age',
          hiddenCol:false,
          prelabel:(index)=>{
            if(index==2){
            return "123";
            }
          },
          rule: { required: true, message: '年龄不能为空'},
        },
        {
          type: 'textArea',
          rows: 5,
          // width: 200,
          title: '地址',
          key: 'address',
          filterRE:/[^\d]/g,
          ellipsis:true,
          // rearlabel:(index)=>{
          //   if(index%2==0){
          //     return '#';
          //   }else{
          //     return '%'
          //   }
          // },
          rule: { required: true, message: '地址不能为空'},
        },
        {
          type: 'money',
          title: '金额',
          // width: 100,
          integerNum: 14,
          // suffixNum: '0',
          suffixNum: 0,
          bigTips: true,
          key: 'money',
          // divided:true,
          nonNegative:true,
          rule: { required: true, message: '金额不能为空'},
        },
        {
          type: 'card',
          title: '卡号',
          // width: 200,
          key: 'cardId',
          rule: { required: true, message: '卡号不能为空'},
        },
        {
          type: 'select',
          title: '地区',
          // width: 200,
          transfer:true,
          filterable: true,
          remote:true,
          remoteMethod:this.remoteMethod1,
          // loading:true,
          key: 'city',
          multiple:false,
          option:[],
          placement:'top',
          // dropWidth:300,
          rule:{ required: true, message: '请选择城市', trigger: 'blur,change' }
        },
        {
          type: 'date',
          title: '日期',
          // width: 200,
          key: 'dating',
          dateType:'date',
          placement:'top',
          transfer:true,
          format: 'yyyy-MM-dd',
          rule:{ required: true, message: '请选择日期', trigger: 'blur,change' }
        },
        {
          type: 'time',
          title: '时间',
          // width: 200,
          transfer:true,
          placement:'top',
          key: 'timing',
          dateType:'time',
          format: 'HH:mm:ss',
          steps: [2,2,2],
          rule:{ required: true, message: '请选择时间', trigger: 'blur,change' }
        },
         {
           type: 'selectTree',
           title: '下拉树',
           // width: 200,
           key: 'tree',
           showCheckbox: false,
           checkStrictly: false,
           rule:{ required: true, message: '请选择子节点', trigger: 'blur,change' }
         }
      ],
      columns4: [
      {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(TexpandRow, {
              props: {
                  row: params.row
              }
            })
          }
        },
      ],
      data1: [],
       datainput: [{
          image_name: '镜像1',
          image_os: 'Windows',
          image_bit: '64',
          is_use: '是',
          price: '888.00',
          create_time: '2019-07-05 16:33:33'
        }, {
          image_name: '镜像1',
          image_os: 'Windows',
          image_bit: '64',
          is_use: '是',
          price: '888.00',
          create_time: '2019-07-05 16:33:33'
        }, {
          image_name: '镜像1',
          image_os: 'Windows',
          image_bit: '64',
          is_use: '是',
          price: '888.00',
          create_time: '2019-07-05 16:33:33'
        }, {
          image_name: '镜像1',
          image_os: 'Windows',
          image_bit: '64',
          is_use: '是',
          price: '888.00',
          create_time: '2019-07-05 16:33:33'
        }],
        columnsA: [{
          title: '镜像名称',
          key: 'image_name'
        }, {
          title: '镜像操作系统',
          key: 'image_os'
        }, {
          title: '镜像位数',
          key: 'image_bit'
        }, {
          title: '是否可用',
          key: 'is_use'
        }, {
          type: 'money',
          suffixNum: 2,
          placeholder: '请输入价格',
          title: '价格(元)',
          key: 'price'
        }, {
          title: '创建时间',
          key: 'create_time'
        }],
      data2: tData,
      options1:[],
      list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming'],
      treeOption:[],
      }
  },
  methods: {
    sortChange(i,j,k){
      console.log(i);
      console.log(j);
      console.log(k);
    },
    changeMsg(){
      this.showMsgBox = !this.showMsgBox;
    },
    expand(e,status){
      console.log(e);
    },
    setLoad(){
      this.loading = !this.loading;
    },
    click1(s,v){
      console.log(s);
      console.log(v);
    },
    allSelect (allSelection){
      console.log(allSelection);
    },
    select (selection,row){//已选择的项和刚刚选择的项
      console.log(selection);
      console.log(row);
    },
    selsetChange (selection,inx){//选项发生变化时触发已选择的项
      console.log(selection);
      console.log(inx);
    },
    getData(){
      console.log(this.$refs.editGird.cloneData);
    },
    addDate(){
      // tData = this.data1.push({
      //   name: '1234',
      //   age: null,
      //   address: '',
      //   money: '',
      //   cardId: '',
      //   city: '',
      //   dating:'',
      //   timing:'',
      //   tree:''
      // });
      let cloneData = this.$refs.table.cloneData;
      cloneData.push({
        name: '1234',
        age: null,
        address: '',
        money: '',
        cardId: '',
        city: '',
        dating:'',
        timing:'',
        tree:''
      })
      this.data2 = cloneData
    },
    delDate(){

    },
    showInput(){
         //  this.showEditInput=true;
           this.columnsA[4].type='money';
    },
    hideInput(){
         //this.showEditInput=false;
         this.columnsA[4].type='';
    },
    remoteMethod1 (query) {
      if (query !== '') {
          setTimeout(() => {
              const list = this.list.map(item => {
                  return {
                      value: item,
                      label: item
                  };
              });
              let arr = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
              this.$set(this.options1,7,arr)
          }, 200);
      } else {
          this.options1[7] = [];
      }
    },
    selectchange(val,i,j){
      console.log(val);
      console.log(i);
      console.log(j);
    },
    getChangeData(){
      console.log(this.$refs.table.getChangeData())
      console.log(this.$refs.table1.getChangeData())
    }
  },
  mounted(){
    // this.data1=tData
    this.treeOption[0]=this.treeOption[10]=this.treeOption[9]=[{
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
    this.options1[7] =this.options1[6]=[{value:'Alabama',label:'Alabama'},{value:'beijing',label:'北京'},{value:'Delaware',label:'Delaware'}]
    const list = this.list.map(item => {
        return {
            value: item,
            label: item
        };
    });
    // this.options1[7] = list;
  },
  created() {
    // setTimeout(()=>{
      this.columns4 = columns;
      this.data1 = tData;
    // }, 3000);
  }
}
</script>
