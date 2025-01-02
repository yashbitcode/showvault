import { showCase } from "./dataShow";
import { fetchMainData } from "./fetchMainData";
import { setParams } from "./setURLParams";
import { menuEvents } from "./sidebarEvents";

const apiKey = import.meta.env.VITE_API_KEY;

const allTrendings = document.querySelectorAll(".trending-info");
const allBase = document.querySelectorAll(".front-info");
const mainBaseInfo = document.querySelector(".category-info");
const showcase = document.querySelector(".showcase");
const searchBtn = document.querySelector(".search-btn");
const searchInp = document.querySelector(".search-inp");
const nextPage = document.querySelector(".next-page");
const prevPage = document.querySelector(".prev-page");

const allTrendsInfo = {
    movie: ["trending"],
    tv: ["trending"]
};

const commonInfo = {
    movie: ["popular", "now_playing", "upcoming", "top_rated"],
    tv: ["popular", "airing_today", "on_the_air", "top_rated"]
};

function showFrontInfo() {
    let cnt1 = 0;
    for(let key in allTrendsInfo) {
        allTrendsInfo[key].forEach((el) => {
            const url = `https://api.themoviedb.org/3/${el}/${key}/week?api_key=${apiKey}`;
            fetchMainData(url, key, allTrendings[cnt1++], 4, "trending-temp", null, false);
        });
    }

    let cnt2 = 0;
    for(let key in commonInfo) {
        commonInfo[key].forEach((el) => {
            const url = `https://api.themoviedb.org/3/${key}/${el}?api_key=${apiKey}`;
            fetchMainData(url, key, allBase[cnt2++], 6, "common-temp", null, false);
        });
    }
}

searchBtn.addEventListener("click", () => {
    if(searchInp.value) {
        mainBaseInfo.classList.add("hidden");
        showcase.classList.remove("hidden");

        setParams("user-query", searchInp.value, 1);
    }
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
