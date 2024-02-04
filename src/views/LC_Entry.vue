<template>
    <main class="add-lc-view">
        <div class="header-row">
            <h3 class="fw-bold">Letter of Certification</h3>
            <h4>
                <div v-if="show_detail">
                    <div v-if="case_edit">
                        <span class="badge rounded-pill bg-primary mode-badge"  >Edit</span>
                    </div>
                    <div v-if="case_add">
                        <span class="badge rounded-pill bg-primary  mode-badge"  >Add</span>
                    </div>
                </div>
            </h4>
        </div>
        <hr>
        <div class="bcs-docs-section">
            <div class="spinner" v-if="isLoading"></div>
            <form id="searchForm">
                <div class="row">
                    <div class="col-4" v-show="!IsSingleClinic">
                        <label for="clinic" class="font-weight-bold">Clinic:</label>
                        <select class="form-select" id="clinic" v-model="this.$store.state.clinic" aria-readonly="true">
                            <option v-for="(c,index) in this.$store.state.clinics" 
                                :value="c"
                                :key="index">
                                {{ c }}
                            </option>
                        </select>
                    </div>
                    <div class="col-4">
                        <label for="facility">Facility:</label>
                        <select class="form-select" id="facility" v-model="this.facility">
                            <option v-for="(f,index) in this.$store.state.facilities" 
                                :value="f"
                                :key="index">
                                {{ f }}
                            </option>
                        </select>
                    </div>
                    <div class="col-4">
                        <label for="caseNumber">Case / Account Number:</label>
                        <div class="input-group mb-4" >
                            <input type="text" class="form-control" placeholder="case / account #" id="caseNumber" maxlength="15"
                                v-model.trim="this.caseAccountNumber">
                            <button class="btn btn-primary h2rem" type="button" id="btnSearch" style="margin-left:2px;" @click="ApiFindCase()" 
                                :disabled="!this.HasFacilityAndCase || this.isLoading">Search</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="bs-docs-section mt-2" v-if="show_detail" >
            <form id="encounterForm">
                <div class="row">
                    <div class="col-lg-4">
                        <label for="patientName">Patient Name:</label>
                        <input type="text" class="form-control" placeholder="patient name" id="patientName" maxlength="50"
                            v-model.trim="this.patientName">
                    </div>
                    <div class="col-lg-4">
                        <label for="admitDate">Admission Date:</label>
                        <input type="date" class="form-control" placeholder="dd/mm/yyyy" id="admitDate" 
                            v-model="this.admitDate">
                    </div>
                    <div class="col-lg-4">
                        <label for="dischargeDate">Discharge Date:</label>
                        <input type="date" class="form-control" placeholder="dd/mm/yyyy" id="dischargeDate" 
                            v-model="this.dischargeDate">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <label for="caseType" class="mt-2">Case Type:</label>
                        <select class="form-select" id="caseType" v-model="this.caseType">
                            <option value="inpatient">Inpatient</option>
                            <option value="daysurgery">Day Surgery</option>
                        </select>
                    </div>
                    <div class="col-lg-8" v-if="!this.HasFile">
                        <div class="form-group">
                            <label for="lcFile" class="mt-2">Attach Letter of Certification file</label> 
                            <input class="form-control" type="file" id="lcFile" 
                                @change="ApiFileChange($event)"
                                :class="`${hasFileError && 'red_border'}`">

                            <div style="font-size: small;" ><strong>Please Note:</strong> File must not be more than 5mb in size.  Allowed file types: PDF, JPG, PNG, GIF.</div>
                        </div>
                    </div>
                    <div class="col-lg-4" v-if="this.HasFile" style="float: right; vertical-align:bottom;">
                        <label for="lcFileLink" class="mt-2">Letter of Certification file</label> 
                        <div class="input-group mb-4" >
                            <input class="form-control" type="text" id="lcFileLink" readonly
                                v-model="this.AttachedFileName">
                            <button class="btn btn-primary h2rem" type="button" id="btnDetachFile" style="margin-left:2px;" @click="DetachFile();" 
                                :disabled="this.isLoading">Detach</button>
                        </div>
                    </div>
                    <div class="col-lg-4" v-if="this.HasFile" style="float: right; vertical-align:bottom;">
                        <label for="totalHospitalToCollect" class="mt-2">Total Hospital to Collect:</label> 
                            <input class="form-control" type="text" id="totalHospitalToCollect" readonly
                                :value="this.TotalHospitalToCollectDisplay">
                    </div>
                </div>
                <div id="errorEncounter" class="alert alert-dismissible alert-danger" v-show="this.errorEncounterForm.length > 0">
                    <strong>Error:</strong> {{ errorEncounterForm }}
                </div>
            </form>
        </div>
        <div class="bs-docs-section mt-2" v-if="this.ShowProcedures" >
            <form id="addFeesForm" style="background-color: azure;">
                <h4>Add Fees</h4>
                <div class="row">

                    <div class="col-lg-8">
                        <label>Procedure / Operation Code:</label>
                        <Typeahead class="h2rem" id="tospSearch" placeholder="Enter at least 2 characters..."
                            :minInputLength=2
                            :items="this.$store.state.tospSearch"
                            :disabled="this.nonSurgical"
                            v-model="this.tosp"
                        />
                        <div class="form-check">
                        <input class="form-check-input" type="checkbox" @click="ToggleNonSurgical()" id="ckNonSurgical"
                            :checked="this.nonSurgical"
                            tabindex="-1">
                        <label class="form-check-label" for="ckNonSurgical">
                            Non-Surgical Charges
                        </label>
                    </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <label>Doctor:</label>
                        <Typeahead id="tospSearch" placeholder="Begin typing for list..."
                            :minInputLength=0
                            :items="this.$store.state.doctorSearch"
                            v-model="this.doctor"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <label for="totalFees" class="mt-2">Total Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Total Fees" id="totalFees" 
                            @focus="$event.target.select()"
                            v-model="this.totalFees">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" @click="this.totalIncludesGST = !this.totalIncludesGST" id="ckTotalIncludesGST" 
                                :checked="this.totalIncludesGST"
                                tabindex="-1">
                            <label class="form-check-label" for="ckTotalIncludesGST">
                                Total Includes GST
                            </label>
                        </div>
                    </div>
                    <div class="col-2">
                        <label for="consultantFees" class="mt-2">Consultant Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Consultant Fees" id="consultantFees" 
                            @focus="$event.target.select()"
                            v-model="this.consultantFees">
                    </div>
                    <div class="col-2">
                        <label for="procedureFees" class="mt-2">Procedure Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Procedure Fees" id="procedureFees" 
                            @focus="$event.target.select()"
                            :disabled="this.nonSurgical"
                            v-model="this.procedureFees">
                    </div>
                    <div class="col-2">
                        <label for="otherFees" class="mt-2">Other Fees:</label>
                        <input type="number" class="form-control h2rem" :class="`${InvalidAmounts && 'red_border'}`" step="0.01" style="text-align: right;" id="otherFees" readonly v-model="this.OtherFeesDisplay">
                    </div>
                    <div class="col-2">
                        <label for="gst" class="mt-2">{{ this.GstHeaderCalc }}</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="gst" readonly v-model="this.GstDisplay">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" @click="this.gstWaived = !this.gstWaived" id="ckGstWaived" tabindex="-1">
                            <label class="form-check-label" for="ckGstWaived">
                                GST Waived
                            </label>
                        </div>
                    </div>
                    <div class="col-2">
                        <label for="hospitalToCollect" class="mt-2">Hospital to Collect:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="hospitalToCollect" readonly v-model="this.HospitalToCollect">
                    </div>
                </div>
                <div class="row mt-2" v-if="this.ShowSaveFeesButton">
                    <div class="col-2">
                        <button class="btn btn-primary" @click.prevent="SaveFees()"
                            :disabled="this.isLoading">
                            Save Fees
                        </button>
                    </div>
                </div>
                <div id="errorAddFees" class="alert alert-dismissible alert-danger mt-2" v-show="this.errorAddFees.length > 0">
                    <strong>Error:</strong> {{ errorAddFees }}
                </div>
            </form>
        </div>
        <div class="bs-docs-section mt-2" v-if="this.fees.length > 0" >
            <form id="feesForm">
                <h4>Procedures & Fees</h4>
                <table class="table table-striped table-light">
                    <thead>
                        <tr>
                            <th scope="col" style="width:12%;">Procedure</th>
                            <th scope="col" style="width:12%;">Doctor</th>
                            <th scope="col" style="text-align: right; width: 10%">Total Fees</th>
                            <th scope="col" style="text-align: right; width: 15%">Consultant Fees</th>
                            <th scope="col" style="text-align: right; width: 15%">Procedure Fees </th>
                            <th scope="col" style="text-align: right; width: 12%">Other Fees</th>
                            <th scope="col" style="text-align: right; width: 10%">GST</th>
                            <th scope="col" style="text-align: right; width: 25%">Hospital to Collect</th>
                            <th scope="col" style="text-align: right; width: 5%">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody style="vertical-align: middle;">
                        <tr v-for="(f,index) in this.fees"
                                :value="f"
                                :key="index">
                            <td>{{ f.tosp_Display }}</td>
                            <td>{{ f.doctor_Display }}</td>
                            <td style="text-align: right;">{{ f.totalFees_Display }}</td>
                            <td style="text-align: right;">{{ f.consultantFees_Display }}</td>
                            <td style="text-align: right;">{{ f.procedureFees_Display }} </td>
                            <td style="text-align: right;">{{ f.otherFees_Display }}</td>
                            <td style="text-align: right;">{{ f.gst_Display }}</td>
                            <td style="text-align: right;">{{ f.hospitalToCollect_Display }}</td>
                            <td>
                                <button class="btn btn-danger" @click="RemoveProcedure(index)"
                                    :disabled="this.isLoading">
                                    <span class="material-symbols-outlined">
                                        delete_forever
                                    </span>
                                </button>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                <div class="row mt-2" v-if="this.ShowSaveLC">
                    <div class="col-4">
                        <button class="btn btn-success" @click.prevent="ApiSubmitLC()"
                            :disabled="this.isLoading">
                            Save Letter of Certification
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <div id="instructions" class="alert alert-dismissible alert-info mt-2" v-html="this.GetInstructions"></div>
        
    </main>
