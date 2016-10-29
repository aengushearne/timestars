'use strict';

// Renders a new todo
function addTodo(todo) {
  const todolist = $('.todolist');
  let status = '';
  (todo.completed?status='done ':'');
  let archive = '';
  (todo.archived?archive='inactive':'');
  todolist.append(`
    <li class="`+status+archive+`" data-id="${ todo._id }">${todo.todo}<span class="list-delete delete right inactive">X</span></li>
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
    <option class="taskmenuitem" data-id="${ task._id }" value="${ task.title }">${ task.title }</option>
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
const listsService = app.service('todolists');
const projectsService = app.service('projects');
const tasksService = app.service('tasks');
const profileService = app.service('userprofiles');

var selectedProject = false;
var selectedTask = false;

// Set currently selected project & task
$('#projlist').change(function(){
  selectedProject = $(this).children('option:selected').data('id');
  let selectedTitle = $(this).children('option:selected').attr('value');

      projectsService.find({
          query: {
      _id: selectedProject,
      $sort: { createdAt: -1 },
      $limit: 25
    }
  }).then(proj => {
    $('#selectedproj').text(proj.data[0].title);
    $('#totalprojhours').text(proj.data[0].totalHours);
    $('#totalbill').text(proj.data[0].totalBillable);
  });

      tasksService.find({
          query: {
      projID: selectedProject,
      $sort: { createdAt: -1 },
      $limit: 25
    }
  }).then(page => {
    $('.taskmenuitem').remove();
    $('#tododiv').fadeOut('slow').addClass('inactive');
    page.data.reverse().forEach(addTask);
  });
  $('#selectedtask').text('------------');
  $('.billable').addClass('off')
  $('#hourlyrate').text('0');
  $('#taskbill').text('0');
  $('#elapsedTaskTime').text('0');
  $('.todolist').html('');
  $('#task').fadeIn('slow').removeClass('inactive');
});

$('#tasklist').change(function(){
  selectedTask = $(this).children('option:selected').data('id');
  let selectedTitle = $(this).children('option:selected').attr('value');

      tasksService.find({
          query: {
      _id: selectedTask,
      $sort: { createdAt: -1 },
      $limit: 25
    }
  }).then(task => {
    $('#selectedtask').text(task.data[0].title);
    if (task.data[0].isBillable && task.data[0].rate!==0) {
      $('.billable').removeClass('off');
    } else {
      $('.billable').addClass('off');
      };
    $('#hourlyrate').text(task.data[0].rate);
    $('#elapsedTaskTime').text(task.data[0].totalTime);
    billPerTask(0)
  });

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
$('#selectedtask').html(selectedTitle);
});

// Delete a project
$('#deleteproj').on('click', function(){
  const projId = selectedProject;
  $('#projlist').children('option[data-id='+projId+']').remove();
  projectsService.remove(projId);

  tasksService.find({
    query:{
      projID: projId
    }
  }).then(task => task.data.forEach(taskEntry => {//tasksService.remove(entry._id) ));

      listsService.find({
        query:{
          taskID: taskEntry._id
        }
      }).then(todo => todo.data.forEach(entry => listsService.remove(entry._id) ));

      $('#tasklist').children('option[data-id='+taskEntry._id+']').remove();
      tasksService.remove(taskEntry._id);
    }));

  $('#selectedproj').text('------------');
  $('#totalprojhours').text('0');
  $('#totalbill').text('0');

  $('#selectedtask').text('------------');
  $('.billable').addClass('off');
  $('#hourlyrate').text('0');
  $('#taskbill').text('0');
  $('#elapsedTaskTime').text('0');
  $('.todolist').html('');

  $('#tododiv').fadeOut('slow').addClass('inactive');
  $('#task').fadeOut('slow').addClass('inactive');
  selectedProject = 0;
});

// Delete a task
$('#deletetask').on('click', function(){
  const taskId = selectedTask;
  $('#tasklist').children('option[data-id='+taskId+']').remove();
  tasksService.remove(taskId);

  listsService.find({
    query:{
      taskID: taskId
    }
  }).then(todo => todo.data.forEach(entry => listsService.remove(entry._id) ));

  $('#selectedtask').text('------------');
  $('.billable').addClass('off');
  $('#hourlyrate').text('0');
  $('#taskbill').text('0');
  $('#elapsedTaskTime').text('0');
  $('.todolist').html('');
  selectedTask = 0;
});

// Create a new project 
$('#newproject').on('submit', function(ev) {
  // This is the project text input field
  const project = $(this).find('[name="project-title"]');

  projectsService.create({
    title: project.val(),
    completed: false/*,
    startDate: null,
    endDate: null*/
  }).then(proj => {
    project.val('');
    selectedProject = proj._id;
    //$('#projlist option:selected').removeAttr('selected');
    //$("#projlist option[value="+proj.title+"]").attr('selected');
    $('#selectedproj').text(proj.title);
    $('#totalprojhours').text(proj.totalHours);
    $('#totalbill').text(proj.totalBillable);
  });

  ev.preventDefault();
  $('.taskmenuitem').remove();
  $('#selectedtask').text('------------');
  $('.billable').addClass('off');
  $('#hourlyrate').text('0');
  $('#taskbill').text('0');
  $('#elapsedTaskTime').text('0');
  $('.todolist').html('');
  $('#tododiv').fadeOut('slow').addClass('inactive');
  $('#task').fadeIn('slow').removeClass('inactive');
 });

// Create a new task
$('#newtask').on('submit', function(ev) {
  // This is the task text input field
  const newtask = $(this).find('[name="task-title"]');

  tasksService.create({
    title: newtask.val(),
    /*completed: false,
    totalTime: 0,
    startTime: null,
    endTime: null,
    due: null,
    isMilestone: false,
    milestoneName: null,*/
    projID: selectedProject
  }).then(task => {
    newtask.val('');
    selectedTask = task._id;
    $('#selectedtask').text(task.title);
    $('.billable').addClass('off')
    $('#taskbill').text('0');
    $('#hourlyrate').text(task.rate);
    $('#elapsedTaskTime').text(task.totalTime);
  }
  );

  ev.preventDefault();
  $('.todolist').html('');
  $('#tododiv').fadeIn('slow').removeClass('inactive');
 });

$('#list').on('submit', function(ev) {
  // This is the todo text input field
  const item = $(this).find('[name="todo"]');

  // Create a new todo and then clear the input field
  listsService.create({
    todo: item.val(),
    /*completed: false,
    completedDate: null,
    due: null,*/
    taskID: selectedTask
  }).then(todo => item.val(''));

  ev.preventDefault();

 });

// Mark done or not done
$(document).on('click','li', function(){

  const itemId = $(this).data('id');
  
  var userID;
  
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

      listsService.find({
      query: {
      _id: itemId,
      $select: ['userID']
      }
    }).then(function(res) {
      userID = res.data[0].userID;
    });

      profileService.find({
      query: {
      userID: userID,
      $select: ['points']
      }
    }).then(function(res) {
      let profID = res.data[0]._id;
      let points = res.data[0].points;
      let newpoints = points - 1;
      profileService.update(profID,{
        $set: {
        points: newpoints
      }
      });
      $('.points').text(newpoints);
    });

  } else {

  listsService.update(itemId,{
    $set: {
    //todo: true
    completed: true 
    }
  });

    listsService.find({
      query: {
      _id: itemId,
      $select: ['userID']
      }
    }).then(function(res) {
      userID = res.data[0].userID;
    });

    profileService.find({
      query: {
      userID: userID,
      $select: ['points']
      }
    }).then(function(res) {
      let profID = res.data[0]._id;
      let points = res.data[0].points;
      let newpoints = points + 1;
      profileService.update(profID,{
        $set: {
        points: newpoints
      }
      });
      $('.points').text(newpoints);
    });

  }

  $(this).toggleClass('done');
//  $(this).toggleClass('strike');//.fadeOut('slow');
  // Points!!!

});

// Display delete button
$(document).on('mouseenter','li', function(){
    $(this).find('span').removeClass('inactive');
  }).on('mouseleave','li', function(){
    $(this).find('span').addClass('inactive');
  });

// Delete a list item
$(document).on('click','.list-delete', function(){
  const itemId = $(this).parent().data('id');
  listsService.remove(itemId);
  $(this).parent().fadeOut('slow');//.toggleClass('show-hide');
});

// Archive a list item
$(document).on('dblclick','li', function(){
  const itemId = $(this).data('id');
  listsService.update(itemId,{
    $set: {
    completed: true,
    archived: true 
    }
  });
  $(this).fadeOut('slow');//.toggleClass('show-hide');
});

// Make billable
$('#taskbillable').on('click', function() {
  $('.billable').removeClass('off');
  
  $('#hourlyrate').html('<input id="rate" name="rate" type="number"></input>');
});

function setRate() {
  let rate = 0;
  ($('#rate').val()?rate=$('#rate').val():0);
  //console.log('setRate: '+rate);
  if (rate > 0) {
  tasksService.update(selectedTask,{
    $set: {
    isBillable: true
    }
  });

  tasksService.update(selectedTask,{
    $set: {
    rate: rate
    }
  });
} else {
  tasksService.update(selectedTask,{
    $set: {
    isBillable: false
    }
  });
  tasksService.update(selectedTask,{
    $set: {
    rate: 0
    }
  });
  $('.billable').addClass('off');
}
    $('#hourlyrate').text(rate);
};

$('#hourlyrate').on('blur', '#rate', function() {
  setRate();
  //console.log('onBlur rate: ');
});

$('#hourlyrate').on('keydown', function(e) {
    // trap the return key being pressed
    if (e.keyCode === 13) {
      setRate();
      e.preventDefault();
    }
  });

// Clock display
function time() {
        $('.clock').text(moment().format('HH:mm:ss'))

        setTimeout(time, 1000)
    };

time()


// Add elapsed time to task & project total
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

projectsService.find({
  query: {
    _id: selectedProject,
    $select: ['totalHours']
  }
}).then(function(res) {
 elapsed = res.data[0].totalHours;
 var totalsecs = elapsed + add;
 var total = Math.floor(totalsecs / 3600);

 (selectedProject?$('#totalprojhours').text(total):0);

    projectsService.update(selectedProject,{
    $set: {
    totalHours: total
    }
  });
});
}

// Timer
var now;
var timerId;
var duration = 0;
var added;

function timer() {
  var end = moment();
  duration = end.diff(now, 'seconds');//from(now, true);
  $('#time').text(duration);
  billPerTask();

  timerId = setTimeout(timer, 1000);
}
$('#start').on('click', function() {
  now = moment();
  timer()
});
$('#stop').on('click', function() {
  clearTimeout(timerId);
  taskTime(duration);

  projectsService.find({
  query: {
    _id: selectedProject,
    $select: ['totalBillable']
  }
}).then(function(res) {
 let previousProjBill = res.data[0].totalBillable;
 var total = (previousProjBill + bill).toFixed(2);

 (selectedProject?$('#totalbill').text(total):0);

    projectsService.update(selectedProject,{
    $set: {
    totalBillable: total
    }
  });
});
added = duration;
duration = 0;
$('#time').text(added);
});

var bill = 0;
function billPerTask() {
  let t = duration;//Number($('#time').text());
//  console.log('t: '+t);
  let r = ((100 * $('#hourlyrate').text())/60)/60;
//  console.log('r: '+r);
  let et = Number($('#elapsedTaskTime').text());
//  console.log('et: '+et);
  let tt = et + t;
//  console.log('tt: '+tt);
  bill = (r*tt)/100;
//  console.log('bill: '+bill);
  $('#taskbill').text(bill.toFixed(2));
}

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
   tasksService.on('removed', addTask);
})

//load()

// On unauthorized errors we just redirect back to the login page
.catch(error => console.log(error));
/*
.catch(error => {
  if(error.code === 401) {
    window.location.href = '/login.html'
  }
});
*/

// Logout button
$('#logout').on('click', function() {
  app.logout().then(() => window.location.href = '/index.html');
});

// Open help modal window
$("a[data-modal]").on('click', function() {
    $(this).modal({
  fadeDuration: 1000,
  fadeDelay: 0.50
    });
  });