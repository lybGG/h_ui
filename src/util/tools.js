import Vue from 'vue'
const isServer = Vue.prototype.$isServer
//判断变量类型
// 注：typeof及instanceof仅针对简单变量
function is(type, val) {
  if (val && val != '') {
    return Object.prototype.toString.call(val) === '[object ' + type + ']'
  }
}
export { is }
// 查找组件的父组件
function findComponentParent(content, componentName, componentNames) {
  if (is('String', componentName)) {
    componentNames = [componentName]
  } else {
    componentNames = componentName
  }
  let parent = content.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) {
      name = parent.$options.name
    }
  }
  return parent
}
export { findComponentParent }
// 查找子组件
function findComponentChildren(content, componentName) {
  let childrens = content.$children
  let children = null
  if (childrens.length) {
    for (let i = 0; i < childrens.length; i++) {
      const child = childrens[i]
      const name = child.$options.name
      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentChildren(child, componentName)
        if (children) break
      }
    }
  }
  return children
}
export { findComponentChildren }
// 查找所有子组件
function findComponentsChildren(content, componentName) {
  let childrens = content.$children
  let childrenComponents = []
  if (childrens.length) {
    childrens.forEach(child => {
      let name = child.$options.name
      if (name === componentName) {
        childrenComponents.push(child)
      }
      let childCh = child.$children
      if (childCh.length) {
        let findChildCh = findComponentsChildren(child, componentName)
        if (findChildCh) {
          childrenComponents.concat(findChildCh)
        }
      }
    })
  }
  return childrenComponents
}
export { findComponentsChildren }

export function createSimpleFunctional(c, el = 'div') {
  return {
    functional: true,

    render: (h, { data, children }) => {
      data.staticClass = data.staticClass ? `${c} ${data.staticClass}` : c
      return h(el, data, children)
    }
  }
}

export function directiveConfig(binding, defaults = {}) {
  return Object.assign(
    defaults,
    binding.modifiers,
    { value: binding.arg },
    binding.value || {}
  )
}

export function closest(className) {
  let parent = this.$parent

  while (parent) {
    if (!parent.$el) {
      return null
    }

    if (parent.$el.classList.contains(className)) {
      return parent
    }

    parent = parent.$parent
  }

  return null
}

export function addOnceEventListener(el, event, cb) {
  var once = () => {
    cb()
    el.removeEventListener(event, once, false)
  }

  el.addEventListener(event, once, false)
}

//浏览器兼容
export function addHandler(ele, eType, handler) {
  if (ele.addEventListener) {
    ele.addEventListener(eType, handler, false)
  } else {
    ele.attachEvent('on' + eType, handler)
  }
}
export function removeHandler(ele, eType, handler) {
  if (ele.removeEventListener) {
    ele.removeEventListener(eType, handler, false)
  } else {
    ele.detachEvent('on' + eType, handler)
  }
}
export function removeDom(obj) {
  try {
    obj.remove()
  } catch (e) {
    obj.removeNode(true)
  }
}
// 判断参数是否是其中之一
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}
//判断是否是数字
export function isValueNumber(value) {
  return /(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/.test(value + '')
}
export function arrContains(arr, obj) {
  var i = arr.length
  while (i--) {
    if (arr[i] === obj) {
      return true
    }
  }
  return false
}

// firstUpperCase
function firstUpperCase(str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1)
}
// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  function scroll(start, end, step) {
    if (start === end) return

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}
export { firstUpperCase }

// watch DOM change
export const MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver ||
  false

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

function camelCase(name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}
//for slide
// getStyle
let isIEOr = IEVersion() != -1 ? true : false
export function getStyle(element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '')
    if (isIEOr && styleName == 'width') {
      return computed
        ? parseFloat(computed[styleName]) +
        parseInt(computed['padding-left']) +
        parseInt(computed['padding-right']) +
        parseInt(computed['border-left-width']) +
        parseInt(computed['border-right-width'])
        : null
    } else {
      return element.style[styleName] || computed ? computed[styleName] : null
    }
  } catch (e) {
    return element.style[styleName]
  }
}

