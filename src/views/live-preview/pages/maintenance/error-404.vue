<script>
import Rightbar from "@/components/right-bar.vue";

export default {
  name: "LOGIN",
  components: {
    Rightbar,
  },
};
</script>

<template>
  <div class="auth-main v1">
    <div class="auth-wrapper">
      <div class="auth-form">
        <div class="error-card">
          <div class="card-body">
            <div class="error-image-block">
              <img
                class="img-fluid"
                src="@/assets/images/pages/img-error-404.png"
                alt="img"
              />
            </div>
            <div class="text-center">
              <h1 class="mt-2">اوه! اتفاقی پیش اومده </h1>
              <p class="mt-2 mb-4 text-muted f-20">
                صفحه‌ای که دنبالش بودید پیدا نشد. شاید بهتر باشه به صفحه اصلی برگردید و دوباره امتحان کنید.
              </p>
              <router-link
                class="btn btn-primary d-inline-flex align-items-center mb-3"
                to="/dashPage"
                ><i class="ph-duotone ph-house me-2"></i>بازگشت به خانه</router-link
              >
            </div>
          </div>
        </div>
      </div>

     
    </div>
  </div>

  <Rightbar />
</template>
