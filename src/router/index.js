import { createWebHistory, createRouter } from "vue-router";
import routes from './routes';
import store from '../state/store'; 
import appConfig from "../../app.config";

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

router.beforeResolve(async (routeTo, routeFrom, next) => {
  store.commit('user/SET_LOADING', true);

  try {
  
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              next(...args);
              reject(new Error('Redirected'));
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
    
    await store.dispatch('user/verifyLogin');

    // Check if the route requires authentication
    if (routeTo.matched.some(record => record.meta.requiresAuth)) {
      if (!store.getters['user/isAuthenticated']) {
        next({ name: 'login-v2' });
        return;
      }

      const userRoles = store.getters['user/getUser']?.user_type || [];
      const routeRoles = routeTo.meta.roles || [];

      if (routeRoles.length && !routeRoles.some(role => userRoles.includes(role))) {
        next({ name: 'login-v2' });
        return;
      }
    }

    document.title = routeTo.meta.title + ' | ' + appConfig.title;
    next(); // Proceed to the route

  } catch (error) {
    console.error(error);
    // Handle any errors here, possibly show a notification
  } finally {
    store.commit('user/SET_LOADING', false); // Stop loading
  }
});

export default router;
