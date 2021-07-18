const filter = document.querySelector(".bottom__filter");
const mainFilter = document.querySelector(".main-filter");
const closeFilter = document.querySelector(".main__close");
const filterDone = document.querySelector(".main__button");
filter.addEventListener("click", function () {
    mainFilter.classList.add("is-expand");
});
closeFilter.addEventListener("click", function () {
    mainFilter.classList.remove("is-expand");
})
filterDone.addEventListener("click", function () {
    mainFilter.classList.remove("is-expand");
})