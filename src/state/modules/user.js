import axios from "axios";
const url = process.env.VUE_APP_ROOT_URL;

const state = {
  user: null,
  loading: false,
};

export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },

  SET_TOKEN(state, token) {
    state.token = token;
  },

  LOGOUT(state) {
    state.user = null;
  },
};

export const actions = {
  async loginUser({ commit }, credentials) {
    console.log(url);
    try {
      const { data } = await axios.post(`${url}/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!data) {
        throw new Error("شماره موبایل یا رمز عبور اشتباه است");
      }

      commit("SET_TOKEN", data.token);
      localStorage.setItem("token", data.token);
      console.log("token from api", data.token);
    } catch (error) {
      console.log(error);
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.msg ||
          "ورود با مشکل مواجه شد ...! لطفا دوباره امتحان کنید"
      );
    } finally {
      commit("SET_LOADING", false);
    }
  },

  logout({ commit }) {
    commit("LOGOUT");
    localStorage.removeItem("token");
  },

  async verifyLogin({ commit }) {
    const token = localStorage.getItem("token");
    if (!token) {
      commit("LOGOUT");
      console.log("Token is not existed");
      return;
    }

    try {
      const { data } = await axios.get(`${url}/admin/checkLogin`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = {
        id: data.id,
        name: data.name,
        mobile: data.mobile,
        role: data.role,
        access : data.access
      };

      commit("SET_USER", userData);
      commit("SET_TOKEN", token);
    } catch (error) {
      console.error(
        "Token validation failed:",
        error.response || error.message
      );
      commit("LOGOUT");
    } finally {
      commit("SET_LOADING", false);
    }
  },

  loadUserFromLocalStorage({ commit }) {
    const token = localStorage.getItem("token");

    if (token) {
      commit("SET_TOKEN", token);
    }
  },
};

export const getters = {
  getUser(state) {
    return state.user;
  },
  getToken(state) {
    return state.token;
  },
  isAuthenticated(state) {
    return !!state.user && !!state.token;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
