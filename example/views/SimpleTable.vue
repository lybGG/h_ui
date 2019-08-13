<template>
  <div>
    <h2>基础</h2>
    <Button @click="changemsg">显示</Button>
    <h2>带边线 多选</h2>
    <Button @click="loadData">加载数据</Button>
    <Button @click="changeData">切换数据</Button>
    <!--<h-simple-table :columns="columnsBig" :data="bigData" border stripe @on-select="select" @on-select-cancel="select" :loading="loading" headAlgin="right" bodyAlgin="left" @on-drag="onDrag" height="300" @on-select-all='change' @on-scroll="change" @on-selection-change="change" width="1200" :canDrag="false">-->
      <!--<span slot="loading">我是自定义加载！！！</span>-->
    <!--</h-simple-table>-->
    <h-button @click="setLoading">切换状态</h-button>
    <h-button @click="clearData">清除数据</h-button>
    <h2>不带边线 单选 on-current-change</h2>
    <!-- :multiLevel="multiLevel1" -->
    <!-- <h-msg-box v-model="showmsg" :width="1000"> -->
      <!-- notAdaptive  -->
    <h-simple-table ref="simTable" canMove :summationRender="false" @on-right-click="rightClick" :summationData="summationData" :columns="columnsBig1" border :data="bigData" height="300" @on-selection-change="selsetChange" @on-current-change="selsetChange1" @on-row-dblclick="dblclick" highlight-row @on-sort-change="sortchange">
    </h-simple-table>
    <!-- </h-msg-box> -->
    <h-button @click='changeClo'>改变冻结列</h-button>
    <h-button type="primary" size="large" @click="exportData(1)"><h-icon type="ios-download-outline"></h-icon> 导出原始数据</h-button>
    <h-button type="primary" size="large" @click="exportData(2)"><h-icon type="ios-download-outline"></h-icon> 导出排序和过滤后的数据</h-button>
    <h-button type="primary" size="large" @click="exportData(3)"><h-icon type="ios-download-outline"></h-icon> 导出自定义数据</h-button>
    <!-- <h2>自定义样式</h2>
    <p>行：通过属性 row-class-name 可以给某一行指定一个样式名称。</p>
    <p>列：通过给列 columns 设置字段 className 可以给某一列指定一个样式。</p>
    <p>单元格：通过给数据 data 设置字段 cellClassName 可以给任意一个单元格指定样式。</p>
    <p>自定义行样式：</p>
    <h-simple-table :row-class-name="rowClassName" :columns="columns1" :data="data2" :loading="loading" :highlight-row='true' @on-selection-change="change" @on-row-click="change"></h-simple-table>
    <p>自定义列样式：</p>
    <h-simple-table :columns="columns9" :data="data2" :loading="loading" @on-row-click="change"></h-simple-table>
    <p>自定义任意单元格样式：</p>
    <h-simple-table :columns="columns3" :data="data2" @on-row-click="click1" :loading="loading"></h-simple-table>
    <h2>固定表头</h2>
    <p>通过设置属性 height 给表格指定高度后，会自动固定表头。当纵向内容过多时可以使用</p>
    <h-simple-table height="200" :columns="columns3" :data="data2" border :loading="loading" showTitle></h-simple-table>
    <h2>单选</h2>
    <p>通过设置属性 highlight-row，可以选中某一行。</p>
    <p>给 data 项设置特殊 key _highlight: true 可以默认选中当前项。</p>
    <h-simple-table highlight-row :columns="columns3" :data="data1" @on-current-change='radioChange' :loading="loading"></h-simple-table>
    <h2>多选</h2>
    <p>给 data 项设置特殊 key _checked: true 可以默认选中当前项。</p>
    <p>给 data 项设置特殊 key _disabled: true 可以禁止选择当前项。</p>
    <p>@on-select，选中某一项触发，返回值为 selection 和 row，分别为已选项和刚选择的项。</p>
    <p>@on-select-all，点击全选时触发，返回值为 selection，已选项。</p>
    <p>@on-selection-change，只要选中项发生变化时就会触发，返回值为 selection，已选项。</p>
    <h-simple-table border :columns="columns4" :data="data1" @on-select-all="allSelect" @on-select="select" :rowSelect="true" @on-selection-change="selsetChange" :loading="loading" canMove></h-simple-table>

    <h2>自定义列模板</h2>
    <p>通过给 columns 数据的项，设置一个函数 render，可以自定义渲染当前列，包括渲染自定义组件，它基于 Vue 的 Render 函数。</p>
    <p>render 函数传入两个参数，第一个是 h，第二个是对象，包含 row、column 和 index，分别指当前单元格数据，当前列数据，当前是第几行。</p>
    <h-simple-table border :columns="columns7" :data="data6" :loading="loading"></h-simple-table>
    <h2>设置大小</h2>
    <p>通过设置属性 size 为 large 或 small 可以调整表格尺寸为大或小，默认不填或填写 default 为中。</p>
    <h-simple-table size="large" :columns="columns1" :data="data1" :loading="loading"></h-simple-table>
    <h-simple-table size="small" :columns="columns1" :data="data1" :loading="loading"></h-simple-table> -->
  </div>
