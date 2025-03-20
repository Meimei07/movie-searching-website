const filmContainer = document.querySelector(".film-container");
const inputEl = document.querySelector("#title");
const typeEl = document.querySelector("#type");
const searchBtn = document.querySelector(".search-btn");

const allFilmInfoContainer = document.querySelector(".all-film-info-container");

const paginationEl = document.querySelector(".pagination");

function renderDetail(id, type) {
  Promise.all([
    fetch(
      `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=df55b385123085d8a116ec0875e5d913`
    ).then((reponse2) => {
      if (!reponse2.ok) {
        throw "erro2";
      }

      return reponse2.json();
    }),
    fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=df55b385123085d8a116ec0875e5d913`
    ).then((reponse3) => {
      if (!reponse3.ok) {
        throw "error3";
      }

      return reponse3.json();
    }),
    fetch(
      `https://api.themoviedb.org/3/configuration/countries?api_key=df55b385123085d8a116ec0875e5d913`
    ).then((reponse4) => {
      if (!reponse4.ok) {
        throw "error4";
      }

      return reponse4.json();
    }),
  ])
    .then(([creditData, detailData, countryData]) => {
      // credit
      let director = creditData.crew.find((c) => {
        return c.job === "Director";
      });

      let writers = creditData.crew.filter((c) => {
        return (
          c.job === "Producer" || c.job === "Screenplay" || c.job === "Writer"
        );
      });

      let writerNames = writers.map(
        (writer) => `${writer.name} (${writer.job})`
      );

      let actors = creditData.cast.filter((c) => {
        return c.order < 5;
      });

      let actorNames = actors.map((actor) => actor.name);

      // detail
      let imgPath3 = `https://image.tmdb.org/t/p/w500//${detailData.poster_path}`;
      if (detailData.poster_path == null) {
        imgPath3 = "default.jpg";
      }

      let genreArr = detailData.genres.map((genre) => genre.name);

      // country
      let matchingCountries = countryData.filter((country) => {
        return detailData.origin_country.includes(country.iso_3166_1);
      });

      let countryNames = matchingCountries.map((country) => {
        return country.english_name;
      });

      // released date
      let fullDate;

      if (type == "movie") {
        if (detailData.release_date == "") {
          fullDate = "unknown";
        } else {
          const dates = detailData.release_date.split("-");
          const date = new Date(`${dates[0]}-${dates[1]}-${dates[2]}`); // year-month-day
          fullDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      } else if (type == "tv") {
        if (detailData.first_air_date == "") {
          fullDate = "unknown";
        } else {
          const firstEpReleased = detailData.first_air_date.split("-");

          const firstDate = new Date(
            `${firstEpReleased[0]}-${firstEpReleased[1]}-${firstEpReleased[2]}`
          );

          fullDate = firstDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }

      // render
      allFilmInfoContainer.innerHTML = `
      <div id="detail" class="film-info-container">
        <div class="detail-image-contianer">
          <img
            src=${imgPath3}
            alt="image"
          />
        </div>
  
        <div class="info">
          <div class="title-info">
            <p>Title</p>
            <p>: ${type == "movie" ? detailData.title : detailData.name}</p>
          </div>
  
          <div class="released-info">
            <p>Released</p>
            <p>: ${fullDate}</p>
          </div>

          <div class="genre-info">
            <p>Genre</p>
            <p>: ${genreArr.length > 0 ? genreArr.join(", ") : "unknown"}</p>
          </div>
  
          <div class="country-info">
            <p>Country</p>
            <p>: ${
              detailData.origin_country.length > 0
                ? countryNames.join(", ")
                : "unknown"
            }</p>
          </div>
  
          <div class="director-info">
            <p>Director</p>
            <p>: ${creditData.crew.length > 0 ? director.name : "unknown"}</p>
          </div>
  
          <div class="writer-info">
            <p>Writer</p>
            <p>: 
              ${writerNames.length > 0 ? writerNames.join(", ") : "unknown"}
            </p>
          </div>
  
          <div class="actor-info">
            <p>Actors</p>
            <p>: ${actors.length > 0 ? actorNames.join(", ") : "unknown"}</p>
          </div>
  
          <div class="award-info">
            <p>Description</p>
            <p>: "${
              detailData.overview == "" ? "No description" : detailData.overview
            }"</p>
          </div>
        </div>
      </div>`;

      if (type == "tv") {
        const episodeEl = document.createElement("div");
        episodeEl.classList.add("episodes-info");
        episodeEl.innerHTML = `
          <p>Episodes<p>
          <p>: ${detailData.number_of_episodes}<p>
        `;

        document
          .querySelector(".film-info-container .info")
          .insertBefore(episodeEl, document.querySelector(".genre-info"));
      }

      document.querySelector(".fourth-section .text").style.display = "block";
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderThumbnail(data, type) {
  let filmsArr = [];
  let row = []; // Temporary array to store 3 items

  for (let i = 0; i < data.results.length; i++) {
    let imgPath = `https://image.tmdb.org/t/p/w500//${data.results[i].poster_path}`;
    if (data.results[i].poster_path == null) {
      imgPath = "default.jpg";
    }

    let releasedYear;
    if (type == "movie") {
      releasedYear = data.results[i].release_date
        ? data.results[i].release_date.split("-")[0]
        : "unknown";
    } else if (type == "tv") {
      releasedYear = data.results[i].first_air_date
        ? data.results[i].first_air_date.split("-")[0]
        : "unknown";
    }

    row.push(`
      <div class="film-thumbnail">
        <div class="image-container">
          <img src="${imgPath}" alt="image" />
        </div>
        <div class="detail-container">
          <p>${type == "movie" ? "Movie" : "TV series"}</p>
          <p class="title" style="font-weight: bold">${
            type == "movie" ? data.results[i].title : data.results[i].name
          }</p>
          <p class="released-year">${releasedYear}</p>
          <div class="detail-btn-container">
            <button id="${data.results[i].id}" class="detail-btn">
              <a class="link" href="#detail">Details</a>
            </button>
          </div>
        </div>
      </div>
    `);

    // If row has 3 items, push to filmsArr and reset
    if (row.length === 3) {
      filmsArr.push(row);
      row = []; // Reset row for the next set of 3
    }
  }

  // Push any remaining items (less than 3)
  if (row.length > 0) {
    filmsArr.push(row);
  }

  console.log(filmsArr);
  return filmsArr;
}

function detailBtnOnClick(type) {
  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log(btn.id);
      renderDetail(btn.id, type);
    });
  });
}

