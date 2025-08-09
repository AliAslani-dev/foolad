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
    meta: { title: "Ø¯Ø§Ø´Ø¨ÙØ±Ø¯", requiresAuth: true },
    component: () =>
      import("../views/live-preview/pages/dashpage/dashPage.vue"),
  },
  {
    path: "/users",
    name: "users",
    meta: { requiresAuth: true, title: "Ú©Ø§Ø±Ø¨Ø±Ø§Ù" },
    component: () => import("../views/live-preview/pages/users.vue"),
  },
  {
    path: "/addUser",
    name: "addUser",
    meta: { requiresAuth: true, title: "Ú©Ø§Ø±Ø¨Ø±Ø§Ù" },
    component: () => import("../views/live-preview/pages/addUser.vue"),
  },
  {
    path: "/editUser/:id",
    name: "editUser",
    meta: { requiresAuth: true, title: "Ú©Ø§Ø±Ø¨Ø±Ø§Ù" },
    component: () => import("../views/live-preview/pages/editUser.vue"),
  },
  {
    path: "/locations",
    name: "locations",
    meta: { requiresAuth: true, title: "ÙÙÙØ¹ÛØª ÙØ§" },
    component: () => import("../views/live-preview/pages/locations.vue"),
  },
  {
    path: "/subjects",
    name: "subjects",
    meta: { requiresAuth: true, title: "ÙÙØ¶ÙØ¹ ÙØ§" },
    component: () => import("../views/live-preview/pages/subjects.vue"),
  },
  {
    path: "/meetings",
    name: "meetings",
    meta: { requiresAuth: true, title: "Ø¬ÙØ³Ø§Øª" },
    component: () => import("../views/live-preview/pages/meetings.vue"),
  },
  {
    path: "/editMeet/:id",
    name: "editMeet",
    meta: { requiresAuth: true, title: "ÙÛØ±Ø§ÛØ´ Ø¬ÙØ³Ø§Øª" },
    component: () => import("../views/live-preview/pages/editMeet.vue"),
  },
  {
    path: "/privateMeets",
    name: "privateMeets",
    meta: { requiresAuth: true, title: "ÙÙØ§ÙØ§Øª ÙØ§Û Ø®ØµÙØµÛ" },
    component: () => import("../views/live-preview/pages/privateMeets.vue"),
  },
  {
    path: "/editPrivateMeet/:id",
    name: "editPrivateMeet",
    meta: { requiresAuth: true, title: "ÙÛØ±Ø§ÛØ´ ÙÙØ§ÙØ§Øª ÙØ§" },
    component: () => import("../views/live-preview/pages/editPrivateMeet.vue"),
  },
  {
    path: "/reports",
    name: "reports",
    meta: { requiresAuth: true, title: "Ú¯Ø²Ø§Ø±Ø´Ø§Øª" },
    component: () => import("../views/live-preview/pages/reports.vue"),
  },
  {
    path: "/notes",
    name: "notes",
    meta: { requiresAuth: true, title: "ÛØ§Ø¯ Ø¯Ø§Ø´Øª ÙØ§" },
    component: () => import("../views/live-preview/pages/notes.vue"),
  },
  {
    path: "/editMinute/:type/:id",
    name: "editMinute",
    meta: { requiresAuth: true, title: "ÙÛØ±Ø§ÛØ´ ØµÙØ±Øª Ø¬ÙØ³Ù" },
    component: () => import("../views/live-preview/pages/editMinute.vue"),
  },
  {
    path: "/editProfile",
    name: "editProfile",
    meta: { requiresAuth: true, title: "ÙÛØ±Ø§ÛØ´ ØµÙØ±Øª Ø¬ÙØ³Ù" },
    component: () => import("../views/live-preview/pages/editProfile.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    meta: { requiresAuth: true, title: "ØªÙØ¸ÛÙØ§Øª" },
    component: () => import("../views/live-preview/pages/setting/setting.vue"),
  },

  {
    path: "/logs",
    name: "logs",
    meta: { requiresAuth: true, title: "Ú©ÙØªØ±Ù ÙØ±ÙØ¯ Ù Ø®Ø±ÙØ¬" },
    component: () => import("../views/live-preview/pages/logs/logs.vue"),
  },

  // Auth ۲
  {
    path: "/login-v2",
    name: "login-v2",
    meta: { title: "ÙØ±ÙØ¯" },
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