// For notice
export function camelcaseToHyphen(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
// For MsgBox scrollBar hidden
let cached
export function getScrollBarSize(fresh) {
  if (isServer) return 0
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)
    //clientWidth是对象看到的宽度（不含边线,即border）
    // scrollWidth是对象实际内容的宽度（不含边线和padding）。
    // offsetWidth是指对象自身的宽度，整型，单位像素（含边线，如滚动条等）。
    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthcroll = inner.offsetWidth

    if (widthContained === widthcroll) {
      widthcroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthcroll
  }
  return cached
}
let cachedHeight
export function getScrollBarSizeHeight(fresh) {
  if (isServer) return 0
  if (fresh || cachedHeight === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '100%'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)
    //clientWidth是对象看到的宽度（不含边线,即border）
    // scrollWidth是对象实际内容的宽度（不含边线和padding）。
    // offsetWidth是指对象自身的宽度，整型，单位像素（含边线，如滚动条等）。
    const heightContained = inner.offsetHeight
    outer.style.overflow = 'scroll'
    let heigtcroll = inner.offsetHeight

    if (heightContained === heigtcroll) {
      heigtcroll = outer.clientHeight
    }

    document.body.removeChild(outer)

    cachedHeight = heightContained - heigtcroll
  }
  return cachedHeight
}
function typeOf(obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}
export { typeOf }
// deepCopyEx
function deepCopyEx(data, exAttr) {
  const t = typeOf(data)
  let o
  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      if (exAttr.indexOf(i) < 0) o[i] = deepCopyEx(data[i], exAttr)
    }
  }
  return o
}
export { deepCopyEx }
// deepCopy
function deepCopy(data) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

export { deepCopy }
// Find components upward
function findComponentsUpward(context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [componentName]
  } else {
    componentNames = componentName
  }

  let parent = context.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}
export { findComponentsUpward }
// Find components downward
// Find component downward
export function findComponentDownward(context, componentName) {
  const childrens = context.$children
  let children = null

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name
      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }
  return children
}

// Find components downward
export function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child)
    const foundChilds = findComponentsDownward(child, componentName)
    return components.concat(foundChilds)
  }, [])
}

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1)
    throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}
