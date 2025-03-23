function renderThumbnail(results, type) {
  let filmsArr = [];
  let row = []; // Temporary array to store 3 items

  for (let i = 0; i < results.length; i++) {
    let imgPathPoster = `${IMAGE_API_URL}//${results[i].poster_path}`;
    if (results[i].poster_path == null) {
      imgPathPoster = "loading-failed.png";
    }

    let imgPathBackDrop = `${IMAGE_API_URL}//${results[i].backdrop_path}`;
    if (results[i].backdrop_path == null) {
      imgPathBackDrop = imgPathPoster;
    }

    let releasedYear;
    if (type == "movie") {
      releasedYear = results[i].release_date
        ? results[i].release_date.split("-")[0]
        : "unknown";
    } else if (type == "tv") {
      releasedYear = results[i].first_air_date
        ? results[i].first_air_date.split("-")[0]
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
            type == "movie" ? results[i].title : results[i].name
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
            <p>${type == "movie" ? results[i].title : results[i].name}</p>

            <div>
              <p>${type == "movie" ? "Movie" : "TV Series"}</p>
              <p style="color: gray">‖</p>
              <p>${releasedYear}</p>
            </div>

            <div class="description">
              ${
                results[i].overview == ""
                  ? "no description"
                  : results[i].overview.slice(0, 70) + "..."
              }
            </div>

            <button id="${results[i].id}" class="detail-btn">Detail</button>
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

      setTimeout(() => {
        document
          .getElementById("detail-container")
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    });
  });
}
