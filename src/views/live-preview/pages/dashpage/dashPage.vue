<template>
  <Layout>
    <BRow>
      <BCol md="12" class="d-flex flex-column" style="margin-top: 20px">
        <BCard
          class="flex-fill mb-3 shadow-sm"
          style="border-radius: 12px; padding: 20px; position: relative"
        >
          <BCardBody>
            <div class="text-center mb-4">
              <i
                class="ph-duotone ph-calendar"
                style="font-size: 48px; color: #007bff"
              ></i>
              <h4 class="fw-bold mt-2" style="color: #4a4a4a">جلسات امروز</h4>
            </div>

            <hr
              class="my-3"
              style="border-top: 2px solid #e9ecef; width: 80%; margin: 0 auto"
            />

            <ul class="list-unstyled">
              <li
                v-for="meet in meets"
                :key="meet.id"
                class="meeting-item mb-4 p-3 hover-effect"
                style="
                  border-radius: 8px;
                  background-color: #f8f9fa;
                  position: relative;
                "
              >
                <div
                  class="d-flex align-items-center justify-content-between mb-2"
                >
                  <div class="text-start">
                    <i
                      class="ph-duotone ph-file-text"
                      style="font-size: 1.5rem; color: #6c757d"
                    ></i>
                    <strong class="text-dark ms-2" style="font-size: 1.2rem">{{
                      meet?.subject?.subject || "بدون عنوان"
                    }}</strong>
                  </div>
                  <small class="text-muted"
                    >تاریخ ایجاد :
                    {{ convertToJalali(meet?.created_at) }}</small
                  >
                </div>

                <div
                  class="text-start text-muted mb-2"
                  style="font-size: 0.9rem"
                >
                  <i
                    class="ph-duotone ph-clock"
                    style="font-size: 1.2rem; color: #28a745"
                  ></i>
                  <span class="ms-2"
                    >از {{ meet?.az_hour }} تا {{ meet?.ta_hour }}</span
                  >
                </div>

                <div class="text-start text-muted" style="font-size: 0.9rem">
                  <small
                    >📅 تاریخ: {{ convertToJalali(meet?.date_meeting) }}</small
                  ><br />
                  <small
                    >📍 مکان:
                    {{ meet?.location?.address || "مکان نامشخص" }}</small
                  >
                </div>

                <div class="mt-2">
                  <span
                    :class="{
                      'badge bg-success': meet.status === 1,
                      'badge bg-primary': meet.status === 2,
                      'badge bg-danger': meet.status === 3,
                      'badge bg-warning': meet.status === 4,
                    }"
                    style="padding: 6px 12px; border-radius: 5px"
                  >
                    <template v-if="meet.status === 1">برگزار شده</template>
                    <template v-else-if="meet.status === 2"
                      >برنامه‌ریزی شده</template
                    >
                    <template v-else-if="meet.status === 3">لغو شده</template>
                    <template v-else-if="meet.status === 4"
                      >منتظر برگزاری</template
                    >
                  </span>
                </div>
              </li>
            </ul>

            <ul class="list-unstyled">
              <li
                v-for="meet in privateMeets"
                :key="meet.id"
                class="meeting-item mb-4 p-3 hover-effect"
                style="
                  position: relative;
                  border-radius: 8px;
                  background-color: #f8f9fa;
                "
              >
                <div
                  class="d-flex align-items-center justify-content-between mb-2"
                >
                  <div class="text-start">
                    <i
                      class="ph-duotone ph-file-text"
                      style="font-size: 1.5rem; color: #6c757d"
                    ></i>
                    <strong class="text-dark ms-2" style="font-size: 1.2rem">
                      {{ meet?.subject?.subject || "بدون عنوان" }}
                    </strong>
                  </div>
                  <small class="text-muted"
                    >تاریخ ایجاد :
                    {{ convertToJalali(meet?.created_at) }}</small
                  >
                </div>

                <div
                  class="text-start text-muted mb-2"
                  style="font-size: 0.9rem"
                >
                  <i
                    class="ph-duotone ph-clock"
                    style="font-size: 1.2rem; color: #28a745"
                  ></i>
                  <span class="ms-2"
                    >از {{ meet?.az_hour }} تا {{ meet?.ta_hour }}</span
                  >
                </div>

                <div class="text-start text-muted" style="font-size: 0.9rem">
                  <small
                    >📅 تاریخ: {{ convertToJalali(meet?.date_meeting) }}</small
                  ><br />
                  <small
                    >📍 مکان:
                    {{ meet?.location?.address || "مکان نامشخص" }}</small
                  ><br />
                  <i
                    class="ph-duotone ph-user"
                    style="font-size: 1rem; color: #6c757d"
                  ></i>
                  <small> ملاقات با: {{ meet?.visit_name || "نامشخص" }}</small
                  ><br />
                  <small>🏢 شرکت: {{ meet?.visit_company || "نامشخص" }}</small>
                  <!-- Added company name here -->
                </div>

                <div class="mt-2">
                  <span
                    :class="{
                      'badge bg-success': meet.status === 1,
                      'badge bg-primary': meet.status === 2,
                      'badge bg-danger': meet.status === 3,
                      'badge bg-warning': meet.status === 4,
                    }"
                    style="padding: 6px 12px; border-radius: 5px"
                  >
                    <template v-if="meet.status === 1">برگزار شده</template>
                    <template v-else-if="meet.status === 2"
                      >برنامه‌ریزی شده</template
                    >
                    <template v-else-if="meet.status === 3">لغو شده</template>
                    <template v-else-if="meet.status === 4"
                      >منتظر برگزاری</template
                    >
                  </span>
                </div>

                <!-- Curtain Hover Effect -->
                <div class="curtain-hover">
                  <span class="curtain-text">ملاقات</span>
                </div>
              </li>
            </ul>

            <div
              style="
                position: absolute;
                bottom: 10px;
                right: 10px;
                opacity: 0.1;
              "
            >
              <i
                class="ph-duotone ph-calendar-blank"
                style="font-size: 64px; color: #4a4a4a"
              ></i>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import Layout from "@/layout/custom.vue";
