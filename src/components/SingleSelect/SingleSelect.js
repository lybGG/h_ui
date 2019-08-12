import SimpleSelect from '../SelectTable/SelectTable.vue'
export default {
  name: 'SingleSelect',
  mixins: [SimpleSelect],
  props: {
    block:{
      default: true,
    },
    isSingleSelect:{
      type:Boolean,
      default:true,
    },
    filterable: {
      type: Boolean,
      default: true
    },
    accuFilter: {
      type: Boolean,
      default: true
    },
    showArrow:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  methods: {},
  mounted() {
  },
  beforeDestroy() {
  }
}
