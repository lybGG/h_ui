<template>
  <div>
    <Button @on-click="testClick(true)">获取焦点</Button>
    <Button @on-click="testClick(false)">失去焦点</Button>
    <h-date-picker v-model="model1" @on-blur="dateBlur" @on-focus="dateFocus" :options="options5" @on-illegal-input="handleIllegalInput" clearOnIllegal @on-change="handleChange1" confirm showTwoPanel format="yyyy-MM-dd" :showFormat="true" style="width:180px" :disabled="changeable" ref="test"></h-date-picker>
    <span>{{formItem.date}}</span>
    <Button @click = "changedis">改变状态</Button>
    <h-row>
      <h2>基本用法</h2>
      <p>设置属性 type 为 date 或 daterange 分别显示选择单日和选择范围类型。<br>
        设置属性 placement 可以更改选择器出现的方向</p>
      <h-col span="12">
        <h-date-picker v-model="model1"  format="yyyy-MM-dd" type="date"  :options="options4"   style="width: 200px" @on-clickout="s" :showFormat="true" showToday></h-date-picker>{{model1}}
      </h-col>
      <h-col span="12">
        {{model2}}
        <h-date-picker v-model="model2" type="daterange" @on-change="handleChange1" format="yyyy-MM-dd" placement="bottom-end" placeholder="选择日期" showFormat>
          <span slot="footer">123</span>
        </h-date-picker>
      </h-col>
    </h-row>
    <h2>type: MonthRange</h2>
    <h-row>
      <h-col span="12">
        {{monthRangeModel}}
        <h-date-picker v-model="monthRangeModel" type="monthrange" format="yyyy/MM" showFormat></h-date-picker>
      </h-col>
    </h-row>
    <!-- <h-row> -->
      <h2>显示快捷方式</h2>
      <p>设置属性 format 可以改变日期的显示格式<br>
      注意，format 只是改变显示的格式，并非改变 value 值。</p>
      <!-- <h-col span="12"> -->
      <h-date-picker type="date" :options="options1" placeholder="选择日期" style="width: 200px"></h-date-picker>
      <!-- </h-col> -->
      <!-- <h-col span="12"> -->
      <h-date-picker autoPlacement type="daterange" placeholder="选择日期" style="width: 200px"></h-date-picker>
      <!-- </h-col> -->
    <!-- </h-row> -->
    <h-row>
      <h2>日期格式</h2>
      <p>设置属性 options 对象中的 shortcuts 可以设置快捷选项<br>
      其中 value 为函数，必须返回一个日期，如果是 daterange 类型，需要返回一个数组。<br>
      value 接收任何正确的日期格式，比如 2016-12-24 或 12/24/16 都是正确的。</p>
      <h-col span="12">
        <h-date-picker :value="value1" format="yyyy年MM月dd日" type="date" placeholder="选择日期" style="width: 200px"></h-date-picker>
      </h-col>
      <h-col span="12">
        <h-date-picker :value="value2" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px"></h-date-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>日期时间选择</h2>
      <p>设置属性 type 为 datetime 或 datetimerange 可以选择时间。<br>
      设置 format 并且忽略秒，可以只设置小时和分钟维度。</p>
      <h-date-picker v-model="timePicker" format="yyyyMMddHHmmss" type="datetime" placeholder="选择日期和时间" style="width: 200px" :showFormat="true"></h-date-picker>
      {{timePicker}}
      <br>
      <h-date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间（不含秒）" style="width: 200px"></h-date-picker>
      <br>
      <h-date-picker type="datetimerange" placeholder="选择日期和时间" style="width: 300px"></h-date-picker>
      <br>
      <h-date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间（不含秒）" style="width: 300px"></h-date-picker>
    </h-row>
    <h-row>
      <h2>年和月</h2>
      <p>设置属性 type 为 year 或 month 可以使用选择年或月的功能。</p>
      <h-col span="12">
        <h-date-picker type="year" placeholder="选择年" style="width: 200px"></h-date-picker>
      </h-col>
      <h-col span="12">
        <h-date-picker type="month" placeholder="选择月" style="width: 200px"></h-date-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>不可选日期</h2>
      <p>设置属性 options 对象中的 disabledDate 可以设置不可选择的日期。<br>
      disabledDate 是函数，参数为当前的日期，需要返回 Boolean 是否禁用这天</p>
      <h-col span="12">
        <h-date-picker type="date" :options="options3" placeholder="选择日期" style="width: 200px"></h-date-picker>
      </h-col>
      <h-col span="12">
        <h-date-picker type="date" :options="options4" placeholder="选择日期" style="width: 200px"></h-date-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>带有确认操作</h2>
      <p>设置属性 confirm，选择日期后，选择器不会主动关闭，需用户确认后才可关闭。<br>
      确认按钮并没有影响日期的正常选择。</p>
      <h-col span="12">
        <h-date-picker type="date" confirm placeholder="选择日期" style="width: 200px"></h-date-picker>
      </h-col>
      <h-col span="12">
        <h-date-picker type="daterange" confirm placement="bottom-end" placeholder="选择日期" style="width: 200px"></h-date-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>手动控制组件</h2>
      <p>对于一些定制化的场景，可以使用 slot 配合参数 open 及事件来手动控制组件的显示状态</p>
      <h-date-picker
        :open="open"
        :value="value3"
        confirm
        type="daterange"
        format="yyyy-MM-dd"
        :options="options5"
        @on-change="handleChange"
        @on-clear="handleClear"
        @on-ok="handleOk"
        @on-select-range="handleRange">
        <a href="javascript:void(0)" @click="handleClick">
          <h-icon name="activity"></h-icon>
          <template v-if="value3 === ''">选择日期</template>
          <template v-else>{{ value3 }}</template>
        </a>
    </h-date-picker>
    </h-row>
    <h-row>
      <h2>尺寸</h2>
      <p>通过设置属性 size 为 large 或 small 可以调整选择器尺寸为大或小，默认不填为中</p>
      <h-col span="8">
        <h-date-picker size="small" type="date" placeholder="选择日期"></h-date-picker>
      </h-col>
      <h-col span="8">
        <h-date-picker type="date" placeholder="选择日期"></h-date-picker>
      </h-col>
      <h-col span="8">
        <h-date-picker size="large" type="date" placeholder="选择日期"></h-date-picker>
      </h-col>
    </h-row>
    <h-date-picker size="large" type="date" placeholder="不可编辑" :editable="false"></h-date-picker>
    <h-date-picker type="date" placeholder="选择日期" style="width: 200px"></h-date-picker>
     <h-row>
      <h2>带有长期功能</h2>
      <p>设置属性 showLong，配置longValue，点击长期改为longValue日期。</p>
      <h-col span="12">
        <h-date-picker type="date" placeholder="选择日期" style="width: 200px" showLong :longValue="longdate1"></h-date-picker>
      </h-col>
      <h-col span="12">
        <h-date-picker type="daterange"  placeholder="选择日期" :value="value2" showLong :longValue="longdate"></h-date-picker>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        options1: {
          shortcuts: [
            {
              text: '今天',
              value () {
                return new Date();
              },
              onClick: (picker) => {
                this.$hMessage.info('点击了今天');
              }
            },
            {
              text: '昨天',
              value () {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                return date;
              },
              onClick: (picker) => {
                this.$hMessage.info('点击了昨天');
              }
            },
            {
              text: '一周前',
              value () {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                return date;
              },
              onClick: (picker) => {
                this.$hMessage.info('点击了一周前');
              }
            }
          ],
        },
        options2: {
          shortcuts: [
            {
              text: '最近一周',
              value () {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '最近一个月',
              value () {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '最近三个月',
              value () {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            }
          ]
        },
        options3: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now() - 86400000;
          }
        },
        options4: {
          disabledDate (date) {
            const disabledDay = date.getDate();
            return disabledDay === 15;
          }
        },
        options5: {
          disabledDate (date) {
            if (date == null) return false;
            return new Date().getTime() < date.getTime();
          }
        },
        formItem:{date:''},
        value1: '2016-01-01',
        value2: ['2016-01-01', '2016-01-01'],
        open: false,
        timePicker:'20180913040505 ',
        value3:  [ "2018-08-16", "2018-08-23" ],
        model1:'',
        model2:["2018-08-16", "2018-08-23"],
        monthRangeModel: ["2019-03-01", "2020-06-01"],
        model3:'',
        model4:'',
        model5:'',
        model6:'',
        model7:'',
        changeable:false,
         longdate:'2100-09-05',
        longdate1:'2019-09-05',
      }
    },
    methods:{
      handleIllegalInput() {
        this.$hMessage.warning('日期输入不合法');
      },
      dateFocus() {
        console.log('focus')
      },
      dateBlur() {
        console.log('blur')
      },
      testClick(val){
        if (val) {
          this.$refs.test.focus();
        }else{
          this.$refs.test.blur();
        }
      },
      changedis() {
        this.changeable = !this.changeable;
      },
      handleClick () {
        this.open = !this.open;
      },
      handleChange (date) {
        this.value3 = date;
      },
      handleChange1 (date) {
        console.log(date);
      },
      handleClear () {
        this.open = false;
      },
      handleOk () {
        this.open = false;
      },
      s(){
        console.log(1);
      },
      handleRange(val,status){
        this.options5={
          disabledDate (date) {
            if (status) {
              return false;
            }else{
              return date.valueOf()>val.valueOf()+86400000*30||date.valueOf()<val.valueOf()-86400000*30;
            }
          }
        }
      },
    },
    mounted(){
      this.model1='2018-3-6';
      // this.model2=['2018年3月9日','2018年3月19日'];
    }
  }
</script>




