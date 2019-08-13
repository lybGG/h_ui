<template>
  <div :class="wrapClasses" :style="styles" ref="tableWrap">
    <div :class="classes">
      <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header">
        <gird-head
          ref="thead"
          :prefix-cls="prefixCls"
          :styleObject="tableStyle"
          :columns="cloneColumns"
          :columns-width="columnsWidth"
          :dataLenght="data.length"
          :headSelection ="headSelection"
          :canDrag="canDrag"
          :canMove="canMove"
          @on-move="move"
          ></gird-head>
      </div>
      <div :class="[prefixCls + '-body']" :style="bodyStyle" ref="body" @scroll="handleBodyScroll"
        v-show="!(!!localeNoDataText && (!data || data.length === 0))">
        <Tree-table
          ref="tbody"
          :styleObject ="tableBodyStyle"
          :indent ="Number(0)"
          :data="rebuildData"
          :prefix-cls="prefixCls"
          :columns="cloneColumns"
          :columnsWidth="columnsWidth"
          :checkStrictly="checkStrictly"
          :checkedObj="checkedObj"
          :indexAndId="indexAndId"
          :selectRoot="selectRoot"
          :isCheckbox="isCheckbox"
          :bodyRealHeight="bodyRealHeight"
          :tableWidth="tableWidth"
          :initWidth="initWidth"
          :rowSelect="rowSelect"
          :scrollBarWidth="scrollBarWidth"
          :headSelection="headSelection"
          :height="height">
        </Tree-table>
      </div>
      <div :class="[prefixCls + '-fixed']" :style="fixedTableStyle" v-if="isLeftFixed" ref="leftF">
        <div :class="fixedHeaderClasses" v-if="showHeader">
          <gird-head
            fixed="left"
            :prefix-cls="prefixCls"
            :styleObject="tableStyle"
            :columns="leftFixedColumns"
            :columns-width="columnsWidth"
            :dataLenght="data.length"
            :headSelection ="headSelection"
            :canDrag="canDrag"
          ></gird-head>
        </div>
        <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedBody" v-show="!(!!localeNoDataText && (!data || data.length === 0))" @mousewheel="handleFixedMousewheel" @DOMMouseScroll="handleFixedMousewheel">
          <Tree-table
            ref="tbody"
            fixed="left"
            :styleObject ="tableStyle"
            :indent ="Number(0)"
            :data="rebuildData"
            :prefix-cls="prefixCls"
            :columns="cloneColumns"
            :columnsWidth="columnsWidth"
            :checkStrictly="checkStrictly"
            :checkedObj="checkedObj"
            :indexAndId="indexAndId"
            :selectRoot="selectRoot"
            :isCheckbox="isCheckbox"
            :bodyRealHeight="bodyRealHeight"
            :tableWidth="tableWidth"
            :initWidth="initWidth"
            :rowSelect="rowSelect"
            :scrollBarWidth="scrollBarWidth"
            :headSelection="headSelection"
            :height="height">
          </Tree-table>
        </div>
      </div>
      <div :class="[prefixCls + '-tip']"
        v-show="((!!localeNoDataText && (!data || data.length === 0)))" :style="bodyStyle" @scroll="handleBodyScroll">
        <div class="h-table-tiptext" :style="textStyle" >
          <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
        </div>
        <table cellspacing="0" cellpadding="0" border="0" :style="tableStyle" style="height:1px">
        </table>
      </div>
      <div class="h-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"> </div>
      <div class="h-table__column-move-proxy h-table-cell" ref="moveProxy" v-show="moveProxyVisible"></div>
    </div>
    <Spin fix size="large" v-if="loading">
      <slot name="loading">
        <h-icon name="load-c" size=18 class='h-load-loop'></h-icon>
        <div v-html="loadingText"></div>
      </slot>
    </Spin>
  </div>
