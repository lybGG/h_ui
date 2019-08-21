<template>
  <div>
    <h2>基础</h2>
     <h-msg-box v-model="msgbox">
      <p slot="header">你好呀</p>
      <h-table :columns="columns1" :data="data1" headAlgin="center" border :highlight-row="true" @on-current-change="click1" :loading="loading" bodyAlgin="left" @on-drag="onDrag">
        <span slot="loading">我是自定义加载！！！</span>
      </h-table>
    </h-msg-box>
    <!-- <Button @click="refresh">显示</Button>
    <Button @click="getData">重新赋值</Button>
    <h-input v-model="aaa"></h-input> -->
     <Button @click="changemsg">显示</Button>
    <Button @click="addData">添加数据</Button>
    <Button @click="removeData">删除数据</Button>
     <!-- :multiLevel="multiLevel1" -->
     <!-- :multiLevel="multiLevel2"  -->
    <h-table :columns="columns" :data="data0" :summationData="summationData1" border :highlight-row="true" @on-sort-change="sortchange" @on-current-change="click1" :loading="loading" headAlgin="right" bodyAlgin="left" @on-drag="onDrag" height="300" canMove @on-move="onMove" :lastColWidth="150">
      <span slot="loading">我是自定义加载！！！</span>
    </h-table>
    <!--<h-button @click="setLoading">切换状态</h-button>-->
    <!--<h-button @click="setMult">切换hiddenCol</h-button>-->
    <!--<h2>带边线</h2>-->
    <!--<h-table border :columns="columns1" :data="data0" stripe no-data-text="数据为空" :show-header="false" :loading="loading" canMove>-->
      <!--<div slot="header">我是表头</div>-->
      <!--<div slot="footer">我是表尾</div>-->
    <!--</h-table>-->
    <!--<h2>自定义样式</h2>-->
    <!--<p>行：通过属性 row-class-name 可以给某一行指定一个样式名称。</p>-->
    <!--<p>列：通过给列 columns 设置字段 className 可以给某一列指定一个样式。</p>-->
    <!--<p>单元格：通过给数据 data 设置字段 cellClassName 可以给任意一个单元格指定样式。</p>-->
    <!--<p>自定义行样式：</p>-->
    <!--<h-table :row-class-name="rowClassName" :multiLevel="multiLevel2" :columns="columns1" :data="data1" :loading="loading" :highlight-row='true' canMove></h-table>-->
    <!--<p>自定义列样式：</p>-->
    <!--<h-table :columns="columns9" :data="data1" :loading="loading"></h-table>-->
    <!--<p>自定义任意单元格样式：</p>-->
    <!--<Button @on-click="changeHidden">改变hiddenCol</Button>-->
    <!--<h-table :columns="columns1" :data="data8" @on-row-click="click1" :loading="loading"></h-table> &ndash;&gt;-->
    <!--<h2>固定表头</h2>-->
    <!--<p>通过设置属性 height 给表格指定高度后，会自动固定表头。当纵向内容过多时可以使用</p>-->
    <!--<p>设置maxheight 600</p>-->
    <!--<h-table maxHeight="600" :columns="columns1" :data="data2" border :loading="loading" showTitle @on-drag-drop="handleDrop"></h-table>-->
    <!--<h-table height="200" :columns="columns1" :data="data2" border :loading="loading" showTitle></h-table>-->
    <!--<h2>固定列</h2>-->
    <!--<p>通过给数据 columns 的项设置 fixed 为 left 或 right，可以左右固定需要的列。</p>-->
    <!--<h-table border :columns="columns2" showTitle :data="data3" :loading="loading" canMove height="250" canDragFixed :minDragWidth="60"></h-table>-->
    <!--<h2>固定表头和列</h2>-->
    <!--<h-table height="300" width="550" border :columns="columns2" :data="data4" :loading="loading" @on-scroll="scroll"></h-table>-->
    <!--<p>设置maxheight 800</p>-->
    <!--<h-table maxHeight="800" width="550" border :columns="columns2" :data="data4" :loading="loading" @on-scroll="scroll"></h-table>-->
    <!--<h-table height="800" width="550" border :columns="columns2" :data="[data4[1]]" :loading="loading" @on-scroll="scroll"></h-table>-->
    <!--<h2>单选</h2>-->
    <!--<p>通过设置属性 highlight-row，可以选中某一行。</p>-->
    <!--<p>给 data 项设置特殊 key _highlight: true 可以默认选中当前项。</p>-->
    <!--<h-table highlight-row :columns="columns3" :data="data1" @on-current-change='radioChange' :loading="loading"></h-table>-->
    <!--<h2>多选</h2>-->
    <!--<p>给 data 项设置特殊 key _checked: true 可以默认选中当前项。</p>-->
    <!--<p>给 data 项设置特殊 key _disabled: true 可以禁止选择当前项。</p>-->
    <!--<p>@on-select，选中某一项触发，返回值为 selection 和 row，分别为已选项和刚选择的项。</p>-->
    <!--<p>@on-select-all，点击全选时触发，返回值为 selection，已选项。</p>-->
    <!--<p>@on-selection-change，只要选中项发生变化时就会触发，返回值为 selection，已选项。</p>-->
    <!--<h-table border :columns="columns4" :data="data1" :rowSelect="true" @on-row-click="selsetChange" :loading="loading"></h-table>-->
    <!--<h2>排序</h2>-->
    <!--<p>通过给 columns 数据的项，设置 sortable: true，即可对该列数据进行排序。</p>-->
    <!--<p>排序默认使用升序和降序，也可以通过设置属性 sortMethod 指定一个自定义排序函数，接收三个参数 a 、 b 和 type。</p>-->
    <!--<p>通过给某一列设置 sortType 可以在初始化时使用排序。</p>-->
    <!--<p>如果使用远程排序，可以设置 sortable： 'custom'，然后在触发排序事件 @on-sort-change后，进行远程排序，并手动设置新的 data，详见 API。</p>-->
    <!--<h-table border :columns="columns5" :data="data5" @on-sort-change='sortChange' :loading="loading"></h-table>-->
    <!--<h2>筛选</h2>-->
    <!--<p>通过给 columns 数据的项，设置 filters，可进行筛选</p>-->
    <!--<p>必须指定一个筛选函数 filterMethod 才可以进行筛选，filterMethod 传入两个参数 value 和 row，详见 Demo 和 API。</p>-->
    <!--<p>如果指定 filterMultiple: false，则使用单选，默认为多选。</p>-->
    <!--<h-table border :columns="columns6" :data="data5" no-filtered-data-text="筛选后结果为空123" :loading="loading" canMove></h-table>-->
    <!--<h2>自定义列模板</h2>-->
    <!--<p>通过给 columns 数据的项，设置一个函数 render，可以自定义渲染当前列，包括渲染自定义组件，它基于 Vue 的 Render 函数。</p>-->
    <!--<p>render 函数传入两个参数，第一个是 h，第二个是对象，包含 row、column 和 index，分别指当前单元格数据，当前列数据，当前是第几行。</p>-->
    <!--<h-table border :columns="columns7" :data="data6" :loading="loading"></h-table>-->
    <!--<h2>可展开的表格</h2>-->
    <!--<p>通过给 columns 数据设置一项，指定 type: 'expand'，即可开启扩展功能。</p>-->
    <!--<p>给行数据 data 的某项设置 _expanded 为 true，可以默认展开当前行，设置 _disableExpand 可以禁用当前行的展开功能。</p>-->
    <!--<p>渲染展开区域与自定义列模板方法类似，使用 render 函数。当内容较复杂时，可拆分为组件或使用 JSX。</p>-->
    <!--<h-table :columns="columns10" :height="300" :data="data9" @on-expand="expand" rowSelect @on-selection-change="select" @on-row-click="rowclick" @on-row-dblclick="rowdblclick" :loading="loading" border></h-table>-->
    <!--<h2>设置大小</h2>-->
    <!--<p>通过设置属性 size 为 large 或 small 可以调整表格尺寸为大或小，默认不填或填写 default 为中。</p>-->
    <!--<h-table size="large" :columns="columns1" :data="data1" :loading="loading"></h-table>-->
    <!--<h-table size="small" :columns="columns1" :data="data1" :loading="loading"></h-table>-->
    <!--<h2>导出csv </h2>-->
    <!--<p>通过在column中设置hiddenCol表示该列是否隐藏</p>-->
    <!--<p>通过调用 exportCsv() 方法，可以将数据导出为 .csv 的表格文件，详见 API。</p>-->
    <!--<p>说明：-->
    <!--支持IE9~IE11、Edge、Chrome、Safari、Firefox 全系列浏览器。-->
    <!--IE9、Safari 需要手动修改后缀名为 .csv。-->
    <!--IE9暂时只支持英文，中文会显示为乱码。</p>-->
    <!--<h-table height="200" border width="1000" :columns="columns8" isMulitSort :data="data7" :loading="loading"  @on-sort-change="sortChnage"></h-table>-->
    <!--<p>设置maxheight 800</p>-->
    <!--<h-table maxHeight="800" border width="1000" :columns="columns8" :data="data7" :loading="loading" canMove :summationData="summationData"></h-table>-->
    <!--<br>-->
    <!--<h-table height="300" border width="1000" :columns="columns8" :data="[]" :loading="loading" canMove></h-table>-->
    <!--<h-table maxheigt="300" border width="1000" :columns="columns8" :data="[]" :loading="loading" canMove></h-table>-->
    <!--<br>-->
    <!--<h-table border :columns="columns4" :data="data1" :rowSelect="true" @on-selection-change="selsetChange" :loading="loading" :summationData="summationData1">-->
      <!--<span slot="footer">恒生电子有限公司提供</span>-->
    <!--</h-table>-->
    <!--<br>-->

    <!--<h-table border :columns="columns4" :data="data1" :rowSelect="true" @on-selection-change="selsetChange" :loading="loading" :summationData="summationData1" large></h-table>-->
    <!--<br>-->

    <!--<h-table border :columns="columns4" :data="data1" :rowSelect="true" @on-selection-change="selsetChange" :loading="loading" :summationData="summationData1" small></h-table>-->
     <!--<h-table height="300" width="550" border :columns="columns2" :data="[]" :loading="loading" @on-scroll="scroll"></h-table>-->
     <!--<p>设置maxheight300</p>-->
     <!--<h-table maxHeight="300" width="550" border :columns="columns2" :data="[]" :loading="loading" @on-scroll="scroll"></h-table>-->
     <!--<h-table height="300" width="550" border :columns="columns2" :data="data4" :loading="loading" @on-scroll="scroll"></h-table>-->
     <!--<p>设置maxheight300</p>-->
     <!--<h-table maxHeight="300" width="550" border :columns="columns2" :data="data4" :loading="loading" @on-scroll="scroll"></h-table>-->
     <!--<h-table height="800" width="550" border :columns="columns2" :data="data4" :loading="loading" @on-scroll="scroll"></h-table>-->
     <!--<p>设置maxheight800</p>-->
     <!--<h-table maxHeight="800" width="550" border :columns="columns2" :data="data4" :loading="loading" @on-scroll="scroll"></h-table>-->
    <!--<br>-->
    <!--<h-button type="primary" size="large" @click="exportData(1)"><h-icon name="document"></h-icon> 导出原始数据</h-button>-->
    <!--<h-button type="primary" size="large" @click="exportData(2)"><h-icon name="document"></h-icon> 导出排序和过滤后的数据</h-button>-->
    <!--<h-button type="primary" size="large" @click="exportData(3)"><h-icon name="document"></h-icon> 导出自定义数据</h-button>-->
    <!--<h2>测试</h2>-->
    <!--<Button @on-click="resetSort">清除排序</Button>-->
    <!--<Button @on-click="moveUp">上移</Button>-->
    <!--<Button @on-click="moveDown">下移</Button>-->
     <!--<h-table height="300" :stripe="true" :columns="columns18" :data="data17" border size="small" ref="table" :loading="loading"  @on-selection-change="selsetChange">-->
        <!--<span slot="header">证券日活数据表</span>-->
        <!--<span slot="footer">恒生电子有限公司提供</span>-->
    <!--</h-table>-->
    <!--<p>设置maxheight6200</p>-->
    <!--<h-table maxHeight="6200" :stripe="true" :columns="columns18" :data="data17" border size="small" :loading="loading" :highlightRow="true" @on-selection-change="selsetChange">-->
        <!--<span slot="header">证券日活数据表</span>-->
        <!--<span slot="footer">恒生电子有限公司提供</span>-->
    <!--</h-table>-->
    <!--<br>-->
    <!--<h-table height="300" :stripe="true" :columns="columns18" :data="[]" border size="small" :loading="loading" :highlightRow="true" @on-selection-change="selsetChange">-->
        <!--<span slot="header">证券日活数据表</span>-->
        <!--<span slot="footer">恒生电子有限公司提供</span>-->
    <!--</h-table>-->
      <!--<br>-->
     <!--<h-table border canMove :columns="columns6" :data="data5" no-filtered-data-text="找不到数据" :loading="loading"></h-table>-->
     <!--<p>多级表头：</p>-->
    <!--<h-table :columns="columnsMulti" :data="dataMulti"  border :multiLevel="multiTitle" :loading="loading"></h-table>-->
  </div>