</template>

<script>
    import { ref, computed } from 'vue';
    
    export default {
        name: 'LC',
        data() {
            return {
                // form data

                // data entry - top
                facility: "Mount Elizabeth",
                caseAccountNumber: "2022108239",

                // data entry - middle
                patientName: "Unknown",
                admitDate: "2022-12-29",
                dischargeDate: "2023-01-05",
                caseType: "inpatient",
                fileUri: null,

                // data entry - bottom
                tosp: "SB716K",
                doctor: "Pheng",
                totalFees: 28589.76,
                consultantFees: 3200,
                procedureFees: 12000,  
                totalIncludesGST: false, 
                gstWaived: false,
                nonSurgical: false,

                // form control
                
                case_edit: false,
                case_add: false,
                show_detail: false,
                isLoading: false,

                hasFileError: false,
                fileSpecified: false,

                errorEncounterForm: "",
                errorAddFees: "",

                fees: []
            }
        },
        computed: {
            AttachedFileName(){
                if(this.fileUri != null) {
                    return this.fileUri.split("/").pop();
                } else {
                    return "";
                }
            },
            GetInstructions() {
                var instructions = "<strong>Instructions:</strong><hr>"
                // Ensure no errors
                if(this.errorAddFees.length > 0 || this.errorEncounterForm.length > 0) {
                    instructions += "Please correct errors before saving."
                    return instructions;
                }

                // Instructions for top section
                if(!this.HasFacilityAndCase || !this.show_detail) {
                    instructions += "<ul>";
                    if(this.facility.length == 0) {
                        instructions += "<li>Select the facility.</li>";
                    }
                    if(this.caseAccountNumber.length < 3) {
                        instructions += "<li>Enter the case/account number.</li>";
                    }

                    if(!this.HasFacilityAndCase) {
                        instructions += "<li>Click Search.</li>";
                        instructions += "<li>The Search button will be enabled when the facility has been selected and at least 3 characters have been entered for the case/account number.</li>";
                    }
                    else {
                        instructions += "<li>Click the search button to continue.</li>";
                    }
                    
                    return instructions;
                    
                }

                // LC is ready to submit
                if(this.ShowSaveLC) {
                    instructions += "Once all procedures have been added, click Save Letter of Certification.";
                    return instructions;
                }
                
                // Instructions for middle section

                if(!this.ShowProcedures) {
                    instructions += "Provide the requested information (all fields are required), attach the LC file (.jpg or .pdf), then click Save.";
                    return instructions;
                }

                // Instructions for bottom section
                let msgSelect = "Select ";
                let msgEnter = " and enter the appropriate fees, then click Save."
                let count = 0;
                if(this.tosp.length == 0 && !this.nonSurgical) {
                    msgSelect += "Procedure / Operation Code";
                    count++;
                }
                if(this.doctor.length == 0) {
                    if(count > 0) {
                        msgSelect += " and ";
                    }
                    msgSelect += "Doctor";
                    count++;
                }
                if(count == 0){
                    msgSelect = "";
                    msgEnter = "Enter the appropriate fees, then click Save.";
                }

                instructions += msgSelect + msgEnter;
                return instructions;

            },
            GstCalc() {
                if(!this.totalIncludesGST){
                    return this.totalFees * this.GstRateCalc;
                }

                return this.totalFees - (this.totalFees / (1 + this.GstRateCalc));
                
            },
            GstDisplay() {
                return (this.GstCalc).toFixed(2);
            },
            GstHeaderCalc(){
                if(this.gstWaived)  {
                    return "GST (Waived)";
                }
                if(this.GstRateCalc == 0.09) {
                    return "GST (9%):";
                } else {
                    return "GST (8%):";
                }
            },
            GstRateCalc() {
                if(this.gstWaived) {
                    return 0;
                }
                if(this.dischargeDate == null || new Date(this.dischargeDate).getFullYear() > 2023) {
                    return 0.09;
                }
                else {
                    return 0.08;
                }
            },
            HasErrorAddFees(){
                let hasError = false;

                if(this.OtherFees < 0) {
                    this.errorAddFees = "Total Fees must be greater than Consultant Fees and Procedure Fees.";
                    hasError = true;
                } else {
                    this.errorAddFees = "";
                }

                return hasError;
            },
            HasFacilityAndCase(){
               if(this.$store.state.clinic.length > 0 && this.facility.length > 0 && this.caseAccountNumber.length > 2) {
                   return true;
               } else {
                   return false;
               }
            },
            HasFeeDetail(){
                if((this.tosp.length > 0 || this.nonSurgical) 
                    && this.doctor.length > 0 
                    && this.totalFees > 0 ) {
                    return true;
                } else {
                    return false;
                }
            },
            HasFile(){
                return (this.fileUri != null && this.fileUri.length > 0);
            },
            HospitalToCollect() {
                return (this.totalFees + (this.totalIncludesGST ? 0 : this.GstCalc)).toFixed(2);
            },
            InvalidAmounts() {
                return this.OtherFees < 0 ? true : false;
            },
            IsSingleClinic() {
                return this.$store.state.clinics.length == 1;
            },
            OtherFees() {
                return this.totalFees - this.consultantFees - this.procedureFees - (this.totalIncludesGST ? this.GstCalc : 0);
            },   
            OtherFeesDisplay() {
                return (this.OtherFees).toFixed(2);
            },   
            ShowProcedures(){
                if(this.show_detail 
                    && this.patientName.length > 0 
                    && this.admitDate != null 
                    && this.dischargeDate != null 
                    && this.caseType.length > 0 
                    && this.fileUri != null) {
                    return true;
                } else {
                    return false;
                }
            },
            ShowSaveFeesButton(){
                 if( this.totalFees == null || this.totalFees == 0 ) {
                     return false;
                 }
                 else {
                    return true;
                 }
            },
            ShowSaveLC(){
                if (this.fees.length > 0 && this.ShowProcedures && this.errorAddFees.length == 0 && this.errorEncounterForm.length == 0) {
                    return true;
                } else {
                    return false;
                }
            },
            TotalHospitalToCollect() {

                var total2collect = 0.00;
                for (const f of this.fees) {
                    total2collect += Number(f.hospitalToCollect);
                }                
                return total2collect;
            },
            TotalHospitalToCollectDisplay() {

                return this.FormatDollars(this.TotalHospitalToCollect);
            }
        },
        methods: {
            ApiFileChange(e) {
                this.errorEncounterForm = "";
                this.hasFileError = false;

                const files = e.target.files;
                if(files.length == 0) {
                    this.hasFileError = true;
                    this.errorEncounterForm = "No file selected for upload.";
                    return;
                }
                if(files.length > 1){
                    this.errorEncounterForm = "Only one file can be attached.";
                    this.hasFileError = true;
                    return;
                }

                if(files[0].size > 5000000) {
                    this.errorEncounterForm = "File size must not exceed 5mb.";
                    this.hasFileError = true;
                    return;
                }
                
                const ext = files[0].name.split('.').pop().toLowerCase();
                if(ext != "pdf" && ext != "jpg" && ext != "png" && ext != "gif") {
                    this.errorEncounterForm = "File type not allowed.  Only PDF, JPG, PNG, and GIF are allowed.";
                    this.hasFileError = true;
                    return;
                }

                this.isLoading = true;

                // check for existing file
                
                const url = this.$store.state.apiFileInfo;
                const senddata =
                {
                    filePrefix: files[0].name,
                    GetLCFileID: "Y"
                };
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": this.$store.state.token,
                    },
                    body: JSON.stringify(senddata),
                };

                fetch(url, options)
                    .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then((error) => {
                            const err = new Error(response.statusText);
                            err.data = error;
                            this.isLoading = false;
                            this.errorEncounterForm = error.message;
                            if(response.status == 401) {
                                this.$store.state.isLoggedIn = false;
                            }
                            else {
                                throw err;
                            }
                        });
                    }
                    })
                    .then((responseData) => {
                        if(responseData.length > 0) {
                            this.fileUri = responseData[0].uri;
                            if(responseData.letterID.length > 0) {
                                this.errorEncounterForm = "File in already exists in the system.  Please check the file name and try again.";
                                this.hasFileError = true;
                                this.isLoading = false;
                            } else {
                                this.isLoading = false;
                            }
                         } else {
                            
                            // upload file
                            
                            const file = ref(null);
                            file.value = files[0];
                            const fileName = computed(() => file.value?.name);
                            const fileExtension = computed(() => fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1));
                            const fileMimeType = computed(() => file.value?.type);

                            const reader = new FileReader();
                            reader.readAsDataURL(file.value);
                            reader.onload = async () => {
                                const encodedFile = reader.result.split(",")[1];
                                const data = {
                                    FileName: fileName.value,
                                    FileData: encodedFile
                                };
                                
                                const url = this.$store.state.apiFileUploadStream;
                            
                                const options = {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": this.$store.state.token,
                                    },
                                    body: JSON.stringify(data),
                                };

                                fetch(url, options)
                                    .then((response) => {
                                        if (response.ok) {
                                            return response.json();
                                        } else {
                                            return response.json().then((error) => {
                                                const err = new Error(response.statusText);
                                                err.data = error;
                                                this.isLoading = false;
                                                this.errorEncounterForm = error.message;
                                                if(response.status == 401) {
                                                    this.$store.state.isLoggedIn = false;
                                                }
                                                else {
                                                    throw err;
                                                }
                                            });
                                        }
                                    })
                                    .then((responseData) => {
                                        this.fileUri = responseData.blob.uri;
                                        this.isLoading = false;
                                        this.hasFileError = true;
                                        this.errorEncounterForm = "";
                                    })
                                    // catch for file upload
                                    .catch((error) => {
                                        console.log(error);
                                        this.isLoading = false;
                                        this.hasFileError = true;
                                        this.errorEncounterForm = "Error uploading file.";
                                    });
                                
                            }
                        }
                        
                    })
                    // catch for file info
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                        this.errorEncounterForm = "Error checking for existing file.";
                    });

            },
            ApiFindCase() {
                
                this.isLoading = true;
        
                const url = this.$store.state.apiFindLC;
                
                const senddata = {
                    clinic: this.$store.state.clinic,
                    facility: this.facility,
                    caseNumber: this.caseAccountNumber,
                };

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": this.$store.state.token,
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
                            if(response.status == 401) {
                                this.$store.state.isLoggedIn = false;
                            }
                            else {
                                throw e;
                            }
                        });
                    }
                    })
                    .then((responseData) => {
                        // retrieve user data lists
                        this.$store.state.lc_data = responseData.data;
                 
                        this.case_add = (responseData.message == "Not Found");
                        this.case_edit = (responseData.message == "Found");

                        if(this.case_add) {
                            this.patientName = "Unknown";
                            this.admitDate = "2022-12-29";
                            this.dischargeDate = "2023-01-05";
                            this.caseType = "inpatient";
                            this.fees = [];
                        } else {
                            this.patientName = responseData.data.patientName;
                            this.admitDate = responseData.data.admitDate;
                            this.dischargeDate = responseData.data.dischargeDate;
                            this.caseType = responseData.data.caseType;
                            this.fees = responseData.data.fees;
                        }

                        // continue to main page
                        this.isLoading = false;
                        this.show_detail = true;
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                    });

            },
            ApiSubmitLC(){
                this.isLoading = true;
                const url = this.$store.state.apiSubmitLC;
                
                var lcFees = [];
                for (const f of this.fees) {
                    const lcFee = {
                        MCR_DBR: this.ExtractMCROnly(f.doctor),
                        procedureCD: f.tosp,
                        contsultantFees: f.consultantFees,
                        procedureFees: f.procedureFees,
                        otherFees: f.otherFees,
                        gst: f.gst,
                        totalFees: f.totalFees,
                        hospitalToCollectAmount: f.hospitalToCollect,
                    };
                    lcFees.push(lcFee);
                }

                // construct objects
                const senddata =
                {
                    letterID: this.$store.state.letterId,
                    clinic: this.$store.state.clinic,
                    facility: this.facility,
                    caseAccountNumber: this.caseAccountNumber,
                    versionNo: this.$store.state.lc_data.versionNo,
                    caseType: this.caseType,
                    admitDate: this.admitDate,
                    dischargeDate: this.dischargeDate,
                    hospitalToCollectAmount: this.TotalHospitalToCollect,
                    hasCMFLG: this.$store.state.lc_data.hasCMFLG,
                    hasMatchingCMFLG: this.$store.state.lc_data.hasMatchingCMFLG,
                    fileUri: this.fileUri,
                    fees: lcFees
                };
                
                console.log(senddata);
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": this.$store.state.token,
                    },
                    body: JSON.stringify(senddata),
                };

                fetch(url, options)
                    .then((response) => {
                    console.log("response");
                    console.log(response)
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then((error) => {
                            const e = new Error(response.statusText);
                            e.data = error;
                            if(response.status == 401) {
                                this.$store.state.isLoggedIn = false;
                            }
                            else {
                                throw e;
                            }
                        });
                    }
                    })
                    .then((responseData) => {
                        
                        console.log("responseData");
                        console.log(responseData);

                        // continue to main page
                        this.isLoading = false;
                        
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                    });

                
                this.isLoading = false;

                
            },
            DetachFile(){
                this.hasFileError = false;
                this.fileUri = null;
            },
            ExtractMCR(input) {
                const lastName = input.split(",")[0];
                const mcr = input.split("(")[1];
                const doctor = lastName + " (" + mcr;
                return doctor;
            },
            ExtractMCROnly(input) {
                return input.split("(")[1].split(")")[0];
            },
            ExtractTOSP(input){
                const tosp = input.split("-")[0];
                return tosp;
            },
            FormatDollars(input) {
                return ("$ " + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")).replace("$ 0","$ ");
            },
            FormatNumber(input) {
                return parseFloat(input).toFixed(2);
            },
            RemoveProcedure(index) {
                // removes a row from the fees array
                this.fees.splice(index, 1);
            },
            SaveFees(){
                const newFees = {
                    tosp: this.tosp,
                    doctor: this.doctor,
                    totalFees: this.FormatNumber(this.totalFees),
                    consultantFees: this.FormatNumber(this.consultantFees),
                    procedureFees: this.FormatNumber(this.procedureFees),
                    otherFees: this.FormatNumber(this.OtherFees),
                    gst: this.FormatNumber(this.GstCalc),
                    hospitalToCollect: this.FormatNumber(this.HospitalToCollect),
                    // display fields
                    tosp_Display: this.ExtractTOSP(this.tosp),
                    doctor_Display: this.ExtractMCR(this.doctor),
                    totalFees_Display: this.FormatDollars(this.FormatNumber(this.totalFees)),
                    consultantFees_Display: this.FormatDollars(this.FormatNumber(this.consultantFees)),
                    procedureFees_Display: this.FormatDollars(this.FormatNumber(this.procedureFees)),
                    otherFees_Display: this.FormatDollars(this.FormatNumber(this.OtherFees)),
                    gst_Display: this.FormatDollars(this.FormatNumber(this.GstCalc)),
                    hospitalToCollect_Display: this.FormatDollars(this.FormatNumber(this.HospitalToCollect)),
                    
                };

                this.fees.push(newFees);

                this.tosp = "";
                this.doctor = "";
                this.totalFees = 0;
                this.consultantFees = 0;
                this.procedureFees = 0;
                this.totalIncludesGST = false;
                this.gstWaived = false;
                this.nonSurgical = false;

            },
            ToggleNonSurgical(){
                this.nonSurgical = !this.nonSurgical;
                if(this.nonSurgical) {
                    this.tosp = "Non-Surgical Charges";
                    this.procedureFees = 0;
                } else {
                    this.tosp = "";
                }

            }
        }
    }
    

</script>

<style lang="scss" scoped>
    
    form {
        border: 1px solid grey;
        border-radius: 10px;
        padding: 5px;
        background-color: whitesmoke
    }

    label, .fw-bold {
        font-weight: bold;
    }

   
    .mode-badge {
        margin-left: 10px;
    }
    .header-row {
        display: flex;
        flex-direction: row;
    }

    .red_border {
        border: 3px solid red;
    }

</style>
