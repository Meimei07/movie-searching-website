const flexContainer = document.querySelector(".flex-container");
const inputEl = document.querySelector("#title");
const typeEl = document.querySelector("#type");
const searchBtn = document.querySelector(".search-btn");
const filmDetailContainer = document.querySelector(".film-detail-container");
const paginationEl = document.querySelector(".pagination");

let queryFilms;
let activePage = 1;
let keyword;
let type;

async function searchMovie(title, type) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/${type}?api_key=df55b385123085d8a116ec0875e5d913&query=${title}`
  );

  const data = await response.json();

  queryFilms = data.results;

  let films = ``;
  const filmsArr = renderThumbnail(queryFilms, type);

  // no result
  if (filmsArr.length === 0) {
    flexContainer.innerHTML = "";
    filmDetailContainer.innerHTML = "";
    paginationEl.innerHTML = "";

    document.querySelector(".no-result span").innerHTML = title;
    document.querySelector(".no-result").style.display = "block";
    return;
  }
  document.querySelector(".no-result").style.display = "none";

  films = filmsArr[activePage - 1];
  flexContainer.innerHTML = films.join("");

  // add pagination
  renderPagination(filmsArr.length);

  // click on pagination
  paginationOnClick(activePage, filmsArr, films, type);

  document.querySelector("nav").style.display = "block";

  detailBtnOnClick(type);
}

searchBtn.addEventListener("click", () => {
  keyword = inputEl.value;
  type = typeEl.options[typeEl.selectedIndex].value;

  searchMovie(keyword, type);
});
