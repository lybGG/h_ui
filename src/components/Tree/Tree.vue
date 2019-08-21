<template>
  <ul :class="wrapper">
    <Tree-node
      v-for="(item,i) in stateTree"
      :key="i"
      :data="item"
      visible
      :multiple="multiple"
      :show-checkbox="showCheckbox"
      :showIndeterminate="showIndeterminate"
      :checkStrictly="checkStrictly"
      :disableHover = "disableHover"
      :selectToCheck="selectToCheck"
    >
    </Tree-node>
    <div :class="[prefixCls + '-empty']" v-if="!data || !data.length">{{ localeEmptyText }}</div>
  </ul>
</template>
<script>
import TreeNode from './Node.vue';
import { findComponentsDownward,deepCopy } from '../../util/tools';
import Emitter from '../../mixins/emitter';
import Locale from '../../mixins/locale';

const prefixCls = 'h-tree';

export default {
  name: 'Tree',
  mixins: [ Emitter, Locale ],
  components: { TreeNode },
  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String
    },
    loadData: {
      type: Function
    },
    render: {
      type: Function
    },
    checkStrictly:{
      //父子节点联动
      type:Boolean,
      default:false
    },
    showIndeterminate:{
      type:Boolean,
      default:false
    },
    disableHover:{
      type:Boolean,
      default:false
    },
    currentPageInfo: { //保存当前子节点分页第几页及当前节点信息
      // {
      //   page: 1,
      //   nodeKey: ''
      // }
      type: Object,
    },
    isAlwaysSelect: {
      type:Boolean,
      default:false
    },
    isFormSelect: {
      type:Boolean,
      default:false
    },
    isBoxRight:{
      type:Boolean,
      default:false
    },
    selectToCheck:{
      type:Boolean,
      default:false
    },
    notDeepCopy:{
      type:Boolean,
      default:false
    },
    onlyUpdateDown:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      isDeepcopy:false,
      flatState: [],
      stateTree: this.isDeepcopy?this.data:deepCopy(this.data),
    };
  },
  computed: {
    wrapper(){
      return[
        `${prefixCls}`,{
          [`${prefixCls}-isBoxRight`]: this.isBoxRight,
        }
      ]
    },
    localeEmptyText() {
      if (this.emptyText === undefined) {
        return this.t('i.tree.emptyText');
      } else {
        return this.emptyText;
      }
    }
  },
  methods: {
    compileFlatState () { // so we have always a relation parent/children of each node
      let keyCounter = 0;
      const flatTree = [];
      function flattenChildren(node, parent) {
        node.nodeKey = keyCounter++;
        ['expand','disabled','disableCheckbox','selected','checked','loading','leaf','autoLoad','hasPage'].forEach(col=>{
          if(node[col]&&node[col]=='false'){
            node[col] =false;
          }
          if(node[col]&&node[col]=='true'){
            node[col] =true;
          }
        })

        flatTree[node.nodeKey] = { node: node, nodeKey: node.nodeKey };
        if (typeof parent != 'undefined') {
          flatTree[node.nodeKey].parent = parent.nodeKey;
          flatTree[parent.nodeKey].children.push(node.nodeKey);
        }
        if (node.children) {
          flatTree[node.nodeKey].children = [];
          node.children.forEach(child => flattenChildren(child, node));
        }
      }
      this.stateTree.forEach(rootNode => {
        flattenChildren(rootNode);
      });
      return flatTree;
    },
    updateTreeUp(nodeKey){
      const parentKey = this.flatState[nodeKey].parent;
      if (typeof parentKey == 'undefined') return;

      const node = this.flatState[nodeKey].node;
      const parent = this.flatState[parentKey].node;
      if (node.checked == parent.checked && node.indeterminate == parent.indeterminate) return; // no need to update upwards

      if (node.checked == true) {
        this.$set(parent, 'checked', parent.children.every(node => node.checked));
        this.$set(parent, 'indeterminate', !parent.checked&&!this.showIndeterminate);
      } else {
        this.$set(parent, 'checked', false);
        this.$set(parent, 'indeterminate', parent.children.some(node => node.checked || node.indeterminate)&&!this.showIndeterminate);
      }
      this.updateTreeUp(parentKey);
    },
    rebuildTree() { // only called when `data` prop changes
      const checkedNodes = this.getCheckedNodes();
      const autoLoadNodes = this.getAutoLoadNodes()
      checkedNodes.forEach(node => {
        this.updateTreeDown(node, {checked: true});
        // propagate upwards
        const parentKey = this.flatState[node.nodeKey].parent;
        if (!parentKey && parentKey !== 0) return;//如过存在父节点
        const parent = this.flatState[parentKey].node;
        const childHasCheckSetter = typeof node.checked != 'undefined' && node.checked;//选中为true
        if (childHasCheckSetter && parent.checked != node.checked && !this.checkStrictly) {//当前子节点选中且父组件为选中
          if(!this.onlyUpdateDown){
            this.updateTreeUp(node.nodeKey); // update tree upwards
          }
        }
      });
      autoLoadNodes.forEach(node =>  {
        // this.updateTreeDown(node, {autoLoad: true})
        this.$set(node, 'autoLoad', true)
      })
    },
    getSelectedNodes() {
      return this.flatState.filter(obj => obj.node.selected).map(obj => obj.node);
    },
    getCheckedNodes(indeterminate = false) {
      // FOF需求：调用getCheckedNodes方法，indeterminate为true时返回全部选中节点(checked)[包括checked为true及indeterminate为true的节点]，indeterminate为false时仅返回选中节点[checked为true];indeterminate默认为false
      return this.flatState.filter(obj => {
        return obj.node.checked || (indeterminate ? obj.node.indeterminate : false)
      }).map(obj => obj.node)
      // return this.flatState.filter(obj => obj.node.checked).map(obj => obj.node);
    },
    getAutoLoadNodes() {
      return this.flatState.filter(obj => obj.node.autoLoad&&obj.node.autoLoad!='false').map(obj => obj.node);
    },
    getIndeterminateNodes(){
      return this.flatState.filter(obj => obj.node.indeterminate).map(obj => obj.node);
    },
    updateTreeDown(node, changes = {}) {
      for (let key in changes) {
        this.$set(node, key, changes[key]);
      }
      // 如果当前节点leaf属性为true，则返回当前节点
      if (node.children && !this.checkStrictly && !node.leaf) {
        node.children.forEach(child => {
          this.updateTreeDown(child, changes);
        });
      }
    },
    handleSelect(nodeKey) {
      const node = this.flatState[nodeKey].node;
      if (!this.multiple){ // reset previously selected node
        const currentSelectedKey = this.flatState.findIndex(obj => obj.node.selected);
        if (currentSelectedKey >= 0 && currentSelectedKey !== nodeKey) this.$set(this.flatState[currentSelectedKey].node, 'selected', false);
      }
      if(!(this.isAlwaysSelect && node.selected)) {
        this.$set(node, 'selected', !node.selected);
      }
      this.$emit('on-select-change', this.getSelectedNodes(),node);
    },
    handleCheck({ checked, nodeKey }) {
      const node = this.flatState[nodeKey].node;
      this.$set(node, 'checked', checked);
      this.$set(node, 'indeterminate', false);
      if (!this.checkStrictly) {
        if(!this.onlyUpdateDown){
          this.updateTreeUp(nodeKey); // propagate up
        }
        this.updateTreeDown(node, {checked, indeterminate: false}); // reset `indeterminate` when going down
      }
      this.$emit('on-check-change', this.getCheckedNodes(),node);
    },
    nodeSelect(key,value,status=true){
      let nodeIndex;
      function findNode(node) {
        if(node[key]&&node[key]==value){
          nodeIndex = node.nodeKey;
          return false;
        }
        if (node.children) {
          node.children.forEach(child => {
            if(!nodeIndex&&nodeIndex!=0){
              findNode(child);
            }
          });
        }
      }
      this.stateTree.forEach(rootNode => {
        findNode(rootNode);
      });
      const node = this.flatState[nodeIndex].node;
      this.$set(node, 'selected', status);
    },
    nodeCheck(key,value,status=true){
      let nodeIndex;
      function findNode(node) {
        if(node[key]&&node[key]==value){
          nodeIndex = node.nodeKey;
          return false;
        }
        if (node.children) {
          node.children.forEach(child => {
            if(!nodeIndex&&nodeIndex!=0){
              findNode(child);
            }
          });
        }
      }
      this.stateTree.forEach(rootNode => {
        findNode(rootNode);
      });
      const node = this.flatState[nodeIndex].node;
      this.$set(node, 'checked', status);
      if (!this.checkStrictly) {
        if(!this.onlyUpdateDown){
          this.updateTreeUp(node.nodeKey); // propagate up
        }
        this.updateTreeDown(node, {status, indeterminate: false}); // reset `indeterminate` when going down
      }
    },
    filterHighlight(val,key='title'){
      this.flatState.forEach(item=>{
        this.$set(item.node, 'filterable', false);
        if (val!=''&&!!item.node[key]&& item.node[key].indexOf(val)!=-1) {
          this.$set(item.node, 'filterable', true);
          if(item.parent!=undefined && !this.flatState[item.parent].node.expand){
            this.$set(this.flatState[item.parent].node, 'expand', true);
          }
        }
      })
    },
    handleRightClick() {
    }
  },
  created(){
    this.flatState = this.compileFlatState();
    this.rebuildTree();
  },
  mounted() {
    this.$on('on-check', this.handleCheck);
    this.$on('on-selected', this.handleSelect);
    this.$on('toggle-expand', (node,status) => this.$emit('on-toggle-expand', node,status));
    this.$on('mouse-over', (node) => this.$emit('on-mouseover', node));
    this.$on('on-right-click', this.handleRightClick)
    if(this.loadData||this.isFormSelect || this.notDeepCopy){
      this.isDeepcopy = true;
      this.stateTree = this.isDeepcopy?this.data:deepCopy(this.data);
    }
    this.flatState = this.compileFlatState();
    this.rebuildTree();
  },
  watch:{
    data: {
      deep: true,
      handler () {
        this.stateTree = this.isDeepcopy?this.data:deepCopy(this.data);
        this.flatState = this.compileFlatState();
        this.rebuildTree();
      }
    },
    currentPageInfo: {
      handler: function (val) {
        if (val && val.nodeKey >= 0 && val.page) {
          let node = this.flatState[val.nodeKey].node;
          if (node.hasPage&&node.hasPage!="false") {
            this.$set(node, 'currentPage', val.page);
            if(!node.expand || node.expand=='false') this.$set(node, 'expand', true);
          }
        }
      },
      deep: true
    }
  }
}
</script>
