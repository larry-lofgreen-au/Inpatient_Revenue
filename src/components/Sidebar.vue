<template>
    <aside>
      <div class="menu">
        <h3 style="padding-left: 10px;">Inpatient Revenue Tracker</h3>
        <hr>
        <router-link class="button" to="/lc_entry">
          <span class="text">Letter of Certification</span>
        </router-link>
        <router-link class="button" to="/attach_cm">
          <span class="text">Collection Memo</span>
        </router-link>
        <hr>
        <!--router-link class="button" to="/search_lc" v-if="this.$store.state.LC_No_CM_Count > 0"-->
        <router-link class="button" to="/lc_no_cm">
          <span class="text" style="padding-right: 10px;">LCs Waiting for CM </span>
          <span class="badge rounded-pill">{{ this.Needs_CM_Count }}</span>
        </router-link>
        <!--router-link class="button" to="/search_cm" v-if="this.$store.state.LC_Mismatched_CM_Count > 0"-->
        <router-link class="button" to="/lc_mismatched_cm">
          <span class="text" style="padding-right: 10px;">Mismatched LC/CM</span>
          <span class="badge rounded-pill">{{ this.Mismatched_CM_Count }}</span>
          
        </router-link>
      </div>
      <div class="flex"></div>
      <div class="menu">
        <hr>
        <button class="btn-link" id="ChangePassword" @click="ChangePassword()">
          <span class="text">Change My Password</span>
        </button>
        <hr>
        <button class="btn-link" id="Logout" @click="Logout()">
          <span class="text">Logout</span>
        </button>
        
      </div>
    </aside>
  </template>
  
  <script>
    export default {
      name: 'Sidebar',
      computed: {
        Needs_CM_Count() {
          if(this.$store.state.LC_No_CM_Count == null)
            return 0;
          else
            return this.$store.state.LC_No_CM_Count;
        },
        Mismatched_CM_Count() {
          if(this.$store.state.LC_Mismatched_CM_Count == null)
            return 0;
          else
            return this.$store.state.LC_Mismatched_CM_Count;
        }
      },
      methods: {
        Logout() {
          this.$store.state.isLoggedIn = false;
        },
        ChangePassword() {
          this.$store.state.passwordChangeForced = false;
          this.$store.state.passwordChangeRequired = true;
          
        }
      }
    }
  </script>
  
  
  <style lang="scss" scoped>
    aside {
      display: flex;
      flex-direction: column;
      width: var(--sidebar-width);
      overflow: hidden;
      min-height: 100vh;
      padding: 1rem;
      background-color: var(--dark);
  
      transition: 0.1s ease-out;
  
      .flex {
        flex: 1 1 0;
      }
  
      h3 {
        color: var(--light-grey);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
      }
  
      .menu {
        margin: 0 -1rem;
        font-size: small;
  
        .badge {
          margin-right: 0.5rem;
          background-color: var(--light);
          color: var(--dark);
        }
  
        .button, .btn-link{
          display: flex;
          align-items: center;
          text-decoration: none;
  
          padding: 0.5rem 1rem;
  
          .text {
            color: var(--light);
          
          }
  
          &:hover, &.router-link-exact-active {
            background-color: #2a333c;
            
            .text {
              color: var(--primary);
            }

            .badge {
              background-color: var(--primary);
            }
          }
  
          &.router-link-exact-active {
            border-right: 5px solid var(--primary);
          }
  
          
        }
  
        color: var(--light);
  
      }
      
      @media (max-widht: 768px){
        position: fixed;
        z-index: 99;
      }
    }
  
  </style>