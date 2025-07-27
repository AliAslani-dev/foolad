<template>
  <div
    class="modal fade"
    id="editNote"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">ویرایش یاداشت</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editNote">
            <BRow class="g-3">
              <!-- Form fields -->
              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">یادداشت (فارسی)</label>
                  <input
                    v-model="localNote"
                    @input="clearError('localNote')"
                    type="text"
                    class="form-control"
                    placeholder="یادداشت را وارد نمایید"
                  />
                  <small v-if="errors.localNote" class="text-danger">{{
                    errors.localNote
                  }}</small>
                </div>
              </BCol>

              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">یاداشت (انگلیسی)</label>
                  <input
                    v-model="local_en_note"
                    @input="clearError('local_en_note')"
                    type="text"
                    class="form-control"
                    placeholder="لطفا یاداشت انگلیسی  را وارد نمایید"
                  />
                  <small v-if="errors.local_en_note" class="text-danger">{{
                    errors.local_en_note
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
import { ref, toRef, watch } from "vue";
import axios from "axios";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  props: {
    note: {
      type: String,
      required: true,
    },
    en_note: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const localNote = toRef(props.note);
    const local_en_note = toRef(props.en_note);
    const id = toRef(props.id);
    const errors = ref({});
    const loading = ref(false);
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");

    watch(
      () => props.note,
      (newVal) => (localNote.value = newVal)
    );
    watch(
      () => props.en_note,
      (newVal) => (local_en_note.value = newVal)
    );
    watch(
      () => props.id,
      (newVal) => (id.value = newVal)
    );

    const validateForm = () => {
      errors.value = {};
      if (!localNote.value)
        errors.value.localNote = "وارد کردن یادداشت ضروری می باشد";
      if (!local_en_note.value)
        errors.value.local_en_note =
          "وارد کردن یادداشت به انگلیسی ضروری می باشد";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const editNote = () => {
      if (!validateForm()) return;
      loading.value = true;

      const formData = new FormData();
      formData.append("note", localNote.value);
      formData.append("note_en", local_en_note.value);
      formData.append("id", id.value);
      axios
        .post(`${url}/admin/edit-note`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("یاداشت با موفقیت ویرایش شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("note-updated"),
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("مشکلی در ویرایش یاد داشت بوجود آمد!", {
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
      editNote,
      localNote,
      local_en_note,
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