function paginationOnClick(activePage, filmsArr, films, filmContainer, type) {
  document.querySelectorAll(".page-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      // console.log(btn.id);
      // console.log(`active: ${activePage}`);

      if (btn.id === "next") {
        activePage++;

        if (activePage > filmsArr.length) {
          activePage = filmsArr.length;
        }
      } else if (btn.id === "previous") {
        activePage--;

        if (activePage < 1) {
          activePage = 1;
        }
      } else {
        activePage = parseInt(btn.id);
      }

      films = filmsArr[activePage - 1];
      filmContainer.innerHTML = films;

      detailBtnOnClick(type);
    });
  });
}

function searchMovie(title, type) {
  if (type == "series") {
    type = "tv";
  }

  fetch(
    `https://api.themoviedb.org/3/search/${type}?api_key=df55b385123085d8a116ec0875e5d913&query=${title}`
  )
    .then((response) => {
      if (!response.ok) {
        throw "error";
      }

      return response.json();
    })
    .then((data) => {
      const resultsLength = data.results.length;
      console.log(resultsLength);

      let films = ``;

      const filmsArr = renderThumbnail(data, type);
      let activePage = 1;

      films = filmsArr[activePage - 1];
      filmContainer.innerHTML = films;

      // add pagination
      let paginationButtons = `<li id="previous" class="page-item"><a class="page-link" >Previous</a></li>`;
      for (let i = 0; i <= Math.floor(resultsLength / 3); i++) {
        paginationButtons += `<li id="${
          i + 1
        }" class="page-item"><a class="page-link" >${i + 1}</a></li>`;
      }
      paginationEl.innerHTML = `${paginationButtons}<li id="next" class="page-item"><a class="page-link" >Next</a></li>`;

      // click on pagination
      paginationOnClick(activePage, filmsArr, films, filmContainer, type);

      document.querySelector(".second-section .text").style.display = "block";
      document.querySelector("nav").style.display = "block";

      detailBtnOnClick(type);
    })
    .catch((error) => {
      console.log(error);
    });
}

// searchMovie("hi");

searchBtn.addEventListener("click", () => {
  let type = typeEl.options[typeEl.selectedIndex].value;
  searchMovie(inputEl.value, type);
});
