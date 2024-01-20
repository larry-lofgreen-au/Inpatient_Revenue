<template>
  <aside :class="`${is_expanded && 'is-expanded'}` ">
    <div class="menu-toggle-wrap">
        <button class="menu-toggle" @click="ToggleMenu">
          <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
       </button>          
    </div>
    <div class="menu">
      <h3>I want to...</h3>
      <br>
      <router-link class="button" to="/lc">
        <span class="material-symbols-outlined">post_add</span>
        <span class="text">Add Letter of Certification</span>
      </router-link>
      <router-link class="button" to="/find_lc">
        <span class="material-symbols-outlined">
          search</span>
        <span class="text">Find / Correct a Letter of Certification</span>
      </router-link>
      <router-link class="button" to="/attach_cm">
        <span class="material-symbols-outlined">forms_add_on</span>
        <span class="text">Attach Collection Memo to a Letter of Certification
        </span>
      </router-link>
      <router-link class="button" to="/search_cm">
        <span class="material-symbols-outlined">quick_reference_all</span>
        <span class="text">Find / Correct a Collection Memo
        </span>
      </router-link>
      <router-link class="button" to="/help">
        <span class="material-symbols-outlined">help</span>
        <span class="text">Get Help
        </span>
      </router-link>
    </div>
    <div class="flex"></div>
    <div class="menu">
      <router-link class="button" to="/settings">
        <span class="material-symbols-outlined">settings</span>
        <span class="text">Settings</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
  import { ref } from 'vue'

  const is_expanded = ref(true)

  const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value
  }

</script>

<style lang="scss">
  aside {
    display: flex;
    flex-direction: column;
    width: calc(2rem + 32px);
    overflow: hidden;
    min-height: 100vh;
    padding: 1rem;
    background-color: var(--dark);

    transition: 0.1s ease-out;

    .flex {
      flex: 1 1 0;
    }

    .menu-toggle-wrap {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    
      position: relative;
      top: 0;
   
      .menu-toggle {
        visibility: hidden;
        .material-symbols-outlined {
          color: var(--light); 
          max-height: 1rem;
        }

        &:hover {
          .material-symbols-outlined {
            color: var(--primary);
            transform: translateX(0.5rem);
          }
        }
      }
    }

    h3, .button .text {
      opacity: 0;
    }

    h3 {
      color: var(--grey);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    .menu {
      margin: 0 -1rem;
      font-size: small;

      .button {
        display: flex;
        align-items: center;
        text-decoration: none;

        padding: 0.5rem 1rem;
        
        .material-symbols-outlined {
          font-size: 2rem;
          color: var(--light);
          margin-right: 1rem;
        
        }

        .text {
          color: var(--light);
        
        }

        &:hover, &.router-link-exact-active {
          background-color: #2a333c;
          
          .material-symbols-outlined, .text {
            color: var(--primary);
          }
        }

        &.router-link-exact-active {
          border-right: 5px solid var(--primary);
        }

        
      }

      color: var(--light);

    }

    &.is-expanded {
      width: var(--sidebar-width);

      .menu-toggle-wrap {
        .menu-toggle {
          transform: rotate(-180deg);
        }
      }

      h3, .button .text {
        opacity: 1;
  
      }

      .button {
        .material-symbols-outlined {
          margin-right: 1rem;
        }
      }
    }

    
    @media (max-widht: 768px){
      position: fixed;
      z-index: 99;
    }
  }

</style>