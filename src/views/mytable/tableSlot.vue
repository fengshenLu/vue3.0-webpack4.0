<template>
    <div class="table"  :style="{'width': width}">
        <div class="tableHeader" >
            <div class="tableHeaders" :style="{'width' : columnWidths}" v-for="labels in label" :key="labels">
                <slot :lable="labels" name="header">{{labels}}</slot>
            </div>
        </div>
        <draggable v-model="tableData" delay="200" :disabled="!draggableFlag" @end="handleDrag" >
            <div v-for="item in tableData"  :key="item.index" class="tableBody">
                <div  :style="{'width' : columnWidths}" v-for="columns in column" :key="columns" class="tableColumns">
                    <slot name="col" :row="item" :columns="columns">{{item[columns]}}</slot>
                </div>
            </div>
        </draggable>
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
        },
        methods: {
            handleDrag(value){
                /* eslint-disable*/
                this.$emit('dragEnd',value.newIndex,value.oldIndex)
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
            align-items: stretch;
            min-height: 30px;
            align-content: center;
            .tableHeaders{
                background-color: #fAAADD;
                .slotStyle{
                    padding: 5px 10px ;
                    /*min-height: 41px;*/
                }
            }
            justify-content: space-around;
        }
        .tableBody{
            display: -webkit-flex; /* Safari */
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-around;
            align-items: stretch;
            min-height: 30px;
            align-content: center;
            .tableColumns{

                padding: 5px 10px ;
                /*background-color: gray;*/
            }
        }
    }

</style>