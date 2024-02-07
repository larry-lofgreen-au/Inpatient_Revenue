<template>
    <main class="add-lc-view">
        <div class="header-row">
            <h3 class="fw-bold">LC / CM Discrepancies</h3>
        </div>
        <hr>
        <div class="spinner" v-if="isLoading"></div>
        <div class="bs-docs-section mt-2" v-if="this.show_detail">
            <h4>Attach Collection Memorandum to Letter of Certification</h4>
            <hr>
            <form id="collectionMemoForm">
                <div class="row">
                    <div class="col-lg-4">
                        <label for="facility">Facility:</label>
                        <input type="text" class="form-control" id="facility" readonly
                            v-model="this.$store.state.lc_no_matching_cm_data[this.selectedIndex].facility">
                    </div>
                    <div class="col-lg-4">
                        <label for="caseAccountNumber">Case / Account Number</label>
                        <input type="text" class="form-control" id="caseAccountNumber" readonly
                            v-model="this.$store.state.lc_no_matching_cm_data[this.selectedIndex].caseAccountNumber">
                    </div>
                    <div class="col-lg-4">
                        <label for="dischargeDate">Discharge Date:</label>
                        <input type="text" class="form-control" id="dischargeDate" readonly
                            v-model="this.$store.state.lc_no_matching_cm_data[this.selectedIndex].dischargeDate">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <label for="cmAmount" class="mt-2">Collection Memo Amount:</label>
                        <input type="number" class="form-control h2rem" step="0.01" style="text-align: right;" id="cmAmount" 
                            @focus="$event.target.select()"
                            v-model="this.cm_Amount"
                            :class="`${(this.cm_Amount != this.lc_hospitalToCollect) && 'red_border'}`">
                        <div style="font-size: small; color: darkred;"
                            v-if="this.cm_Amount != this.lc_hospitalToCollect">
                            <span v-if="this.cm_Amount == null || this.cm_Amount <=0">Amount must be greater than 0.</span>
                            <span v-if="this.cm_Amount != null && this.cm_Amount > 0">Amount does not match Letter of Certification amount.</span>
                        </div>
                    </div>
                    <div class="col-lg-8" v-if="this.cm_fileUri.length == 0">
                        <div class="form-group">
                            <label for="lcFile" class="mt-2">Attach Collection Memo file</label> 
                            <input class="form-control" type="file" id="lcFile" 
                                @change="ApiFileChange($event)"
                                :class="`${hasFileError && 'red_border'}`">

                            <div style="font-size: small;" ><strong>Please Note:</strong> File must not be more than 5mb in size.  Allowed file types: PDF, JPG, PNG, GIF.</div>
                        </div>
                    </div>
                    <div class="col-lg-4" v-if="this.cm_fileUri.length > 0" style="float: right; vertical-align:bottom;">
                        <label for="lcFileLink" class="mt-2">Letter of Certification file</label> 
                        <div class="input-group mb-4" >
                            <input class="form-control" type="text" id="lcFileLink" readonly
                                v-model="this.cm_FileName">
                            <button class="btn btn-primary h2rem" type="button" id="btnDetachFile" style="margin-left:2px;" @click="DetachFile();" 
                                :disabled="this.isLoading">Detach</button>
                        </div>
                    </div>
                    <div class="mt-2" style="vertical-align:bottom;">
                       <button class="btn btn-primary" id="saveCMtoLC"
                            v-if="this.cm_FileName.length > 0 && this.cm_Amount > 0" @click.prevent="ApiAttachCM()">Save</button>
                       <button class="btn btn-primary" style="float: right;" id="cancelCMtoLC" @click.prevent="this.show_detail = false;">Cancel</button>
                    </div>    
                </div>
                
                <div id="cmError" class="alert alert-dismissible alert-danger" v-show="this.cmErrorMessage.length > 0">
                    <strong>Error:</strong> {{ cmErrorMessage }}
                </div>
            </form>
        </div>
        <div class="bs-docs-section mt-2" v-if="!this.show_detail">
            <form id="lcsForm">
                <table class="table table-striped table-light table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Facility</th>
                            <th scope="col">Case/Acct. #</th>
                            <th scope="col" style="text-align: center;">Discharge Date</th>
                            <th scope="col" style="text-align:right;">LC Amount</th>
                            <th scope="col" style="text-align:right;">Discrepancy</th>
                            <th scope="col">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody style="vertical-align: middle;">
                        <tr v-for="(f,index) in this.$store.state.lc_no_matching_cm_data"
                                :value="f"
                                :key="index">
                            <td>{{ f.facility }}</td>
                            <td>{{ f.caseAccountNumber }}</td>
                            <td style="text-align:center;">{{ f.dischargeDate }}</td>
                            <td style="text-align:right;">{{ f.hospitalToCollectDisplay }}</td>
                            <td style="text-align:right;">{{ f.discrepancyDisplay }}</td>
                            <td style="text-align:center;"><button class="btn btn-primary" @click.prevent="this.EditLC(index)">Edit LC</button> </td>
                            <td style="text-align:center;"><button class="btn btn-primary" @click.prevent="this.AttachCM(index)">Attach CM</button> </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
        <div id="error" class="alert alert-dismissible alert-danger" v-show="this.errorMessage.length > 0">
            <strong>Error:</strong> {{ errorMessage }}
        </div>
        <div id="instructions" class="alert alert-dismissible alert-info mt-2" v-html="this.GetInstructions"></div>        
        <div id="success" class="alert alert-dismissible alert-success" 
            v-html="this.successMessage"
            v-show="this.successMessage.length > 0"></div>
        
    </main>
