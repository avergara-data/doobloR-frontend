<template>
    <div class="text-gray-800 font-inter">
      <Sidebar />
      <main class="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-50 min-h-screen transition-all main">
        <Navbar @logout="logout()" :username="getUsername" />
        <div class="p-6">
          <router-view></router-view>
        </div>
      </main>
      <div class="sidebar-overlay hidden"></div>
    </div>
  </template>
  
  <script>
  import Sidebar from "../../components/Sidebar.vue";
  import Navbar from "../../components/Navbar.vue";
  import { createPopper } from '@popperjs/core';
  import { mapActions, mapGetters } from "vuex";
  export default {
    components: { Sidebar, Navbar },
    data() {
      return {
        popperInstance: {}
      };
    },
    mounted() {
      this.initSidebar();
      this.initDropdowns();
      this.initTabs();
    },
    methods: {
      ...mapActions(["logoutUser"]),
      logout() {
          this.logoutUser().then(response => {
            this.$router.push('/login');
          })
      },
      initSidebar() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const main = document.querySelector('.main');
  
        if (window.innerWidth < 768) {
          main.classList.toggle('active');
          sidebarOverlay.classList.toggle('hidden');
          sidebarMenu.classList.toggle('-translate-x-full');
        }
  
        sidebarToggle.addEventListener('click', (e) => {
          e.preventDefault();
          main.classList.toggle('active');
          sidebarOverlay.classList.toggle('hidden');
          sidebarMenu.classList.toggle('-translate-x-full');
        });
  
        sidebarOverlay.addEventListener('click', (e) => {
          e.preventDefault();
          main.classList.add('active');
          sidebarOverlay.classList.add('hidden');
          sidebarMenu.classList.add('-translate-x-full');
        });
  
        document.querySelectorAll('.sidebar-dropdown-toggle').forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = item.closest('.group');
            if (parent.classList.contains('selected')) {
              parent.classList.remove('selected');
            } else {
              document.querySelectorAll('.sidebar-dropdown-toggle').forEach((i) => {
                i.closest('.group').classList.remove('selected');
              });
              parent.classList.add('selected');
            }
          });
        });
      },
      initDropdowns() {
        const popperInstance = this.popperInstance;
        document.querySelectorAll('.dropdown').forEach((item, index) => {
          const popperId = 'popper-' + index;
          const toggle = item.querySelector('.dropdown-toggle');
          const menu = item.querySelector('.dropdown-menu');
          menu.dataset.popperId = popperId;
          popperInstance[popperId] = createPopper(toggle, menu, {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
              {
                name: 'preventOverflow',
                options: {
                  padding: 24,
                },
              },
            ],
            placement: 'bottom-end'
          });
        });
  
        document.addEventListener('click', (e) => {
          const toggle = e.target.closest('.dropdown-toggle');
          const menu = e.target.closest('.dropdown-menu');
          if (toggle) {
            const menuEl = toggle.closest('.dropdown').querySelector('.dropdown-menu');
            const popperId = menuEl.dataset.popperId;
            if (menuEl.classList.contains('hidden')) {
              this.hideDropdown();
              menuEl.classList.remove('hidden');
              this.showPopper(popperId);
            } else {
              menuEl.classList.add('hidden');
              this.hidePopper(popperId);
            }
          } else if (!menu) {
            this.hideDropdown();
          }
        });
      },
      hideDropdown() {
        document.querySelectorAll('.dropdown-menu').forEach((item) => {
          item.classList.add('hidden');
        });
      },
      showPopper(popperId) {
        const instance = this.popperInstance[popperId];
        instance.setOptions((options) => ({
          ...options,
          modifiers: [
            ...options.modifiers,
            { name: 'eventListeners', enabled: true },
          ],
        }));
        instance.update();
      },
      hidePopper(popperId) {
        const instance = this.popperInstance[popperId];
        instance.setOptions((options) => ({
          ...options,
          modifiers: [
            ...options.modifiers,
            { name: 'eventListeners', enabled: false },
          ],
        }));
      },
      initTabs() {
        document.querySelectorAll('[data-tab]').forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            const page = item.dataset.tabPage;
            const target = document.querySelector(`[data-tab-for="${tab}"][data-page="${page}"]`);
            document.querySelectorAll(`[data-tab="${tab}"]`).forEach((i) => {
              i.classList.remove('active');
            });
            document.querySelectorAll(`[data-tab-for="${tab}"]`).forEach((i) => {
              i.classList.add('hidden');
            });
            item.classList.add('active');
            target.classList.remove('hidden');
          });
        });
      },
      generateNDays(n) {
        const data = [];
        for (let i = 0; i < n; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          data.push(date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric'
          }));
        }
        return data;
      },
      generateRandomData(n) {
        const data = [];
        for (let i = 0; i < n; i++) {
          data.push(Math.round(Math.random() * 10));
        }
        return data;
      }
    },
      computed: {
          ...mapGetters(["getUsername","getRolName"]),
    }
  }
  </script>
  
  <style scoped>
  /* Aquí puedes agregar estilos personalizados si es necesario */
  </style>
  