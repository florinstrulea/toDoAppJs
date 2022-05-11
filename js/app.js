"use strict";

//Selectors

const inputTitle = document.querySelector("#input-title");
const inputDescription = document.querySelector("#input-description");
const newTask = document.querySelector("#new-task");
const tasks = document.querySelector(".tasks");
const tasksContainer = document.querySelector(".tasks__container");
const taskTitle = document.querySelector(".title__container--title");
const taskDescription = document.querySelector(".description__value");

//Global variables

let taskList = JSON.parse(localStorage.getItem("taskList"));
let taskId;
//Event listeners
if (document.URL.includes("index.html")) {
	newTask.addEventListener("submit", addTask);

	tasksContainer.addEventListener("click", function (e) {
		if (e.target.classList.contains("task")) {
			taskId = e.target.firstElementChild.firstElementChild.id;
			localStorage.setItem("taskId", taskId);
			window.location.href = `details.html?id=${taskId}`;
		} else if (e.target.classList.contains("task__title")) {
			taskId = e.target.parentElement.firstElementChild.id;
			localStorage.setItem("taskId", taskId);
			window.location.href = `details.html?id=${taskId}`;
		}
	});
	init();
}

if (document.URL.includes("details.html")) {
	const taskId = localStorage.getItem("taskId");
	taskTitle.textContent = `My task: ${taskList[taskId].taskName}`;
	taskDescription.textContent = `${
		!taskList[taskId].description
			? "There is no description for the task"
			: taskList[taskId].description
	}`;
}

//Functions

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
	arr.forEach((task, index) => {
		const html = `<div class="task">
    <div class="task__left">
      <input type="checkbox" name="check" class="form-check-input" id="${index}"/>
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

function addTask(e) {
	e.preventDefault();
	let newTask = stripTags(inputTitle.value);
	//console.log(newTask);
	let taskDescription = stripTags(inputDescription.value);

	if (newTask) {
		let task = {
			taskName: newTask,
			description: taskDescription,
			state: "pending",
		};
		//Getting existing info on the local storage
		let existing = JSON.parse(localStorage.getItem("taskList"));
		//console.log(existing);

		//Adding to array
		existing.push(task);
		setLocalStorage(existing);

		//Reinitialise Tasks for new value
		tasks.innerHTML = "";
		showTasks(existing);

		//reinitialise input
		inputTitle.value = "";
		inputDescription.value = "";
	} else {
		alert("You need to give a name to your task");
	}
}

function stripTags(str) {
	if (str === null || str === "") {
		return false;
	} else {
		str = str.toString().trim();
		return str.replace(/(<([^>]+)>)/gi, "");
	}
}