/* istanbul ignore next */
export function addClass(el, cls) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}
export function findInx(arr, fun) {
  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined')
        }

        var o = Object(this)

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function')
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1]

        // 5. Let k be 0.
        var k = 0

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return k.
          var kValue = o[k]
          if (predicate.call(thisArg, kValue, k, o)) {
            return k
          }
          // e. Increase k by 1.
          k++
        }

        // 7. Return -1.
        return -1
      }
    })
  }
  return arr.findIndex(fun)
}
export function fill(arr, value, start, end) {
  if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
      value: function(value) {

        // Steps 1-2.
        if (this == null) {
          throw new TypeError('this is null or not defined')
        }

        var O = Object(this)

        // Steps 3-5.
        var len = O.length >>> 0

        // Steps 6-7.
        var start = arguments[1]
        var relativeStart = start >> 0

        // Step 8.
        var k = relativeStart < 0 ?
          Math.max(len + relativeStart, 0) :
          Math.min(relativeStart, len)

        // Steps 9-10.
        var end = arguments[2]
        var relativeEnd = end === undefined ?
          len : end >> 0

        // Step 11.
        var final = relativeEnd < 0 ?
          Math.max(len + relativeEnd, 0) :
          Math.min(relativeEnd, len)

        // Step 12.
        while (k < final) {
          O[k] = value
          k++
        }

        // Step 13.
        return O
      }
    })
  }
  return arr.fill(value, start, end)
}
export function toFix(d) {
  // number.prototype.toFixed = function(d){
  var s = this + ''
  if (!d) d = 0
  if (s.indexof('.') == -1) s += '.'
  s += new array(d + 1).join('0')
  if (new regexp('^(-|\\+)?(\\d+(\\.\\d{0,' + (d + 1) + '})?)\\d*$').test(s)) {
    var s = '0' + regexp.$2,
      pm = regexp.$1,
      a = regexp.$3.length,
      b = true
    if (a == d + 2) {
      a = s.match(/\d/g)
      if (parseint(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseint(a[i]) + 1
          if (a[i] == 10) {
            a[i] = 0
            b = i != 1
          } else break
        }
      }
      s = a.join('').replace(new regexp('(\\d+)(\\d{' + d + '})\\d$'), '$1.$2')
    }
    if (b) s = s.substr(1)
    return (pm + s).replace(/\.$/, '')
  }
  return this + ''
  // };
}
function vliData(num) {
  return num >= 10 ? num : '0' + num
}
export function getYMD(data, str, num) {
  data.setDate(data.getDate() + num)
  let Y = data.getFullYear()
  let M = vliData(data.getMonth() + 1)
  let D = vliData(data.getDate())
  return Y + str + M + str + D
}
export function getHMS(data) {
  let H = vliData(data.getHours())
  let M = vliData(data.getMinutes())
  let S = vliData(data.getSeconds())
  return H + ':' + M + ':' + S
}
export function getCurrentYear() {
  let date = new Date()
  return date.getFullYear()
}
export function getCurrentMonth() {
  let date = new Date()
  return vliData(date.getMonth() + 1)
}
export function getCurrentDay() {
  let date = new Date()
  return vliData(date.getDate())
}
// barWidth横向高度
// barHeight纵向宽度
export function getBarBottomS(
  obj,
  objBodyHeight,
  objContentHeight,
  barWidth,
  isScrollX
) {
  let top = obj.scrollTop
  let sheight = isScrollX ? objBodyHeight - barWidth : objBodyHeight
  return objContentHeight - top - sheight
}
export function getBarBottom(obj, barWidth) {
  let width = obj.getBoundingClientRect().width
  let conentWidth = obj.scrollWidth
  let height = obj.getBoundingClientRect().height
  let top = obj.scrollTop
  let sheight = conentWidth + barWidth > width ? height - barWidth : height
  let conentHeight = obj.scrollHeight
  return conentHeight - top - sheight
}
export function formatnumber(fnumber, fdivide, fpoint, fround) {
  var fnum = fnumber + ''
  var revalue = ''
  if (fnum == null) {
    for (var i = 0; i < fpoint; i++) revalue += '0'
    return '0.' + revalue
  }
  fnum = fnum.replace(/^sall|sall$/g, '')
  if (fnum == '') {
    for (var i = 0; i < fpoint; i++) revalue += '0'
    return '0.' + revalue
  }
  fnum = fnum.replace(/,/g, '')
  if (fround) {
    var temp = '0.'
    for (var i = 0; i < fpoint; i++) temp += '0'
    temp += '5'
    fnum = Number(fnum) + Number(temp)
    fnum += ''
  }
  var arrayf = fnum.split('.')
  if (fdivide) {
    if (arrayf[0].length > 3) {
      while (arrayf[0].length > 3) {
        revalue =
          ',' +
          arrayf[0].substring(arrayf[0].length - 3, arrayf[0].length) +
          revalue
        arrayf[0] = arrayf[0].substring(0, arrayf[0].length - 3)
      }
    }
  }
  revalue = arrayf[0] + revalue
  if (arrayf.length == 2 && fpoint != 0) {
    arrayf[1] = arrayf[1].substring(
      0,
      arrayf[1].length <= fpoint ? arrayf[1].length : fpoint
    )
    if (arrayf[1].length < fpoint)
      for (var i = 0; i < fpoint - arrayf[1].length; i++) arrayf[1] += '0'
    revalue += '.' + arrayf[1]
  } else if (arrayf.length == 1 && fpoint != 0) {
    revalue += '.'
    for (var i = 0; i < fpoint; i++) revalue += '0'
  }
  return revalue
}

