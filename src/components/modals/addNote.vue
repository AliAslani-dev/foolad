<template>
  <div
    class="modal fade"
    id="addNote"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            اضافه کردن یادداشت جدید
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addLocation">
            <BRow class="g-3">
              <!-- Form fields -->
              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">یادداشت (فارسی)</label>
                  <input
                    v-model="note"
                    @input="clearError('note')"
                    type="text"
                    class="form-control"
                    placeholder=" یادداشت را وارد نمایید"
                  />
                  <small v-if="errors.note" class="text-danger">{{
                    errors.note
                  }}</small>
                </div>
              </BCol>

              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">یادداشت (انگلیسی)</label>
                  <input
                    v-model="note_en"
                    @input="clearError('mobile')"
                    type="text"
                    class="form-control"
                    placeholder="لطفا یادداشت انگلیسی  را وارد نمایید"
                  />
                  <small v-if="errors.note_en" class="text-danger">{{
                    errors.note_en
                  }}</small>
                </div>
              </BCol>
            </BRow>

            <!-- Submit Buttons -->
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
              <button type="submit" class="btn btn-primary" :disabled="loading">
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
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup(props, { emit }) {
    const note = ref();
    const note_en = ref();
    const errors = ref({});
    const loading = ref(false);
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");

    const validateForm = () => {
      errors.value = {};
      if (!note.value) errors.value.note = "وارد کردن یادداشت ضروری می باشد";
      if (!note_en.value)
        errors.value.note_en = "وارد کردن یادداشت  به انگلیسی ضروری می باشد";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const addLocation = () => {
      if (!validateForm()) return;
      loading.value = true;

      const formData = new FormData();
      formData.append("note", note.value);
      formData.append("note_en", note_en.value);

      axios
        .post(`${url}/admin/add-note`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("یادداشت با موفقیت اضافه شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("note-updated"),
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("مشکلی در ایجاد یاد داشت به وجود آمد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("note-updated"),
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      errors,
      loading,
      clearError,
      addLocation,
      note_en,
      note,
    };
  },
};
</script>

<style scoped>
.profile-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-upload-icon {
  font-size: 64px;
  color: #6c757d;
  border: 2px dashed #6c757d;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.modal-dialog {
  max-width: 50%;
}

.modal-content {
  padding: 20px;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.input-group {
  margin-top: 0.5rem;
}
.profile-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-upload-btn {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #007bff;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-upload-btn i {
  font-size: 20px;
  color: #007bff;
}

.profile-image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-placeholder {
  border: 2px dashed #007bff;
}

.d-none {
  display: none;
}
.profile-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-upload-btn {
  width: 30px; /* اندازه دکمه را کوچک‌تر کنید */
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc; /* کمی خط دور دکمه برای بهتر دیده شدن */
  background-color: #fff;
  cursor: pointer;
}

.profile-upload-btn i {
  font-size: 16px; /* اندازه آیکون را کوچک‌تر کنید */
  color: #007bff; /* رنگ آیکون را تغییر دهید */
}

.profile-image-preview img,
.profile-placeholder {
  width: 80px;
  height: 80px;
}

.profile-placeholder i {
  font-size: 40px;
}
.modal-dialog {
  max-width: 50%;
}

.modal-content {
  padding: 1.5rem; /* Increased padding for better spacing */
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1rem; /* Added padding-bottom to separate the header from the content */
}

.modal-body {
  padding: 1rem 1.5rem; /* Adjusted padding for a more balanced layout */
}

.form-group {
  margin-bottom: 1.5rem; /* Increased margin between form groups */
}

.input-group {
  margin-top: 0.5rem;
}

.profile-image-preview:hover .overlay {
  opacity: 1;
}

.profile-image-preview:hover img,
.profile-image-preview:hover .profile-placeholder {
  opacity: 0.7;
}
</style>
