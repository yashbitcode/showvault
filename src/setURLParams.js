export const setParams = (key, val, pageNum = null) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if(key) {
        params.delete("cons-category");
        params.set(key, val);
    }

    if(pageNum) params.set("page", pageNum);

    if(key === "user-query") {
        params.delete("genre");
        params.delete("id");
    }

    if(key === "id") {
        params.delete("page");
        params.delete("genre");
        params.delete("user-query");
    }

    url.search = params.toString();
    window.location.href = url.toString();
}