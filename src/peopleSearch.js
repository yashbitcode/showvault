import { menuEvents } from "./sidebarEvents";
import { setParams } from "./setURLParams";
import { showCase } from "./dataShow";
import { fetchPeopleData } from "./fetchMainData";

const searchBtn = document.querySelector(".search-btn");
const searchInp = document.querySelector(".search-inp");
const nextPage = document.querySelector(".next-page");
const prevPage = document.querySelector(".prev-page");
const apiKey = import.meta.env.VITE_API_KEY;

function showFrontInfo() {
    const cont1 = document.querySelector(".popular-people");
    const cont2 = document.querySelector(".trending-people");

    fetchPeopleData(`https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`, cont1, "front-temp", 6);

    fetchPeopleData(`https://api.themoviedb.org/3/trending/person/week?api_key=${apiKey}`, cont2, "front-temp", 6);
}

searchBtn.addEventListener("click", () => {
    if(searchInp.value) setParams("user-query", searchInp.value, 1);
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
if(!showCase()) showFrontInfo();