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
