<template>
    <main class="add-lc-view">
        <div class="header-row">
            <h1>Letter of Certification</h1>
            <h2>
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
            </h2>
        </div>
       
        <div class="bs-docs-section" >
            <div class="row">
                <div class="col-lg-4">
                    <label for="caseNumber" class="form-label mt-4">Case / Account Number:</label>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="case or account number" id="caseNumber">
                        <button class="btn btn-primary" type="button" id="btnNext" @click="FindCase()">Next</button>
                    </div>
                </div>
                <div class="col-lg-8" :class="`${(case_readonly || case_missing) && 'hide_div'}` " >
                    <div class="form-group">
                        <label for="lcFile" class="form-label mt-4">Attach LC file</label>
                         <input class="form-control" type="file" id="lcFile">
                    </div>
                </div>
            </div>
        </div>
        <div class="bs-docs-section" :class="`${(!case_readonly || case_missing) && 'hide_div'}` " >
            <encounter></encounter>
        </div>
        <div class="bs-docs-section" :class="`${(case_readonly || case_missing) && 'hide_div'}` " >
            <form :class="`${case_missing && 'case_missing'}` ">
                <div class="row">
                    <div class="col-lg-4">
                        <label for="clinic" class="form-label mt-4">Clinic:</label>
                        <select class="form-select" id="clinic">
                            <option value="Clinic1">Clinic 1</option>
                            <option value="Clinic2">Clinic 2</option>
                            <option value="Clinic3">Clinic 3</option>
                        </select>
                    </div>
                    <div class="col-lg-4">
                        <label for="facility" class="form-label mt-4">Facility:</label>
                        <select class="form-select" id="facility">
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
                    <div class="col-lg-4">
                        <label for="caseType" class="form-label mt-4">Case Type:</label>
                        <select class="form-select" id="caseType">
                            <option value="inpatient">Inpatient</option>
                            <option value="daysurgery">Day Surgery</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <label class="col-form-label mt-4" for="patientName">Patient Name</label>
                        <input type="text" class="form-control" placeholder="patient name" id="patientName">
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label mt-4" for="admitDate">Admission Date</label>
                        <input type="date" class="form-control" placeholder="dd/mm/yyyy" id="admitDate">
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label mt-4" for="caseNumber">Discharge Date</label>
                        <input type="date" class="form-control" placeholder="case number" id="dischargeDate">
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>

<script setup>
    import { ref } from 'vue';
    import Encounter from "../components/Encounter.vue";

    const case_missing = ref(false);

    const case_add = ref(true);
    const case_edit = ref(false);
    const case_readonly = ref(false);

    const FindCase = () => {
        case_missing.value = !case_missing.value;
    }

    
</script>

<style lang="scss" scoped>
    
    form {
        border: 1px solid gainsboro;
        border-radius: 10px;
        padding: 5px;
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
