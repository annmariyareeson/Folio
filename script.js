/* ==========================================================================
   JAVASCRIPT: ZERO TO HERO (DOM CONNECTIONS, INPUTS & FORMS)
   ========================================================================== 
   This file teaches how to connect your HTML interface to JavaScript logic.
   ========================================================================== */


// CONCEPT 1: The DOM (Document Object Model)
// The DOM is how JavaScript sees and interacts with your HTML. 
// We must wait for the HTML document to fully load before trying to connect to it.
// Notice we added 'async' here so we can use 'await' inside this function!
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🟢 1. The DOM is fully loaded. JavaScript is successfully connected to the HTML!");

    /* --- DOM CONNECTIONS (Selecting Elements) --- */
    // We use document.getElementById() to find specific HTML elements by their ID.
    // This is how we "connect" JavaScript to our HTML interface.
    
    const taskForm = document.getElementById("task-form"); // The <form> element
    const taskInput = document.getElementById("task-input"); // The text <input>
    const todoList = document.getElementById("todo-list"); // The <ul> for pending tasks
    const completedList = document.getElementById("completed-list"); // The <ul> for finished tasks


    /* --- CORE FUNCTIONALITY (The Application Logic) --- */

    // CONCEPT 2: Rendering (Updating the DOM)
    // This function clears the current lists and rebuilds them based on our data array.
    function renderTasks() {
        // Clear the current HTML inside the lists to prevent duplicates
        todoList.innerHTML = "";
        completedList.innerHTML = "";

        // Loop through each task object in our array
        tasks.forEach(task => {
            // Step A: Create a new HTML list item <li>
            const li = document.createElement("li");
            
            // Step B: Apply classes based on completion status
            li.className = `task-item ${task.completed ? "completed" : ""}`;
            
            // Step C: Construct the internal HTML for the task item
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="btn-delete">Delete</button>
            `;

            // CONCEPT 3: Dynamic Event Listeners
            // Now that we created these new elements, we must "connect" them to actions.

            // Connect the Checkbox (Input)
            const checkbox = li.querySelector(".task-checkbox");
            checkbox.addEventListener("change", () => toggleTask(task.id));

            // Connect the Delete Button
            const deleteBtn = li.querySelector(".btn-delete");
            deleteBtn.addEventListener("click", () => deleteTask(task.id));

            // Step D: Append (Add) the fully built <li> to the correct list on the screen
            if (task.completed) {
                completedList.appendChild(li);
            } else {
                todoList.appendChild(li);
            }
        });
    }

    // CONCEPT 4: Data Manipulation Functions
    
    // Function to add a new task to our data array
    function addTask(text) {
        const newTask = {
            id: Date.now(), // Generate a unique ID using the current timestamp
            text: text,
            completed: false // Tasks are incomplete by default
        };
        tasks.push(newTask); // Add to array
        console.log(`➕ Added new task: "${text}"`, tasks);
        saveTasksToMemory(); // Save to browser
        renderTasks(); // Update the screen
    }

    // Function to flip the completed status of a specific task
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                console.log(`🔄 Toggled completion status for task ID: ${id}`);
                return { ...task, completed: !task.completed }; // Flip the boolean
            }
            return task;
        });
        saveTasksToMemory(); // Save to browser
        renderTasks(); // Update the screen
    }

    // Function to remove a task from the array completely
    function deleteTask(id) {
        console.log(`❌ Deleted task ID: ${id}`);
        tasks = tasks.filter(task => task.id !== id); // Keep all tasks EXCEPT the deleted one
        saveTasksToMemory(); // Save to browser
        renderTasks(); // Update the screen
    }

    /* --- FORM CONNECTIONS (Handling User Inputs) --- */

    // CONCEPT 5: Forms and User Input
    // We attach a "submit" event listener to the form. 
    // Forms naturally trigger a "submit" when the user hits 'Enter' while inside an input field.
    taskForm.addEventListener("submit", (event) => {
        
        // Critical: Prevent the form from refreshing the page (default browser behavior)
        event.preventDefault();
        console.log("📝 Form submitted! We prevented the default page refresh.");
        
        // Extract the value from the text input field, and remove extra whitespace
        const text = taskInput.value.trim();
        
        // Validation: Only add the task if the input is not empty
        if (text !== "") {
            addTask(text); // Execute our add logic
            taskInput.value = ""; // Clear the input field for the next task
        }
    });

   /* --- APPLICATION STATE (Data) --- */
    // We store our tasks in an Array containing Objects.
    
 // CONCEPT 6: Local Storage & JSON
    // The browser can save data locally so it isn't lost on refresh.
    // Data is saved as a "String". We use JSON.parse() to turn that string back into a JavaScript Array.
    const savedTasks = localStorage.getItem("taskflow_data");
    
    let tasks = savedTasks ? JSON.parse(savedTasks) : [
        { id: 1, text: "Explore the new TaskFlow features", completed: false },
        { id: 2, text: "Finish the quarterly report", completed: false },
        { id: 3, text: "Schedule team meeting", completed: true }
    ];

    // Helper function to save our current tasks array to the browser's memory
    function saveTasksToMemory() {
        // We use JSON.stringify() to convert our Array into a text String before saving
        localStorage.setItem("taskflow_data", JSON.stringify(tasks));
        console.log("💾 Tasks saved to Local Storage!");
    }
/* ==========================================================================
   CONCEPT 7: ASYNCHRONOUS APIs & CODE SPLITTING
   ========================================================================== 
   In modern apps (React/Next.js), we would put this "Data Logic" into a 
   separate file (like 'api.js') and 'import' it here to keep things clean.
   Because we are running this directly from our hard drive without a local 
   server, we keep it in this file to avoid browser security (CORS) errors!
   ========================================================================== */
async function fetchMotivationalQuote() {
    try {
        // 'fetch' asks a server over the internet for data.
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        return `"${data.quote}" - ${data.author}`;
    } catch (error) {
        console.error("Failed to fetch quote:", error);
        return "Stay positive, work hard, make it happen.";
    }
}

    // --- INITIALIZATION ---
    // 1. Fetch and display the quote from our API module
    const quoteContainer = document.getElementById("quote-container");
    if (quoteContainer) {
        quoteContainer.innerText = "Loading inspiration...";
        const quote = await fetchMotivationalQuote();
        quoteContainer.innerText = quote;
        console.log("🌐 Fetched quote from API Module!");
    }

    // 2. Run the render function once when the app starts to draw the initial data
    renderTasks();
});
