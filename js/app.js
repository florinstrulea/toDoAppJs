"use strict";

//Selectors

const inputTitle = document.querySelector("#input-title");
const inputDescription = document.querySelector("#input-description");
const newTask = document.querySelector("#new-task");
const tasks = document.querySelector(".tasks");

//Global variables
let taskList = JSON.parse(localStorage.getItem("taskList"));

//Functions
init();
function setLocalStorage(value) {
	localStorage.setItem("taskList", JSON.stringify(value));
}

function init() {
	if (!taskList) {
		taskList = [];
		let task1 = {
			taskName: " Buy some milk",
			description: "I need to buy two liters of milk",
			state: "pending",
		};
		let task2 = {
			taskName: "Water my plants",
			description: "I should water the plants with two liters of water for each plant",
			state: "pending",
		};
		taskList.push(task1, task2);
		setLocalStorage(taskList);
	}
	showTasks(taskList);
}

function showTasks(arr) {
	arr.forEach((task) => {
		const html = `<div class="task">
    <div class="task__left">
      <input type="checkbox" name="check" class="form-check-input"/>
      <span class="task__title">${task.taskName}</span>
    </div>
    <div class="task__right">
      <a href="#" class="task__button">
        <i class="fas fa-trash-alt" title="Delete task"></i>
      </a>
    </div>
  </div>`;
		tasks.insertAdjacentHTML("afterbegin", html);
	});
}
