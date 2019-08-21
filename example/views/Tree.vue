<template>
  <div>
    <h-row>
      <h-col span='6'>
        <h2>基本用法</h2>
        <h-tree :data="test" ref="test" @on-right-click="rightclick" @on-toggle-expand="checkChnage"></h-tree>
        <h-button @on-click="ok">赋值</h-button>
        <h-button @on-click="cancle">取消</h-button>
        <h-button @on-click="select">选择</h-button>
        <h-button @on-click="select(false)">取消选中</h-button>
      </h-col>

      <h-col span='6'><h2>显示勾选框</h2><h-tree :data="data2" checkStrictly isBoxRight selectToCheck multiple show-checkbox @on-check-change="checkChnage" @on-toggle-expand="checkChnage" @on-mouseover="checkChnage"></h-tree></h-col>
      <h-col span='6'><h2>异步加载</h2><h-tree :data="data3" :load-data="loadData" show-checkbox  @on-right-click="rightclick"></h-tree> </h-col>
      <h-col span='6'><h2>默认展开、选中、勾选和禁用</h2><h-tree :data="data4" show-checkbox multiple></h-tree> </h-col>
    </h-row>
    <h-row>
      <h-col span='6'><h2>多选</h2><h-tree :data="data11" multiple></h-tree></h-col>
      <h-col span='6'><h2>父子组件不联动</h2><h-tree :data="data22" show-checkbox checkStrictly @on-check-change="checkChnage"></h-tree></h-col>
      <h-col span='6'><h2>不显示不确定性状态</h2><h-tree :data="data33" show-checkbox showIndeterminate></h-tree> </h-col>
      <h-col span='6'><h2>自定义节的内容</h2> <h-tree :data="data5" :render="renderContent"></h-tree></h-col>
    </h-row>
    <h-row>
      <h-col span="8">
        测试leaf
        <h-tree :data="baseData" show-checkbox @on-check-change="handleChange" @on-toggle-expand="showExpand"></h-tree>
      </h-col>
      <h-col span="8">
        <h-tree :data="baseData3" show-checkbox showIndeterminate></h-tree>
      </h-col>
      <h-col span="8">
        <h2>123</h2>
        <h-tree :data="baseData2" @on-select-change="showChange" ></h-tree>
      </h-col>
    </h-row>
    <h-row>
      <h-col span="8">
        <h-tree :data="baseData1" show-checkbox checkStrictly></h-tree>
      </h-col>
      <h-col span="8">
        <h-tree :data="baseData2" show-checkbox ></h-tree>
      </h-col>
      <h-col span="8">
        <h-tree :data="baseData2" @on-select-change="showChange" isAlwaysSelect></h-tree>
      </h-col>
    </h-row>
    <h1>过滤高亮</h1>
    <h-input v-model="query"></h-input>
    <Button @click="changeFocus(-1)">上一个</Button>
    <Button @click="changeFocus(1)">下一个</Button>
    <div style="height:100px;overflow:auto;position:relative" ref="list">
      <h-tree :data="data2" ref="filter"></h-tree>
    </div>
    <!-- <h-tree :data="data2" ref="filter" show-checkbox onlyUpdateDown></h-tree> -->
  </div>
