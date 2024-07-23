async function loadHints() {
  const res = await fetch("/hints");
  const musicHints = await res.json();
  const dropdownMenu = document.querySelector(".dropdown-menu");
  console.log(musicHints, dropdownMenu);
  var dropdownMenuHTML = "";
  musicHints.forEach((hint) => {
    dropdownMenuHTML += `<div class="dropdown-item">${hint}</div>`;
  });
  dropdownMenu.innerHTML = dropdownMenuHTML;
  initializeDropdownItems();
}

loadHints();
