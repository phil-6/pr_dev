function collapseElement(input) {
    console.log(input)
    const section = document.querySelector(input);
    section.classList.toggle("reveal")
}