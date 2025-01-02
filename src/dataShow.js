import { fetchIdData, fetchMainData, fetchPeopleData, fetchPeopleIdData } from "./fetchMainData";

export const showCase = () => {
    const url = new URL(window.location.href);
    const consCatgory = url.searchParams.get("cons-category"); 
    const userSearch = url.searchParams.get("user-query");
    const genre = url.searchParams.get("genre");
    const baseType = url.searchParams.get("base-type") || "multi"; 
    const page = url.searchParams.get("page");
    const baseId = url.searchParams.get("id");
    const cont = document.querySelector(".info-cont");    
    const searchInp = document.querySelector(".search-inp");
    const infoCont = document.querySelector(".id-info-cont");
    const apiKey = import.meta.env.VITE_API_KEY;

    document.querySelector(".category-info").classList.add("hidden");
    document.querySelector(".showcase").classList.remove("hidden");

    if(baseId) {
        document.querySelector(".showcase").classList.add("hidden");
        infoCont.classList.remove("hidden");

        const url = `https://api.themoviedb.org/3/${baseType}/${baseId}?api_key=${apiKey}`;
        
        if(baseType === "person") fetchPeopleIdData(url, infoCont, "id-info-temp");
        else fetchIdData(url, baseType, infoCont, "id-info-temp", baseId);
    }

    else if(userSearch) { 
        searchInp.value = userSearch;

        if(baseType === "person") {
            const fetchURL = `https://api.themoviedb.org/3/search/person?query=${userSearch}&api_key=${apiKey}&page=${page}`;

            fetchPeopleData(fetchURL, cont, "common-temp", null, page, true);
        }
        else if(baseType !== "multi") {
            const fetchURL = `https://api.themoviedb.org/3/search/${baseType}?query=${userSearch}&page=${page}&api_key=${apiKey}`;

            fetchMainData(fetchURL, baseType, cont, null, "all-data-temp", page);
        }
        else {
            const fetchURL = [
                `https://api.themoviedb.org/3/search/movie?query=${userSearch}&page=${page}&api_key=${apiKey}`,
                `https://api.themoviedb.org/3/search/tv?query=${userSearch}&page=${page}&api_key=${apiKey}`
            ];

            fetchMainData(fetchURL[0], "movie", cont, null, "all-data-temp", page, true, true);
            fetchMainData(fetchURL[1], "tv", cont, null, "all-data-temp", page, true, true);
        }
    }

    else if(genre) {
        const fetchURL = `https://api.themoviedb.org/3/discover/${baseType}?page=${page}&api_key=${apiKey}&with_genres=${genre}`;

        fetchMainData(fetchURL, baseType, cont, null, "all-data-temp", page);
    }

    else if(consCatgory) {
        if(baseType === "person") {
            const fetchURL = (consCatgory === "trending") ? `https://api.themoviedb.org/3/trending/person/week?api_key=${apiKey}&page=${page}` : `https://api.themoviedb.org/3/person/popular?page=${page}&api_key=${apiKey}`;

            fetchPeopleData(fetchURL, cont, "common-temp", null, page, true);
        }
        else {
            const fetchURL = (consCatgory === "trending") ? `https://api.themoviedb.org/3/${consCatgory}/${baseType}/week?api_key=${apiKey}&page=${page}` : `https://api.themoviedb.org/3/${baseType}/${consCatgory}?api_key=${apiKey}&page=${page}`;

            fetchMainData(fetchURL, baseType, cont, null, "all-data-temp", page);
        }
    }

    else {
        document.querySelector(".category-info").classList.remove("hidden");
        document.querySelector(".showcase").classList.add("hidden");
        return false;
    }

    return true;
}