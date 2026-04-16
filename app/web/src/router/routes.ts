import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
      },
      {
        path: 'impressum',
        name: 'impressum',
        component: () => import('../views/LegalNoticeView.vue'),
      },
      {
        path: 'datenschutz',
        name: 'datenschutz',
        component: () => import('../views/DataPrivacyView.vue'),
      },
      {
        path: 'kontakt',
        name: 'contact',
        component: () => import('../views/ContactView.vue'),
      },
      {
        path: 'verein/geschichte',
        name: 'verein-geschichte',
        component: () => import('../views/verein/ClubHistoryView.vue'),
      },
      {
        path: 'verein/vorstand',
        name: 'verein-vorstand',
        component: () => import('../views/verein/ClubBoardView.vue'),
      },
      {
        path: 'verein/satzung',
        name: 'verein-satzung',
        component: () => import('../views/verein/ClubStatutesView.vue'),
      },
      {
        path: 'verein/mitgliedschaft',
        name: 'verein-mitgliedschaft',
        component: () => import('../views/verein/ClubMembershipView.vue'),
      },
      {
        path: 'verein/beitragsordnung',
        name: 'verein-beitragsordnung',
        component: () => import('../views/verein/ClubMembershipFeeView.vue'),
      },
      {
        path: 'verein/sportversicherung',
        name: 'verein-sportversicherung',
        component: () => import('../views/verein/ClubSportInsuranceView.vue'),
      },
      {
        path: 'abteilung/:slug',
        name: 'department-detail',
        component: () => import('../views/DepartmentView.vue'),
      },
      {
        path: 'beitrag/:slug',
        name: 'post-detail',
        component: () => import('../views/PostView.vue'),
      },
    ],
  },
];

export default routes;
