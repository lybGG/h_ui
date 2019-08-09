<template>
  <div class="ceshi-demo">
    <h1>SimpleSelect组件</h1>
    <p>选择器支持单选、多选、搜索，以及键盘快捷操作。</p>

    <br />
    <br />
    <br />
    <br />
    <h-simple-select filterable multiple v-model="ceshi1"   @on-change="change"  >
      <h-select-block :data="bigData"></h-select-block>
    </h-simple-select>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>
</template>
<script>
let bigData = [];
for (let i = 0; i < 20; i++) {
  let obj = {};
  obj.value = "value" + i;
  obj.label = "label" + i;
  obj.label1 = "name" + i;
  bigData.push(obj);
}

let bigDatatest = [];
for (let i = 0; i < 20; i++) {
  let obj = {};
  obj.value = i + "";
  obj.label = obj.value + " :label" + i;
  bigDatatest.push(obj);
}

export default {
  data() {
    return {
      loading1: false,
      showCol: ["label1", "label2", "label3"],
      matchCol: ["name", "age"],
      showCol1: ["label1"],
      bigData: [],
      isdisable: true,
      bigDatatest: bigDatatest,
      value: "",
      remoteData: [],
      valuetest: ["12"],
      value1: [],
      value2: ["2"],
      v20190321: {
        options: [
          {
            value: "1",
            label: "1"
          },
          {
            value: "11",
            label: "11"
          },
          {
            value: "112",
            label: "112"
          },
          {
            value: "2",
            label: "2"
          },
          {
            value: "3",
            label: "3"
          }
        ],
        options2: [
          { value: "1", label: "中国" },
          { value: "2", label: "美国" },
          { value: "3", label: "韩国1" },
          { value: "4", label: "韩国2" },
          { value: "5", label: "韩国3" },
          { value: "6", label: "韩国4" },
          { value: "7", label: "韩国5" },
          { value: "8", label: "韩国6" },
          { value: "9", label: "韩国7" },
          { value: "10", label: "韩国8" },
          { value: "11", label: "韩国9" },
          { value: "12", label: "韩国10" },
          { value: "13", label: "韩国11" },
          { value: "14", label: "韩国12" },
          { value: "15", label: "韩国13" }
        ],
        value: "",
        value2: ["1", "2"]
      },
      remoteData: [],
      valueRemote: [],
      valueRemote1: "",
      ceshi1: "",
      ceshiData: []
    };
  },
  methods: {
    reportChange(p1, p2, p3) {
      console.log(p1);
      console.log(p1);
      console.log(p1);
    },
    handleBlur() {
      console.log("blur");
    },
    handleChange(e) {
      console.log(e);
    },
    simSel(val) {
      if (val) {
        this.$refs.simSel.focus();
      } else {
        this.$refs.simSel.blur();
      }
    },
    selectAll(status) {
      this.$refs.ceshi.toggleSelect(status);
    },
    selectTop(status) {
      this.$refs.ceshi.selectedTop(status);
    },
    changValue(stae) {
      this.value2 = stae ? ["2", "3", "4", "5"] : ["3", "4"];
    },
    changValue2() {
      this.v20190321.value2 = ["2", "3"];
    },
    loaddata() {
      this.bigData = bigData;
    },
    enable() {
      this.isdisable = false;
    },
    changeValue() {
      this.value = "value1";
    },
    testClick(val) {
      if (val) {
        this.$refs.test.focus();
      } else {
        this.$refs.test.blur();
      }
    },
    ceshi() {
      this.model1 = [];
      this.model2 = "";
    },
    change(e) {
      console.log(e);
    },
    select(e, b) {
      console.log(e);
      console.log(b);
    },
    allSelect(e) {
      console.log(e);
    },
    selsetChange(e) {
      console.log(e);
    },
    copying(obj) {
      let val = obj.newval;
      debugger;
      this.valueRemote = val.split(",");
      console.log(obj);
    },
    focusing() {
      console.log("input");
    },
    remoteMethod(query) {
      clearTimeout(this.timer);
      if (query !== "") {
        if (query == ",") {
          this.timer = setTimeout(() => {
            this.loading1 = false;
            this.remoteData = bigData;
          }, 100);
        } else {
          this.loading1 = true;
          this.timer = setTimeout(() => {
            this.loading1 = false;
            this.remoteData = bigData.filter(
              item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          }, 100);
        }
      } else {
        this.loading1 = false;
        // this.remoteData = bigData
        this.remoteData = [];
      }
    },
    scroll(num) {
      console.log("on-scroll" + num);
    },
    changeData() {
      this.$refs.block.selectedTop();
      this.$refs.block1.selectedTop();
    }
  },
  mounted() {
    // 远程搜索赋初始值
    // this.remoteMethod('')

    setTimeout(() => {
      this.value = "value0";
      this.value1 = ["value0"];
    }, 1000);
    this.ceshiData = [
      { label: "GSLC-12(CW)", value: "GSLC-12" },
      { label: "GSLC-13(CW)", value: "GSLC-13" },
      { label: "GSLC-14(CW)", value: "GSLC-14" },
      { label: "GSLC-15(CW)", value: "GSLC-15" },
      { label: "GSLC-01(CW)", value: "GSLC-01" },
      { label: "GSLC-02(CW)", value: "GSLC-02" },
      { label: "GSLC-03(CW)", value: "GSLC-03" },
      { label: "GSLC-04(CW)", value: "GSLC-04" },
      { label: "GSLC-05(CW)", value: "GSLC-05" },
      { label: "GSLC-06(CW)", value: "GSLC-06" },
      { label: "GSLC-07(CW)", value: "GSLC-07" },
      { label: "GSLC-08(CW)", value: "GSLC-08" },
      { label: "GSLC-09(CW)", value: "GSLC-09" },
      { label: "GSLC-10(CW)", value: "GSLC-10" },
      { label: "GSLC-11(CW)", value: "GSLC-11" },
      { label: "JZLC-01(CW)", value: "JZLC-01" },
      { label: "JZLC-02(CW)", value: "JZLC-02" },
      { label: "JZLC-03(CW)", value: "JZLC-03" },
      { label: "JZLC-04(CW)", value: "JZLC-04" },
      { label: "JZLC-05(CW)", value: "JZLC-05" },
      { label: "JZLC-06(CW)", value: "JZLC-06" },
      { label: "JZLC-07(CW)", value: "JZLC-07" },
      { label: "JZLC-08(CW)", value: "JZLC-08" },
      { label: "JZLC-09(CW)", value: "JZLC-09" },
      { label: "JZLC-10(CW)", value: "JZLC-10" },
      { label: "JZLC-11(CW)", value: "JZLC-11" }
    ];
  },
  watch: {
    // v20190321: {
    //   deep: true,
    //   handler: function(val) {
    //     console.log(val)
    //   }
    // }
  }
};
</script>
<style>
.ceshi-demo {
  /* width: 200px;
    height: 160px;
    overflow: auto; */
}
p {
  font-size: 18px;
}
</style>
