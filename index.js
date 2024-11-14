let background_box = document.querySelector(".background_box");
let toggle_box = document.querySelector(".toggle_box");
let circle = document.querySelector(".circle");
let checkbox = document.getElementById("checkbox");

toggle_box.onclick = function () {
  if (checkbox.checked) {
    circle.style.transform = "translateX(100px)";
    circle.style.backgroundColor = "#000";
    toggle_box.style.backgroundColor = "#fff";
    background_box.style.backgroundColor = "#000";
  } else {
    circle.style.transform = "translateX(0px)";
    circle.style.backgroundColor = "#fff";
    toggle_box.style.backgroundColor = "#000";
    background_box.style.backgroundColor = "#fff";
  }
};
