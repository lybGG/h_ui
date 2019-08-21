<template>
	<div>
    <h1>省市测试</h1>
    {{ceshi}}
    <h-cascader :data="cityData" style="width:200px" setProviceCity v-model="ceshi"></h-cascader>
	  <h1>基本用法</h1>
    <p>级联选择对数据有较严格要求，请参照示例的格式使用data，每项数据至少包含 value、label 两项，子集为 children，以此类推。<br>
    value 为当前选择的数据的 value 值的数组，比如 ['beijing', 'gugong'] ，按照级联顺序依次排序，使用 v-model 进行双向绑定。</p>
    <h-cascader :data="data" v-model="value1" style="width:200px"></h-cascader>
    <h2>多选模式</h2>
    <h-cascader :data="data" v-model="mValue" multiple style="width:200px"></h-cascader>
    <h2>指定 value 默认值，组件会在初始化时选定数据</h2>
    <h-cascader :data="data" v-model="value2" style="width:200px"></h-cascader>
    <h2>设置属性 trigger 为 hover，当鼠标悬停时就会展开子集。</h2>
    <h-cascader :data="data" trigger="hover" style="width:200px"></h-cascader>
    <h2>自定义显示</h2>
    <p></p>
    {{text}}
    <h-cascader :data="data" @on-change="handleChange">
      <a href="javascript:void(0)">选择</a>
    </h-cascader>
    <h2>禁用</h2>
    <h-cascader :data="data" disabled style="width:200px"></h-cascader>
    <h2>选择即改变</h2>
    <h-cascader :data="data" v-model="value3" style="width:200px" change-on-select></h-cascader>
    <h2>自定义已选项</h2>
    <h-cascader :data="data3" :render-format="format" style="width:200px"></h-cascader>
    <h2>尺寸</h2>
    <h-cascader :data="data" size="large" style="width:200px"></h-cascader>
    <br>
    <h-cascader :data="data" style="width:200px"></h-cascader>
    <br>
    <h-cascader :data="data" size="small" style="width:200px"></h-cascader>
    <h2>动态加载选项</h2>
    <h-cascader :data="data4" :load-data="loadData" style="width:200px"></h-cascader>
    <h2>搜索</h2>
    <p>使用属性 filterable 可直接搜索选项并选择。</p>
    <h-cascader v-model="value4" :data="data" filterable style="width:200px"></h-cascader>
    <h2>测试</h2>
    <h-row :gutter="16">
      <h-col span="12">
        <h-cascader :data="data9" v-model="value10" filterable @on-change="change" style="width:200px"></h-cascader>
      </h-col>
      <h-col span="12">
        <h-cascader :data="data9" v-model="value9" filterable @on-change="change"></h-cascader>
      </h-col>
    </h-row>
    <br><br><br><br><br><br><br><br><br>
	</div>
</template>
<script>
import {data} from './provinceCity.js'
export default{
	name:'Cascader',
	data () {
    return {
      ceshi:[],
      text:'未选择',
      value1: [],
      value2:['jiangsu','nanjing','fuzimiao'],
      value3: [],
      value4: [],
      value9: [],
      value10: [],
      mValue: [],
      cityData:data,
      data9: [{
        value: 'beijing',
        label: '北京',
        children: [
            {
                value: 'gugong',
                label: '故宫'
            },
            {
                value: 'tiantan',
                label: '天坛'
            },
            {
                value: 'wangfujing',
                label: '王府井'
            }
        ]
      }, {
        value: 'jiangsu',
        label: '江苏',
        children: [
            {
                value: 'nanjing',
                label: '南京',
                children: [
                    {
                        value: 'fuzimiao',
                        label: '夫子庙',
                    }
                ]
            },
            {
                value: 'suzhou',
                label: '苏州',
                children: [
                    {
                        value: 'zhuozhengyuan',
                        label: '拙政园',
                    },
                    {
                        value: 'shizilin',
                        label: '狮子林',
                    }
                ]
            }
        ]
      }],
      data: [
        {
          value: 'beijing',
          label: '北京',
          children: [
            {
              value: 'gugong',
              label: '故宫'
            },
            {
              value: 'tiantan',
              label: '天坛'
            },
            {
              value: 'wangfujing',
              label: '王府井'
            }
          ]
        },
        {
          value: 'jiangsu',
          label: '江苏',
          children: [
            {
              value: 'nanjing',
              label: '南京',
              children: [
                {
                    value: 'fuzimiao',
                    label: '夫子庙',
                }
              ]
            },
            {
              value: 'suzhou',
              label: '苏州',
              children: [
                {
                  value: 'zhuozhengyuan',
                  label: '拙政园',
                },
                {
                  value: 'shizilin',
                  label: '狮子林',
                }
              ]
            }
          ],
        }
      ],
      data3: [
        {
          value: 'zhejiang',
          label: '浙江',
          children: [{
            value: 'hangzhou',
            label: '杭州',
            children: [{
              value: 'xihu',
              label: '西湖',
              code: 310000
            }]
          }]
        },
        {
          value: 'jiangsu',
          label: '江苏',
          children: [{
            value: 'nanjing',
            label: '南京',
            children: [{
              value: 'zhonghuamen',
              label: '中华门',
              code: 210000
            }]
          }]
        }
      ],
      data4: [
        {
          value: 'beijing',
          label: '北京',
          children: [],
          loading: false
        },
        {
          value: 'hangzhou',
          label: '杭州',
          children: [],
          loading:false
        }
      ]
    }
  },
  methods:{
    handleChange (value, selectedData) {
      this.text = selectedData.map(o => o.label).join(', ');
    },
    format (labels, selectedData) {
      // console.log(labels);
      const index = labels.length - 1;
      const data = selectedData[index] || false;
      if (data && data.code) {
        return labels[index] + ' - ' + data.code;
      }
      return labels[index];
    },
    loadData (item, callback) {
      item.loading = true;
      setTimeout(() => {
        if (item.value === 'beijing') {
          item.children = [
            {
              value: 'talkingdata',
              label: 'TalkingData'
            },
            {
              value: 'baidu',
              label: '百度'
            },
            {
              value: 'sina',
              label: '新浪'
            }
          ];
        } else if (item.value === 'hangzhou') {
          item.children = [
            {
              value: 'ali',
              label: '阿里巴巴'
            },
            {
              value: '163',
              label: '网易'
            }
          ];
        }
        item.loading = false;
        callback();
      }, 1000);
    },
    change (value,selectedData) {
      this.$hMessage.info("选中的值为：" + value);
      console.log("选中的值为："+selectedData.map(o => o.label).join('/'))
    }
  }
}
</script>
<style type="text/css">
  .demo-carousel{
  }
</style>
