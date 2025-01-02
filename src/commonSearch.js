import { menuEvents } from "./sidebarEvents";
import { showCase } from "./dataShow";
import { setParams } from "./setURLParams";

const searchBtn = document.querySelector(".search-btn");
const searchInp = document.querySelector(".search-inp");
const category = document.querySelector(".category-info");
const nextPage = document.querySelector(".next-page");
const prevPage = document.querySelector(".prev-page");

searchBtn.addEventListener("click", () => {
    if(searchInp.value) setParams("user-query", searchInp.value, 1);
});

category.addEventListener("click", (e) => {
    if(e.target.classList.contains("base-category")) setParams("genre", e.target.getAttribute("id"), 1);
});

nextPage.addEventListener("click", () => {
    let currPage = +document.querySelector(".curr-page").innerText;
    let totalPages = +document.querySelector(".total-pages").innerText;

    if(++currPage <= totalPages) setParams(null, null, currPage);
});

prevPage.addEventListener("click", () => {
    let currPage = +document.querySelector(".curr-page").innerText;
    let totalPages = +document.querySelector(".total-pages").innerText;

    if(--currPage >= 1) setParams(null, null, currPage);
});

menuEvents();
showCase();