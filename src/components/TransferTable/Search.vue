<template>
  <div :class="prefixCls">
    <h-input
      v-model="currentQuery"
      size="small"
      :icon="icon"
      :placeholder="placeholder"
      @on-click="handleClick"></h-input>
  </div>
</template>
<script>
    import hInput from '../Input/Input.vue';

    export default {
        name: 'Search',
        components: { hInput },
        props: {
          prefixCls: String,
          placeholder: String,
          query: String
        },
        data () {
          return {
            currentQuery: this.query
          };
        },
        watch: {
          query (val) {
            this.currentQuery = val;
          },
          currentQuery (val) {
            this.$emit('on-query-change', val);
          }
        },
        computed: {
          icon () {
            return this.query === '' ? 'ios-search' : 'ios-close';
          }
        },
        methods: {
          handleClick () {
            if (this.currentQuery === '') return;
            this.currentQuery = '';
            this.$emit('on-query-clear');
          },
          clearSearch(){
            this.currentQuery=""
          }
        }
    };
</script>
