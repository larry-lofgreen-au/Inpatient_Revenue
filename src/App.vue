<template>
  
  <div class="app">
    <UserAuth v-if="!this.$store.state.isLoggedIn"></UserAuth>
    <ChangePassword v-if="this.$store.state.isLoggedIn 
        && this.$store.state.passwordChangeRequired"></ChangePassword>
    <SidebarVue v-if="this.$store.state.isLoggedIn 
        && !this.$store.state.passwordChangeRequired"></SidebarVue>
    <router-view v-if="this.$store.state.isLoggedIn 
        && !this.$store.state.passwordChangeRequired 
        && !this.$store.state.showMo "/>
  </div>
  
</template>

<script>
  import ChangePassword from './components/ChangePassword.vue';
  import SidebarVue from './components/Sidebar.vue';
  import UserAuth from './components/UserAuth.vue';
  
  export default {
    name: 'App',
    components: {
      ChangePassword,
      SidebarVue,
      UserAuth,
    },
    data() {
      return {
        // selected data
        clinic: null,
        facility: null,
        doctor: null,
        doctor_mcr: null,
        procedure: null,
        procedure_cd: null,        
      }
    },
    methods: {
      
    }
  } 
  
</script>

<style lang="scss">

  :root {
    --primary: #3ECB9D;
    --dark: #000000;
    --dark-alt: #2a333c;
    --grey: #b4b4b4;
    --light-grey: #d4d4d4;
    --light: #fafafa;
    --instructions: #54c4ff;
    --sidebar-width: 250px;

  }

  #instructions {
    // background-color: var(--instructions);
    color: #000000;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family:  Axiforma, 'Fira sans', sans-serif; 
  }

  body {
    background: var(--light);
  }

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
  }

  .app {
    display: flex;

    main {
      flex: 1 0 0;
      padding: 2rem;

      @media (max-width: 768px){
        padding-left: 6rem;
      }
    }
  }

  .material-symbols-outlined {
    display: flex;
    justify-content: center;
    align-items: center;
    
    font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24,
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
        border-top:6px solid #009135;
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
