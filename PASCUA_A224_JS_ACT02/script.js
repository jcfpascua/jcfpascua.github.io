// document.addEventListener("DOMContentLoaded", () => {
//     const btnAdd = document.getElementById("btnAdd");
//     const txtInput = document.getElementById("txtInput");
//     const tasks = document.getElementById("ulTasks");

//     btnAdd.addEventListener("click", () => {
//         const taskText = txtInput.value.trim(); 

//         if (taskText !== "") {
//             const newTask = document.createElement("li");
//             newTask.textContent = taskText;
//             tasks.appendChild(newTask);    
//             txtInput.value = "";          
//         } else {
//             alert("Please enter a task!");
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    const txtTodoItem = document.getElementById("txtTodoItem")
    const btnAddTask = document.getElementById("btnAddTask")
    const lstTodos = document.getElementById("lstTodos")

    let todos = []

    function display() {
        let todoItems = ""
        for (let i = 0; i < todos.length; i++) {
            console.log(todos[i])
            todoItems += "<li>" + todos[i] + "</li>"
        }
        lstTodos.innerHTML = todoItems
    }


    btnAddTask.addEventListener("click", () => {
        console.log(txtTodoItem.value)
        todos.push(txtTodoItem.value)
        console.log(todos)

        display()
        txtTodoItem.value = "";
    })
})