export function isdate(intYear, intMonth, intDay) {
  if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false
  if (intMonth > 12 || intMonth < 1) return false
  if (intDay < 1 || intDay > 31) return false
  if (
    (intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) &&
    intDay > 30
  )
    return false
  if (intMonth == 2) {
    if (intDay > 29) return false
    if (
      ((intYear % 100 == 0 && intYear % 400 != 0) || intYear % 4 != 0) &&
      intDay > 28
    )
      return false
  }
  return true
}
let timer
// 滚动公用方法
export function scrollAnimate(obj, curTop, newTop) {
  let status = curTop < newTop ? true : false
  let offset = Math.abs(Number(curTop - newTop))
  let ins = 500 / offset > 1 ? 1 : 500 / offset
  clearInterval(timer)
  timer = setInterval(() => {
    curTop = status ? curTop + 1 : curTop - 1
    obj.scrollTop = curTop
    if (curTop == newTop) {
      clearInterval(timer)
    }
  }, ins)
}

export function cmp(a, b) {
  var x = deepCopy(a)
  var y = deepCopy(b)
  if (x === y) {
    return true
  }
  // instanceof运算符用于测试构造函数的prototype属性是否出现在对象的原型链中的任何位置
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false
  }
  if (x.constructor !== y.constructor) {
    return false
  }
  if (Array.isArray(x) && Array.isArray(y)) {
    x.sort()
    y.sort()
  }
  for (var p in x) {
    if (x.hasOwnProperty(p)) {
      if (!y.hasOwnProperty(p)) {
        return false
      }
      if (x[p] === y[p]) {
        continue
      }
      if (typeof x[p] !== 'object') {
        return false
      }
      if (!Object.equals(x[p], y[p])) {
        return false
      }
    }
  }
  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false
    }
  }
  return true
}
export function IEVersion() {
  var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
  var isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion == 7) {
      return 7
    } else if (fIEVersion == 8) {
      return 8
    } else if (fIEVersion == 9) {
      return 9
    } else if (fIEVersion == 10) {
      return 10
    } else {
      return 6 //IE版本<=7
    }
  } else if (isEdge) {
    // return 'edge';//edge
    return -1 //edge
  } else if (isIE11) {
    return 11 //IE11
  } else {
    return -1 //不是ie浏览器
  }
}

/**
* @description 科学计数法转为string
* @param {string, number} param
*/
export function scientificNotationToString(param) {
  let strParam = String(param)
  let flag = /e/.test(strParam)
  if (!flag) return String(param)

  // 指数符号 true: 正，false: 负
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }
  // 指数
  let index = Number(strParam.match(/\d+$/)[0])
  // 基数
  let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}

/**
* @decription 字符串的toFixed实现
*/
export function toFixedForString(str, num) {
  if (num < 1) return str
  if (/[^\d\.-]/.test(str)) return str

  let decimal = str.replace(/^[\d-]+\.?/, '')
  decimal = decimal.padEnd(num, 0)

  return str.replace(/(\.\d+)?$/, '.' + decimal)
}

