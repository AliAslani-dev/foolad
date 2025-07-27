<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/layout/custom.vue";
import moment from "jalali-moment";
import DatePicker from "vue3-persian-datetime-picker";
import axios from "axios";

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
        .get(`${url}/meeting/${route.params.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          meetData.value = resp.data.date_meeting;
          subject.value = resp.data.subject?.id;
          location.value = resp.data.location.id;
          description.value = resp.data?.description;
          meetingDate.value = moment(resp.data.date_meeting).format(
            "jYYYY/jMM/jDD"
          );
          startTime.value = resp.data?.az_hour;
          endTime.value = resp.data?.ta_hour;

          selectedManager.value = resp.data?.manager?.id;
          CurrentManagerName.value = resp.data?.manager?.name;
          selectedUsers.value = resp.data?.users;
          selectedUsers.value.map((selected) => {
            selectedUsersId.value.push(selected.id);
          });
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

    const editMeet = () => {
      loading.value = true;
      const fd = new FormData();

      fd.append("locations_id", location.value);
      fd.append("subject_id", subject.value);
      fd.append("manager_id", selectedManager.value);
      fd.append("az_hour", startTime.value);
      fd.append("ta_hour", endTime.value);
      fd.append("date_meeting", meetingDate.value); // Use the formatted Jalali date
      fd.append("id", route.params.id);

      selectedUsersId.value.forEach((user) => {
        fd.append("members[]", user);
      });

      axios
        .post(`${url}/admin/edit-meeting`, fd, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          console.log(resp);
          loading.value = false;
        });
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
            <h5>ویرایش جلسه</h5>
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
                  <label for="subject">موضوع جلسه</label>
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
                  <label for="address">محل جلسه</label>
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
                  <label for="description">توضیحات جلسه</label>
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
                  <label for="meetingDate">تاریخ جلسه</label>
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

            <BCard>
              <BRow>
                <!-- Participants Selection -->
                <BCol sm="12">
                  <label class="font-weight-bold">شرکت کنندگان جلسه:</label>
                  <BFormGroup>
                    <div class="border p-3 rounded shadow-sm">
                      <BRow>
                        <BCol
                          v-for="user in users"
                          :key="user.id"
                          sm="6"
                          md="3"
                          class="mb-2"
                        >
                          <BFormCheckbox
                            v-model="selectedUsersId"
                            :value="user.id"
                          >
                            <i class="fas fa-user-check mr-2 text-success"></i>
                            {{ user.name }}
                          </BFormCheckbox>
                        </BCol>
                      </BRow>
                    </div>
                  </BFormGroup>
                </BCol>
              </BRow>
            </BCard>

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
