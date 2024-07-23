// @ts-check

const cardGrid = document.querySelector("[data-card-grid]");
console.log(cardGrid);

async function handleSearch(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  if (!cardGrid) return;
  cardGrid.innerHTML = "";
  const list = await getRecommendations(formData.get("query"));
  displayMusic(list);
}

async function getRecommendations(query) {
  const res = await fetch(`/recommendations?query=${query}`);
  return await res.json();
}

function displayMusic(list) {
  if (!cardGrid) return;
  cardGrid.innerHTML = "";
  list.forEach((r) => {
    cardGrid.innerHTML += `<a class="card" href="${r["album_url"]}">
  <img src="${r["cover_url"]}" alt=""/>
  <p class="title">${r["name"]}</p>
</a>`;
  });
}
