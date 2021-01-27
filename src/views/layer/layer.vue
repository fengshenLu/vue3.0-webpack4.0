<template>
    <div>
        <layer-header></layer-header>
        <layer-content></layer-content>
        <layer-footer></layer-footer>
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

<style scoped>

</style>