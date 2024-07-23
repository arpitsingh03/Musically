const dropdownMenu = document.querySelector(".dropdown-menu");
const dropdownPlaceholder = document.querySelector(".dropdown-placeholder");
const dropdown = document.querySelector(".dropdown");
var dropdownItems;
const input = dropdown.querySelector("input");

var selectedItem = null;

function openDropdownMenu() {
  dropdownMenu.dataset.open = "";
  dropdown.dataset.open = "";
}

function closeDropdownMenu() {
  delete dropdownMenu.dataset.open;
  delete dropdown.dataset.open;
}

dropdown.addEventListener("focusin", (e) => {
  openDropdownMenu();
});

dropdownPlaceholder.addEventListener("click", (e) => {
  openDropdownMenu();
});

dropdown.addEventListener("focusout", (e) => {
  closeDropdownMenu();
});

dropdownPlaceholder.addEventListener("input", (e) => {
  openDropdownMenu();
  const cleanValue = dropdownPlaceholder.textContent.replace("\n", "");
  setDropdownValue(cleanValue);
  filterItems(cleanValue);
});

function initializeDropdownItems() {
  dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("mouseenter", (e) => {
      item.dataset.active = "";
    });
    item.addEventListener("mouseleave", (e) => {
      delete item.dataset.active;
    });

    item.addEventListener("pointerdown", (e) => {
      selectItem(item);
      e.preventDefault();
      setTimeout(() => {
        closeDropdownMenu();
      }, 100);
    });
  });
}

function selectItem(item) {
  if (selectedItem) delete selectedItem.dataset.selected;
  selectedItem = item;
  selectedItem.dataset.selected = "";
  setDropdownValue(selectedItem.textContent);
}

function setCaretToEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function setDropdownValue(value) {
  dropdownPlaceholder.textContent = value;
  input.value = value;
  setCaretToEnd(dropdownPlaceholder);
}

function filterItems(filter = null) {
  dropdownItems.forEach((item) => {
    if (
      !filter ||
      item.textContent.toLowerCase().includes(filter.trim().toLowerCase())
    ) {
      console.log(
        "Text Content:",
        item.textContent.toLowerCase(),
        "\nFilter:",
        filter.toLowerCase()
      );
      delete item.dataset.hidden;
    } else {
      item.dataset.hidden = "";
    }
  });
}
