"use strict";

//Selectors

const inputTitle = document.querySelector("#input-title");
const inputDescription = document.querySelector("#input-description");
const newTask = document.querySelector("#new-task");
const tasks = document.querySelector(".tasks");
const tasksContainer = document.querySelector(".tasks__container");
const taskTitle = document.querySelector(".title__container--title");
const taskDescription = document.querySelector(".description__value");
const filters = document.querySelector(".filters");
const allFilters = document.querySelectorAll(".filter");

//Global variables

let taskList = getLocalStorage();
let taskId;
//Event listeners

if (document.URL.includes("index.html")) {
	newTask.addEventListener("submit", addTask);
	tasks.addEventListener("click", updateState);
	filters.addEventListener("click", changeTab);

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
function getLocalStorage() {
	return JSON.parse(localStorage.getItem("taskList"));
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
	showTasks(getLocalStorage());
}

function showTasks(arr) {
	arr.forEach((task, index) => {
		let done = task.state == "done" ? "checked" : "";
		const html = `<div class="task">
    <div class="task__left">
      <input type="checkbox" name="check" class="form-check-input" id="${index}" ${done}/>
      <span class="task__title ${done}">${task.taskName}</span>
    </div>
    <div class="task__right">
      <a href="#" class="task__button" onclick="deleteTask(${index})">
        <i class="fas fa-trash-alt" title="Delete task"></i>
      </a>
    </div>
  </div>`;
		tasks.insertAdjacentHTML("afterbegin", html);
	});
}
function updateState(e) {
	if (e.target.classList.contains("form-check-input")) {
		if (e.target.checked) {
			// console.log(e.target);
			// console.log(e.target.id);
			// console.log(e.target.parentElement.parentElement);
			taskList[e.target.id].state = "done";
			e.target.nextElementSibling.classList.add("checked");
			//tasks.appendChild(e.target.parentElement.parentElement);

			//arrayMove(taskList, e.target.id, 0);
		} else {
			taskList[e.target.id].state = "pending";
			e.target.nextElementSibling.classList.remove("checked");
			// taskList = arrayMove(taskList, e.target.id, taskList.length);
			// console.log(e.target.id);
			// setLocalStorage(taskList);
			//window.location.reload();
		}
		setLocalStorage(taskList);
	}
}
function addTask(e) {
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
		let existing = getLocalStorage();
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

function deleteTask(elementId) {
	//console.log(elementId);
	taskList = getLocalStorage();
	taskList.splice(elementId, 1);
	setLocalStorage(taskList);
	window.location.reload();
}

function changeTab(e) {
	const clicked = e.target.closest(".filter");

	if (!clicked) return;
	//Remove active from all filters
	allFilters.forEach((f) => f.classList.remove("active"));
	//Activate filter
	clicked.classList.add("active");
	taskList = getLocalStorage();
}

function stripTags(str) {
	if (str === null || str === "") {
		return false;
	} else {
		str = str.toString().trim();
		return str.replace(/(<([^>]+)>)/gi, "");
	}
}

function arrayMove(arr, fromIndex, toIndex) {
	let element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
	return arr;
}
