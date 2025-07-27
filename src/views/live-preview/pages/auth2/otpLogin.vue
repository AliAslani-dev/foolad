<script>
import Rightbar from "@/components/right-bar.vue";
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "FORGOT-PASSWORD",
  components: {
    Rightbar,
  },
  setup() {
    const url = process.env.VUE_APP_ROOT_URL;
    const verifyOtpLoading = ref(false);
    const sendOtpLoading = ref(false);
    const errors = ref({});
    const router = useRouter();
    const store = useStore();
    const mobile = ref("");
    const otpSent = ref(false);
    const timer = ref(120);
    const otpCode = ref("");
    const resendAvailable = ref(false);
    let timerInterval = null;

    const sendOtp = () => {
      if (!validateSendOtpForm()) return;
      sendOtpLoading.value = true;
      axios
        .post(`${url}/sendOtp`, { mobile: mobile.value })
        .then((resp) => {
          console.log(resp.data);
          otpSent.value = true;
          resendAvailable.value = false;
          sendOtpLoading.value = false;
          Swal.fire({
            icon: "info",
            title: "کد تایید ارسال شد",
            text: "کد تایید به شماره شما ارسال شد. لطفاً کد را قبل از منقضی شدن وارد نمایید",
            confirmButtonText: "باشه",
          });
          startTimer();
        })
        .catch((err) => {
          sendOtpLoading.value = false;
          console.log(err);
          const status = err.status;
          if (status == 429) {
            Swal.fire({
              icon: "error",
              title: "تعداد تلاش‌ها زیاد شد",
              text: "لطفاً بعداً دوباره امتحان کنید",
              confirmButtonText: "باشه",
            });
          }
          if (status == 400) {
            Swal.fire({
              icon: "warning",
              title: "کد تایید قبلاً ارسال شده",
              text: "برای این شماره، کد ورود قبلاً ارسال شده است. لطفاً کمی صبر کنید تا کد قبلی منقضی شود",
              confirmButtonText: "باشه",
            });
          }
        });
    };

    const startTimer = () => {
      timerInterval = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          clearInterval(timerInterval);
          resendAvailable.value = true;
        }
      }, 1000);
    };

    const resendOtp = () => {
      otpSent.value = false;
      otpCode.value = "";
      timer.value = 120;
      resendAvailable.value = false;
    };

    const verifyOtp = async () => {
      if (!validateVerifyOtpForm()) return;
      verifyOtpLoading.value = true;
      try {
        await store.dispatch("user/loginUser", {
          mobile: mobile.value,
          otp: otpCode.value,
        });
        console.log("worked");
        verifyOtpLoading.value = false;
        router.push({ name: "dashPage" });
      } catch (error) {
        verifyOtpLoading.value = false;
        Swal.fire({
          icon: "error",
          title: "اوه! انگار چیزی اشتباه شد",
          text: `${error.message}`,
          confirmButtonText: "باشه",
        });
      }
    };

    const validateSendOtpForm = () => {
      errors.value = {};

      if (!mobile.value) errors.value.mobile = "موبایل خود را وارد نمایید";
      return Object.keys(errors.value).length === 0;
    };

    const validateVerifyOtpForm = () => {
      errors.value = {};

      if (!mobile.value) errors.value.mobile = "موبایل خود را وارد نمایید";
      if (!otpCode.value) errors.value.otpCode = "کد ارسالی را وارد نمایید";
      return Object.keys(errors.value).length === 0;
    };

    const clearError = (field) => {
      errors.value[field] = "";
    };

    onUnmounted(() => {
      if (timerInterval) clearInterval(timerInterval);
    });

    return {
      sendOtp,
      resendOtp,
      mobile,
      otpSent,
      otpCode,
      timer,
      resendAvailable,
      verifyOtp,
      clearError,
      errors,
      validateVerifyOtpForm,
      sendOtpLoading,
      verifyOtpLoading,
    };
  },
};
</script>

<template>
  <div class="auth-main v2">
    <div class="bg-overlay bg-dark"></div>
    <div class="auth-wrapper">
      <div class="auth-sidecontent">
        <div class="auth-sidefooter">
          <BRow class="row"> </BRow>
        </div>
        <img
          src="../../../../../src/assets/images/authentication/Mostafapoor-1.png"
          class="img-brand img-fluid"
          alt="images"
          style="margin-bottom: 20px"
        />
      </div>
      <div class="auth-form">
        <div class="card my-5 mx-3">
          <div class="card-body" style="direction: rtl">
            <h4 class="f-w-500 mb-1">ورود با کد یکبار مصرف</h4>

            <p class="mb-3">
              یا
              <router-link to="/login-v2" class="link-primary">
                ورود با رمز عبور
              </router-link>
            </p>

            <div class="mb-3">
              <input
                @input="clearError('mobile')"
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="شماره تماس"
                v-model="mobile"
              />
              <small v-if="errors.mobile" class="text-danger">{{
                errors.mobile
              }}</small>
            </div>

            <div v-if="otpSent" class="mt-3">
              <div class="mb-3">
                <input
                  @input="clearError('otpCode')"
                  type="text"
                  class="form-control"
                  placeholder="کد ورود"
                  v-model="otpCode"
                  :disabled="timer === 0"
                />
                <small v-if="errors.otpCode" class="text-danger">{{
                  errors.otpCode
                }}</small>
              </div>
              <div>
                <p v-if="timer > 0">زمان باقی‌مانده: {{ timer }} ثانیه</p>
                <p v-else>زمان منقضی شده است.</p>
              </div>

              <div class="d-grid mt-3" v-if="otpSent && timer > 0">
                <button
                  @click="verifyOtp"
                  type="button"
                  class="btn btn-success"
                  :disabled="verifyOtpLoading"
                >
                  <span
                    v-if="verifyOtpLoading"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span v-else>ورود</span>
                </button>
              </div>
            </div>

            <div class="d-grid mt-3">
              <button
                v-if="!otpSent && !resendAvailable"
                @click="sendOtp"
                type="button"
                class="btn btn-primary"
                :disabled="sendOtpLoading"
              >
                <span
                  v-if="sendOtpLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-else> ارسال کد ورود </span>
              </button>

              <div class="d-grid mt-3" v-if="resendAvailable && otpSent">
                <button
                  @click="resendOtp"
                  type="button"
                  class="btn btn-primary"
                >
                  ارسال مجدد کد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Rightbar />
</template>
