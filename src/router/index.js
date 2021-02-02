import Vue from "vue";
import Router from "vue-router";
import { getToken } from "@/utils/auth.js";

Vue.use(Router);

const router = new Router({
  mode: "history",
  linkActiveClass: "active",
  routes: [
    {
      path: "/",
      redirect: "/playshow",
      component: () => import("@/views/home/index.vue"),
      children: [
        {
          path: "/playshow",
          name: "playshow",
          redirect: "/playshow/teachshow",
          component: () => import("@/views/show/page/index.vue"),
          children: [
            {
              path: "/playshow/teachshow",
              name: "teachshow",
              component: () => import("@/views/show/page/teachShow.vue"),
              meta: {
                isAuth: false
              }
            },
          ],
        },
        {
          path: "/updateHistory",
          name: "updateHistory",
          component: () => import("@/views/update/page/index.vue"),
          meta: {
            isAuth: false
          }
        },
      ],
    },
    {
      path: "/admin",
      redirect: "/course",
      component: () => import("@/views/adminHome/index.vue"),
      children: [
        {
          // 课程管理
          path: "/course",
          name: "course",
          component: () => import("@/views/adminPlatfrom/course/index.vue"),
          meta: {
            isAuth: true
          }
        },
        {
          // 课程管理
          path: "/update",
          name: "update",
          component: () => import("@/views/adminPlatfrom/updateManage/index.vue"),
          meta: {
            isAuth: true
          }
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  let token = getToken();
  console.log(to.meta.isAuth)
  if (to.name === "login") {
    next();
  } else {
    if (!token && to.meta.isAuth) {
      next(`/login`);
    } else {
      next();
    }
  }
});
export default router;
