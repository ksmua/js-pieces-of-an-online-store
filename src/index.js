'use strict';

// checkbox
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
// end checkbox

// корзина
const btnCart = document.getElementById('cart');
const modalCart = document.querySelector('.cart');
const btnCartClose = document.querySelector('.cart-close');

btnCart.addEventListener( 'click', () => {
    // console.log('clik on cart');
    modalCart.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

btnCartClose.addEventListener('click', () =>{
    modalCart.style.display = 'none';
    document.body.style.overflow = '';
});
// end корзина



// end worck with goods

//getdata
function getData(){
    const goodsWrapper = document.querySelector(".goods");
    return fetch('./db/db.json')
    .then((response) => {
        if (response.ok){
            return (response.json());
        } else {
            throw new Error ('Data not tacked ' + response.status);
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

// end getdata

getData().then( (data) => {
    renderCards(data);
    //all functions
    renderCatalog();
    addEventOnCart();
});

//print goods card in main
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
// renderCards()

// worck with goods

function addEventOnCart () {

    const cards = document.querySelectorAll('.goods .card');
    const cartWrapper = document.querySelector('.cart-wrapper');
    const cartEmptyLabel = document.getElementById('cart-empty');
    const cartCounter = document.querySelector('.counter');
    // console.log(cards);

    function showData() {
        const cardsCart = cartWrapper.querySelectorAll('.card');
        cartCounter.textContent = cardsCart.length;
    }// end showData

    cards.forEach((card) => {
        const cardBtn = card.querySelector('button');
        
        cardBtn.addEventListener('click', () => {
        const cardClone = card.cloneNode(true);
        cartWrapper.appendChild(cardClone);
        cartEmptyLabel.remove();
        showData();
        });
    });

} // end addEventOnCart

