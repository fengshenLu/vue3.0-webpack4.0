<template>
    <div class="table"  :style="{'width': width}">
        <div class="tableHeader">
            <div class="tableHeaders" :style="{'width' : columnWidths}" v-for="labels in label" :key="labels"><slot name="header" >{{labels}}</slot></div>
        </div>
        <div>
            <draggable v-model="tableData" :disabled="draggableFlag">
                <div v-for="item in tableData"  :key="item.index" class="tableBody">
                    <div class="tableColumns" :style="{'width' : columnWidths}" v-for="columns in column" :key="columns"><slot name="col">{{item[columns]}}</slot></div>
                </div>
            </draggable>
        </div>
        <tableSlot :draggableFlag="false" :tableData="tableData.slice(0,2)" :label="label.slice(0,3)" :column="column.slice(0,3)" :width="'400px'">
            <template  v-slot:header="slotProps">
                <p >{{slotProps.lable}}</p><i>{{slotProps.lable === '序号' ? '（Number）' : '（String）'}}</i>
            </template>
            <template  v-slot:col="slotProps1">
                <span >{{slotProps1.row[slotProps1.columns]}}</span>
            </template>
        </tableSlot>
    </div>
</template>

<script>
    import tableSlot from './tableSlot'
    import draggable from 'vuedraggable'
    export default {
        name: "Table",
        components:{
            draggable,
            tableSlot
        },
        data() {
            return {
                draggableFlag: false,
                tableData: [
                    {
                        index: 1,
                        param: '武汉',
                        paramUnit: '城市',
                        paramMeans: '意义'
                    },
                    {
                        index: 2133,
                        param: '123阿斯顿撒',
                        paramUnit: '萨达',
                        paramMeans: '阿萨德刚放假阿萨德刚放假阿萨德刚放假阿萨德刚放假阿萨德刚放假阿萨德刚放假'
                    },
                    {
                        index: 456,
                        param: '斯柯达付款',
                        paramUnit: '发大水时副科级',
                        paramMeans: '胜多负少的接口'
                    },
                    {
                        index: 2,
                        param: '第三方',
                        paramUnit: '；李里欧',
                        paramMeans: '我都发给'
                    }
                ],
                label: [ '序号', '参数', '参数单位', '参数意义'],
                column: [ 'index', 'param', 'paramUnit', 'paramMeans'],
                width: '700px',
            }
        },
        computed: {
            columnWidths() {
                return (1/this.column.length * 100 + '%')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .table{
        .tableHeader{
            display: -webkit-flex; /* Safari */
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            .tableHeaders{
                background-color: #fAAADD;
            }
            justify-content: space-around;
        }
        .tableBody{
            display: -webkit-flex; /* Safari */
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-around;
            align-items: center;
            .tableColumns{
                /*background-color: gray;*/
            }
        }
    }

</style>