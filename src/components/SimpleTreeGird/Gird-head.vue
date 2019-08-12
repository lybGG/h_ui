<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
  <!-- 签用于对表格中的列进行组合，以便对其进行格式化。 -->
    <colgroup>
      <col v-for="(column, index) in columns" :width="setCellWidth(column, index, true)" :key="index">
    </colgroup>
    <thead>
      <tr>
        <th v-for="(column, index) in columns"
          v-on:mousedown="mousedown($event,column,index)"
          v-on:mouseout="mouseout($event,column,index)"
          v-on:mousemove="mousemove($event,column,index)"
          :key="index"
          :class="alignCls(column)"
          >
          <div :class="[`${prefixCls}-cell`]">
            <Checkbox v-if="headSelection&&!index" @mousedown.native.stop="handleClick" @click.native.stop="selectAll" :value="isSelectAll" class="asyc-check"></Checkbox>
            <template>
              <span v-if="!column.renderHeader" @click="handleSortByHead(index)">{{ column.title || '#' }}</span>
              <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
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
import hButton from '../Button/Button.vue';
import renderHeader from './header';
import { on, off } from '../../util/dom';
import {getScrollBarSize,hasClass,addClass,removeClass} from '../../util/tools';
import Mixin from './mixin';
import Locale from '../../mixins/locale';

