<template>
  <div>
    <h1>基础用法</h1>
    <h-input v-model="value1"></h-input>
    {{value1}}
    <h-input-number :max="100"
                    :min="9"
                    v-model="value1"
                    :step="10"
                    style="width:200px"
                    :precision="2">
      <span slot="append">px</span>
    </h-input-number>
     <h1>基础用法</h1>
    {{value2}}
    <h-input-number :max="100"
                    :min="9"
                    v-model="value2"
                    :step="10"
                    style="width:200px"
                    :precision="2">
      <span slot="append">px</span>
    </h-input-number>
     <h1>基础用法</h1>
    {{value3}}
    <h-input-number :max="10000"
                    :min="900"
                    v-model="value3"
                    :step="100"
                    style="width:200px"
                    :precision="2">
      <span slot="append">px</span>
    </h-input-number>
  
  </div>
</template>

<script>
export default {
  name: 'InputNum',
  data() {
    return {
      value1: 0,
      value2: 0,
      value3: 3,
      value4: 4,
      value5: 5,
      disabled: true,
      value6: 1,
      value7: 0,
      value8: 0.0000007
    }
  },
  methods: {
    testClick() {
      this.$refs.input.focus();
    }
  },
  watch: {
    value7(nv) {
      console.log(nv, 'value7')
    },
    value8(nv) {
      console.log(nv, 'value8')
    }
  }
}
</script>
