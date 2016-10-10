'use strict';

// Renders a new todo and finds the user that belongs to the todo
function addTodo(todo) {
  const todolist = $('.todolist');

  todolist.append(`
    <li data-id="${ todo._id }">
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
    completed: true 
    }
  });

  }

  $(this).toggleClass('done');
  $(this).toggleClass('strike');//.fadeOut('slow');
});

$(document).on('dblclick','li', function(){
  const itemId = $(this).data('id');
  listsService.remove(itemId);
  $(this).fadeOut('slow');//.toggleClass('show-hide');
});

// Logout button
$('#logout').on('click', function() {
  app.logout().then(() => window.location.href = '/index.html');
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