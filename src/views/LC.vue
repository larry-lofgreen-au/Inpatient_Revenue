<template>
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
                <div class="col-4">
                    <label for="clinic" class="font-weight-bold">Clinic:</label>
                    <select class="form-select font-small h2rem" id="clinic" v-model="clinic">
                        <option value="Clinic1">Clinic 1</option>
                        <option value="Clinic2">Clinic 2</option>
                        <option value="Clinic3">Clinic 3</option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="facility">Facility:</label>
                    <select class="form-select font-small h2rem" id="facility" v-model="facility">
                        <option value="Farrer Park">Farrer Park</option>
                        <option value="Gleneagles">Gleneagles</option>
                        <option value="Mount Alvernia">Mount Alvernia</option>
                        <option value="Mount Elizabeth">Mount Elizabeth</option>
                        <option value="Mount Elizabeth - Novena">Mount Elizabeth - Novena</option>
                        <option value="Parkway East">Parkway East</option>
                        <option value="Thomson Medical Centre">Thomson Medical Centre</option>
                        <option value="Raffles">Raffles</option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="caseNumber">Case / Account Number:</label>
                    <div class="input-group mb-3" >
                        <input type="text" class="form-control font-small h2rem" placeholder="case / account #" id="caseNumber" v-model.trim="caseNumber">
                        <button class="btn btn-primary h2rem" type="button" id="btnNext" @click="FindCase()">Next</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="bs-docs-section" :class="`${(!case_readonly || case_missing) && 'hide_div'}` " >
            <encounter></encounter>
        </div>
        <div class="bs-docs-section" :class="`${(case_readonly || case_missing) && 'hide_div'}` " >
            <form>
                <div class="row">
                    <div class="col-lg-4">
                        <label for="patientName">Patient Name:</label>
                        <input type="text" class="form-control font-small h2rem" placeholder="patient name" id="patientName" v-model.trim="patientName">
                    </div>
                    <div class="col-lg-4">
                        <label for="admitDate">Admission Date:</label>
                        <input type="date" class="form-control font-small h2rem" placeholder="dd/mm/yyyy" id="admitDate" v-model="admitDate">
                    </div>
                    <div class="col-lg-4">
                        <label for="caseNumber">Discharge Date:</label>
                        <input type="date" class="form-control font-small h2rem" placeholder="case number" id="dischargeDate" v-model="dischargeDate">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <label for="caseType" class="mt-2">Case Type:</label>
                        <select class="form-select font-small h2rem" id="caseType" v-model="caseType">
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
    import Encounter from "../components/Encounter.vue";

    export default {
        name: 'LC',
        components: {
            Encounter
        },
        data() {
            return {
                clinic: '',
                facility: '',
                caseNumber: '',
                patientName: '',
                admitDate: null,
                dischargeDate: null,
                caseType: '',
                lcFile: '',
                case_edit: false,
                case_add: false,
                case_readonly: true,
                case_missing: true
            }
        },
        methods: {
            FindCase() {
                console.log("FindCase");
                this.case_missing = !this.case_missing;
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
