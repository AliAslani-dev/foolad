<template>
  <div
    class="modal fade"
    id="editLocation"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">ویرایش موقعیت</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editLocation">
            <BRow class="g-3">
              <!-- Form fields -->
              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">آدرس (فارسی)</label>
                  <input
                    v-model="localAddress"
                    @input="clearError('localAddress')"
                    type="text"
                    class="form-control"
                    placeholder="آدرس موقعیت را وارد نمایید"
                  />
                  <small v-if="errors.localAddress" class="text-danger">{{
                    errors.localAddress
                  }}</small>
                </div>
              </BCol>

              <BCol class="col-lg-6">
                <div class="form-group">
                  <label class="form-label">آدرس (انگلیسی)</label>
                  <input
                    v-model="local_en_address"
                    @input="clearError('local_en_address')"
                    type="text"
                    class="form-control"
                    placeholder="لطفا آدرس انگلیسی موقعیت را وارد نمایید"
                  />
                  <small v-if="errors.local_en_address" class="text-danger">{{
                    errors.local_en_address
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
    address: {
      type: String,
      required: true,
    },
    en_address: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const localAddress = toRef(props.address);
    const local_en_address = toRef(props.en_address);
    const id = toRef(props.id);
    const errors = ref({});
    const loading = ref(false);
    const url = process.env.VUE_APP_ROOT_URL;
    const token = localStorage.getItem("token");

    watch(
      () => props.address,
      (newVal) => (localAddress.value = newVal)
    );
    watch(
      () => props.en_address,
      (newVal) => (local_en_address.value = newVal)
    );
    watch(
      () => props.id,
      (newVal) => (id.value = newVal)
    );

    const validateForm = () => {
      errors.value = {};
      if (!localAddress.value)
        errors.value.localAddress = "وارد کردن آدرس ضروری می باشد";
      if (!local_en_address.value)
        errors.value.local_en_address =
          "وارد کردن آدرس به انگلیسی ضروری می باشد";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    const editLocation = () => {
      if (!validateForm()) return;
      loading.value = true;

      const formData = new FormData();
      formData.append("address", localAddress.value);
      formData.append("address_en", local_en_address.value);
      formData.append("id", id.value);
      axios
        .post(`${url}/admin/edit-location`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("موقعیت با موفقیت ویرایش شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("user-updated"),
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("مشکلی در ویرایش موقعیت ایجاد شد!", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => emit("user-updated"),
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
      editLocation,
      localAddress,
      local_en_address,
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
