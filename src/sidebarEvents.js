export const menuEvents = () => {
    const home = document.querySelector(".home");
    const mainHome = document.querySelector(".main-home");
    const moviesCategory = document.querySelector(".movie-category");
    const tvCategory = document.querySelector(".tv-category");
    const personCategory = document.querySelector(".person-category");
    const allBookmarks = document.querySelector(".all-bookmarks");

    home.addEventListener("click", () => {
        window.location.href = "/";
    }); 
    
    mainHome.addEventListener("click", () => {
        window.location.href = "/";
    }); 

    moviesCategory.addEventListener("click", () => {
        window.location.href = "/src/movies.html?base-type=movie";
    });

    tvCategory.addEventListener("click", () => {
        window.location.href = "/src/tvSeries.html?base-type=tv";
    });

    personCategory.addEventListener("click", () => {
        window.location.href = "/src/people.html?base-type=person";
    });

    allBookmarks.addEventListener("click", () => {
        window.location.href = "/src/bookmarks.html";
    });
}