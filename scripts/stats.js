const { createApp } = Vue

createApp({
    data() {
        return {
            urlApi: 'https://mindhub-xj03.onrender.com/api/amazing',
            statisticsEvents: [],
            statisticsPastEvents: [],
            statisticsUpcomingEvents: [],
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
                const response = await fetch(this.urlApi)
                const { events, currentDate } = await response.json()

                const pastEvents = events.filter(event => this.setDate(event.date) < this.setDate(currentDate))
                const upcomingEvents = events.filter(event => this.setDate(event.date) > this.setDate(currentDate))

                const categoriesPastEvents = new Set(pastEvents.map(event => event.category))
                const categoriesUpcomingEvents = new Set(upcomingEvents.map(event => event.category))

                const pastEventsGrupedByCategories = this.getEventsGroupedByCategories(pastEvents, categoriesPastEvents)
                const upcomingEventsGrupedByCategories = this.getEventsGroupedByCategories(upcomingEvents, categoriesUpcomingEvents)

                const statisticsEvents = this.getStatisticsEvents(pastEvents)
                const statisticsPastEvents = this.getStatistics(pastEventsGrupedByCategories);
                const statisticsUpcomingEvents = this.getStatistics(upcomingEventsGrupedByCategories);

                this.statisticsEvents = statisticsEvents
                this.statisticsPastEvents = statisticsPastEvents
                this.statisticsUpcomingEvents = statisticsUpcomingEvents

            } catch (error) {
                console.log("An error has occurred: " + error.message)
            }
        },
        darkMode() {
            this.theme = !this.theme
            localStorage.setItem("dark-mode", this.theme)
        },
        handleScroll() {
            if (scrollY >= 60) {
                this.scroll = 'navbar-scrolled'
                this.theme ? this.scroll = 'navbar-scrolled navbar-dark' : this.scroll = 'navbar-scrolled'
            } else {
                this.scroll = 'navbar-dark'
            }
        },
        setDate(date) {
            const reg = /[-]/g
            const dateOk = new Date(date.replace(reg, ','))
            return dateOk.getTime()
        },
        getEventsGroupedByCategories(arrayEvents, arrayCategoriesEvents) {
            let grupedByCategories = [];
            arrayCategoriesEvents.forEach(category => {
                let eventsByCategories = arrayEvents.filter(event => event.category === category);
                grupedByCategories.push(eventsByCategories)
            })
            return grupedByCategories;
        },
        convertToCurrency(value, currency, region = undefined, minDigits = 0) {
            return Intl.NumberFormat(region, { style: "currency", currency: currency, minimumFractionDigits: minDigits }).format(value);
        },
        getStatisticsEvents(events) {
            const newObjEvents = events.map(event => {
                return {
                    name: event.name,
                    id: event._id,
                    percentage: ((event.assistance * 100) / event.capacity).toFixed(2),
                }
            });
            const bigger = newObjEvents.reduce((acc, cur) => { if (acc.percentage < cur.percentage) return cur; else return acc; });
            const minor = newObjEvents.reduce((acc, cur) => { if (acc.percentage > cur.percentage) return cur; else return acc; });
            const greaterCapacity = events.reduce((acc, cur) => { if (acc.capacity < cur.capacity) return cur; else return acc; });
            return {
                bigger: bigger.name,
                minor: minor.name,
                greaterCapacity: greaterCapacity.name
            }
        },
        getStatistics(arrayEvents) {
            let statistics = []
            arrayEvents.forEach(events => {

                const categorie = new Set(events.map(event => event.category))
                const totalPrices = events.map(event => (event.assistance || event.estimate) * event.price).reduce((a, b) => a + b);
                const percentage = events.map(event => ((event.estimate || event.assistance) * 100) / event.capacity).reduce((a, b) => a + b);

                const stats = {
                    categorie: [...categorie].join(''),
                    revenues: this.convertToCurrency(totalPrices, "ARS", "es-AR"),
                    percentage: (percentage / events.length).toFixed(2)
                }
                statistics.push(stats);
            })
            return statistics;
        }

    },
}).mount('#app')