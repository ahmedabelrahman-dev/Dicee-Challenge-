var number1 = Math.floor((Math.random()) * 6) +1;
var number2 = Math.floor((Math.random()) * 6) +1;

document.querySelectorAll("img")[0].setAttribute("src","./images/dice"+number1+".png");
document.querySelectorAll("img")[1].setAttribute("src","./images/dice"+number2+".png");

if (number1 > number2){
    document.querySelector("h1").textContent="player one is the winner!";
}
else if (number2 > number1){
    document.querySelector("h1").textContent="player two is the winner!";
}
else {
    document.querySelector("h1").textContent="that is a drow!";
}
