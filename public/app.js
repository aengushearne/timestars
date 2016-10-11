'use strict';

// Renders a new todo and finds the user that belongs to the todo
function addTodo(todo) {
  const todolist = $('.todolist');

  todolist.append(`
    <li class="${ todo.completed }" data-id="${ todo._id }">
      ${todo.todo}
      </li>
      `);

  todolist.scrollTop(todolist[0].scrollHeight - todolist[0].clientHeight);
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

$('#list').on('submit', function(ev) {
  // This is the todo text input field
  const item = $(this).find('[name="todo"]');
  const completed = $(this).find('[name="completed"]');

  // Create a new todo and then clear the input field
  listsService.create({
    todo: item.val(),
    completed: false
  }).then(todo => item.val(''), completed.val(false));

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

// Timer
var now;
var timerId;

function timer() {
  var end = moment();
  var duration = end.from(now, true);
  $('#time').text(duration);

  timerId = setTimeout(timer, 1000);
}
$('#start').on('click', function() {
  now = moment();
  //$('#time').text(now);
  timer()
});
$('#stop').on('click', function() {
  clearTimeout(timerId);
});

//function load() {
  // Find the latest 10 todos. They will come with the newest first
  // which is why we have to reverse before adding them
app.authenticate().then(() => {
  listsService.find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 25
    }
  }).then(page => page.data.reverse().forEach(addTodo));

  // Listen to created events and add the new todo in real-time
  listsService.on('created', addTodo);
})

//load()

// On unauthorized errors we just redirect back to the login page
.catch(error => {
  if(error.code === 401) {
    window.location.href = '/login.html'
  }
});