</template>
<script>
  import {deepCopy} from '../../src/util/tools.js'
  let bigObj = [];
  let curdata=[]
  for(var i=0;i<10;i++){
    var obj = {
      title: 'children',
      loading: false,
      children: []
    };
    curdata.push(obj)
  }
  bigObj = curdata;
  export default {
    data () {
      return {
        curIndex:null,
        bd: [],
        baseData: [
          {
            title: 'parent',
            id: '1-0',
            children: [
              {
                title: 'child1',
                id: '1-1',
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1',
                    leaf:true
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2',
                    leaf:true
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: []
              }
            ]
          }
        ],
        baseData1: [
          {
            title: 'parent',
            id: '1-0',
            expand: true,
            children: [
              {
                title: 'child1',
                id: '1-1',
                expand: true,
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1'
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2'
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: []
              }
            ]
          }
        ],
        baseData2: [{
          expand: true,
          title: 'parent 1',
          children: [{
            title: 'parent 1-0',
            expand: true,
            disabled: true,
            children: [{
              title: 'leaf',
              disableCheckbox: true
            }, {
              title: 'leaf',
            }]
          }, {
            title: 'parent 1-1',
            expand: true,
            checked: true,
            children: [{
              title: '<span style="color: red">leaf</span>',
            }]
          }]
        }],
        baseData3: [
          {
            title: 'parent',
            id: '1-0',
            expand: true,
            children: [
              {
                title: 'child1',
                id: '1-1',
                expand: true,
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1'
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2'
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: []
              }
            ]
          }
        ],
        data1: [
          {
            title: 'parent 1',
            id: '1',
            expand: true,
            hasPage: 'true',
            children: [
              {
                title: 'parent 1-1',
                id: '2',
                expand: true,
//                disabled:true,
                children: [
                  {
                    title: 'leaf 1-1-1',
                    id: '3',
                  },
                  {
                    title: 'leaf 1-1-2',
                    id: '4',
                  }
                ]
              },
              {
                title: 'parent 1-2',
                id: '5',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1',
                    id: '5',
                  },
                  {
                    title: 'leaf 1-2-1',
                    id: '6',
                  }
                ]
              }
            ]
          }
        ],
        data2: [
          {
            title: 'parent 1',
            expand: false,
            children: [
              {
                title: 'parent 1-1',
                expand: false,
                checked: 'true',
                children: [
                  {
                    title: 'leaf 1-1-1',
                    checked: 'false',
                    disabled: 'false'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        data3: [
          {
            title: 'parent-autoload',
            loading: false,
            autoLoad: 'true',
            expand: true,
            children: []
          },
          {
            title: 'parent112-autoload',
            expand: false,
            loading: false,
            autoLoad: true,
            children: []
          }
        ],
        data11: [
          {
            title: 'parent 1',
            expand: 'true',
            children: [
              {
                title: 'parent 1-1',
                expand: 'false',
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        data22: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                checked: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        data33: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        data4: [
          {
            title: 'parent 1',
            expand: true,
            selected: 'true',
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                selected: 'true',
                children: [
                  {
                    title: 'leaf 1-1-1',
                    disabled: 'false'
                  },
                  {
                    title: 'leaf 1-1-2',
                    disableCheckbox:'false'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1',
                    checked: true
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        data5: [
          {
            title: 'parent 1',
            expand: true,
            render: (h, { root, node, data }) => {
              return h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%'
                }
              }, [
                h('span', [
                  h('h-icon', {
                    props: {
                      name: 'android-folder-open'
                    },
                    style: {
                      marginRight: '8px'
                    }
                  }),
                  h('span', data.title)
                ]),
                h('span', {
                  style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '32px'
                  }
                }, [
                  h('h-button', {
                    props: Object.assign({}, this.buttonProps, {
                      icon: 'plus',
                      type: 'primary'
                    }),
                    style: {
                      width: '52px'
                    },
                    on: {
                      click: () => { this.append(data) }
                    }
                  })
                ])
              ]);
            },
            children: [
              {
                title: 'child 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1',
                    expand: true
                  },
                  {
                    title: 'leaf 1-1-2',
                    expand: true
                  }
                ]
              },
              {
                title: 'child 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1',
                    expand: true
                  },
                  {
                    title: 'leaf 1-2-1',
                    expand: true
                  }
                ]
              }
            ]
          }
        ],
        buttonProps: {
          type: 'ghost',
          size: 'small',
        },
        test:[],
        query:'',
      }
    },
    methods: {
      rightclick(d,e) {
        console.log(d,e)
      },
      changeFocus(num){
        let queryEl = this.$refs.filter.$el.querySelectorAll('.h-tree-title-filterable');
        let allIndex = queryEl.length
        if(this.curIndex == null||(this.curIndex==0&&num<0)){
          this.curIndex = 0
        }else if(this.curIndex== allIndex && num>0){
          this.curIndex = allIndex
        }else{
          this.curIndex = this.curIndex + num
        }
        if (queryEl[this.curIndex]) {
          let top = queryEl[this.curIndex].offsetTop
          this.$refs.list.scrollTop = top;
        }else{
          this.$refs.list.scrollTop = 0;
        }
      },
      loadData (item, callback) {
        setTimeout(() => {
          const data = [{
            title: 'children',
            loading: false,
            children: [],
            leaf:true,
          },{title: 'children2',
            loading: false,
            children: []
          }]
          callback(data);
        }, 1000);
      },
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('h-icon', {
              props: {
                name: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('h-button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'plus-round'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => { this.append(data) }
              }
            }),
            h('h-button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'minus-round'
              }),
              on: {
                click: () => { this.remove(root, node, data) }
              }
            })
          ])
        ]);
      },
      append (data) {
        const children = data.children || [];
        children.push({
          title: 'appended node',
          expand: true
        });
        this.$set(data, 'children', children);
      },
      remove (root, node, data) {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        parent.children.splice(index, 1);
      },
      handleSelectChange (data) {
        // console.log(data);
      },
      updateTree (data) {
        data[0].children[0].checked = true;
        data[0].children[0].children[0].checked = true;
        data[0].children[0].children[1].checked = true;
      },
      handleChange () {
        // console.log(1)
      },
      showChange(arr){
        console.log(arr)
      },
      showExpand (payload) {
        console.log(payload)
      },
      checkChnage(data,status){
        console.log(data);
        console.log(status);
      },
      ok(){
        this.test = this.data1;
      },
      select(status = true){
        this.$refs.test.nodeSelect('id','3',status);
      },
      cancle(){
        this.test = [];
      }
    },
    mounted () {
      // this.updateTree(this.baseData);
    },
    watch: {
      query(val){
        this.$refs.filter.filterHighlight(val)
      }
    }
  }
</script>
