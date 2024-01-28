import { createApp } from 'vue'
import { createStore } from 'vuex'

import App from './App.vue'
import router from './router/router'
import SideBar from './components/SideBar.vue'

const app = createApp(App)

const store = createStore({
    state() {
        return {
            token: '',
            user: {
                user_id: '',
                username: '',
                password: ''
            },
            clinics: [],
            facilities: [],
            doctors: [],
            procedures: [],
            isLoggedIn: false

        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUser(state, user) {
            state.user = user;
        },
        setClinics(state, clinics) {
            state.clinics = clinics;
        },
        addClinic(state, clinic) {
            let index = state.clinics.indexOf(clinic);
            if (index === -1)
                state.clinics.push(clinic);
        },
        removeClinic(state, clinic) {
            let index = state.clinics.indexOf(clinic);
            if (index !== -1)
                state.clinics.splice(index, 1);
        },
        setFacilities(state, facilities) {
            state.facilities = facilities;
        },
        addFacility(state, facility) {
            let index = state.facilities.indexOf(facility);
            if (index === -1)
                state.facilities.push(facility);
        },
        removeFacility(state, facility) {
            let index = state.facilities.indexOf(facility);
            if (index !== -1)
                state.facilities.splice(index, 1);
        },
        setDoctors(state, doctors) {
            state.doctors = doctors;
        },
        addDoctor(state, doctor) {
            let index = state.doctors.indexOf(doctor);
            if (index === -1)
                state.doctors.push(doctor);
        },
        removeDoctor(state, doctor) {
            let index = state.doctors.indexOf(doctor);
            if (index !== -1)
                state.doctors.splice(index, 1);
        },
        setProcedures(state, procedures) {
            state.procedures = procedures;
        },
        addProcedure(state, procedure) {
            let index = state.procedures.indexOf(procedure);
            if (index === -1)
                state.procedures.push(procedure);
        },
        removeProcedure(state, procedure) {
            let index = state.procedures.indexOf(procedure);
            if (index !== -1)
                state.procedures.splice(index, 1);
        },
        setAuth(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        }
    },
    actions: {
        setToken(context, token) {
            context.commit('setToken', token);
        },
        setUser(context, user) {
            context.commit('setUser', user);
        },
        setClinics(context, clinics) {
            context.commit('setClinics', clinics);
        },
        addClinic(context, clinic) {
            context.commit('addClinic', clinic);
        },
        removeClinic(context, clinic) {
            context.commit('removeClinic', clinic);
        },
        setFacilities(context, facilities) {
            context.commit('setFacilities', facilities);
        },
        addFacility(context, facility) {
            context.commit('addFacility', facility);
        },
        removeFacility(context, facility) {
            context.commit('removeFacility', facility);
        },
        setDoctors(context, doctors) {
            context.commit('setDoctors', doctors);
        },
        addDoctor(context, doctor) {
            context.commit('addDoctor', doctor);
        },
        removeDoctor(context, doctor) {
            context.commit('removeDoctor', doctor);
        },
        setProcedures(context, procedures) {
            context.commit('setProcedures', procedures);
        },
        addProcedure(context, procedure) {
            context.commit('addProcedure', procedure);
        },
        removeProcedure(context, procedure) {
            context.commit('removeProcedure', procedure);
        },
        Login(context) {
            context.commit('setAuth', true);
        },
        Logout(context) {
            context.commit('setAuth', false);
            context.commit('setToken', '');
        }
        
    },
    getters: {
        token(state) {
            return state.token;
        },
        user(state) {
            return state.user;
        },
        clinics(state) {
            return state.clinics;
        },
        clinic(state,index){
            return state.clinics[index];
        },
        facilities(state) {
            return state.facilities;
        },
        facility(state,index){
            return state.facilities[index];
        },
        doctors(state) {
            return state.doctors;
        },
        doctor(state,index){
            return state.doctors[index];
        },
        procedures(state) {
            return state.procedures;
        },
        procedure(state,index){
            return state.procedures[index];
        },
        isAuth(state) {
            return state.isLoggedIn;
        }
    }
})

app.use(store);
app.use(router);

app.component('side-bar', SideBar);

app.mount('#app');