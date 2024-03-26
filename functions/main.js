  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

  const firebaseConfig = {
  apiKey: "AIzaSyB9s7Rb4tFYkHVYKzLSg0Obhnq0CcPyHNI",
  authDomain: "sklep-z-diy-kosmetykami.firebaseapp.com",
  projectId: "sklep-z-diy-kosmetykami",
  storageBucket: "sklep-z-diy-kosmetykami.appspot.com",
  messagingSenderId: "548084606562",
  appId: "1:548084606562:web:a86e8145bc81172421133b",
  measurementId: "G-PLTFBZG1C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

////lista produktow//////////////////////////////////////////////////////

// Pobierz dane z kolekcji
async function getProdukt() {
  const prodListContainer = document.getElementById('productListContainer');

  const querySnapshot = await getDocs(collection(db, 'produkt'));

  const div = document.createElement('div');
  div.className = 'flex-container';

  querySnapshot.forEach((doc) => {
    const produktData = doc.data();
    const card = document.createElement('div');
    card.className = 'product-card';

  // Dodaj obrazek przed tytułem
  const image = document.createElement('img');
  image.src = produktData.zdjęcie;
  image.width = 150;
  image.height = 180;
  card.appendChild(image);

  // Dodaj tytuł
  const title = document.createElement('h4');
  title.textContent = `${produktData.kategoria} ${produktData.marka}`;
  card.appendChild(title);

  // Dodaj opis
  const description = document.createElement('p');
  description.textContent = produktData.opis;
  card.appendChild(description);

  // Dodaj cenę
  const price = document.createElement('p');
  price.textContent = `Cena: ${produktData.cena} zł`;
  card.appendChild(price);

  const buyButton = document.createElement('button');
  buyButton.className = 'button';
  buyButton.textContent = 'Kup teraz';
  buyButton.addEventListener('click', () => {
    const title = card.querySelector('h4').textContent;
    const description = card.querySelector('p').textContent;
    const price = card.querySelectorAll('p')[1].textContent;

    // Utwórz obiekt reprezentujący produkt
    const product = {
        title: title,
        description: description,
        price: produktData.cena,
        photo: produktData.zdjęcie,
        clicked: false
    };

    // Dodaj produkt do koszyka
    cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log("dodano do koszyka");
      updateCart();
  });
  card.appendChild(buyButton);
      // Dodaj card do div
      div.appendChild(card);
      
    });
    prodListContainer.appendChild(div);
}

// Wywołaj funkcję po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  getProdukt();
});

///koszyk///////////////////////////////////////////////////////////

 var cart = [];
 console.log(cart);


function loadCartFromStorage() {
  const cartData = localStorage.getItem('cart');
  if (cartData) {
    cart = JSON.parse(cartData);
    updateCart(); // Aktualizuj zawartość koszyka na stronie po wczytaniu z localStorage
  }
}

// Funkcja aktualizująca zawartość koszyka na stronie
function updateCart() {
  const cartContainer = document.getElementById("cartContainer");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.textContent = "Twój koszyk jest pusty.";
    console.log("Koszyk jest pusty");
  } else {
    const div = document.createElement('div');
    div.className = 'flex-container';

    cart.forEach((product) => {
      const itemElement = document.createElement("div");
      itemElement.className = 'boughtproduct-card'; // Poprawione ustawienie klasy

      const nameElement = document.createElement('p');
      nameElement.textContent = `${product.title} - Cena: ${product.price} zł`;
      itemElement.appendChild(nameElement);

      const image = document.createElement('img');
      image.src = product.photo;
      image.width = 150;
      image.height = 180;

        // Dodaj zdarzenie kliknięcia do karty produktu
      itemElement.addEventListener('click', () => {
        if (!product.clicked) {
          itemElement.style.backgroundColor = 'rgb(222,184,135)'; // zmiana koloru na zielony
        } else {
          itemElement.style.backgroundColor = 'transparent'; // usuwanie tła
        }
          product.clicked = !product.clicked;
      });

      if (product.clicked) {
        
      } else {
        itemElement.classList.remove('selected'); // Usuń klasę 'selected'
      }

      itemElement.appendChild(image); // Dodano obrazek do elementu produktu
      div.appendChild(itemElement); // Dodano element produktu do kontenera
    });

    cartContainer.appendChild(div); // Dodano kontener do głównego kontenera koszyka
  }
}


document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
});


const buttonCle = document.getElementById("clearButton");
const buttonBuy = document.getElementById("buyButton");

buttonCle.addEventListener("click", function() {
  clearCartFromStorage();
});

buttonBuy.addEventListener("click", function() {
  clearCartFromStorageButNotAll();
});


function clearCartFromStorage() {
  localStorage.removeItem('cart');
  cart = [];
  updateCart();
}

function clearCartFromStorageButNotAll() {
  const updatedCart = cart.filter(product => !product.clicked); // Filtruj produkty, które nie zostały kliknięte
  const updatedCartBoughtItems = cart.filter(product => !product.clicked);
  localStorage.setItem('cart', JSON.stringify(updatedCart)); // Zapisz zaktualizowaną tablicę do localStorage
  
  cart = updatedCart; // Zaktualizuj tablicę koszyka
  
  updateCart(); // Zaktualizuj wyświetlanie koszyka

    // Wyświetl komunikat
    const message = document.createElement('div');
    if(updatedCartBoughtItems.length!=0)
      message.textContent = "Zamówienie złożone!";
    else
      message.textContent = "Nie wybrano produktów!";
    message.style.backgroundColor = 'white';
    message.style.padding = '10px';
    message.style.marginTop = '10px';
    message.style.border = '1px solid black';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.zIndex = '9999';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
      message.remove(); // Usuń komunikat po kliknięciu przycisku "Zamknij"
    });
    closeButton.classList.add('close-button'); // Dodaj klasę do przycisku
  
    message.appendChild(closeButton);
    document.body.appendChild(message);
}
