<script>
import Layout from "@/layout/custom.vue";
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import DatePicker from "vue3-persian-datetime-picker";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "SAMPLE-PAGE",
  components: {
    Layout,
    DatePicker,
  },
  setup() {
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const managerSearchquery = ref("");
    const startDate = ref();
    const endDate = ref();
    const status = ref();
    const subjects = ref([]);
    const locations = ref([]);
    const managers = ref([]);
    const selectedSubject = ref();
    const selectedManager = ref();
    const selectedLocation = ref();
    const loading = ref(false);

    const getSubjects = async () => {
      const resp = await axios.get(`${url}/admin/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      subjects.value = resp.data;
    };

    const getLocations = async () => {
      const resp = await axios.get(`${url}/admin/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      locations.value = resp.data;
    };

    const getManagers = async () => {
      const resp = await axios.get(`${url}/meeting-manager`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      managers.value = resp.data;
    };

    const filteredManagers = computed(() => {
      if (!managerSearchquery.value) return managers.value;
      return managers.value.filter((manager) =>
        manager.name
          .toLowerCase()
          .includes(managerSearchquery.value.toLowerCase())
      );
    });

    const getOutput = () => {
  loading.value = true;
  axios
    .get(
      `${url}/statistic?date_meeting_az=${
        startDate.value || ""
      }&date_meeting_ta=${endDate.value || ""}&location=${
        selectedLocation.value || ""
      }&subject=${selectedSubject.value || ""}&meeting_manager=${
        selectedManager.value || ""
      }&status=${status.value || ""}`,
      {
        responseType: "blob", // Set response type to blob
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      // Create a URL for the file and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.xlsx"); // Set the file name (you can change the extension as needed)
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.remove(); // Clean up the link element
      loading.value = false; // Stop loading
      toast.success("فایل خروجی با موفقیت دانلود شد!", {
        position: "top-right",
        autoClose: 1000,
      });
    })
    .catch(() => {
      loading.value = false;
      toast.error("مشکلی در دانلود!", {
        position: "top-right",
        autoClose: 1000,
      });
    });
};


    onMounted(() => {
      getSubjects();
      getLocations();
      getManagers();
    });

    return {
      subjects,
      locations,
      selectedSubject,
      selectedLocation,
      startDate,
      endDate,
      selectedManager,
      managerSearchquery,
      filteredManagers,
      status,
      getOutput,
      loading
    };
  },
};
</script>

<template>
  <Layout>
    <BRow>
      <BCol sm="12">
        <BCard class="shadow rounded-lg modern-card">
          <BCardHeader class="modern-header">
            <h5><i class="fas fa-file-alt me-2"></i>گزارشات</h5>
          </BCardHeader>
          <BCardBody>
            <BRow>
              <!-- Meeting Subject Selection -->
              <BCol class="mb-4" md="6">
                <div class="form-group modern-form-group">
                  <label class="floating-label">
                    <i class="fas fa-tasks me-2 text-info"></i>موضوع جلسه را
                    انتخاب کنید
                  </label>
                  <BFormSelect
                    v-model="selectedSubject"
                    class="modern-select shadow-sm"
                  >
                    <option
                      v-for="subject in subjects"
                      :key="subject.id"
                      :value="subject.id"
                    >
                      {{ subject?.subject }}
                    </option>
                  </BFormSelect>
                </div>
              </BCol>

              <!-- Meeting Location Selection -->
              <BCol class="mb-4" md="6">
                <div class="form-group modern-form-group">
                  <label class="floating-label">
                    <i class="fas fa-map-marker-alt me-2 text-success"></i
                    >موقعیت جلسه را انتخاب کنید
                  </label>
                  <BFormSelect
                    v-model="selectedLocation"
                    class="modern-select shadow-sm"
                  >
                    <option
                      v-for="location in locations"
                      :key="location.id"
                      :value="location.id"
                    >
                      {{ location?.address }}
                    </option>
                  </BFormSelect>
                </div>
              </BCol>

              <!-- Start Date Selection -->
              <BCol class="mb-4" md="6">
                <div class="form-group modern-form-group">
                  <label class="floating-label" style="margin-bottom: 3px">
                    از تاریخ
                  </label>
                  <DatePicker
                    v-model="startDate"
                    mode="single"
                    type="date"
                    color="blue"
                    input-class="modern-input shadow-sm"
                  />
                </div>
              </BCol>

              <!-- End Date Selection -->
              <BCol class="mb-4" md="6">
                <div class="form-group modern-form-group">
                  <label class="floating-label" style="margin-bottom: 3px">
                    تا تاریخ
                  </label>
                  <DatePicker
                    v-model="endDate"
                    mode="single"
                    type="date"
                    color="blue"
                    input-class="modern-input shadow-sm"
                  />
                </div>
              </BCol>

              <!-- Manager Selection -->
              <BCol class="mb-4" md="12">
                <BCard class="border-0 shadow-sm rounded modern-card">
                  <BCardBody>
                    <h5 class="form-label">
                      <i class="fas fa-user-tie me-2 text-warning"></i>مدیر را
                      انتخاب کنید
                    </h5>
                    <BFormInput
                      placeholder="جستجوی مدیر..."
                      v-model="managerSearchquery"
                      class="modern-input shadow-sm rounded-pill mb-3"
                    />
                    <div class="user-checkbox-list">
                      <BRow>
                        <BCol
                          v-for="manager in filteredManagers"
                          :key="manager.id"
                          class="mb-2"
                          md="4"
                        >
                          <BFormRadio
                            v-model="selectedManager"
                            :value="manager.id"
                            class="custom-checkbox"
                          >
                            <strong>{{ manager.name }}</strong>
                          </BFormRadio>
                        </BCol>
                      </BRow>
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>

              <!-- Meeting Status Selection -->
              <BCol class="mb-4" md="12">
                <div class="form-group modern-form-group">
                  <label class="floating-label">
                    <i class="fas fa-flag me-2 text-secondary"></i>وضعیت جلسه را
                    مشخص کنید
                  </label>
                  <BFormSelect v-model="status" class="modern-select shadow-sm">
                    <option value="1">برگزار شده</option>
                    <option value="2">موکول شده</option>
                    <option value="3">لغو شده</option>
                    <option value="4">منتظر برگزاری</option>
                  </BFormSelect>
                </div>
              </BCol>

              <!-- Output Button -->
              <BCol class="text-center">
                <button 
      :disabled="loading" 
      @click="getOutput"
      class="btn btn-primary"
    >
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span v-else>دانلود فایل</span>
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
.modern-header {
  background: #4a90e2;
  color: #ffffff;
  padding: 1rem;
  font-weight: bold;
}

.modern-form-group {
  position: relative;
  padding-top: 1.5rem;
}

.floating-label {
  font-size: 0.875rem;
  color: #6c757d;
  transition: 0.3s ease;
  pointer-events: none;
}

.modern-input:focus + .floating-label,
.modern-select:focus + .floating-label,
.modern-input:not(:placeholder-shown) + .floating-label,
.modern-select:not(:placeholder-shown) + .floating-label {
  transform: translateY(-1rem);
  font-size: 0.75rem;
}

.shadow {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.shadow-sm {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
}

.shadow-lg {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
}

.me-2 {
  margin-right: 0.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.user-checkbox-list {
  max-height: 200px;
  overflow-y: auto;
  padding-top: 0.5rem;
}

.custom-checkbox {
  display: flex;
  align-items: center;
}

.rounded-pill {
  border-radius: 50px;
}

.text-info {
  color: #17a2b8 !important;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffb400 !important;
}

.text-danger {
  color: #e74c3c !important;
}

.text-primary {
  color: #4a90e2 !important;
}

.text-secondary {
  color: #6c757d !important;
}
</style>
