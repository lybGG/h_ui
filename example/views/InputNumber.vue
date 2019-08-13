<template>
  <div>
    <h1>基础用法</h1>
    {{value1}}
    <h-input-number :max="100"
                    :min="1"
                    v-model="value1"
                    :precision="2">
      <span slot="append">px</span>
    </h-input-number>
    <h-input-number :max="20"
                    :min="-1"
                    :step="1"
                    v-model="value2"
                    focusAllSelect
                    @on-focus="focusEvent"
                    ref="input"></h-input-number>
    <Button @click="testClick()">获取焦点</Button>
    <br>
    <br>
    <h-input-number :max="10"
                    :min="1"
                    :step="1.2"
                    v-model="value2"
                    disabled></h-input-number>
    <h-input-number :max="10"
                    :min="1"
                    :step="1.2"
                    v-model="value2"
                    readonly></h-input-number>
    <h-input-number :max="10"
                    :min="1"
                    :step="1.2"
                    v-model="value2"
                    :editable="false"></h-input-number>
    <br>
    <br>
    <h-input-number v-model="value3"
                    size="small"></h-input-number>
    <h-input-number v-model="value4"></h-input-number>
    <h-input-number v-model="value5"
                    size="large"></h-input-number>
    <br>
    <br>
    <h-input-number v-model="value6"
                    :disabled="disabled"></h-input-number>
    <h-button type="primary"
              @click="disabled = !disabled">Toggle Disabled</h-button>
    <h1>2019/04/04 notScientificNotation props</h1>
    <h-input-number notScientificNotation :precision="4" v-model="value7"></h-input-number>
    <h-input-number notScientificNotation v-model="value8"></h-input-number>
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
