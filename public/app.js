'use strict';

// Renders a new todo and finds the user that belongs to the todo
function addTodo(todo) {
  const todolist = $('.todolist');

  todolist.append(`
    <li class="${ todo.completed }" data-id="${ todo._id }">${todo.todo}</li>
      `);
}
// Renders a new project and adds it to datalist dropdown
function addProject(project) {

  const projects = $('#projlist');

  projects.append(`
    <option data-id="${ project._id }" value="${ project.title }">${ project.title }</option>
      `);
}
// Renders a new task and adds it to datalist dropdown.
function addTask(task) {

  const tasks = $('#tasklist');

  tasks.append(`
    <option data-id="${ task._id }" value="${ task.title }">${ task.title }</option>
      `);
}

// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  }));

// Get the Feathers services we want to use
const listsService = app.service('lists');
const projectsService = app.service('projects');
const tasksService = app.service('tasks');

var selectedProject;
var selectedTask;
var selectedList;

// Set currently selected project & task
$('#projlist').change(function(){
  selectedProject = $(this).children('option:selected').data('id');

      tasksService.find({
          query: {
      projID: selectedProject,
      $sort: { createdAt: -1 },
      $limit: 25
    }
  }).then(page => page.data.reverse().forEach(addTask));
  $('#task').fadeIn('slow').removeClass('inactive');
});

$('#tasklist').change(function(){
  selectedTask = $(this).children('option:selected').data('id');

      listsService.find({
          query: {
      taskID: selectedTask,
      $sort: { createdAt: -1 },
      $limit: 25
    }
  }).then(page => {
    $('.todolist').html('');
    page.data.reverse().forEach(addTodo);
  });

  tasksService.find({
  query: {
    _id: selectedTask,
    $select: ['totalTime']
  }
}).then(res => $('#elapsedTaskTime').text(res.data[0].totalTime));
$('#tododiv').fadeIn('slow').removeClass('inactive');
});

$('#newproject').on('submit', function(ev) {
  // This is the project text input field
  const project = $(this).find('[name="project-title"]');

  // Create a new project and then clear the input field
  projectsService.create({
    title: project.val(),
    completed: false,
    startDate: null,
    endDate: null
  }).then(todo => {
    project.val('');
    selectedProject = todo._id;
  });

  ev.preventDefault();

 });

$('#newtask').on('submit', function(ev) {
  // This is the task text input field
  const task = $(this).find('[name="task-title"]');

  // Create a new task and then clear the input field
  tasksService.create({
    title: task.val(),
    completed: false,
    totalTime: 0,
    startTime: null,
    endTime: null,
    due: null,
    isMilestone: false,
    milestoneName: null,
    projID: selectedProject
  }).then(todo => {
    task.val('');
    selectedTask = todo._id;
  }
  );

  ev.preventDefault();

 });

$('#list').on('submit', function(ev) {
  // This is the todo text input field
  const item = $(this).find('[name="todo"]');

  // Create a new todo and then clear the input field
  listsService.create({
    todo: item.val(),
    completed: false,
    completedDate: null,
    due: null,
    taskID: selectedTask
  }).then(todo => item.val(''));

  ev.preventDefault();

 });

// Mark done or not done
$(document).on('click','li', function(){

  const itemId = $(this).data('id');
 // const theclass = $(this).prop('class');
//  console.log(itemId);
 // $('.test').append(itemId);

  if ($(this).hasClass('done')) {

  listsService.update(itemId,{
    $set: {
    //todo: true
    completed: false 
    }
  });

  } else {

  listsService.update(itemId,{
    $set: {
    //todo: true
    completed: 'done' 
    }
  });

  }

  $(this).toggleClass('done');
//  $(this).toggleClass('strike');//.fadeOut('slow');
});

// Delete a list item
$(document).on('dblclick','li', function(){
  const itemId = $(this).data('id');
  listsService.remove(itemId);
  $(this).fadeOut('slow');//.toggleClass('show-hide');
});

// Logout button
$('#logout').on('click', function() {
  app.logout().then(() => window.location.href = '/index.html');
});

// Clock display
function time() {
        $('.clock').text(moment().format('HH:mm:ss'))

        setTimeout(time, 1000)
    };

time()


// Add elapsed time to task total
function taskTime(add) {

  var elapsed;

tasksService.find({
  query: {
    _id: selectedTask,
    $select: ['totalTime']
  }
}).then(function(res) {
 elapsed = res.data[0].totalTime;
 var total = elapsed + add;

 (selectedTask?$('#elapsedTaskTime').text(total):0);

    tasksService.update(selectedTask,{
    $set: {
    totalTime: total
    }
  });
});
}

// Timer
var now;
var timerId;
var duration;

function timer() {
  var end = moment();
  duration = end.diff(now, 'seconds');//from(now, true);
  $('#time').text(duration);

  timerId = setTimeout(timer, 1000);
}
$('#start').on('click', function() {
  now = moment();
  timer()
});
$('#stop').on('click', function() {
  clearTimeout(timerId);
  taskTime(duration);
});

//function load() {
  // Find the latest 10 todos. They will come with the newest first
  // which is why we have to reverse before adding them
app.authenticate().then(() => {
  projectsService.find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 25
    }
  }).then(page => page.data.reverse().forEach(addProject));

  // Listen to created events and add the new todo in real-time
  listsService.on('created', addTodo);

  

  // Listen to created events and add the new project in real-time
  projectsService.on('created', addProject);



  // Listen to created events and add the new task in real-time
  tasksService.on('created', addTask);
})

//load()

// On unauthorized errors we just redirect back to the login page
.catch(error => {
  if(error.code === 401) {
    window.location.href = '/login.html'
  }
});