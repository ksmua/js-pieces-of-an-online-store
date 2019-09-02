'use strict';

// checkbox
function toggleCheckBox() {
    

    const checkbox = document.querySelectorAll('.filter-check_checkbox');
    // console.dir(checkbox);
    checkbox.forEach((elem) => {
        elem.addEventListener('change', function() {
            if (this.checked){
                this.nextElementSibling.classList.add('checked');
            } else {
                this.nextElementSibling.classList.remove('checked');
            }
        });
    });
}

toggleCheckBox();
// end checkbox

// toggle cart
function toggleCart () {
  const btnCart = document.getElementById('cart');
  const modalCart = document.querySelector('.cart');
  const btnCartClose = document.querySelector('.cart-close');

  btnCart.addEventListener('click', () => {
      // console.log('clik on cart');
      modalCart.style.display = 'flex';
      document.body.style.overflow = 'hidden';
  });

  btnCartClose.addEventListener('click', () => {
      modalCart.style.display = 'none';
      document.body.style.overflow = '';
  });
}

toggleCart();
// end toggle cart


//getData
function getData(){
    const goodsWrapper = document.querySelector(".goods");
    return fetch('./db/db.json')
    .then((response) => {
        if (response.ok){
            return (response.json());
        } else {
            throw new Error ('Data not received ' + response.status);
        }
    })
    .then( (data) => {
        return data;
    })
    .catch( err => {
        console.warn(err);
        goodsWrapper.innerHTML = '<div style="color:red; font-size:30px">ups, some thing wrong</div>';
    });
}


function renderCatalog(){
    const cards = document.querySelectorAll('.googs .card');
    const catalogList = document.querySelector('catalog-list');
    const catalogWrapper = document.querySelector('catalog');
    const catalogBtn = document.querySelector('.catalog-button');
    const categories = new Set();
    cards.forEach((card) => {
        // console.dir(card.dataset.category);
        categories.add(card.dataset.category);
    });
    // console.log(catalog);
    categories.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        catalogList.appendChild(li);
    });

    catalogBtn.addEventListener('click', () => {
        if (catalogWrapper.style.display){
            catalogWrapper.style.display = '';
        } else {
        catalogWrapper.style.display = 'block';
        }

       if(event.target.tagName === 'LI'){
           cards.forEach((card) => {
               if (card.dataset.category !== event.target.textContent){
                   card.parentNode.style.display = '';
               }else {
                   card.parentNode.style.display = 'none';
               }
           });
       }
    });
}

// end getData

getData().then( (data) => {
    renderCards(data);
    //all functions
    renderCatalog();
    processingCart();
    actionPage();
});

//print goods cards in main
function renderCards(data){
    const goodsWrapper = document.querySelector('.goods');
    data.goods.forEach( (good) => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4 col-xl-3';
        card.innerHTML = `
            <div class = "card" data-category="${good.category}">
                ${good.sale ? '<div class = "card-sale"> 🔥Hot Sale🔥 </div>' : ''}
                <div class = "card-img-wrapper">
                    <span class = "card-img-top" style = "background-image: url('${good.img}')">
                    </span>
                </div> 
                <div class = "card-body justify-content-between" >
                    <div class = "card-price" style="${good.sale ? 'color:red' : ''}">${good.price} P</div> 
                    <h5 class = "card-title"> ${good.title}</h5> 
                    <button class = "btn btn-primary"> В корзину </button> 
                </div> 
            </div> 
        `;
        goodsWrapper.appendChild(card);
    });
}
// end renderCards

// worck with goods

function processingCart () {
    const cards = document.querySelectorAll('.goods .card'),
          cartWrapper = document.querySelector('.cart-wrapper'),
          cartEmptyLabel = document.getElementById('cart-empty'),
          cartCounter = document.querySelector('.counter');
        
    function showData() {
        const cardsPrice = cartWrapper.querySelectorAll('.card-price'),
              sumTotal = document.querySelector('.cart-total span'),
              cardsCart = cartWrapper.querySelectorAll('.card');
        let cartSum = 0;

        cartCounter.textContent = cardsCart.length;
        
        cardsPrice.forEach((cardPrice) => {
            // console.log(parseFloat(cardPrice.textContent));
            cartSum += (parseFloat(cardPrice.textContent));
        });

        sumTotal.textContent = cartSum;

        if (cardsCart.length !== 0) {
            cartEmptyLabel.textContent = '';
        } else {
            cartEmptyLabel.textContent = 'Ваша корзина пока пуста';
        }
    }// end showData

    cards.forEach((card) => {
        const cardBtn = card.querySelector('button');

        cardBtn.addEventListener('click', () => {
            const cardClone = card.cloneNode(true);
            const removeBtn = cardClone.querySelector('.btn');
            
            removeBtn.textContent = 'Удалить';
            removeBtn.addEventListener('click', () => {
                cardClone.remove();
                showData();
            });
            cartWrapper.appendChild(cardClone);

            showData();
        });
    });

} // end processingCart

// processing with Filters
function actionPage() {
    const cards = document.querySelectorAll('.goods .card'),
        discountCheckBox = document.getElementById('discount-checkbox'),
        min = document.getElementById('min'),
        max = document.getElementById('max');
    
    discountCheckBox.addEventListener('click', () => {
        cards.forEach((card) => {
            if (discountCheckBox.checked){
                if(!card.querySelector('.card-sale')){
                    card.parentNode.style.display = 'none';
                }
            } else {
                card.parentNode.style.display = '';
            }
        });
    });

    function filterPrice() {
        cards.forEach( (card) => {
            const cardPrice = card.querySelector('.card-price');
            const price = parseFloat(cardPrice.textContent);

            if ( (min.value && price < min.value) || (max.value && price > max.value) ){
                card.parentNode.style.display = 'none';
            } else {
                card.parentNode.style.display = '';
            }
        });
    }

    min.addEventListener('change', filterPrice);
    max.addEventListener('change', filterPrice);
}


// end processing with Filters
