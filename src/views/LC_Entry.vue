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
        <div class="spinner" v-show="isLoading"></div>
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
                            <button class="btn btn-primary h2rem" type="button" id="btnSearch" style="margin-left:2px;" @click="ApiFindCase(' ')" 
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
                        <label for="consultantFees" class="mt-2">Consultant Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Consultant Fees" id="consultantFees"
                            :class="`${(this.consultantFees < 0 || this.consultantFees > this.consultantFeeThreshold) && 'red_border'}`" 
                            @focus="$event.target.select()"
                            v-model="this.consultantFees">
                    </div>
                    <div class="col-2">
                        <label for="procedureFees" class="mt-2">Procedure Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" placeholder="Procedure Fees" id="procedureFees" 
                            @focus="$event.target.select()"
                            :class="`${(this.procedureFees < 0 || this.procedureFees > this.procedureFeeThreshold) && 'red_border'}`"
                            :disabled="this.nonSurgical"
                            v-model="this.procedureFees">
                    </div>
                    <div class="col-2">
                        <label for="otherFees" class="mt-2">Other Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="otherFees"
                            :class="`${(this.otherFees < 0 || this.otherFees > this.otherFeeThreshold) && 'red_border'}`"
                            v-model="this.otherFees">
                    </div>
                    
                    <div class="col-2">
                        <label for="gst" class="mt-2">GST</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="gstOverrideAmount" 
                            :class="`${(this.gstAmount < 0 || this.gstAmount > this.gstThreshold || this.gstAmount > this.TotalFees * this.gstRateThreshold) && 'red_border'}`"
                            v-model="this.gstAmount">
      
                    </div>

                    <!--div class="col-2">
                        <label for="totalFees" class="mt-2">Total Fees:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="totalFees" readonly
                            tabindex="-1"
                            :value="this.TotalFees">
                    </div-->

                    <div class="col-2">
                        <label for="hospitalToCollect" class="mt-2">Hospital to Collect:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="hospitalToCollect" readonly 
                            tabindex="-1"
                            v-model="this.HospitalToCollect">
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
        <div class="spinner" v-show="this.duringSave"></div>
        <div id="saveConfirmed" class="alert alert-dismissible alert-success mt-2" v-if="this.showSuccess">
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
                        <td>{{ this.savedFacility }}</td>
                        <td>{{ this.savedCaseAccountNumber }}</td>
                        <td>{{ this.savedTotalHospitalCollectDisplay }}</td>
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

                // visibility control
                case_edit: false,
                case_add: false,
                show_detail: false,
                isLoading: false,
                showSuccess: false,
                duringSave: false,

                // error control
                hasPatientError: false,
                hasAdmitError: false,
                hasDischargeError: false,
                hasConsultantFeesError: false,
                hasGstError: false,
                hasFileError: false,

                consultantFeeThreshold: 100000,
                procedureFeeThreshold: 500000,
                otherFeeThreshold: 100000,
                gstThreshold: 100000,
                gstRateThreshold: 0.09,

                errorStrPatient: false,
                errorStrAdmit: false,
                errorStrDischarge: false,
                errorStrConsultantFees: false,
                errorStrProcedureFees: false,
                errorStrGst: false,
                errorStrOtherFees: false,
                errorStrFile: false,
                
                errorEncounterForm: "",
                errorAddFees: "",

                // lc data response
                lcData: null,
                letterId: "",

                // Saved LC Data
                savedFacility: null,
                savedCaseAccountNumber: null,
                savedTotalHospitalCollectDisplay: null,

                // data entry - top
                facility: "",
                caseAccountNumber: "",

                // data entry - middle
                patientName: "",
                admitDate: "",
                dischargeDate: "",
                caseType: "",
                LC_fileUri: null,

                // data entry - bottom
                tosp: "",
                doctor: "",
                consultantFees: 0,
                procedureFees: 0,  
                otherFees: 0,
                gstAmount: 0,
                nonSurgical: false,
                fees: [],

            }
        },
        computed: {

            AttachedFileName(){
                if(this.LC_fileUri != null) {
                    return this.LC_fileUri.split("/").pop();
                } else {
                    return "";
                }
            },
            GetInstructions() {
                var instructions = "<strong>Instructions:</strong><hr>"
                
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
                    instructions += "Once all fees have been added, click Save Letter of Certification.";
                    return instructions;
                }
                
                // Instructions for middle section

                if(!this.ShowProcedures) {

                    // check the dates
                    var admitDT = new Date(this.admitDate);
                    var dischargeDT = new Date(this.dischargeDate);
                    var today = new Date();

                    this.hasAdmitError = false;
                    this.hasDischargeError = false;
                    
                    instructions += "<ul>";
                    if(this.patientName.length == 0) {
                        instructions += "<li>Enter the patient name.</li>";
                    }
                    if(this.admitDate == null) {
                        instructions += "<li>Enter the admit date.</li>";
                    }
                    else {
                        if(admitDT > today) {
                            this.hasAdmitError = true;
                            instructions += "<span style='color: red'>Correct the Admit Date.  Admit Date must be less than or equal to today's date.</span>";
                        }
                    }
                    if(this.dischargeDate == null) {
                        instructions += "<li>Enter the discharge date.</li>";
                    } else {
                        if(dischargeDT > today) {
                            this.hasDischargeError = true;
                            instructions += "<span style='color: red'>Correct the Discharge Date.  Discharge Date must be less than or equal to today's date.</span>";
                        }
                    }
                    if(this.admitDate != null && this.dischargeDate != null) {
                        if(admitDT > dischargeDT) {
                            this.hasAdmitError = true;
                            this.hasDischargeError = true;
                            instructions += "<span style='color: red'>Correct the Admit and Discharge Dates.  Admit Date must be less than or equal to the Discharge Date.</span>";
                        }
                    }
                    if(this.LC_fileUri == null) {   
                        instructions += "<li>Attach the Letter of Certification file.</li>";
                    }
                         
                    instructions += "<li>You will be able to enter fees once you have completed the above.</li>";
                    return instructions;
                }

                // Instructions for bottom section
                instructions += "<ul>";
                
                if(this.tosp.length == 0 && !this.nonSurgical) {
                    instructions += "<li>Select the Procedure / Operation Code.</li>";
                }
                if(this.doctor.length == 0) {
                    instructions += "<li>Select the Doctor.</li>";
                }
                if(this.consultantFees == null) {
                    instructions += "<li>Enter the Consultant Fees.</li>";
                }
                if(this.consultantFees < 0) {
                    instructions += "<li><span style='color: red'>Consultant Fees must be greater than or equal to 0.</span></li>";
                }
                if(this.consultantFees > this.consultantFeeThreshold) {
                    instructions += "<li><span style='color: orangered'>Confirm Consultant Fees -- fees are higher than expected.</span></li>";
                }
                if(!this.nonSurgical){
                    if(this.procedureFees == null) {
                        instructions += "<li>Enter the Procedure Fees.</li>";
                    } 
                    if(this.procedureFees < 0) {
                        instructions += "<li><span style='color: red'>Procedure Fees must be greater than or equal to 0.</span></li>";
                    }
                    if(this.procedureFees > this.procedureFeeThreshold) {
                        instructions += "<li><span style='color: orangered'>Confirm Procedure Fees -- fees are higher than expected.</span></li>";
                    }
                }
                if(this.otherFees == null) {
                    instructions += "<li>Enter the Other Fees.</li>";
                }
                if(this.otherFees < 0) {
                    instructions += "<li><span style='color: red'>Other Fees must be greater than or equal to 0.</span></li>";
                }
                if(this.otherFees > this.otherFeeThreshold) {
                    instructions += "<li><span style='color: orangered'>Confirm Other Fees -- fees are higher than expected.</span></li>";
                }
                if(this.gstAmount == null) {
                    instructions += "<li>Enter the GST.</li>";
                }
                if(this.gstAmount < 0) {
                    instructions += "<li><span style='color: red'>GST must be greater than or equal to 0.</span></li>";
                }
                if(this.gstAmount > this.gstThreshold) {
                    instructions += "<li><span style='color: orangered'>Confirm GST -- fees are higher than expected..</span></li>";
                }
                if(this.gstAmount > this.TotalFees * this.gstRateThreshold) {
                    instructions += "<li><span style='color: orangered'>Confirm GST -- fees are high when compared to the total fees.</span></li>";
                }
                
                return instructions;

            },
            GstDisplay() {
                return (this.gstAmount).toFixed(2);
            },
            HasFacilityAndCase(){
               if(this.$store.state.clinic.length > 0 && this.facility.length > 0 && this.caseAccountNumber.length > 2) {
                   return true;
               } else {
                   return false;
               }
            },
            HasFile(){
                return (this.LC_fileUri != null && this.LC_fileUri.length > 0);
            },
            HospitalToCollect() {
                return (this.consultantFees + this.procedureFees + this.otherFees + this.gstAmount).toFixed(2);
            },
            IsSingleClinic() {
                return this.$store.state.clinics.length == 1;
            },
            ShowProcedures(){
                
                if(this.show_detail 
                    && !this.hasAdmitError
                    && !this.hasDischargeError
                    && !this.hasFileError
                    && this.LC_fileUri != null
                    && this.LC_fileUri.length > 0 ) {
                    return true;
                } else {
                    return false;
                }
            },
            ShowSaveFeesButton(){
                if( 
                        this.consultantFees == null
                        || this.consultantFees < 0
                        || this.procedureFees == null
                        || this.procedureFees < 0
                        || this.otherFees == null   
                        || this.otherFees < 0
                        || this.gstAmount == null
                        || this.gstAmount < 0
                        || this.tosp.length == 0) {
                    return false;
                }
                else {
                    return true;
                }
            },
            ShowSaveLC(){
                if (this.fees.length > 0 && this.ShowProcedures) {
                    return true;
                } else {
                    return false;
                }
            },
            TotalFees() {
                return (this.consultantFees + this.procedureFees + this.otherFees).toFixed(2);
            },
            TotalFeesDisplay() {
                return this.FormatDollars(this.FormatNumber(this.TotalFees));
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
                this.duringSave = true;

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
                                this.LC_fileUri = responseData[0].uri;
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
                                                this.duringSave = false;
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
                                        this.LC_fileUri = responseData.blob.uri;
                                        this.isLoading = false;
                                        this.hasFileError = false;
                                        this.duringSave = false;
                                        this.errorEncounterForm = "";
                                    })
                                    // catch for file upload
                                    .catch((error) => {
                                        console.log(error);
                                        this.isLoading = false;
                                        this.hasFileError = true;
                                        this.duringSave = false;
                                        this.errorEncounterForm = "Error uploading file.";
                                    });
                                
                            }
                        }
                        
                    })
                    // catch for file info
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                        this.duringSave = false;
                        this.errorEncounterForm = "Error checking for existing file.";
                    });

            },
            ApiFindCase(letterId) {
                this.isLoading = true;
                
                if(letterId == null || letterId == " ") {
                    letterId = "";
                }
                const url = this.$store.state.apiFindLC;
                
                
                const senddata = {
                    clinic: this.$store.state.clinic,
                    facility: this.facility,
                    caseNumber: this.caseAccountNumber,
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
                         
                        this.lcdata = responseData.data;
                        
                        this.case_add = (responseData.message == "Not Found");
                        this.case_edit = (responseData.message == "Found");
                        
                        if(this.case_add) {
                            this.patientName = "";
                            this.admitDate = null;
                            this.dischargeDate = null;
                            this.caseType = "inpatient";
                            this.fees = [];
                            
                        } else {
                            this.patientName = responseData.data.patientName;
                            this.admitDate = new Date(responseData.data.admitDate).toISOString().split('T')[0];
                            this.dischargeDate = new Date(responseData.data.dischargeDate).toISOString().split('T')[0];;
                            this.caseType = responseData.data.caseType;
                            this.letterId = responseData.data.letterId;
                            this.LC_fileUri = responseData.data.fileUri;

                            
                            this.fees = [];
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

                                this.fees.push(newFees);
                            };

                        }
                  
                        // continue to main page
                        this.isLoading = false;
                        this.show_detail = true;
                        this.showSuccess = false;
                        
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                        this.showSuccess = false;
                
                    });

            },
            ApiSubmitLC(){
                this.isLoading = true;
                this.duringSave = true;
                const url = this.$store.state.apiSubmitLC;
                var lcFees = [];
                for (const f of this.fees) {
                    const lcFee = {
                        MCR_DBR: this.ExtractMCROnly(f.doctor),
                        procedureCD: f.tosp,
                        consultantFees: f.consultantFees,
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
                    letterID: this.letterId,
                    clinic: this.$store.state.clinic,
                    facility: this.facility,
                    caseAccountNumber: this.caseAccountNumber,
                    versionNo: this.lcdata.versionNo,
                    patientName: this.patientName,
                    caseType: this.caseType,
                    admitDate: this.admitDate,
                    dischargeDate: this.dischargeDate,
                    hospitalToCollectAmount: this.TotalHospitalToCollect,
                    fileUri: this.LC_fileUri,
                    fees: lcFees
                };

                this.savedFacility = this.facility;
                this.savedCaseAccountNumber = this.caseAccountNumber;
                this.savedTotalHospitalCollectDisplay = this.TotalHospitalToCollectDisplay
                
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
                                this.duringSave = false;
                                this.isLoading = false;
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
                        this.facility = "";
                        this.caseAccountNumber = "";
                        this.LC_fileUri = null;
                        this.duringSave = false;
                        this.showSuccess = true;
                        this.fees = []

                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                        this.duringSave = false;
                    });

                
                this.isLoading = false;

                
            },
            DetachFile(){
                this.hasFileError = false;
                this.LC_fileUri = null;
            },
            ExtractMCR(input) {
                const lastName = input.split(",")[0];
                const mcr = input.split("(")[1];
                const doctor = lastName + " (" + mcr;
                return doctor;
            },
            ExtractMCROnly(input) {
                var mcr = input;
                if(input.includes("(")) {
                    mcr = input.split("(")[1].split(")")[0];
                }
                return mcr;
            },
            ExtractTOSP(input){
                if(input == "Non-Surgical Charges") {
                    return input;
                }
                var tosp = input;
                if(input.includes("-")) {
                    tosp = input.split("-")[0];
                }   
                
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
                    totalFees: this.TotalFees,
                    consultantFees: this.FormatNumber(this.consultantFees),
                    procedureFees: this.FormatNumber(this.procedureFees),
                    otherFees: this.FormatNumber(this.otherFees),
                    gst:  this.FormatNumber(this.gstAmount),
                    hospitalToCollect: this.FormatNumber(this.HospitalToCollect),
                    // display fields
                    tosp_Display: this.ExtractTOSP(this.tosp),
                    doctor_Display: this.ExtractMCR(this.doctor),
                    totalFees_Display: this.TotalFeesDisplay,
                    consultantFees_Display: this.FormatDollars(this.FormatNumber(this.consultantFees)),
                    procedureFees_Display: this.FormatDollars(this.FormatNumber(this.procedureFees)),
                    otherFees_Display: this.FormatDollars(this.FormatNumber(this.otherFees)),
                    gst_Display: this.FormatDollars(this.FormatNumber(this.gstAmount)),
                    hospitalToCollect_Display: this.FormatDollars(this.FormatNumber(this.HospitalToCollect)),
                    
                };

                this.fees.push(newFees);

                this.tosp = "";
                // this.doctor = "";
                this.consultantFees = 0;
                this.procedureFees = 0;
                this.otherFees = 0;
                this.gstAmount = 0;
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
        border: 1px dashed darkred;
    }

</style>
