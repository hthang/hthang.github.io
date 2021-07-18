const selectAll = document.querySelectorAll(".main-select__name");
selectAll.forEach((selected) => {
    const option = selected.previousElementSibling;
    selected.addEventListener("click", function () {
        option.classList.toggle("active");
    })

})