export default {
  name: 'TableHead',
  mixins: [ Mixin, Locale ],
  components: {CheckboxGroup, Checkbox,hButton, renderHeader,Icon},
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,
    // objData: Object,
    dataLength: [Number,String],
    columnsWidth: Object,
    headSelection: Boolean,
    canDrag:Boolean,
    canMove: Boolean,
    fixed:String,
  },
  data(){
    return{
      draggingColumn: null,
      dragging: false,
      dragState: {},
      moving: false,
      movingColumn: null,
      cloumnsLeft: [],
      isSelectAll:false,
    }
  },
  computed: {
    // isSelectAll () {
    //   let isSelectAll = true;
    //   if (!this.data.length) isSelectAll = false;
    //   for (let i = 0; i < this.data.length; i++) {
    //     if (!this.objData[this.data[i]._index]._isChecked && !this.objData[this.data[i]._index]._isDisabled) {
    //       isSelectAll = false;
    //       break;
    //     }
    //   }
    //   return isSelectAll;
    // }
  },
  watch: {
    columns: {
      deep:true,
      handler(){
        this.getLeftWidth();
      }
    }
  },
  mounted(){
    this.getLeftWidth();
    on(window, 'resize', this.getLeftWidth);
  },
  beforeDestroy(){
    off(window, 'resize', this.getLeftWidth);
  },
  methods: {
    selectAll (event) {
      event.stopPropagation();
      this.isSelectAll = !this.isSelectAll
      this.$parent.isSelectAll = this.isSelectAll
      // this.$parent.selectAll(this.isSelectAll);
    },
    handleSortByHead (index) {
    },
    getLeftWidth (){
      this.$nextTick(()=>{
        const columns = this.columns;
        for (let i = 0; i < columns.length; i++) {
          let leftWidth = 0;
          for (let j = 0; j<i; j++) {
            leftWidth = leftWidth + columns[j]._width;
          }
          this.cloumnsLeft[i] = leftWidth;
        }
      })
    },
    mousedown(event,column,index){
      if (this.$isServer) return;
      if (!column) return;
      if (!this.canDrag && !this.canMove) return;
      let _this = this;
      if (this.draggingColumn) {
        this.dragging = true;
        this.$parent.resizeProxyVisible = true;
        const table = this.$parent;
        const tableEl = table.$el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = this.$el.querySelector(`th.h-ui-${column.key}`);
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = columnRect.left - tableLeft + 30;
        let lastWidth =this.findObj(event,"TR").lastChild.offsetWidth;
        // if(this.$parent.tableWidth<this.$parent.initWidth-this.$parent.scrollBarWidth){
        //   lastWidth = lastWidth+this.$parent.initWidth-this.$parent.tableWidth-this.$parent.scrollBarWidth;
        // }
        let tableWidth = this.$parent.initWidth;
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
              lastWidth = (lastWidth-dragWidth)>=80?(lastWidth-dragWidth):80;
            }else{
              if (headWidth>=tableWidth) {//此时有滚动条
                if (headWidth+dragWidth<=tableWidth) {
                  lastWidth =lastWidth+tableWidth-headWidth-dragWidth-1;
                }
              }else{
                lastWidth = lastWidth-dragWidth;
              }
            }
            // if (this.$parent.bodyHeight!=0&&!this.$parent.notAdaptive) {
            //   lastWidth = lastWidth - getScrollBarSize();
            // }
            table.changeWidth(columnWidth, column.key,lastWidth)

            document.body.style.cursor = '';
            _this.dragging = false;
             _this.draggingColumn = false;
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
      if (this.movingColumn) {
        this.moving = true;
        addClass(document.body, 'useSelect');
        this.$parent.moveProxyVisible = true;
        let dom = this.findObj(event,'TH').cloneNode(true);
        dom.childNodes[0].style.width = column._width + "px";
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
          startLeft: columnRect.left - tableLeft - 1,
          tableLeft
        };
        const moveProxy = table.$refs.moveProxy;
        const resizeProxy = table.$refs.resizeProxy;
        moveProxy.style.left = this.moveState.startLeft + 'px';
        moveProxy.style.top = event.clientY - tableTop - 20 + 'px';
        moveProxy.appendChild(dom);
        let resizeIndex = Number(index);
        let resizeLeft;
        const handleMouseMove = (event) => {
          table.resizeProxyVisible = true;
          const deltaLeft = event.clientX - _this.moveState.startMouseLeft;
          const moveLeft = _this.moveState.startLeft + deltaLeft;
          if (deltaLeft > 0) {
            let changeRight = _this.cloumnsLeft[index]+deltaLeft;
            changeRight = changeRight+column._width;
            for (let i in _this.cloumnsLeft) {
              if (changeRight >_this.cloumnsLeft[i]+30) resizeIndex = Number(i);
            }
            resizeLeft = _this.$el.querySelectorAll(`th`)[resizeIndex].getBoundingClientRect().right - tableLeft -1;
          }
          if (deltaLeft < 0){
            let changeLeft = _this.cloumnsLeft[index]+deltaLeft;
            for (let i in _this.cloumnsLeft) {
              if (changeLeft >_this.cloumnsLeft[i]-50) resizeIndex = Number(i);
            }
            resizeLeft = _this.$el.querySelectorAll(`th`)[resizeIndex].getBoundingClientRect().left - tableLeft -1;
          }
          moveProxy.style.left = moveLeft + 'px';
          moveProxy.style.top = event.clientY-tableTop-20 + 'px';
          resizeProxy.style.left = resizeLeft + 'px';
        };

        const handleMouseUp = () => {
          if (_this.moving) {
            _this.sortCloumn(index,resizeIndex,column._index);
            document.body.style.cursor = '';
            removeClass(document.body, 'useSelect');
            _this.moving = false;
            _this.movingColumn = null;
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
      if (!column ) return;
      if (column.children && column.children.length > 0) return;
      let target = this.findObj(event,"TH");
      if(this.canDrag){
        // moveDrag需传入event win7下FF60版本不可拖拽
        this.moveDrag(event, target,column);
      }
      if(this.canMove) {
        this.moveMove(event, target,column)
      }
    },
    moveDrag(event, target,column){
      if (!this.dragging) {
        let rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize';
          this.draggingColumn = true;
        } else if (!this.dragging) {
          bodyStyle.cursor = '';
          this.draggingColumn = false;
        }
      }
    },
    moveMove(event, target,column){
      if (!this.moving && !this.dragging) {
        let rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.right - event.pageX > 8 && rect.right - event.pageX < rect.width && !column.fixed) {
          bodyStyle.cursor = 'pointer';
          this.movingColumn = column;
        } else if (!this.moving) {
          if(!this.canDrag) bodyStyle.cursor = '';
          this.movingColumn = null;
        }
      }
    },
    findObj(e,name){
      var obj=e.target;
      while(obj&&obj.tagName!=name){
        obj=obj.parentElement
      }
      return obj;
    },
    mouseout() {
      if (this.$isServer) return;
      document.body.style.cursor = '';
    },
    sortCloumn (curIndex, insertIndex, _index){
      if (this.columns[insertIndex].fixed) return
      const columns = this.columns;
      const item = columns[curIndex];;
      columns.splice(curIndex,1);
      columns.splice(insertIndex,0,item);
      this.$emit('on-move', _index, insertIndex);
    },
    handleClick (event) {
      event.stopPropagation();
    },
  }
};
</script>
