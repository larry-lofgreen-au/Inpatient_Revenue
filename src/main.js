import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";

import router from "./router/router";
import SideBar from "./components/SideBar.vue";

const store = createStore({
    state() {
        return {
            token: null,
            user_id: null,
            username: null,
            password: null,
            fullname: null,
            passwordChangeRequired: false,
            passwordChangeForced: false,
            isLoggedIn: false,
            clinic: "",
            clinicList: [],
            facility: "",
            facilityList: [],
            doctor: "",
            doctorList: [],
            procedure: "",
            procedureList: [],
            LC_No_CM_Count: 0,
            LC_Mismatched_CM_Count: 0,
        };
    },
    mutations: {
        increment(state) {
        state.count++;
        },
    },
});

const app = createApp(App);

app.use(store);
app.use(router);

app.component("side-bar", SideBar);

app.mount("#app");
