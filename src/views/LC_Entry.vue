<template>
    <hr>
    <div>{{ this.$store.clinic }}</div>
    <hr>
    <main class="add-lc-view font-small">
        <div class="header-row">
            <h3 class="fw-bold">Letter of Certification</h3>
            <h4>
                <div :class="`${case_missing && 'hide_div'}` ">
                    <div :class="`${!case_edit && 'hide_div'}` ">
                        <span class="badge bg-warning mode-badge"  >Edit</span>
                    </div>
                    <div :class="`${!case_add && 'hide_div'}` ">
                        <span class="badge bg-success mode-badge"  >Add</span>
                    </div>
                    <div :class="`${!case_readonly && 'hide_div'}` ">
                        <span class="badge bg-info mode-badge"  >View</span>
                    </div>
                </div>
            </h4>
        </div>
        <hr>
        <div class="bcs-docs-section">
            <div class="row">
                <div class="col-4" v-show="!isSingleClinic">
                    <label for="clinic" class="font-weight-bold">Clinic:</label>
                    <select class="form-select font-small h2rem" id="clinic" v-model="this.$store.state.clinic" aria-readonly="true">
                        <option v-for="(c,index) in this.$store.state.clinics" 
                            :value="c"
                            :key="index">
                            {{ c }}
                        </option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="facility">Facility:</label>
                    <select class="form-select font-small h2rem" id="facility" v-model="this.$store.state.facility">
                        <option v-for="(f,index) in this.$store.state.facilities" 
                            :value="f"
                            :key="index">
                            {{ f }}
                        </option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="caseNumber">Case / Account Number:</label>
                    <div class="input-group mb-3" >
                        <input type="text" class="form-control font-small h2rem" placeholder="case / account #" id="caseNumber" v-model.trim="caseNumber">
                        <button class="btn btn-primary h2rem" type="button" id="btnNext" style="margin-right: 40px;" @click="FindCase()" 
                            v-if="this.$store.state.clinic.length > 0 && this.$store.state.facility.length > 0 && caseNumber.length > 0">Next</button>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="bs-docs-section" :class="`${(case_readonly || case_missing) && 'hide_div'}` " >
            <form>
                <div class="row">
                    <div class="col-lg-4">
                        <label for="patientName">Patient Name:</label>
                        <input type="text" class="form-control font-small h2rem" placeholder="patient name" id="patientName" v-model.trim="this.$store.state.patientName">
                    </div>
                    <div class="col-lg-4">
                        <label for="admitDate">Admission Date:</label>
                        <input type="date" class="form-control font-small h2rem" placeholder="dd/mm/yyyy" id="admitDate" v-model="this.$store.state.admitDate">
                    </div>
                    <div class="col-lg-4">
                        <label for="caseNumber">Discharge Date:</label>
                        <input type="date" class="form-control font-small h2rem" placeholder="case number" id="dischargeDate" v-model="this.$store.state.dischargeDate">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <label for="caseType" class="mt-2">Case Type:</label>
                        <select class="form-select font-small h2rem" id="caseType" v-model="this.$store.state.caseType">
                            <option value="inpatient">Inpatient</option>
                            <option value="daysurgery">Day Surgery</option>
                        </select>
                    </div>
                    <div class="col-lg-8" :class="`${(case_readonly || case_missing) && 'hide_div'}` " >
                        <div class="form-group">
                            <label for="lcFile" class="mt-2">Attach LC file</label>
                            <input class="form-control font-small h2rem" type="file" id="lcFile">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>

<script>
    
    export default {
        name: 'LC',
        components: {
            
        },
        computed: {
            isSingleClinic() {
                return this.$store.state.clinics.length == 1;
            }
        },
        data() {
            return {
                case_edit: false,
                case_add: false,
                case_readonly: true,
                case_missing: true,

                isLoading: false,
                formIsValid: true,
                error: null
            }
        },
        methods: {
            FindCase() {
                this.formIsValid = true;
                if (this.$store.state.username === "" || this.$store.state.password.length < 6) {
                    this.formIsValid = false;
                    return;
                }

                this.isLoading = true;
        
                var url = "http://localhost:5147/login";
                var senddata = {
                    username: this.$store.state.username,
                    password: this.HashCode(this.$store.state.password).toString(),
                    ip_address: $("#ip_address").val()
                };

                var options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(senddata),
                };

                // console.log(data);

                fetch(url, options)
                    .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then((error) => {
                            const e = new Error(response.statusText);
                            e.data = error;
                            this.formIsValid = false;
                            throw e;
                        });
                    }
                    })
                    .then((responseData) => {
                        if (!responseData.access_token) {
                            const error = new Error(
                                responseData.message ||
                                "Failed to authenticate. Check your login information."
                            );
                            this.isLoading = false;
                            this.error = responseData.message;
                            throw error;
                        } else {

                            // retrieve user data lists
                            this.$store.state.clinics = responseData.clinics;
                            this.$store.state.facilities = responseData.facilities;
                            this.$store.state.doctors = responseData.clinicDoctors;
                            this.$store.state.procedures = responseData.procedures;

                            // set default clinic
                            if(this.$store.state.clinics.length === 1) {
                                this.$store.state.clinic = this.$store.state.clinics[0];
                            }

                            // retrieve user information
                            this.$store.state.token = responseData.access_token;
                            this.$store.state.user_id = responseData.context.userId;
                            this.$store.state.username = responseData.context.username;
                            this.$store.state.password = senddata.password;
                            this.$store.state.fullname = responseData.context.fullName;
                            this.$store.state.passwordChangeRequired = responseData.context.passwordChangeRequired;
                            this.$store.state.passwordChangeForced = responseData.context.passwordChangeRequired;

                            
                            // retrieve menu item counts
                            this.$store.state.LC_No_CM_Count = responseData.lC_No_CM_Count;
                            this.$store.state.LC_Mismatched_CM_Count = responseData.lC_Mismatched_CM_Count;

                            
                            // set login status
                            this.$store.state.isLoggedIn = true;

                            // continue to main page
                            this.isLoading = false;
                            this.$router.push("/lc_entry");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                    });

            }
        }
    }
    

</script>

<style lang="scss" scoped>
    
    form {
        border: 1px solid gainsboro;
        border-radius: 10px;
        padding: 5px;
    }

    label, .fw-bold {
        font-weight: bold;
    }

    .font-small {
        font-size: small;
    }

    .h2rem {
        height: 2.0rem;
    }
    .mode-badge {
        margin-left: 10px;
    }
    .header-row {
        display: flex;
        flex-direction: row;
    }

    .hide_div {
        visibility: hidden;
        overflow: hidden;
        height: 0px;
    }
    
</style>
