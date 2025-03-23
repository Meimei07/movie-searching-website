const flexContainer = document.querySelector(".flex-container");
const inputEl = document.querySelector("#title");
const typeEl = document.querySelector("#type");
const searchBtn = document.querySelector(".search-btn");
const filmDetailContainer = document.querySelector(".film-detail-container");
const paginationEl = document.querySelector(".pagination");

const API_KEY = "df55b385123085d8a116ec0875e5d913";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_API_URL = "https://image.tmdb.org/t/p/w500";

let queryFilms;
let activePage = 1;
let keyword;
let type;

async function searchMovie(title, type) {
  const response = await fetch(
    `${API_URL}/search/${type}?api_key=${API_KEY}&query=${title}`
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
