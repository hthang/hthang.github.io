const productButtonAll = document.querySelectorAll(".product-detail__button");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".form__close").addEventListener("click", function () {
    modal.style.display = "none";
})
productButtonAll.forEach((selected) => {
    selected.addEventListener("click", function () {
        modal.style.display = "block";
    })

})
