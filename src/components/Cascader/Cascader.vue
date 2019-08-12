<template>
  <div :class="classes" v-clickoutside="clickOutside">
    <div :class="[prefixCls + '-rel']" @click="toggleOpen" ref="reference">
      <slot>
        <div :class="[prefixCls + '-tag-wrapper']" v-if="multiple" ref="tagWrapper">
          <div class="h-tag" v-for="(item, index) in multipleValue" :key="index" :title="item.label">
            <span class="h-tag-text">{{ item.label }}</span>
            <Icon name="close" @click.native.stop="removeTag(item.selected[item.selected.length - 1].__value)"></Icon>
          </div>
        </div>
        <h-input
          v-else
          ref="input"
          :readonly="readonly && !filterable"
          :disabled="disabled"
          :value="displayInputRender"
          @on-change="handleInput"
          :size="size"
          :placeholder="inputPlaceholder"></h-input>
        <div
          :class="[prefixCls + '-label']"
          v-show="filterable && query === ''"
          @click="handleFocus">{{ displayRender }}</div>
        <Icon :class="iconCls" name="close" v-show="showCloseIcon" @click.native.stop="clearSelect"></Icon>
        <Icon :class="iconCls" name="unfold"></Icon>
      </slot>
    </div>
    <transition name="slide-up">
      <Drop
        v-show="visible"
        :class="{ [prefixCls + '-transfer']: transfer }"
        ref="drop"
        :data-transfer="transfer"
        v-transfer-dom
        :placement="fPlacement"
        :style="tipStyle">
        <div :class="dorpClass">
          <Caspanel
            v-show="!filterable || (filterable && query === '')"
            ref="caspanel"
            :prefix-cls="prefixCls"
            :data="data"
            :disabled="disabled"
            :change-on-select="changeOnSelect"
            :trigger="trigger"
            :multiple="multiple"></Caspanel>
          <div :class="[prefixCls + '-dropdown']" v-show="filterable && query !== '' && querySelections.length">
            <ul :class="[selectPrefixCls + '-dropdown-list']">
              <li
                :class="[selectPrefixCls + '-item', {
                  [selectPrefixCls + '-item-disabled']: item.disabled
                }]"
                v-for="(item, index) in querySelections"
                :key="index"
                @click.stop="handleSelectItem(index)" v-html="item.display"></li>
            </ul>
          </div>
          <ul v-show="filterable && query !== '' && !querySelections.length" :class="[prefixCls + '-not-found-tip']"
          ><li>{{ localeNotFoundText }}</li></ul>
        </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
  import hInput from '../Input/Input.vue';
  import Drop from '../Select/Dropdown.vue';
  import Icon from '../Icon/Icon.vue';
  import Caspanel from './Caspanel.vue';
  import clickoutside from '../../directives/clickoutside';
  import TransferDom from '../../directives/transfer-dom';
  import { oneOf, findInx } from '../../util/tools';
  import { on, off } from '../../util/dom';
  import Emitter from '../../mixins/emitter';
  import Locale from '../../mixins/locale';

  const prefixCls = 'h-cascader';
  const selectPrefixCls = 'h-select';

  export default {
    name: 'Cascader',
    mixins: [ Emitter, Locale ],
    components: { hInput, Drop, Icon, Caspanel },
    directives: { clickoutside, TransferDom },
    props: {
      data: {
        type: Array,
        default () {
            return [];
        }
      },
      value: {
        type: Array,
        default () {
            return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String
      },
      size: {
        validator (value) {
          return oneOf(value, ['small', 'large']);
        }
      },
      trigger: {
        validator (value) {
          return oneOf(value, ['click', 'hover']);
        },
        default: 'click'
      },
      changeOnSelect: {
        type: Boolean,
        default: false
      },
      renderFormat: {
        type: Function,
        default (label) {
            return label.join(' / ');
        }
      },
      loadData: {
        type: Function
      },
      filterable: {
        type: Boolean,
        default: false
      },
      notFoundText: {
        type: String
      },
      transfer: {
        type: Boolean,
        default: false
      },
      setProviceCity:{
        type:Boolean,
        default:false,
      },
      placement: {
        validator (value) {
            return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
        },
        default: 'bottom'
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        prefixCls: prefixCls,
        selectPrefixCls: selectPrefixCls,
        visible: false,
        selected: [],
        tmpSelected: [],
        updatingValue: false,    // to fix set value in changeOnSelect type
        currentValue: this.value,
        query: '',
        validDataStr: '',
        isLoadedChildren: false,    // #950
        fPlacement:this.placement,
        isFocus:false,
        viewValue:'',
        iconCls: [prefixCls + '-arrow']
      };
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-show-clear`]: this.showCloseIcon,
            [`${prefixCls}-size-${this.size}`]: !!this.size,
            [`${prefixCls}-multiple`]: this.multiple,
            [`${prefixCls}-visible`]: this.visible,
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-not-found`]: this.filterable && this.query !== '' && !this.querySelections.length
          }
        ];
      },
      tipStyle (){
        if (this.filterable && this.query !== '' && !this.querySelections.length) {
          let width = parseInt(this.$refs.reference.getBoundingClientRect().width);
          return {
            width:width+'px'
          }
        }
      },
      showCloseIcon () {
        return this.currentValue && this.currentValue.length && this.clearable && !this.disabled;
      },
      displayRender () {
        let label = [];
        for (let i = 0; i < this.selected.length; i++) {
          label.push(this.selected[i].label);
        }
        return this.renderFormat(label, this.selected);
      },
      displayInputRender () {
        this.viewValue = this.filterable ? '' : this.displayRender
        return this.filterable ? '' : this.displayRender;
      },
      localePlaceholder () {
        if (this.placeholder === undefined) {
          return this.t('i.select.placeholder');
        } else {
          return this.placeholder;
        }
      },
      inputPlaceholder () {
        return this.filterable && this.currentValue.length ? null : this.localePlaceholder;
      },
      localeNotFoundText () {
        if (this.notFoundText === undefined) {
          return this.t('i.select.noMatch');
        } else {
          return this.notFoundText;
        }
      },
      querySelections () {
        let selections = [];
        function getSelections (arr, label, value) {
          for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            item.__label = label ? label + ' / ' + item.label : item.label;
            item.__value = value ? value + ',' + item.value : item.value;

            if (item.children && item.children.length) {
              getSelections(item.children, item.__label, item.__value);
              delete item.__label;
              delete item.__value;
            } else {
              selections.push({
                label: item.__label,
                value: item.__value,
                display: item.__label,
                item: item,
                disabled: !!item.disabled
              });
            }
          }
        }
        getSelections(this.data);
        selections = selections.filter(item => item.label.indexOf(this.query) > -1).map(item => {
            item.display = item.display.replace(new RegExp(this.query, 'g'), `<span>${this.query}</span>`);
            return item;
        });
        return selections;
      },
      dorpClass(){
        return[
          // `${prefixCls}-dropdown`,
          {
            [`provice-city`]:this.setProviceCity
          }
        ]
      },
      multipleValue() {
        const data = this.data;
        const value = [];
        const travel = (items, arr) => {
          if (Array.isArray(items)) {
            items.forEach(item => {
              if (!item._checked && !item._indeterminate) return;
              if (Array.isArray(item.children)) {
                travel(item.children, arr.concat([item]));
              } else {
                let selected = arr.concat([item]);
                let label = [];
                for (let i = 0; i < selected.length; i++) {
                  label.push(selected[i].label);
                }
                value.push({
                  label: this.renderFormat(label, selected),
                  selected: selected
                });
              }
            })
          }
        }
        travel(data, []);
        return value;
      }
    },
    methods: {
      clearSelect () {
        if (this.disabled) return false;
        const oldVal = JSON.stringify(this.currentValue);
        this.currentValue = this.selected = this.tmpSelected = [];
        this.handleClose();
        this.emitValue(this.currentValue, oldVal);
        //this.$broadcast('on-clear');
        this.broadcast('Caspanel', 'on-clear');
        this.isFocus = true;
      },
      clickOutside(){
        this.handleClose(true);
      },
      handleClose (status) {
        this.visible = false;
        if(this.isFocus&&status){
          this.dispatch('FormItem', 'on-form-blur',{
            value: this.currentValue,
            selected: JSON.parse(JSON.stringify(this.selected))
          });
          this.isFocus=false;
        }
      },
      toggleOpen () {
        if (this.disabled) return false;
        if (this.visible) {
            if (!this.filterable) this.handleClose();
        } else {
            this.onFocus();
        }
        this.isFocus = true;
      },
      onFocus () {
        this.visible = true;
        if (!this.currentValue.length) {
          this.broadcast('Caspanel', 'on-clear');
        }
      },
      updateResult (result) {
        this.tmpSelected = result;
      },
      updateSelected (init = false) {
        if ((!this.changeOnSelect || init) && !this.multiple) {
          this.broadcast('Caspanel', 'on-find-selected', {
            value: this.currentValue
          });
        }
      },
      emitValue (val, oldVal) {
        if (JSON.stringify(val) !== oldVal) {
          this.$emit('on-change', this.currentValue, JSON.parse(JSON.stringify(this.selected)));
          this.$nextTick(() => {
            this.dispatch('FormItem', 'on-form-change', {
              value: this.currentValue,
              selected: JSON.parse(JSON.stringify(this.selected))
            });
          });
        }
      },
      handleInput (event) {
        this.query = event.target.value;
      },
      handleSelectItem (index) {
        const item = this.querySelections[index];

        if (item.item.disabled) return false;
        this.query = '';
        this.$refs.input.currentValue = '';
        const oldVal = JSON.stringify(this.currentValue);
        this.currentValue = item.value.split(',');
        this.emitValue(this.currentValue, oldVal);
        this.handleClose();
      },
      handleFocus () {
        this.$refs.input.focus();
      },
      // 排除 loading 后的 data，避免重复触发 updateSelect
      getValidData (data) {
        function deleteData (item) {
          const new_item = Object.assign({}, item);
          if ('loading' in new_item) {
              delete new_item.loading;
          }
          if ('__value' in new_item) {
              delete new_item.__value;
          }
          if ('__label' in new_item) {
              delete new_item.__label;
          }
          if ('children' in new_item && new_item.children.length) {
              new_item.children = new_item.children.map(i => deleteData(i));
          }
          return new_item;
        }
        return data.map(item => deleteData(item));
      },
      focus(){
        setTimeout(() => {
          this.isFocus = true;
          this.visible=true;
          this.$refs.input.focus();
        }, 0);
      },
      blur(){
        this.isFocus = false;
        this.visible=false;
        this.$refs.input.blur();
      },
      select() {
        this.$refs.input.select()
      },
      handleKeydown(e){
        const keyCode = e.keyCode;
        // Esc slide-up
        if (keyCode === 27) {
          e.preventDefault();
          this.visible=false;
        }
      },
      getMultipleValue() {
        const data = this.data;
        const travel = node => {
          if (!node._checked && !node._indeterminate) return [];
          let children = node.children;
          if (children) {
            let arr = children.map(child => {
              let valArr = travel(child);
              valArr.forEach(v => {
                v.unshift(node.value);
              });
              return valArr;
            }).reduce((arr, v) => arr.concat(v), []);
            return arr;
          } else {
            return [[node.value]];
          }
        }
        return data.map(d => travel(d)).reduce((arr, v) => arr.concat(v), []);
      },
      getRawData() {
        const data = this.data;
        const cloneData = JSON.parse(JSON.stringify(data));
        const travel = function (arr) {
          if (Array.isArray(arr)) {
            arr.forEach(d => {
              delete d._checked;
              delete d._indeterminate;
              travel(d.children);
            })
          }
        }
        travel(cloneData);
        return cloneData;
      },
      updateCheck() {
        if (!this.multiple) return;
        const value = this.currentValue;
        const data = this.data;
        const layeredData = [];
        const getLayeredData = (arr, level) => {
          let lData = layeredData[level] || [];
          arr.forEach(item => {
            lData.push(item);
            if (Array.isArray(item.children)) {
              getLayeredData(item.children, level + 1);
            } else {
              // 先把叶子节点置为unchecked
              this.$set(item, '_checked', false);
            }
          });
          layeredData[level] = lData;
        }
        getLayeredData(data, 0);

        // 勾选子节点
        value.forEach(val => {
          let i = val.length - 1;
          if (i >= 0) {
            let lData = layeredData[i];
            if (Array.isArray(lData)) {
              let idx = findInx(lData, item => item.value === val[i]);
              if (idx > -1) {
                lData[idx]._checked = true;
              }
            }
          }
        })
        const setCheck = (arr) => {
          return arr.map(d => {
            // -1: unchecked, 0: indeterminate, 1: checked
            let checkState;
            const children = d.children;
            if (Array.isArray(children)) {
              if (children.length > 0) {
                const checkStates = setCheck(children);
                if (
                  checkStates.findIndex(s => s == 0) > -1 ||
                  (checkStates.findIndex(s => s == 1) > -1 &&
                    checkStates.findIndex(s => s == -1) > -1)
                ) {
                  checkState = 0;
                  this.$set(d, '_checked', false);
                  this.$set(d, '_indeterminate', true);
                } else if (checkStates.findIndex(s => s == 1) > -1) {
                  checkState = 1;
                  this.$set(d, '_checked', true);
                  this.$set(d, '_indeterminate', false);
                } else {
                  checkState = -1;
                  this.$set(d, '_checked', false);
                  this.$set(d, '_indeterminate', false);
                }
              }
            } else {
              if (!d.hasOwnProperty('_checked')) {
                this.$set(d, '_checked', false);
              }
              checkState = d._checked ? 1 : -1;
            }
            return checkState;
          })
        }
        setCheck(data);
      },
      removeTag(value) {
        if (this.disabled) return;
        let idx = findInx(this.currentValue, cv => cv.join(",") === value);
        if (idx > -1) {
          this.$emit("on-remove-tag", this.currentValue[idx]);
          this.currentValue.splice(idx, 1);
        }
      },
      async updateIconCls() {
        if (this.currentValue.length > 0 && this.multiple) {
          let cls = await new Promise(resolve => {
            this.$nextTick(() => {
              const el =  this.$refs.tagWrapper;
              resolve(el.scrollHeight > el.clientHeight ? ['offset-left', prefixCls + '-arrow'] : [])
            })
          })
          if (cls.length > 0) {
            this.iconCls = cls;
            return;
          }
        }
        this.iconCls = [prefixCls + '-arrow'];
      }
    },
    created () {
      this.validDataStr = JSON.stringify(this.getValidData(this.data));
      this.updateCheck();
      this.$on('on-result-change', (params) => {
        // lastValue: is click the final val
        // fromInit: is this emit from update value
        const lastValue = params.lastValue;
        const changeOnSelect = params.changeOnSelect;
        const fromInit = params.fromInit;

        if (lastValue || changeOnSelect) {
          const oldVal = JSON.stringify(this.currentValue);
          this.selected = this.tmpSelected;

          let newVal = [];
          if (this.multiple) {
            newVal = this.getMultipleValue();
          } else {
            this.selected.forEach((item) => {
              newVal.push(item.value);
            });
          }

          if (!fromInit) {
            this.updatingValue = true;
            this.currentValue = newVal;
            this.emitValue(this.currentValue, oldVal);
          }
        }
        if (lastValue && !fromInit && !this.multiple) {
          this.handleClose();
        }
      });
    },
    mounted () {
      this.updateSelected(true);
      on(document,'keydown',this.handleKeydown)
    },
    beforeDestroy () {
      off(document,'keydown', this.handleKeydown);
    },
    watch: {
      visible (val) {
        if (val) {
          if (this.currentValue.length) {
              this.updateSelected();
          }
          if (this.transfer) {
              this.$refs.drop.update();
          }
          setTimeout(() => {
            this.dispatch('Msgbox', 'on-esc-real-close', false);
          }, 0);
        } else {
          if (this.filterable) {
              this.query = '';
              this.$refs.input.currentValue = '';
          }
          if (this.transfer) {
              this.$refs.drop.destroy();
          }
          setTimeout(() => {
            this.dispatch('Msgbox', 'on-esc-real-close', true);
          }, 0);
        }
        this.$emit('on-visible-change', val);
      },
      value (val) {
        this.currentValue = val;
        if (!val.length) this.selected = [];
      },
      currentValue () {
        this.$emit('input', this.currentValue);
        this.updateIconCls();
        if (this.updatingValue) {
            this.updatingValue = false;
            return;
        }
        this.updateCheck();
        this.updateSelected(true);
      },
      data: {
        deep: true,
        handler () {
          const validDataStr = JSON.stringify(this.getValidData(this.getRawData()));
          if (validDataStr !== this.validDataStr) {
            this.validDataStr = validDataStr;
            this.updateCheck();
            if (!this.isLoadedChildren) {
              this.$nextTick(() => this.updateSelected());
            }
            this.isLoadedChildren = false;
          }
        }
      },
      placement(val){
        this.fPlacement = val;
      }
    }
  };
</script>
