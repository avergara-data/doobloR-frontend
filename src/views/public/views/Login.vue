<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
      <!-- left side -->
      <div class="flex flex-col justify-center p-8 md:p-14">
        <span class="mb-3 text-4xl font-bold">DoobloReports</span>
        <span class="font-light text-gray-400 mb-8">
          Bienvenido al sistema de reportes de Dooblo creado por Datavoz
        </span>
        <div class="py-4">
          <span class="mb-2 text-md">Nombre de usuario</span>
          <input type="text"
            class="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
            name="username" id="username" v-model.trim="user.username"/>
        </div>
        <div class="py-4">
          <span class="mb-2 text-md">Contraseña</span>
          <input type="password" name="pass" id="pass"
            class="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
            v-model.trim="user.password" />
        </div>
        <button class="w-full bg-violet-700 text-white p-2 rounded-lg mb-6" @click="login(this.user)">
          Ingresar
        </button>
      </div>
      <!-- {/* right side */} -->
      <div class="relative">
        <img src="../../../assets/img/Logo.jpg" alt="img"
          class="w-[400px] h-full hidden rounded-r-2xl md:block object-cover" />
        <!-- text on image  -->
        <div
          class="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import "../../../store/index.js";
  import { mapActions } from "vuex";
  import { useToast } from "vue-toastification";
  export default {
    name: "login",
    data() {
      return {
        user: { username: "", password: "" },
        inputType: "password",
        toast: useToast(),
      };
    },
    methods: {
      ...mapActions(["loginUser"]),
      login(user) {
        this.loginUser(user)
          .then((response) => {
            if (response.status == 200) {
              this.resetDataUser();
              this.$router.push({ name: "home" });
            }
          })
          .catch((e) => {
            console.log(e);
            let errors = e.response.data.errors;
            let error = e.response.data.error;
            if (errors) {
              errors.forEach((error_element) => {
                this.toast.error(error_element.msg);
              });
            } else {
              this.toast.error(error);
            }
          });
      },
      resetDataUser() {
        this.user.nombre = "";
        this.user.password = "";
      },
      togglePasswordType() {
        this.inputType = this.inputType === "password" ? "text" : "password";
      },
    },
  };
</script>

<style>
</style>