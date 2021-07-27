import Vue from "vue";
import VueRouter from "vue-router";
import Store from "@/store/index.js";
import Home from "@/views/Main.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  { path: "*", component: Home }
];

const router = new VueRouter({
  mode: "history",
  //base: process.env.BASE_URL,
  routes
});


router.beforeEach((to, from, next) => {
    next();
})


export default router;
