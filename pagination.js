function renderPagination(filmsCount) {
  if (filmsCount > 1) {
    let paginationButtons = `<li id="previous" class="page-item"><a class="page-link" ><<</a></li>`;
    for (let i = 0; i < filmsCount; i++) {
      paginationButtons += `<li id="${
        i + 1
      }" class="page-item"><a class="page-link" >${i + 1}</a></li>`;
    }
    paginationEl.innerHTML = `${paginationButtons}<li id="next" class="page-item"><a class="page-link" >>></a></li>`;
  } else {
    paginationEl.innerHTML = "";
  }
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
