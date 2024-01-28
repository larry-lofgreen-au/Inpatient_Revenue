<template>
  <aside>
    <div class="menu">
      <h3>I need to process ...</h3>
      <hr>
      <router-link class="button" to="/lc">
        <span class="text">Letter of Certification</span>
      </router-link>
      <router-link class="button" to="/attach_cm">
        <span class="text">Collection Memo</span>
      </router-link>
      <hr>
      <router-link class="button" to="/search_lc">
        <span class="badge rounded-pill">2</span>
        <span class="text">LCs Waiting for CM </span>
      </router-link>
      <router-link class="button" to="/search_cm">
        <span class="badge rounded-pill">4</span>
        <span class="text">Mismatched LC/CM</span>
      </router-link>
    </div>
    <div class="flex"></div>
    <div class="menu">
      <hr>
      <router-link class="button" to="/settings">
        <span class="text">Settings</span>
      </router-link>
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
    methods: {
      Logout() {
        this.$store.dispatch('Logout')
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