const flexContainer = document.querySelector(".flex-container");

const inputEl = document.querySelector("#title");
const typeEl = document.querySelector("#type");
const searchBtn = document.querySelector(".search-btn");

const filmDetailContainer = document.querySelector(".film-detail-container");

const paginationEl = document.querySelector(".pagination");

function renderThumbnail(data, type) {
  let filmsArr = [];
  let row = []; // Temporary array to store 3 items

  for (let i = 0; i < data.results.length; i++) {
    let imgPathPoster = `https://image.tmdb.org/t/p/w500//${data.results[i].poster_path}`;
    if (data.results[i].poster_path == null) {
      imgPathPoster = "loading-failed.png";
    }

    let imgPathBackDrop = `https://image.tmdb.org/t/p/w500//${data.results[i].backdrop_path}`;
    if (data.results[i].backdrop_path == null) {
      imgPathBackDrop = imgPathPoster;
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
      <div class="container">
        <div class="film-thumbnail">
          <div class="image-container">
            <img
              src="${imgPathPoster}"
              alt="image"
            />
            <p class="year">${releasedYear}</p>
          </div>
          <div class="thumbnail-title">${
            type == "movie" ? data.results[i].title : data.results[i].name
          }</div>
        </div>

        <div class="film-info-container">
          <div class="image-container">
            <img
              src="${imgPathBackDrop}"
              alt="image"
            />
          </div>

          <div class="film-info">
            <p>${
              type == "movie" ? data.results[i].title : data.results[i].name
            }</p>

            <div>
              <p>${type == "movie" ? "Movie" : "TV Series"}</p>
              <p style="color: gray">‖</p>
              <p>${releasedYear}</p>
            </div>

            <div class="description">
              ${
                data.results[i].overview == ""
                  ? "no description"
                  : data.results[i].overview.slice(0, 70) + "..."
              }
            </div>

            <button id="${
              data.results[i].id
            }" class="detail-btn">Detail</button>
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

      let directorName;
      if (director == null) {
        directorName = "unknown";
      } else {
        directorName = director.name;
      }

      let writers = creditData.crew.filter((c) => {
        return (
          c.job === "Producer" || c.job === "Screenplay" || c.job === "Writer"
        );
      });

      let writerNames = writers.map(
        (writer) => `${writer.name} (${writer.job}), `
      );

      let actors = creditData.cast.filter((c) => {
        return c.order < 5;
      });

      let actorNames = actors.map((actor) => `${actor.name}, `);

      // detail
      let imgPathPoster = `https://image.tmdb.org/t/p/w500//${detailData.poster_path}`;
      if (detailData.poster_path == null) {
        imgPathPoster = "loading-failed.png";
      }

      let imgPathBackDrop = `https://image.tmdb.org/t/p/w500//${detailData.backdrop_path}`;
      if (detailData.backdrop_path == null) {
        imgPathBackDrop = imgPathPoster;
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
      filmDetailContainer.innerHTML = `
      <div class="detail-container">
        <div class="image-container">
          <img class="back-drop" src=${imgPathBackDrop} alt="image">
          <img class="poster" src=${imgPathPoster} alt="image">
        </div>

        <div class="details">
          <p class="detail-title">${
            type == "movie" ? detailData.title : detailData.name
          }</p>

          <div class="date-ep-container">
            <span style="color: gray">‖</span>  
            <span>${type == "movie" ? "Movie" : "TV Series"}</span>
            <span style="color: gray">‖</span>
            <span>${fullDate}</span>
            <span style="color: gray">‖</span>
          </div>

          <div class="country-genre-container">
          </div>

          <div class="director">
            <span>Director:</span>
            <span>${
              creditData.crew.length > 0 ? directorName : "unknown"
            }</span>
          </div>

          <div class="writer">
            <span>Writer:</span>
          </div>

          <div class="actor">
            <span>Cast:</span>
          </div>

          <div class="description">
            <span>Description:</span>
            <span>${
              detailData.overview == "" ? "no description" : detailData.overview
            }</span>
          </div>

        </div>
      </div>
      `;

      const countryGenreContainer = document.querySelector(
        ".country-genre-container"
      );

      // country
      if (detailData.origin_country.length > 0) {
        countryNames.forEach((country) => {
          const newSpan = document.createElement("span");
          newSpan.innerHTML = country;

          countryGenreContainer.appendChild(newSpan);
        });
      }

      // genre
      if (genreArr.length > 0) {
        genreArr.forEach((genre) => {
          const newSpan = document.createElement("span");
          newSpan.innerHTML = genre;

          countryGenreContainer.appendChild(newSpan);
        });
      }

      // writer
      if (writerNames.length > 0) {
        writerNames.forEach((writer) => {
          const newSpan = document.createElement("span");
          newSpan.innerHTML = writer;

          document.querySelector(".writer").appendChild(newSpan);
        });
      } else {
        const newSpan = document.createElement("span");
        newSpan.innerHTML = "unknown";
        document.querySelector(".writer").appendChild(newSpan);
      }

      // actor
      if (actors.length > 0) {
        actorNames.forEach((actor) => {
          const newSpan = document.createElement("span");
          newSpan.innerHTML = actor;

          document.querySelector(".actor").appendChild(newSpan);
        });
      } else {
        const newSpan = document.createElement("span");
        newSpan.innerHTML = "unknown";
        document.querySelector(".actor").appendChild(newSpan);
      }

      // episode
      if (type == "tv") {
        const newP = document.createElement("p");
        newP.innerHTML = `${detailData.number_of_episodes} Eps`;

        document.querySelector(".date-ep-container").appendChild(newP);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function detailBtnOnClick(type) {
  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log(btn.id);
      renderDetail(btn.id, type);

      setTimeout(() => {
        document
          .getElementById("detail-container")
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    });
  });
}

function paginationOnClick(activePage, filmsArr, films, type) {
  document.querySelectorAll(".page-item").forEach((btn) => {
    btn.addEventListener("click", () => {
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
      flexContainer.innerHTML = films.join("");

      detailBtnOnClick(type);
    });
  });
}

function searchMovie(title, type) {
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
      if (filmsArr.length > 1) {
        let paginationButtons = `<li id="previous" class="page-item"><a class="page-link" ><<</a></li>`;
        for (let i = 0; i < filmsArr.length; i++) {
          paginationButtons += `<li id="${
            i + 1
          }" class="page-item"><a class="page-link" >${i + 1}</a></li>`;
        }
        paginationEl.innerHTML = `${paginationButtons}<li id="next" class="page-item"><a class="page-link" >>></a></li>`;
      } else {
        paginationEl.innerHTML = "";
      }

      // click on pagination
      paginationOnClick(activePage, filmsArr, films, type);

      document.querySelector("nav").style.display = "block";

      detailBtnOnClick(type);
    })
    .catch((error) => {
      console.log(error);
    });
}

searchBtn.addEventListener("click", () => {
  let type = typeEl.options[typeEl.selectedIndex].value;
  searchMovie(inputEl.value, type);
});
