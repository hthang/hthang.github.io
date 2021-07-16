const a = document.querySelectorAll(".footer-select__name");
a.forEach((selected) => {
    const option = selected.previousElementSibling;
    selected.addEventListener("click", function () {
        option.classList.toggle("active--footer");
    })

})
