<script>
import Layout from "@/layout/custom.vue";
import addLocation from "../../../components/modals/addLocation.vue";
import axios from "axios";
import moment from "jalali-moment";
import { onMounted, ref , watch } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Swal from "sweetalert2";
import editLocation from "@/components/modals/editLocation.vue";
const token = localStorage.getItem("token");
const url = process.env.VUE_APP_ROOT_URL;
export default {
  name: "BORDER",
  components: {
    Layout,
    addLocation,
    editLocation,
  },
  setup() {
    const filterLoading = ref(false)
    const searchQuery = ref(""); // Added search query ref
    const locations = ref();
    const address = ref();
    const en_address = ref();
    const locationId = ref();
    const convertToJalali = (date) => {
      return moment(date, "YYYY-MM-DD HH:mm:ss")
        .locale("fa")
        .format("YYYY/MM/DD");
    };
    const getLocations = (searchQuery) => {
      filterLoading.value = true
      axios
        .get(`${url}/admin/locations?search=${searchQuery?.value || ""}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          filterLoading.value = false
          locations.value = resp.data;
          console.log(locations.value);
        }).catch(()=>{
          filterLoading.value = false
        })
    };

    const handleLocationUpdate = () => {
      location.reload();
    };
    const deleteLocation = (id, address) => {
      // Accept id as a parameter
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
              toast.success("موقعیت با موفقیت حذف شد", {
                position: "top-right",
                autoClose: 3000,
              });
              locations.value = locations.value.filter(
                (location) => location.id !== id
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

    const modalData = (fa, en, id) => {
      address.value = fa;
      en_address.value = en;
      locationId.value = id;
    };

    watch( searchQuery, () => {
      getLocations(searchQuery);
    });

    onMounted(() => {
      getLocations();
    });
    return {
      locations,
      convertToJalali,
      handleLocationUpdate,
      modalData,
      address,
      en_address,
      locationId,
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
                data-bs-target="#addLocation"
                class="btn btn-light text-primary btn-sm px-3"
              >
                افزودن مکان
              </button>
            </div>
          </div>
          <div v-if="!filterLoading" class="card-body table-border-style p-0">
            <div class="table-responsive">
              <table class="table table-hover table-bordered m-0" dir="rtl">
                <thead class="table-light">
                  <tr>
                    <th>شناسه</th>
                    <th>آدرس</th>
                    <th>آدرس به انگلیسی</th>
                    <th>تاریخ ایجاد</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="location in locations" :key="location.id">
                    <td>{{ location.id }}</td>
                    <td>{{ location.address }}</td>
                    <td>{{ location.address_en }}</td>
                    <td>{{ convertToJalali(location.created_at) }}</td>
                    <td>
                      <button
                        @click="
                          modalData(
                            location?.address,
                            location?.address_en,
                            location.id
                          )
                        "
                        data-bs-toggle="modal"
                        data-bs-target="#editLocation"
                        class="btn btn-sm btn-outline-warning me-1"
                      >
                        ویرایش
                      </button>
                      <button
                        @click="deleteLocation(location.id, location.address)"
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
          <div
          v-else
          class="filter-loader card table-card user-profile-list"
        ></div>
        </div>
      </div>
      <addLocation @user-updated="handleLocationUpdate()" />
      <editLocation
        :address="address"
        :en_address="en_address"
        :id="locationId"
        @user-updated="handleLocationUpdate()"
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
