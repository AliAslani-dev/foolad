<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import Layout from "@/layout/custom.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Swal from "sweetalert2";
export default {
  name: "SAMPLE-PAGE",
  components: {
    Layout,
  },
  setup() {
    const loading = ref(false);
    const store = useStore();
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");
    const user = computed(() => store.getters["user/getUser"]);
    const userName = ref(user.value.name);
    const userPassword = ref("");

    const saveUserInfo = () => {
      if (!userName.value) {
        Swal.fire({
          icon: "warning",
          title: "خطا",
          text: "لطفا نام کاربری را وارد نمایید...",
          confirmButtonText: "باشه",
          confirmButtonColor: "#3085d6",
        });
        return;
      }
      loading.value = true;
      const updatedUser = {
        name: userName.value,
        password: userPassword.value,
      };

      axios
        .post(`${url}/edit-profile`, updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          console.log(resp.data.msg);
          toast.success(`${resp.data.msg}`, {
            position: "top-right",
            autoClose: 3000,
          });
          loading.value = false;
        })
        .catch((err) => {
          console.log(err);
          toast.error("ویرایش پروفایل انجام نشد...", {
            position: "top-right",
            autoClose: 3000,
          });
          loading.value = false;
        });
    };

    return {
      userName,
      userPassword,
      saveUserInfo,
      loading,
    };
  },
};
</script>

<template>
  <Layout>
    <BRow>
      <BCol sm="12">
        <BCard no-body class="shadow-sm">
          <BCardHeader class="bg-primary text-white">
            <h5 class="mb-0 d-flex align-items-center">
              <i class="fas fa-user-edit me-2"></i> ویرایش پروفایل
            </h5>
          </BCardHeader>
          <BCardBody class="p-4">
            <form @submit.prevent="saveUserInfo">
              <!-- Name input -->
              <BRow class="mb-4">
                <BCol sm="12">
                  <label for="userName" class="form-label">
                    <i class="fas fa-user me-2"></i> نام کاربری
                  </label>
                  <BFormInput
                    id="userName"
                    v-model="userName"
                    type="text"
                    placeholder="نام خود را وارد کنید"
                    required
                    class="form-control"
                  />
                </BCol>
              </BRow>

              <!-- Password input (optional) -->
              <BRow class="mb-4">
                <BCol sm="12">
                  <label for="userPassword" class="form-label">
                    <i class="fas fa-key me-2"></i> رمز عبور
                  </label>
                  <BFormInput
                    id="userPassword"
                    v-model="userPassword"
                    type="password"
                    placeholder="رمز عبور جدید را وارد کنید"
                    class="form-control"
                  />
                </BCol>
              </BRow>

              <BRow class="text-center">
                <BCol sm="12">
                  <BButton
                    type="submit"
                    variant="success"
                    class="px-4 py-2"
                    :disabled="loading"
                  >
                    <i v-if="!loading" class="fas fa-save me-2"></i>
                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    ذخیره
                  </BButton>
                </BCol>
              </BRow>
            </form>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<style scoped>
h5 {
  font-size: 1.5rem;
  font-weight: bold;
}

label {
  font-weight: 500;
}

.BButton {
  font-size: 1rem;
}

.shadow-sm {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.BCardHeader {
  border-bottom: none !important;
}

.BCardBody {
  background-color: #f8f9fa;
}
</style>
