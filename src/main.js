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
            
            
            // menu badge items
            LC_No_CM_Count: 0,
            LC_Mismatched_CM_Count: 0,
            
            // data lists
            clinics: [],
            facilities: [],
            doctors: [],
            tospSearch:[],

              // Typeahead data
              tospSearch: [],
              doctorSearch: [],


            // Local API URLs
           
            /*
            apiUrl: "http://localhost:5147/",
            apiChangePassword: "http://localhost:5147/changePassword",
            apiFileInfo: "http://localhost:5147/File/info",
            apiFileUploadStream: "http://localhost:5147/File/uploadStream",
            apiFindLC: "http://localhost:5147/findLC",
            apiLC_No_CM: "http://localhost:5147/LC_No_CM",
            apiLC_No_Matching_CM: "http://localhost:5147/LC_No_Matching_CM",
            apiLogActivity: "http://localhost:5147/LogActivity",
            apiLogin: "http://localhost:5147/login",
            apiSubmitCM: "http://localhost:5147/submitCM",
            apiSubmitLC: "http://localhost:5147/submitLC",
            */

            // Azure API URLs
            apiUrl: "https://sh-cms-api-default.azurewebsites.net/",
            apiChangePassword: "https://sh-cms-api-default.azurewebsites.net/changePassword",
            apiFileInfo: "https://sh-cms-api-default.azurewebsites.net/File/info",
            apiFileUploadStream: "https://sh-cms-api-default.azurewebsites.net/File/uploadStream",
            apiFindLC: "https://sh-cms-api-default.azurewebsites.net/findLC",
            apiLC_No_CM: "https://sh-cms-api-default.azurewebsites.net/LC_No_CM",
            apiLC_No_Matching_CM: "https://sh-cms-api-default.azurewebsites.net/LC_No_Matching_CM",
            apiLogActivity: "https://sh-cms-api-default.azurewebsites.net/LogActivity",
            apiLogin: "https://sh-cms-api-default.azurewebsites.net/login",
            apiSubmitCM: "https://sh-cms-api-default.azurewebsites.net/submitCM",
            apiSubmitLC: "https://sh-cms-api-default.azurewebsites.net/submitLC",
            // Row IDs
            letterId: "",
            memoId: "",

            // LCs no CM
            lc_no_cm_data:[],
            lc_no_matching_cm_data:[],
            cm_index: 0,
            cm_Amount: 0, 
            cm_Amount_Tested: null,
            cm_fileUri: "",

            // Cross View Data
            letterId_to_load:""
            
        };
    },
    mutations: {
        increment(state) {
        state.count++;
        },
    },
});


const CalcAging = (input) => {
    const today = new Date();
    const baseDate = new Date(input);
    const ageInDays = today - baseDate;
    return ageInDays;
}
const LogActivity = (activityCD, activityData) => {
    
    const url = store.state.apiLogActivity;
    const senddata =
    {
        userId: store.state.user_id,
        activityId: activityCD,
        activityData: activityData
    };
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": store.state.token,
        },
        body: JSON.stringify(senddata),
    };

    fetch(url, options).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then((error) => {
                const e = new Error(response.statusText);
                e.data = error;
                if(response.status == 401) {
                    store.state.isLoggedIn = false;
                }
                else {
                    throw e;
                }
            });
        }
        }).then((responseData) => {}).catch((error) => {
            console.log(error);
        });
};
const app = createApp(App);

app.component('Typeahead', Typeahead);
app.use(store);
app.use(router);

app.component("side-bar", SideBar);

app.mount("#app");
