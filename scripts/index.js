const { createApp } = Vue

createApp({
    data(){
        return {
            /*urlApi: "./scripts/amazing.json",*/
            urlApi: 'https://mindhub-xj03.onrender.com/api/amazing',
            events: ['hola'],
            categories: [],
            backupEvents: [],
            checkedCategories : [],
            searchText: '',
            message: '',
            loading: true,
            foundResults: false,
            theme: localStorage.getItem("dark-mode") === "true",
            scroll: 'navbar-dark'
        }
    },
    created(){
        this.loadEvents()
    },
    mounted(){
        window.addEventListener("scroll", this.handleScroll)
    
    },
    methods:{
        async loadEvents () {
            try {
                const response = await fetch(this.urlApi)
                const {events}= await response.json()
                this.events = events
                this.loading = false
                this.message = 'No results, try modifying the filters'
                this.backupEvents = events
                this.getCategories(events)
            } catch (error) {
                console.log("An error has occurred: " + error.message)
            }
        },
        getCategories(events) {
            this.categories = new Set(this.events.map(event => event.category))
        },
        darkMode(){
            this.theme = !this.theme
            localStorage.setItem("dark-mode", this.theme);
        },
        handleScroll(){
            if (scrollY >= 60) {
                this.scroll = 'navbar-scrolled'
                this.theme ? this.scroll = 'navbar-scrolled navbar-dark': this.scroll = 'navbar-scrolled'
            } else {
                this.scroll = 'navbar-dark'
            }
        }
    },
    computed:{
        filters () {
            let searchFilter = this.backupEvents.filter(event => event.name.toLowerCase().includes(this.searchText.toLowerCase()))
            if (this.checkedCategories.length > 0) {
                this.events = searchFilter.filter(event => this.checkedCategories.includes(event.category))
            }else {
                this.events = searchFilter
            }
            this.events.length === 0 ? this.foundResults = true : this.foundResults = false
        },
    },
}).mount('#app')