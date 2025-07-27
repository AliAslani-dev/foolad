<template>
  <Layout>
    <BRow v-if="desc" class="description-section">
      <BCol cols="12" class="text-center">
        <h2 class="page-title"><i class="fas fa-edit"></i> ویرایش صورت جلسه</h2>
        <textarea
          @input="clearError('desc')"
          v-model="desc"
          class="description-textarea"
          placeholder="توضیحات صورت جلسه را اینجا وارد کنید..."
        ></textarea>
        <small v-if="errors?.desc" class="text-danger d-block mt-1">
          {{ errors?.desc }}
        </small>
      </BCol>
    </BRow>
    <BRow v-if="desc" class="files-section mt-4">
      <BCol cols="12 mb-3">
        <h3 class="files-title">فایل‌های صورت جلسه</h3>
        <div v-if="files.length" class="files-list">
          <div v-for="(file, index) in files" :key="index" class="file-item">
            <span class="file-name">
              <i class="fas fa-file-alt"></i> {{ file }}
            </span>
            <button
              @click="removeFile(file)"
              class="btn btn-sm btn-danger delete-button"
            >
              حذف
            </button>
          </div>
        </div>
        <p v-else class="no-files">هیچ فایلی وجود ندارد.</p>
      </BCol>
    </BRow>
    <BRow v-if="desc" class="g-3 mb-3">
      <BCol class="col-12">
        <div class="form-group">
          <label class="form-label fs-6">آپلود فایل‌ها</label>
          <input
            type="file"
            @change="handleFileUpload"
            multiple
            class="form-control border border-secondary rounded-3 shadow-sm"
          />
        </div>
        <div class="mt-3">
          <h6>فایل‌های بارگذاری شده:</h6>
          <ul class="list-group list-group-flush">
            <li
              v-for="(file, index) in uploadedFiles"
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-center bg-light rounded-3 shadow-sm mb-1"
            >
              <span class="file-name">{{ file.name }}</span>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm rounded-circle shadow-sm"
                @click="removeUplodedFiles(file.name)"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </li>
          </ul>
        </div>
      </BCol>
    </BRow>
    <BRow v-if="desc">
      <BCol class="text-start mt-4">
        <button
          :disabled="saveLoading"
          @click="saveChanges()"
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
      </BCol>
    </BRow>
    <BRow v-if="!desc">
      <BCol cols="12">
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <i class="fas fa-exclamation-triangle"></i>
          <strong>توجه!</strong> صورت جلسه‌ای وجود ندارد. لطفاً ابتدا یک صورت
          جلسه اضافه کنید.
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Swal from "sweetalert2";
import Layout from "@/layout/custom.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    Layout,
  },
  setup() {
    const saveLoading = ref(false);
    const errors = ref({});
    const files = ref([]);
    const desc = ref("");
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const route = useRoute();
    const uploadedFiles = ref([]);
    const selectedFiles = ref([]);

    const handleFileUpload = (event) => {
      const newFiles = Array.from(event.target.files);

      uploadedFiles.value.push(...newFiles);
      selectedFiles.value.push(...newFiles);

      event.target.value = "";
    };

    const removeFile = (file) => {
      Swal.fire({
        text: "این فایل حذف خواهد شد و قابل بازیابی نیست!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله، حذف کن!",
        cancelButtonText: "لغو",
      }).then((result) => {
        if (result.isConfirmed) {
          const endpoint =
            route.params.type === "meet"
              ? `${url}/admin/delete-meeting-minutes/${route.params.id}/${file}`
              : `${url}/admin/delete-private-meeting-minutes/${route.params.id}/${file}`;

          axios
            .get(endpoint, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then(() => {
              files.value = files.value.filter((item) => item !== file);
              Swal.fire("حذف شد!", "فایل با موفقیت حذف شد.", "success");
            })
            .catch((error) => {
              console.error("Error deleting file:", error);
              Swal.fire("خطا!", "مشکلی در حذف فایل وجود دارد.", "error");
            });
        }
      });
    };

    const removeUplodedFiles = (name) => {
      uploadedFiles.value = uploadedFiles.value.filter(
        (item) => item.name !== name
      );
      selectedFiles.value = selectedFiles.value.filter(
        (item) => item.name !== name
      );
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const validateForm = () => {
      errors.value = {};
      if (!desc.value)
        errors.value.desc = "لطفا توضیحات صورت جلسه را وارد نمایید";
      return Object.keys(errors.value).length === 0;
    };

    const saveChanges = () => {
      if (!validateForm()) return;

      saveLoading.value = true;

      const data = new FormData();
      data.append("id", route.params.id);
      data.append("description", desc.value);

      selectedFiles.value.forEach((file) => {
        data.append("meeting_files[]", file);
      });

      const endpoint =
        route.params.type === "meet"
          ? `${url}/admin/add-meeting-minutes`
          : `${url}/admin/add-private-meeting-minutes`;

      axios
        .post(endpoint, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("صورت جلسه با موفقیت بارگذاری شد", {
            position: "top-right",
            autoClose: 3000,
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

    onMounted(() => {
      const endpoint =
        route.params.type === "meet"
          ? `${url}/meeting/${route.params.id}`
          : `${url}/private-meeting/${route.params.id}`;

      axios
        .get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          files.value = resp.data.minutes;
          desc.value = resp.data.description;
        })
        .catch((error) => {
          console.error("Error loading data:", error);
        });
    });

    return {
      desc,
      files,
      removeFile,
      handleFileUpload,
      uploadedFiles,
      removeUplodedFiles,
      saveChanges,
      saveLoading,
      clearError,
      errors,
    };
  },
};
</script>

<style scoped>
.description-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.page-title i {
  color: #007bff;
  margin-right: 10px;
}

.description-textarea {
  width: 100%;
  min-height: 150px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  color: #333;
  resize: vertical;
}

.description-textarea::placeholder {
  color: #999;
}

.files-section {
  margin-top: 20px;
}

.files-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.files-list {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f1f1f1;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  font-size: 16px;
  color: #333;
}

.file-name i {
  margin-right: 5px;
  color: #007bff;
}

.delete-button {
  font-size: 14px;
  padding: 2px 8px;
}
</style>