// 获取当前节点
function findCurNode(obj) {
  while (obj.parentElement.parentElement.className.indexOf('h-form-item-content') == -1) {
    obj = obj.parentNode
  }
  if (obj.className.indexOf('h-radio') != -1 || obj.className.indexOf('h-checkbox') != -1) {
    return [obj, true]
  } else {
    return [obj.parentNode, false]
  }
}
function isButtonOr(obj) {
  if (obj.nodeName.toLowerCase() === 'button') {
    return true
  } else {
    return false
  }
}
// 获取下一个对象
function getNextElement(ele, field) {
  var isButton = isButtonOr(field)
  if (isButton) {
    return field.nextElementSibling ? field.nextElementSibling : null
  }
  var curArr = findCurNode(field)
  var curNode = curArr[0]
  var isRadioOrCheck = curArr[1]
  var nextNode = null
  curNode.__vue__.blur()
  var form = ele
  var nodes = form.children
  var index = 0
  if (isRadioOrCheck && curNode.nextElementSibling) {
    nextNode = curNode.nextElementSibling
  } else {
    if (isRadioOrCheck && !curNode.nextElementSibling) {
      curNode = curNode.parentNode
    }
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].children && curNode == nodes[i].children[1].children[0]) {
        index = i + 1
        break;
      }
    }
    isRadioOrCheck = nodes[index].children[1].children[0].className.indexOf('h-radio-group') != -1 || nodes[index].children[1].children[0].className.indexOf('h-checkbox-group') != -1
    if (index == 0) return
    if (isRadioOrCheck) {
      nextNode = nodes[index].children[1].children[0].children[0]
    } else {
      nextNode = nodes[index].children[1].children[0]
    }
  }
  return nextNode
}
//获取上一个对象
function getPrevioueElement(ele, field) {
  var isButton = isButtonOr(field)
  var curNode = null
  var isRadioOrCheck = false
  if (isButton) {
    curNode = field
  } else {
    var curArr = findCurNode(field)
    curNode = curArr[0]
    isRadioOrCheck = curArr[1]
  }
  var form = ele
  var nodes = form.children
  var index = 0
  var previousNode = null
  curNode.__vue__.blur()
  if ((isButton && curNode.previousElementSibling) || isRadioOrCheck && curNode.previousElementSibling) {
    return curNode.previousElementSibling
  } else {
    if (isRadioOrCheck && !curNode.previousElementSibling) {
      curNode = curNode.parentNode
    }
    for (var i = nodes.length - 1; i > -1; i--) {
      if (nodes[i].children && curNode == nodes[i].children[1].children[0]) {
        index = i - 1
        break;
      }
    }
    if (index == -1) index = 0
    isRadioOrCheck = nodes[index].children[1].children[0].className.indexOf('h-radio-group') != -1 || nodes[index].children[1].children[0].className.indexOf('h-checkbox-group') != -1
    if (isRadioOrCheck) {
      let curObj = nodes[index].children[1].children[0]
      previousNode = curObj.children[curObj.children.length - 1]
    } else {
      previousNode = nodes[index].children[1].children[0]
    }
    return previousNode
  }
  var form = ele
  var nodes = form.children
  var index = form.children - 1
}

/* 表单键盘Enter事件
@author: 研发中心-谭露阳提供-未支持浏览器兼容和深层嵌套
@date: 2018-06-22
@params:
ele
evt
*/
export function enterHandler(ele, evt) {
  ele = ele.$el
  var isie = (document.all) ? true : false
  var key
  var srcobj
  if (isie) {
    key = event.keyCode
    srcobj = event.srcElement
  } else {
    key = evt.which
    srcobj = evt.target
  }
  if (srcobj.type == 'submit' || srcobj.type == 'reset' || srcobj.type == 'textarea' || srcobj.type == '') return
  //enter键盘 下键盘
  if (evt.keyCode == 13) {
    if (isie) {
      evt.keyCode = 9
    } else {
      var el = getNextElement(ele, evt.target)
      if (!el) {
        return false
      } else {
        el.__vue__.focus()
      }
    }
  }
}


