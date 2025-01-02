let totalResults = 0;
let pages = 0;

const bookmarksObj = JSON.parse(localStorage.getItem("bookmarks")) || {};
const apiKey = import.meta.env.VITE_API_KEY;

function changeBookmarkClasses(bm) {
    bm[0].classList.toggle("fa-bookmark");
    bm[1].classList.toggle("fa-bookmark");
}

function toggleBookmark(card, cardType, cardYr, cardTitle, cardImgSrc) {
    const bm = card.querySelectorAll(".my-bookmark i");
    const cardId = card.getAttribute("id");

    if(bm[0].classList.contains("fa-bookmark")) {
        bookmarksObj[cardId] = {
            type: cardType,
            yr: cardYr,
            title: cardTitle,
            img: cardImgSrc
        };
    }
    else delete bookmarksObj[cardId];

    localStorage.setItem("bookmarks", JSON.stringify(bookmarksObj));

    changeBookmarkClasses(bm);
}

function trucateTitle(title) {
    if(title.length >= 25) return title.substring(0, 25) + "...";
    return title;
}

function getFullLanguage(abb) {
    const languageNames = new Intl.DisplayNames(['en'], {
        type: 'language'
    });

    return languageNames.of(abb);
}

async function getAllCasts(cont, card, url) {
    const allCast = card.querySelector(".all-cast");
    const response = await fetch(url);
    const casts = await response.json();

    casts.cast.forEach((el) => {
        allCast.innerHTML += `<a href="/src/people.html?base-type=person&id=${el.id}" class="border-[1.5px] px-[7px] py-[1px] font-light rounded-[7px]">${el.name}</a>`;
    });

    cont.append(card);
}

async function getAllTitles(cont, card, url) {
    const allTitles = card.querySelector(".all-titles");
    const response = await fetch(url);
    const data = await response.json();

    data.person_results[0].known_for.forEach((el) => {
        allTitles.innerHTML += `<a href="/src/${(el.media_type === "movie") ? "movies.html" : "tvSeries.html"}?base-type=${el.media_type}&id=${el.id}" class="text-[#10141e] px-[7px] py-[1px] rounded-[7px] bg-white">${el.original_title || el.title || el.original_name || el.name}</a>`;
    });

    cont.append(card);
}

async function getAllTrailers(trailerCont, url) {
    const response = await fetch(url);
    const data = await response.json();

    let cnt = 1;

    if(data.results.length === 0) trailerCont.parentElement.classList.add("hidden");
    else {
        data.results.forEach((el) => {
            if(el.site.toLowerCase() === "youtube" && cnt <= 5) {
                trailerCont.innerHTML += `<a href="https://www.youtube.com/watch?v=${el.key}" class="text-[#10141e] px-[7px] py-[1px] rounded-[7px] bg-white">Track ${cnt++}</a>`;
            }
        });
    }
}

