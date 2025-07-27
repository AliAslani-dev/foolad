<script>
export default {
  name: "NAVBAR",
  components: {},
  data() {
    return {
      isFullscreen: false,
      isSidebarHidden: false,
      currentMode: "light",
      show: false,
    };
  },
  mounted() {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      this.changeMode(savedMode); // Apply the saved theme mode
    }
    // Add event listener for keydown events
    document.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    // Remove event listener when component is unmounted
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    handleSearch(event) {
      console.log("handleSearch called");
      // Prevent the default action (e.g., browser search)
      event.preventDefault();
    },
    handleKeyDown(event) {
      console.log("handleKeyDown called", event.key, event.ctrlKey);
      // Check if Ctrl+K is pressed
      if (event.ctrlKey && event.key === "k") {
        // Prevent the default action (e.g., browser search)
        event.preventDefault();
        console.log("Ctrl+K detected");
        // Focus on the search input field
        const searchInput = document.querySelector("#serchFildid");
        if (searchInput) {
          console.log("Search input found, focusing");
          searchInput.focus();
        } else {
          console.log("Search input not found");
        }
      }
    },
 
    changeMode(mode) {
      this.currentMode = mode;
      localStorage.setItem("themeMode", mode); // Save the selected mode
      if (mode === "dark") {
        document.body.setAttribute("data-pc-theme", "dark");
        document.body.setAttribute("data-topbar", "dark");
        document.body.classList.remove("mode-auto");
      } else if (mode === "auto") {
        document.body.setAttribute("data-pc-theme", "light");
        document.body.setAttribute("data-topbar", "light");
        document.body.classList.add("mode-auto");
      } else {
        document.body.setAttribute("data-pc-theme", "light");
        document.body.setAttribute("data-topbar", "light");
        document.body.classList.remove("mode-auto");
      }
    },
    toggleSidebar() {
      this.$store.commit("toggleSidebar");
    },
    toggleMobileSidebar() {
      this.$store.commit("toggleMobileSidebar");
    },
    toggleRightSidebar() {
      this.$emit("toggleRightSidebar"); // Emit an event to toggle the right sidebar
    },
  },
};
</script>

<template>
  <div class="header-wrapper">
    <!-- [Mobile Media Block] start -->
    <div class="me-auto pc-mob-drp">
      <ul class="list-unstyled">
        <!-- ======= Menu collapse Icon ===== -->
        <!-- <li class="pc-h-item pc-sidebar-collapse">
          <a
            href="#"
            class="pc-head-link ms-0"
            id="sidebar-hide"
            @click="toggleSidebar"
          >
            <i class="ti ti-menu-2"></i>
          </a>
        </li> -->
        <!-- <li class="pc-h-item pc-sidebar-popup">
          <a
            href="#"
            class="pc-head-link ms-0"
            id="mobile-collapse"
            @click="toggleMobileSidebar"
          >
            <i class="ti ti-menu-2"></i>
          </a>
        </li> -->
      </ul>
    </div>
    <div class="ms-auto">
      <ul class="list-unstyled">
        <BDropdown
          variant="transparent"
          class="pc-h-item"
          toggle-class="text-reset dropdown-btn pc-head-link arrow-none p-0"
          menu-class="dropdown-menu-end"
          aria-haspopup="true"
          :offset="{ alignmentAxis: -150, crossAxis: 0, mainAxis: 20 }"
        >
          <template #button-content
            ><span class="text-muted pc-head-link"
              ><i
                :class="
                  currentMode === 'dark'
                    ? 'ph-duotone ph-moon'
                    : currentMode === 'light'
                    ? 'ph-duotone ph-sun-dim'
                    : 'ph-duotone ph-cpu'
                "
              ></i
            ></span>
          </template>
          <a href="#!" class="dropdown-item" @click="changeMode('dark')">
            <i class="ph-duotone ph-moon"></i>
            <span>Dark</span>
          </a>
          <a href="#!" class="dropdown-item" @click="changeMode('light')">
            <i class="ph-duotone ph-sun-dim"></i>
            <span>Light</span>
          </a>
         
        </BDropdown>
      </ul>
    </div>
  </div>
</template>
