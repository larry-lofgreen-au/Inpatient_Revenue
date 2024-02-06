<template>
    <main class="add-lc-view">
        <div class="header-row">
            <h3 class="fw-bold">Letter of Certification</h3>
            <h4>
                <div v-if="this.show_detail">
                    <div v-if="case_edit">
                        <span class="badge rounded-pill bg-primary mode-badge">Edit</span>
                    </div>
                    <div v-if="case_add">
                        <span class="badge rounded-pill bg-primary  mode-badge">Add</span>
                    </div>
                </div>
            </h4>
        </div>
        <hr>
        <div class="spinner" v-if="isLoading"></div>
        <div class="bcs-docs-section">
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
                        <select class="form-select" id="facility" v-model="this.$store.state.facility">
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
                                v-model.trim="this.$store.state.caseAccountNumber">
                            <button class="btn btn-primary h2rem" type="button" id="btnSearch" style="margin-left:2px;" @click="ApiFindCase('')" 
                                :disabled="!this.HasFacilityAndCase || this.isLoading">Search</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="bs-docs-section mt-2" v-if="this.show_detail" >
            <form id="encounterForm">
                <div class="row">
                    <div class="col-lg-4">
                        <label for="patientName">Patient Name:</label>
                        <input type="text" class="form-control" placeholder="patient name" id="patientName" maxlength="50"
                            :class="`${hasPatientError && 'red_border'}`"
                            v-model.trim="this.$store.state.patientName">
                    </div>
                    <div class="col-lg-4">
                        <label for="admitDate">Admission Date:</label>
                        <input type="date" class="form-control" placeholder="dd/mm/yyyy" id="admitDate" 
                            :class="`${hasAdmitError && 'red_border'}`"
                            v-model="this.$store.state.admitDate">
                    </div>
                    <div class="col-lg-4">
                        <label for="dischargeDate">Discharge Date:</label>
                        <input type="date" class="form-control" placeholder="dd/mm/yyyy" id="dischargeDate" 
                            :class="`${hasDischargeError && 'red_border'}`"
                            v-model="this.$store.state.dischargeDate">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <label for="caseType" class="mt-2">Case Type:</label>
                        <select class="form-select" id="caseType" v-model="this.$store.state.caseType">
                            <option value="inpatient">Inpatient</option>
                            <option value="daysurgery">Day Surgery</option>
                        </select>
                    </div>
                    <div class="col-lg-8" v-if="!this.HasFile">
                        <div class="form-group">
                            <label for="lcFile" class="mt-2">Attach Letter of Certification file</label> 
                            <input class="form-control" type="file" id="lcFile" 
                                @change="ApiFileChange($event)"
                                :class="`${this.hasFileError && 'red_border'}`">

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
                            :disabled="this.$store.state.nonSurgical"
                            v-model="this.$store.state.tosp"
                        />
                        <div class="form-check">
                        <input class="form-check-input" type="checkbox" @click="ToggleNonSurgical()" id="ckNonSurgical"
                            :checked="this.$store.state.nonSurgical"
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
                            v-model="this.$store.state.doctor"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <label for="totalFees" class="mt-2">Total Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Total Fees" id="totalFees" 
                            @focus="$event.target.select()"
                            v-model="this.$store.state.totalFees">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" @click="this.$store.state.totalIncludesGST = !this.$store.state.totalIncludesGST" id="ckTotalIncludesGST" 
                                :checked="this.$store.state.totalIncludesGST"
                                tabindex="-1">
                            <label class="form-check-label" style="font-size:small;" for="ckTotalIncludesGST">
                                Total Includes GST
                            </label>
                        </div>
                    </div>
                    <div class="col-2">
                        <label for="consultantFees" class="mt-2">Consultant Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Consultant Fees" id="consultantFees" 
                            @focus="$event.target.select()"
                            v-model="this.$store.state.consultantFees">
                    </div>
                    <div class="col-2">
                        <label for="procedureFees" class="mt-2">Procedure Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Procedure Fees" id="procedureFees" 
                            @focus="$event.target.select()"
                            :disabled="this.$store.state.nonSurgical"
                            v-model="this.$store.state.procedureFees">
                    </div>
                    <div class="col-2">
                        <label for="otherFees" class="mt-2">Other Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="otherFees" readonly 
                            :class="`${InvalidAmounts && 'red_border'}`"
                            v-model="this.OtherFeesDisplay">
                    </div>
                    <div class="col-2">
                        
                        <label for="gst" class="mt-2" v-if ="!this.$store.state.gstOverride" >{{ this.GstHeaderCalc }}</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="gst" readonly 
                            v-if ="!this.$store.state.gstOverride"
                            v-model="this.GstDisplay">
                        <label for="gst" class="mt-2" v-if ="this.$store.state.gstOverride" >GST Override</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="gstAmount" 
                            v-if ="this.$store.state.gstOverride"
                            v-model="this.gstAmount">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="ckGstOverride" tabindex="-1"
                                @click="this.$store.state.gstOverride = !this.$store.state.gstOverride" 
                                :checked="this.$store.state.gstOverride">
                            <label class="form-check-label" style="font-size:small;" for="ckGstOverride">
                                GST Override
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
        <div class="bs-docs-section mt-2" v-if="this.$store.state.fees.length > 0" >
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
                        <tr v-for="(f,index) in this.$store.state.fees"
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
        <div id="saveConfirmed" class="alert alert-dismissible alert-success mt-2" v-if="this.$store.state.showModal">
            <strong>Success:</strong> Letter of Certification has been saved.
            <hr>
            <table class="table table-success">
                <thead>
                    <tr>
                        <th scope="col">Facility</th>
                        <th scope="col">Case / Account Number</th>
                        <th scope="col">Total Hospital to Collect</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ this.$store.state.savedFacility }}</td>
                        <td>{{ this.$store.state.savedCaseAccountNumber }}</td>
                        <td>{{ this.$store.state.savedTotalHospitalCollectDisplay }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </main>
</template>

<script>
    import { ref, computed } from 'vue';
    
    export default {
        name: 'LC',
        data() {
            return {
                 // form control
            
                case_edit: false,
                case_add: false,
                show_detail: false,
                isLoading: false,

                hasPatientError: false,
                hasAdmitError: false,
                hasDischargeError: false,

                hasFileError: false,
                fileSpecified: false,

                errorEncounterForm: "",
                errorAddFees: "",

            }
        },
        computed: {
            AttachedFileName(){
                if(this.$store.state.LC_fileUri != null) {
                    return this.$store.state.LC_fileUri.split("/").pop();
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
                    if(this.$store.state.facility.length == 0) {
                        instructions += "<li>Select the facility.</li>";
                    }
                    if(this.$store.state.caseAccountNumber.length < 3) {
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
                if(this.$store.state.tosp.length == 0 && !this.$store.state.nonSurgical) {
                    msgSelect += "Procedure / Operation Code";
                    count++;
                }
                if(this.$store.state.doctor.length == 0) {
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
                // override calc
                if(this.$store.state.gstOverride) {
                    return this.gstAmount;
                }
                // standard calc
                if(!this.$store.state.totalIncludesGST){
                    return this.$store.state.totalFees * this.GstRateCalc;
                }

                return this.$store.state.totalFees - (this.$store.state.totalFees / (1 + this.GstRateCalc));
                
            },
            GstDisplay() {
                return (this.GstCalc).toFixed(2);
            },
            GstHeaderCalc(){
                // override
                if(this.$store.state.gstOverride) {
                    return "GST Override:";
                }

                // standard
                if(this.GstRateCalc == 0.09) {
                    return "GST (9%):";
                } else {
                    return "GST (8%):";
                }
            },
            GstRateCalc() {

                if(this.$store.state.dischargeDate == null || new Date(this.$store.state.dischargeDate).getFullYear() > 2023) {
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
               if(this.$store.state.clinic.length > 0 && this.$store.state.facility.length > 0 && this.$store.state.caseAccountNumber.length > 2) {
                   return true;
               } else {
                   return false;
               }
            },
            HasFeeDetail(){
                if((this.$store.state.tosp.length > 0 || this.$store.state.nonSurgical) 
                    && this.$store.state.doctor.length > 0 
                    && this.$store.state.totalFees > 0 ) {
                    return true;
                } else {
                    return false;
                }
            },
            HasFile(){
                return (this.$store.state.LC_fileUri != null && this.$store.state.LC_fileUri.length > 0);
            },
            HospitalToCollect() {
                // override
                if(this.gstOverride) {
                    return (this.$store.state.totalFees + (this.$store.state.totalIncludesGST ? 0 : this.gstAmount)).toFixed(2);
                }
                // standard
                return (this.$store.state.totalFees + (this.$store.state.totalIncludesGST ? 0 : this.GstCalc)).toFixed(2);
            },
            InvalidAmounts() {
                return this.OtherFees < 0 ? true : false;
            },
            IsSingleClinic() {
                return this.$store.state.clinics.length == 1;
            },
            OtherFees() {
                //override
                if(this.gstOverride){
                    return this.$store.state.totalFees - this.$store.state.consultantFees - this.$store.state.procedureFees - (this.$store.state.totalIncludesGST ? this.gstAmount : 0);    
                }
                //standard
                return this.$store.state.totalFees - this.$store.state.consultantFees - this.$store.state.procedureFees - (this.$store.state.totalIncludesGST ? this.GstCalc : 0);
            },   
            OtherFeesDisplay() {
                return (this.OtherFees).toFixed(2);
            },   
            ShowProcedures(){
                if(this.show_detail 
                    && this.$store.state.patientName.length > 0 
                    && this.$store.state.admitDate != null 
                    && this.$store.state.dischargeDate != null 
                    && this.$store.state.caseType.length > 0 
                    && this.$store.state.LC_fileUri != null) {
                    return true;
                } else {
                    return false;
                }
            },
            ShowSaveFeesButton(){
                 if( this.$store.state.totalFees == null || this.$store.state.totalFees == 0 ) {
                     return false;
                 }
                 else {
                    return true;
                 }
            },
            ShowSaveLC(){
                if(this.$store.state.patientName.length = 0) 
                {
                    this.hasPatientError = true;
                    this.errorEncounterForm = "Patient Name is required.";
                    return;
                }
                if(this.$store.state.admitDate == null) {
                    this.hasAdmitError = true;
                    this.errorEncounterForm = "Admit Date is required.";
                    return;
                }
                if(this.$store.state.dischargeDate == null) {
                    this.hasAdmitError = true;
                    this.errorEncounterForm = "Discharge Date is required.";
                    return;
                }
                var admitDate = new Date(this.$store.state.admitDate);
                var dischargeDate = new Date(this.$store.state.dischargeDate);
                
                if(admitDate > dischargeDate) {
                    this.hasAdmitError = true;
                    this.hasDischargeError = true;
                    this.errorEncounterForm = "Admit Date must be less than or equal to the Discharge Date.";
                    return;
                }

                var today = new Date();

                if(dischargeDate > today) {
                    this.hasDischargeError = true;
                    this.errorEncounterForm = "Discharge Date must be less than or equal to today's date.";
                    return;
                }
                    
                if (this.$store.state.fees.length > 0 && this.ShowProcedures && this.errorAddFees.length == 0 && this.errorEncounterForm.length == 0) {
                    return true;
                } else {
                    return false;
                }
            },
            TotalHospitalToCollect() {

                var total2collect = 0.00;
                for (const f of this.$store.state.fees) {
                    total2collect += Number(f.hospitalToCollect);
                }                
                return total2collect;
            },
            TotalHospitalToCollectDisplay() {

                return this.FormatDollars(this.TotalHospitalToCollect);
            }
        },mounted() {
            if(this.$store.state.letterId_to_load.length == 0) {
                return;
            }
            this.ApiFindCase(this.$store.state.letterId_to_load);
            this.$store.state.letterId_to_load = "";
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
                    GetCMFileID: "N",
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
                            if(responseData.letterID.length > 0) {
                                this.errorEncounterForm = "File in already exists in the system.  Please check the file name and try again.";
                                this.hasFileError = true;
                                this.isLoading = false;
                            } else {
                                this.$store.state.LC_fileUri = responseData[0].uri;
                                this.hasFileError = false;
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
                                                    this.hasFileError = true;
                                                    throw err;
                                                }
                                            });
                                        }
                                    })
                                    .then((responseData) => {
                                        this.$store.state.LC_fileUri = responseData.blob.uri;
                                        this.isLoading = false;
                                        this.hasFileError = false;
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
            ApiFindCase(letterId) {
                this.isLoading = true;
                
                const url = this.$store.state.apiFindLC;
                
                const senddata = {
                    clinic: this.$store.state.clinic,
                    facility: this.$store.state.facility,
                    caseNumber: this.$store.state.caseAccountNumber,
                    letterId: letterId
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
                            this.$store.state.patientName = "";
                            this.$store.state.admitDate = null;
                            this.$store.state.dischargeDate = null;
                            this.$store.state.caseType = "inpatient";
                            this.$store.state.fees = [];
                        } else {
                            this.$store.state.patientName = responseData.data.patientName;
                            this.$store.state.admitDate = new Date(responseData.data.admitDate).toISOString().split('T')[0];
                            this.$store.state.dischargeDate = new Date(responseData.data.dischargeDate).toISOString().split('T')[0];;
                            this.$store.state.caseType = responseData.data.caseType;
                            this.$store.state.letterId = responseData.data.letterId;
                            this.$store.state.LC_fileUri = responseData.data.fileUri;

                            
                            this.$store.state.fees = [];
                            for(const f of responseData.data.fees)
                            {
                                const newFees = {
                                    tosp: f.procedureCD,
                                    doctor: f.mcR_DBR,
                                    totalFees: this.FormatNumber(f.totalFees),
                                    consultantFees: this.FormatNumber(f.consultantFees),
                                    procedureFees: this.FormatNumber(f.procedureFees),
                                    otherFees: this.FormatNumber(f.otherFees),
                                    gst: this.FormatNumber(f.gst),
                                    hospitalToCollect: this.FormatNumber(f.hospitalToCollectAmount),
                                    // display fields
                                    tosp_Display: this.ExtractTOSP(f.procedureCD),
                                    doctor_Display: f.mcR_DBR,
                                    totalFees_Display: this.FormatDollars(this.FormatNumber(f.totalFees)),
                                    consultantFees_Display: this.FormatDollars(this.FormatNumber(f.consultantFees)),
                                    procedureFees_Display: this.FormatDollars(this.FormatNumber(f.procedureFees)),
                                    otherFees_Display: this.FormatDollars(this.FormatNumber(f.otherFees)),
                                    gst_Display: this.FormatDollars(this.FormatNumber(f.gst)),
                                    hospitalToCollect_Display: this.FormatDollars(this.FormatNumber(f.hospitalToCollectAmount)),

                                }

                                this.$store.state.fees.push(newFees);
                            };

                        }

                        // continue to main page
                        this.isLoading = false;
                        this.show_detail = true;
                        this.$store.state.showModal = false;
                
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                        this.$store.state.showModal = false;
                
                    });

            },
            ApiSubmitLC(){
                this.isLoading = true;
                const url = this.$store.state.apiSubmitLC;
                
                var lcFees = [];
                for (const f of this.$store.state.fees) {
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
                    facility: this.$store.state.facility,
                    caseAccountNumber: this.$store.state.caseAccountNumber,
                    versionNo: this.$store.state.lc_data.versionNo,
                    patientName: this.$store.state.patientName,
                    caseType: this.$store.state.caseType,
                    admitDate: this.$store.state.admitDate,
                    dischargeDate: this.$store.state.dischargeDate,
                    hospitalToCollectAmount: this.TotalHospitalToCollect,
                    fileUri: this.$store.state.LC_fileUri,
                    fees: lcFees
                };

                this.$store.state.savedFacility = this.$store.state.facility;
                this.$store.state.savedCaseAccountNumber = this.$store.state.caseAccountNumber;
                this.$store.state.savedTotalHospitalCollectDisplay = this.TotalHospitalToCollectDisplay
                
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
                        this.show_detail = false;
                        this.isLoading = false;
                        this.$store.state.LC_No_CM_Count = responseData.lC_No_CM_Count;
                        this.$store.state.LC_Mismatched_CM_Count = responseData.lC_Mismatched_CM_Count;
                        this.$store.state.facility = "";
                        this.$store.state.caseAccountNumber = "";
                        this.$store.state.LC_fileUri = null;
                        
                        this.$store.state.showModal = true;
                        this.$store.state.fees = []

                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                    });

                
                this.isLoading = false;

                
            },
            DetachFile(){
                this.hasFileError = false;
                this.$store.state.LC_fileUri = null;
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
                if(input == "Non-Surgical Charges") {
                    return input;
                }
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
                this.$store.state.fees.splice(index, 1);
            },
            SaveFees(){
                const newFees = {
                    tosp: this.$store.state.tosp,
                    doctor: this.$store.state.doctor,
                    totalFees: this.FormatNumber(this.$store.state.totalFees),
                    consultantFees: this.FormatNumber(this.$store.state.consultantFees),
                    procedureFees: this.FormatNumber(this.$store.state.procedureFees),
                    otherFees: this.FormatNumber(this.OtherFees),
                    gst: this.FormatNumber(this.GstCalc),
                    hospitalToCollect: this.FormatNumber(this.HospitalToCollect),
                    // display fields
                    tosp_Display: this.ExtractTOSP(this.$store.state.tosp),
                    doctor_Display: this.ExtractMCR(this.$store.state.doctor),
                    totalFees_Display: this.FormatDollars(this.FormatNumber(this.$store.state.totalFees)),
                    consultantFees_Display: this.FormatDollars(this.FormatNumber(this.$store.state.consultantFees)),
                    procedureFees_Display: this.FormatDollars(this.FormatNumber(this.$store.state.procedureFees)),
                    otherFees_Display: this.FormatDollars(this.FormatNumber(this.OtherFees)),
                    gst_Display: this.FormatDollars(this.FormatNumber(this.GstCalc)),
                    hospitalToCollect_Display: this.FormatDollars(this.FormatNumber(this.HospitalToCollect)),
                    
                };

                this.$store.state.fees.push(newFees);

                this.$store.state.tosp = "";
                this.$store.state.doctor = "";
                this.$store.state.totalFees = 0;
                this.$store.state.consultantFees = 0;
                this.$store.state.procedureFees = 0;
                this.$store.state.totalIncludesGST = false;
                this.$store.state.gstOverride = false;
                this.$store.state.nonSurgical = false;

            },
            ToggleNonSurgical(){
                this.$store.state.nonSurgical = !this.$store.state.nonSurgical;
                if(this.$store.state.nonSurgical) {
                    this.$store.state.tosp = "Non-Surgical Charges";
                    this.$store.state.procedureFees = 0;
                } else {
                    this.$store.state.tosp = "";
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
