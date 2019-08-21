<script>
  import List from './List.vue';
  import Operation from './Operation.vue';
  import Locale from '../../mixins/locale';
  import Emitter from '../../mixins/emitter';
  import { deepCopy } from '../../util/tools';

  const prefixCls = 'h-transfer-table';

  export default {
    name: 'TransferTable',
    mixins: [ Emitter, Locale ],
    render (h) {
      function cloneVNode (vnode) {
        const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode));
        const cloned = h(vnode.tag, vnode.data, clonedChildren);
        cloned.text = vnode.text;
        cloned.isComment = vnode.isComment;
        cloned.componentOptions = vnode.componentOptions;
        cloned.elm = vnode.elm;
        cloned.context = vnode.context;
        cloned.ns = vnode.ns;
        cloned.isStatic = vnode.isStatic;
        cloned.key = vnode.key;

        return cloned;
      }

      const vNodes = this.$slots.default === undefined ? [] : this.$slots.default;
      const clonedVNodes = this.$slots.default === undefined ? [] : vNodes.map(vnode => cloneVNode(vnode));

      return h('div', {
        'class': this.classes
      }, [
        h(List, {
          ref: 'left',
          props: {
            prefixCls: this.prefixCls + '-list',
            data: this.leftData,
            columns:this.lColumns,
            stripe:this.stripe,
            border:this.border,
            width:this.lWidth,
            height:this.height,
            rowSelect:this.rowSelect,
            highlightRow:this.highlightRow,
            showEditInput:this.showEditInput,
            option:this.option,
            title: this.leftTitles,
            notData:this.LocalnotDataText,
            option:this.option,
            treeOption:this.treeOption,
            showTitle:this.showTitle,
            filterable: this.filterable,
            filterMethod: this.filterMethod,
            filterPlaceholder: this.localeFilterPlaceholder,
            noEdit:this.noEdit,
            isHide:this.hidelTable,
          },
          on: {
            // 'on-checked-keys-change': this.handleLeftCheckedKeysChange
          }
        }, vNodes),

        h(Operation, {
          props: {
            prefixCls: this.prefixCls,
            operations: this.operations,
            leftActive: this.leftValidKeysCount > 0,
            rightActive: this.rightValidKeysCount > 0,
            isHide:this.hideOperations
          }
        }),

        h(List, {
          ref: 'right',
          props: {
            prefixCls: this.prefixCls + '-list',
            data: this.rightData,
            columns:this.rColumns,
            stripe:this.stripe,
            border:this.border,
            width:this.rWidth,
            height:this.height,
            rowSelect:this.rowSelect,
            highlightRow:this.highlightRow,
            showEditInput:this.showEditInput,
            option:this.option,
            title: this.rightTitles,
            notData:this.LocalnotDataText,
            option:this.option,
            treeOption:this.treeOption,
            showTitle:this.showTitle,
            filterable: this.filterable,
            filterMethod: this.filterMethod,
            filterPlaceholder: this.localeFilterPlaceholder,
            noEdit:this.noEdit,
            isHide:this.hiderTable,
          },
          on: {
            // 'on-checked-keys-change': this.handleRightCheckedKeysChange
          }
        }, clonedVNodes)
      ]);
    },
    props: {
      lColumns:{
        type: Array,
        default () {
            return [];
        }
      },
      rColumns:{
        type: Array,
        default () {
            return [];
        }
      },
      lData: {
        type: Array,
        default:[],
      },
      rData: {
        type: Array,
        default :[],
      },
      lWidth:{
        type:Number,
        default:500
      },
      rWidth:{
        type:Number,
        default:400
      },
      height:{
        type:Number,
        default:300
      },
      lTitle:String,
      rTitle:String,
      operations: {//操作文案集合 从上至下
        type: Array,
        default () {
            return [];
        }
      },
      notDataText:String,
      showTitle:{
        type:Boolean,
        default:true
      },
      stripe:{
        type:Boolean,
        default:false
      },
      border:{
        type:Boolean,
        default:true
      },
      rowSelect:{
        type:Boolean,
        default:false
      },
      highlightRow:{
        type:Boolean,
        default:false
      },
      showEditInput:{
        type:Boolean,
        default:false
      },
      option:{
        type: Array,
        default: () => []
      },
      treeOption:{
        type: Array,
        default: () => []
      },
      filterable: {
        type: Boolean,
        default: false
      },
      filterPlaceholder: {
        type: String
      },
      filterMethod: {
        type: Function,
        default (data, query) {
          return true;
        }
      },
      noEdit:{
        type: Boolean,
        default: false
      },
      beforeMove:{
        type: Function,
        default (keys, dire, isAll) {
          return true;
        }
      },
      hidelTable:{
        type: Boolean,
        default: false,
      },
      hiderTable:{
        type: Boolean,
        default: false,
      },
      hideOperations:{
        type: Boolean,
        default: false,
      }     
    },
    data () {
      return {
        prefixCls: prefixCls,
        leftData: [],
        rightData: [],
      };
    },
    computed: {
      classes () {
          return [
              `${prefixCls}`
          ];
      },
      leftValidKeysCount () {
          return this.leftData.length;
      },
      rightValidKeysCount () {
          return this.rightData.length;
      },
      localeFilterPlaceholder () {
        if (this.filterPlaceholder === undefined) {
          return this.t('i.transferTable.filterPlaceholder');
        } else {
          return this.filterPlaceholder;
        }
      },
      LocalnotDataText(){
        if (this.notDataText == undefined) {
          return this.t('i.transferTable.notFoundData');
        }else{
          return this.notDataText;
        }
      },
      leftTitles(){
        if (this.lTitle) {
          return this.lTitle;
        }else{
          return this.t('i.transferTable.lTitle');
        }
      },
      rightTitles(){
        if (this.rTitle) {
          return this.rTitle;
        }else{
          return this.t('i.transferTable.rTitle');
        }
      },
      localeTitles () {
        if (this.titles === undefined) {
          return [this.t('i.transfer.titles.source'), this.t('i.transfer.titles.target')];
        } else {
          return this.titles;
        }
      }
    },
    methods: {
      getAllKeys (direction) {
        return this.getList(direction).filter(data => !data.disabled);
      },
      moveTo (direction) {
        const lData = this.getList('left');
        const rData = this.getList('right');
        const opposite = direction === 'left' ? 'right' : 'left';
        const moveKeys = this.$refs[opposite].$refs.table.getSelection(); 
        const moveIndex = moveKeys.map(m => m._hkey_);
        if(this.beforeMove&&!this.beforeMove(moveKeys,direction,false)) return//提供移动前钩子函数
        if (direction === 'right') {
          this.rightData = moveKeys.concat(rData)
          this.leftData = lData.filter((col,i)=>!moveIndex.some(index => col._hkey_ == index));
        }else{
          this.leftData = moveKeys.concat(lData)
          this.rightData = rData.filter((col,i)=>!moveIndex.some(index => col._hkey_ == index));
        }
        const cleanRData = this.getRidOfInnerKey(this.rightData);
        const cleanMoveKeys = this.getRidOfInnerKey(moveKeys);
        this.$emit('on-change', cleanRData, direction, cleanMoveKeys);
        this.dispatch('FormItem', 'on-form-change', {
          tarketKeys: cleanRData,
          direction: direction,
          moveKeys: cleanMoveKeys
        });
      },
      moveAllTo (direction) {
        const lData = this.getList('left');
        const rData = this.getList('right');
        const opposite = direction === 'left' ? 'right' : 'left';
        const moveKeys = this.getAllKeys(opposite);
        if(this.beforeMove&&!this.beforeMove(moveKeys,direction,true)) return//提供移动前钩子函数
        if (direction === 'right') {
          this.rightData = moveKeys.concat(rData)
          this.leftData = [];
        }else{
          this.leftData = moveKeys.concat(lData)
          this.rightData = [];
        }
        const cleanRData = this.getRidOfInnerKey(this.rightData);
        const cleanMoveKeys = this.getRidOfInnerKey(moveKeys);
        this.$emit('on-change', cleanRData, direction, cleanMoveKeys);
        this.dispatch('FormItem', 'on-form-change', {
            tarketKeys: cleanRData,
            direction: direction,
            moveKeys: cleanMoveKeys 
        });
      },
      getAlldata(){
        let data = {};
        data.leftData= this.getList('left');
        data.rightData= this.getList('right');
        return data;
      },
      getList(direction) {
        const cloneData = this.$refs[direction].$refs.table.cloneData;
        const listData = direction === 'left' ? this.leftData : this.rightData;
        return listData.map((d, index) => {
          for (let i = 0; i < cloneData.length; i++) {
            if (cloneData[i]._hkey_ === index) {
              return cloneData[i];
            }
          }
          return d;
        });
      },
      getRidOfInnerKey(arr) {
        return arr.map(item => {
          let copied = deepCopy(item);
          if (copied.hasOwnProperty('_hkey_')) {
            delete copied._hkey_;
          }
          return copied;
        });
      },
      clearSearch(dir='left'){//清空搜索框
        this.$refs[dir].clearSearch()
      }
    },
    watch: {
      lData (val) {
        this.leftData = val;
      },
      rData (val) {
        this.rightData = val;
      },
    },
    mounted () {
      this.leftData = this.lData;
      this.rightData = this.rData;
    }
  };
</script>
