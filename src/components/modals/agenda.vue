<template>
  <div
    class="modal fade"
    id="agenda"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content rounded-4 shadow">
  
        <div class="modal-header border-bottom-0 bg-light text-dark py-3">
          <h5 class="modal-title d-flex align-items-center fw-bold">
            <i class="fas fa-file-alt me-2"></i> صورت جلسه
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

   
        <div class="modal-body">
          <form>
            <BRow class="g-3 mb-3">
              <BCol class="col-12">
                <div class="form-group">
                  <label class="form-label fs-6">توضیحات</label>
                  <BFormTextarea
                    id="messageTextarea"
                    v-if="localDesc"
                    rows="4"
                    v-model="localDesc"
                    class="form-control border border-secondary rounded-3 shadow-sm"
                    disabled
                  />
                  <BFormTextarea
                    v-else
                    @input="clearError('newDesc')"
                    id="messageTextarea"
                    rows="4"
                    v-model="newDesc"
                    class="form-control border border-secondary rounded-3 shadow-sm"
                    placeholder="توضیحات خود را وارد کنید..."
                  />
                  <small v-if="errors.newDesc" class="text-danger d-block mt-1">
                    {{ errors.newDesc }}
                  </small>
                </div>
              </BCol>
            </BRow>

       
            <BRow v-if="!localDesc" class="g-3 mb-3">
              <BCol class="col-12">
                <div class="form-group">
                  <label class="form-label fs-6">آپلود فایل‌ها</label>
                  <input
                    type="file"
                    @change="handleFileUpload"
                    multiple
                    class="form-control border border-secondary rounded-3 shadow-sm"
                  />
                  <small
                    v-if="errors.selectedFiles"
                    class="text-danger d-block mt-1"
                  >
                    {{ errors.selectedFiles }}
                  </small>
                </div>
                <div class="mt-3">
                  <h6>فایل‌های بارگذاری شده:</h6>
                  <ul class="list-group list-group-flush">
                    <li
                      v-for="(file, index) in files"
                      :key="index"
                      class="list-group-item d-flex justify-content-between align-items-center bg-light rounded-3 shadow-sm mb-1"
                    >
                      <span class="file-name">{{ file.name }}</span>
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-sm rounded-circle shadow-sm"
                        @click="removeFile(index)"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </BCol>
            </BRow>

   
            <div class="d-flex justify-content-between align-items-center mt-4">
              <button
                type="button"
                @click="downloadAganda()"
                v-if="localDesc"
                class="btn btn-outline-success d-flex align-items-center rounded-3 shadow-sm"
                :disabled="downloadLoading"
              >
                <span
                  v-if="downloadLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <i class="fas fa-download me-1"></i> دانلود صورت جلسه
              </button>
              <button
                v-else
                :disabled="saveLoading"
                @click="saveAganda()"
                type="button"
                class="btn btn-primary rounded-3 shadow-sm d-flex align-items-center"
              >
                <span
                  v-if="saveLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>

                <i class="fas fa-save me-1"></i> ذخیره صورت جلسه
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary rounded-3 shadow-sm d-flex align-items-center"
                data-bs-dismiss="modal"
              >
                <i class="fas fa-times me-1"></i> بستن
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { watch, ref } from "vue";
import axios from "axios";

export default {
  props: {
    description: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props , {emit}) {
    const errors = ref({});
    const downloadLoading = ref(false);
    const saveLoading = ref(false);
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");
    const meetId = ref();
    const localDesc = ref();
    const newDesc = ref("");
    const files = ref([]);
    const selectedFiles = ref([]);

    const clearError = (field) => {
      errors.value[field] = "";
    };

    watch(
      () => props.description,
      (newVal) => (localDesc.value = newVal)
    );

    watch(
      () => props.id,
      (newVal) => (meetId.value = newVal)
    );

    const handleFileUpload = (event) => {
      clearError("selectedFiles");
      const newFiles = Array.from(event.target.files);

      files.value.push(...newFiles);
      selectedFiles.value.push(...newFiles);

      event.target.value = "";
    };

    const validateForm = () => {
      errors.value = {};
      if (!newDesc.value)
        errors.value.newDesc = "لطفا توضیحات صورت جلسه را وارد نمایید";

      return Object.keys(errors.value).length === 0;
    };

    const removeFile = (index) => {
      files.value.splice(index, 1);
      selectedFiles.value.splice(index, 1);
    };


    const downloadAganda = () => {
      downloadLoading.value = true;

      axios
        .get(`${url}/download-minutes/${meetId.value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/zip" });
          const fileURL = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = fileURL;
          link.setAttribute("download", `meeting_minutes_${meetId.value}.zip`);

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(fileURL);
          downloadLoading.value = false;

          toast.success("صورت جلسه با موفقیت دانلود شد", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error downloading the agenda:", error);
          toast.error("مشکلی در دانلود صورت جلسه پیش آمد", {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .finally(() => {
          downloadLoading.value = false;
        });
    };


    const saveAganda = () => {
      if (!validateForm()) return;

      saveLoading.value = true;

      
      const data = new FormData();
      data.append("id", meetId.value);
      data.append("description", newDesc.value);
      selectedFiles.value.forEach((file) => {
        data.append("meeting_files[]", file); 
      });

      axios
        .post(`${url}/admin/add-meeting-minutes`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("صورت جلسه با موفقیت بارگذاری شد", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => emit("meet-updated"),
          });

          saveLoading.value = false;
        })
        .catch((error) => {
          console.error("Error saving agenda:", error);
          saveLoading.value = false;
          toast.error("مشکلی در بارگذاری صورت جلسه پیش آمد", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    };

    return {
      localDesc,
      newDesc,
      files,
      handleFileUpload,
      removeFile,
      downloadAganda,
      saveAganda,
      downloadLoading,
      errors,
      clearError,
      saveLoading,
    };
  },
};
</script>

<style scoped>
.modal-dialog {
  max-width: 50%;
}

.modal-content {
  padding: 1.5rem;
  border-radius: 10px;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 1rem 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>
