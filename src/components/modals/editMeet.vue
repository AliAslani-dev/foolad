<template>
  <div
    class="modal fade"
    id="editMeet"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header bg-primary text-white rounded-top">
          <h5 class="modal-title d-flex align-items-center">
            <i class="fas fa-calendar-plus me-2"></i>
            ویرایش جلسه
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <BCard>
          <div class="modal-body p-4">
            <form @submit.prevent="addMeeting">
              <BRow class="g-4">
                <!-- Adjusted spacing for rows -->
                <!-- انتخاب موضوع جلسه -->
                <BCol md="12">
                  <div class="form-group">
                    <label class="form-label">
                      موضوع جلسه را انتخاب کنید
                    </label>
                    <BFormSelect
                      @change="clearError('selectedSubject')"
                      v-model="selectedSubject"
                      class="form-control shadow-sm"
                    >
                      <option
                        v-for="subject in localSubjects"
                        :key="subject.id"
                        :value="subject.id"
                      >
                        {{ subject?.subject }}
                      </option>
                    </BFormSelect>
                    <small v-if="errors.selectedSubject" class="text-danger">
                      {{ errors.selectedSubject }}
                    </small>
                  </div>
                </BCol>

                <!-- موقعیت -->

                <BCol md="12">
                  <div class="form-group">
                    <label class="form-label">
                      موقعیت جلسه را انتخاب کنید
                    </label>
                    <BFormSelect
                      @change="clearError('selectedLocation')"
                      v-model="selectedLocation"
                      class="form-control shadow-sm"
                    >
                      <option
                        v-for="location in localLocations"
                        :key="location.id"
                        :value="location.id"
                      >
                        {{ location?.address }}
                      </option>
                    </BFormSelect>
                    <small v-if="errors.selectedLocation" class="text-danger">
                      {{ errors.selectedLocation }}
                    </small>
                  </div>
                </BCol>

                <!-- ورودی تاریخ -->
                <BCol md="12">
                  <div class="form-group">
                    <label class="form-label">
                      تاریخ جلسه را انتخاب کنید
                    </label>
                    <DatePicker
                      @change="clearError('selectedDate')"
                      v-model="selectedDate"
                      mode="single"
                      type="date"
                      color="blue"
                      :input-class="'form-control shadow-sm'"
                    />
                    <small v-if="errors.selectedDate" class="text-danger">
                      {{ errors.selectedDate }}
                    </small>
                  </div>
                </BCol>

                <!-- زمان شروع -->
                <BCol md="6">
                  <div class="form-group">
                    <label class="form-label"> زمان شروع </label>
                    <DatePicker
                      @change="clearError('startTime')"
                      v-model="startTime"
                      type="time"
                      color="blue"
                      :input-class="'form-control shadow-sm'"
                    />
                    <small v-if="errors.startTime" class="text-danger">
                      {{ errors.startTime }}
                    </small>
                  </div>
                </BCol>

                <!-- تاریخ پایان -->
                <BCol md="6">
                  <div class="form-group">
                    <label class="form-label"> زمان پایان </label>
                    <DatePicker
                      @change="clearError('endTime')"
                      v-model="endTime"
                      type="time"
                      color="blue"
                      :input-class="'form-control shadow-sm'"
                    />
                    <small v-if="errors.endTime" class="text-danger">
                      {{ errors.endTime }}
                    </small>
                  </div>
                </BCol>

                <!-- شرکت کنندگان -->
                <BCol md="12">
                  <BCard>
                    <BCardBody>
                      <label class="checkbox-label"
                        >شرکت کنندگان را انتخاب کنید</label
                      >

                      <div class="user-checkbox-list">
                        <small v-if="errors.selectedUsers" class="text-danger">
                          {{ errors.selectedUsers }}
                        </small>
                        <div class="row checkbox-container">
                          <BCol
                            v-for="user in localUsers"
                            :key="user.id"
                            md="4"
                          >
                            <BFormCheckbox
                              @change="clearError('selectedUsers')"
                              v-model="selectedUsers"
                              :value="user.id"
                              class="checkbox-item"
                            >
                              <strong>{{ user.name }}</strong>
                            </BFormCheckbox>
                          </BCol>
                        </div>
                      </div>
                    </BCardBody>
                  </BCard>
                </BCol>

                <!-- مدیران -->
                <BCol md="12">
                  <BCard>
                    <BCardBody>
                      <label class="checkbox-label"
                        >مدیر جلسه را انتخاب کنید</label
                      >
                      <div class="user-checkbox-list">
                        <small
                          v-if="errors.selectedManegers"
                          class="text-danger"
                        >
                          {{ errors.selectedManegers }}
                        </small>
                        <div class="row checkbox-container">
                          <BCol
                            v-for="manager in localManagers"
                            :key="manager.id"
                            md="4"
                          >
                            <BFormRadio
                              @change="clearError('selectedManegers')"
                              v-model="selectedManegers"
                              :value="manager.id"
                              class="checkbox-item"
                            >
                              <strong>{{ manager.name }}</strong>
                            </BFormRadio>
                          </BCol>
                        </div>
                      </div>
                    </BCardBody>
                  </BCard>
                </BCol>
              </BRow>

              <!-- دکمه‌های ارسال -->
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
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
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
        </BCard>
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
      if (!Password.value)
        errors.value.password = "وارد کردن رمز عبور الزامی است";
      if (!localRole.value)
        errors.value.localRole = "انتخاب نوع کاربر الزامی است";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const toggleAccess = (permission) => {
      if (localAccess.value.includes(permission)) {
        localAccess.value = localAccess.value.filter(
          (item) => item !== permission
        );
      } else {
        localAccess.value.push(permission);
      }
    };

    const editUser = async () => {
      if (!validateForm()) return;
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append("name", localName.value);
        formData.append("mobile", localMobile.value);
        formData.append("password", Password.value);
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
          toast.success("کاربر با موفقیت اضافه شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("user-updated"),
          });
        } else {
          toast.error("افزودن  کاربر با مشکل مواجه شد!", {
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
