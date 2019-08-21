<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styles" ref="tHead">
  <!-- 签用于对表格中的列进行组合，以便对其进行格式化。 -->
    <colgroup>
      <col v-for="(column, index) in columns" :width="setCellWidth(column, index, true)" :key="index">
    </colgroup>
    <thead>
      <tr v-if="multiLevel" v-for="(colItem,inx) in multiData" :key="inx">
        <th v-for="(multi, index) in colItem" :colspan="multi.cols||1" :rowspan="multi.rows||1" :key="index" :class="aliCls(multi)">
          <div :class="[prefixCls+'-cell']"><span>{{multi.title}}</span></div>
        </th>
      </tr>
      <tr class="cur-th">
        <th v-for="(column, index) in columns"
          v-on:mousedown="mousedown($event,column,index)"
          v-on:mouseout="mouseout($event,column,index)"
          v-on:mousemove="mousemove($event,column,index)"
          v-on:mouseup="mouseup($event,column,index)"
          :key="index"
          :class="alignCls(column)"
          >
          <div :class="cellClasses(column)">
            <template v-if="column.type === 'expand'"></template>
            <template v-else-if="column.type === 'selection'">
              <render-header v-if="column.renderHeader" :render="column.renderHeader" :column="column" :index="index"></render-header>
              <Checkbox class="span-cell" v-else-if="!column.title" size="large" @mousedown.native.stop="handleClick" :value="isSelectAll" @on-change="selectAll"></Checkbox>
              <span v-else class="span-cell">{{column.title}}</span>
            </template>
            <template v-else>
              <span class="span-cell" v-if="!column.renderHeader" @click="handleSortByHead(index)" :title="column.headerTooltip ? column.title : ''">{{ column.title || '#' }}</span>
              <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
            </template>
            <template>
              <span :class="[prefixCls + '-sort']" v-if="column.sortable">
                <Icon name="android-arrow-dropup" :class="{on: column._sortType === 'asc'}" @on-click="handleSort(index, 'asc')" @mousedown.native.stop="handleClick"></Icon>
                <Icon name="android-arrow-dropdo" :class="{on: column._sortType === 'desc'}" @on-click="handleSort(index, 'desc')" @mousedown.native.stop="handleClick"></Icon>
              </span>
              <Poptip
                v-if="isPopperShow(column)"
                v-model="column._filterVisible"
                placement="bottom"
                @on-popper-hide="handleFilterHide(index)">
                <span :class="[prefixCls + '-filter']">
                  <Icon name="keyboard" @mousedown.native.stop="handleClick" :class="{on: column._isFiltered}"></Icon>
                </span>
                <render-header slot="content" v-if="column.renderFilter" :render="column.renderFilter" :column="column" :index="index"></render-header>
                <div slot="content" :class="[prefixCls + '-filter-list']" v-else-if="column._filterMultiple" @mousedown="handleClick">
                  <div :class="[prefixCls + '-filter-list-item']">
                    <checkbox-group v-model="column._filterChecked">
                      <checkbox v-for="(item,i) in column.filters" :key="column._columnKey+i" :label="item.value">{{ item.label }}</checkbox>
                    </checkbox-group>
                  </div>
                  <div :class="[prefixCls + '-filter-footer']">
                    <h-button type="text" size="small" :disabled="!column._filterChecked.length" @click.native="handleFilter(index)">{{ t('i.table.confirmFilter') }}</h-button>
                    <h-button type="text" size="small" @click.native="handleReset(index)">{{ t('i.table.resetFilter') }}</h-button>
                  </div>
                </div>
                <div slot="content" :class="[prefixCls + '-filter-list']" v-else @mousedown="handleClick">
                  <ul :class="[prefixCls + '-filter-list-single']">
                    <li
                      :class="itemAllClasses(column)"
                      @click="handleReset(index)">{{ t('i.table.clearFilter') }}</li>
                    <li
                      :class="itemClasses(column, item)"
                      v-for="item in column.filters"
                      :key = "item.value"
                      @click="handleSelect(index, item.value)">{{ item.label }}</li>
                  </ul>
                </div>
              </Poptip>
            </template>
          </div>
        </th>
      </tr>
    </thead>
  </table>
