<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex">
                <button type="button"
                    class="text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto"
                    data-bs-toggle="modal" data-bs-target="#modalCreateUser" @click="openCreateUserModal()">
                    Agregar
                </button>
            </div>
            <div class="text-2xl font-semibold mb-1">Usuarios</div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'acciones'">
                        <button type="button"
                            class="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3"
                            data-bs-toggle="modal" data-bs-target="#modalUpdateUser"
                            @click="openUpdateUserModal(props.row)">
                            Editar
                        </button>
                        <button type="button"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            @click="openDeleteUserAlert(props.row)">
                            Eliminar
                        </button>
                    </span>
                    <span v-if="props.column.field == 'role'">
                        {{ props.row.role.name }}
                    </span>
                </template>
                <template v-slot:emptystate>
                    <div style="text-align: center">No hay datos disponibles</div>
                </template>
            </VueGoodTable>
            <div v-if="showUserDeleteAlert" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeDeleteUserAlert" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 mb-4"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="flex items-center">
                            <h3 class="text-lg font-medium">¿Estás seguro que deseas eliminar al usuario {{userDeleted.username}}?</h3>
                        </div>
                        <div class="mt-2 mb-4 text-sm">
                            Este elemento se eliminará permanentemente. Esta acción no se puede revertir.
                        </div>
                        <div class="flex">
                            <button @click="deleteUser(this.userDeleted.id)" type="button"
                                class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                                Eliminar
                            </button>
                            <button @click="closeDeleteUserAlert()" type="button"
                                class="text-red-800 bg-transparent inline-flex items-center hover:bg-red-800 hover:text-white border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                data-dismiss-target="#alert-additional-content-2" aria-label="Close">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showUserUpdateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeUpdateUserModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeUpdateUserModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="updateUser(editedUser.id, editedUser)" class="p-4 md:p-5">
                            <div class="grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        usuario:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de usuario" required="" v-model="editedUser.username" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="category"
                                        class="block mb-2 text-sm font-medium text-gray-900">Rol:</label>
                                    <select id="category"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="editedUser.roleId">
                                        <option value="" disabled selected>
                                            Seleccionar rol
                                        </option>
                                        <option v-for="role in roles" :key="role.id" :value="role.id">
                                            {{ role.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="price"
                                        class="block mb-2 text-sm font-medium text-gray-900">Contraseña:</label>
                                    <input type="password" name="price" id="price"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model="editedUser.password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="price" class="block mb-2 text-sm font-medium text-gray-900">Repetir
                                        contraseña:</label>
                                    <input type="password" name="price" id="price"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model="editedUser.repeat_password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="statusUpdateUser"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" id="statusUpdateUser" v-model="editedUser.status" />
                                </div>
                            </div>
                            <button type="submit"
                                class="text-white inline-flex items-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Editar usuario
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div v-if="showUserCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeCreateUserModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeCreateUserModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="createUser(createdUser)" class="p-4 md:p-5">
                            <div class="grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        usuario:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de usuario" required="" v-model="createdUser.username" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="category"
                                        class="block mb-2 text-sm font-medium text-gray-900">Rol:</label>
                                    <select id="category"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="createdUser.roleId">
                                        <option value="" disabled selected>
                                            Seleccionar rol
                                        </option>
                                        <option v-for="role in roles" :key="role.id" :value="role.id">
                                            {{ role.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="price"
                                        class="block mb-2 text-sm font-medium text-gray-900">Contraseña:</label>
                                    <input type="password" name="price" id="price"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model="createdUser.password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="price" class="block mb-2 text-sm font-medium text-gray-900">Repetir
                                        contraseña:</label>
                                    <input type="password" name="price" id="price"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model="createdUser.repeat_password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="statusUpdateUser"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" id="statusUpdateUser" v-model="createdUser.status" />
                                </div>
                            </div>
                            <button type="submit"
                                class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Crear usuario
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import { VueGoodTable } from "vue-good-table-next";
    import "vue-good-table-next/dist/vue-good-table-next.css";
    import { useToast } from "vue-toastification";
    import dayjs from "dayjs"; // Importa dayjs
    export default {
        name: "list-users",
        components: {
            VueGoodTable,
        },
        data() {
            return {
                showUserUpdateModal: false,
                showUserCreateModal: false,
                showUserDeleteAlert: false,
                searchOptions: {
                    enabled: true,
                    placeholder: "Buscar",
                },
                paginationOptions: {
                    enabled: true,
                    perPage: 5,
                    nextLabel: "Siguiente",
                    prevLabel: "Anterior",
                    rowsPerPageLabel: "Filas por página",
                    paginationComplete: false,
                    ofLabel: "de",
                },
                toast: useToast(),
                columns: [
                    {
                        label: "Nombre de usuario",
                        field: "username",
                    },
                    {
                        label: "Rol",
                        field: "role",
                    },
                    {
                        label: "Fecha de creación",
                        field: "date",
                        type: "date",
                        dateInputFormat: "dd-MM-yyyy HH:mm:ss",
                        dateOutputFormat: "dd-MM-yyyy",
                    },
                    {
                        label: "Estado",
                        field: "status",
                    },
                    {
                        label: "Acciones",
                        field: "acciones",
                        type: "slots",
                    },
                ],
                rows: [],
                roles: [],
                editedUser: {
                    id:"",
                    username: "",
                    password: "",
                    repeat_password: "",
                    roleId: "",
                    status: "",
                },
                createdUser: {
                    username: "",
                    password: "",
                    repeat_password: "",
                    roleId: "",
                    status: false,
                },
                userDeleted:{
                    id:"",
                    username: "",
                    password: "",
                    repeat_password: "",
                    roleId: "",
                    status: "",
                }
                
            };
        },
        mounted() {
            this.getDataUsers();
            this.getDataRoles();
        },
        methods: {
            openUpdateUserModal(item) {
                this.editedUser = { ...item, roleId: item.role.id };
                this.showUserUpdateModal = true;
                if (item.status === "Activo") {
                    this.editedUser.status = true;
                } else {
                    this.editedUser.status = false;
                }
            },
            openCreateUserModal() {
                this.showUserCreateModal = true;
            },
            closeUpdateUserModal() {
                this.showUserUpdateModal = false;
            },
            closeCreateUserModal() {
                this.showUserCreateModal = false;
            },
            openDeleteUserAlert(item){
                this.userDeleted={...item}
                this.showUserDeleteAlert = true;
            },
            closeDeleteUserAlert(){
                this.showUserDeleteAlert = false;
            },
            getDataUsers() {
                GlobalService.getData("/auth/list-users")
                    .then((response) => {
                        this.rows = response.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getDataRoles() {
                GlobalService.getData("/auth/list-roles")
                    .then((response) => {
                        this.roles = response.roles.map((role) => ({
                            id: role.id,
                            name: role.name,
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            createUser(createdUser) {
                GlobalService.createData("/auth/create-user", createdUser)
                    .then((response) => {
                        this.toast.success(response.data.msg);
                        this.rows = response.data.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                        this.closeCreateUserModal()
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        console.log(errors)
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            },
            updateUser(userId, editedUser) {
                GlobalService.setData("/auth/update-user", userId, editedUser)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                        this.closeUpdateUserModal()
                    })
                    .catch((e) => {
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
            deleteUser(userId) {
                GlobalService.deleteDataById("/auth/delete-user", userId)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                        this.closeDeleteUserAlert()
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        console.log(errors)
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            }
        },
    };
</script>

<style>
</style>