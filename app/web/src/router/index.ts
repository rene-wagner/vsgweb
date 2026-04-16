import { createRouter, createWebHistory } from 'vue-router';
import defaultRoutes from '@/modules/default/router.routes';

const router = createRouter({
  history: createWebHistory(),
  routes: defaultRoutes,
  scrollBehavior: () => {
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;
