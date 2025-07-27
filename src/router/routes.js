export default [
  {
    path: "/",
    redirect: "/dashPage",
  },
  {
    path: "/otpLogin",
    name: "otpLogin",
    meta: { title: "Login" },
    component: () => import("../views/live-preview/pages/auth2/otpLogin.vue"),
  },
  {
    path: "/dashPage",
    name: "dashPage",
    meta: { title: "داشبورد", requiresAuth: true },
    component: () =>
      import("../views/live-preview/pages/dashpage/dashPage.vue"),
  },
  {
    path: "/users",
    name: "users",
    meta: { requiresAuth: true, title: "کاربران" },
    component: () => import("../views/live-preview/pages/users.vue"),
  },
  {
    path: "/addUser",
    name: "addUser",
    meta: { requiresAuth: true, title: "کاربران" },
    component: () => import("../views/live-preview/pages/addUser.vue"),
  },
  {
    path: "/editUser/:id",
    name: "editUser",
    meta: { requiresAuth: true, title: "کاربران" },
    component: () => import("../views/live-preview/pages/editUser.vue"),
  },
  {
    path: "/locations",
    name: "locations",
    meta: { requiresAuth: true, title: "موقعیت ها" },
    component: () => import("../views/live-preview/pages/locations.vue"),
  },
  {
    path: "/subjects",
    name: "subjects",
    meta: { requiresAuth: true, title: "موضوع ها" },
    component: () => import("../views/live-preview/pages/subjects.vue"),
  },
  {
    path: "/meetings",
    name: "meetings",
    meta: { requiresAuth: true, title: "جلسات" },
    component: () => import("../views/live-preview/pages/meetings.vue"),
  },
  {
    path: "/editMeet/:id",
    name: "editMeet",
    meta: { requiresAuth: true, title: "ویرایش جلسات" },
    component: () => import("../views/live-preview/pages/editMeet.vue"),
  },
  {
    path: "/privateMeets",
    name: "privateMeets",
    meta: { requiresAuth: true, title: "ملاقات های خصوصی" },
    component: () => import("../views/live-preview/pages/privateMeets.vue"),
  },
  {
    path: "/editPrivateMeet/:id",
    name: "editPrivateMeet",
    meta: { requiresAuth: true, title: "ویرایش ملاقات ها" },
    component: () => import("../views/live-preview/pages/editPrivateMeet.vue"),
  },
  {
    path: "/reports",
    name: "reports",
    meta: { requiresAuth: true, title: "گزارشات" },
    component: () => import("../views/live-preview/pages/reports.vue"),
  },
  {
    path: "/notes",
    name: "notes",
    meta: { requiresAuth: true, title: "یاد داشت ها" },
    component: () => import("../views/live-preview/pages/notes.vue"),
  },
  {
    path: "/editMinute/:type/:id",
    name: "editMinute",
    meta: { requiresAuth: true, title: "ویرایش صورت جلسه" },
    component: () => import("../views/live-preview/pages/editMinute.vue"),
  },
  {
    path: "/editProfile",
    name: "editProfile",
    meta: { requiresAuth: true, title: "ویرایش صورت جلسه" },
    component: () => import("../views/live-preview/pages/editProfile.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    meta: { requiresAuth: true, title: "تنظیمات" },
    component: () => import("../views/live-preview/pages/setting/setting.vue"),
  },

  {
    path: "/logs",
    name: "logs",
    meta: { requiresAuth: true, title: "کنترل ورود و خروج" },
    component: () => import("../views/live-preview/pages/logs/logs.vue"),
  },

  // Auth 2
  {
    path: "/login-v2",
    name: "login-v2",
    meta: { title: "ورود" },
    component: () => import("../views/live-preview/pages/auth2/login.vue"),
  },
  {
    path: "/register-v2",
    name: "register-v2",
    meta: { title: "Register" },
    component: () => import("../views/live-preview/pages/auth2/register.vue"),
  },
  {
    path: "/forgot-password-v2",
    name: "forgot-password-v2",
    meta: { title: "Forgot Password" },
    component: () =>
      import("../views/live-preview/pages/auth2/forgot-password.vue"),
  },
  {
    path: "/reset-password-v2",
    name: "reset-password-v2",
    meta: { title: "Reset Password" },
    component: () =>
      import("../views/live-preview/pages/auth2/reset-password.vue"),
  },
  {
    path: "/code-verification-v2",
    name: "code-verification-v2",
    meta: { title: "code-verification" },
    component: () =>
      import("../views/live-preview/pages/auth2/code-verification.vue"),
  },

  {
    path: "/error-404",
    name: "error-404",
    meta: { title: "404" },
    component: () =>
      import("../views/live-preview/pages/maintenance/error-404.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () =>
      import("../views/live-preview/pages/maintenance/error-404.vue"),
  },
];
