<template>
  <div class="h-select-dropdown" :style="styles" @click="handleClick" @mousedown.stop="handleMouseDown" ref="selectdrop"><slot></slot></div>
</template>
<script>
import Vue from 'vue';
const isServer = Vue.prototype.$isServer;
import { getStyle, getScrollBarSize } from '../../util/tools';
const Popper = isServer ? function() {} : require('../../util/popper.js');
export default {
	name: 'Drop',
	props: {
		widthAdaption: {
			type: Boolean,
			default: false,
		},
		adaptParentWidth: Boolean,
		maxDropWidth: {
			type:[String,Number],
		},
		placement: {
			type: String,
			default: 'bottom-start'
		},
		className: {
			type: String
		},
		dropWidth:{
			type:[String,Number]
		}
	},
	data () {
		return {
			popper: null,
			width: '',
			parentWidth: null, 	// 保存当前父节点的宽度，当进行下拉内容自适应时需要与最大宽度进行对比,取较大者设为最大宽度
			scrollBarWidth: getScrollBarSize()
		};
	},
	computed: {
		styles () {
			let style = {};
			if (this.widthAdaption) {
				if (this.dropWidth || this.maxDropWidth) {
					if (this.dropWidth) style.minWidth = `${this.dropWidth}px`
					if (this.maxDropWidth) {
						let maxWidth = Math.max(parseInt(this.maxDropWidth),parseInt(this.parentWidth))
						style.maxWidth = `${maxWidth}px`
					}
					if (this.width) style.width = `${this.width}px`;
				}
			} else {
				if (this.width) style.width = `${this.width}px`;
			}
			return style;
		}
	},
	methods: {
		handleClick(event){
			this.$emit('click', event);
		},
		setWidthAdaption(){
			let content = this.$refs.selectdrop
			if(this.$parent.$options.name ==='SimpleSelect'){
				content = content.querySelectorAll('.h-selectTable-dropdown-list')[0].children[0]
				// if(this.$parent.showBottom || this.$parent.hideMult){
				// 	content = content.children[1].children[0]
				// }else{
				// 	content=content.children[0].children[0]
				// }
			}else{
				content = content.children[0]
			}
			// 横向或者纵向滚动条导致的像素偏移的问题
			// 是否有纵向滚动条
			let isScrollY = parseInt(this.$refs.selectdrop.clientWidth) > parseInt(content.clientWidth) ? true : false
			// 是否有横向滚动条
			let isScrollX = parseInt(this.$refs.selectdrop.clientHeight) > parseInt(content.clientHeight) ? true : false
			if (isScrollX) {
                this.width = isScrollY ? parseInt(content.scrollWidth) + this.scrollBarWidth : content.scrollWidth
			}
		},
		update () {
            if (isServer) return;
			if (this.popper) {
				this.$nextTick(() => {
                // select 组件 placement 改变后同步改变 popper 实例
                this.popper._options.placement = this.widthAdaption ? this.placement.indexOf('top') >= 0 ? 'top-start' : 'bottom-start' : this.placement
					this.popper.update();
					// 有滚动条时，下拉宽度为内容宽度
					if (this.widthAdaption) {
						this.setWidthAdaption()
					}
				});
			} else {
				this.$nextTick(() => {
					let curPlacement = this.widthAdaption ? this.placement.indexOf('top') >= 0 ? 'top-start' : 'bottom-start' : this.placement
					// let curPlacement = this.placement.indexOf('top') >= 0 ? 'top-start' : this.placement
					this.popper = new Popper(this.$parent.$refs.reference, this.$el, {
						gpuAcceleration: false,
						placement: curPlacement,
						boundariesPadding: 0,
						forceAbsolute: true,
						boundariesElement: 'body'
					});
					this.popper.onCreate(popper => {
						this.resetTransformOrigin(popper);
					});
					// 有滚动条时，下拉宽度为内容宽度
					if (this.widthAdaption) {
						this.setWidthAdaption()
					}
				});
			}
			if (this.$parent.$options.name === 'Select'|| this.$parent.$options.name === 'SelectTree' || this.$parent.$options.name === 'SelectTable'|| this.$parent.$options.name ==='SimpleSelect'|| this.$parent.$options.name ==='SingleSelect'|| this.$parent.$options.name ==='SimpleMultiSelect') {
				if (!this.dropWidth) {
					let width = parseInt(getStyle(this.$parent.$el, 'width'));
					this.width = width
					this.parentWidth = width
				}else{
					this.width = this.dropWidth;
					this.parentWidth = this.dropWidth;
				}
			}
			if(this.$parent.$options.name === 'Dropdown' && this.adaptParentWidth){
				let width = parseInt(getStyle(this.$parent.$el, 'width'));
				this.width = width
				this.parentWidth = width
			}
        },
		destroy () {
			if (this.popper) {
				this.resetTransformOrigin(this.popper);
				setTimeout(() => {
						this.popper.destroy();
						this.popper = null;
				}, 300);
			}
		},
		resetTransformOrigin(popper) {
			let placementMap = {top: 'bottom', bottom: 'top'};
			let placement = popper._popper.getAttribute('x-placement').split('-')[0];
			let origin = placementMap[placement];
			popper._popper.style.transformOrigin = `center ${ origin }`;
		},
		handleMouseDown() {
		// TS201903110540
		// prevent mousedown event from bubbling up and being caught by handlers on document
		// which were added in directive v-clickoutside
		}
	},
	created () {
		this.$on('on-update-popper', this.update);
		this.$on('on-destroy-popper', this.destroy);
	},
	beforeDestroy () {
		if (this.popper) {
			this.popper.destroy();
		}
	}
};
</script>
