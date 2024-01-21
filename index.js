import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const itemList = document.getElementById("shopping-list");
const error = document.getElementById("error");

const firebaseConfig = {
  apiKey: "AIzaSyDt9xSz7Zc6sWrBYsaMaI5UYaUjc00xbz8",
  authDomain: "add-to-cart-app-6c117.firebaseapp.com",
  databaseURL: "https://add-to-cart-app-6c117-default-rtdb.firebaseio.com",
  projectId: "add-to-cart-app-6c117",
  storageBucket: "add-to-cart-app-6c117.appspot.com",
  messagingSenderId: "1014030734208",
  appId: "1:1014030734208:web:47e8bebc6a35530348e765",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// console.log(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shopping_list");

addButtonEl.addEventListener("click", () => {
  let inputValue = inputFieldEl.value;

  if (inputValue !== "") {
    error.classList.remove("show-error");
    push(shoppingListInDB, inputValue);

    clearInputField();
  } else {
    error.classList.add("show-error");
  }
});

function clearInputField() {
  inputFieldEl.value = "";
}

function addItems(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let itemListEl = document.createElement("li");

  itemListEl.textContent = itemValue;

  itemListEl.addEventListener("dblclick", () => {
    let itemIDinDB = ref(database, `shopping_list/${itemID}`);

    remove(itemIDinDB);
  });

  itemList.append(itemListEl);
}

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingItemsArr = Object.entries(snapshot.val());

    clearShoppingItems();

    for (let i = 0; i < shoppingItemsArr.length; i++) {
      let currentItem = shoppingItemsArr[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      addItems(currentItem);
    }
  } else {
    itemList.innerHTML = "No items added yet";
  }
});

function clearShoppingItems() {
  itemList.innerHTML = "";
}
