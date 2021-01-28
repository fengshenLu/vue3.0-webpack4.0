import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Table from "../views/mytable/table.vue";
import Layer from "../views/layer/layer.vue"
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        redirect: '/index'
    },
  {
    path: '/index',
    name: 'home',
    component: Layer
  },
  {
      path: '/table',
      name: 'table',
      component: Table
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
