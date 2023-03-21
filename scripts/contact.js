const { createApp } = Vue

createApp({
    data(){
        return {
            theme: localStorage.getItem("dark-mode") === "true",
            scroll: 'navbar-dark'
        }
    },
    mounted(){
        window.addEventListener("scroll", this.handleScroll)
    },
    methods:{
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
        }
    }
}).mount('#app')