export const fetchMainData = (url, type, baseCont, nums, templateId, pageNum, canShow = true, isMulti = false) => {
    fetch(url)
    .then(res => res.json())
    .then((data) => {
        if(!isMulti) {
            totalResults = data.total_results;
            pages = data.total_pages;
        }
        else {
            totalResults += data.total_results;
            pages += data.total_pages;
        }

        if((canShow && !isMulti) || (canShow && isMulti && type === "tv")) {
            const resultTag = document.querySelector(".results-tag");
            const currPage = document.querySelector(".curr-page");
            const totalPages = document.querySelector(".total-pages");

            resultTag.innerText = `Found ${totalResults.toLocaleString("en-IN")} Results`;
            currPage.innerText = pageNum;
            totalPages.innerText = (data.results.length === 0) ? 1 : pages;
        }

        for(let i = 0; i < (nums || data.results.length); i++) {
            const temp = document.querySelector(`#${templateId}`);
            const card = document.importNode(temp.content, true).querySelector(".data-temp");
            
            card.setAttribute("id", data.results[i].id);
            
            const cardImg = card.querySelector(".info-img");
            const cardYr = card.querySelector(".info-yr");
            const cardName = card.querySelector(".info-name");
            const cardTitle = card.querySelector(".info-title");
            const icon = card.querySelector(".base-icon");

            let iconClass;
            let typeTemp = type;

            if(type === "movie") iconClass = "fa-film";
            else if(type === "tv") iconClass = "fa-tv";
            else {
                iconClass = `fa-${(data.results[i].media_type === "movie") ? "film" : "tv"}`;
                typeTemp = data.results[i].media_type;
            }

            icon.classList.add(iconClass);

            if(data.results[i].backdrop_path) {
                cardImg.src = `https://image.tmdb.org/t/p/original/${data.results[i].backdrop_path }`;
            }
            else {
                cardImg.src = "https://www.legrand.com.kh/modules/custom/legrand_ecat/assets/img/no-image.png";
            }
            
            cardYr.innerText = (data.results[i].release_date || data.results[i].first_air_date || "N/A").split("-")[0];
            cardName.innerText = (typeTemp === "movie") ? "Movie" : "TV Series";
            cardTitle.innerText = trucateTitle(data.results[i].title || data.results[i].name);
            
            if(bookmarksObj[data.results[i].id]) changeBookmarkClasses(card.querySelectorAll(".my-bookmark i"));
            baseCont.append(card);
            
            card.addEventListener("click", (e) => {
                const flag = e.target.classList.contains("my-bookmark") || e.target.parentElement.classList.contains("my-bookmark");

                if(!flag) {
                    e.preventDefault();

                    const url = new URL(window.location.href);
                    url.pathname = `/src/${(type === "movie") ? "movies.html" : "tvSeries.html"}`;
                    url.search = `?base-type=${type}&id=${card.getAttribute("id")}`;

                    window.location.href = url.href;
                }
                else toggleBookmark(card, type, cardYr.innerText, cardTitle.innerText, cardImg.src);
            });
        }
    });
}

export const fetchPeopleData = (url, baseCont, templateId, num = null, pageNum = null, canShow = false) => {
    fetch(url)
    .then(res => res.json())
    .then((data) => {
        if(canShow) {
            const resultsTag = document.querySelector(".results-tag");
            const currPage = document.querySelector(".curr-page");
            const totalPages = document.querySelector(".total-pages");

            resultsTag.innerText = `Found ${data.total_results.toLocaleString("en-IN")} Results`;
            currPage.innerText = pageNum;
            totalPages.innerText = data.total_pages;
        }

        for(let i = 0; i < (num || data.results.length); i++) {
            const temp = document.querySelector(`#${templateId}`);
            const card = document.importNode(temp.content, true).querySelector(".data-temp");
            const cardImg = card.querySelector(".info-img");
            const cardName = card.querySelector(".info-title");

            if(data.results[i].profile_path) cardImg.src = `https://image.tmdb.org/t/p/original${data.results[i].profile_path}`;
            else cardImg.src = "https://www.legrand.com.kh/modules/custom/legrand_ecat/assets/img/no-image.png";

            cardName.innerText = data.results[i].name;

            card.setAttribute("id", data.results[i].id);
            
            if(bookmarksObj[data.results[i].id]) changeBookmarkClasses(card.querySelectorAll(".my-bookmark i"));
            baseCont.append(card);

            baseCont.append(card);

            card.addEventListener("click", (e) => {
                const flag = e.target.classList.contains("my-bookmark") || e.target.parentElement.classList.contains("my-bookmark");

                if(!flag) {
                    e.preventDefault();
    
                    const url = new URL(window.location.href);
                    url.pathname = "/src/people.html";
                    url.search = `?base-type=person&id=${card.getAttribute("id")}`;
        
                    window.location.href = url.href;
                }
                else toggleBookmark(card, "person", null, cardName.innerText, cardImg.src);
            });
        }
    });
}

