<script>
import Layout from "@/layout/custom.vue";
import axios from "axios";
import { onMounted, ref, computed, watch } from "vue";
import Select2 from "vue3-select2-component";
import DatePicker from "vue3-persian-datetime-picker";
const token = localStorage.getItem("token");
const url = process.env.VUE_APP_ROOT_URL;
export default {
  name: "BORDER",
  components: {
    Layout,
    Select2,
    DatePicker,
  },
  setup() {
    const searchPage = ref();
    const currentPage = ref(1);
    const totalPages = ref(1);
    const paginate = ref(20);
    const page = ref(1);
    const pdfLoading = ref(false);
    const csvLoading = ref(false);
    const filterLoading = ref(false);
    const users = ref([]);
    const selectedUser = ref();
    const logs = ref();
    const startDate = ref();
    const endDate = ref();

    const visiblePages = computed(() => {
      const pages = [];
      if (totalPages.value <= 5) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i);
        }
      } else {
        let start = currentPage.value - 2;
        let end = currentPage.value + 2;

        if (start < 1) start = 1;
        if (end > totalPages.value) end = totalPages.value;

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      return pages;
    });

    const exportFile = (param) => {
      if (param === "pdf") {
        console.log("pdf");
        pdfLoading.value = true;
        axios
          .get(
            `${url}/admin/auth-logs/export?user_id=${
              selectedUser.value || ""
            }&start_date=${startDate.value || ""}&end_date=${
              endDate.value || ""
            }&format=${param}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            }
          )
          .then((resp) => {
            const blob = new Blob([resp.data], {
              type: "application/pdf",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "exported_auth_logs.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
            pdfLoading.value = false;
          })
          .catch((error) => {
            pdfLoading.value = false;
            console.error("Error exporting data:", error);
          });
      } else {
        csvLoading.value = true;
        axios
          .get(
            `${url}/admin/auth-logs/export?user_id=${
              selectedUser.value || ""
            }&start_date=${startDate.value || ""}&end_date=${
              endDate.value || ""
            }`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob", // This is crucial for handling binary data
            }
          )
          .then((resp) => {
            const blob = new Blob([resp.data], {
              type: "application/vnd.ms-excel",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "exported_auth_logs.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
            csvLoading.value = false;
          })
          .catch((error) => {
            csvLoading.value = false;
            console.error("Error exporting data:", error);
          });
      }
    };
    const getLogs = () => {
      filterLoading.value = true;
      axios
        .get(
          `${url}/admin/auth-logs?user_id=${
            selectedUser.value || ""
          }&start_date=${startDate.value || ""}&end_date=${
            endDate.value || ""
          }&paginate=${paginate.value || 10}&page=${page.value || 1}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token} `,
            },
          }
        )
        .then((resp) => {
          filterLoading.value = false;
          logs.value = resp.data.data.data;
          currentPage.value = resp.data.data.current_page;
          totalPages.value = resp.data.data.last_page;
        })
        .catch(() => {
          filterLoading.value = false;
        });
    };

    function handlePageInput() {
      if (searchPage.value < 1) {
        searchPage.value = 1;
      } else if (searchPage.value > totalPages.value) {
        searchPage.value = totalPages.value;
      }

      if (searchPage.value >= 1 && searchPage.value <= totalPages.value) {
        page.value = searchPage.value;
      }
    }

    watch(page, () => {
      getLogs();
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        page.value++;
        getLogs();
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        page.value--;
        getLogs();
      }
    };

    const handleLocationUpdate = () => {
      location.reload();
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
        .catch((err) => {
          console.log(err);
        });
    };

    const formattedDevice = (device) => {
  if (device?.includes("Mozilla")) {
    return "مرورگر";
  }
  return device?.includes("Dart") ? "Application" : device;
};
    watch(selectedUser, () => {
      getLogs();
    });

    watch(startDate, () => {
      getLogs();
    });

    watch(endDate, () => {
      getLogs();
    });

    const formattedUsers = computed(() => {
      return users.value.map((user) => ({
        id: user.id,
        text: user.name,
      }));
    });

    onMounted(() => {
      getLogs();
      getUsers();
    });
    return {
      logs,
      handleLocationUpdate,
      filterLoading,
      selectedUser,
      formattedUsers,
      startDate,
      endDate,
      pdfLoading,
      csvLoading,
      exportFile,
      formattedDevice,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      page,
      handlePageInput,
      searchPage,
      visiblePages,
    };
  },
};
</script>
<template>
  <Layout>
    <BRow>
      <div class="col-md-12">
        <div class="card shadow-sm border-0 rounded">
          <div
            class="card-header d-flex justify-content-between align-items-center p-3"
            dir="rtl"
          >
            <!-- User Search -->
            <BCol sm="3" class="mt-4" style="margin-top: 30px">
              <label class="mb-1" for="token">جستجوی کاربر</label>
              <Select2
                v-model="selectedUser"
                id="token"
                :options="formattedUsers"
                :settings="{ settingOption: value, settingOption: value }"
                style="height: 60px"
              />
            </BCol>

            <!-- Start Date -->
            <BCol md="3" class="mb-1 ms-4">
              <div class="form-group">
                <label class="form-label">از زمان :</label>
                <DatePicker
                  :format="'jYYYY/jMM/jDD HH:mm:ss'"
                  type="datetime"
                  v-model="startDate"
                  @input="handleInput"
                  style="width: 160px"
                ></DatePicker>
              </div>
            </BCol>

            <!-- End Date -->
            <BCol md="3" class="mb-1">
              <div class="form-group">
                <label class="form-label">تا زمان :</label>
                <DatePicker
                  :format="'jYYYY/jMM/jDD HH:mm:ss'"
                  type="datetime"
                  v-model="endDate"
                  @input="handleInput"
                ></DatePicker>
              </div>
            </BCol>

            <!-- Export Button -->

            <div class="d-flex gap-3 me-2">
              <button
                class="btn btn-success d-flex align-items-center"
                type="button"
                :disabled="csvLoading"
                @click="exportFile"
                style="
                  padding: 5px 10px;
                  border-radius: 20px;
                  transition: background-color 0.3s ease;
                "
              >
                <i v-if="csvLoading" class="fas fa-spinner fa-spin me-2"></i>
                <i v-else class="fas fa-file-csv me-2"></i>
                {{ csvLoading ? "خروجی..." : "خروجی CSV" }}
              </button>
              <button
                class="btn btn-danger d-flex align-items-center"
                type="button"
                :disabled="pdfLoading"
                @click="exportFile(`pdf`)"
                style="
                  padding: 5px 10px;
                  border-radius: 20px;
                  transition: background-color 0.3s ease;
                "
              >
                <i v-if="pdfLoading" class="fas fa-spinner fa-spin me-2"></i>
                <i v-else class="fas fa-file-pdf me-2"></i>
                {{ pdfLoading ? "خروجی..." : "خروجی PDF" }}
              </button>
            </div>
          </div>
          <div v-if="!filterLoading" class="card-body table-border-style p-0">
            <div class="table-responsive">
              <table class="table table-hover table-bordered m-0" dir="rtl">
                <thead class="table-light">
                  <tr>
                    <th>شناسه</th>
                    <th>کاربر</th>
                    <th>موبایل</th>
                    <th>دیوایس</th>
                    <th>ip</th>
                    <th>زمان بازدید</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in logs" :key="log.id">
                    <td>{{ log.id }}</td>
                    <td>{{ log?.user?.name }}</td>
                    <td>{{ log?.user?.mobile }}</td>
                    <td>{{ formattedDevice(log?.device) }}</td>
                    <td>{{ log?.ip_address }}</td>
                    <td>{{ log.created_at }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            v-else
            class="filter-loader card table-card user-profile-list"
          ></div>
        </div>
      </div>
    </BRow>
    <BRow>
      <BCol sm="12">
        <div class="d-flex justify-content-center">
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <span class="page-link" @click="prevPage">قبلی</span>
              </li>

              <li v-if="currentPage > 2" class="page-item" @click="page = 1">
                <a class="page-link" href="javascript:void(0)">1</a>
              </li>
              <li v-if="currentPage > 3" class="page-item" disabled>
                <span class="page-link">...</span>
              </li>

              <li
                v-for="n in visiblePages"
                :key="n"
                class="page-item"
                :class="{ active: currentPage === n }"
              >
                <a
                  class="page-link"
                  href="javascript:void(0)"
                  @click="page = n"
                >
                  {{ n }}
                </a>
              </li>

              <li
                v-if="currentPage < totalPages - 2"
                class="page-item"
                disabled
              >
                <span class="page-link">...</span>
              </li>
              <li
                v-if="currentPage < totalPages - 1"
                class="page-item"
                @click="page = totalPages"
              >
                <a class="page-link" href="javascript:void(0)">{{
                  totalPages
                }}</a>
              </li>

              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <span class="page-link" @click="nextPage">بعدی</span>
              </li>
            </ul>
          </nav>
        </div>
      </BCol>
      <BCol sm="4">
        <div class="ms-0 search-number">
          <input
            v-model="searchPage"
            type="text"
            class="form-control"
            placeholder="برو به صفحه"
            :max="totalPages"
            min="1"
            @input="handlePageInput"
          />
        </div>
      </BCol>
    </BRow>
  </Layout>
</template>

<style scoped>
.card {
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-3px);
}
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}
.filter-loader {
  border: 4px solid rgba(0, 123, 255, 0.3); /* Light blue */
  border-top: 4px solid #007bff; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto; /* Center the loader */
}
.search-number {
  display: flex;
  align-items: center;
}

.search-number input {
  width: 150px;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 7px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-number input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
}

.search-number input::placeholder {
  color: #6c757d;
}

.search-number input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.page-item {
  flex: 0 0 auto;
}

.page-link {
  cursor: pointer;
  user-select: none;
}
</style>
