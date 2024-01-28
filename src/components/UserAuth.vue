<template>
    <div id="login">
        <div class="card border-dark mt-4">
            <div class="card-header">
                <h3>Revenue Tracker Login</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="form-group">
                        <label for="plxu" class="form-label mt-4">Username:</label>
                        <input type="text" class="form-control" id="plxu" aria-describedby="username" placeholder="Username" v-model.trim="username">
                    </div>
                    <div class="form-group">
                        <label for="plxp" class="form-label mt-4">Password:</label>
                        <input type="password" class="form-control" id="plxp" placeholder="Password" autocomplete="off" v-model.trim="password">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary mt-4" type="button" id="btnLogin" @click="Login()">Login</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                username: '',
                password: '',
                formIsValid: true,
                token: ''
            }
        },
        methods: {
            Login() {
                this.formIsValid = true;
                if(this.username === '' || this.password.length < 6){
                    this.formIsValid = false;
                    return;
                }
                this.$store.dispatch('Login', {username: this.username, password: this.password})   
                // this.$router.push('/lc');
            }
            ,HashCode(s){
                for(var i = 0, h = 0; i < s.length; i++)
                    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
                return h;
            }
        }
    }
</script>


<style scoped>
    #login {
        margin: 0 auto;
        width: 30%;

    }

    form {
        display: flex;
        flex-direction: column;
    }

    label {
        font-weight: bold;
    }



</style>
