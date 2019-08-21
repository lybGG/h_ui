<template>
  <div>
    <h-row>
      <h-col span="8">
       <h-button @click="click('1')">设置1</h-button>
       <h-button @click="click('2')">设置2</h-button>
       <h-button @click="click('3')">设置3</h-button>
       <h-button @click="click('4')">设置4</h-button>
      </h-col>
      <Button @on-click="testClick(true)">获取焦点</Button>
      <Button @on-click="testClick(false)">失去焦点</Button>
      <h-col span="8">
        <h-select-tree v-model="valc" :first-value="firstValc" style="width:200px" :data="baseData1" placement="top" placeholder="你好" filterable ref="test"></h-select-tree>
      </h-col>
      <h-button @click="ceshi">清空</h-button>
      <h-col span="8">
        <h-select-tree v-model="valc" :first-value="firstValc" style="width:200px" :data="baseData1" placement="top" placeholder="你好"></h-select-tree>
      </h-col>
      <h-col span="8">
        <h-select-tree v-model="valc" :first-value="firstValc" style="width:200px" :data="baseData1" placement="top" placeholder="你好" :editable="false"></h-select-tree>
      </h-col>
    </h-row>
    {{val}}
    {{valc}}
    <br><br><br>
    <h2>showCheckbox表示多选默认不显示半选中状态</h2>
    <h-select-tree :data="baseData3"></h-select-tree>
    {{val1}}
    <h-select-tree v-model="val2" style="width:200px" :data="baseData" onlyChild showCheckbox isString></h-select-tree>
    {{val2}}
    <h-select-tree v-model="val4" :data="baseData" showCheckbox disabled></h-select-tree>
    <br><br><br>
    {{val4}}
    <h-select-tree v-model="val5" style="width:200px" :data="baseData3" :first-value="firstVal5" showCheckbox checkStrictly></h-select-tree>
    {{val5}}
    <h2>输入框在上搜索</h2>
    <h-select-tree v-model="val3" style="width:200px" :data="baseData4" filterable></h-select-tree>
    {{val3}}
    <h-select-tree v-model="val6" style="width:200px" :data="baseData5" showCheckbox checkStrictly filterable></h-select-tree>
    {{val6}}
    <h-select-tree v-model="val7" style="width:200px" :data="baseData5" showCheckbox filterable></h-select-tree>
    {{val7}}
    <h2>输入框在下搜索</h2>
    <h-select-tree v-model="val31" style="width:200px" :data="baseData4" filterable showBottom searchHolder="123" transfer></h-select-tree>
    {{val3}}
    <h-select-tree v-model="val61" style="width:200px" :data="baseData5" showCheckbox checkStrictly filterable showBottom transfer></h-select-tree>
    {{val6}}
    <h-select-tree v-model="val71" style="width:200px" :data="baseData5" showCheckbox filterable showBottom></h-select-tree>
    {{val71}}
    <!-- <h-msg-box v-model="showBox"> -->
      <h-select-tree v-model="val" format-value="id" :first-value="firstVal" :data="baseData2" size="large" @on-select-change="selectChange" @on-toggle-expand="selectChange"></h-select-tree>
    <!-- </h-msg-box> -->
    <br><br>
    <h-select-tree v-model="val" style="width:200px" :data="baseData" isAlwaysSelect></h-select-tree>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showBox:false,
        val:'',
        firstVal:null,
        valc: '',
        firstValc: 'parent',
        val1:[],
        val2:[],
        firstVal2:['child1'],
        firstVal1:['child1-1-1','child1-1-2'],
        val3:'',
        val31:'',
        val4:[],
        val5:[],
        firstVal5:["parent 1-0", "leaf"],
        val6:[],
        val61:[],
        val7:[],
        val71:[],
        baseData: [
          {
            title: 'parent11111111111111111111111111111111111111111',
            id: '1-0',
            expand:'true',
            children: [
              {
                title: 'child1',
                id: '1-1',

                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1',
                    checked:'false'
                  },
                  {
                    title: 'child1-1-2',
                    id: '1-1-2',
                    checked:'false'
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
            expand:'true',
            children: [
              {
                title: 'child1',
                id: '1-1',
                children: [
                  {
                    title: 'child1-1-1',
                    id: '1-1-1',
                    disabled:true,
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
        baseData2: [],
        baseData3: [{"title":"存款账户","id":"DA0016","expand":true,"children":[{"title":"托管","id":"5001-2"}],"disabled":"true"}],
        baseData4: [
          {
            title: 'parent你好',
            id: 1,
            children: [
              {
                title: 'child1',
                id: 2,

                children: [
                  {
                    title: 'child1-1-1',
                    id: 3,
                    children: [
                      {
                        title: 'child1-1-1-1',
                        id: 4
                      }]
                  },
                  {
                    title: 'child1-1-2',
                    id: 5,
                  }
                ]
              },
              {
                title: 'child2',
                id: '1-2',
                children: [
                  {
                    title: 'child1-2-1',
                    id: '1-2-1',
                    children: [
                      {
                        title: 'child1-2-1-1',
                        id: '1-2-1-1'
                      }]
                  },
                  {
                    title: 'child1-2-2',
                    id: '1-2-2',
                  }
                ]
              },
              {
                title: 'child3',
                id: '1-3',
                children: [
                  {
                    title: 'child1-3-1',
                    id: '1-3-1',
                    children: [
                      {
                        title: 'child1-3-1-1',
                        id: '1-3-1-1'
                      }]
                  },
                  {
                    title: 'child1-3-2',
                    id: '1-3-2',
                  }
                ]
              },
              {
                title: 'child4',
                id: '1-4',
                children: []
              },
              {
                title: 'child5',
                id: '1-5',
                children: []
              }
            ]
          }
        ],
        baseData5: [],
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
      ceshi(){
        this.valc='';
      },
      click(num){
        this.showBox=true;
        if(num=='4'){
          this.firstVal = '9';
        }else{
          this.firstVal = num;
        }
      },
      selectChange(data){
        console.log(data);
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
        // console.log(arr)
      },
      showExpand (payload) {
        console.log(payload)
      }
    },
    mounted () {
      // this.firstVal = '1';
      this.baseData2= [{
            title: 'parent 1',
            id:2,
            children: [{
              title: 'parent 1-0',
              id:1,

              children: [{
                title: 'leaf',
                id:3,
                disableCheckbox: true
              }, {
                title: 'leaf',
                id:4,
              }]
            }, {
              title: 'parent 1-1',
              id:5,

              children: [{
                title: 'leaf',
                id:6,
              }]
            }]
        }];
      // this.updateTree(this.baseData);
      this.firstVal = 2
       this.baseData5= [{
            title: 'parent 1',
            children: [{
              title: 'parent 1-0',

              children: [{
                title: 'leaf',
                disableCheckbox: true
              }, {
                title: 'leaf',
              }]
            }, {
              title: 'parent 1-1',

              checked: true,
              children: [{
                title: 'leaf',
              }]
            }]
        }]
    }
  }
</script>
