<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/layout/custom.vue";
import moment from "jalali-moment";
import DatePicker from "vue3-persian-datetime-picker";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
  name: "SAMPLE-PAGE",
  components: {
    Layout,
    DatePicker,

  },
  setup() {
    const loading = ref(false);
    const selectedUsers = ref([]);
    const shit = ref();
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const route = useRoute();
    const meetData = ref();
    const subject = ref(null);
    const allSubjects = ref();
    const allLocations = ref();
    const location = ref();
    const description = ref("");
    const meetingDate = ref(null);
    const startTime = ref(null);
    const endTime = ref(null);
    const managers = ref();
    const selectedManager = ref();
    const CurrentManagerName = ref();
    const users = ref();
    const selectedUsersId = ref([]);
    const visitorName = ref();
    const visitorRole = ref();
    const visitorMobile = ref();
    const visitorCompany = ref();
    const errors = ref({});

    // Participants state

    const convertToJalali = (date) => {
      return moment(date, "YYYY-MM-DD HH:mm:ss")
        .locale("fa")
        .format("YYYY/MM/DD");
    };

    const getSubjects = () => {
      axios
        .get(`${url}/admin/subjects`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          allSubjects.value = resp.data;
        });
    };

    const getMeet = () => {
      axios
        .get(`${url}/private-meeting/${route.params.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          console.log(resp);
          meetData.value = resp.data;
          subject.value = resp.data?.subject_id;
          location.value = resp.data?.locations_id;
          description.value = resp.data?.description;
          meetingDate.value = moment(resp.data.date_meeting).format(
            "jYYYY/jMM/jDD"
          );
          startTime.value = resp.data?.az_hour;
          endTime.value = resp.data?.ta_hour;

          selectedManager.value = resp.data?.manager_id;
          CurrentManagerName.value = resp.data?.manager?.name;

          visitorName.value = resp.data?.visit_name;
          visitorMobile.value = resp.data?.visit_mobile;
          visitorRole.value = resp.data?.visit_role;
          visitorCompany.value = resp.data?.visit_company;
        });
    };

    const getLocations = () => {
      axios
        .get(`${url}/admin/locations`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          allLocations.value = resp.data;
        });
    };

    const getManagers = () => {
      axios
        .get(`${url}/meeting-manager`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          managers.value = resp.data;
        });
    };

    const getUsers = () => {
      axios
        .get(`${url}/admin/users?is_active=1`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          console.log(resp);
          users.value = resp.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    };

    const validateForm = () => {
      errors.value = {};
      if (!subject.value)
        errors.value.subject = "لطفا موضوع ملاقات را انتخاب نمایید";
      if (!location.value)
        errors.value.location = "لطفا موقعیت ملاقات را انتخاب نمایید";
      if (!meetingDate.value)
        errors.value.meetingDate = "لطفا تاریخ ملاقات را انتخاب نمایید";
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

      if (selectedManager.value.length === 0)
        errors.value.selectedManager = "یک مدیر برای ملاقات انتخاب کنید";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const editMeet = () => {
      if (!validateForm()) return;
      loading.value = true;
      const fd = new FormData();

      fd.append("locations_id", location.value);
      fd.append("subject_id", subject.value);
      fd.append("manager_id", selectedManager.value);
      fd.append("az_hour", startTime.value);
      fd.append("ta_hour", endTime.value);
      fd.append("date_meeting", meetingDate.value);
      fd.append("visit_name", visitorName.value);
      fd.append("visit_mobile", visitorMobile.value);
      fd.append("visit_role", visitorRole.value);
      fd.append("visit_company", visitorCompany.value);
      fd.append("id", route.params.id);

      axios
        .post(`${url}/admin/edit-private-meeting`, fd, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          console.log(resp);
          loading.value = false;
          toast.success("ملاقات با موفقیت ویرایش شد!", {
            position: "top-right",
            autoClose: 1000,
          });
        }).catch(()=>{
            loading.value = false;
            toast.error("ویرایش ملاقات با مشکل مواجه شد!", {
            position: "top-right",
            autoClose: 1000,
          })
        })
    };

    onMounted(() => {
      getSubjects();
      getMeet();
      getLocations();
      getManagers();
      getUsers();
    });

    return {
      subject,
      location,
      description,
      meetingDate,
      startTime,
      endTime,
      selectedManager,
      managers,
      shit,
      meetData,
      convertToJalali,
      allSubjects,
      allLocations,
      users,
      selectedUsers,
      selectedUsersId,
      CurrentManagerName,
      editMeet,
      loading,
      visitorName,
      visitorMobile,
      visitorRole,
      visitorCompany,
      validateForm,
      clearError,
      errors,
    };
  },
};
</script>

<template>
  <Layout>
    <BRow>
      <BCol sm="12">
        <BCard class="border-primary shadow-sm">
          <BCardHeader class="bg-primary text-white text-center">
            <h5>ویرایش ملاقات</h5>
          </BCardHeader>
          <BCardBody>
            <BRow class="mb-3">
              <BCol sm="12" class="text-center">
                <div>
                  <span class="font-weight-bold">وضعیت: </span>
                  <span
                    class="text-danger"
                    v-if="meetData?.status_txt === 'لغو شده'"
                    >لغو شده</span
                  >
                  <span
                    class="text-warning"
                    v-if="meetData?.status_txt === 'منتظر برگزاری'"
                    >منتظر برگزاری</span
                  >
                  <span
                    class="text-success"
                    v-if="meetData?.status_txt === 'برگزار شده'"
                    >برگزار شده</span
                  >
                  <span
                    class="text-info"
                    v-if="meetData?.status_txt === 'موکول شده'"
                    >موکول شده</span
                  >
                </div>
              </BCol>
            </BRow>

            <BCard>
              <BRow>
                <BCol sm="12" md="6" class="mb-3">
                  <label for="subject">موضوع ملاقات</label>
                  <BFormSelect
                    id="subject"
                    v-model="subject"
                    class="border-info"
                  >
                    <option
                      v-for="subject in allSubjects"
                      :key="subject.id"
                      :value="subject.id"
                    >
                      {{ subject.subject }}
                    </option>
                  </BFormSelect>
                </BCol>

                <BCol sm="12" md="6" class="mb-3">
                  <label for="address">محل ملاقات</label>
                  <BFormSelect
                    id="address"
                    v-model="location"
                    class="border-info"
                  >
                    <option
                      v-for="location in allLocations"
                      :key="location.id"
                      :value="location.id"
                    >
                      {{ location.address }}
                    </option>
                  </BFormSelect>
                </BCol>
              </BRow>

              <!-- Description Field -->
              <BRow class="mb-3">
                <BCol sm="12">
                  <label for="description">توضیحات ملاقات</label>
                  <BFormTextarea
                    id="description"
                    v-model="description"
                    rows="4"
                    class="border-info"
                  />
                </BCol>
              </BRow>
            </BCard>

            <BCard>
              <BRow>
                <!-- Meeting Date Field -->
                <BCol sm="12" md="6" class="mb-3">
                  <label for="meetingDate">تاریخ ملاقات</label>
                  <DatePicker
                    v-model="meetingDate"
                    type="date"
                    color="blue"
                    :input-class="'form-control shadow-sm'"
                    id="meetingDate"
                  />
                </BCol>

                <!-- Start Time Field -->
                <BCol sm="12" md="3" class="mb-3">
                  <label for="startTime">زمان شروع</label>
                  <DatePicker
                    v-model="startTime"
                    format="HH:mm"
                    display-format="HH:mm"
                    :auto-submit="true"
                    id="startTime"
                    type="time"
                  />
                </BCol>

                <!-- End Time Field -->
                <BCol sm="12" md="3" class="mb-3">
                  <label for="endTime">زمان پایان</label>
                  <DatePicker
                    v-model="endTime"
                    format="HH:mm"
                    display-format="HH:mm"
                    :auto-submit="true"
                    id="endTime"
                    type="time"
                  />
                </BCol>
              </BRow>
            </BCard>

            <BCard>
              <BCol sm="12">
                <h4 class="font-weight-bold mb-3">انتخاب مدیر جدید:</h4>

                <!-- Current Manager Header -->
                <div v-if="selectedManager" class="mb-3">
                  <h6 class="font-weight-bold">
                    مدیر فعلی:
                    <span>{{ CurrentManagerName }}</span>
                  </h6>
                </div>

                <!-- Search Bar -->
                <BFormGroup>
                  <BFormInput
                    v-model="searchTerm"
                    placeholder="جستجوی مدیران"
                    class="mb-3"
                  />
                </BFormGroup>

                <!-- Manager Selection -->
                <BFormGroup>
                  <BFormRadioGroup
                    v-model="selectedManager"
                    name="managerRadios"
                  >
                    <BRow class="g-3">
                      <BCol
                        v-for="manager in managers"
                        :key="manager.id"
                        sm="6"
                        md="2"
                      >
                        <BFormRadio
                          :value="manager.id"
                          class="manager-card d-flex flex-column align-items-center border p-3 rounded shadow-sm transition-all hover:shadow-lg"
                        >
                          <i
                            class="fas fa-user-circle text-primary mb-2"
                            style="font-size: 1.5rem"
                          ></i>
                          <div class="text-center">
                            <strong>{{ manager.name }}</strong>
                          </div>
                        </BFormRadio>
                      </BCol>
                    </BRow>
                  </BFormRadioGroup>
                </BFormGroup>
              </BCol>
            </BCard>

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
                      <small v-if="errors.visitorName" class="text-danger mt-2">
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
                      <small v-if="errors.visitorRole" class="text-danger mt-2">
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

            <!-- Save Button -->
            <BRow class="mt-4">
              <BCol class="text-center">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                  @click="editMeet"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span v-if="!loading">ذخیره تغییرات</span>
                </button>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<style scoped>
label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: inline-block;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mb-3 {
  margin-bottom: 1.5rem;
}
.text-center {
  text-align: center;
}
.border-info {
  border: 1px solid #007bff !important; /* Blue border for emphasis */
  border-radius: 4px; /* Rounded corners */
}
.bg-primary {
  background-color: #007bff !important; /* Primary background color */
}
.text-white {
  color: white !important; /* White text color */
}
.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important; /* Small shadow effect */
}
.hover\:scale-105:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
.text-danger {
  color: #dc3545; /* Red color for cancelled */
}

.text-warning {
  color: #ffc107; /* Yellow color for pending */
}

.text-success {
  color: #28a745; /* Green color for completed */
}

.text-info {
  color: #17a2b8; /* Blue color for postponed */
}
.manager-card {
  background-color: #ffffff; /* White background for a clean look */
  border: 2px solid #e0e0e0; /* Subtle border */
  transition: all 0.3s ease; /* Smooth transition for hover effects */
  text-align: center; /* Center text for alignment */
  height: 100%; /* Ensure all cards are the same height */
}

.manager-card:hover {
  background-color: #f0f8ff; /* Light blue background on hover */
  border-color: #007bff; /* Highlight border color on hover */
  transform: translateY(-3px); /* Lift effect on hover */
}

.manager-card i {
  color: #007bff; /* Primary color for the icon */
}

.manager-card strong {
  font-size: 1.1rem; /* Font size for names */
}

.manager-card span {
  font-size: 0.9rem; /* Font size for mobile number */
}

.manager-card:hover strong {
  color: #0056b3; /* Darker color for name on hover */
}
</style>