</template>

<script>
    import { ref, computed } from 'vue';

    export default {
        name: 'LC_No_CM',
        data() {
            return {
                 // form control
                isLoading: false,
                errorMessage: "",
                cmErrorMessage: "",
                successMessage: "",
                show_detail: false,
                selectedIndex: -1,
                hasFileError: false,
                hasCM_AmountError: false,
                error: null,
                lc_hospitalToCollect: 0,
                cm_fileUri: "",
                cm_FileName: "",
                cm_Amount: 0,

            }
        },
        computed: {
            GetInstructions() {
                var instructions = "<strong>Instructions:</strong><hr>"
                if(this.$store.state.lc_no_matching_cm_data.length == 0) {
                    instructions += "No LC/CM Discrepancies found.";
                    return instructions;
                }

                if(this.show_detail) {
                    instructions += "<ul>";
                    if(this.cm_Amount == null || this.cm_Amount <= 0) {
                        instructions += "<li>Enter the Collection Memo amount</li>";
                    }
                    if(this.cm_Amount != null && this.cm_Amount > 0 && this.cm_Amount != this.lc_hospitalToCollect) {
                        instructions += "<li>Collection Memo amount does not match the Letter of Certification amount.&nbsp;<span style='color:red;'><strong>Please verify the Collection Memo amount.</strong></span></li>";
                    }
                    if(this.cm_FileName.length == 0) {
                        instructions += "<li>Attach the Collection Memo file</li>";
                    }
                    
                    if(this.cm_FileName.length > 0 && this.cm_Amount > 0) {
                        instructions += "<li>Click the <b>Save</b> to save the Collection Memo</li>";
                    }
                    instructions += "<li>You can click the <b>Cancel</b> at anytime to return to the list of LCs Waiting for a CM</li>";
                    instructions += "</ul>";
                    return instructions;
                    
                }

                instructions += "<ul>"
                instructions += "<li>To correct an LC/CM discrepancy, either edit the LC to update the amounts on the LC or attach a corrected CM.</li>";
                instructions += "<li>When you click the <b>Attach CM</b> button, the Attach Collection Memorandum to Letter of Certification form will be displayed where you can enter the Collection Memo amount and attach a Collection Memo file.</li>";
                instructions += "</ul>";
                return instructions;

                }
        },
        mounted() {
            this.ApiLoadList();
        },
        methods: {
            EditLC(index) {
                this.$store.state.letterId_to_load = this.$store.state.lc_no_matching_cm_data[index].letterId;
                this.$router.push("/lc_entry");
                
            },
            AttachCM(index) {
                this.selectedIndex = index;
                this.cm_Amount = this.$store.state.lc_no_matching_cm_data[index].cm_Amount;
                this.lc_hospitalToCollect = this.$store.state.lc_no_matching_cm_data[index].hospitalToCollect;
                this.cm_fileUri = this.$store.state.lc_no_matching_cm_data[index].cm_fileUri;
                this.successMessage = "";
                this.show_detail = true;
                
            },
            DetachFile() {
                this.cm_fileUri = "";
                this.cm_FileName = "";
            },
            ApiAttachCM(){
                if(this.cm_fileUri.length == 0) {
                    this.errorMessage = "No file selected for upload.";
                    this.hasFileError = true;
                    return;
                }

                if(this.cm_Amount == "" || this.cm_Amount <= 0) {
                    this.errorMessage = "Please enter the CM Amount.";
                    this.hasCM_AmountError = true;
                    return;
                }

                if(this.selectedIndex == -1) {
                    this.errorMessage = "Application Error (#74d34).  Please contact your System Administrator.";
                    return;
                }

                const url = this.$store.state.apiSubmitCM;
                if(this.$store.state.lc_no_matching_cm_data[this.selectedIndex].collectionMemoID == null) {
                    this.$store.state.lc_no_matching_cm_data[this.selectedIndex].collectionMemoID = "";
                }
                const senddata =
                {
                    CollectionMemoID: this.$store.state.lc_no_matching_cm_data[this.selectedIndex].collectionMemoID,
                    VersionNo: this.$store.state.lc_no_matching_cm_data[this.selectedIndex].versionNo,
                    LetterId: this.$store.state.lc_no_matching_cm_data[this.selectedIndex].letterId,
                    HospitalToCollectAmt: this.cm_Amount,
                    FileUri: this.cm_fileUri
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
                        this.$store.state.LC_No_CM_Count = responseData.lC_No_CM_Count;
                        this.$store.state.LC_Mismatched_CM_Count = responseData.lC_Mismatched_CM_Count;
                        
                        this.successMessage = "<strong>Success:</b><ul><li>Collection Memo has been attached to the Letter of Certification.</li>";
                        if (this.cm_Amount != this.lc_hospitalToCollect) {
                            this.successMessage += "<li>However, the Collection Memo amount does not match the Letter of Certification amount. Please contact ";
                            this.successMessage += this.$store.state.lc_no_matching_cm_data[this.selectedIndex].facility
                            this.successMessage += " to resolve the discrepancy.<li>";
                        }
                        this.successMessage += "</ul>";

                        this.ApiLoadList();
                        this.show_detail = false;
                        this.isLoading = false;
                        

                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                    });

                
                this.isLoading = false;
                
            },
            ApiFileChange(e) {

                this.errorMessage = "";
                this.hasFileError = false;
                this.cm_fileUri = "";

                const files = e.target.files;
                const file = ref(null);
                file.value = files[0];
                const fileName = computed(() => file.value?.name);
                const fileExtension = computed(() => fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1));
                const fileMimeType = computed(() => file.value?.type);
                const selectedFileName = fileName.value;
                
                if(files.length == 0) {
                    this.errorMessage = "No file selected for upload.";
                    this.hasFileError = true;
                    return;
                }
                if(files.length > 1){
                    this.errorMessage = "Only one file can be attached.";
                    this.hasFileError = true;
                    return;
                }

                if(files[0].size > 5000000) {
                    this.errorMessage = "File size must not exceed 5mb.";
                    this.hasFileError = true;
                    return;
                }
                
                const ext = fileExtension.value.toLowerCase();
                if(ext != "pdf" && ext != "jpg" && ext != "png" && ext != "gif") {
                    this.errorMessage = "File type not allowed.  Only PDF, JPG, PNG, and GIF are allowed.";
                    this.hasFileError = true;
                    return;
                }

                this.isLoading = true;

                // check for existing file
                
                const url = this.$store.state.apiFileInfo;
                const senddata =
                {
                    filePrefix: files[0].name,
                    GetCMFileID: "Y",
                    GetLCFileID: "N"
                    
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
                            this.errorMessage = error.message;
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
                        if(responseData.result.length > 0) {
                            if(responseData.letterID.length > 0 && responseData.letterID != letterId) {
                                this.errorMessage = "File in already exists in the system and is attached to a different LC.  Please check the file name and try again.";
                                this.hasFileError = true;
                                this.isLoading = false;
                            } else {
                                this.cm_fileUri = responseData.result[0].uri;
                                this.cm_FileName = selectedFileName;
                                        
                                this.hasFile = true;
                                this.isLoading = false;
                            }
                         } else {
                            // upload file
                            
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
                                                this.errorMessage = error.message;
                                                this.hasFileError = true;
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
                                        this.cm_fileUri = responseData.blob.uri;
                                        this.cm_FileName = selectedFileName;
                                        this.isLoading = false;
                                        this.errorMessage = "";
                                    })
                                    // catch for file upload
                                    .catch((error) => {
                                        console.log(error);
                                        this.isLoading = false;
                                        this.hasFileError = true;
                                        this.errorMessage = "Error uploading file.";
                                    });
                                
                            }
                        }
                        
                    })
                    // catch for file info
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                        this.errorMessage = "Error checking for existing file.";
                    });

            },
            ApiLoadList() {
                this.isLoading = true;
                this.$store.state.lc_no_matching_cm_data = [];
                
                
                const url = this.$store.state.apiLC_No_Matching_CM;

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": this.$store.state.token,
                    }
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
                        this.$store.state.lc_no_matching_cm_data = [];
                        
                        for(const item of responseData.lC_List)
                        {
                            const newItem = {
                                letterId: item.letterId,
                                clinic: item.clinic,
                                facility: item.facility,
                                caseAccountNumber: item.caseAccountNumber,
                                versionNo: item.versionNo,
                                dischargeDate: new Date(item.dischargeDate).toLocaleDateString('en-SG'),
                                hospitalToCollectDisplay: ("$ " + parseFloat(item.hospitalToCollectAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")).replace("$ 0","$ "),
                                hospitalToCollect: item.hospitalToCollectAmount,
                                createDate: new Date(item.createDTS).toLocaleDateString('en-SG'),
                                lc_fileUri: item.fileUri,
                                discrepancy: item.discrepancyAmount,
                                discrepancyDisplay: ("$ " + parseFloat(item.discrepancyAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")).replace("$ 0","$ "),
                                cm_FileName: "",
                            }
                            this.$store.state.lc_no_matching_cm_data.push(newItem);
                            
                        };
                        this.isLoading = false;
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
