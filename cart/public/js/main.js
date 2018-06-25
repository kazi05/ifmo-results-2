const budget = 500,
  goods = {},
  goodElements = document.getElementsByClassName('goods-item'),
  budgetTextElement = document.getElementsByClassName('budget-value')[0],
  purchaseBalanceElement = document.getElementsByClassName('budget-balance')[0],
  basketElement = document.getElementsByClassName('basket-block')[0],
  basketContainerElement = document.getElementsByClassName('basket-goods')[0],
  basketDropText = document.getElementsByClassName('drop-text')[0],
  deleteBasketItem = document.getElementsByClassName('delete-basket-item')[0];

let purchaseCount = 0;
let purchaseBalance = budget - purchaseCount;

budgetTextElement.textContent = budget;
purchaseBalanceElement.textContent = purchaseBalance;

for (const goodElement of goodElements) {
  goodElement.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify([event.target.id, event.target.children[1].textContent, Number(event.target.children[2].textContent.substring(1))]),
    );
  });
}

basketElement.addEventListener('drop', (event) => {
  const data = event.dataTransfer.getData('application/json');

  if (data) {
    const [goodId, goodName, price] = JSON.parse(data);
    basketElement.dispatchEvent(new CustomEvent('order-drop', { detail: { goodId, goodName, price } }));
  }
});

basketElement.addEventListener('dragover', event => event.preventDefault());

basketElement.addEventListener('order-drop', (e) => {
  const price = +e.detail.price;
  const goodId = e.detail.goodId;
  basketDropText.style.display = "none";

  if (purchaseCount + price > budget) {
    alert('Вы исчерпали свой бюджет');
  } else {
    let count = 1;

    if (goods[goodId]) {
      count = ++goods[goodId];

      let basketItem = document.getElementById('basket-' + goodId);
      basketItem.children[2].children[1].textContent = count;      
    } else {
      goods[goodId] = count;

      let li = document.createElement('li');
      li.className = 'basket-item';
      li.setAttribute('id', 'basket-' + goodId);

      let basketImage = document.createElement('li');
      basketImage.className = 'basket-image';
      let img = document.createElement('img');
      img.setAttribute('src', 'public/img/product-preview.png');
      img.setAttribute('draggable', false);
      basketImage.appendChild(img);
      li.appendChild(basketImage);

      let basketName = document.createElement('div');
      basketName.className = 'basket-name';
      let pName = document.createElement('p');
      pName.textContent = e.detail.goodName;
      basketName.appendChild(pName);
      li.appendChild(basketName);

      let basketPrice = document.createElement('div');
      basketPrice.className = 'basket-price';
      let span = document.createElement('span');
      span.textContent = '$'+e.detail.price;
      basketPrice.appendChild(span);
      let pCount = document.createElement('p');
      pCount.className = 'basket-item-count';
      pCount.textContent = count;
      basketPrice.appendChild(pCount);
      li.appendChild(basketPrice);

      basketContainerElement.children[0].appendChild(li);
    }

    purchaseCount += price;
    purchaseBalanceElement.textContent = budget - purchaseCount;
  }
});
