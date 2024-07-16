<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex">
                <button type="button"
                    class="text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto"
                    data-bs-toggle="modal" data-bs-target="#modalcreateStudy" @click="openCreateStudyModal()">
                    Agregar
                </button>
            </div>
            <div class="text-2xl font-semibold mb-1">Estudios</div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'acciones'">
                        <button type="button"
                            class="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3"
                            data-bs-toggle="modal" data-bs-target="#modalUpdateStudy"
                            @click="openUpdateStudyModal(props.row)">
                            Editar
                        </button>
                        <button type="button"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            @click="openDeleteStudyAlert(props.row)">
                            Eliminar
                        </button>
                    </span>
                </template>
                <template v-slot:emptystate>
                    <div style="text-align: center;">
                        No hay datos disponibles
                    </div>
                </template>
            </VueGoodTable>
            <div v-if="showStudyDeleteAlert" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeDeleteStudyalert" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 mb-4"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="flex items-center">
                            <h3 class="text-lg font-medium">¿Estás seguro que deseas eliminar al usuario {{studyDeleted.name}}?</h3>
                        </div>
                        <div class="mt-2 mb-4 text-sm">
                            Este elemento se eliminará permanentemente. Esta acción no se puede revertir.
                        </div>
                        <div class="flex">
                            <button @click="deleteStudy(this.studyDeleted.id)" type="button"
                                class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                                Eliminar
                            </button>
                            <button @click="closeDeleteStudyalert()" type="button"
                                class="text-red-800 bg-transparent inline-flex items-center hover:bg-red-800 hover:text-white border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                data-dismiss-target="#alert-additional-content-2" aria-label="Close">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showStudyUpdateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeUpdateStudyModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeUpdateStudyModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="updateStudy(editedStudy.id, editedStudy)" class="p-4 md:p-5">
                            <div class="grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="surveyID" class="block mb-2 text-sm font-medium text-gray-900">Id de
                                        encuesta:</label>
                                    <input type="text" name="surveyID" id="surveyID"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Id de encuesta" v-model="editedStudy.surveyID">
                                </div>
                                <div class="col-span-2">
                                    <label for="code" class="block mb-2 text-sm font-medium text-gray-900">Código del
                                        estudio:</label>
                                    <input type="text" name="code" id="code"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Código del estudio" v-model="editedStudy.code">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        estudio:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de estudio" v-model="editedStudy.name">
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCase" class="block mb-2 text-sm font-medium text-gray-900">Casos
                                        esperados:</label>
                                    <input type="number" name="expectedCase" id="expectedCase"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="editedStudy.expectedCase" min="0">
                                </div>
                                <div class="col-span-2">
                                    <label for="startDate" class="block mb-2 text-sm font-medium text-gray-900">Fecha de
                                        inicio del estudio:</label>
                                    <input type="date" name="startDate" id="startDate"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="editedStudy.startDate">
                                </div>
                                <div class="col-span-2">
                                    <label for="RegionVarName"
                                        class="block mb-2 text-sm font-medium text-gray-900">Región:</label>
                                    <input type="text" name="RegionVarName" id="RegionVarName"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Región" v-model="editedStudy.RegionVarName">
                                </div>
                                <div class="col-span-2">
                                    <label for="ComunaVarName"
                                        class="block mb-2 text-sm font-medium text-gray-900">Comuna:</label>
                                    <input type="text" name="ComunaVarName" id="ComunaVarName"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Comuna" v-model="editedStudy.ComunaVarName">
                                </div>
                                <div class="col-span-2">
                                    <label for="UMPVarName"
                                        class="block mb-2 text-sm font-medium text-gray-900">UMP:</label>
                                    <input type="text" name="UMPVarName" id="UMPVarName"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="UMP" v-model="editedStudy.UMPVarName">
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="status"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" name="status" id="status" v-model="editedStudy.status" />
                                </div>
                            </div>
                            <button type="submit"
                                class="text-white inline-flex items-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Editar estudio
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div v-if="showStudyCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeCreateStudyModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeCreateStudyModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="createStudy(createdStudy)" class="p-4 md:p-5">
                            <div class="grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="surveyID" class="block mb-2 text-sm font-medium text-gray-900">Id de
                                        encuesta:</label>
                                    <input type="text" name="surveyID" id="surveyID"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Id de encuesta" v-model="createdStudy.surveyID">
                                </div>
                                <div class="col-span-2">
                                    <label for="code" class="block mb-2 text-sm font-medium text-gray-900">Código del
                                        estudio:</label>
                                    <input type="text" name="code" id="code"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Código del estudio" v-model="createdStudy.code">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre del
                                        estudio:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre del estudio" v-model="createdStudy.name">
                                </div>
                                <div class="col-span-2">
                                    <label for="expectedCase" class="block mb-2 text-sm font-medium text-gray-900">Casos
                                        esperados:</label>
                                    <input type="number" name="expectedCase" id="expectedCase"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Casos esperados" v-model="createdStudy.expectedCase" min="0">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Fecha de
                                        inicio del estudio:</label>
                                    <input type="date" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="createdStudy.startDate">
                                </div>
                                <div class="col-span-2">
                                    <label for="name"
                                        class="block mb-2 text-sm font-medium text-gray-900">Region:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Región" v-model="createdStudy.RegionVarName">
                                </div>
                                <div class="col-span-2">
                                    <label for="name"
                                        class="block mb-2 text-sm font-medium text-gray-900">Comuna:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Comuna" v-model="createdStudy.ComunaVarName">
                                </div>
                                <div class="col-span-2">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">UMP:</label>
                                    <input type="text" name="name" id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="UMP" v-model="createdStudy.UMPVarName">
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="status"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" name="status" id="status" v-model="createdStudy.status" />
                                </div>
                            </div>
                            <button type="submit"
                                class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Crear estudio
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
        name: "list-studies",
        components: {
            VueGoodTable,
        },
        data() {
            return {
                showStudyUpdateModal: false,
                showStudyCreateModal: false,
                showStudyDeleteAlert: false,
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
                        label: "Id de encuesta",
                        field: "surveyID",
                    },
                    {
                        label: "Código",
                        field: "code",
                    },
                    {
                        label: "Nombre",
                        field: "name",
                    },
                    {
                        label: "Región",
                        field: "RegionVarName",
                    },
                    {
                        label: "Comuna",
                        field: "ComunaVarName",
                    },
                    {
                        label: "UMP",
                        field: "UMPVarName",
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
                editedStudy: {
                    id:"",
                    code: "",
                    name: "",
                    surveyID: "",
                    status: "",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: "",
                    expectedCase: "",
                    startDate: ""
                },
                createdStudy: {
                    code: "",
                    name: "",
                    surveyID: "",
                    status: false,
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: "",
                    expectedCase: "",
                    startDate: ""
                },
                studyDeleted:{
                    id:"",
                    code: "",
                    name: "",
                    surveyID: "",
                    status: "",
                    RegionVarName: "",
                    ComunaVarName: "",
                    UMPVarName: "",
                    expectedCase: "",
                    startDate: ""
                }
            };
        },
        methods: {
            openUpdateStudyModal(item) {
                this.showStudyUpdateModal = true;
                this.editedStudy = { ...item };
                if (item.status === "Activo") {
                    this.editedStudy.status = true;
                } else {
                    this.editedStudy.status = false;
                }
            },
            openCreateStudyModal() {
                this.showStudyCreateModal = true;
            },
            closeUpdateStudyModal() {
                this.showStudyUpdateModal = false;
            },
            closeCreateStudyModal() {
                this.showStudyCreateModal = false;
            },
            closeDeleteStudyalert() {
                this.showStudyDeleteAlert = false;
            },
            openDeleteStudyAlert(item){
                this.studyDeleted={...item}
                this.showStudyDeleteAlert = true;
            },
            getDataStudies() {
                GlobalService.getData("/study/list-studies")
                    .then((response) => {
                        this.rows = response.studies.map((study) => ({
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            createStudy(createdStudy) {
                GlobalService.createData("/study/create-study", createdStudy)
                    .then((response) => {
                        console.log(response)
                        this.toast.success(response.data.msg);
                        this.rows = response.data.studies.map((study) => ({
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                        this.closeCreateStudyModal()
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
            updateStudy(studyId, editedStudy) {
                GlobalService.setData("/study/update-study", studyId, editedStudy)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.studies.map((study) => ({
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                        this.closeUpdateStudyModal()
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
            deleteStudy(studyId) {
                GlobalService.deleteDataById("/study/delete-study", studyId)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.studies.map((study) => ({
                            id: study.id,
                            surveyID: study.surveyID,
                            code: study.code,
                            name: study.name,
                            RegionVarName: study.RegionVarName,
                            ComunaVarName: study.ComunaVarName,
                            UMPVarName: study.UMPVarName,
                            status: study.status ? "Activo" : "Inactivo",
                        }));
                        this.closeDeleteStudyalert()
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
        mounted() {
            this.getDataStudies();
        },
    }
</script>

<style>

</style>