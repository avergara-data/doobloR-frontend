<template>
    <div class="grid grid-cols-1 gap-6 mb-6" v-if="activado==false">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex items-center" >
                <select id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                    v-model="selectedStudy" @change="getSurveyId(this.selectedStudy)">
                    <option value="" disabled selected>
                        Selecciona un estudio
                    </option>
                    <option v-for="study in studies" :key="study.id" :value="study">
                        {{ study.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-6 mb-6" v-if="loading">
        <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <template v-if="loading">
                <div class="text-center">
                    <div role="status">
                        <svg aria-hidden="true"
                            class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-violet-700"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                        <p>Cargando {{ progreso }}%...</p>
                    </div>
                </div>
            </template>            
        </div>
    </div>

    <div class="border-b border-gray-200" v-if="activado==true">
        <nav class="flex justify-around">
            <button 
                v-for="(tab, index) in tabs" 
                :key="index" 
                @click="selectedTab = tab" 
                :class="['py-4 px-6 font-bold focus:outline-none', { 'text-violet-500 border-b-2 border-violet-500': selectedTab === tab, 'text-gray-600 hover:text-violet-500': selectedTab !== tab }]"
            > {{ tab }}
            </button>
        </nav>
    </div>
    <div class="p-6" v-if="activado==true">
        <div v-if="selectedTab === 'Resumen General'">
            <div class="flex flex-wrap -mx-4">
                    <div class="w-full md:w-1/3 px-4 mb-4">
                        <div class="bg-white shadow-md rounded-lg p-6">
                            <h3 class="text-lg font-semibold">Total de encuestas</h3>
                            <p>{{ surveyID.length }}</p>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3 px-4 mb-4">
                        <div class="bg-white shadow-md rounded-lg p-6">
                            <h3 class="text-lg font-semibold">Encuestas Correctas</h3>
                            <p>{{ correctSurveyID.length }}</p>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3 px-4 mb-4">
                        <div class="bg-white shadow-md rounded-lg p-6">
                            <h3 class="text-lg font-semibold">Encuestas Incorrectas</h3>
                            <p>{{ expiredcanceledSurveyID.length }}</p>
                        </div>
                    </div>
                </div>
        </div>
        <div v-if="selectedTab === 'Resumen por Región'">
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm border text-left rtl:text-right">
                    <thead class="text-white uppercase bg-violet-700">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Número de la región
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Nombre de la región
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Casos a lograr
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Estado de avance
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Faltantes
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Realizadas el día de hoy
                            </th>
                            <th scope="col" class="px-6 py-3">
                                % de avance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="regionInfo in regionCounts" :key="regionInfo.number"
                            class="bg-white border-b">
                            <td class="px-6 py-3">
                                {{ regionInfo.number }}
                            </td>
                            <td class="px-6 py-3">
                                {{regionInfo.name}}
                            </td>
                            <td class="px-6 py-3">
                                {{ regionInfo.total_reg }}
                            </td>
                            <td class="px-6 py-3">
                                {{regionInfo.total || 0}}
                            </td>
                            <td class="px-6 py-3">
                                {{regionInfo.total_reg - regionInfo.total}}
                            </td>
                            <td class="px-6 py-3">
                                {{regionInfo.today}}
                            </td>
                            <td class="px-6 py-3">
                                <div class="relative h-4 bg-neutral-400 rounded-full">
                                    <div class="absolute inset-y-0 left-0 flex items-center rounded-full"
                                        :class="{
                                            'bg-green-500': regionInfo.total / regionInfo.total_reg >= 1,
                                            'bg-orange-500': regionInfo.total / regionInfo.total_reg >= 0.5 && regionInfo.total / regionInfo.total_reg < 1,
                                            'bg-red-500': regionInfo.total / regionInfo.total_reg < 0.5
                                        }"
                                        :style="regionInfo.total_reg !== 0 ? { width: `${Math.min((regionInfo.total / regionInfo.total_reg) * 100, 100)}%` } : {}"
                                        >
                                        <span class="text-xs text-white px-2">
                                            {{ Math.round((regionInfo.total / regionInfo.total_reg) * 100) }}%
                                        </span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="selectedTab === 'Diferencias GPS'">
            <!-- <h2 class="text-xl font-semibold">Diferencias GPS</h2>
            <p>Contenido de Diferencias GPS.</p> -->
            <!-- <p>{{ formattedData }}</p> -->
            <table>
                <thead>
                    <tr>
                        <th>Lat Base</th>
                        <th>Lon Base</th>
                        <th>Lat 1</th>
                        <th>Lon 1</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in gpsDatos" :key="index">
                        <td>{{ data.lat_base }}</td>
                        <td>{{ data.lon_base }}</td>
                        <td>{{ data.lat_1 }}</td>
                        <td>{{ data.lon_1 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="selectedTab === 'Flags'">
            <h2 class="text-xl font-semibold">Flags</h2>
            <p>Contenido de Flags.</p>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import axios from 'axios';
    export default {
        name: "reports",
        data() {
            return {
                selectedStudy: "",
                studies: [],
                dooblouser: {
                    auth: {
                        username: "c1982d08-43d1-4956-aff8-59c1a8db840c/j.reyes",
                        password: "j.reyes"
                    }
                },
                activado: false,
                loading: false,
                surveyID: [],
                expiredcanceledSurveyID: [],
                correctSurveyID: [],
                formattedData: [],
                regionCounts: {},
                tabs: ['Resumen General', 'Resumen por Región', 'Diferencias GPS','Flags'],
                selectedTab: 'Resumen General',
                RegionVarName: "",
                progreso: 0,
                gpsDatos: [],

            }
        },
        methods: {
            getDataStudies() {
                GlobalService.getData("/study/list-studies")
                    .then((response) => {
                        this.studies = response.studies
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            async getSurveyId(study) {
                try {
                    this.loading = true;
                    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    //Carga nombre region
                    this.RegionVarName = study.RegionVarName;
                    //Total
                    const response = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=FalsedateType=Upload`, this.dooblouser)
                    this.surveyID = response.data
                    await sleep(500);
                    //Expiradas y canceladas
                    const responseB = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=False&statuses=2,3,4,7,8,9,10,12,13`, this.dooblouser);
                    this.expiredcanceledSurveyID = responseB.data
                    await sleep(500);
                    //correctas
                    const responsec = await axios.get(`http://api.dooblo.net/newapi/SurveyInterviewIDs?surveyIDs=${study.surveyID}&testMode=False&completed=True&filtered=False&statuses=1,5,6,11`, this.dooblouser);
                    this.correctSurveyID = responsec.data
                    await sleep(500);
                    //
                    await this.getDataSurvey(study, this.surveyID)
                    this.loading = false;
                    
                    this.activado = true;
                } catch (error) {
                    console.error("Error", error);
                }
            },
            async getDataSurvey(study, surveyID) {
                let group = [];
                for (let i = 0; i < surveyID.length; i += 99) {
                    group.push(surveyID.slice(i, i + 99));
                }
                let formattedGroups = group.map(grupo => grupo.join(','));
                let totalGroups = formattedGroups.length;
                try {
                    let respuestas = []
                    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    for (let i = 0; i < formattedGroups.length; i++) {
                        const response = await axios.get(`http://api.dooblo.net/newapi/SimpleExport?surveyID=${study.surveyID}&subjectIDs=${formattedGroups[i]}`, this.dooblouser);
                        respuestas.push(response.data); // Aquí puedes ajustar según lo que necesites
                        await sleep(500);

                        // Calcular y mostrar el progreso
                        let progress = ((i + 1) / totalGroups) * 100;
                        this.progreso = progress.toFixed(1);
                    }
                    this.formattedData = [...respuestas.flat()]
                    this.countSurveysByRegion();
                    
                } catch (error) {
                    console.error('Error al obtener los registros:', error);
                }
            },
            countSurveysByRegion() {
                const regionCounter = {};
                const today = new Date().toISOString().split('T')[0];
                // Inicializar todas las regiones del 1 al 16 con 0
                for (let i = 1; i <= 16; i++) {
                    regionCounter[i] = {
                        number: i,
                        name: this.regionName(i),
                        total: 0,
                        total_reg:this.selectedStudy[`reg${i}ExpectedCase`],
                        today: 0
                    }
                }
                this.formattedData.forEach(survey => {
                    survey.Subjects.forEach(subject => {
                        //const regionColumn = subject.Columns.find(column => column.Var === 'region');
                        const regionColumn = subject.Columns.find(column => column.Var === this.RegionVarName);
                        const dateColumn = subject.Columns.find(column => column.Var === 'Date');
                        if (regionColumn) {
                            const regionValue = regionColumn.Value;
                            regionCounter[regionValue].total++;
                            if (dateColumn) {
                                const surveyDate = new Date(dateColumn.Value).toISOString().split('T')[0];
                                if (surveyDate === today) {
                                    regionCounter[regionValue].today++;
                                }
                            }
                        }
                    });
                });

                this.regionCounts = regionCounter;

                this.gpsCalc();
            },
            regionName(region) {
                const regionNames = {
                    1: 'Tarapacá',
                    2: 'Antofagasta',
                    3: 'Atacama',
                    4: 'Coquimbo',
                    5: 'Valparaíso',
                    6: 'O higgins',
                    7: 'Maule',
                    8: 'Biobío',
                    9: 'Araucanía',
                    10: 'Los lagos',
                    11: 'Aysén',
                    12: 'Magallanes',
                    13: 'Metropolitana',
                    14: 'Los ríos',
                    15: 'Arica y parinacota',
                    16: 'Ñuble',
                };
                return regionNames[region];
            },
            gpsCalc() {
                this.gpsDatos = [];
                this.formattedData.forEach(survey => {
                    survey.Subjects.forEach(subject => {
                        const lat_base = subject.Columns.find(column => column.Var === 'latitud_base')?.Value || '-';
                        const lon_base = subject.Columns.find(column => column.Var === 'longitud_base')?.Value || '-';
                        const lat_1 = subject.Columns.find(column => column.Var === 'gps_LA')?.Value || '-';
                        const lon_1 = subject.Columns.find(column => column.Var === 'gps_LO')?.Value || '-';

                        this.gpsDatos.push({
                            lat_base,
                            lon_base,
                            lat_1,
                            lon_1
                        });
                    });
                });
            },
        },
        mounted() {
            this.getDataStudies()
        }
    }
</script>

<style>
</style>