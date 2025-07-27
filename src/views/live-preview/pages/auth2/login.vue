<script>
import { ref , onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios"
import Swal from "sweetalert2";

export default {
  name: "LOGIN",
  components: {},
  setup() {
    const logo = ref();
    const url = process.env.VUE_APP_ROOT_URL;
    const settings = ref();
    const loading = ref(false);
    const store = useStore();
    const router = useRouter();
    const form = ref({
      mobile: "",
      password: "",
    });

  
    const getSettings = () => {
      axios
        .get(`${url}/settings`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((resp) => {
          settings.value = resp.data.data;

          // Filter the logo setting
          const logoSetting = settings.value.find(
            (setting) => setting.key === "logo"
          );

          // If logoSetting exists, extract the value
          if (logoSetting) {
            logo.value = logoSetting.value;
            console.log(logo.value); // Logs the logo value (filename)
          } else {
            console.log("Logo setting not found.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const formSubmitted = ref(false);

    const login = async () => {
      formSubmitted.value = true;
      const isValid = validateForm();
      if (!isValid) return;
      loading.value = true;
      try {
        const fd = new FormData();
        fd.append("mobile", form.value.mobile);
        fd.append("password", form.value.password);
        await store.dispatch("user/loginUser", fd);
        loading.value = false;
        router.push({ name: "dashPage" });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "مشکلی پیش آمد",
          text: error.message,
        });
        loading.value = false;
        console.error("Login error:", error);
      }
    };

    const validateForm = () => {
      return Object.values(form.value).every((value) => value.trim() !== "");
    };

    const validateField = (field) => {
      return form.value[field].trim() !== "";
    };

    onMounted(()=>{
      getSettings()
    })

    return {
      form,
      login,
      loading,
      validateField,
      formSubmitted,
      logo
    };
  },
};
</script>

<template>
  <div style="background-color: white" class="auth-main v2">
    <div class="bg-overlay bg-dark"></div>
    <div class="auth-wrapper">
      <div class="auth-sidecontent">
        <div class="auth-sidefooter">
          <BRow class="row"> </BRow>
        </div>
        <img
          :src="`https://api.nghsco.com/storage/statics/${logo}`"
          class="img-brand img-fluid"
          alt="images"
          style="margin-bottom: 44px"
        />
      </div>
      <div class="auth-form" dir="rtl" style="text-align: right">
        <div class="card my-5 mx-3 shadow-sm border-0">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-4 text-center">ورود</h4>

            <div class="mb-3">
              <label for="mobile" class="form-label">موبایل</label>
              <input
                @blur="validateField('mobile')"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && !validateField('mobile'),
                }"
                id="mobile"
                placeholder="شماره موبایل"
                v-model="form.mobile"
              />
              <div
                v-if="formSubmitted && !validateField('mobile')"
                class="text-danger"
              >
                شماره موبایل الزامی است.
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">رمز ورود</label>
              <input
                @blur="validateField('password')"
                type="password"
                class="form-control"
                :class="{
                  'is-invalid': formSubmitted && !validateField('password'),
                }"
                id="password"
                placeholder="رمز عبور"
                v-model="form.password"
              />
              <div
                v-if="formSubmitted && !validateField('password')"
                class="text-danger"
              >
                رمز عبور الزامی است.
              </div>
            </div>

            <div class="d-flex mt-1 justify-content-between align-items-center">
              <router-link
                to="/otpLogin"
                class="text-primary text-decoration-none"
              >
                <span class="fw-normal">ورود با شماره موبایل</span>
              </router-link>
            </div>

            <div class="d-grid mt-4">
              <button
                @click="login"
                type="button"
                class="btn btn-primary"
                :disabled="loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-if="!loading">ورود</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-danger {
  color: #dc3545;
  text-align: right;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.is-invalid {
  border-color: #dc3545;
}
</style>
