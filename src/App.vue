<template>
  
  <div class="app">
    <UserAuth v-if="!this.$store.state.isLoggedIn"></UserAuth>
    <ChangePassword v-if="this.$store.state.isLoggedIn && this.$store.state.passwordChangeRequired"></ChangePassword>
    <SidebarVue v-if="this.$store.state.isLoggedIn && !this.$store.state.passwordChangeRequired"></SidebarVue>
    <router-view v-if="this.$store.state.isLoggedIn && !this.$store.state.passwordChangeRequired"/>
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
      UserAuth
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
    --primary: #4ade80;
    --grey: #64748b;
    --light-grey: #94A4Bb;
    --dark: #1e293b;
    --dark-alt: #2a333c;
    --light: #f1f5f9;
    --sidebar-width: 250px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Fira sans', sans-serif; 
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

  

</style>
