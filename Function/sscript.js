// function sub(num1, num2) {
//     return num1 - num2;
// }

// let account = sub(150, 60); 
// console.log(account); 



// function div(num1, num2) {
//     return num1 / num2;
// }

// let divResult = div(150, 27);
// console.log(divResult);



// function mul(num1, num2) {
//     console.log(num1 * num2);
// }

// mul(10, 5); 



// Fresh mart

let inventory = ["Milk", "Eggs", "Bread", "Cheese"];


console.log(inventory)
inventory.push("Apples");

console.log(inventory)
inventory.pop()

// console.log(inventory)

inventory.unshift("Honey")
console.log(inventory)

inventory.shift("Honey")
// console.log(inventory)

console.log(inventory.slice(0,3, inventory.length));

console.log(inventory.slice(1,5, inventory.length));


console.log(inventory.join(" ,"));


// phase 2
console.log(inventory.splice(2, 0, "Chocolate", "Tea"));

console.log(inventory);

console.log(inventory.splice( 1, 1, ))
console.log(inventory);

// topPicks  
 console.log (inventory.slice(0,3,) );
 

     
// phase 3

let prices = [10, 25, 40, 5, 15, 60];


prices.forEach(price);
function price(price)
{
    console.log("The price of this item $ "+ price)};
    

    
let cheapItems = prices.filter (function(price) {
    return price < 20; 
});

console.log(cheapItems); 



let newPrices = prices.map(function(price) {
    return price + 5;
});

console.log(newPrices); 


let safetyCheck = prices.every(function(price){
    return price > 0;
});

console.log(safetyCheck); 