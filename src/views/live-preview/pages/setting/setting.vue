<script>
import Layout from "@/layout/custom.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
export default {
  name: "SETTING",
  components: {
    Layout,
  },
  setup() {
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const settings = ref([]);
    const loadingIds = ref([]);

    // Fetch settings
    const getSettings = () => {
      axios
        .get(`${url}/admin/settings`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          settings.value = resp.data.data;
        })
        .catch((error) => {
          console.error("Failed to fetch settings:", error);
        });
    };

    // Check if a field is an image field
    const isImageField = (key) => {
      return key === "logo" || key === "about_us_image";
    };

    // Get the file URL
    const getFileUrl = (filename) => {
      return `https://api.nghsco.com/storage/statics/${filename}`;
    };

    // Handle file change
    const onFileChange = (event, setting) => {
      const file = event.target.files[0];
      if (file) {
        setting.file = file;
      }
    };

    const updateSetting = (setting) => {
      loadingIds.value.push(setting.id);

      if (isImageField(setting.key) && setting.file) {
        const formData = new FormData();
        formData.append("value", setting.file);
        formData.append("_method", "put");
        axios
          .post(`${url}/admin/settings/${setting.id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            toast.success("تنظیمات با موفقیت ویرایش شد", {
              position: "top-right",
              autoClose: 1000,
            });
            getSettings();
          })

          .catch(() => {
            toast.error("مشکلی در ویرایش تنظیمات پیش آمد", {
              position: "top-right",
              autoClose: 1000,
            });
          })
          .finally(() => {
            loadingIds.value = loadingIds.value.filter(
              (id) => id !== setting.id
            ); // Remove from loading state
          });
      } else {
        const formData = new FormData();
        formData.append("value", setting.value);
        formData.append("_method", "put");
        axios
          .post(`${url}/admin/settings/${setting.id}`, formData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            toast.success("تنظیمات با موفقیت ویرایش شد", {
              position: "top-right",
              autoClose: 1000,
            });
            getSettings();
          })
          .catch(() => {
            toast.error("مشکلی در ویرایش تنظیمات پیش آمد", {
              position: "top-right",
              autoClose: 1000,
            });
          })
          .finally(() => {
            loadingIds.value = loadingIds.value.filter(
              (id) => id !== setting.id
            );
          });
      }
    };

    // Map setting keys to readable labels
    const getFieldLabel = (key) => {
      const labels = {
        logo: "لوگو",
        about_us_description_fa: "درباره ما (فارسی)",
        about_us_description_en: "درباره ما(انگلیسی)",
        app_version_fa: "ورژن اپلیکیشن(فارسی)",
        app_version_en: "ورژن اپلیکیشن(انگلیسی)",
        about_us_image: "عکس در باره ما",
      };
      return labels[key] || key;
    };

    onMounted(() => {
      getSettings();
    });

    return {
      settings,
      loadingIds,
      getSettings,
      updateSetting,
      getFieldLabel,
      isImageField,
      getFileUrl,
      onFileChange,
    };
  },
};
</script>

<style>
.vue-dropzone {
  border: 2px dashed #dbe0e5;
}
</style>
<template>
  <Layout>
    <BRow>
      <div class="col-sm-12">
        <BCard no-body>
          <BCardHeader>
            <h5>تنظیمات سایت</h5>
          </BCardHeader>
          <BCardBody>
            <!-- Dynamically Render Settings -->
            <div class="mb-3 row" v-for="setting in settings" :key="setting.id">
              <label class="col-form-label col-sm-3 text-sm-end">
                {{ getFieldLabel(setting.key) }}
              </label>
              <div class="col-lg-6 col-sm-7">
                <!-- Handle Image Fields -->
                <template v-if="isImageField(setting.key)">
                  <input
                    type="file"
                    class="form-control"
                    @change="onFileChange($event, setting)"
                  />
                  <small v-if="setting.value" class="text-muted">
                    عکس کنونی:
                    <a :href="getFileUrl(setting.value)" target="_blank"
                      >مشاهده</a
                    >
                  </small>
                </template>

                <!-- Handle Textarea Fields -->
                <template
                  v-else-if="
                    [
                      'about_us_description_fa',
                      'about_us_description_en',
                    ].includes(setting.key)
                  "
                >
                  <textarea
                    class="form-control"
                    v-model="setting.value"
                    :placeholder="`Enter ${setting.key}`"
                    rows="4"
                  ></textarea>
                </template>

                <!-- Handle Text Fields -->
                <template v-else>
                  <input
                    type="text"
                    class="form-control"
                    v-model="setting.value"
                    :placeholder="`Enter ${setting.key}`"
                  />
                </template>
              </div>
              <div class="col-lg-3 mt-2">
                <BButton
                  variant="primary"
                  size="sm"
                  :disabled="loadingIds.includes(setting.id)"
                  @click="updateSetting(setting)"
                >
                  <span v-if="loadingIds.includes(setting.id)">ویرایش...</span>
                  <span v-else>ویرایش</span>
                </BButton>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </div>
    </BRow>
  </Layout>
</template>
