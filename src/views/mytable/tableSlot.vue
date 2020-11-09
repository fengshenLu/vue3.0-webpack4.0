<template>
    <div class="table"  :style="{'width': width}">
        <div class="tableHeader">
            <div class="tableHeaders" :style="{'width' : columnWidths}" v-for="labels in label" :key="labels"><slot :lable="labels" name="header">{{labels}}</slot></div>
        </div>
        <div>
            <draggable v-model="tableData" :disabled="draggableFlag">
                <div v-for="item in tableData"  :key="item.index" class="tableBody">
                    <div class="tableColumns" :style="{'width' : columnWidths}" v-for="columns in column" :key="columns"><slot name="col" :row="item" :columns="columns">{{item[columns]}}</slot></div>
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: "Table",
        components:{
            draggable,
        },
        props:{
            draggableFlag: Boolean,
            tableData: Array,
            label: Array,
            column: Array,
            width: String
        },
        data() {
            return {
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