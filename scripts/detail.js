const { createApp } = Vue

createApp({
    data() {
        return {
            urlApi: 'https://mindhub-xj03.onrender.com/api/amazing',
            event: [],
            message: '',
            foundResults: false,
            theme: localStorage.getItem("dark-mode") === "true",
            scroll: 'navbar-dark'

        }
    },
    created() {
        this.loadEvents()
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll)
    },
    methods: {
        async loadEvents() {
            try {
                if (!window.location.search.includes("?id=")) {
                    location.href = "./"
                } else {
                    const response = await fetch(this.urlApi)
                    const { events, currentDate } = await response.json()
                    const event = this.getEvent(events)
                    this.event = event
                }
            } catch (error) {
                console.log("An error has occurred: " + error.message)
            }
        },
        darkMode() {
            this.theme = !this.theme
            localStorage.setItem("dark-mode", this.theme);
        },
        handleScroll() {
            if (scrollY >= 60) {
                this.scroll = 'navbar-scrolled'
                this.theme ? this.scroll = 'navbar-scrolled navbar-dark' : this.scroll = 'navbar-scrolled'
            } else {
                this.scroll = 'navbar-dark'
            }
        },
        getEvent(events) {
            const queryString = location.search;
            const params = new URLSearchParams(queryString);
            const id = params.get("id");
            const event = events.find((event) => event._id == id);
            console.log("LLego", event)
            if (event !== undefined) {
                return event
            }
            else{
                this.message = "Event not Found"
                return []
            }
            
        },
        setDate(date) {
            const reg = /[-]/g;
            const dateOk = new Date(date.replace(reg, ','));
            return dateOk.getTime();
        },
        back() {
            history.back();
        }
    }
}).mount('#app')