function getCurNode(obj) {
  while (obj.className.indexOf('curItemClass') == -1) {
    obj = obj.parentNode
  }
  return obj
}
function getElement(ele, field, status) {
  var nodes = ele.querySelectorAll('.curItemClass')
  var index = 0
  var curNode = getCurNode(field)
  if(curNode.querySelector('input')){
    if(curNode.querySelector('input').getAttribute('search')==='multiSelect'){
      let isshow=curNode.__vue__.dropVisible
      let isenter=curNode.__vue__.isEnterhide
      if(isshow||isenter){
        return
      }
    }
  }

  curNode.__vue__.blur()
  // nodes = Array.prototype.slice.call(nodes).sort((a,b)=>{
  //   if(Number(a.dataset.index)>Number(b.dataset.index)){
  //     return 0
  //   }else{
  //     return -1
  //   }
  // })
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && curNode == nodes[i]) {
      index = i
      break;
    }
  }
  if (status) {
    index = index + 1
    index = index >= nodes.length ? nodes.length - 1 : index
  } else {
    index = index - 1
    index = index < 0 ? 0 : index
  }
  return nodes[index]
}
export function enterHandler1(ele, evt) {
  ele = ele.$el
  var isie = (document.all) ? true : false
  var key
  var srcobj
  if (isie) {
    key = event.keyCode
    srcobj = event.srcElement
  } else {
    key = evt.which
    srcobj = evt.target
  }
  //enter键盘 下键盘
  if (evt.keyCode == 13 || evt.keyCode == 40 || evt.keyCode==9) {
    evt.preventDefault()
    if (isie) {
      evt.keyCode = 9
    } else {
      var el = getElement(ele, evt.target, true)
      if (!el) {
        return false
      } else {
        el.__vue__.focus()
      }
    }
  }
  // 上键盘
  if (evt.keyCode == 38) {
    evt.preventDefault()
    var el = getElement(ele, evt.target, false)
    if (!el) {
      return false
    } else {
      el.__vue__.focus()
    }
  }
}

/**
 * @description Date 对象格式化函数
 * @date 2019-06-13
 * @param {Date} date
 * @param {String} fmt
 * @auther 崔杨
 */
export function dateFormat(date, fmt) {
  if (Object.prototype.toString.call(date) !== '[object Date]') return

  let expMap = {
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in expMap) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (expMap[k]) : (('00' + expMap[k]).substr(('' + expMap[k]).length)))
    }
  }

  return fmt
}

/**
 * @description simpletable 防抖函数
 * @date 2019-06-19
 * @param {fun} 方法
 * @param {delay} 延时
 * @auther 谭露阳
 */
export function debounce(fun,delay){
  let timer = null
  return function(){
    timer&&clearTimeout(timer)
    timer = setTimeout(fun,delay)
  }
}

/**
 * @description 带立即执行的防抖函数
 * @date 2019-06-27
 * @param {Function} fun 需要添加防抖的函数
 * @param {Number} delay 延时时间，毫秒
 * @param {Boolean} immediate 是否立即执行
 */
export function debounceWithImmediate(fun, delay = 100, immediate = false) {
  let timer = 0

  return function(...args) {
    // 立即执行
    if (immediate || delay === 0) {
      fun.apply(this, args)
      return
    }

    // 防抖
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}

Number.prototype.toFixedSelf = function(n) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20')
  }
  const number = this
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString()
  }
  if (typeof (n) == 'undefined' || n == 0) {
    return (Math.round(number)).toString()
  }
  let result = number.toString()
  const arr = result.split('.')
  // 整数的情况
  if (arr.length < 2) {
    result += '.'
    for (let i = 0; i < n; i += 1) {
      result += '0'
    }
    return result
  }
  const integer = arr[0]
  const decimal = arr[1]
  if (decimal.length == n) {
    return result
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += '0'
    }
    return result
  }
  result = integer + '.' + decimal.substr(0, n)
  const last = decimal.substr(n, 1)

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n)
    result = (Math.round((parseFloat(result) * x)) + 1) / x
    result = result.toFixedSelf(n)
  }
  return result
}
/**
 * @description 切割整数位
 * @date 2019-07-18
 * @param {String} value 金额数字
 * @param {Number} integerNum 整数位数
 */
