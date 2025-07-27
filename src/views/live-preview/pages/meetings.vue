<script>
import Layout from "@/layout/custom.vue";
import addMeet from "../../../components/modals/addMeet.vue";
import agenda from "@/components/modals/agenda.vue";
import ShowAddress from "@/components/modals/ShowAddress.vue";
import showSubject from "@/components/modals/showSubject.vue";
import DatePicker from "vue3-persian-datetime-picker";
import axios from "axios";
import moment from "jalali-moment";
import { onMounted, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import "vue3-toastify/dist/index.css";
import Swal from "sweetalert2";

const token = localStorage.getItem("token");
const url = process.env.VUE_APP_ROOT_URL;
export default {
  name: "BORDER",
  components: {
    Layout,
    addMeet,
    ShowAddress,
    showSubject,
    agenda,
    DatePicker,
  },
  setup() {
    const csvLoading = ref(false);
    const pdfLoading = ref(false);
    const filterLoading = ref(false);
    const filter_locations = ref();
    const filter_dates = ref([]);
    const filter_subject = ref();
    const filter_status = ref();
    const router = useRouter();
    const managers = ref();
    const users = ref();
    const searchQuery = ref("");
    const locations = ref();
    const subjects = ref();
    const meetings = ref();
    const address = ref();
    const en_address = ref();
    const locationId = ref();
    const ShowAddress = ref();
    const showSubject = ref();
    const showDescription = ref();
    const meetId = ref();
    const convertToJalali = (date) => {
      return moment(date, "YYYY-MM-DD HH:mm:ss")
        .locale("fa")
        .format("YYYY/MM/DD");
    };
    const getMeetings = (date) => {
      filterLoading.value = true;
      console.log(date);
      axios
        .get(
          `${url}/meetings?subject=${
            filter_subject?.value || ""
          }&date_meeting_az=${date?.[0] || ""}&date_meeting_ta=${
            date?.[1] || ""
          }&status=${filter_status?.value || ""}&location=${
            filter_locations?.value || ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token} `,
            },
          }
        )
        .then((resp) => {
          filterLoading.value = false;
          console.log(resp.data.data);
          meetings.value = resp.data.data;
          console.log(meetings.value);
        })
        .catch(() => {
          filterLoading.value = false;
        });
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
          subjects.value = resp.data;
        });
    };

    const editPage = (id) => {
      router.push({ name: "editMeet", params: { id } });
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

    const getLocations = () => {
      axios
        .get(`${url}/admin/locations`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          locations.value = resp.data;
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
          console.log(resp.data);
          managers.value = resp.data;
        });
    };

    const handleMeetUpdated = () => {
      window.location.reload();
    };
    const deleteLocation = (id, address) => {
      Swal.fire({
        text: `می خواهید موقعیت ${address} را حذف کنید ؟`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${url}/admin/delete-location/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("موقعیت با موفقیت حذف شد.", {
                position: "top-right",
                autoClose: 3000,
              });
              meetings.value = meetings.value.filter(
                (meeting) => meeting.id !== id
              );
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در حذف کردن موقعیت پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };

    const addressModal = (address) => {
      ShowAddress.value = address;
      console.log(ShowAddress.value);
    };

    const subjectModal = (subject) => {
      showSubject.value = subject;
      console.log(showSubject.value);
    };

    const agendaModal = (desc, id) => {
      showDescription.value = desc;
      meetId.value = id;
    };

    const cancelMeeting = (id) => {
      console.log(id);
      Swal.fire({
        text: "آیا می خواهید این جلسه را لغو کنید ؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          const fd = new FormData();
          fd.append("meeting_id", id);
          axios
            .post(`${url}/admin/cancel-meeting`, fd, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("جلسه با موفقیت لغو شد", {
                position: "top-right",
                autoClose: 3000,
              });
              getMeetings();
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در لغو کردن جلسه پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };

    const acceptMeeting = (id) => {
      console.log(id);
      Swal.fire({
        text: "آیا می خواهید این جلسه را بپذیرید ؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          const fd = new FormData();
          fd.append("meeting_id", id);
          axios
            .post(`${url}/admin/accept-meeting`, fd, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("جلسه با موفقیت پذیرفته شد", {
                position: "top-right",
                autoClose: 3000,
              });
              getMeetings();
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در پذیرفتن جلسه پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };

    const deleteMeet = (id) => {
      console.log(id);
      Swal.fire({
        text: "آیا می خواهید این جلسه را حذف کنید ؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${url}/admin/meetings/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("جلسه با موفقیت حذف شد", {
                position: "top-right",
                autoClose: 3000,
              });
              meetings.value = meetings.value.filter((meet) => meet.id != id);
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در حذف کردن جلسه پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };

    const restoreMeet = (id) => {
      console.log(id);
      Swal.fire({
        text: "آیا می خواهید این جلسه را بازگردانی کنید ؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .put(`${url}/admin/meetings/${id}/restore`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("جلسه با موفقیت بازگردانی شد", {
                position: "top-right",
                autoClose: 3000,
              });
              getMeetings();
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در بازگردانی جلسه پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };

    const exportFile = (param) => {
      if (param === "pdf") {
        console.log("pdf");
        pdfLoading.value = true;
        axios
          .get(
            `${url}/statistic?subject=${
              filter_subject?.value || ""
            }&date_meeting_az=${
              filter_dates.value?.[0] || ""
            }&date_meeting_ta=${filter_dates.value?.[1] || ""}&status=${
              filter_status?.value || ""
            }&location=${filter_locations?.value || ""}&format=${param}`,
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
            `${url}/statistic?subject=${
              filter_subject?.value || ""
            }&date_meeting_az=${
              filter_dates.value?.[0] || ""
            }&date_meeting_ta=${filter_dates.value?.[1] || ""}&status=${
              filter_status?.value || ""
            }&location=${filter_locations?.value || ""}`,
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

    watch(filter_subject, () => {
      getMeetings();
    });

    watch(filter_dates, () => {
      getMeetings(filter_dates.value);
    });

    watch(filter_status, () => {
      getMeetings();
    });

    watch(filter_locations, () => {
      getMeetings();
    });

    const editMinute = (id) => {
      router.push({ name: "editMinute", params: { type: "meet", id: id } });
    };

    onMounted(() => {
      getMeetings();
      getSubjects();
      getLocations();
      getUsers();
      getManagers();
    });
    return {
      meetings,
      convertToJalali,
      handleMeetUpdated,
      address,
      en_address,
      locationId,
      deleteLocation,
      searchQuery,
      subjects,
      locations,
      users,
      managers,
      editPage,
      addressModal,
      ShowAddress,
      showSubject,
      subjectModal,
      agendaModal,
      showDescription,
      meetId,
      cancelMeeting,
      acceptMeeting,
      filter_subject,
      filter_dates,
      filter_status,
      filter_locations,
      filterLoading,
      editMinute,
      deleteMeet,
      restoreMeet,
      exportFile,
      csvLoading,
      pdfLoading,
    };
  },
};
</script>
<template>
  <Layout>
    <BRow>
      <div class="col-md-12">
        <div class="card shadow-sm border-0 rounded">
          <div class="container p-4 shadow bg-light rounded mb-3">
            <!-- Top Controls Section -->
            <div
              class="d-flex justify-content-between align-items-center mb-2 gap-3"
            >
              <!-- Search Bar -->
              <div>
                <BFormSelect
                  class="shadow-sm border rounded-lg"
                  v-model="filter_subject"
                  style="
                    width: 160px;
                    padding: 10px;
                    border-color: #ddd;
                    border-radius: 20px;
                    transition: border 0.3s ease;
                  "
                >
                  <option disabled value="">انتخاب موضوع</option>
                  <option value="">همه</option>
                  <option
                    v-for="subject in subjects"
                    :key="subject.id"
                    :value="subject.id"
                  >
                    {{ subject?.subject }}
                  </option>
                </BFormSelect>
              </div>

              <!-- Date Picker -->
              <div class="position-relative">
                <date-picker
                  :popover="true"
                  v-model="filter_dates"
                  multiple
                  clearable
                  class="shadow-sm border rounded-lg p-2"
                  style="
                    padding-left: 30px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    transition: border 0.3s ease;
                  "
                  placeholder="انتخاب تاریخ"
                />
              </div>

              <!-- Location Selector -->
              <div>
                <BFormSelect
                  class="shadow-sm border rounded-lg"
                  style="
                    width: 160px;
                    padding: 10px;
                    border-color: #ddd;
                    border-radius: 20px;
                    transition: border 0.3s ease;
                  "
                  v-model="filter_locations"
                >
                  <option disabled value="">انتخاب موقعیت</option>
                  <option value="">همه</option>
                  <option
                    v-for="location in locations"
                    :key="location.id"
                    :value="location.id"
                  >
                    {{ location?.address }}
                  </option>
                </BFormSelect>
              </div>

              <!-- Status Selector -->
              <div>
                <BFormSelect
                  class="shadow-sm border rounded-lg"
                  v-model="filter_status"
                  style="
                    width: 160px;
                    padding: 10px;
                    background-color: #fff;
                    border-color: #ddd;
                    border-radius: 20px;
                    transition: border 0.3s ease;
                  "
                >
                  <option disabled value="">انتخاب وضعیت</option>
                  <option value="">همه</option>
                  <option value="1">برگزار شده</option>
                  <option value="2">موکول شده</option>
                  <option value="3">لغو شده</option>
                  <option value="4">منتظر برگزاری</option>
                </BFormSelect>
              </div>

              <!-- Add User Button -->
              <button
                class="btn btn-primary add-user-btn d-flex align-items-center"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addMeet"
                style="
                  padding: 10px 20px;
                  border-radius: 20px;
                  transition: background-color 0.3s ease;
                "
              >
                <i class="fas fa-plus-circle me-2"></i>
                افزودن جلسه
              </button>

              <!-- Export Buttons -->
              <div class="d-flex gap-3">
                <button
                  class="btn btn-success d-flex align-items-center"
                  type="button"
                  :disabled="csvLoading"
                  @click="exportFile"
                  style="
                    padding: 10px 20px;
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
                    padding: 10px 20px;
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
          </div>

          <div v-if="!filterLoading" class="card-body table-border-style p-0">
            <div class="table-responsive">
              <table class="table table-hover table-bordered m-0" dir="rtl">
                <thead class="table-light">
                  <tr>
                    <th>شناسه</th>
                    <th>موضوع جلسه</th>
                    <th>زمان برگزاری</th>
                    <th>تاریخ برگزاری</th>
                    <th>آدرس جلسه</th>
                    <th>وضعیت</th>
                    <th>مدیر جلسه</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(meet, index) in meetings" :key="index">
                    <td>{{ meet?.id }}</td>
                    <td>
                      <div
                        type="button"
                        data-bs-target="#showSubject"
                        data-bs-toggle="modal"
                        @click="subjectModal(meet?.subject?.subject)"
                        class="subject-box"
                      >
                        <i class="fas fa-comments subject-icon"></i>
                        <span class="subject-text">
                          {{ meet?.subject?.subject.slice(0, 10)
                          }}{{
                            meet?.subject?.subject.length > 10 ? "..." : ""
                          }}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div class="time-box">
                        <i class="fas fa-clock"></i>
                        {{ meet?.az_hour }} تا {{ meet?.ta_hour }}
                      </div>
                    </td>

                    <td>
                      <div class="date-box">
                        <i class="fas fa-calendar-alt"></i>
                        {{ convertToJalali(meet?.date_meeting) }}
                      </div>
                    </td>
                    <td>
                      <div
                        type="button"
                        data-bs-target="#showAddress"
                        data-bs-toggle="modal"
                        @click="addressModal(meet?.location?.address)"
                        class="address-box"
                      >
                        <i class="fas fa-map-marker-alt"></i>
                        {{ meet?.location?.address }}
                      </div>
                    </td>

                    <td>
                      <div
                        class="status-box"
                        :class="{
                          'status-canceled': meet?.status === 3,
                          'status-rescheduled': meet?.status === 2,
                          'status-completed': meet?.status === 1,
                          'status-pending': meet?.status === 4,
                        }"
                      >
                        <i
                          :class="{
                            'fas fa-times-circle': meet?.status === 3,
                            'fas fa-clock': meet?.status === 2,
                            'fas fa-check-circle': meet?.status === 1,
                            'fas fa-hourglass-half': meet?.status === 4,
                          }"
                        ></i>
                        {{
                          meet?.status === 1
                            ? "برگزار شده"
                            : meet?.status === 2
                            ? "موکول شده"
                            : meet?.status === 3
                            ? "لغو شده"
                            : meet?.status === 4 && meet?.held_without_minutes
                            ? "?برگزار شده"
                            : meet?.status === 4
                            ? "منتظر برگزاری"
                            : ""
                        }}
                      </div>
                    </td>

                    <td class="manager-box">
                      <div class="manager-content">
                        <div class="name-container">
                          {{ meet?.manager?.name }}
                          <div class="phone-overlay">
                            <span>{{ meet?.manager?.mobile }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <!-- Dropdown button with three dots icon -->
                      <div class="dropdown">
                        <span
                          style="
                            cursor: pointer;
                            font-size: 1.5rem;
                            color: #007bff;
                          "
                          @click="toggleDropdown"
                          class="three-dots-icon"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          &#8230;
                          <!-- Three dots character -->
                        </span>
                        <div
                          class="dropdown-menu dropdown-menu-end"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a
                            @click="editPage(meet?.id)"
                            style="cursor: pointer"
                            class="dropdown-item"
                          >
                            <i
                              class="ph-duotone ph-pencil"
                              style="color: #007bff"
                            ></i>
                            ویرایش
                          </a>
                          <span v-if="meet?.accepted == 0 && meet?.status != 3">
                            <a
                              @click="acceptMeeting(meet?.id)"
                              style="cursor: pointer"
                              class="dropdown-item"
                              ><i
                                class="ph-duotone ph-check-circle"
                                style="color: #2ecc71"
                              ></i>
                              قبول جلسه</a
                            >
                            <a
                              @click="cancelMeeting(meet?.id)"
                              style="cursor: pointer"
                              class="dropdown-item"
                              ><i
                                class="ph-duotone ph-x-circle"
                                style="color: #e74c3c"
                              ></i>
                              لغو جلسه</a
                            >
                          </span>

                          <a
                            @click="agendaModal(meet?.description, meet?.id)"
                            data-bs-target="#agenda"
                            data-bs-toggle="modal"
                            style="cursor: pointer"
                            class="dropdown-item"
                          >
                            <i
                              class="ph-duotone ph-file-text"
                              style="color: #007bff"
                            ></i>

                            صورت جلسه
                          </a>
                          <a
                            @click="editMinute(meet?.id)"
                            style="cursor: pointer"
                            class="dropdown-item"
                          >
                            <i
                              class="ph-duotone ph-pencil-simple"
                              style="color: #007bff"
                            ></i>

                            ویرایش صورت جلسه
                          </a>
                          <a
                            v-if="!meet.deleted_at"
                            @click="deleteMeet(meet?.id)"
                            style="cursor: pointer"
                            class="dropdown-item"
                          >
                            <i
                              class="ph-duotone ph-trash-simple"
                              style="color: #e74c3c"
                            ></i>

                            حذف جلسه
                          </a>

                          <a
                            v-if="meet.deleted_at"
                            @click="restoreMeet(meet?.id)"
                            style="cursor: pointer"
                            class="dropdown-item"
                          >
                            <i
                              class="ph-duotone ph-arrow-counter-clockwise"
                              style="color: #2ecc71"
                            ></i>

                            بازگردانی
                          </a>
                        </div>
                      </div>
                    </td>
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
      <addMeet
        :subjects="subjects"
        :locations="locations"
        :users="users"
        :managers="managers"
        @meet-updated="handleMeetUpdated()"
      />
      <editMeet
        :subjects="subjects"
        :locations="locations"
        :users="users"
        :managers="managers"
        @meet-updated="handleMeetUpdated()"
      />
      <ShowAddress :address="ShowAddress" />
      <showSubject :subject="showSubject" />
      <agenda
        :description="showDescription"
        :id="meetId"
        @meet-updated="handleMeetUpdated()"
      />
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
.time-box {
  padding: 8px 14px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1a73e8;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.time-box i {
  color: #1a73e8;
  font-size: 1rem;
}

.time-box:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}
.date-box {
  padding: 8px 14px;
  background: linear-gradient(135deg, #f9fbe7, #f0f4c3);
  color: #558b2f;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.date-box i {
  color: #558b2f;
  font-size: 1rem;
}

.date-box:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}
.address-box {
  padding: 8px 14px;
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  color: #00796b;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.address-box i {
  color: #00796b;
  font-size: 1rem;
}

.address-box:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}
.status-box {
  padding: 8px 14px;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.status-canceled {
  background: linear-gradient(135deg, #ffe0e0, #ffb2b2);
  color: #d32f2f;
}

.status-pending {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #ef6c00;
}

.status-completed {
  background: linear-gradient(135deg, #e0ffe0, #b2ffb2);
  color: #388e3c;
}

.status-box i {
  font-size: 1rem;
}
.subject-box {
  padding: 8px 14px;
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #ef6c00;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.subject-box i {
  color: #ef6c00;
  font-size: 1rem;
}

.subject-box:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}
.manager-box {
  position: relative;
  font-weight: 600;
  cursor: pointer;
  color: #1a73e8;
  overflow: hidden;
}

.name-container {
  position: relative;
}

.phone-overlay {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150%;
  height: 100%;
  background-color: #6495ed;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  padding: 15px;
  text-align: center;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.manager-box:hover .phone-overlay {
  opacity: 1;
  transform: translate(-50%, 0);
}
.btn-custom {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 4px 15px rgba(0, 123, 255, 0.4);
}

.btn-custom:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-custom:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
}
.btn-cancel-meeting {
  color: #d32f2f;
  background: #ffebee;
  border-color: #d32f2f;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s;
}

.btn-cancel-meeting:hover {
  background: #ffcdd2;
  transform: scale(1.05);
}

.btn-accept-meeting {
  color: #388e3c;
  background: #e8f5e9;
  border-color: #388e3c;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s;
}

.btn-accept-meeting:hover {
  background: #c8e6c9;
  transform: scale(1.05);
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
</style>
