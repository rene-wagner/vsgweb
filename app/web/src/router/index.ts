import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/impressum",
    name: "impressum",
    component: () => import("@/views/LegalNoticeView.vue"),
  },
  {
    path: "/datenschutz",
    name: "datenschutz",
    component: () => import("@/views/DataPrivacyView.vue"),
  },
  {
    path: "/kontakt",
    name: "contact",
    component: () => import("@/views/ContactView.vue"),
  },
  {
    path: "/abteilung/:slug",
    name: "department-detail",
    component: () => import("@/views/DepartmentView.vue"),
  },
  {
    path: "/beitraege",
    name: "post-list",
    component: () => import("@/views/PostListView.vue"),
  },
  {
    path: "/beitrag/:slug",
    name: "post-detail",
    component: () => import("@/views/PostView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => {
    return { top: 0, behavior: "smooth" };
  },
});

export default router;