export function cutNum(value,integerNum){
  var arrNum=value.split('.')
  if(arrNum.length>0){
    var integerNumber=arrNum[0].substr(0,integerNum)
    if(arrNum.length>1){
      value=integerNumber+'.'+arrNum[1]
    }else{
      value=integerNumber
    }
  }
  return value
}
export function numtochinese(Num,suffixNumber) {
  for (var i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(',', '')// 替换tomoney()中的“,”
    Num = Num.replace(' ', '')// 替换tomoney()中的空格
  }
  Num = Num.replace('￥', '')// 替换掉可能出现的￥字符
  if (isNaN(Num)) {
    // 验证输入的字符是否为数字
    // alert("请检查小写金额是否正确");
    return
  }
  // ---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
  var part = String(Num).split('.')
  var newchar = ''
  // 小数点前进行转化
  for (i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 17) {
    //   alert("");
      return '位数过大，无法计算'
    }// 若数量超过拾亿单位，提示
    var tmpnewchar = ''
    var perchar = part[0].charAt(i)
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar
        break;
      case '1':
        tmpnewchar = '壹' + tmpnewchar
        break;
      case '2':
        tmpnewchar = '贰' + tmpnewchar
        break;
      case '3':
        tmpnewchar = '叁' + tmpnewchar
        break;
      case '4':
        tmpnewchar = '肆' + tmpnewchar
        break;
      case '5':
        tmpnewchar = '伍' + tmpnewchar
        break;
      case '6':
        tmpnewchar = '陆' + tmpnewchar
        break;
      case '7':
        tmpnewchar = '柒' + tmpnewchar
        break;
      case '8':
        tmpnewchar = '捌' + tmpnewchar
        break;
      case '9':
        tmpnewchar = '玖' + tmpnewchar
        break;
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + '元'
        break
      case 1:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '拾'
        break
      case 2:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '佰'
        break
      case 3:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '仟'
        break
      case 4:
        tmpnewchar = tmpnewchar + '万'
        break
      case 5:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '拾'
        break
      case 6:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '佰'
        break
      case 7:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '仟'
        break
      case 8:
        tmpnewchar = tmpnewchar + '亿'
        break
      case 9:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '拾'
        break
      case 10:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '百'
        break
      case 11:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '仟'
        break
      case 12:
        tmpnewchar = tmpnewchar + '兆'
        break
      case 13:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '拾'
        break
      case 14:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '百'
        break
      case 15:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '仟'
        break
      case 16:
        if (perchar != 0)
          tmpnewchar = tmpnewchar + '京'
        break
      case 17:
        tmpnewchar = tmpnewchar + '拾'
        break
    }
    newchar = tmpnewchar + newchar
  }
  // 小数点之后进行转化
  if (Num.indexOf('.') != -1) {
    if (part[1].length > 2) {
      //alert("小数点之后只能保留两位,系统将自动截段");
      var tempNum = parseFloat(Num)
      Num = tempNum.toFixedSelf(suffixNumber)
      part = String(Num).split('.')
    }
    for (i = 0; i < part[1].length; i++) {
      tmpnewchar = ''
      perchar = part[1].charAt(i)
      switch (perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar
          break
        case '1':
          tmpnewchar = '壹' + tmpnewchar
          break
        case '2':
          tmpnewchar = '贰' + tmpnewchar
          break
        case '3':
          tmpnewchar = '叁' + tmpnewchar
          break
        case '4':
          tmpnewchar = '肆' + tmpnewchar
          break
        case '5':
          tmpnewchar = '伍' + tmpnewchar
          break
        case '6':
          tmpnewchar = '陆' + tmpnewchar
          break
        case '7':
          tmpnewchar = '柒' + tmpnewchar
          break
        case '8':
          tmpnewchar = '捌' + tmpnewchar
          break
        case '9':
          tmpnewchar = '玖' + tmpnewchar
          break
      }
      if (i == 0)
        tmpnewchar = tmpnewchar + '角'
      if (i == 1)
        tmpnewchar = tmpnewchar + '分'
      newchar = newchar + tmpnewchar
    }
  }
  //替换所有无用汉字
  while (newchar.search('零零') != -1)
    newchar = newchar.replace('零零', '零')
  newchar = newchar.replace('零亿', '亿')
  newchar = newchar.replace('亿万', '亿')
  newchar = newchar.replace('零万', '万')
  newchar = newchar.replace('零元', '元')
  newchar = newchar.replace('零角', '')
  newchar = newchar.replace('零分', '')

  newchar = newchar.replace('亿万', '亿')
  newchar = newchar.replace('兆亿', '兆')
  newchar = newchar.replace('零兆', '兆')
  newchar = newchar.replace('京兆', '京')

  if (newchar.charAt(newchar.length - 1) == '元'
      || newchar.charAt(newchar.length - 1) == '角')
    newchar = newchar + '整'

  var digit = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var _i = 0
  while(newchar.length > 0){
    if(digit.indexOf(newchar[0]) < 0){
      newchar = newchar.substr(1)
    }else{
      break
    }
  }

  var firstChar = Num.substring(0,1)
  if(firstChar=='-'){
    newchar = '负'+newchar
  }

  var lastChar=newchar.charAt(newchar.length-1)
  if('零' == lastChar){
    newchar=newchar.substring(0,newchar.length-1)
    newchar=newchar+'整'
  }

  if(parseFloat(Num)==0){
    newchar='零元整'
  }
  return newchar
}
/**
 * @description 金额转大写
 * @date 2019-07-18
 * @param {String} value 金额数字
 * @param {Number} integerNum 整数位数
 * @param {Number} suffixNum 小数位数
 * @param {Boolean} isround 事否四舍五入
 */
