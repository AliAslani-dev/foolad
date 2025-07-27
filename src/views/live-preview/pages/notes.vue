<script>
import Layout from "@/layout/custom.vue";
import addNote from "../../../components/modals/addNote.vue";
import editNote from "@/components/modals/editNote.vue";
import axios from "axios";
import moment from "jalali-moment";
import { onMounted, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Swal from "sweetalert2";
const token = localStorage.getItem("token");
const url = process.env.VUE_APP_ROOT_URL;
export default {
  name: "BORDER",
  components: {
    Layout,
    addNote,
    editNote,
  },
  setup() {
    const searchQuery = ref(""); // Added search query ref
    const notes = ref();
    const note = ref();
    const en_note = ref();
    const noteId = ref();
    const convertToJalali = (date) => {
      return moment(date, "YYYY-MM-DD HH:mm:ss")
        .locale("fa")
        .format("YYYY/MM/DD");
    };
    const getNotes = (searchQuery) => {
      axios
        .get(`${url}/admin/all-note?search=${searchQuery?.value || ""}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          notes.value = resp.data.data;
          console.log(notes.value);
        });
    };

    const handleNoteUpdate = () => {
      location.reload();
    };
    const deleteNote = (id) => {
      // Accept id as a parameter
      Swal.fire({
        text: `آیا می خواهید یادداشت را حذف کنید ؟`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${url}/admin/delete-note/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("یادداشت با موفقیت حذف شد", {
                position: "top-right",
                autoClose: 3000,
              });
              notes.value = notes.value.filter(
                (note) => note.id !== id
              );
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در حذف کردن یادداشت پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };

    const modalData = (fa, en, id) => {
      note.value = fa;
      en_note.value = en;
      noteId.value = id;
    };

    watch(searchQuery, () => {
      getNotes(searchQuery);
    });

    onMounted(() => {
      getNotes();
    });
    return {
      notes,
      convertToJalali,
      handleNoteUpdate,
      modalData,
      note,
      en_note,
      noteId,
      deleteNote,
      searchQuery,
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
                data-bs-target="#addNote"
                class="btn btn-light text-primary btn-sm px-3"
              >
                افزودن یادداشت
              </button>
            </div>
          </div>
          <div class="card-body table-border-style p-0">
            <div class="table-responsive">
              <table class="table table-hover table-bordered m-0" dir="rtl">
                <thead class="table-light">
                  <tr>
                    <th>شناسه</th>
                    <th>یادداشت</th>
                    <th>یادداشت به انگلیسی</th>
                    <th>تاریخ ایجاد</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="note in notes" :key="note.id">
                    <td>{{ note.id }}</td>
                    <td>{{ note.note }}</td>
                    <td>{{ note.note_en }}</td>
                    <td>{{ convertToJalali(note?.created_at) }}</td>
                    <td>
                      <button
                        @click="modalData(note?.note, note?.note_en, note.id)"
                        data-bs-toggle="modal"
                        data-bs-target="#editNote"
                        class="btn btn-sm btn-outline-warning me-1"
                      >
                        ویرایش
                      </button>
                      <button
                        @click="deleteNote(note.id)"
                        class="btn btn-sm btn-outline-danger"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <addNote @note-updated="handleNoteUpdate()" />
      <editNote
        :note="note"
        :en_note="en_note"
        :id="noteId"
        @note-updated="handleNoteUpdate()"
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
</style>
