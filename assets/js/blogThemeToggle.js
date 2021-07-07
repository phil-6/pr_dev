const btn = document.querySelector("#blog-theme-toggle");
// check to see if local storage has a theme preference
let blogTheme = localStorage.getItem("theme");

function setTheme() {
    //if no local storage check against system preferences
    if (blogTheme === null) {
        if (prefersDarkScheme.matches) {
            blogTheme = "dark"
        } else if (prefersLightScheme.matches) {
            blogTheme = "light"
        } else {
            // if no preferences, default to dark theme
            blogTheme = "dark"
        }
        setTheme()
    } else if (blogTheme === "dark") {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
    } else if (blogTheme === "light") {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
    }
}

btn.addEventListener("click", function () {
    if (blogTheme === "dark") {
        blogTheme = "light"
        setTheme()
    } else {
        blogTheme = "dark";
        setTheme()
    }
    localStorage.setItem("theme", blogTheme);
});

setTheme()