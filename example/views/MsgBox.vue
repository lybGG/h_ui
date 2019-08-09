<template>
  <div>
    <h1>普通组件使用</h1>
    <h-button type="primary" @click="showw">显示对话框</h-button>
    <h-msg-box
      v-model="modal1"
      title="普通的Modal对话框标题"
      ref="mymsgbox"
      :height="tHeight"
      :top="0"
      :closable="true"
      :mask-closable="true"
      :scrollable="true"
      maskTop="0"
      maskLeft="0"
      class-name="vertical-center-modal"
    >
      d
      <br />
    </h-msg-box>
  </div>
</template>
<script>
export default {
  name: "MsgBoxs",
  data() {
    return {
      tHeight: 2200,

      modal1: false,
      modal2: false,
      modal_loading: false,
      modal3: false,
      val3: [],
      modal6: false,
      modal4: false,
      modal5: false,
      mulmodel: [],
      value: "",
      showModal2: false,
      WindosInnerHeight: window.innerHeight,
      WindosOuterHeight: window.outerHeight
    };
  },
  computed: {
    // tTop() {
    //   return (this.tHeight -this.WindosInnerHeight +(this.WindosOuterHeight - this.WindosInnerHeight)   ) / 2
    //   ;
    // }
  },
  mounted() {
  //   const that = this;

  //   window.onresize = () => {
  //     that.WindosInnerHeight = window.innerHeight;
  //     that.WindosOuterHeight=window.outerHeight;
  // console.log("-   :" + (window.outerHeight - window.innerHeight));
      // // let tpvalue = this.lastWindosHeight - window.innerHeight;
      // // this.lastWindosHeight = window.innerHeight;
      // console.log("===========================================");
      // console.log("that.tTop:" + that.tTop);
      // // console.log("tpvalue:" + tpvalue);
      // that.tTop = 554-window.innerHeight/2
      // console.log("window.innerHeight   :" + window.innerHeight);
      // console.log("window.outerHeight   :" + window.outerHeight);
      

      // return (tpvalue => {})();
    // };
  },
  methods: {
    showw() {
      this.modal1 = true;
      console.log(" ");
      console.log("window.innerHeight   :" + window.innerHeight);
      console.log("window.outerHeight   :" + window.outerHeight);
      console.log(" ");
      console.log("tHeight  :" + this.tHeight);
      console.log("tTop   :" + this.tTop);
      console.log(" ");
      console.log("document.body.clientHeight  :" + document.body.clientHeight);
      console.log("document.body.offsetHeight  :" + document.body.offsetHeight);
      console.log("document.body.scrollHeight  :" + document.body.scrollHeight);
      console.log("document.body.scrollTop  :" + document.body.scrollTop);
      console.log(" ");
      console.log("window.screenTop  :" + window.screenTop);
      console.log("window.screen.height  :" + window.screen.height);
      console.log("window.screen.availHeight  :" + window.screen.availHeight);
    },
    destroy() {
      this.$hMsgBox.remove();
    }
  }
};
</script>
<style>
.tabWarp {
  overflow: auto;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  /*justify-content: center;*/
}
</style>
