"use strict"

class Task {
    constructor(title, description, deadline, status) {
        this.title = title;
        this.description = description;
        this.deadline = deadline ? new Date(deadline) : null;
        this.status = status;
    }

    setAsCompleted() {
        this.status = "completed";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const descriptionInput = document.getElementById("descriptionInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks() {
        taskList.innerHTML = "";
        const today = new Date();

        for (let i = 0; i < tasks.length; i++) {
            const taskData = tasks[i];
            const task = new Task(taskData.title, taskData.description, taskData.deadline, taskData.status ? taskData.status : "pending");
            const li = document.createElement("li");

            li.textContent = "Task: " + task.title;
            li.innerHTML += "<br>";
            li.innerHTML += "Description: " + task.description;
            li.innerHTML += "<br>";
            li.innerHTML += task.deadline ? "Deadline: " + task.deadline.toDateString() : "No deadline";
            li.innerHTML += "<br>";

            if (task.deadline) {
                const timeDifference = task.deadline - today;
                const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                if (daysDifference <= 3 && daysDifference >= 0) {
                    li.style.backgroundColor = "orange";
                }
            }

            if (task.status === "completed"){
                li.style.textDecoration = "line-through";
            }

            const completeButton = document.createElement("button");
            completeButton.textContent = "Complete";

            completeButton.addEventListener("click", function() {
                task.setAsCompleted();
                tasks[i] = task;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                tasks.splice(i, 1);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            })

            li.appendChild(completeButton);
            li.appendChild(deleteButton)
            taskList.appendChild(li);
        }
    }

    renderTasks();

    addTaskButton.addEventListener("click", function () {
        const newTask = taskInput.value.trim();
        const newDescription = descriptionInput.value.trim();
        const newDeadline = deadlineInput.value;

        if (newTask) {
            const task = new Task(newTask, newDescription, newDeadline);
            tasks.push(task);
            taskInput.value = "";
            descriptionInput.value = "";
            deadlineInput.value = "";
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }
    });
});