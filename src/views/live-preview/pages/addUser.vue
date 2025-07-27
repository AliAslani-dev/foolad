<script>
import Layout from "@/layout/custom.vue";
import { onMounted, ref, computed } from "vue";

import axios from "axios";
import Swal from "sweetalert2";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

export default {
  name: "SAMPLE-PAGE",
  components: {
    Layout,
  },
  setup() {
    const loading = ref(false);
    const errors = ref({});
    const users = ref();
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const name = ref();
    const role = ref();
    const mobile = ref();
    const access = ref([]);
    const password = ref();
    const UserSearchQuery = ref();
    const selectedOperator = ref();

    const filteredUsers = computed(() => {
      if (!UserSearchQuery.value) return users.value;
      return users.value.filter((user) =>
        user.name.toLowerCase().includes(UserSearchQuery.value.toLowerCase())
      );
    });
    const clearError = (field) => {
      errors.value[field] = "";
    };

    const getUsers = () => {
      axios
        .get(`${url}/admin/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          users.value = resp.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    };

    const toggleAccess = (permission) => {
      if (access.value.includes(permission)) {
        access.value = access.value.filter((item) => item !== permission);
      } else {
        access.value.push(permission);
      }
    };

    const validateForm = () => {
      errors.value = {};
      if (!name.value) errors.value.name = "وارد کردن نام الزامی می باشد";
      if (!mobile.value)
        errors.value.mobile = "وارد کردن شماره موبایل الزامی می باشد";
      if (!role.value) errors.value.role = "انتخاب نوع کاربر الزامی است";
      if (!password.value)
        errors.value.password = "وارد کردن رمز عبور الزامی است";
      return Object.keys(errors.value).length === 0;
    };

    const addUser = async () => {
      if (!validateForm()) return;
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append("name", name.value);
        formData.append("mobile", mobile.value);
        formData.append("password", password.value);
        formData.append("get_sms", 1);
        formData.append("role", role.value);
        if (selectedOperator.value) {
          formData.append("manager_id", selectedOperator.value);
        }

        access.value.forEach((item) => {
          formData.append("access[]", item);
        });
        const response = await axios.post(`${url}/admin/add-user`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        });

        if (response.data.status === true) {
          toast.success("کاربر با موفقیت ایجاد شد", {
            position: "top-right",
            autoClose: 1000,
          });
        } else {
          toast.error("افزودن کاربر با مشکل مواجه شد!", {
            position: "top-right",
            autoClose: 1000,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: `افزودن کاربر با مشکل مواجه شد: ${error.response.data.message}`,
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      getUsers();
    });
    return {
      name,
      mobile,
      password,
      role,
      access,
      toggleAccess,
      filteredUsers,
      UserSearchQuery,
      selectedOperator,
      addUser,
      errors,
      loading,
      clearError,
    };
  },
};
</script>

<template>
  <Layout>
    <BRow>
      <BCard>
        <form @submit.prevent="addUser">
          <BRow class="g-3">
            <!-- Form fields -->
            <BCol class="col-lg-6 mb-2">
              <div class="form-group">
                <label class="form-label">نام </label>
                <input
                  v-model="name"
                  type="text"
                  class="form-control"
                  placeholder="نام کاربر را وارد نمایید"
                  @input="clearError('name')"
                />
                <small v-if="errors.name" class="text-danger">{{
                  errors.name
                }}</small>
              </div>
            </BCol>

            <BCol class="col-lg-6 mb-2">
              <div class="form-group">
                <label class="form-label">موبایل</label>
                <input
                  v-model="mobile"
                  type="text"
                  class="form-control"
                  placeholder="شماره موبایل کاربر را  وارد نمایید"
                  @input="clearError('mobile')"
                />
                <small v-if="errors.mobile" class="text-danger">{{
                  errors.mobile
                }}</small>
              </div>
            </BCol>
          </BRow>

          <BRow class="g-3">
            <!-- User Type -->
            <BCol class="col-lg-6">
              <div class="form-group">
                <label class="form-label">نوع کاربر</label>
                <div class="input-group">
                  <select
                    class="form-select"
                    v-model="role"
                    @change="clearError('role')"
                  >
                    <option disabled value="">نوع کاربر</option>
                    <option value="1">کاربر</option>
                    <option value="2">اپراتور</option>
                    <option value="0">ادمین</option>
                  </select>
                </div>
                <small v-if="errors.role" class="text-danger">{{
                  errors.role
                }}</small>
              </div>
            </BCol>

            <BCol class="col-lg-6 mb-2">
              <div class="form-group">
                <label class="form-label">رمز عبور</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="feather icon-lock"></i>
                  </span>
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="رمز عبور خود را وارد نمایید"
                    @input="clearError('password')"
                  />
                </div>
                <small v-if="errors.password" class="text-danger">{{
                  errors.password
                }}</small>
              </div>
            </BCol>
          </BRow>

          <BCard style="margin-top: 10px" v-if="role == `2`" class="p-4">
            <!-- Access Checkboxes -->
            <BRow class="g-3 justify-content-center">
              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('user')"
                  @change="toggleAccess('user')"
                  >دسترسی به کاربران</BFormCheckbox
                >
              </BCol>
              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('subjects')"
                  @change="toggleAccess('subjects')"
                  >دسترسی به موضوع ها</BFormCheckbox
                >
              </BCol>

              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('private_meeting')"
                  @change="toggleAccess('private_meeting')"
                  >دسترسی به ملاقات</BFormCheckbox
                >
              </BCol>

              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('meeting')"
                  @change="toggleAccess('meeting')"
                  >دسترسی به جلسات</BFormCheckbox
                >
              </BCol>
              <BCol
                v-if="
                  access.includes('meeting') ||
                  access?.includes('private_meeting')
                "
                md="12"
              >
                <BCard class="shadow rounded">
                  <BCardBody class="p-4">
                    <h4 class="checkbox-label mb-3">
                      اپراتور مورد نظر را انتخاب کنید
                    </h4>

                    <BFormGroup class="mb-4">
                      <BFormInput
                        placeholder="جستجوی  اپراتور ها..."
                        class="search-input"
                        v-model="UserSearchQuery"
                      />
                    </BFormGroup>

                    <div class="user-checkbox-list">
                      <div class="row checkbox-container">
                        <BCol
                          v-for="user in filteredUsers"
                          :key="user.id"
                          md="4"
                          class="mb-3"
                        >
                          <BFormRadio
                            v-model="selectedOperator"
                            :value="user.id"
                            class="radio-item custom-radio"
                          >
                            <strong>{{ user.name }}</strong>
                          </BFormRadio>
                        </BCol>
                      </div>
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>

              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('locations')"
                  @change="toggleAccess('locations')"
                  >دسترسی به موقعیت ها</BFormCheckbox
                >
              </BCol>
              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('note')"
                  @change="toggleAccess('note')"
                  >دسترسی به یادداشت ها</BFormCheckbox
                >
              </BCol>

              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('logs')"
                  @change="toggleAccess('logs')"
                  >دسترسی به لاگ ها</BFormCheckbox
                >
              </BCol>

              <BCol cols="6" class="d-flex">
                <BFormCheckbox
                  class="ml-3"
                  :checked="access?.includes('settings')"
                  @change="toggleAccess('settings')"
                  >دسترسی به تنظیمات</BFormCheckbox
                >
              </BCol>
            </BRow>
          </BCard>

          <div class="d-flex justify-content-center">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
              style="width: auto"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span v-if="!loading">ذخیره</span>
            </button>
          </div>
        </form>
      </BCard>
    </BRow>
  </Layout>
</template>
