const formSection = document.querySelector('#add-details');
const uploadSection = document.querySelector('#upload-receipt');

// const button1 = document.querySelector('#b1');
// const button2 = document.querySelector('#b2');

const addItemButton = document.querySelector('#add-item');
//const AIHelpButton = document.querySelector('#upload-image');
const expensesForm = document.querySelector('#receipt-details');

// document.addEventListener('DOMContentLoaded', () => {
//     uploadSection.style.display = "none";
// });

// button1.addEventListener('click', (e) => {
//     e.preventDefault();

//     uploadSection.style.display = "block";
//     formSection.style.display = "none";
// });

// button2.addEventListener('click', (e) => {
//     e.preventDefault();

//     uploadSection.style.display = "none";
//     formSection.style.display = "block";
// });

AIHelpButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.className = 'receipt-image';
    newInput.style.display = 'None';

    const formDiv = document.getElementById('receipt-details');
    formDiv.appendChild(newInput);

    newInput.click();
    
    if (newInput.files.length > 0) {
        const file = { imageFile: newInput.files[0] };
        try {
            const res = await fetch('/add-expenses', {
                method: 'POST',
                body: JSON.stringify(file),
                headers: { 'Content-type': 'application/json' }
            });
    
            const data = await res.json();
            console.log(data);
        }
        catch (err) {
            console.error(err);
        }
    }
})

addItemButton.addEventListener('click', (e) => {
    e.preventDefault();

    const newFieldDiv1 = document.createElement('div');
    newFieldDiv1.className = 'field input-field';

    const newFieldDiv2 = document.createElement('div');
    newFieldDiv2.className = 'field input-field';

    const newFieldDiv3 = document.createElement('div');
    newFieldDiv3.className = 'field input-field';

    const newInput1 = document.createElement('input');
    newInput1.type = 'text';
    newInput1.placeholder = 'Item name';
    newInput1.className = 'input item-name';
    newInput1.required = true;

    const newInput2 = document.createElement('input');
    newInput2.type = 'number';
    newInput2.placeholder = 'Item price';
    newInput2.className = 'input item-price';
    newInput2.required = true;

    const newInput3 = document.createElement('input');
    newInput3.type = 'number';
    newInput3.placeholder = 'Item quantity';
    newInput3.className = 'input item-qty';
    newInput3.required = true;

    newFieldDiv1.appendChild(newInput1);
    newFieldDiv2.appendChild(newInput2);
    newFieldDiv3.appendChild(newInput3);

    const formDiv = document.getElementById('receipt-details');
    const buttonField = document.querySelector('.add-button-field');
    
    formDiv.insertBefore(newFieldDiv1, buttonField);
    formDiv.insertBefore(newFieldDiv2, buttonField);
    formDiv.insertBefore(newFieldDiv3, buttonField);
});

expensesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const storeName = document.querySelector('#store-name').value;
    const storeLocation = document.querySelector('#store-location').value;
    const userId = localStorage.getItem('jwt');

    let keys = Object.keys(localStorage);
    console.log(keys);

    const itemNames = document.querySelectorAll('.item-name');
    const itemPrices = document.querySelectorAll('.item-price');
    const itemQuantities = document.querySelectorAll('.item-qty');

    let items = [];

    itemNames.forEach((itemName, index) => {
        let item = {
            name: itemName.value,
            price: parseFloat(itemPrices[index].value) || 0.0,
            quantity: parseInt(itemQuantities[index].value) || 0
        };

        console.log(index, item);
    
        items.push(item);
    });


    let receipt = {
        userId: userId,
        storeName: storeName,
        storeLocation: storeLocation,
        items: items
    }

    console.log(receipt);

    try {
        const res = await fetch('/add-expenses', {
            method: 'POST',
            body: JSON.stringify(receipt),
            headers: { 'Content-type': 'application/json' }
        });

        const data = await res.json();
        console.log(data);
    }
    catch (err) {

    }

    window.location.href = '/dashboard';

})