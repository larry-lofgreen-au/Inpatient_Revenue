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
            apiLCnoCM: "http://localhost:5147/LCnoCM",
            apiLogActivity: "http://localhost:5147/LogActivity",
            apiLogin: "http://localhost:5147/login",
            apiSubmitCM: "http://localhost:5147/submitLC",
            apiSubmitLC: "http://localhost:5147/submitLC",
            

            // Row IDs
            letterId: "",
            memoId: "",

            // Saved LC Data
            savedFacility: null,
            savedCaseAccountNumber: null,
            savedTotalHospitalCollectDisplay: null,

            // LC Data Entry & LC Form Control
                // data entry - top
            facility: "Mount Elizabeth",
            caseAccountNumber: "2022108239",

                // data entry - middle
            patientName: "Unknown",
            admitDate: "2022-12-29",
            dischargeDate: "2023-01-05",
            caseType: "inpatient",
            LC_fileUri: null,

                // data entry - bottom
            tosp: "SB716K",
            doctor: "Pheng",
            totalFees: 28589.76,
            consultantFees: 3200,
            procedureFees: 12000,  
            totalIncludesGST: false, 
            gstWaived: false,
            nonSurgical: false,
            
            fees: [],
            
            // LCs no CM
            lc_no_cm_data:[],
            cm_index: 0,
            cm_Amount: 0, 
            cm_Amount_Tested: null,
            cm_fileUri: ""
            
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