</template>
<script>
import GirdHead from './Gird-head.vue';
import TreeTable from './Tree-table.vue';
import Spin from '../Spin/Spin.vue';
import Mixin from './mixin';
import { oneOf, getStyle, deepCopy, deepCopyEx, getScrollBarSize,getBarBottom,findInx,IEVersion} from '../../util/tools';
import { on, off } from '../../util/dom';
import Locale from '../../mixins/locale';
// import Csv from '../../util/csv';
// import ExportCsv from './export-csv';
const prefixCls = 'h-editgird';
let columnKey = 1;
export default {
  name: 'SimpleTreeGird',
  mixins: [ Locale,Mixin ],
  components: { GirdHead,TreeTable},
  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    columns: {
      type: Array,
      default () {
        return [];
      }
    },
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default']);
      }
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: true
    },
    rowClassName: {
      type: Function,
      default () {
        return '';
      }
    },
    showIndeterminate:{
      type:Boolean,
      default:false
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    rowSelect:{
      type:Boolean,//多选时是否支持点击行选中
      default:false
    },
    isCheckbox:{
      type:Boolean,
      default:false
    },
    checkStrictly:{
      type:Boolean,
      default:false,
    },
    headSelection:{
      type:Boolean,
      default:false
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadData: {
      type: Function
    },
    canDrag: {
      type:Boolean,
      default:false,
    },
    selectRoot:{
      type:Boolean,
      default:false,
    },
    notAdaptive: {
      type:Boolean,
      default:false,
    },
    canMove: {
      type: Boolean,
      default: false
    },
    headSelection: {
      type:Boolean,
      default:false,
    },
    disabledHover: {
      type:Boolean,
      default:false,
    },
  },
  data () {
    return {
      ready: false,
      tableWidth: 0,
      initWidth:0,
      tipWidth:0,
      columnsWidth: {},
      prefixCls: prefixCls,
      cloneColumns: this.makeColumns(),
      showSlotHeader: true,
      bodyHeight: 0,
      bodyRealHeight: 0,
      resizeProxyVisible: false,
      moveProxyVisible: false,
      scrollBarWidth: getScrollBarSize(),
      currentContext: this.context,
      showScroll:false,
      headerRealHeight:0,
      selectType:false,
      initData: [],
      checkedObj:[],
      indexAndId:{},
      selection:{},
      buttomNum:null,
      rebuildData:[],
      isSelectAll:null
    };
  },
  computed: {
    fixedBodyStyle () {
      let style = {};
      if (this.bodyHeight !== 0) {
        let height =this.bodyHeight-this.scrollBarWidth;
        if (this.tableWidth < this.initWidth+1) {
          height = height + this.scrollBarWidth-1;
        }
        style.height = this.scrollBarWidth > 0 ? `${height}px` : `${height}px`;
      }
      return style;
    },
    fixedTableStyle () {
      let style = {};
      let width = 0;
      this.leftFixedColumns.forEach((col) => {
        if (col.fixed && col.fixed === 'left') width += col._width;
      });
      style.width = `${width}px`;
      return style;
    },
    leftFixedColumns () {
        let left = [];
        let other = [];
        this.cloneColumns.forEach((col) => {
            if (col.fixed && col.fixed === 'left') {
                left.push(col);
            } else {
                other.push(col);
            }
        });
        return left.concat(other);
    },
    isLeftFixed () {
      return this.columns.some(col => col.fixed && col.fixed === 'left');
    },
    loadingText(){
      return this.t('i.table.loadingText');
    },
    localeNoDataText () {
      if (this.noDataText === undefined) {
        return this.t('i.table.noDataText');
      } else {
        return this.noDataText;
      }
    },
    wrapClasses () {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-hide`]: !this.ready,
          [`${prefixCls}-with-header`]: this.showSlotHeader,
        }
      ];
    },
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-border`]: this.border,
          [`${prefixCls}-with-fixed-top`]: !!this.height,
          [`${prefixCls}-can-hover`]: !this.disabledHover,
          [`${prefixCls}-can-stripe`]: this.stripe
        }
      ];
    },
    fixedHeaderClasses () {
      return [
        `${prefixCls}-fixed-header`,
        {
          [`${prefixCls}-fixed-header-with-empty`]: !this.data.length
        }
      ];
    },
    styles () {
      let style = {};
      if (this.height) {
        const height = Number(this.height)+2;
        style.height = `${height}px`;
      }
      if (this.width) style.width = `${this.width}px`;
      return style;
    },
    tableStyle () {
      let style = {};
      if (this.tableWidth !== 0) {
        let width = this.tableWidth;
        style.width = `${width}px`;
      }
      return style;
    },
    tableBodyStyle () {
      let style = {};
      if (this.tableWidth !== 0) {
        let width = this.tableWidth;
        if(this.tableWidth+1>=this.initWidth-this.scrollBarWidth && this.bodyRealHeight>this.height){
          width = parseInt(this.tableWidth) - this.scrollBarWidth
        }
        style.width = `${width}px`;
      }
      return style;
    },
    bodyStyle () {
      let style = {};
      if (this.bodyHeight !== 0) {
        // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
        // const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
        const height = this.bodyHeight;
        style.height = `${height}px`;
      }
      return style;
    },
    textStyle(){
      let style = {};
      style.width = this.initWidth!=0?this.initWidth+'px':'100%';
      // const height = (this.isLeftFixed || this.isRightFixed) ? this.bodyHeight + this.scrollBarWidth : this.bodyHeight;
      const height = this.bodyHeight;
      style.height = this.height?Number(height-this.scrollBarWidth)+'px':null;
      style.lineHeight = this.height?Number(height-this.scrollBarWidth)+'px':null;
      return style;
    },
  },
  methods: {
    handleMouseIn (id) {
      if (this.disabledHover) return;
      let inx = this.indexAndId[id]
      if (!this.checkedObj[inx]) return;
      this.checkedObj[inx]._isHover = true;
    },
    handleMouseOut (id) {
      if (this.disabledHover) return;
      let inx = this.indexAndId[id]
      if (!this.checkedObj[inx]) return;
      this.checkedObj[inx]._isHover = false;
    },
    handleFixedMousewheel(event) {
      let deltaY = event.deltaY;
      if(!deltaY && event.detail){
        deltaY = event.detail * 40;
      }
      if(!deltaY && event.wheelDeltaY){
        deltaY = -event.wheelDeltaY;
      }
      if(!deltaY && event.wheelDelta){
        deltaY = -event.wheelDelta;
      }
      if(!deltaY) return;
      const body = this.$refs.body;
      const currentScrollTop = body.scrollTop;
      if (deltaY < 0 && currentScrollTop !== 0) {
        event.preventDefault();
      }
      if (deltaY > 0 && body.scrollHeight - body.clientHeight > currentScrollTop) {
        event.preventDefault();
      }
      //body.scrollTop += deltaY;
      let step = 0;
      let timeId = setInterval(()=>{
        step += 10;
        if(deltaY>0){
            body.scrollTop += 5;
        }
        else{
            body.scrollTop -= 5;
        }
        if(step >= Math.abs(deltaY)){
            clearInterval(timeId);
        }
      }, 1);
    },
    move(i,j){
      this.$emit('on-move', i, j);
    },
    changeCheckedObj(index,status,single){
      let item = single?'_isHighlight':'checked';
      if(status==null){
        this.$set(this.checkedObj[index],item,!this.checkedObj[index][item]);
      }else{
        this.$set(this.checkedObj[index],item,status);
      }
    },
    changeWidth(width,key,lastWidth){
      var that = this;
      var lastInx = this.cloneColumns.length-1;
      var totalWidth=0;
      this.cloneColumns.forEach((col,i)=>{
        if (col.key==key) {
          that.$set(col,"width",width);
          that.$set(col,"_width",width);
        }
        // && !that.notAdaptive
        if (i == lastInx && !that.notAdaptive) {
          that.$set(col,"width",lastWidth);
          that.$set(col,"_width",lastWidth);
        }
        var colWidth = col.width||col._width
        totalWidth = totalWidth+ colWidth;
      });
      this.tableWidth=totalWidth;
      // && !that.notAdaptive
      if (this.tableWidth<this.initWidth && !that.notAdaptive) {
        this.tableWidth = this.initWidth-1;
      }
      this.$nextTick(()=>{
        this.$emit('on-drag', width, key);
      })
    },
    handleResize () {
      this.$nextTick(() => {
        const allWidth = !this.columns.some(cell => !cell.width&&cell.width!==0);    // each column set a width
        if (allWidth) {
          this.tableWidth = this.columns.map(cell => cell.width).reduce((a, b) => a + b);
        } else {
          this.tableWidth = parseInt(getStyle(this.$el, 'width')) - 1;
        }
        this.columnsWidth = {};
        this.$nextTick(() => {
          let columnsWidth = {};
          let autoWidthIndex = -1;
          // if (allWidth) autoWidthIndex = this.cloneColumns.findIndex(cell => !cell.width);//todo 这行可能有问题
          if (allWidth) autoWidthIndex = findInx(this.cloneColumns,cell => !cell.width);
          this.cloneColumns.forEach((cell,i)=>{})
          if (this.data.length) {
            const $td = this.$refs.tbody.$el.querySelectorAll('tbody tr')[0].querySelectorAll('td');
            for (let i = 0; i < $td.length; i++) {    // can not use forEach in Firefox
              const column = this.cloneColumns[i];
              let width = parseInt(getStyle($td[i], 'width'));
              if (i === autoWidthIndex) {
                width = parseInt(getStyle($td[i], 'width')) - 1;
              }
              if (column.width) {
                width = column.width||''
              } else {
                if (width < 100) width = 100
              }
              this.cloneColumns[i]._width = width||'';
              this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b);
              columnsWidth[column._index] = {
                width: width
              };
            }
            this.columnsWidth = columnsWidth;
          } else {
            if (!this.$refs.thead) return;
            const $th = this.$refs.thead.$el.querySelectorAll('thead tr')[0].querySelectorAll('th');
            for (let i = 0; i < $th.length; i++) {    // can not use forEach in Firefox
              const column = this.cloneColumns[i];
              let width = parseInt(getStyle($th[i], 'width'));
              if (i === autoWidthIndex) {
                width = parseInt(getStyle($th[i], 'width')) - 1;
              }
             // 自适应列在表格宽度较小时显示异常，为自适应列设置最小宽度100（拖拽后除外）
              if (column.width) {
                  width = column.width||'';
              } else {
                  if (width < 100) width = 100;
              }
              this.cloneColumns[i]._width = width||'';
              this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b);
              columnsWidth[column._index] = {
                  width: width
              };
            }
            this.columnsWidth = columnsWidth;
          }
        });
        // get table real height,for fixed when set height prop,but height < table's height,show scrollBarWidth
        this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'));
      });
    },
    clickCurrentRow (row) {
      this.isSelectAll = null
      let inx = this.indexAndId[row.id];
      if(this.highlightRow){
        let status = this.checkedObj[inx]._isHighlight?false:true
        for(var i=0;i<this.checkedObj.length;i++){
          if(this.checkedObj[i]._isHighlight||this.checkedObj[i].checked){
            this.checkedObj[i]._isHighlight = false;
            this.checkedObj[i].checked = false;
          }
        }
        this.$set(this.checkedObj[inx],'_isHighlight',status)
        this.$set(this.checkedObj[inx],'checked',status)
      }
      this.$nextTick(()=>{
        this.$emit('on-row-click', row);
        if(this.highlightRow){
          this.$emit('on-current-change', status?row:null);
        }
        if(this.selectRoot){
          if(row._parentId!=undefined){
            let item = null
            for(var i=0;i<this.data.length;i++){
              if(this.data[i].id == row._parentId){
                item = this.data[i]
                break;
              }
            }
            this.$emit('on-select-root',status?item:null)
          }else{
            this.$emit('on-select-root',status?row:null)
          }
        }
      })
    },
    dblclickCurrentRow (row) {
      this.$nextTick(()=>{
        this.$emit('on-row-dblclick', JSON.parse(JSON.stringify(row)));
      })
    },
    toggleExpand (row,status) {
      let index = this.indexAndId[row.id];
      this.$set(this.checkedObj[index],'_isExpand',status)
      this.$nextTick(()=>{
        this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'));
        this.$emit('on-expand', row,status);
      })
    },
    changeSelect (row,status) {
      this.isSelectAll = null
      this.$nextTick(()=>{
        this.$emit('on-select-change',this.getSelection(),this.getSelection(true));
      })
    },
    changeSelection (row,status){
      if(status){
        this.selection[row.id] = row;
      }else{
        if(this.selection[row.id]){
          delete this.selection[row.id];
        }
      }
    },
    clearSelected () {
      this.selection ={}
      for(let i in this.checkedObj){
        this.checkedObj[i].checked = false
      }
      this.$nextTick(()=>{
        this.$emit('on-select-change',[],[]);
      })
    },
    getSelection(status){
      let arr = [];
      let selectIndex=[];
      for(let i in this.checkedObj){
        if(this.checkedObj[i].checked){
          arr.push(this.checkedObj[i].row);
          selectIndex.push(this.checkedObj[i].id);
        }
      }
      return status?selectIndex:arr;
    },
    selectAll (status) {
      if(!this.rebuildData ||this.rebuildData.length==0) return
      this.checkedObj.forEach((col,inx)=>{
        this.$set(col,'checked',status)
      })
    },
    fixedHeader () {
      if (this.height) {
          this.$nextTick(() => {
              const headerHeight = this.headerRealHeight;
              this.bodyHeight = this.height - headerHeight;
          });
      } else {
          this.bodyHeight = 0;
      }
    },
    handleBodyScroll (event) {
      let _this = this;
      this.buttomNum = getBarBottom(event.target,this.scrollBarWidth);
      if (this.showHeader) this.$refs.header.scrollLeft = event.target.scrollLeft;
      if (this.isLeftFixed) this.$refs.fixedBody.scrollTop = event.target.scrollTop;
    },
    // 将数据转换成objData,同时rebuild
    makeColumns () {
      var that = this;
      let columns = deepCopy(this.columns);
      let left = []
      let right = []
      let center = [];

      columns.forEach((column, index) => {
        column._index = index;
        column._columnKey = columnKey++;
        column._width = column.width ? column.width : '';    // update in handleResize()
        // if(!!column.hiddenCol){
        //   that.columns[index].width = 0;
        //   column.width = 0;
        //   column._width = 0;
        // }
        column._sortType = 'normal';
        column._filterVisible = false;
        column._isFiltered = false;
        column._filterChecked = [];

        if (!column.hiddenCol || column.hiddenCol == 'false') {
          if (column.fixed && column.fixed === 'left') {
            left.push(column)
          } else if (column.fixed && column.fixed === 'right') {
            right.push(column)
          } else {
            center.push(column)
          }
        }

        // if (!column.hiddenCol) {
        //   center.push(column);
        // }
      });
      return left.concat(center).concat(right)
    },
    initResize(){
      this.$nextTick(() => {
        this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0;
      });
    },
    deepTraversal(data,id,status,str){
      for(let i=0;i<data.length; i++){
        if(data[i].id == id){
          this.$set(data[i],str,status)
          this.setStatus(data[i],i)
          break;
        }
        if(data[i].children&&data[i].children.length>0){
          this.deepTraversal(data[i].children,id,status,str)
        }
      }
    },
    expandRow(id,status){
      if(!this.data || this.data.length==0) return;
      let index = this.indexAndId[id];
      if(!this.checkedObj[index]){
        this.deepTraversal(this.rebuildData, id, status, 'expand')
      }else{
        if(!this.checkedObj[index]._collectionState){
          this.deepTraversal(this.rebuildData, id, status, 'expand')
        }
        this.$set(this.checkedObj[index],'_isExpand',status)
      }
    },
    selectRow(id,status=true){
      if(!this.data || this.data.length==0) return;
      let index = this.indexAndId[id];
      if(!this.checkedObj[index]){
        this.deepTraversal(this.rebuildData, id, status,'highlight')
      }else{
        this.$set(this.checkedObj[index],'_isHighlight',status)
      }
    },
    checkedRow(id,status=true){
      if(!this.data || this.data.length==0) return;
      if(!this.checkStrictly){
        let index = this.indexAndId[id];
        let row = null
        if(!this.checkedObj[index]){
          row = this.checkedDown(this.rebuildData,id,status)
        }else{
          row = this.checkedObj[index].row
        }
        this.linkageChecked(row,status)
      }else{
        let index = this.indexAndId[id];
        if(!this.checkedObj[index]){
          this.deepTraversal(this.rebuildData, id, status,'checked')
        }else{
          this.$set(this.checkedObj[index],'checked',status)
        }
      }
    },
    linkageChecked(row,status){
      let index = this.indexAndId[row.id];
      if(!this.checkedObj[index]){
        // this.$set(row,'checked',status)
        this.setStatus(row,status)
      }else{
        this.$set(this.checkedObj[index],'checked',status)
      }
      if(row.children&&row.children.length>0){
        row.children.forEach((col,inx)=>{
          this.linkageChecked(col,status)
        })
      }
    },
    setStatus(col,status){
      if(!this.indexAndId[col.id]){
        this.indexAndId[col.id]= this.checkedObj.length;
        this.checkedObj.push({
          id:col.id,
          checked:status,
          _isExpand:col.expand||null,
          _collectionState: col.expand||false,
          _parentId:col._parentId,
          _isHighlight:col.highlight||false,
           _isHover:false,
          row:col,
        })
      }
    },
    checkedDown(data,id,status){
      let result = null
      function findRow(data,id){
        for(let i=0;i<data.length; i++){
          if(result){break}
          if(data[i].id == id){
            result = data[i]
            break
          }
          if(data[i].children&&data[i].children.length>0){
            findRow(data[i].children,id,status)
          }
        }
      }
      findRow(data,id)
      return result
    },

  },
  created () {
    if (!this.context) this.currentContext = this.$parent;
    this.showSlotHeader = this.$slots.header !== undefined;
  },
  mounted () {
    if (this.showHeader) {
      if (!!this.size) {
        this.headerRealHeight = this.size=='small'?35:48;
      }else{
        this.headerRealHeight=42;
      }
    }
    if (this.columns[0].type && this.columns[0].type=='selection') {
      this.selectType=true;
    }
    this.handleResize();
    this.fixedHeader();
    this.$nextTick(() => {
      this.ready = true;
      this.initWidth =parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0;
    });
    //window.addEventListener('resize', this.handleResize, false);
    on(window, 'resize', this.handleResize);
    on(window, 'resize', this.initResize);
    this.$on('on-visible-change', (val) => {
      if (val) {
          this.handleResize();
          this.fixedHeader();
      }
    });
    this.rebuildData = this.data
  },
  beforeDestroy () {
    off(window, 'resize', this.handleResize);
    off(window, 'resize', this.initResize);
  },
  watch: {
    data: {
      handler (val) {
        this.handleResize();
        if(this.rebuildData.length === 0 || val.length === 0) {
          if(this.$refs.body) {
            this.$refs.body.scrollLeft = 0
          }
          if(this.$refs.header) {
            this.$refs.header.scrollLeft = 0
          }
        }
        this.rebuildData = this.data
      },
      deep: true
    },
    columns: {
      handler () {
        // todo 这里有性能问题，可能是左右固定计算属性影响的
        this.cloneColumns = this.makeColumns();
        this.handleResize();
      },
      deep: true
    },
    height () {
        this.fixedHeader();
    },
    buttomNum (val) {
      this.$emit('on-scroll',val);
    },
    isSelectAll(val){
      if(val != null){
        this.selectAll(val)
        this.$emit('on-select-all', val);
      }
    },
    checkedObj(val,oldval){
      if(this.isCheckbox&&this.isSelectAll != null){
        this.selectAll(this.isSelectAll)
      }
    }
  }
};
</script>
