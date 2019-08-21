<template>
  <div>
    <h-row>
      <h-time-picker v-model="val" format="HH’mm’ss" type="timerange" placement="bottom-end" placeholder="选择时间" size="large" :steps= "[2, 15,10]" @on-focus="focusEvent" @on-blur="blurEvent" style="width:200px"></h-time-picker>
      {{val}}
      <h2>基本用法</h2>
      <p>设置属性 type 为 time 或 timerange 分别显示选择单个时间和选择范围时间类型<br>
        设置属性 placement 可以更改选择器出现的方向</p>
      <h-col span="12">
        <h-time-picker v-model="val1" type="time" placeholder="选择时间" style="width: 168px"></h-time-picker>
        {{val1}}
      </h-col>
      <h-col span="12">
        <h-time-picker type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px"></h-time-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>时间格式</h2>
      <p>设置属性 format 可以改变时间的显示格式<br>
      注意，format 只是改变显示的格式，并非改变 value 值。</p>
      <h-col span="12">
        <h-time-picker :value="value1" format="HH点mm分ss秒" placeholder="选择时间" style="width: 168px"></h-time-picker>
      </h-col>
      <h-col span="12">
        <h-time-picker :value="value2" format="HH’mm’ss" type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px"></h-time-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>选择时分</h2>
      <p>组件浮层中的列会随着 format 变化，当略去 format 中的秒时，浮层中对应的列也会消失。</p>
      <h-col span="12">
          <h-time-picker format="HH:mm" placeholder="选择时间" style="width: 112px"></h-time-picker>
      </h-col>
      <h-col span="12">
          <h-time-picker format="HH:mm" type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px"></h-time-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>时间间隔</h2>
      <p>通过属性 steps 可以设置时间间隔。数组的三项分别对应小时、分钟、秒。</p>
      <h-col span="24">
        <h-time-picker :steps="[2, 15, 15]" placeholder="选择时间" style="width: 112px"></h-time-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>不可选时间</h2>
      <p>可以使用 disabled-hours disabled-minutes disabled-seconds 组合禁止用户选择某个时间。<br>
      使用 hide-disabled-options 可以直接把不可选择的项隐藏。</p>
      <h-col span="12">
        <h-time-picker  :disabled-hours="[1,5,10]"
          :disabled-minutes="[0,10,20]"
          placeholder="选择时间"
          style="width: 168px"></h-time-picker>
      </h-col>
      <h-col span="12">
        <h-time-picker hide-disabled-options
          :disabled-hours="[1,5,10]"
          :disabled-minutes="[0,10,20]"
          placeholder="选择时间"
          style="width: 168px"></h-time-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>带有确认操作</h2>
      <p>设置属性 confirm，选择日期后，选择器不会主动关闭，需用户确认后才可关闭。<br>
      确认按钮并没有影响日期的正常选择。</p>
      <h-col span="12">
        <h-time-picker confirm placeholder="选择时间" style="width: 168px"></h-time-picker>
      </h-col>
      <h-col span="12">
        <h-time-picker confirm type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px"></h-time-picker>
      </h-col>
    </h-row>
    <h-row>
      <h2>手动控制组件</h2>
      <p>对于一些定制化的场景，可以使用 slot 配合参数 open 及事件来手动控制组件的显示状态</p>
      <h-time-picker
        :open="open"
        :value="value3"
        confirm
        @on-change="handleChange"
        @on-clear="handleClear"
        @on-ok="handleOk">
        <a href="javascript:void(0)" @click="handleClick">
          <h-icon name="time"></h-icon>
          <template v-if="value3 === ''">选择时间</template>
          <template v-else>{{ value3 }}</template>
        </a>
      </h-time-picker>
    </h-row>
    <h-row>
      <h2>尺寸</h2>
      <p>通过设置属性 size 为 large 或 small 可以调整选择器尺寸为大或小，默认不填为中</p>
      <h-col span="8">
        <h-time-picker size="small"  placeholder="选择日期"></h-time-picker>
      </h-col>
      <h-col span="8">
        <h-time-picker placeholder="选择日期"></h-time-picker>
      </h-col>
      <h-col span="8">
        <h-time-picker size="large" placeholder="选择日期"></h-time-picker>
      </h-col>
    </h-row>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
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
                this.$Message.info('点击了今天');
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
                this.$Message.info('点击了昨天');
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
                this.$Message.info('点击了一周前');
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
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        options4: {
          disabledDate (date) {
            const disabledDay = date.getDate();
            return disabledDay === 15;
          }
        },
        val:['08:30:10', '12:00:10'],
        val1:'',
        val2:'',
        val3:'',
        val4:'',
        value1: '09:41:00',
        value2: ['09:41:00', '12:00:00'],
        open: false,
        value3: ''
      }
    },
    methods:{
      focusEvent() {
        console.log('fo')
      },
      blurEvent() {
        console.log('bl')
      },
      handleClick () {
        this.open = !this.open;
      },
      handleChange (date) {
        this.value3 = date;
      },
      handleClear () {
        this.open = false;
      },
      handleOk () {
        this.open = false;
      }
    }
  }
</script>




