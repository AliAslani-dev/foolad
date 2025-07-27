<script>
import Layout from "@/layout/custom.vue";
import editUser from "@/components/modals/editUser.vue";
import addUser from "../../../components/modals/addUser.vue";
import axios from "axios";
import Swal from "sweetalert2";
import { onMounted, ref, watch ,computed } from "vue";
import { useStore } from "vuex"
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import moment from "jalali-moment";
export default {
  name: "SAMPLE-PAGE",
  components: {
    Layout,
    addUser,
    editUser,
  },
  setup() {
    const store = useStore();
    const userType = ref("");
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const filterLoading = ref(false);
    const searchQuery = ref();
    const userId = ref();
    const userName = ref();
    const userMobile = ref();
    const userRole = ref();
    const userAccess = ref([]);
    const logedInUser = computed(() => store.getters["user/getUser"]);
    const users = ref([]);
    const convertToJalali = (date) => {
      return moment(date, "YYYY-MM-DD HH:mm:ss")
        .locale("fa")
        .format("YYYY/MM/DD");
    };
    const blockUser = (id, name) => {
      // Accept id as a parameter
      Swal.fire({
        text: `می خواهید ${name}  را بلاک کنید؟`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get(`${url}/admin/block-user/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            })
            .then(() => {
              toast.success("کاربر با موفقیت بلاک شد.", {
                position: "top-right",
                autoClose: 3000,
              });
              getUsers();
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در بلاک کردن کاربر پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };
    const unblockUser = (id, name) => {
      // Accept id and name as parameters
      Swal.fire({
        text: `آیا می خواهید ${name} را آنبلاک کنید؟`, // Confirmation message for unblocking
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله!",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get(`${url}/admin/unblock-user/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then(() => {
              toast.success("کاربر با موفقیت آنبلاک شد.", {
                position: "top-right",
                autoClose: 3000,
              });
              getUsers();
            })
            .catch((err) => {
              console.log(err);
              toast.error("مشکلی در آنبلاک کردن کاربر پیش آمد", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        }
      });
    };
    const getUsers = (searchQuery) => {
      filterLoading.value = true;
      axios
        .get(
          `${url}/admin/users?search=${searchQuery?.value || ""}&role=${
            userType?.value
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
          console.log(resp);

          users.value = resp.data;
          console.log(users.value);
        })
        .catch((error) => {
          filterLoading.value = false;
          console.error("Error fetching users:", error);
        });
    };

    watch(searchQuery, () => {
      getUsers(searchQuery);
    });

    watch(userType, () => {
      getUsers(userType);
    });

    const modalData = (mobile, name, role, id, access) => {
      userId.value = id;
      userAccess.value = access;
      userName.value = name;
      userRole.value = role;
      userMobile.value = mobile;
      console.log(userAccess.value);
    };

    const handleUserUpdated = () => {
      location.reload();
    };

    const handleUserType = (role) => {
      userType.value = role;
      console.log(userType.value);
    };

    onMounted(() => {
      getUsers();
    });

    return {
      users,
      convertToJalali,
      blockUser,
      unblockUser,
      handleUserUpdated,
      modalData,
      userName,
      userMobile,
      userRole,
      userAccess,
      userId,
      searchQuery,
      filterLoading,
      userType,
      handleUserType,
      logedInUser
    };
  },
};
</script>

<template>
  <Layout>
    <BRow>
      <div class="col-sm-12">
        <!-- Search, Filter, and Add User Row -->
        <div class="container p-4 shadow bg-light rounded">
          <!-- Top Controls Section -->
          <div
            class="d-flex justify-content-between align-items-center mb-2 gap-3"
          >
            <!-- Search Bar -->
            <div class="search-bar flex-grow-1">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control search-input"
                placeholder="نام کاربر را جستجو کنید..."
              />
            </div>
  

            <!-- Filter Buttons -->
            <div class="filter-buttons d-flex gap-4">
              <button
                class="btn btn-filter"
                :class="{ active: userType == '' }"
                @click="handleUserType(``)"
              >
                همه
              </button>
              <button
                class="btn btn-filter"
                :class="{ active: userType == 1 }"
                @click="handleUserType(1)"
              >
                کاربر
              </button>
              <button
                class="btn btn-filter"
                :class="{ active: userType == 2 }"
                @click="handleUserType(2)"
              >
                اپراتور
              </button>
              <button
                class="btn btn-filter"
                :class="{ active: userType === 0 }"
                @click="handleUserType(0)"
              >
                مدیر
              </button>
              <router-link to="/addUser" class="btn btn-primary add-user-btn">
                اضافه کردن کاربر
              </router-link>
            </div>
          </div>
        </div>

        <!-- User Table -->
        <div v-if="!filterLoading" class="card table-card user-profile-list">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="pc-dt-simple">
                <thead>
                  <tr>
                    <th>نام</th>
                    <th>نوع کاربر</th>
                    <th>موبایل</th>
                    <th>تاریخ ثبت نام</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>
                      <div class="d-inline-block align-middle">
                        <img
                          src="@/assets/images/user/avatar-1.jpg"
                          alt="user image"
                          class="img-radius align-top m-r-15"
                          style="
                            width: 50px;
                            height: 50px;
                            object-fit: cover;
                            border: 1px solid #ddd;
                            border-radius: 50%;
                          "
                        />
                        <div class="d-inline-block">
                          <h6 class="mt-4">{{ user.name }}</h6>
                        </div>
                      </div>
                    </td>

                    <td v-if="user.role == 0" data-bs-toggle="modal">مدیر</td>

                    <td v-else-if="user.role == 1">کاربر</td>

                    <td v-else-if="user.role == 2">اپراتور</td>

                    <td>{{ user.mobile }}</td>

                    <td>
                      {{ convertToJalali(user.created_at) }}
                    </td>

                    <td>
                      <span
                        v-if="user.is_block == 0"
                        class="badge bg-light-success"
                        >غیر مسدود</span
                      >
                      <span
                        v-if="user.is_block == 1"
                        class="badge bg-light-danger"
                        >مسدود شده</span
                      >
                      <div class="overlay-edit">
                        <ul class="list-inline mb-0">
                          <li class="list-inline-item m-0">
                            <router-link
                              :to="{
                                name: 'editUser',
                                params: { id: user.id },
                              }"
                              class="avtar avtar-s btn btn-primary"
                            >
                              <i class="ti ti-pencil f-18"></i>
                            </router-link>
                          </li>
                          <li class="list-inline-item m-0">
                            <a
                              class="avtar avtar-s btn bg-white btn-link-danger"
                            >
                              <i
                                v-if="user.is_block == 0"
                                @click="blockUser(user.id, user.name)"
                                class="ti ti-ban f-18"
                                style="color: red"
                              ></i>
                              <i
                                v-if="user.is_block == 1"
                                @click="unblockUser(user.id, user.name)"
                                class="ti ti-check f-18"
                                style="color: green"
                              >
                                <!-- You can change color as needed -->
                              </i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="users?.length === 0">
                    <td colspan="5" class="text-center">
                      <p class="no-users-message">کاربرى یافت نشد</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          v-else
          class="filter-loader card table-card user-profile-list"
        ></div>
        <addUser @user-updated="handleUserUpdated" :users="users" />
        <editUser
          :mobile="userMobile"
          :id="userId"
          :name="userName"
          :role="userRole"
          :access="userAccess"
          @user-updated="handleUserUpdated"
        />
      </div>
    </BRow>

    <!-- Loader -->
    <div class="loader" id="show-loader">
      <div class="p-4 text-center">
        <div class="custom-loader"></div>
        <h2 class="my-3 f-w-400">در حال بارگزاری..</h2>
        <p class="mb-0">
          لطفا تا زمانی که صفحه به طور کامل بارگزاری شود صبر کنید...
        </p>
      </div>
    </div>
  </Layout>
</template>

<style>
.search-input {
  border-radius: 25px;
  padding: 8px 16px;
  font-size: 1rem;
}

.filter-buttons .btn-filter {
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 6px 12px;
  background-color: #f8f9fa;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.filter-buttons .btn-filter.active,
.filter-buttons .btn-filter:hover {
  background-color: #007bff;
  color: #fff;
}

.add-user-btn {
  border-radius: 25px;
  padding: 6px 16px;
  font-size: 1rem;
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
