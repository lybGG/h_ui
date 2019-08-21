<template>
  <div :class="[prefixCls + '-confirm']" :style="styles">
    <span :class="timeClasses" v-if="showTime" @click="handleToggleTime">
        <template v-if="isTime">{{ t('i.datepicker.selectDate') }}</template>
        <template v-else>{{ t('i.datepicker.selectTime') }}</template>
    </span>
    <i-button size="small" type="text"  v-if="showToday" @click.native="handleShowToday">{{ t('i.calendar.today') }}</i-button>
    <i-button size="small" type="text"  v-if="showLong" @click.native="handleLongTime">{{ t('i.datepicker.long') }}</i-button>
    <i-button size="small" type="text"  v-if="!showToday"     @click.native="handleClear">{{ t('i.datepicker.clear') }}</i-button>
    <i-button size="small" type="primary"  v-if="!showToday"    @click.native="handleSuccess">{{ t('i.datepicker.ok') }}</i-button>
  </div>
</template>
<script>
  import iButton from '../../Button/Button.vue';
  import Locale from '../../../mixins/locale';

  const prefixCls = 'h-picker';

  export default {
      mixins: [ Locale ],
      components: { iButton },
      props: {
          showTime: false,
          isTime: false,
          showLong:false,
          showToday:false,
          timeDisabled: false
      },
      data () {
          return {
              prefixCls: prefixCls
          };
      },
      computed: {
          timeClasses () {
              return {
                  [`${prefixCls}-confirm-time-disabled`]: this.timeDisabled
              };
          },
          styles(){
              let style={}
              if(this.showToday){
                  style.textAlign='center'
              }
              return style
          }
      },
      methods: {
          handleClear () {
              this.$emit('on-pick-clear');
          },
          handleSuccess () {
              this.$emit('on-pick-success');
          },
          handleToggleTime () {
              if (this.timeDisabled) return;
              this.$emit('on-pick-toggle-time');
          },
          handleLongTime(){
              this.$emit('on-pick-long');
          },
          handleShowToday(){
              this.$emit('on-pick-today');
          }
      }
  };
</script>
