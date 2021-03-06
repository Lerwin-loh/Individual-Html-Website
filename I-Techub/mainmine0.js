let carts = document.querySelectorAll(".add-cart");

let products = [
  {
  name: "Iwatch 2",
  tag: "Iwatch2",
  price: 189,
  inCart: 0
  },
  {
  name: "Iwatch 3",
  tag: "Iwatch3",
  price: 249,
  inCart: 0
  },
  {
  name: "Iwatch 4",
  tag: "Iwatch4",
  price: 489,
  inCart: 0
  },
  {
  name: "Iwatch 5",
  tag: "Iwatch5",
  price: 549,
  inCart: 0
  },
];

for (let i=0; i < carts.length; i++) {
  carts[i].addEventListener("click", () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
  });
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if(productNumbers) {
    document.querySelector(".Cart").textContent = productNumbers;
  }
}

function cartNumbers(product, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  if( action ) {
      localStorage.setItem("cartNumbers", productNumbers - 1);
      document.querySelector(".Cart").textContent = productNumbers - 1;
      console.log("action running");
  } else if(productNumbers){
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".Cart").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers",1);
    document.querySelector(".Cart").textContent = 1;
  }
  setItems(product);
}

function setItems(product) {
  console.log(product)
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null) {
        let currentProduct = product.tag;

        if( cartItems[currentProduct] == undefined ) {
            cartItems = {
                ...cartItems,
                [currentProduct]: product
            }
        }
        cartItems[currentProduct].inCart += 1;

    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        };
    }

    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

function totalCost(product, action) {
  let cart = localStorage.getItem("totalCost");

  if( action) {
      cart = parseInt(cart);

      localStorage.setItem("totalCost", cart - product.price);
  } else {if(cart != null) {

    cart = parseInt(cart);
    localStorage.setItem("totalCost", cart + product.price);

  } else {
    localStorage.setItem("totalCost", product.price);
  }
}
}

function displayCart() {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  let cart = localStorage.getItem("totalCost");
  cart = parseInt(cart);

  let productContainer = document.querySelector('.products');

  if(cartItems && productContainer) {
    productContainer.innerHTML = "" ;
    Object.values(cartItems).map( (item, index) => {
      productContainer.innerHTML += `
      <div style="display:flex;">
      <div class="product">
        <i class="fa fa-close" style="font-size:24px"></i>
        <img src="./CartImage/${item.tag}.jpg"/>
        <span>${item.name}</span>
      </div>
      <div class="price">$${item.price},00</div>
      <div class="quantity">
        <i class="fa fa-plus-circle increase" style="font-size:20px"></i>
        <span> &nbsp; ${item.inCart} &nbsp; </span>
        <i class="fa fa-minus-circle decrease" style="font-size:20px"></i>
      </div>
      <div class="total">  $${item.inCart * item.price},00  </div>
      </div>  `;
    });

    productContainer.innerHTML+=`
      <div class="basketTotalContainer">
        <h4 class="basketTotalTitle">Basket total</h4>
        <h4 class="basketTotal">  $${cart},00  </h4>
      </div> `

    deleteButtons();
    manageQuantity();
  }
}

function manageQuantity() {
  let decreaseButtons = document.querySelectorAll('.decrease');
  let increaseButtons = document.querySelectorAll('.increase');
  let currentQuantity = 0;
  let currentProduct = '';
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  for(let i=0; i < increaseButtons.length; i++) {
      decreaseButtons[i].addEventListener('click', () => {
          console.log(cartItems);
          currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
          console.log(currentQuantity);
          currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
          console.log(currentProduct);

          if( cartItems[currentProduct].inCart > 1 ) {
              cartItems[currentProduct].inCart -= 1;
              cartNumbers(cartItems[currentProduct], "decrease");
              totalCost(cartItems[currentProduct], "decrease");
              localStorage.setItem('productsInCart', JSON.stringify(cartItems));
              displayCart();
          }
      });

      increaseButtons[i].addEventListener('click', () => {
          console.log(cartItems);
          currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
          console.log(currentQuantity);
          currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
          console.log(currentProduct);

          cartItems[currentProduct].inCart += 1;
          cartNumbers(cartItems[currentProduct]);
          totalCost(cartItems[currentProduct]);
          localStorage.setItem('productsInCart', JSON.stringify(cartItems));
          displayCart();
      });
  }
}

function deleteButtons() {
  let deleteButtons = document.querySelectorAll('.product i');
  let productNumbers = localStorage.getItem('cartNumbers');
  let cartCost = localStorage.getItem("totalCost");
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  let productName;
  console.log(cartItems);
  for(let i=0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', () => {
          productName = deleteButtons[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g,'').trim();
          localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
          localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

          delete cartItems[productName];
          localStorage.setItem('productsInCart', JSON.stringify(cartItems));

          displayCart();
          onLoadCartNumbers();
        })
    }
}

function clearLocalStorage() {
  window.localStorage.clear();
}

onLoadCartNumbers();
displayCart();
