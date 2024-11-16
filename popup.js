const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTaskButton');


const colors = ['#F7E600', '#B38FF4', '#A3E548', '#B32580'];

addTaskButton.addEventListener('click', () => {
  addTask();
});

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask();
  }
});

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    chrome.storage.local.get({ tasks: [] }, (data) => {
      const tasks = data.tasks || [];
      tasks.push({ text: taskText, color: randomColor });

      chrome.storage.local.set({ tasks }, () => {
        taskInput.value = ''; 
        loadTasks();
      });
    });
  }
}

function loadTasks() {
  chrome.storage.local.get({ tasks: [] }, (data) => {
    const tasks = data.tasks || [];
    taskList.innerHTML = ''; 

    tasks.forEach((taskObj, index) => {
      const li = document.createElement('li');
      li.textContent = taskObj.text.toUpperCase();

      Object.assign(li.style, {
        width: '200px',
        height: '100px',
        fontSize: '30px',
        fontWeight: '600',
        backgroundColor: taskObj.color,
        borderRadius: '15px',
        padding: '15px 10px',
        margin: '10px 0',
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      });

      const deleteButton = document.createElement('button');
      const binImage = document.createElement('img');
      binImage.src = './bin.png';
      binImage.alt = 'Delete';
      Object.assign(binImage.style, {
        width: '30px',
        height: '30px',
      });

      Object.assign(deleteButton.style, {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
      });

      deleteButton.appendChild(binImage);

      deleteButton.addEventListener('click', () => {
        deleteTask(index);
      });

      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  });
}

function deleteTask(index) {
  chrome.storage.local.get({ tasks: [] }, (data) => {
    const tasks = data.tasks || [];
    tasks.splice(index, 1);

    chrome.storage.local.set({ tasks }, () => {
      loadTasks();
    });
  });
}

loadTasks();