export function changeTipsVal(value,integerNum,suffixNum,isround){
  value  = String(value).replace(/[^0-9\.-]/g,'')
  var firstChar = value.substring(0,1)
  value = cutNum(value,integerNum)
  if(value.split('.')[1] && value.split('.')[1].length > 2){
    if(isround&&isround==true){
      value = parseFloat(value).toFixedSelf(suffixNum)
    }else{
      var suf = value.split('.')[1].substr(0,suffixNum)
      value = value.split('.')[0]+'.'+suf
    }
  }
  return numtochinese(value + '',suffixNum)
}
/**
 * @description 数字千分位分割
 * @date 2019-07-18
 * @param {String} num 金额数字
 */
export function divideNum(num){
  let revalue='';
  let array=String(num).split('.')
  let pointStr = array[1]?'.'+array[1]:''
  array[0] = array[0].replace(/-/g, '')
  if(array[0].length>3){
    while(array[0].length>3){
      revalue=','+array[0].substring(array[0].length-3,array[0].length)+revalue
      array[0]=array[0].substring(0,array[0].length-3)
    }
  }
  return num>=0?array[0]+revalue+pointStr:'-'+array[0]+revalue+pointStr
}
/**
 * @description 金额转大写调用外部方法，只提供处理后金额
 * @date 2019-08-21
 * @param {String} value 金额数字
 * @param {Number} integerNum 整数位数
 * @param {Number} suffixNum 小数位数
 * @param {Boolean} isround 事否四舍五入
 */
export function changeTipsNum(value,integerNum,suffixNum,isround){
  value  = String(value).replace(/[^0-9\.-]/g,'')
  value = cutNum(value,integerNum)
  if(value.split('.')[1] && value.split('.')[1].length > 2){
    if(isround&&isround==true){
      value = parseFloat(value).toFixedSelf(suffixNum)
    }else{
      var suf = value.split('.')[1].substr(0,suffixNum)
      value = value.split('.')[0]+'.'+suf
    }
  }
  return value
}