import moment from "jalali-moment";
import axios from "axios";
import { onMounted, ref } from "vue";

export default {
  name: "Dashboard",
  components: {
    Layout,
  },
  setup() {
    const token = localStorage.getItem("token");
    const url = process.env.VUE_APP_ROOT_URL;
    const meets = ref();
    const privateMeets = ref();
    const getMeet = () => {
      axios
        .get(`${url}/today-meetings`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token} `,
          },
        })
        .then((resp) => {
          console.log(resp.data.meetings);
          meets.value = resp.data.meetings;
          privateMeets.value = resp.data.private_meetings;
        });
    };

    const convertToJalali = (date) => {
      return moment(date, "YYYY-MM-DD HH:mm:ss")
        .locale("fa")
        .format("YYYY/MM/DD");
    };

    onMounted(() => {
      getMeet();
      if (!sessionStorage.getItem("logSent")) {
        axios
          .post(
            `${url}/auth-log`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} `,
              },
            }
          )
          .then(() => {
            sessionStorage.setItem("logSent", "true");
          })
          .catch((err) => {
            console.error("خطا در ارسال لاگ:", err);
          });
      }
    });
    return {
      meets,
      convertToJalali,
      privateMeets,
    };
  },
};
</script>

<style scoped>
.hover-effect {
  transition: background-color 0.3s, box-shadow 0.3s;
}
.hover-effect:hover {
  background-color: #e2e6ea;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
/* Base styles for the meeting item */
.meeting-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Curtain hover effect */
.curtain-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6),
    rgba(180, 180, 180, 0.4)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease, transform 0.3s ease;
  transform: scale(1.05); /* Slight zoom-in effect */
  border-radius: 8px;
  cursor: pointer;
}

/* Text styling for the curtain effect */
.curtain-text {
  color: #f0f0f0; /* Soft light gray text */
  font-size: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Subtle glow effect */
  opacity: 0;
  transform: translateY(30px); /* Initial position for the text */
  transition: opacity 0.4s ease, transform 0.3s ease;
}

/* Hover effect: reveal the curtain and animate the text */
.meeting-item:hover .curtain-hover {
  opacity: 1;
  visibility: visible;
  transform: scale(1); /* Remove the zoom effect */
}

.meeting-item:hover .curtain-text {
  opacity: 1;
  transform: translateY(0); /* Move the text into place */
}

/* Additional effect for a subtle "lift" when hovered */
.meeting-item:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
  transform: translateY(-5px); /* Lift effect */
}
</style>