</template>
<script>
// import printJS from 'print-js/src/index'
let jsonData =require('../assets/aa.json');
import TexpandRow from './Texpand-row.vue'
export default {
  name: 'tableq',
  components:{TexpandRow},
  data () {
    return {
      bigData:jsonData,
      msgbox:false,
      loading:false,
      multiLevel1:[
        {title:'123',cols:2,},
        {title:'123',cols:2,},
        {title:'123',cols:2,},
        {title:'123',cols:2,},
        {title:'456', fixed:"right"},
        {title:'789', fixed:"left"},
      ],
      multiLevel2:[
        [
          {title:'123',rows:2,align:'center',className:'demo-table-info-column'},
          {title:'123',rows:2,align:'center',className:'demo-table-info-column'},
          {title:'123',rows:2,align:'center',className:'demo-table-info-column'},
          {title:'123',rows:2,align:'center',className:'demo-table-info-column'},
          {title:'456',cols:3,align:'center'},
        ],
        [
          {title:'123'},
          {title:'456'},
          {title:'456'},
        ],
      ],
      columns: [
        {
          title: '姓名',
          key: 'name',
          width: 100,
          ellipsis:true,
        },
        {
          title: '姓名1',
          key: 'name',
          ellipsis:true,
        },
        {
          title: '年龄',
          key: 'age',
          width: 100,
          ellipsis:true,
          sortable: true
        },
        {
          title: '年龄1',
          key: 'age',
          ellipsis:true,
        },
        {
          title: '省份',
          key: 'province',
          width: 100,
          ellipsis:true,
          sortable: true
        },{
          title: '省份1',
          key: 'province',
          ellipsis:true
        },
        {
          title: '市区',
          key: 'city',
          width: 100,
          ellipsis:true,
          sortable: true
        },{
          title: '市区1',
          key: 'city',
          ellipsis:true
        },
        {
          type: 'text',
          title: '地址',
          key: 'address',
          width: 200,
          ellipsis:true
        },{
          type: 'text',
          title: '地址1',
          key: 'address',
          ellipsis:true
        },
        {
          title: '邮编',
          key: 'zip',
          width: 120,
          ellipsis:true,
          headerTooltip: true
        },{
          title: '邮编1',
          key: 'zip',
          ellipsis:true,
          headerTooltip: true
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('h-button', {
                props: {
                  type: 'info',
                  size: 'small'
                }
              }, '查看'),
              h('h-button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, '编辑')
            ]);
          },
          ellipsis:true
        }
      ],
      columns18: [
         {
            type: "selection",
            width: 120,
            align: "center",
            renderHeader: (h, params) => {
              return h('div', [
                  h('checkbox', {
                      on: {
                          'on-change': (value) => {
                          }
                      }
                  }),
                  h('h-icon',{
                      props:{
                          name:'android-arrow-dropdo'
                      },
                      style:{
                          position:'absolute',
                          marginLeft:'5px'
                      },on: {
                          'on-click': (value) => {
                               console.log("click")
                          }
                      }
                  })
              ])
            },
            fixed: "left",
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
             renderFilter:(h,params)=>{
               return h('span','filter测试')
             },
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
                   label: '大于40001',
                   value: 1
               },
               {
                   label: '小于40001',
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
      data17: [
        {
            "name": "推广名称1",
            "fav": 0,
            "show": "730,124,2",
            "weak": "730,124,2",
            "signin": null,
            "click": '0254111111111111111111111111111111111111',
            "active": 1438,
            "day7": 274,
            "day30": 285,
            "tomorrow": 1727,
            "day": 558,
            "week": 4440,
            "month": 5610
        },
        {
            "name": "推广名称2",
            "fav": 0,
            "show": 4720,
            "weak": 4086,
            "signin": null,
            "click": 8690,
            "active": 8470,
            "day7": 8172,
            "day30": 5197,
            "tomorrow": 1684,
            "day": 2593,
            "week": 2507,
            "month": 1537
        },
        {
            "name": "推广名称3",
            "fav": 0,
            "show": 7181,
            "weak": 8007,
            "signin": 8477,
            "click": 1879,
            "active": 16,
            "day7": 2249,
            "day30": 3450,
            "tomorrow": 377,
            "day": 1561,
            "week": 3219,
            "month": 1588
        },
        {
            "name": "推广名称4",
            "fav": 0,
            "show": 9911,
            "weak": 8976,
            "signin": 8807,
            "click": 8050,
            "active": 7668,
            "day7": 1547,
            "day30": 2357,
            "tomorrow": 7278,
            "day": 5309,
            "week": 1655,
            "month": 9043
        },
        {
            "name": "推广名称5",
            "fav": 0,
            "show": 934,
            "weak": 1394,
            "signin": 6463,
            "click": 5278,
            "active": 9256,
            "day7": 209,
            "day30": 3563,
            "tomorrow": 8285,
            "day": 1230,
            "week": 4840,
            "month": 9908
        },
        {
            "name": "推广名称6",
            "fav": 0,
            "show": 6856,
            "weak": 1608,
            "signin": 457,
            "click": 4949,
            "active": 2909,
            "day7": 4525,
            "day30": 6171,
            "tomorrow": 1920,
            "day": 1966,
            "week": 904,
            "month": 6851
        },
        {
            "name": "推广名称7",
            "fav": 0,
            "show": 5107,
            "weak": 6407,
            "signin": 4166,
            "click": 7970,
            "active": 1002,
            "day7": 8701,
            "day30": 9040,
            "tomorrow": 7632,
            "day": 4061,
            "week": 4359,
            "month": 3676
        },
        {
            "name": "推广名称8",
            "fav": 0,
            "show": 862,
            "weak": 6520,
            "signin": 6696,
            "click": 3209,
            "active": 6801,
            "day7": 6364,
            "day30": 6850,
            "tomorrow": 9408,
            "day": 2481,
            "week": 1479,
            "month": 2346
        },
        {
            "name": "推广名称9",
            "fav": 0,
            "show": 567,
            "weak": 5859,
            "signin": 128,
            "click": 6593,
            "active": 1971,
            "day7": 7596,
            "day30": 3546,
            "tomorrow": 6641,
            "day": 1611,
            "week": 5534,
            "month": 3190
        },
        {
            "name": "推广名称10",
            "fav": 0,
            "show": 3651,
            "weak": 1819,
            "signin": 4595,
            "click": 7499,
            "active": 7405,
            "day7": 8710,
            "day30": 5518,
            "tomorrow": 428,
            "day": 9768,
            "week": 2864,
            "month": 5811
        }
      ],
      columns1: [
       {
        title:'测试',
        key:'ceshi',
        algin:'center',
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
          key: 'name'
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
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          type: 'selection',
          renderHeader:(h, params)=>{
            return h('span','')
          },
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
      columns5: [
        {
          title: '日期',
          key: 'date',
          sortable: 'custom',
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age',
          sortable: true,
          sortMethod(a,b,type){
            if (type=='desc') {
              return a>b;
            }else{
              return b>a;
            }
          }
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      columns6: [
        {
          title: '日期',
          key: 'date'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age',
          sortable: true,
          filters: [
            {
              label: '大于50岁',
              value: 1
            },
            {
              label: '小于50岁',
              value: 2
            }
          ],
          // filteredValue:['18','25'],
          filterMultiple: false,
          filterRemote(_this,arg1){
            this.data5.push({
              name: '王小明1',
              age: 20,
              address: '北京市朝阳区<\/br>芍药居',
              date: '2016-10-03'
            },);
          },
          filterMethod (value, row) {
            if (value === 1) {
              return row.age > 50;
            } else if (value === 2) {
              return row.age < 50;
            }
          }
        },
        {
          title: '地址',
          key: 'address',
          filters: [
            {
              label: '北京',
              value: '北京'
            },
            {
              label: '上海',
              value: '上海'
            },
            {
              label: '深圳',
              value: '深圳'
            }
          ],
          filterMethod (value, row) {
            return row.address.indexOf(value) > -1;
          }
        }
      ],
      columns7: [
        {
          title: '姓名',
          key: 'name',
          render: (h, params) => {
            console.log(params.row._index)
            if (params.row._index==3) {
              return h('div',{
                  attrs:{
                    title:'123'
                  }
                }, [
                  h('h-icon', {
                    props: {
                      name: 'addressbook'
                    }
                  }),
                  h('strong', params.row.name)
              ]);
            }else{
              return h('span',params.row.name)
            }

          },
          renderHeader:(h, params)=>{
            return h('span','123')
          }
        },
        {
          title: '年龄',
          key: 'age',
          render:(h,params)=>{
            return h('div', [
              h('Input', {
                props: {
                  value:params.row.age,
                },
                on:{
                   'on-change': (event)=>{
                      // params.row.numLots = event.target.value;
                      // this.data[params.index] = params.row;
                  }
                 }
              })
            ])
          }
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
      columns2: [
        {
          title: '姓名',
          key: 'name',
          width: 100,
          fixed: 'left',
          ellipsis:true,
          type: 'html'
        },
        {
          title: '年龄',
          key: 'age',
          width: 100,
          ellipsis:true,
        },
        {
          title: '省份',
          key: 'province',
          width: 100,
          ellipsis:true
        },
        {
          title: '市区',
          key: 'city',
          width: 100,
          ellipsis:true
        },
        {
          type: 'text',
          title: '地址',
          key: 'address',
          width: 200,
          ellipsis:true
        },
        {
          title: '邮编',
          key: 'zip',
          width: 120,
          ellipsis:true,
          headerTooltip: true
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('h-button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  }
              }, '查看'),
              h('h-button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  }
              }, '编辑')
            ]);
          },
          ellipsis:true
        }
      ],
      columns8: [
        {
          type: 'index',
          width: 60,
          key:"index",
          align: 'center',
          fixed: "left"
        },
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },

        {
          title: "名称",
          key: "name",
          sortable: true,
          width: 100,
          // fixed: "right",
        },
        {
          title: "展示",
          key: "show",
          sortable: true,
          // fixed: "left",
          // hiddenCol:true,//通过在column中设置hiddenCol表示该列是否隐藏
          // filters: [
          //   {
          //     label: '大于4000',
          //     value: 1
          //   },
          //   {
          //     label: '小于4000',
          //     value: 2
          //   }
          // ],
          // filterMultiple: false,
          // filterMethod (value, row) {
          //   if (value === 1) {
          //     return row.show > 4000;
          //   } else if (value === 2) {
          //     return row.show < 4000;
          //   }
          // }
        },
        // {
        //   title: "唤醒",
        //   key: "weak",
        //   width: 150,
        //   sortable: true,
        //   // hiddenCol:true,
        // },
        // {
        //   title: "登录",
        //   key: "signin",
        //   width: 150,
        //   sortable: true
        // },
        // {
        //   title: "点击",
        //   key: "click",
        //   width: 150,
        //   sortable: true
        // },
        // {
        //   title: "激活",
        //   key: "active",
        //   width: 150,
        //   sortable: true
        // },
        // {
        //   title: "7日留存",
        //   key: "day7",
        //   width: 150,
        //   // sortable: true
        // },
        // {
        //   title: "30日留存",
        //   key: "day30",
        //   width: 150,
        //   // sortable: true
        // },
        // {
        //   title: "次日留存",
        //   key: "tomorrow",
        //   width: 150,
        //   // sortable: true
        // },
        // {
        //   title: "日活跃",
        //   key: "day",
        //   width: 150,
        //   // sortable: true
        // },
        // {
        //   title: "周活跃",
        //   key: "week",
        //   width: 150,
        //   // fixed: "right",
        //   // sortable: true
        // },
        // {
        //   title: "月活跃",
        //   key: "month",
        //   width: 150,

        //   // fixed: "right",
        //   // sortable: true
        // }
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
      columnsMulti: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age',
        },
        {
          title: '地址',
          key: 'address'
        },
         {
          title: '备注',
          key: 'status'
        }
      ],
      columns10: [
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
        {
          type:'selection',
          width:60
        },
        {
          title: '姓名',
          key: 'name'
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
      data0:[],
      data1: [
        {
          name: 0,
          age: 18,
          address: '北京市朝阳区\r芍药居',
          // _disabled:true,
          _checked:true,
        },
        {
          name: 0,
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
      data3: [
        {
          name: '<b>王小明',
          age: 18,
          address: '<b>北京市朝阳\r区芍药居</b>',
          province: '北京市',
          city: '朝阳区',
          zip: 100000
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          province: '北京市',
          city: '海淀区',
          zip: 100000
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          province: '上海市',
          city: '浦东新区',
          zip: 100000
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          province: '广东',
          city: '南山区',
          zip: 100000
        }
      ],
      data5: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳<\/br>区芍药居',
          date: '2016-10-03'
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          date: '2016-10-01'
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          date: '2016-10-02'
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          date: '2016-10-04'
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
      data4: [
        {
          name: '<a href="javascript:alert(1);">王小明</a>',
          age: 18,
          address: '北京市朝阳区芍药居',
          province: '北京市',
          city: '朝阳区',
          zip: 100000
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          province: '北京市',
          city: '海淀区',
          zip: 100000
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          province: '上海市',
          city: '浦东新区',
          zip: 100000
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          province: '广东',
          city: '南山区',
          zip: 100000
        },
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区芍药居',
          province: '北京市',
          city: '朝阳区',
          zip: 100000
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          province: '北京市',
          city: '海淀区',
          zip: 100000
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          province: '上海市',
          city: '浦东新区',
          zip: 100000
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          province: '广东',
          city: '南山区',
          zip: 100000
        }
      ],
      data7: [
        {
          name: "推广名称1",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },
        {
          name: "推广名称2",
          fav: 0,
          show: 4720,
          weak: 4086,
          signin: 3792,
          click: 8690,
          active: 8470,
          day7: 8172,
          day30: 5197,
          tomorrow: 1684,
          day: 2593,
          week: 2507,
          month: 1537
        },
        {
          name: "推广名称3",
          fav: 0,
          show: 7181,
          weak: 8007,
          signin: 8477,
          click: 1879,
          active: 16,
          day7: 2249,
          day30: 3450,
          tomorrow: 377,
          day: 1561,
          week: 3219,
          month: 1588
        },
        {
          name: "推广名称4",
          fav: 0,
          show: 9911,
          weak: 8976,
          signin: 8807,
          click: 8050,
          active: 7668,
          day7: 1547,
          day30: 2357,
          tomorrow: 7278,
          day: 5309,
          week: 1655,
          month: 9043
        },
        {
          name: "推广名称5",
          fav: 0,
          show: 934,
          weak: 1394,
          signin: 6463,
          click: 5278,
          active: 9256,
          day7: 209,
          day30: 3563,
          tomorrow: 8285,
          day: 1230,
          week: 4840,
          month: 9908
        },
        {
          name: "推广名称6",
          fav: 0,
          show: 6856,
          weak: 1608,
          signin: 457,
          click: 4949,
          active: 2909,
          day7: 4525,
          day30: 6171,
          tomorrow: 1920,
          day: 1966,
          week: 904,
          month: 6851
        },
        {
          name: "推广名称7",
          fav: 0,
          show: 5107,
          weak: 6407,
          signin: 4166,
          click: 7970,
          active: 1002,
          day7: 8701,
          day30: 9040,
          tomorrow: 7632,
          day: 4061,
          week: 4359,
          month: 3676
        },
        {
          name: "推广名称8",
          fav: 0,
          show: 862,
          weak: 6520,
          signin: 6696,
          click: 3209,
          active: 6801,
          day7: 6364,
          day30: 6850,
          tomorrow: 9408,
          day: 2481,
          week: 1479,
          month: 2346
        },
        {
          name: "推广名称9",
          fav: 0,
          show: 567,
          weak: 5859,
          signin: 128,
          click: 6593,
          active: 1971,
          day7: 7596,
          day30: 3546,
          tomorrow: 6641,
          day: 1611,
          week: 5534,
          month: 3190
        },
        {
          name: "推广名称10",
          fav: 0,
          show: 3651,
          weak: 1819,
          signin: 4595,
          click: 7499,
          active: 7405,
          day7: 8710,
          day30: 5518,
          tomorrow: 428,
          day: 9768,
          week: 2864,
          month: 5811
        }
      ],
      data8: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区芍药居',
          _disabled:true,
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          cellClassName: {
              age: 'demo-table-info-cell-age',
              address: 'demo-table-info-cell-address'
          },
          _disabled:true,
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          _disabled:true,
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          cellClassName: {
              name: 'demo-table-info-cell-name'
          },
          _disabled:true,
        }
      ],
      data9: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区芍药居',
          job: '数据工程师',
          interest: '羽毛球',
          birthday: '1991-05-14',
          book: '乔布斯传',
          movie: '致命魔术',
          music: 'I Cry',
          _expanded:true,
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
          job: '数据科学家',
          interest: '排球',
          birthday: '1989-03-18',
          book: '我的奋斗',
          movie: '罗马假日',
          music: 'My Heart Will Go On'
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
          job: '数据产品经理',
          interest: '网球',
          birthday: '1992-01-31',
          book: '赢',
          movie: '乔布斯',
          music: 'Don’t Cry'
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
          job: '数据分析师',
          interest: '桌球，跑步',
          birthday: '1988-7-25',
          book: '红楼梦',
          movie: '倩女幽魂',
          music: '演员'
        }
      ],
      aaa: '',
      dataMulti: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区\r芍药居',
          // _disabled:true,
          status:"hui让业务开发变得简单，给程序猿带来更快、更炫、更灵活、更轻松的开发体验；它更 让系统页面加载速度更快",
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗',
           status:"hui让业务开发变得简单，给程序猿带来更快、更炫、更灵活、更轻松的开发体验；它更 让系统页面加载速度更快",
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道',
           status:"hui让业务开发变得简单，给程序猿带来更快、更炫、更灵活、更轻松的开发体验；它更 让系统页面加载速度更快",
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道',
           status:"hui让业务开发变得简单，给程序猿带来更快、更炫、更灵活、更轻松的开发体验；它更 让系统页面加载速度更快",
        }
      ],
      summationData: [{
        name: '12313',
        fav: 0,
        show: 730211221,
        weak: 5627223123,
        signin: 1563123123,
        click: 425413,
        active: 1438123,
        day7: 27412312,
        day30: 285123,
        tomorrow: 1727123,
        day: 558,
        week: 4440,
        month: 5610
      }],
      summationData1: [{
        name: 'qeqweqw',
        age: 123123123,
        address: 'qqweqwe'
      }],
       multiTitle:[
         {title:'姓名信息',cols:1,rows:1,align:'center',hiddenCol:false},
        {title:'基本信息',cols:2,align:'center'},
        {title:'详情',cols:1,align:'center'},
      ],
    }
  },
  methods:{
    changeHidden(){
      this.$set(this.columns1[3],'hiddenCol',!this.columns1[3].hiddenCol);
    },
    setMult(){
      this.$set(this.multiLevel1[0],'hiddenCol',true);
    },
    getData () {
      this.data7 = [{
          name: "推广名称1qweqwe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1qweqweqwe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        },{
          name: "推广名称1sqeqwewe",
          fav: 0,
          show: 7302,
          weak: 5627,
          signin: 1563,
          click: 4254,
          active: 1438,
          day7: 274,
          day30: 285,
          tomorrow: 1727,
          day: 558,
          week: 4440,
          month: 5610
        }]
    },
    handleDrop(a, b) {
      console.log('drag: ' + a + ', drop: ' + b)
    },
    refresh () {
      //  this.$route.meta.isKeepAlive = false
       this.$parent.isKeepAlive = false
        // this.$store.dispatch('refreshCurPage', 'table')
          // this.$route.meta.comName = ''
          this.$parent.page = ''

        this.$nextTick(() => {
       this.$parent.isKeepAlive = true

          // this.$route.meta.isKeepAlive = true
          // this.$route.meta.isDestroy = false
          // this.$route.meta.comName = 'table'
          this.$parent.page = 'tableq'


          // this.$store.dispatch('addRouteKeepAlive', 'table')
        })
    },
    resetSort(){
      this.$refs.table.handleSort('all','normal');
    },
    changemsg(){
      this.msgbox = !this.msgbox;
    },
    addData() {
      this.data0 = this.data4
    },
    removeData(){
      this.data0 = []
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
      console.log(num);
    },
    setLoading(){
      this.loading = !this.loading;
    },
    click1 (selection) {
      console.log(selection);
    },
    rowclick(){
      console.log('你点击了某一行');
    },
    rowdblclick(e,i){
      console.log('你双击了某一行');
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
    radioChange (currentRow,oldRow,index){
      console.log(currentRow);
      console.log(oldRow);
      console.log(index);
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
        this.$refs.table.exportCsv({
            filename: '原始数据',
        });
      } else if (type === 2) {
        this.$refs.table.exportCsv({
            filename: '排序和过滤后的数据',
            original: false
        });
      } else if (type === 3) {
        this.$refs.table.exportCsv({
            filename: '自定义数据',
            columns: this.columns8.filter((col, index) => index < 4),
            data: this.data7.filter((data, index) => index < 4)
        });
      }
    },
    moveUp(){

    },
    moveDown(){

    },
    sortChnage(obj){
      console.log(obj)
    }
  },
  mounted(){
    this.columns1=[
        {
          type: 'radio',
          width:60,
          align:'center',
          fixed:'right',
        },
        {
          type: 'drag',
          width: 60,
          fixed: 'right',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          width:200,
          fixed:'right',
        },
        {
          title: '年龄',
          key: 'age',
          sortable: true
        },
        {
          title: '地址',
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
          sortType:'asc',
        },
        {
          title: '地址5',
          key: 'marketNo',
          sortType:'asc',
        },
        {
          title: '地址6',
          key: 'tradeQuantity',
          sortType:'asc',
        }
    ]
  },
}
</script>
<style type="text/css">
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
.h-table th.demo-table-info-column{
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

</style>