</template>
<script>
import TexpandRow from './Texpand-row.vue'
let jsonData=[];
let tData =require('../assets/aa.json');
for (let i = 0; i < 1; i++) {
  jsonData =tData.slice(0,100);
}
export default {
  components:{TexpandRow},
  data () {
    return {
      showmsg:false,
      checked:false,
      msgbox:false,
      loading:false,
      bigData:[],
      columzns18: [
         {
             type: "selection",
             width: 60,
             align: "center",
             fixed: "left",
         },
         {
             title: "名称",
             key: "name",
             align: "center",
             width: 100,
             fixed: "left",
             hiddenCol:true,
         },
         {
             title: "展示",
             key: "show",
             width: 200,
             align: "center",
             sortable: true,
             filters: [
               {
                   label: '大于4000',
                   value: 1
               },
               {
                   label: '小于4000',
                   value: 2
               }
             ],
             filterMultiple: false,
             filterMethod (value, row) {
                 if (value === 1) {
                     return row.show > 4000;
                 } else if (value === 2) {
                     return row.show < 4000;
                 }
             }
         },
         {
             title: "唤醒",
             key: "weak",
             width: 150,
             sortable: true,
             fixed: "left",
             sortable: true,
             filters: [
               {
                   label: '大于4000',
                   value: 1
               },
               {
                   label: '小于4000',
                   value: 2
               }
             ],
             filterMultiple: false,
             filterMethod (value, row) {
                 if (value === 1) {
                     return row.weak > 4000;
                 } else if (value === 2) {
                     return row.weak < 4000;
                 }
             }
         },
         {
             title: "登录",
             key: "signin",
             width: 150,
             sortable: true
         },
         {
             title: "点击",
             key: "click",
             width: 150,
             sortable: true
         },
         {
             title: "激活",
             key: "active",
             width: 150,
             sortable: true
         },
         {
             title: "7日留存",
             key: "day7",
             width: 150,
             sortable: true
         },
         {
             title: "30日留存",
             key: "day30",
             width: 150,
             sortable: true
         },
         {
             title: "次日留存",
             key: "tomorrow",
             width: 150,
             sortable: true
         },
         {
             title: "日活跃",
             key: "day",
             width: 150,
             sortable: true
         },
         {
             title: "周活跃",
             key: "week",
             width: 150,
             fixed: "right",
             sortable: true,
         },
         {
             title: "月活跃",
             key: "month",
             fixed: "right",
             width: 150,
             sortable: true,
             filters: [
               {
                   label: '大于4000',
                   value: 1
               },
               {
                   label: '小于4000',
                   value: 2
               }
             ],
             filterMultiple: false,
             filterMethod (value, row) {
                 if (value === 1) {
                     return row.month > 4000;
                 } else if (value === 2) {
                     return row.month < 4000;
                 }
             }
         }
      ],
      columnsBig: [
       {
        title:'测试',
        key:'ceshi',
        algin:'center',

       }
      ],
      columnsBig1:[
       {
        title:'测试',
        key:'ceshi',
        algin:'center',
       }
      ],
      columns1: [
       {
        title:'测试',
        key:'ceshi',
        algin:'center'
       }
      ],
      columns3: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          render: (h, params) => {
            return h('div',params.row.name+'1')
            // if (params.row._index==1) {
            //   return h('div', [
            //     h('h-icon', {
            //       props: {
            //         name: 'addressbook'
            //       }
            //     }),
            //     h('strong', params.row.name)
            //   ]);
            // }else{
            //   return h('span',params.row.name)
            // }
          },
          renderHeader:(h, params)=>{
            return h('span','123')
          }
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '姓名',
          key: 'name',
          ellipsis: true
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      columns7: [
        {
          title: '姓名',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('h-icon', {
                props: {
                  name: 'addressbook'
                }
              }),
              h('strong', params.row.name)
            ]);
          }
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
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
              }, '查看'),
              h('h-button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      columns9: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age',
          className: 'demo-table-info-column'
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      data1: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区\r芍药居'
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
        }
      ],
      data2: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳\r区芍药居'
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
          name: '王小明',
          age: 18,
          address: '北京市朝阳\r区芍药居'
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
        }
      ],
      data6: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区芍药居'
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
        }
      ],
      status:false,
      multiLevel1:[[
        {title:'123',cols:2, align:'center'},
        {title:'456',cols:2, className:"ceshi"},
        {title:'789',cols:2,hiddenCol:false, align:'right'},
        // {title:'789'},
      ],
      [{title:'123',cols:2,},
        {title:'456',cols:2,},
        {title:'789',cols:2,hiddenCol:true},]
      ],
      summationData: [{
        fundId: '12313',
        tradeDate: 730211221,
        securityCode: 5627223123,
        index: 1563123123,
        securityCode: 425413,
        securityId: 1438123,
        tradeDir: 27412312,
        day30: 285123,
        tradeSubtype: 1727123,
        marketNo: 558,
        tradeQuantity: 4440,
      }],
      summationData1: [{
        name: 'qeqweqw',
        age: 123123123,
        address: 'qqweqwe'
      }],
    }
  },
  methods:{
    rightClick(e){
      console.log('right'+e)
    },
    clearData() {
//      this.columnsBig1.shift()
      this.columnsBig1.splice(2, 1)
      this.columnsBig1.pop()
      this.$nextTick(()=> {
        this.bigData = []
      })
    },
    changeClo(){
      this.$set(this.columnsBig1[1],'fixed','left')
    },
    loadData(){
      this.showmsg = true;
      this.columnsBig1.splice(2, 0, {
        title: '地址1',
        key: 'securityName',
      })
      this.columnsBig1.push({
        title: '年龄1',
        key: 'tradeDate'
      })
//      this.columnsBig1.unshift({
//        title: '地址1',
//        key: 'securityName',
//        minWidth:200,
//      })

      this.$nextTick(()=>{
        this.bigData = jsonData;
      })
    },
    changeData(){
      this.bigData =tData.slice(500,600);
    },
    changemsg(){
      this.msgbox = !this.msgbox;
    },
    onDrag(e,i){
      console.log(e);
      console.log(i);
    },
    onMove(i,j){
      console.log(i);
      console.log(j);
    },
    change(e){
      console.log(e);
    },
    scroll(num){
      if(num==0&&!this.status){
        this.status = true;
        this.bigData = this.bigData.concat(jsonData);
      }
    },
    setLoading(){
      this.$set(this.bigData[0],'fundId','sheishi')
      // this.loading = !this.loading;
    },
    click1 (selection) {
      console.log(selection);
    },
    rowclick(){
      console.log('你点击了某一行');
    },
    dblclick(e,i,j){
      console.log(e);
      console.log(i);
      console.log(j);
    },
    expand(row,status){
      console.log(status);
    },
    sortchange(e) {
      console.log(e)
    },
    sortChange(obj){
      if (obj.order == 'asc') {
        let len = this.data5.length-1;
        let item = this.data5[len];
        this.data5.splice(len,1);
        this.data5.splice(0,0,item);
      }else{
        console.log('你点击勒向下排序按钮');
      }
    },
    rowClassName (row, index) {
      if (index === 1) {
        return 'demo-table-info-row';
      } else if (index === 3) {
        return 'demo-table-error-row';
      }
      return '';
    },
    radioChange (currentRow,oldRow){
      console.log(currentRow);
      console.log(oldRow);
    },
    allSelect (allSelection){
      console.log(allSelection);
    },
    select (selection,row){//已选择的项和刚刚选择的项
      console.log(selection);
      console.log(row);
    },
    selsetChange (selection,inx,i){//选项发生变化时触发已选择的项
      console.log(selection);
      console.log(inx);
      console.log(i);
    },
    selsetChange1 (selection,inx,i){//选项发生变化时触发已选择的项
      console.log("1  "+selection);
      console.log("1  "+inx);
      console.log("1  "+i);
    },
    show (index) {
      this.$hMsgBox.info({
        title: '用户信息',
        content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
      });
    },
    remove (index) {
      this.data6.splice(index, 1);
    },
    exportData (type) {
      if (type === 1) {
        this.$refs.simTable.exportCsv({
          filename: '原始数据'
        });
      } else if (type === 2) {
        this.$refs.simTable.exportCsv({
          filename: '排序和过滤后的数据',
          original: false,
          noHeader:true,
        });
      } else if (type === 3) {
        this.$refs.simTable.exportCsv({
          filename: '自定义数据',
          columns: this.columnsBig1.filter((col, index) => index < 4),
          data: this.bigData.filter((data, index) => index < 200)
        });
      }
    }
  },
  mounted(){
    this.columns1=[
        {
          type: 'selection',
          align: 'center',
        },
        {
          type: 'index',
          align: 'center',
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
        },
        {
          title: '年龄',
          key: 'age',
        },
        {
          title: '地址',
          ellipsis:true,
          key: 'address',
        },
        {
          title: '地址1',
          key: 'address1',
        },
        {
          title: '地址2',
          key: 'address2',
        },
        {
          title: '地址3',
          key: 'address3',
        },
        {
          title: '地址4',
          key: 'address4',
        },
        {
          title: '地址5',
          key: 'address5',
        },
        {
          title: '地址6',
          key: 'address6',
          sortType:'address',
        }
    ]
    this.columnsBig=[
        {
          type: 'selection',
          align: 'center',
          sortable: true
        },
        {
          type: 'index',
          align: 'center',
          key:'index'
        },
        {
          title: '姓名',
          key: 'fundId',
          align: 'center',
          ellipsis:true,
        },
        {
          title: '年龄',
          key: 'tradeDate',
        },
        {
          title: '地址',
          key: 'securityCode',
        },
        {
          title: '地址1',
          key: 'securityName',
          ellipsis:true,
        },
        {
          title: '地址2',
          key: 'securityId',
        },
        {
          title: '地址3',
          key: 'tradeDir',
        },
        {
          title: '地址4',
          key: 'tradeSubtype',
        },
        {
          title: '地址5',
          key: 'marketNo',
        },
        {
          title: '地址6',
          key: 'tradeQuantity',
        }
    ]
    this.columnsBig1=[
        {
          type: 'index',
          align: 'center',
          width:200,
          key:"index",
          fixed:'left',
        },
        {
          type: 'selection',
          align: 'center',
          key:'select',
          sortable: true
        },
        {
          title: '姓名',
          key: 'fundId',
          width:200,
          // remote: true,
          // renderHeader:(h, params)=>{
          //   return h('span','123')
          // },
          render:(h, params)=>{
            return h('span',params.row.fundId+' 567')
            // return params.row.fundId+' 123'
          }
          // hiddenCol:true,
          // align: 'center',
          // sortable:true,
        },
        {
          title: '年龄',
          key: 'tradeDate',
          sortable:true,
          // fixed:'left',
        },
         {
           title: '地址',
           ellipsis:true,
           key: 'securityCode',
         },
         {
           title: '地址1',
           key: 'securityName',
           minWidth:200,
         },
         {
           title: '年龄',
           key: 'tradeDate1',
           minWidth:200,
         },
        {
          title: '地址',
          ellipsis:true,
          minWidth:200,
          key: 'securityCode1',
        },
//         {
//           title: '地址1',
//           key: 'securityName',
//           minWidth:200,
//           sortable:true,
//         }
    ]
    // this.columnsBig1.push({
    //   title: '地址6',
    //   key: 'tradeQuantity',
    // })
  }
}
</script>
<style type="text/css">
/* th{
  height: 32px !important;
} */
.h-table .demo-table-info-row td{
  background-color: #2db7f5 !important;
  color: #fff;
}
.h-table .demo-table-error-row td{
  background-color: #ff6600!important;
  color: #fff;
}
.h-table td.demo-table-info-column{
  background-color: #2db7f5!important;
  color: #fff;
}
.h-table .demo-table-info-cell-name {
  background-color: #2db7f5!important;
  color: #fff;
}
.h-table .demo-table-info-cell-age {
  background-color: #ff6600!important;
  color: #fff;
}
.h-table .demo-table-info-cell-address {
  background-color: #187!important;
  color: #fff;
}
.h-table-title, .h-table-footer{
  background-color: #7eb8f1;
  text-align: center;
}
.ceshi{
  background: red !important;
}
</style>
