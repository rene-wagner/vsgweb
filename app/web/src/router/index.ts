import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/abteilung/:slug",
    name: "department-detail",
    component: () => import("@/views/DepartmentView.vue"),
  },
  {
    path: "/verein/geschichte",
    name: "verein-geschichte",
    component: () => import("@/views/club/DefaultClubHistoryView.vue"),
  },
  {
    path: "/verein/vorstand",
    name: "verein-vorstand",
    component: () => import("@/views/club/DefaultClubBoardView.vue"),
  },
  {
    path: "/verein/satzung",
    name: "verein-satzung",
    component: () => import("@/views/club/DefaultClubStatutesView.vue"),
  },
  {
    path: "/verein/beitragsordnung",
    name: "verein-beitragsordnung",
    component: () => import("@/views/club/DefaultClubMembershipFeeView.vue"),
  },
  {
    path: "/verein/sportversicherung",
    name: "verein-sportversicherung",
    component: () => import("@/views/club/DefaultClubSportInsuranceView.vue"),
  },
  {
    path: "/verein/mitgliedschaft",
    name: "verein-mitgliedschaft",
    component: () => import("@/views/club/DefaultClubMembershipView.vue"),
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
  {
    path: "/kontakt",
    name: "contact",
    component: () => import("@/views/ContactView.vue"),
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => {
    return { top: 0, behavior: "smooth" };
  },
});

export default router;
