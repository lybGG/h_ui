<template>
  <div>
    <h2>带边线</h2>
    <h-table
      border
      :columns="columns"
      :data="data"
      no-data-text="数据为空"
    >
    </h-table>
  </div>
</template>
<script>
// import printJS from 'print-js/src/index'
import TexpandRow from "./Texpand-row.vue";
export default {
  name: "tableq",
  components: { TexpandRow },
  data() {
    return {
      msgbox: false,
      loading: false,
      data: [
        { title: "dlmdl",paramValue:"111113" }, 
        { title: "dlmdl",paramValue:"111113"  }
        ],
      columns: [
        {
          // 参数值
          title: "title",
          key: "paramValue",
          render: (h, params) =>
            h("div", [
              h(
                "input",
                {
                  domProps: {
                    type: "text",
                    label: "",
                    value: params.row.paramValue
                  },
                  on: {
                    "on-blur": value => {
                      // TODO 验证输入参数
                      // comp.validTableValue(params.row, value);
                    }
                  }
                },
                ""
              )
            ])
        }
      ]
    };
  },
  methods: {
    changeHidden() {
      this.$set(this.columns1[3], "hiddenCol", !this.columns1[3].hiddenCol);
    },
    setMult() {
      this.$set(this.multiLevel1[0], "hiddenCol", true);
    },
    getData() {},
    handleDrop(a, b) {
      console.log("drag: " + a + ", drop: " + b);
    },
    refresh() {
      //  this.$route.meta.isKeepAlive = false
      this.$parent.isKeepAlive = false;
      // this.$store.dispatch('refreshCurPage', 'table')
      // this.$route.meta.comName = ''
      this.$parent.page = "";

      this.$nextTick(() => {
        this.$parent.isKeepAlive = true;

        // this.$route.meta.isKeepAlive = true
        // this.$route.meta.isDestroy = false
        // this.$route.meta.comName = 'table'
        this.$parent.page = "tableq";

        // this.$store.dispatch('addRouteKeepAlive', 'table')
      });
    },
    resetSort() {
      this.$refs.table.handleSort("all", "normal");
    },
    changemsg() {
      this.msgbox = !this.msgbox;
    },
    onDrag(e, i) {
      console.log(e);
      console.log(i);
    },
    onMove(i, j) {
      console.log(i);
      console.log(j);
    },
    change(e) {
      console.log(e);
    },
    scroll(num) {
      console.log(num);
    },
    setLoading() {
      this.loading = !this.loading;
    },
    click1(selection) {
      console.log(selection);
    },
    rowclick() {
      console.log("你点击了某一行");
    },
    rowdblclick(e, i) {
      console.log("你双击了某一行");
    },
    expand(row, status) {
      console.log(status);
    },
    sortChange(obj) {
      if (obj.order == "asc") {
        let len = this.data5.length - 1;
        let item = this.data5[len];
        this.data5.splice(len, 1);
        this.data5.splice(0, 0, item);
      } else {
        console.log("你点击勒向下排序按钮");
      }
    },
    rowClassName(row, index) {
      if (index === 1) {
        return "demo-table-info-row";
      } else if (index === 3) {
        return "demo-table-error-row";
      }
      return "";
    },
    radioChange(currentRow, oldRow, index) {
      console.log(currentRow);
      console.log(oldRow);
      console.log(index);
    },
    allSelect(allSelection) {
      console.log(allSelection);
    },
    select(selection, row) {
      //已选择的项和刚刚选择的项
      console.log(selection);
      console.log(row);
    },
    selsetChange(selection, inx) {
      //选项发生变化时触发已选择的项
      console.log(selection);
      console.log(inx);
    },
    show(index) {
      this.$hMsgBox.info({
        title: "用户信息",
        content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    exportData(type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: "原始数据"
        });
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename: "排序和过滤后的数据",
          original: false
        });
      } else if (type === 3) {
        this.$refs.table.exportCsv({
          filename: "自定义数据",
          columns: this.columns8.filter((col, index) => index < 4),
          data: this.data7.filter((data, index) => index < 4)
        });
      }
    },
    moveUp() {},
    moveDown() {},
    sortChnage(obj) {
      console.log(obj);
    }
  },
  mounted() {
    this.columns1 = [
      {
        type: "radio",
        width: 60,
        align: "center",
        fixed: "right"
      },
      {
        type: "drag",
        width: 60,
        fixed: "left",
        align: "center"
      },
      {
        title: "姓名",
        key: "name",
        align: "center",
        width: 200,
        fixed: "left"
      },
      {
        title: "年龄",
        key: "age",
        sortable: true
      },
      {
        title: "地址",
        ellipsis: true,
        key: "address"
        // fixed:'right'
        // hiddenCol:true,
      },
      {
        title: "地址1",
        key: "address1"
      },
      {
        title: "地址2",
        key: "address2"
      },
      {
        title: "地址3",
        key: "address3"
      },
      {
        title: "地址4",
        key: "address4",
        sortType: "asc"
      },
      {
        title: "地址5",
        key: "marketNo",
        sortType: "asc"
      },
      {
        title: "地址6",
        key: "tradeQuantity",
        sortType: "asc"
      }
    ];
  }
};
</script>
<style type="text/css">
.h-table .demo-table-info-row td {
  background-color: #2db7f5 !important;
  color: #fff;
}
.h-table .demo-table-error-row td {
  background-color: #ff6600 !important;
  color: #fff;
}
.h-table td.demo-table-info-column {
  background-color: #2db7f5 !important;
  color: #fff;
}
.h-table th.demo-table-info-column {
  background-color: #2db7f5 !important;
  color: #fff;
}
.h-table .demo-table-info-cell-name {
  background-color: #2db7f5 !important;
  color: #fff;
}
.h-table .demo-table-info-cell-age {
  background-color: #ff6600 !important;
  color: #fff;
}
.h-table .demo-table-info-cell-address {
  background-color: #187 !important;
  color: #fff;
}
.h-table-title,
.h-table-footer {
  background-color: #7eb8f1;
  text-align: center;
}
</style>