</template>
<script>
import Icon from '../Icon/Icon.vue'
import CheckboxGroup from '../Checkbox/CheckboxGroup.vue';
import Checkbox from '../Checkbox/Checkbox.vue';
import Poptip from '../Poptip/Poptip.vue';
import hButton from '../Button/Button.vue';
import renderHeader from './header';
import { on, off } from '../../util/dom';
import {getScrollBarSize,hasClass,addClass,removeClass,typeOf} from '../../util/tools';
import Mixin from './mixin';
import Locale from '../../mixins/locale';

export default {
  name: 'TableHead',
  mixins: [ Mixin, Locale ],
  components: {CheckboxGroup, Checkbox, Poptip, hButton, renderHeader,Icon},
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,
    objData: Object,
    data: Array,    // rebuildData for sort or filter
    columnsWidth: Object,
    fixed: {
      type: [Boolean, String],
      default: false
    },
    canDrag:Boolean,
    canMove:Boolean,
    headAlgin:String,
    lastColWidth:[Number,String],
    minDragWidth:[Number,String],
    multiLevel:Array,
  },
  data(){
    return{
      draggingColumn: null,
      moveingColumn: null,
      dragging: false,
      dragState: {},
      moveState: {},
      moveing:false,
      cloumnsLeft:{},
      multiData:null,
      isCurrent: true,
      sortIndex: 0,
      beginLocation: {}
    }
  },
  computed: {
    styles () {//深拷贝
      const style = Object.assign({}, this.styleObject);
      const width = parseInt(this.styleObject.width);
      style.width = `${width}px`;
      return style;
    },
    isSelectAll () {
      let isSelectAll = true;
      let allDisable = true;
      if (!this.data.length) isSelectAll = false;
      for (let i = 0; i < this.data.length; i++) {
        if (!this.objData[this.data[i]._index]._isChecked && !this.objData[this.data[i]._index]._isDisabled) {
          isSelectAll = false;
          break;
        }
        if(!this.objData[this.data[i]._index]._isDisabled){
          allDisable = false;
        }
      }
      if(isSelectAll&&allDisable) isSelectAll = false;
      return isSelectAll;
    }
  },
  mounted(){
    this.getLeftWidth();
    //  this.changeMultiData(this.multiLevel);
    this.multiData = this.multiLevel;
    on(window, 'resize', this.getLeftWidth);
  },
  methods: {
    cellClasses (column) {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right')
        }
      ];
    },
    itemClasses (column, item) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: column._filterChecked[0] === item.value
        }
      ];
    },
    itemAllClasses (column) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length
        }
      ];
    },
    selectAll () {
      const status = !this.isSelectAll;
      this.$parent.selectAll(status);
    },
    handleSort (index, type) {
      if (this.columns[index]._sortType === type) {
        type = 'normal';
      }
      let _index = this.columns[index]._index;
      this.$parent.handleSort(_index, type);
      this.sortIndex = index
    },
    handleSortByHead(index) {
      const column = this.columns[index];
      if (column.sortable) {
        const type = column._sortType;
        if (type === 'normal') {
          this.handleSort(index, 'asc');
        } else if (type === 'asc') {
          this.handleSort(index, 'desc');
        } else {
          this.handleSort(index, 'normal');
        }
      }
    },
    handleFilter (index) {
      let _index = this.columns[index]._index;
      this.$parent.handleFilter(_index);
    },
    handleSelect (index, value) {
      let _index = this.columns[index]._index;
      this.$parent.handleFilterSelect(_index, value);
    },
    handleReset (index) {
      let _index = this.columns[index]._index;
      this.$parent.handleFilterReset(_index);
    },
    handleFilterHide (index) {
      let _index = this.columns[index]._index;
      this.$parent.handleFilterHide(_index);
    },
    getLeftWidth (){
      this.$nextTick(()=>{
        for (let i = 0; i<this.columns.length; i++) {
          let leftWidth = 0;
          for (let j = 0; j<i; j++) {
            leftWidth = leftWidth + this.columns[j]._width;
          }
          this.cloumnsLeft[i] = leftWidth;
        }
      })
    },
    mousedown(event,column,index){
      this.beginLocation.clientX = event.clientX
      this.beginLocation.clientY = event.clientY
      if (this.$isServer) return;
      if (!column) return;
      let _this = this;
      if (!this.canDrag && !this.canMove) return;
      if (this.draggingColumn) {
        this.dragging = true;
        this.$parent.resizeProxyVisible = true;
        const table = this.$parent;
        const tableEl = table.$el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = this.$el.querySelector(`th.h-ui-${column.key}`);
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = columnRect.left - tableLeft + this.minDragWidth;
        let lastInx = null
        for(var i = this.columns.length-1;i>=0;i--){
          if(this.columns[i].fixed!='right'){
            lastInx = i
            break;
          }
        }
        let lastWidth =this.findObj(event,"TR").children[lastInx].offsetWidth;
        let tableWidth = this.$el.parentElement.offsetWidth-1;
        let headWidth = this.$el.offsetWidth;
        addClass(columnEl, 'noclick');

        this.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft
        };

        const resizeProxy = table.$refs.resizeProxy;
        resizeProxy.style.left = this.dragState.startLeft + 'px';

        document.onselectstart = function() { return false; };
        document.ondragstart = function() { return false; };

        const handleMouseMove = (event) => {
          const deltaLeft = event.clientX - this.dragState.startMouseLeft;
          const proxyLeft = this.dragState.startLeft + deltaLeft;

          resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
        };

        const handleMouseUp = () => {
          if (_this.dragging) {
            const {
              startColumnLeft,
              startLeft
            } = _this.dragState;
            const finalLeft = parseInt(resizeProxy.style.left, 10);
            const columnWidth = finalLeft - startColumnLeft;
            let dragWidth = finalLeft - startLeft;//>0为输入框增大，<0为减小
            if (dragWidth>=0) {
              lastWidth = (lastWidth-dragWidth)>=this.lastColWidth?(lastWidth-dragWidth):this.lastColWidth;
            }else{
              if (headWidth+1>=tableWidth) {//此时有滚动条
                if (headWidth+1+dragWidth<=tableWidth) {
                  lastWidth =lastWidth+tableWidth-headWidth-dragWidth;
                }
              }else{
                lastWidth = lastWidth-dragWidth;
              }
            }
            if (table.bodyHeight !== 0 && lastInx==this.columns.length) {
              lastWidth = lastWidth - getScrollBarSize();
            }
            _this.$emit('on-change-width', columnWidth, column.key,lastWidth,lastInx);

            document.body.style.cursor = '';
            _this.dragging = false;
            _this.draggingColumn = null;
            _this.dragState = {};

            table.resizeProxyVisible = false;
          }

          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.onselectstart = null;
          document.ondragstart = null;

          setTimeout(function() {
            removeClass(columnEl, 'noclick');
          }, 0);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
      if(this.moveingColumn){
        this.moveing = true;
        addClass(document.body, 'useSelect');
        this.$parent.moveProxyVisible = true;
        let dom = this.findObj(event,'TH').cloneNode(true);
        dom.width = column._width;
        addClass(dom,'move-proxy-th');
        const table = this.$parent;
        const tableEl = table.$el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const tableTop = tableEl.getBoundingClientRect().top;
        const columnEl = this.$el.querySelector(`th.h-ui-${column.key}`);
        const columnRect = columnEl.getBoundingClientRect();
        addClass(columnEl, 'noclick');
        this.moveState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.left - tableLeft-1,
          tableLeft
        };
        const moveProxy = table.$refs.moveProxy;
        const resizeProxy = table.$refs.resizeProxy;
        moveProxy.style.left = this.moveState.startLeft + 'px';
        moveProxy.style.top = event.clientY -tableTop-20 + 'px';
        // table.setMoveProxy(index);
        moveProxy.appendChild(dom);
        let resizeIndex = Number(index);
        let resizeLeft;
        const handleMouseMove = (event) => {
          this.$parent.resizeProxyVisible = true;
          const deltaLeft = event.clientX - this.moveState.startMouseLeft;
          const moveLeft = this.moveState.startLeft + deltaLeft;
          if (deltaLeft>0) {
            let changeRight = this.cloumnsLeft[index]+deltaLeft;
            changeRight = changeRight+column._width;
            for (let i in _this.cloumnsLeft) {
              if (changeRight >_this.cloumnsLeft[i]+30) resizeIndex = Number(i);
            }
            resizeLeft = this.$el.querySelectorAll(`th`)[resizeIndex].getBoundingClientRect().right - tableLeft -1;
          }
          if (deltaLeft<0){
            let changeLeft = this.cloumnsLeft[index]+deltaLeft;
            for (let i in _this.cloumnsLeft) {
              if (changeLeft >_this.cloumnsLeft[i]-50) resizeIndex = Number(i);
            }
            resizeLeft = this.$el.querySelectorAll(`th`)[resizeIndex].getBoundingClientRect().left - tableLeft -1;
          }
          moveProxy.style.left = moveLeft + 'px';
          moveProxy.style.top = event.clientY-tableTop-20 + 'px';
          resizeProxy.style.left = resizeLeft + 'px';
        };

        const handleMouseUp = () => {
          if (_this.moveing) {
            table.sortCloumn(index,resizeIndex,column._index);
            document.body.style.cursor = '';
            removeClass(document.body, 'useSelect');
            _this.moveing = false;
            _this.moveingColumn = null;
            _this.moveState = {};
            moveProxy.removeChild(dom);
            table.resizeProxyVisible = false;
            table.moveProxyVisible = false;
          }

          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);

          setTimeout(function() {
            removeClass(columnEl, 'noclick');
          }, 0);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    },
    mousemove(event,column,index){
      // if (!this.canDrag || !column ) return;
      if (!column ) return;
      if (column.children && column.children.length > 0) return;
      let target = this.findObj(event,"TH");
      if(this.canDrag){
        // moveDrag需传入event win7下FF60版本不可拖拽
        this.moveDrag(event, target,column);
      }
      if(this.canMove){
        this.moveMove(event, target,column)
      }
    },
    moveDrag(event, target,column){
      if (!this.dragging && !this.moveing) {
        let rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize';
          this.draggingColumn = column;
        } else if (!this.dragging) {
          if(!this.canMove) bodyStyle.cursor = '';
          this.draggingColumn = null;
        }
      }
    },
    moveMove(event, target,column){
      if (!this.moveing && !this.dragging) {
        let rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.right - event.pageX > 8 && rect.right - event.pageX<rect.width) {
          bodyStyle.cursor = 'pointer';
          // bodyStyle.userSelect = 'none';
          this.moveingColumn = column;
        } else if (!this.moveing) {
          if(!this.canDrag) bodyStyle.cursor = '';
          // bodyStyle.userSelect = 'text';
          this.moveingColumn = null;
        }
      }
    },
    mouseup(event, column, index) {
      //拖拽表头排序不触发
      if(this.isDrag(this.beginLocation.clientX, this.beginLocation.clientY, event.clientX, event.clientY)) {
        return
      }
      /**
       * 【TS:201907290049-财富业委会_占美强-【需求类型】缺陷【需求描述】目前列表查询，可以支持点击名字排】
       * 【TS:201907290145-资管业委会（资管）_孔磊-【需求类型】需求【需求描述】表格2、点击列头时就可以进行排序】
       * */
      if(column.sortable) {
        const type = column._sortType;
        if (type === 'normal') {
          this.handleSort(index, 'asc');
        } else if (type === 'asc') {
          this.handleSort(index, 'desc');
        } else {
          this.handleSort(index, 'normal');
        }
      }
    },
    isDrag(x1, y1, x2, y2) {
      if(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) <= 1) {
        return false;
      }
      return true;
    },
    mouseout() {
      if (this.$isServer) return;
      document.body.style.cursor = '';
    },
    findObj(e,name){
      var obj=e.target;
      while(obj&&obj.tagName!=name){
        obj=obj.parentElement
      }
      return obj;
    },
    handleClick (event) {
      event.stopPropagation();
    },
    aliCls(item){
      return[
        {
          [`${item.className}`]: item.className,
          [`${this.prefixCls}-column-${item.align}`]: item.align,
        }
      ]
    }
  },
  watch:{
    columns:{
      deep:true,
      handler(){
        this.getLeftWidth();
      }
    },
    multiLevel(val){
      this.multiData = this.multiLevel;
    }
  },
  beforeDestroy(){
    off(window, 'resize', this.getLeftWidth);
  }
};
</script>
