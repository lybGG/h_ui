<template>
  <div>
    <h1>基础用法</h1>

    <h-form ref="formInline" :model="myForm" :label-width="130">
      <h-form-item prop="user" label="基础">
        <h-input-number v-model="value1" style="width:400px">
          <span slot="append">    {{value1}}</span>
        </h-input-number>
      </h-form-item>
      <h-form-item prop="user" label="两位小数">
        <h-input-number v-model="value2" :precision="2" style="width:400px">
          <span slot="append">    {{value2}}</span>
        </h-input-number>
      </h-form-item>
      <h-form-item prop="user" label="最大600000最小0">
        <h-input-number v-model="value3" :max="6000000" :min="0" style="width:400px">
          <span slot="append">    {{value3}}</span>
        </h-input-number>
      </h-form-item>
      <h-form-item prop="user" label="step100">
        <h-input-number v-model="value4" :max="6000000" :min="0"  :step="100" style="width:400px">
          <span slot="append">    {{value4}}</span>
        </h-input-number>
      </h-form-item>
    </h-form>
  </div>
</template>

<script>
export default {
  name: "InputNum",
  data() {
    return {
      myForm: {},
      value1: 5,
      value2: 0,
      value3: 0,
      value4: 0
    };
  },
  methods: {},
  watch: {}
};
</script>
