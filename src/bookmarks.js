import { fetchAllBookmarks } from "./fetchMainData";
import { menuEvents } from "./sidebarEvents";

fetchAllBookmarks();

const searchInp = document.querySelector(".search-inp");
searchInp.addEventListener("input", (e) => {
    const allBookmarks = document.querySelectorAll(".data-temp");
    
    allBookmarks.forEach((el) => {
        const title = el.querySelector(".info-title").innerText.toLowerCase();

        if(!title.includes(e.data.toLowerCase())) el.classList.add("hidden");
        else el.classList.remove("hidden");
    });
});

menuEvents();
