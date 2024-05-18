const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const items = itemList.querySelectorAll('li');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();
  let newItem = itemInput.value;
  if (newItem === '') {
    alert('Input items');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorge(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert('This item already exist!');
      return;
    }
  }

  addItemToDOM(newItem);

  addItemToStorage(newItem);

  checkUI();
  itemInput.value = '';
};

// Create add item to DOM
const addItemToDOM = (item) => {
  const li = createListItem(item);
  itemList.appendChild(li);
};

// Create add item to storage
const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to arry
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemsFromStorage = () => {
  let itemsFromStorage;

  localStorage.getItem('items') === null
    ? (itemsFromStorage = [])
    : (itemsFromStorage = JSON.parse(localStorage.getItem('items')));

  return itemsFromStorage;
};
// Create list item
const createListItem = (item) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  return li;
};
// Create button
const createButton = (c) => {
  const button = document.createElement('button');
  button.className = c;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};
// Create icon
const createIcon = (c) => {
  const icon = document.createElement('i');
  icon.className = c;
  return icon;
};

// On click Item
const onClickItem = (e) => {
  e.target.parentElement.classList.contains('remove-item')
    ? rmItem(e.target.parentElement.parentElement)
    : e.target.id !== 'item-list' && setItemToEdit(e.target);
};

const checkIfItemExist = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
};

const setItemToEdit = (item) => {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  itemInput.value = item.textContent;
  formBtn.innerHTML = `<i class='fa-solid fa-pen'></i> Update Item`;
  formBtn.style.backgroundColor = '#228b22';
};

// Remove Item fn
const rmItem = (item) => {
  confirm('Are you sure?') &&
    // Remove Item from DOM
    item.remove();
  // Remove item from storage
  removeItemFromStorge(item.textContent);
  checkUI();
};

// Remove from items from storage
const removeItemFromStorge = (item) => {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

// Clear all fn
const clearAll = () => {
  confirm('Are you sure you want to delete all of these items?') &&
    itemList.querySelectorAll('li').forEach((li) => {
      li.remove();
      localStorage.removeItem('items');
    });
  checkUI();
};

// Check UI fn
const checkUI = () => {
  const items = itemList.querySelectorAll('li');
  items.length === 0
    ? ((clearBtn.style.display = 'none'), (itemFilter.style.display = 'none'))
    : ((clearBtn.style.display = 'block'),
      (itemFilter.style.display = 'block'));

  formBtn.style.backgroundColor = '#333';
  formBtn.innerHTML = `<i class='fa-solid fa-plus'></i> Add Item`;
  isEditMode = false;
};

// Filter items function
const filterItems = (e) => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    itemName.indexOf(text) != -1
      ? (item.style.display = 'flex')
      : (item.style.display = 'none');
  });
};

// Initial function
const init = () => {
  // Event listeners //
  // Add item to the list
  itemForm.addEventListener('submit', onAddItemSubmit);

  // Remove one item event
  itemList.addEventListener('click', onClickItem);

  // Clear all items
  clearBtn.addEventListener('click', clearAll);

  // Filter all items
  itemFilter.addEventListener('input', filterItems);

  // Add Items from local storage when loading page!
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