export const fetchIdData = (url, type, baseCont, templateId, baseId) => {
    fetch(url)
    .then(res => res.json())
    .then((data) => {
        const temp = document.querySelector(`#${templateId}`);
        const card = document.importNode(temp.content, true).querySelector(".id-info");

        const posterImg = card.querySelector(".poster");
        const baseTitle = card.querySelector(".base-title");
        const tagLine = card.querySelector(".tag-line"); 
        const mainRating = card.querySelector(".main-rating"); 
        const length = card.querySelector(".length"); 
        const language = card.querySelector(".language"); 
        const status = card.querySelector(".status"); 
        const yr = card.querySelector(".year"); 
        const allGenres = card.querySelector(".all-genres"); 
        const allComp = card.querySelector(".all-comp"); 
        const synInfo = card.querySelector(".syn-info");  
        const dataLink = card.querySelector(".data-link");  
        const popularity = card.querySelector(".popularity");  
        const firstAir = card.querySelector(".first-air");  
        const lastAir = card.querySelector(".last-air");    
        const trailerCont = card.querySelector(".all-trailers");  

        const starRated = card.querySelectorAll(".star-rated");
        
        let ratings = (data.vote_average / 2) * 100;

        if(data.poster_path) posterImg.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
        else posterImg.src = "https://www.legrand.com.kh/modules/custom/legrand_ecat/assets/img/no-image.png";

        if(length) length.innerText = `${data.runtime || 0} min`;
        baseTitle.innerText = data.original_title || data.original_name;
        tagLine.innerText = data.tagline;
        language.innerText = getFullLanguage(data.original_language);
        status.innerText = (data.status.toLowerCase() === "released") ? "N/A" : data.status;
        synInfo.innerText = data.overview;
        mainRating.innerText = (ratings / 100).toFixed(1);
        popularity.innerText = data.popularity;
        dataLink.href = data.homepage;

        if(type === "movie") yr.innerText = data.release_date.split("-")[0];
        else {
            firstAir.innerText = data.first_air_date;
            lastAir.innerText = data.last_air_date;
        }

        starRated.forEach((el) => {
            if(ratings >= 100) el.classList.add("w-full");
            else if(ratings > 0) el.style.width = `${ratings}%`;
            else el.classList.add("w-[0px]");

            ratings -= 100;
        });

        data.production_companies.forEach((el) => {
            allComp.innerHTML += `<div class="border-[1.5px] px-[7px] py-[1px] font-light rounded-[7px]">${el.name}</div>`;
        });

        data.genres.forEach((el) => {
            allGenres.innerHTML += `<div class="text-[#10141e] px-[7px] py-[1px] cursor-pointer rounded-[7px] bg-white">${el.name}</div>`;
        });

        const allIdGenres = card.querySelectorAll(".all-genres div");
        
        allIdGenres.forEach((el, idx) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();

                const url = new URL(window.location.href);
                url.pathname = `/src/${(type === "movie") ? "movies.html" : "tvSeries.html"}`;
                url.search = `?base-type=${type}&genre=${data.genres[idx].id}&page=1`;

                window.location.href = url.href;
            });
        }); 

        getAllTrailers(trailerCont, `https://api.themoviedb.org/3/${type}/${baseId}/videos?api_key=${apiKey}`);

        getAllCasts(baseCont, card, `https://api.themoviedb.org/3/${type}/${baseId}/credits?api_key=${apiKey}`);
    });
}

