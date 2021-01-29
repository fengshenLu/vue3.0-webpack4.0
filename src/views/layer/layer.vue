<template>
    <div class="ownerPages">
        <layer-header class="header"></layer-header>
        <layer-content class="content"></layer-content>
        <layer-footer class="footer"></layer-footer>
    </div>
</template>

<script>
    import layerHeader from './pageIndex/header.vue'
    import layerFooter from './pageIndex/footer.vue'
    import layerContent from './pageIndex/content.vue'
      export default {
        name: "layer",
        components:{ layerHeader, layerFooter, layerContent }
      };
</script>

<style lang="scss" scoped>
 .ownerPages{
     width:100%;
     height: 100%;
     background: transparent url('../../../public/bg-03.png') no-repeat fixed  ;
     .header{
        position: absolute;
         background-color: gray;
         left: 0;
         top: 0;
         height: 3em;
         width: 100%;
     }
     .content{
       width: 100%;
         height: 100%;
         background-color: orange;
         padding: 3em 0 3em 0;
     }
     .footer{
         position: absolute;
         background-color: black;
         bottom: 0;
         height: 3em;
         width: 100%;
     }
 }
</style>