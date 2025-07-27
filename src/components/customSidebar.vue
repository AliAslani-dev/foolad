<script>
import { onMounted, onUnmounted, ref } from "vue";

import simplebar from "simplebar-vue";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  data() {
    return {
      url: "",
      token: "",
    };
  },
  setup() {
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const logo = ref();
    const settings = ref();
    const getSettings = () => {
      axios
        .get(`${url}/settings`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          settings.value = resp.data.data;

          // Filter the logo setting
          const logoSetting = settings.value.find(
            (setting) => setting.key === "logo"
          );

          // If logoSetting exists, extract the value
          if (logoSetting) {
            logo.value = logoSetting.value;
            console.log(logo.value); // Logs the logo value (filename)
          } else {
            console.log("Logo setting not found.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    onMounted(() => {
      const observer = new MutationObserver(() => {});
      getSettings();
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-pc-theme"],
      });

      onUnmounted(() => {
        observer.disconnect();
      });
    });

    return {
      settings,
      logo,
    };
  },
  components: {
    simplebar,
  },
  methods: {
    logOut() {
      console.log("h");

      Swal.fire({
        text: "آیا مطمعن هستید برای خروج از حساب کاربری!؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله خارجم کن! ",
        cancelButtonText: "خیر",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              `${this.url}/admin/logout`,
              {},
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.token} `,
                },
              }
            )
            .then(() => {
              console.log("hi");
              localStorage.setItem("token", "");
              this.$router.push("/login-v2");
            });
        }
      });
    },
    changeLayoutType(layoutType) {
      this.$store.commit("changeLayoutType", { layoutType });

      document.body.setAttribute("data-pc-layout", layoutType);
    },
  },
  computed: {
    layoutType: {
      get() {
        return this.$store.state.layout.layoutType;
      },
      set(layoutType) {
        this.$store.commit("changeLayoutType", { layoutType });
      },
    },
    user() {
      return this.$store.getters["user/getUser"]; // Accessing user information from Vuex store
    },
  },
  watch: {
    layoutType: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "horizontal":
              document.body.setAttribute("data-pc-layout", "horizontal");
              break;
            case "vertical":
              document.body.setAttribute("data-pc-layout", "vertical");
          }
        }
      },
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");

    this.url = process.env.VUE_APP_ROOT_URL;
    console.log(this.user);
    const activeListItem = document.querySelector("li.active");
    if (activeListItem) {
      const parentElementOrSelf = activeListItem?.parentElement
        ? activeListItem.parentElement
        : activeListItem;
      if (
        parentElementOrSelf &&
        !parentElementOrSelf.classList.contains("pc-navbar")
      ) {
        const closestItem =
          parentElementOrSelf.parentElement.closest(".pc-item");
        if (closestItem) {
          closestItem.classList.add("active");
          closestItem.children[1].classList.add("show");
        }
      }

      /**
       * Sidebar menu collapse
       */
      if (document.querySelectorAll(".navbar-content .collapse")) {
        let collapses = document.querySelectorAll(".navbar-content .collapse");

        collapses.forEach((collapse) => {
          // Hide sibling collapses on `show.bs.collapse`
          collapse.addEventListener("show.bs.collapse", (e) => {
            e.stopPropagation();
            let closestCollapse = collapse.parentElement.closest(".collapse");
            if (closestCollapse) {
              let siblingCollapses =
                closestCollapse.querySelectorAll(".collapse");
              siblingCollapses.forEach((siblingCollapse) => {
                if (siblingCollapse.classList.contains("show")) {
                  siblingCollapse.classList.remove("show");
                  siblingCollapse.parentElement.firstChild.setAttribute(
                    "aria-expanded",
                    "false"
                  );
                }
              });
            } else {
              let getSiblings = (elem) => {
                // Setup siblings array and get the first sibling
                let siblings = [];
                let sibling = elem.parentNode.firstChild;
                // Loop through each sibling and push to the array
                while (sibling) {
                  if (sibling.nodeType === 1 && sibling !== elem) {
                    siblings.push(sibling);
                  }
                  sibling = sibling.nextSibling;
                }
                return siblings;
              };
              let siblings = getSiblings(collapse.parentElement);
              siblings.forEach((item) => {
                if (item.childNodes.length > 2) {
                  item.firstElementChild.setAttribute("aria-expanded", "false");
                  item.firstElementChild.classList.remove("active");
                }
                let ids = item.querySelectorAll("*[id]");
                ids.forEach((item1) => {
                  item1.classList.remove("show");
                  item1.parentElement.firstChild.setAttribute(
                    "aria-expanded",
                    "false"
                  );
                  item1.parentElement.firstChild.classList.remove("active");
                  if (item1.childNodes.length > 2) {
                    let val = item1.querySelectorAll("ul li a");

                    val.forEach((subitem) => {
                      if (subitem.hasAttribute("aria-expanded"))
                        subitem.setAttribute("aria-expanded", "false");
                    });
                  }
                });
              });
            }
          });

          // Hide nested collapses on `hide.bs.collapse`
          collapse.addEventListener("hide.bs.collapse", (e) => {
            e.stopPropagation();
            let childCollapses = collapse.querySelectorAll(".collapse");
            childCollapses.forEach((childCollapse) => {
              let childCollapseInstance = childCollapse;
              childCollapseInstance.classList.remove("show");
              childCollapseInstance.parentElement.firstChild.setAttribute(
                "aria-expanded",
                "false"
              );
            });
          });
        });
      }
    } else {
      console.error("No list item with class 'active' found.");
    }
  },
};
</script>

<template>
  <div class="navbar-wrapper" id="navbar-wrapper">
    <div class="header-wrapper">
      <!-- Logo Section -->
      <div class="logo-link">
        <div class="logo-container">
          <img
            :src="`https://api.nghsco.com/storage/statics/${logo}`"
            alt="logo"
            class="logo-img"
          />
        </div>
      </div>
    </div>

    <simplebar data-simplebar class="navbar-content pc-trigger">
      <ul class="pc-navbar">
        <li
          class="pc-item"
          :class="{ active: this.$route.path === '/dashPage' }"
        >
          <router-link to="/dashPage" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-gauge"></i>
            </span>
            <span class="pc-mtext">داشبورد</span>
          </router-link>
        </li>

        <li
          v-if="this.user?.access.includes(`user`) || this.user?.role == 0"
          class="pc-item"
          :class="{ active: this.$route.path === '/users' }"
        >
          <router-link to="/users" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-user-circle"></i>
            </span>
            <span class="pc-mtext">کاربران</span>
          </router-link>
        </li>
        <li
          v-if="this.user?.access.includes(`locations`) || this.user?.role == 0"
          class="pc-item"
          :class="{ active: this.$route.path === '/locations' }"
        >
          <router-link to="/locations" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-map-pin"></i>
            </span>
            <span class="pc-mtext">لوکیشن ها</span>
          </router-link>
        </li>
        <li
          v-if="this.user?.access.includes(`subjects`) || this.user?.role == 0"
          class="pc-item"
          :class="{ active: this.$route.path === '/subjects' }"
        >
          <router-link to="/subjects" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-folder"></i>
            </span>
            <span class="pc-mtext">موضوع‌ها</span>
          </router-link>
        </li>

        <li
          v-if="this.user?.access.includes(`meeting`) || this.user?.role == 0"
          class="pc-item"
          :class="{ active: this.$route.path === '/meetings' }"
        >
          <router-link to="/meetings" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-handshake"></i>
            </span>
            <span class="pc-mtext">جلسات</span>
          </router-link>
        </li>

        <li
          v-if="
            this.user?.access.includes(`private_meeting`) ||
            this.user?.role == 0
          "
          class="pc-item"
          :class="{ active: this.$route.path === '/privateMeets' }"
        >
          <router-link to="/privateMeets" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-briefcase"></i>
            </span>
            <span class="pc-mtext">ملاقات ها</span>
          </router-link>
        </li>

        <li
          v-if="this.user?.access.includes(`note`) || this.user?.role == 0"
          class="pc-item"
          :class="{ active: this.$route.path === '/notes' }"
        >
          <router-link to="/notes" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-note-pencil"></i>
            </span>
            <span class="pc-mtext">یادداشت ها</span>
          </router-link>
        </li>

        <li
          class="pc-item"
          :class="{ active: this.$route.path === '/reports' }"
        >
          <router-link to="/reports" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-file-text"></i>
            </span>
            <span class="pc-mtext">گزارشات</span>
          </router-link>
        </li>

        <li
          v-if="this.user?.access.includes(`logs`) || this.user?.role == 0"
          class="pc-item"
          :class="{ active: this.$route.path === '/logs' }"
        >
          <router-link to="/logs" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-clipboard"></i>
            </span>
            <span class="pc-mtext">لاگ ها</span>
          </router-link>
        </li>

        <li
          v-if="this.user?.access.includes(`settings`) || this.user?.role == 0"
          class="pc-item"
          :class="{ active: this.$route.path === '/setting' }"
        >
          <router-link to="/setting" class="pc-link">
            <span class="pc-micon">
              <i class="ph-duotone ph-gear"></i>
            </span>
            <span class="pc-mtext">تنظیمات</span>
          </router-link>
        </li>
      </ul>
    </simplebar>

    <BCard no-body class="pc-user-card">
      <BCardBody>
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0">
            <img
              src="@/assets/images/user/avatar-1.jpg"
              alt="user-image"
              class="user-avtar wid-45 rounded-circle"
            />
          </div>
          <div class="flex-grow-1 ms-3 me-2">
            <h6 class="mb-0">{{ user?.name }}</h6>
            <small>{{ user?.mobile }}</small>
          </div>
          <BDropdown variant="purple" dropup no-caret toggle-class="p-0">
            <template v-slot:button-content>
              <span
                class="btn btn-icon btn-link-secondary avtar arrow-none p-0 dropdown-toggle"
              >
                <i class="ph-duotone ph-windows-logo"></i>
              </span>
            </template>
            <BCol @click="logOut">
              <BDropdownItem
                class="pc-user-links d-flex align-items-center p-0"
              >
                <BRow class="align-items-center">
                  <BCol class="col-auto pe-2">
                    <i class="ph-duotone ph-power"></i>
                  </BCol>
                  <BCol class="col">
                    <span>خروج از حساب</span>
                  </BCol>
                </BRow>
              </BDropdownItem>
            </BCol>
            <router-link
              to="/editProfile"
              class="text-decoration-none text-gray-100"
            >
              <BDropdownItem
                class="pc-user-links d-flex align-items-center p-0"
              >
                <BRow class="align-items-center">
                  <BCol class="col-auto pe-2">
                    <i class="ph-duotone ph-user-circle"></i>
                  </BCol>
                  <BCol class="col">
                    <span>ویرایش پروفایل</span>
                  </BCol>
                </BRow>
              </BDropdownItem>
            </router-link>
          </BDropdown>
        </div>
      </BCardBody>
    </BCard>
  </div>
</template>
<style scoped>
.header-wrapper {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container {
  width: 100px; /* Set the container width */
  height: 100px; /* Set the container height to make it square */
  display: flex;
  justify-content: center; /* Center the image horizontally */
  align-items: center; /* Center the image vertically */
}

.logo-img {
  width: 100%; /* Make the image fill the container width */
  height: 100%; /* Make the image fill the container height */
  object-fit: cover; /* Ensure the image covers the area without distortion */
  border-radius: 50%; /* Make the image circular */
}
</style>
