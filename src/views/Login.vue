<template>
    <div id="login">
        <div class="login-container bg-light">
            <h3>Revenue Tracker Login</h3>
            <div class="form-group row">
                <div class="form-group">
                <label for="plxu" class="form-label mt-4">Username</label>
                    <input type="text" class="form-control" id="plxu" aria-describedby="username" placeholder="Username">
                </div>
                <div class="form-group">
                    <label for="plxp" class="form-label mt-4">Password</label>
                    <input type="password" class="form-control" id="plxp" placeholder="Password" autocomplete="off">
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" type="button" id="btnLogin" @click="Login()">Login</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
    const Login = () => {
        var plxu = document.getElementById('plxu').value;
        var plxp = document.getElementById('plxp').value;

    }

</script>
<style scoped>
    #login {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin-top:0;
        margin-left:5%;
        
    }

    .login-container {
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
    }

    form {
        display: flex;
        flex-direction: column;
    }


</style>
