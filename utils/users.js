const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeaves(id) {
  const index = users.findIndex(user => user.id === id) // it returns -1 if doesnt find the index
  if (index !== -1) {
    return users.splice(index, 1)[0];
  } 
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

export {
  userJoin,
  getCurrentUser,
  userLeaves, 
  getRoomUsers
}