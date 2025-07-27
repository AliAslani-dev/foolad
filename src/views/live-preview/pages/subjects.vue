<script>
import Layout from "@/layout/custom.vue";
import addSubject from "../../../components/modals/addSubject.vue";
import axios from "axios";
import moment from "jalali-moment";
import { onMounted, ref , watch } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Swal from "sweetalert2";
import editSubject from "@/components/modals/editSubject.vue";
const token = localStorage.getItem("token");
const url = process.env.VUE_APP_ROOT_URL;
export default {
  name: "BORDER",
  components: {
    Layout,
    addSubject,
    editSubject,
  },
  setup() {
    const filterLoading = ref(false)
    const searchQuery = ref(""); 
    const subjects = ref();
    const subject = ref();
    const en_subject = ref();
    const subjectId = ref();
    const convertToJalali = (date) => {
      return moment(date, "YYYY-MM-DD HH:mm:ss")
        .locale("fa")
        .format("YYYY/MM/DD");
    };
    const getSubjects = (searchQuery) => {
      filterLoading.value = true
      axios
        .get(`${url}/admin/subjects?search=${searchQuery?.value || ""}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          subjects.value = resp.data;
          console.log(subjects.value);
          filterLoading.value = false
        }).catch(()=>{
          filterLoading.value = false
        })
    };
    
    watch( searchQuery, () => {
      getSubjects(searchQuery);
    });


    const handleSubjectUpdate = () => {
      location.reload();
    };
    const deleteLocation = (id, subject) => {
      // Accept id as a parameter
      Swal.fire({
        text: `می خواهید موضوع ${subject} را حذف کنید ؟`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${url}/admin/delete-subject/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("موضوع با موفقیت حذف شد", {
                position: "top-right",
                autoClose: 3000,
              });
              subjects.value = subjects.value.filter(
                (subject) => subject.id !== id
              );
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در حذف کردن موضوع پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };

    const modalData = (fa, en, id) => {
        subject.value = fa;
      en_subject.value = en;
      subjectId.value = id;
    };

    onMounted(() => {
      getSubjects();
    });
    return {
      subjects,
      convertToJalali,
      handleSubjectUpdate,
      modalData,
      subject,
      en_subject,
      subjectId,
      deleteLocation,
      searchQuery,
      filterLoading
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
            class="card-header d-flex justify-content-between align-items-center p-3 bg-primary text-white"
            dir="rtl"
          >
            <div class="d-flex align-items-center">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو..."
                class="form-control form-control-sm d-inline-block me-2"
                style="width: 250px; border-radius: 15px"
              />
              <button
                data-bs-toggle="modal"
                data-bs-target="#addSubject"
                class="btn btn-light text-primary btn-sm px-3"
              >
                افزودن موضوع
              </button>
            </div>
          </div>
          <div class="card-body table-border-style p-0">
            <div v-if="!filterLoading" class="table-responsive">
              <table class="table table-hover table-bordered m-0" dir="rtl">
                <thead class="table-light">
                  <tr>
                    <th>شناسه</th>
                    <th>موضوع</th>
                    <th>موضوع به انگلیسی</th>
                    <th>تاریخ ایجاد</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subject in subjects" :key="subject.id">
                    <td>{{ subject.id }}</td>
                    <td>{{ subject.subject }}</td>
                    <td>{{ subject.subject_en }}</td>
                    <td>{{ convertToJalali(subject.created_at) }}</td>
                    <td>
                      <button
                        @click="
                          modalData(
                            subject?.subject,
                            subject?.subject_en,
                            subject?.id
                          )
                        "
                        data-bs-toggle="modal"
                        data-bs-target="#editSubject"
                        class="btn btn-sm btn-outline-warning me-1"
                      >
                        ویرایش
                      </button>
                      <button
                        @click="deleteLocation(subject.id, subject.subject)"
                        class="btn btn-sm btn-outline-danger"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
          v-else
          class="filter-loader card table-card user-profile-list"
        ></div>
          </div>
        </div>
      </div>
      <addSubject @subject-updated="handleSubjectUpdate()" />
      <editSubject
        :subject="subject"
        :en_subject="en_subject"
        :id="subjectId"
        @subject-updated="handleSubjectUpdate()"
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
