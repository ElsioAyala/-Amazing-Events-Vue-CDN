const navbar = document.querySelector(".navbar");
const btnToggle = document.getElementById("toggle-dark");


/**
 * NAVBAR
 */
window.addEventListener("scroll", () => {
    if (scrollY >= 60) {
        navbar.classList.add("navbar-scrolled");
        btnToggle.classList.contains('bi-sun') ? navbar.classList.remove("navbar-dark") : navbar.classList.add("navbar-dark");
    } else {
        navbar.classList.remove("navbar-scrolled");
        navbar.classList.add("navbar-dark");
    }
});


/**
 * DARK MODE
 */
btnToggle.addEventListener("click", () => {
    if (btnToggle.classList.contains('bi-sun')) {
        document.body.classList.add("dark-theme");
        btnToggle.setAttribute("class", " bi bi-moon-stars");
        localStorage.setItem("dark-mode", "true");
    } else {
        document.body.classList.remove("dark-theme");
        btnToggle.setAttribute("class", " bi bi-sun");
        localStorage.setItem("dark-mode", "false");
    }
});

if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark-theme");
    btnToggle.setAttribute("class", " bi bi-moon-stars");
}