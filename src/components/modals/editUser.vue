<template>
  <div
    class="modal fade"
    id="editUser"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">ویرایش کردن کاربر</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editUser">
            <BRow class="g-3">
              <!-- Form fields -->
              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">نام </label>
                  <input
                    v-model="localName"
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
                    v-model="localMobile"
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
                      v-if="localRole != 0"
                      class="form-select"
                      v-model="localRole"
                      @change="clearError('role')"
                    >
                      <option disabled value="">نوع کاربر</option>
                      <option value="1">کاربر</option>
                      <option value="2">اپراتور</option>
                    </select>
                    <select
                      v-else-if="localRole == 0"
                      class="form-select"
                      v-model="localRole"
                      @change="clearError('role')"
                    >
                      <option disabled value="">نوع کاربر</option>
                      <option value="1">کاربر</option>
                      <option value="2">اپراتور</option>
                      <option value="0">مدیر</option>
                    </select>
                  </div>
                  <small v-if="errors.role" class="text-danger">{{
                    errors.role
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
                      v-model="Password"
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

            <BCard v-if="localRole == `2`" class="p-4">
              <!-- Access Checkboxes -->
              <BRow class="g-3 justify-content-center">
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="localAccess?.includes('user')"
                    @change="toggleAccess('user')"
                    >دسترسی به کاربران</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="localAccess?.includes('subjects')"
                    @change="toggleAccess('subjects')"
                    >دسترسی به موضوع ها</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="localAccess?.includes('locations')"
                    @change="toggleAccess('locations')"
                    >دسترسی به موقعیت ها</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="localAccess?.includes('meeting')"
                    @change="toggleAccess('meeting')"
                    >دسترسی به جلسات</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="localAccess?.includes('private_meeting')"
                    @change="toggleAccess('private_meeting')"
                    >دسترسی به جلسات شخصی</BFormCheckbox
                  >
                </BCol>
                <BCol cols="6" class="d-flex">
                  <BFormCheckbox
                    class="ml-3"
                    :checked="localAccess?.includes('note')"
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
import { ref, watch, toRef } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "vue3-toastify";

export default {
  props: {
    mobile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    access: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const localName = toRef(props.name);
    const localMobile = toRef(props.mobile);
    const Password = toRef(props.password);
    const localRole = toRef(props.role);
    const localAccess = toRef(props.access);
    const localId = toRef(props.id);
    // Watch for prop changes to update local state
    watch(
      () => props.name,
      (newVal) => (localName.value = newVal)
    );
    watch(
      () => props.mobile,
      (newVal) => (localMobile.value = newVal)
    );
    watch(
      () => props.role,
      (newVal) => (localRole.value = newVal)
    );
    watch(
      () => props.access,
      (newVal) => (localAccess.value = newVal)
    );
    watch(
      () => props.id,
      (newVal) => (localId.value = newVal)
    );

    const errors = ref({});
    const loading = ref(false);
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");

    const validateForm = () => {
      errors.value = {};
      if (!localName.value)
        errors.value.localName = "وارد کردن نام الزامی می باشد";
      if (!localMobile.value)
        errors.value.localMobile = "وارد کردن شماره موبایل الزامی می باشد";
      // if (!Password.value)
      //   errors.value.password = "وارد کردن رمز عبور الزامی است";
      if (!localRole.value)
        errors.value.localRole = "انتخاب نوع کاربر الزامی است";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const toggleAccess = (permission) => {
      if (!Array.isArray(localAccess.value)) {
        localAccess.value = [];
      }

      if (localAccess.value.includes(permission)) {
        localAccess.value = localAccess.value.filter(
          (item) => item !== permission
        );
      } else {
        localAccess.value = [...localAccess.value, permission];
      }
    };

    const editUser = async () => {
      if (!validateForm()) return;
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append("name", localName.value);
        formData.append("mobile", localMobile.value);
        if (Password.value) {
          formData.append("password", Password.value);
        }

        formData.append("role", localRole.value);
        formData.append("id", localId.value);
        localAccess.value.forEach((item) => {
          formData.append("access[]", item);
        });
        const response = await axios.post(`${url}/admin/edit-user`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        });
        console.log(response);

        if (response.data.status == true) {
          toast.success("کاربر با موفقیت ویرایش شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("user-updated"),
          });
        } else {
          toast.error("ویرایش کاربر با مشکل مواجه شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("user-updated"),
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

    return {
      localName,
      localMobile,
      Password,
      localRole,
      localAccess,
      errors,
      loading,
      clearError,
      editUser,
      toggleAccess,
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
