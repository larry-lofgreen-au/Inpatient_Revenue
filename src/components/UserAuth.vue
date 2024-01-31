<template>
    <div style="visibility: hidden;">
        <input type="text" id="ip_address"/>
    </div>
    <div id="login" class="mt-4">
        <div class="card border-dark mt-4">
            <div class="spinner" v-if="isLoading"></div>
            <div class="card-header" style="text-align: center;">
                <h3>Inpatient Revenue Tracker Login</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="form-group">
                        <label for="plxu" class="form-label mt-2">Username:</label>
                        <input
                            type="text"
                            class="form-control"
                            id="plxu"
                            aria-describedby="username"
                            placeholder="Username"
                            v-model.trim="this.$store.state.username"
                        />
                    </div>
                    <div class="form-group">
                        <label for="plxp" class="form-label mt-4">Password:</label>
                        <input
                            type="password"
                            class="form-control"
                            id="plxp"
                            placeholder="Password"
                            autocomplete="off"
                            v-model.trim="this.$store.state.password"
                        />
                    </div>
                    <div class="form-group">
                        <button
                            class="btn btn-primary btn-lg mt-4"
                            type="button"
                            id="btnLogin"
                            @click="Login()"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-dismissible alert-danger" v-show="!this.formIsValid">
            <button type="button" class="btn-close" data-bs-dismiss="alert" @click="this.formIsValid = true"></button>
            <strong>Failed to Authenticate:</strong> Incorrect user name and / or password.
        </div>
    </div>
</template>

<script>
    import $ from "jquery";

    $(document).ready(function() {
        $.getJSON("https://api.ipify.org?format=json", function(data) {
            $("#ip_address").val(data.ip);
        });
    });

    export default {
        name: 'UserAuth',
        computed: {

        },
        data() {
            return {
                isLoading: false,
                formIsValid: true,
                error: null
            }
        },
        methods: {
            Login() {
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

                            // temporary
                            if(url.indexOf("localhost") > -1) {
                                this.$store.state.isLocal = true;
                                console.log(this.$store.state.token);
                            } else {
                                this.$store.state.isLocal = false;
                            }

                            // continue to main page
                            this.isLoading = false;
                            this.$router.push("/lc");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.isLoading = false;
                    });
        },
        HashCode(s) {
            for (var i = 0, h = 0; i < s.length; i++)
                h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
            return h;
        },
    }
} 
    
</script>

<style scoped>

    #login {
        display: flex;
        flex-direction: column;
        width: 50%;
        margin: 0 auto;
        padding-top: 2rem;
    }

    label {
        font-weight: bold;
    }

    .spinner {
        position: absolute;
        left: 50%;
        top: 50%;
        height:60px;
        width:60px;
        margin:0px auto;
        -webkit-animation: rotation .6s infinite linear;
        -moz-animation: rotation .6s infinite linear;
        -o-animation: rotation .6s infinite linear;
        animation: rotation .6s infinite linear;
        border-left:6px solid rgba(0,174,239,.15);
        border-right:6px solid rgba(0,174,239,.15);
        border-bottom:6px solid rgba(0,174,239,.15);
        border-top:6px solid #4ade80;
        border-radius:100%;
    }
        
    @-webkit-keyframes rotation {
        from {-webkit-transform: rotate(0deg);}
        to {-webkit-transform: rotate(359deg);}
    }
    @-moz-keyframes rotation {
        from {-moz-transform: rotate(0deg);}
        to {-moz-transform: rotate(359deg);}
    }
    @-o-keyframes rotation {
        from {-o-transform: rotate(0deg);}
        to {-o-transform: rotate(359deg);}
    }
    @keyframes rotation {
        from {transform: rotate(0deg);}
        to {transform: rotate(359deg);}
    }
</style>