<template>
    <div id="changePassword">
        <div class="card border-dark mt-4">
            <div class="spinner" v-if="isLoading"></div>
            <div class="card-header" >
                <h3 style="text-align: center;">Inpatient Revenue Tracker - Change Password</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="form-group">
                        <label for="plxu" class="form-label mt-4">New Password:</label>
                        <input
                            type="password"
                            class="form-control"
                            id="plxNew"
                            placeholder="New Password"
                            v-model.trim="new_password"
                        />
                    </div>
                    <div class="form-group">
                        <label for="plxp" class="form-label mt-4">Password:</label>
                        <input
                        type="password"
                        class="form-control"
                        id="plxConfirm"
                        placeholder="Confirm Password"
                        autocomplete="off"
                        v-model.trim="confirm_password"
                        />
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-lg mt-4" type="button" id="btnChangePassword" @click="ChangePassword()">
                            Change Password
                        </button>
                        <button class="btn btn-secondary btn-lg mt-4" style="float:right;" type="button" id="btnCancelChange" @click="CancelChange()" v-if="!this.$store.state.passwordChangeForced">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-dismissible alert-danger" v-show="!this.formIsValid">
            <button type="button" class="btn-close" data-bs-dismiss="alert" @click="this.formIsValid = true"></button>
            <strong>Error:</strong> {{ this.error }}
        </div>
    </div>
</template>

<script>
    
    export default {
    name: "ChangePassword",
    data() {
        return {
        new_password: "",
        confirm_password: "",
        formIsValid: true,
        isLoading: false,
        error: null
        };
    },
    methods: {
        CancelChange(){
            this.$store.state.passwordChangeRequired = false;
            this.$router.push("/lc_entry");
        },
        ChangePassword() {
            this.formIsValid = true;
            if (this.new_password === "" || this.new_password.length < 6) {
                this.error = "Password must be at least 6 characters long.";
                this.formIsValid = false;
                return;
            }

            if(this.new_password !== this.confirm_password) {
                this.error = "Passwords do not match.";
                this.formIsValid = false;
                return;
            }

            this.isLoading = true;

            var url = this.$store.state.apiChangePassword;

            var data = {
                UserID: this.$store.state.user_id,
                New_Password: this.HashCode(this.new_password).toString()
            };

            var options = {
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
                    console.log("Ok");
                    return response;
                } else {
                    return response.then((error) => {
                    const e = new Error(response.statusText);
                    e.data = error;
                    this.formIsValid = false;
                    throw e;
                    });
                }
                })
                .then((responseData) => {
                    this.$store.state.passwordChangeRequired = false;
                    this.$store.state.password = data.New_Password;
                    this.isLoading = false;
                    this.$router.push("/lc_entry");
                })
                .catch((error) => {
                    console.log("Catch");
                    console.log(error);
                    this.isLoading = false;
                });
            },
            HashCode(s) {
            for (var i = 0, h = 0; i < s.length; i++)
                h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
            return h;
            },
        },
    };
</script>

<style scoped>
    #changePassword {
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
        height: 60px;
        width: 60px;
        margin: 0px auto;
        -webkit-animation: rotation 0.6s infinite linear;
        -moz-animation: rotation 0.6s infinite linear;
        -o-animation: rotation 0.6s infinite linear;
        animation: rotation 0.6s infinite linear;
        border-left: 6px solid rgba(0, 174, 239, 0.15);
        border-right: 6px solid rgba(0, 174, 239, 0.15);
        border-bottom: 6px solid rgba(0, 174, 239, 0.15);
        border-top: 6px solid #4ade80;
        border-radius: 100%;
        }

    @-webkit-keyframes rotation {
        from {
        -webkit-transform: rotate(0deg);
        }
        to {
        -webkit-transform: rotate(359deg);
        }
    }

    @-moz-keyframes rotation {
        from {
        -moz-transform: rotate(0deg);
        }
        to {
        -moz-transform: rotate(359deg);
        }
    }

    @-o-keyframes rotation {
        from {
        -o-transform: rotate(0deg);
        }
        to {
            -o-transform: rotate(359deg);
        }
    }

    @keyframes rotation {
        from {
        transform: rotate(0deg);
        }
        to {
        transform: rotate(359deg);
        }
    }
</style>
