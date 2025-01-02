export const fetchCategories = (genre) => {
    const categoryCont = document.querySelector(".category-info");
    const apiKey = import.meta.env.VITE_API_KEY;
    
    if(!categoryCont.classList.contains("hidden")) {
        fetch(`https://api.themoviedb.org/3/genre/${genre}/list?api_key=${apiKey}`)
        .then(res => res.json())
        .then((data) => {
            data.genres.forEach((el) => {
                const temp = document.querySelector(`#category-temp`);
                const clone = document.importNode(temp.content, true);

                const card = clone.querySelector(".base-category");
                card.setAttribute("id", el.id);
                card.innerText = el.name;

                categoryCont.append(card);
            });
        });
    }
}