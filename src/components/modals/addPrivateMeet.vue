<template>
  <div
    class="modal fade"
    id="addPrivateMeet"
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
            اضافه کردن ملاقات جدید
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
                <!-- انتخاب موضوع ملاقات -->
                <BCol md="12">
                  <div class="form-group">
                    <label class="form-label">
                      موضوع ملاقات را انتخاب کنید
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
                      موقعیت ملاقات را انتخاب کنید
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
                      تاریخ ملاقات را انتخاب کنید
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

                <!--  اطلالعات ملاقات کننده  -->
                <BCol md="12">
                  <BCard class="shadow rounded">
                    <BCardBody>
                      <h4 class="checkbox-label mb-4 text-center text-primary">
                        <i class="ph-duotone ph-user-plus me-2"></i>
                        اطلاعات ملاقات کننده را وارد کنید
                      </h4>

                      <BRow>
                        <BCol md="6" class="mb-4">
                          <label for="userName" class="form-label fw-bold"
                            >نام کاربر</label
                          >
                          <div class="input-group">
                            <span class="input-group-text bg-light">
                              <i class="ph-duotone ph-user"></i>
                            </span>
                            <input
                              @input="clearError('visitorName')"
                              type="text"
                              id="userName"
                              v-model="visitorName"
                              class="form-control border-0 rounded-pill shadow-sm"
                              placeholder="نام کاربر را وارد کنید"
                            />
                          </div>
                          <small
                            v-if="errors.visitorName"
                            class="text-danger mt-2"
                          >
                            {{ errors.visitorName }}
                          </small>
                        </BCol>

                        <BCol md="6" class="mb-4">
                          <label for="userMobile" class="form-label fw-bold"
                            >شماره موبایل</label
                          >
                          <div class="input-group">
                            <span class="input-group-text bg-light">
                              <i class="ph-duotone ph-phone"></i>
                            </span>
                            <input
                              @input="clearError('visitorMobile')"
                              type="text"
                              id="userMobile"
                              v-model="visitorMobile"
                              class="form-control border-0 rounded-pill shadow-sm"
                              placeholder="شماره موبایل را وارد کنید"
                            />
                          </div>
                          <small
                            v-if="errors.visitorMobile"
                            class="text-danger mt-2"
                          >
                            {{ errors.visitorMobile }}
                          </small>
                        </BCol>

                        <BCol md="6" class="mb-4">
                          <label for="userRole" class="form-label fw-bold"
                            >نقش کاربر</label
                          >
                          <div class="input-group">
                            <span class="input-group-text bg-light">
                              <i class="ph-duotone ph-briefcase"></i>
                            </span>
                            <input
                              @input="clearError('visitorRole')"
                              type="text"
                              id="userRole"
                              v-model="visitorRole"
                              class="form-control border-0 rounded-pill shadow-sm"
                              placeholder="نقش کاربر را وارد کنید"
                            />
                          </div>
                          <small
                            v-if="errors.visitorRole"
                            class="text-danger mt-2"
                          >
                            {{ errors.visitorRole }}
                          </small>
                        </BCol>

                        <BCol md="6" class="mb-4">
                          <label for="userCompany" class="form-label fw-bold"
                            >شرکت کاربر</label
                          >
                          <div class="input-group">
                            <span class="input-group-text bg-light">
                              <i class="ph-duotone ph-users"></i>
                            </span>
                            <input
                              @input="clearError('visitorCompany')"
                              type="text"
                              id="userCompany"
                              v-model="visitorCompany"
                              class="form-control border-0 rounded-pill shadow-sm"
                              placeholder="شرکت کاربر را وارد کنید"
                            />
                          </div>
                          <small
                            v-if="errors.visitorCompany"
                            class="text-danger mt-2"
                          >
                            {{ errors.visitorCompany }}
                          </small>
                        </BCol>
                      </BRow>
                    </BCardBody>
                  </BCard>
                </BCol>

                <!-- مدیران -->
                <BCol md="12">
                  <BCard class="shadow rounded">
                    <BCardBody>
                      <h4 class="checkbox-label">مدیر ملاقات را انتخاب کنید</h4>
                      <BFormInput
                        placeholder="جستجوی  مدیر..."
                        class="search-input"
                        v-model="managerSearchquery"
                      />
                      <div class="user-checkbox-list">
                        <div class="row checkbox-container">
                          <BCol
                            v-for="manager in filteredManagers"
                            :key="manager.id"
                            class="mb-3"
                            md="4"
                          >
                            <BFormRadio
                              @change="clearError('selectedManegers')"
                              v-model="selectedManegers"
                              :value="manager.id"
                              class="checkbox-item custom-checkbox"
                            >
                              {{ manager.name }}
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
import { ref, toRef, watch, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import DatePicker from "vue3-persian-datetime-picker";

export default {
  components: {
    DatePicker,
  },
  props: {
    subjects: {
      type: Array,
      required: true,
    },
    locations: {
      type: Array,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
    managers: {
      type: Array,
      required: true,
    },
  },

  setup(props, { emit }) {
    const startTime = ref();
    const endTime = ref();
    const localManagers = toRef(props.managers);
    const selectedManegers = ref([]);
    const selectedDate = ref(null);
    const selectedSubject = ref("");
    const selectedLocation = ref("");
    const localSubjects = toRef(props.subjects);
    const localLocations = toRef(props.locations);
    const localUsers = toRef(props.users);
    const selectedUsers = ref([]);
    const UserSearchQuery = ref();
    const managerSearchquery = ref();
    const errors = ref({});
    const loading = ref(false);
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");
    const visitorName = ref();
    const visitorMobile = ref();
    const visitorRole = ref();
    const visitorCompany = ref();

    watch(
      () => props.subjects,
      (newVal) => (localSubjects.value = newVal)
    );

    watch(
      () => props.locations,
      (newVal) => (localLocations.value = newVal)
    );

    watch(
      () => props.users,
      (newVal) => (localUsers.value = newVal)
    );

    watch(
      () => props.managers,
      (newVal) => (localManagers.value = newVal)
    );

    const validateForm = () => {
      errors.value = {};
      if (!selectedSubject.value)
        errors.value.selectedSubject = "لطفا موضوع ملاقات را انتخاب نمایید";
      if (!selectedLocation.value)
        errors.value.selectedLocation = "لطفا موقعیت ملاقات را انتخاب نمایید";
      if (!selectedDate.value)
        errors.value.selectedDate = "لطفا تاریخ ملاقات را انتخاب نمایید";
      if (!startTime.value)
        errors.value.startTime = "لطفا زمان شروع  ملاقات را انتخاب نمایید";
      if (!endTime.value)
        errors.value.endTime = "لطفا زمان پایان  ملاقات را انتخاب نمایید";
      if (!visitorName.value)
        errors.value.visitorName = "لطفا نام ملاقات کننده را وارد نمایید";

      if (!visitorMobile.value)
        errors.value.visitorMobile =
          "لطفا شماره تماس ملاقات کننده را وارد نمایید";

      if (!visitorRole.value)
        errors.value.visitorRole = "لطفا نقش ملاقات کننده را وارد نمایید";

      if (!visitorCompany.value)
        errors.value.visitorCompany =
          "لطفا نام شرکت ملاقات کننده را وارد نمایید";

      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const addMeeting = () => {
      if (!validateForm()) return;
      loading.value = true;

      const formData = new FormData();
      formData.append("locations_id", selectedLocation.value);
      formData.append("subject_id", selectedSubject.value);
      if (selectedManegers.value) {
        formData.append("manager_id", selectedManegers.value);
      }
      formData.append("az_hour", startTime.value);
      formData.append("ta_hour", endTime.value);
      formData.append("date_meeting", selectedDate.value);
      formData.append("visit_name", visitorName.value);
      formData.append("visit_mobile", visitorMobile.value);
      formData.append("visit_role", visitorRole.value);
      formData.append("visit_company", visitorCompany.value);

      console.log(formData);
      axios
        .post(`${url}/admin/add-private-meeting`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          loading.value = false;
          console.log(resp);
          toast.success("ملاقات با موفقیت اضافه شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("meet-updated"),
          });
        })
        .catch((error) => {
          loading.value = false;
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "خطا",
            text: `افزودن ملاقات با مشکل مواجه شد: ${
              error.response?.data?.message || "خطای غیرمنتظره رخ داد."
            }`,
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const filteredUsers = computed(() => {
      if (!UserSearchQuery.value) return localUsers.value; // Return all users if search query is empty
      return localUsers.value.filter((user) =>
        user.name.toLowerCase().includes(UserSearchQuery.value.toLowerCase())
      );
    });

    const filteredManagers = computed(() => {
      if (!managerSearchquery.value) return localManagers.value; // Return all users if search query is empty
      return localManagers.value.filter((manager) =>
        manager.name
          .toLowerCase()
          .includes(managerSearchquery.value.toLowerCase())
      );
    });

    return {
      errors,
      loading,
      clearError,
      addMeeting,
      localSubjects,
      selectedSubject,
      selectedDate,
      localLocations,
      selectedLocation,
      localUsers,
      selectedUsers,
      localManagers,
      selectedManegers,
      startTime,
      endTime,
      UserSearchQuery,
      filteredUsers,
      managerSearchquery,
      filteredManagers,
      visitorName,
      visitorMobile,
      visitorCompany,
      visitorRole,
    };
  },
};
</script>

<style scoped>
.modal-header {
  background: linear-gradient(
    90deg,
    rgb(105, 123, 255) 0%,
    rgb(106, 138, 243) 100%
  );
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1.5rem; /* Increased margin for better spacing */
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Subtle shadow for inputs */
}

.btn {
  transition: all 0.3s ease; /* Smooth transition for buttons */
}
.user-checkbox-list {
  margin-top: 16px;
  background-color: #f8f9fa; /* Light background for better contrast */
  border: 1px solid #ced4da; /* Border for definition */
  border-radius: 8px; /* Rounded corners */
  padding: 16px; /* Padding for spacing */
}

.checkbox-label {
  font-weight: bold;
  margin-bottom: 12px; /* Spacing between label and checkboxes */
}

.checkbox-container {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping of checkboxes */
}

.checkbox-item {
  margin-bottom: 10px; /* Spacing between checkboxes */
  background: #ffffff; /* White background for checkboxes */
  border-radius: 4px; /* Rounded corners for checkboxes */
  transition: background-color 0.2s ease; /* Smooth transition */
}

.checkbox-item:hover {
  background-color: #e9ecef; /* Light hover effect */
}

.checkbox-label {
  font-size: 1.5rem; /* Increased font size */
  font-weight: 600; /* Bold text */
  margin-bottom: 1rem; /* Spacing below the label */
  color: #343a40; /* Dark text color */
}

.search-input {
  border: 1px solid #ced4da; /* Subtle border */
  border-radius: 0.375rem; /* Rounded corners */
  padding: 0.5rem 1rem; /* Padding for better touch targets */
  margin-bottom: 1rem; /* Space below the input */
  transition: border-color 0.2s; /* Smooth border color transition */
}

.user-checkbox-list {
  max-height: 250px; /* Limit height */
  overflow-y: auto; /* Scrollable if content exceeds max height */
  border: 1px solid #e0e0e0; /* Border around the list */
  border-radius: 0.375rem; /* Rounded corners */
  background-color: #f9f9f9; /* Light background */
  padding: 1rem; /* Padding inside the list */
}

.checkbox-container {
  margin-bottom: 1rem; /* Space between checkbox rows */
}

.checkbox-item {
  display: flex; /* Flex layout for checkbox items */
  align-items: center; /* Center align items vertically */
  background: #fff; /* White background for checkbox items */
  padding: 0.5rem; /* Padding for each checkbox item */
  border-radius: 0.375rem; /* Rounded corners for checkbox items */
  transition: background-color 0.2s; /* Smooth background transition */
}

.checkbox-item:hover {
  background-color: #e9ecef; /* Light gray on hover */
}

.checkbox-item strong {
  margin-left: 0.5rem; /* Spacing between checkbox and text */
}

.text-danger {
  font-size: 0.875rem; /* Smaller font for error messages */
  margin-top: 0.5rem; /* Space above the error message */
}
</style>