export const fetchPeopleIdData = (url, baseCont, templateId) => {
    fetch(url)
    .then(res => res.json())
    .then((data) => {
        const temp = document.querySelector(`#${templateId}`);
        const card = document.importNode(temp.content, true).querySelector(".id-info");

        const charName = card.querySelector(".base-title");
        const posterImg = card.querySelector(".poster");
        const gender = card.querySelector(".gender");
        const birthplace = card.querySelector(".birthplace");
        const deathday = card.querySelector(".deathday");
        const birthday = card.querySelector(".birthday");
        const popularity = card.querySelector(".popularity");
        const bio = card.querySelector(".bio");
        const dataLink = card.querySelector(".data-link");
        const allDepartments = card.querySelector(".all-departments");

        charName.innerText = data.name;
        popularity.innerText = data.popularity;
        bio.innerText = data.biography;
        
        if(data.profile_path) posterImg.src = `https://image.tmdb.org/t/p/original/${data.profile_path}?api_key=${apiKey}`;
        else posterImg.src = "https://www.legrand.com.kh/modules/custom/legrand_ecat/assets/img/no-image.png";

        if(data.place_of_birth) birthplace.innerText = data.place_of_birth;
        if(data.birthday) birthday.innerText = data.birthday;
        if(data.deathday) deathday.innerText = data.deathday;

        if(data.gender === 1) gender.innerText = "Female";
        else if(data.gender === 2) gender.innerText = "Male";
        else gender.innerText = "Not Specified";

        if(data.homepage) {
            dataLink.href = data.homepage;
            dataLink.parentElement.classList.remove("hidden");
        }  

        if(data.known_for_department) allDepartments.innerHTML += `<div class="border-[1.5px] px-[7px] py-[1px] font-light rounded-[7px]">${data.known_for_department}</div>`;

        if(data.imdb_id) getAllTitles(baseCont, card, `https://api.themoviedb.org/3/find/${data.imdb_id}?external_source=imdb_id&api_key=${apiKey}`);
        else baseCont.append(card);
    });
}

export const fetchAllBookmarks = () => {
    const cont1 = document.querySelector(".bookmarks-cont1");
    const cont2 = document.querySelector(".bookmarks-cont2");

    Object.keys(bookmarksObj).forEach((el) => {
        const baseType = bookmarksObj[el];

        const temp = document.querySelector(`#common-temp`);
        const card = document.importNode(temp.content, true).querySelector(".data-temp");

        const cardImg = card.querySelector(".info-img");
        const cardYr = card.querySelector(".info-yr");
        const iconType = card.querySelector(".icon-type");
        const cardName = card.querySelector(".info-name");
        const dot = card.querySelector(".dot-svg");
        const title = card.querySelector(".info-title");

        card.setAttribute("id", el);

        cardImg.src = bookmarksObj[el].img;
        title.innerText = bookmarksObj[el].title;

        if(bookmarksObj[el].type === "person") {
            iconType.classList.add("fa-person", "fa-xl");
            cardName.innerText = "Person";
            dot.classList.add("hidden");

            cont2.append(card);
        }
        else {
            let icon = (bookmarksObj[el].type === "movie") ? "Movie" : "TV Series";

            iconType.classList.add(`fa-${(bookmarksObj[el].type === "movie") ? "film" : "tv"}`);
            cardYr.innerText = bookmarksObj[el].yr;
            cardName.innerText = icon;

            cont1.append(card);
        }
    
        card.addEventListener("click", (e) => {
            const flag = e.target.classList.contains("my-bookmark") || e.target.parentElement.classList.contains("my-bookmark");

            if(!flag) {
                e.preventDefault();

                const url = new URL(window.location.href);
                let filePath;

                const baseType = bookmarksObj[el].type;

                if(baseType === "movie") filePath = "movies.html";
                else if(baseType === "tv") filePath = "tvSeries.html";
                else filePath = "people.html";

                url.pathname = `/src/${filePath}`;
                url.search = `?base-type=${baseType}&id=${card.getAttribute("id")}`;
    
                window.location.href = url.href;
            }
            else {
                delete bookmarksObj[card.getAttribute("id")];
                localStorage.setItem("bookmarks", JSON.stringify(bookmarksObj));
                card.remove();
            }
        });

    });
}