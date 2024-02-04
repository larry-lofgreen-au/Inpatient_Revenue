import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";
import Typeahead from "./components/Typeahead.vue";

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
            
            // lc data entry items
            clinic: "",
            
            // lc data response
            lcData: null,

            // menu badge items
            LC_No_CM_Count: 0,
            LC_Mismatched_CM_Count: 0,
            
            // data lists
            clinics: [],
            facilities: [],
            doctors: [],
            tospSearch:[],

            // Selection Results
            tospSelect: "",

            // API URLs
            apiUrl: "http://localhost:5147/",
            apiChangePassword: "http://localhost:5147/changePassword",
            apiFileInfo: "http://localhost:5147/File/info",
            apiFileUploadStream: "http://localhost:5147/File/uploadStream",
            apiFindLC: "http://localhost:5147/findLC",
            apiLogin: "http://localhost:5147/login",
            apiSubmitLC: "http://localhost:5147/submitLC",

            // Row IDs
            letterId: "",
            memoId: "",

        };
    },
    mutations: {
        increment(state) {
        state.count++;
        },
    },
});

const app = createApp(App);

app.component('Typeahead', Typeahead);
app.use(store);
app.use(router);

app.component("side-bar", SideBar);

app.mount("#app");
