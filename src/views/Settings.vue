<template>
    <main class="settings-view">
        <div class="accordion" id="settings">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Clinics
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body bg-light">
                        List of clinics assigned to this user.  Controls what is displayed in the dropdown list for clinic selection.
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Clinic 1
                                <input type="button" class="btn btn-danger btn-sm" value="Remove" />
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Clinic 2
                                <input type="button" class="btn btn-danger btn-sm" value="Remove" />
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Clinic 3
                                <input type="button" class="btn btn-danger btn-sm" value="Remove" />
                            </li>
                        </ul>
                        <input type="button" class="btn btn-success btn-sm" value="Add Clinic" />
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Facilities
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        List of facilities assigned to this user. 
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Procedures
                    </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        List of procedures assigned to this user.
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
   
</script>

<style lang="scss" scoped>
 
</style>
