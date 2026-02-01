const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll("[data-filter]");
const clearButtons = document.querySelectorAll("[data-clear]");

function generateId() {
  return Date.now().toString(36);
}

function saveItems() {
  const items = [];
  shoppingList.querySelectorAll("li").forEach(li => {
    items.push({
      id: li.dataset.id,
      name: li.querySelector(".item-name").textContent,
      completed: li.hasAttribute("data-completed")
    });
  });
  localStorage.setItem("shoppingItems", JSON.stringify(items));
}

function loadItems() {
  const items = JSON.parse(localStorage.getItem("shoppingItems")) || [];
  shoppingList.innerHTML = "";
  items.forEach(item => shoppingList.appendChild(createItem(item)));
}

function createItem({ id, name, completed }) {
  const li = document.createElement("li");
  li.dataset.id = id;
  li.draggable = true;
  if (completed) li.setAttribute("data-completed", "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", () => {
    li.toggleAttribute("data-completed", checkbox.checked);
    saveItems();
  });

  const nameDiv = document.createElement("div");
  nameDiv.className = "item-name";
  nameDiv.textContent = name;
  nameDiv.addEventListener("click", () => {
    if (!li.hasAttribute("data-completed")) {
      nameDiv.contentEditable = true;
      nameDiv.focus();
    }
  });
  nameDiv.addEventListener("blur", () => {
    nameDiv.contentEditable = false;
    saveItems();
  });

  const drag = document.createElement("span");
  drag.className = "drag-icon";
  drag.innerHTML = `<i class="ri-equal-line"></i>`;

  const del = document.createElement("button");
  del.className = "delete-button";
  del.innerHTML = `<i class="ri-delete-bin-line"></i>`;
  del.addEventListener("click", () => {
    li.remove();
    updateNotice();
    saveItems();
  });

  li.append(checkbox, nameDiv, drag, del);
  return li;
}

shoppingForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = item.value.trim();
  if (!value) return;
  shoppingList.prepend(createItem({ id: generateId(), name: value }));
  shoppingForm.reset();
  updateNotice();
  saveItems();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterItems(btn.dataset.filter);
  });
});

function filterItems(type) {
  shoppingList.querySelectorAll("li").forEach(li => {
    const completed = li.hasAttribute("data-completed");
    li.style.display =
      type === "all" ||
      (type === "completed" && completed) ||
      (type === "incomplete" && !completed)
        ? "flex"
        : "none";
  });
}

clearButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.clear === "all") shoppingList.innerHTML = "";
    else shoppingList.querySelectorAll("[data-completed]").forEach(li => li.remove());
    updateNotice();
    saveItems();
  });
});

function updateNotice() {
  document.querySelector(".shopping-notice")
    .classList.toggle("show", shoppingList.children.length === 0);
}

loadItems();
updateNotice();
