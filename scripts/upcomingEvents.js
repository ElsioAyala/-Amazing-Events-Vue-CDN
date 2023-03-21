const { createApp } = Vue

createApp({
    data(){
        return {
            /*urlApi: "./scripts/amazing.json",*/
            urlApi: 'https://mindhub-xj03.onrender.com/api/amazing',
            events: [],
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
                const {events, currentDate }= await response.json()
                const upcomingEvents = events.filter(event => this.setDate(event.date) > this.setDate(currentDate));
                this.events = upcomingEvents
                this.loading = false
                this.message = 'No results, try modifying the filters'
                this.backupEvents = upcomingEvents
                this.getCategories(upcomingEvents)
            } catch (error) {
                console.log("An error has occurred: " + error.message)
            }
        },
        getCategories(events) {
            this.categories = new Set(this.events.map(event => event.category))
        },
        darkMode(){
            this.theme = !this.theme
            localStorage.setItem("dark-mode", this.theme)
        },
        handleScroll(){
            if (scrollY >= 60) {
                this.scroll = 'navbar-scrolled'
                this.theme ? this.scroll = 'navbar-scrolled navbar-dark': this.scroll = 'navbar-scrolled'
            } else {
                this.scroll = 'navbar-dark'
            }
        },
        setDate(date){
            const reg = /[-]/g
            const dateOk = new Date(date.replace(reg, ','))
            return dateOk.getTime()
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