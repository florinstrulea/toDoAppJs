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
const clearAll = document.querySelector(".delete__all");

//Global variables

let taskList = getLocalStorage();
let taskId;

if (document.URL.includes("index.html")) {
	//Event listeners
	newTask.addEventListener("submit", addTask);
	tasks.addEventListener("click", updateState);
	allFilters.forEach((filter) => {
		filter.addEventListener("click", () => {
			document.querySelector("p.active").classList.remove("active");
			filter.classList.add("active");
			showTasks(filter.id);
		});
	});
	clearAll.addEventListener("click", deleteAll);

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
			? "There is no description for this task"
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
	// showTasks();
}

function showTasks(filter) {
	if (taskList.length == 0) {
		tasks.innerHTML = `<p class="text-danger text-center mt-5 fw-bold empty">You don't have any tasks here</p>`;
	}
	let html = "";
	let content = [];
	taskList = getLocalStorage();
	if (taskList.length !== 0) {
		taskList.forEach((task, index) => {
			let done = task.state == "done" ? "checked" : "";
			if (filter == task.state || filter == "all") {
				html = `<div class="task">
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
				content.unshift(html);
			}

			//tasks.insertAdjacentHTML("afterbegin", html);
		});
	}
	if (document.URL.includes("index.html")) {
		tasks.innerHTML =
			content.join() ||
			`<p class="text-danger text-center mt-5 fw-bold empty">You don't have any tasks here</p>`;
	}
}

showTasks("all");
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
	if (tasks.closest(".empty")) {
		tasks.innerHTML = "";
	}
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
		showTasks(document.querySelector("p.active").id);

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
	showTasks(document.querySelector("p.active").id);
}

function deleteAll() {
	taskList = getLocalStorage();
	taskList.splice(0, taskList.length);
	setLocalStorage(taskList);
	showTasks(document.querySelector("p.active").id);
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
