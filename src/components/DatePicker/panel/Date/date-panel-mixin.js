
import { oneOf } from '../../../../util/tools';
import {initTimeDate } from '../../util';


export default {
    props: {
        showTime: {
            type: Boolean,
            default: false
        },
        showLong: {
            type: Boolean,
            default: false
        },
        format: {
            type: String,
            default: 'yyyy-MM-dd'
        },
        selectionMode: {
            type: String,
            validator (value) {
                return oneOf(value, ['year', 'month', 'date', 'time']);
            },
            default: 'date'
        },
        shortcuts: {
            type: Array,
            default: () => []
        },
        disabledDate: {
            type: Function,
            default: () => false
        },
        value: {
            type: Array,
            default: () => [initTimeDate(), initTimeDate()]
        },
        showWeekNumbers: {
            type: Boolean,
            default: false
        },
        startDate: {
            type: Date
        },
        pickerType: {
            type: String,
            require: true
        },
        showTwoPanel:Boolean,
        longValue:{
            type: [Date, String, Array]
       },
       showToday: {
        type: Boolean,
        default: false
    },
    },
    computed: {
        isTime(){
            return this.currentView === 'time';
        }
    },
    methods: {
        handleToggleTime(){
            this.currentView = this.currentView === 'time' ? 'date' : 'time';
        },
    }
};
