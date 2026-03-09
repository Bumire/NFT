// function greet(name){
//     console.log("Welcome"  + name);
//     console.log("Hello world")
// }
// greet("emma")

// const { User } = require("lucide-react")

// const { Slice } = require("lucide-react")


// function digit(a,b){
//     console.log( a + b);
    
// }
// digit(70,10)


// function add(num1, num2){
//     return num1 + num2
// }

// let result = add(10, 30)
// console.log(result)


// function sub(num1, num2) {
//     return num1 - num2;
// }

// let account = sub(1500, 500); 
// console.log(account); 



 



// let items = ["apple" , "banana" , "orange" , "mango"]

// push
// pop
// unshift
// shift
// slice
// join
// filter
// splice
// every
// map


// console.log(items)
// items.push("mango");

// console.log(items)
// items.pop()

// console.log(items)

// items.unshift("Fish")
// console.log(items)

// items.shift()
// console.log(items)


// console.log(items.join(" "));
// console.log(items.slice(0, items.length));
// // console.log(items.splice(3, 0, "fish" , "meat"))
// console.log(items.splice(2, 1, ))

// console.log(items)

// let items = ["apple" , "banana" , "orange" , "mango"]
// let friends = ["John", "Mike", "Sarah", "Amelia", "Jenna", "luna", "Xander" ];


// foreach

// friends.forEach(printFriend)
// items.forEach((item)=> {
//     console.log("This item is "+ item)
//     console.log(item);
// });

// function functionName{}


// items.forEach(printItem);
// function printItem(item){
//     console.log("This item is "+ item)
//     // console.log(item)
// }

// function printFriend(friend){
//     console.log("This is "+ friend)
//     // console.log(friend)
// }


// let friends = ["John", "Mike", "Sarah", "Amelia", "Jenna", "luna", ]

// const searchKey = prompt("search item");

// console.log(friends[0].includes(searchKey));
// let newFriends = []

// for(let friend of friends){
//     if(friend.includes(searchKey)){
//         newFriends.push(friend)
//     }
// }

// console.log(newFriends);

// let newFriends = friends.filter((friend) =>{return friend.includes(searchKey)}) 
// console.log(newFriends);


// MAPS

// let newFriends = friends.filter(friend => friend.includes(searchKey));
// let newFriends = friends.filter((friend)) =>{return friend.includes(searchKey)}

// console.log(newfriends);


// console.log(friends);
// let newFriends = friends.map((friend)=> {
//     return friend + "s"; 
//  })
// console.log(newFriends)


// user1 = {
//     name: "jenna",
//     email: "jeniedeals@gmail.com",
//     age: 19,
//     introduction: function(){
//         return `Hello i am ${this.name} and i am ${this.age}`},

// greet(){
//     return "This is a good and wonderful morning"
// }
// }

// console.log(user1["email"])

// // for(let key in user1){
// //     console.log(`${key} : ${user1[key]}`);

// // }


// user1.introduction()
// console.log(user1.introduction())
// console.log(user1.greet())

// console.log(console)


class person{
    constructor(name, email, age){
        this.name = name
        this.email = email
        this.age = age
    }
    introduction(){
        return `Hello i am ${this.name} and i am ${this.age}`;
    }
}

user1 = new person("John", "john@gmail.com", 32)
user2 = new person("Mike", "mike@gmail.com", 82)

console.log(user1.name)
console.log(user2.age)
console.log(user1.introduction())
console.log(user2.introduction())



