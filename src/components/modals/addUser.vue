<template>
  <div
    class="modal fade"
    id="addUser"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">اضافه کردن کاربر</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addUser">
            <BRow class="g-3">
              <!-- Form fields -->
              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">نام </label>
                  <input
                    v-model="name"
                    @input="clearError('name')"
                    type="text"
                    class="form-control"
                    placeholder="نام کاربر را وارد نمایید"
                  />
                  <small v-if="errors.name" class="text-danger">{{
                    errors.name
                  }}</small>
                </div>
              </BCol>

              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">موبایل</label>
                  <input
                    v-model="mobile"
                    @input="clearError('mobile')"
                    type="text"
                    class="form-control"
                    placeholder="شماره موبایل کاربر را  وارد نمایید"
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
                      v-model="user_type"
                      @change="clearError('user_type')"
                    >
                      <option disabled value="">نوع کاربر</option>
                      <option value="1">کاربر</option>
                      <option value="2">اپراتور</option>
                    </select>
                  </div>
                  <small v-if="errors.user_type" class="text-danger">{{
                    errors.user_type
                  }}</small>
                </div>
              </BCol>

              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">رمز عبور</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="feather icon-lock"></i>
                    </span>
                    <input
                      v-model="password"
                      @input="clearError('password')"
                      type="password"
                      class="form-control"
                      placeholder="رمز عبور خود را وارد نمایید"
                    />
                  </div>
                  <small v-if="errors.password" class="text-danger">{{
                    errors.password
                  }}</small>
                </div>
              </BCol>
            </BRow>

            <BCard v-if="user_type === `2`" class="p-4">
              <BRow class="g-3 justify-content-center">
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="access.includes('user')"
                    @change="toggleAccess('user')"
                    >دسترسی به کاربران</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="access.includes('subjects')"
                    @change="toggleAccess('subjects')"
                    >دسترسی به موضوع ها</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="access.includes('locations')"
                    @change="toggleAccess('locations')"
                    >دسترسی به موقعیت ها</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="access.includes('meeting')"
                    @change="toggleAccess('meeting')"
                    >دسترسی به جلسات</BFormCheckbox
                  >
                </BCol>

                <BCol v-if="access.includes('meeting')" md="12">
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
                    :checked="access.includes('private_meeting')"
                    @change="toggleAccess('private_meeting')"
                    >دسترسی به جلسات شخصی</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="access.includes('note')"
                    @change="toggleAccess('note')"
                    >دسترسی به یاد داشت ها</BFormCheckbox
                  >
                </BCol>
              </BRow>
            </BCard>

            <!-- Submit Buttons -->
            <div
              class="d-flex justify-content-end gap-2"
              style="margin-top: 20px"
            >
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                بستن
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                ذخیره
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "vue3-toastify";

export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const UserSearchQuery = ref();
    const localUsers = ref();
    const name = ref("");
    const mobile = ref("");
    const password = ref("");
    const user_type = ref("");
    const access = ref([]);
    const selectedOperator = ref();
    const errors = ref({});
    const loading = ref(false);
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");

    watch(
      () => props.users,
      (newVal) => (localUsers.value = newVal)
    );

    const validateForm = () => {
      errors.value = {};
      if (!name.value) errors.value.name = "وارد کردن نام الزامی می باشد";
      if (!mobile.value)
        errors.value.mobile = "وارد کردن شماره موبایل الزامی می باشد";
      if (!password.value)
        errors.value.password = "وارد کردن رمز عبور الزامی است";
      if (!user_type.value)
        errors.value.user_type = "انتخاب نوع کاربر الزامی است";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const toggleAccess = (permission) => {
      if (access.value.includes(permission)) {
        access.value = access.value.filter((item) => item !== permission);
      } else {
        access.value.push(permission);
      }
    };

    const addUser = async () => {
      if (!validateForm()) return;
      loading.value = true;

      try {
        const formData = new FormData();
        formData.append("name", name.value);
        formData.append("mobile", mobile.value);
        formData.append("password", password.value);
        formData.append("role", user_type.value);
        formData.append("get_sms", 1);
        if(selectedOperator.value){
          formData.append("manager_id", selectedOperator.value );
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
        console.log(response);

        if (response.data.status == true) {
          toast.success("کاربر با موفقیت اضافه شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("user-updated"),
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "خطا",
            text: "افزودن کاربر با مشکل مواجه شد. لطفا دوباره امتحان کنید.",
          });
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: `افزودن کاربر با مشکل مواجه شد: ${error.response.data.message}`,
        });
      } finally {
        loading.value = false;
      }
    };

    const filteredUsers = computed(() => {
      if (!UserSearchQuery.value) return localUsers.value; // Return all users if search query is empty
      return localUsers.value.filter((user) =>
        user.name.toLowerCase().includes(UserSearchQuery.value.toLowerCase())
      );
    });

    return {
      name,
      mobile,
      password,
      user_type,
      errors,
      loading,
      clearError,
      addUser,
      toggleAccess,
      access,
      localUsers,
      UserSearchQuery,
      filteredUsers,
      selectedOperator,
    };
  },
};
</script>

<style scoped>
.profile-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-upload-icon {
  font-size: 64px;
  color: #6c757d;
  border: 2px dashed #6c757d;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.modal-dialog {
  max-width: 50%;
}

.modal-content {
  padding: 20px;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.input-group {
  margin-top: 0.5rem;
}
.profile-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-upload-btn {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #007bff;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-upload-btn i {
  font-size: 20px;
  color: #007bff;
}

.profile-image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-placeholder {
  border: 2px dashed #007bff;
}

.d-none {
  display: none;
}
.profile-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-upload-btn {
  width: 30px; /* اندازه دکمه را کوچک‌تر کنید */
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc; /* کمی خط دور دکمه برای بهتر دیده شدن */
  background-color: #fff;
  cursor: pointer;
}

.profile-upload-btn i {
  font-size: 16px; /* اندازه آیکون را کوچک‌تر کنید */
  color: #007bff; /* رنگ آیکون را تغییر دهید */
}

.profile-image-preview img,
.profile-placeholder {
  width: 80px;
  height: 80px;
}

.profile-placeholder i {
  font-size: 40px;
}
.modal-dialog {
  max-width: 50%;
}

.modal-content {
  padding: 1.5rem; /* Increased padding for better spacing */
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1rem; /* Added padding-bottom to separate the header from the content */
}

.modal-body {
  padding: 1rem 1.5rem; /* Adjusted padding for a more balanced layout */
}

.form-group {
  margin-bottom: 1.5rem; /* Increased margin between form groups */
}

.input-group {
  margin-top: 0.5rem;
}

.profile-image-preview:hover .overlay {
  opacity: 1;
}

.profile-image-preview:hover img,
.profile-image-preview:hover .profile-placeholder {
  opacity: 0.7;
}
</style>
