# Session-Socket
-The Socket.io session/user management library:

**Why session-socket?**

- It's simple. Through an expressive API, session-socket makes it easy to manage and keep track of active websocket connections.
- It's extensible. Write custom user/session related plugins for the library.
- It's lightweight. After removing whitespace, this library sits in at just 50 lines of code.

## Index:
1. [Installation](#installation)
2. [API](#api)
3. [Dependencies](#dependencies)
4. [Author](#author)
5. [License](#license)

***
## Installation:
```
npm install session-socket --save
```

***
## API:

## session.connections:
This expression returns an object which contains a variety of different methods for acting on each of your apps active websocket connections.

**Returns**: [*obj*]
```js
{
  all(),
  get(),
  toArray(),
  length(),
  connect(),
  disconnect()
}
```

**Example**:
```js
session.connections;
```

**Full example**:
```js
const io = require('socket.io');
const session = require('session-socket');

io.on('connection', (socket) => {

  // Get all active connections:
  const allConnections = session.connections.all();

  // Get an individual user:
  const userObj = session.connections.get(socket);

  // Get an array of each active connection:
  const arr = session.connections.toArray();

  // Get number of active connections:
  const countConnections = session.connections.length();

  // Connect a new socket:
  session.connections.connect(socket);

  // Disconnect a socket:
  session.connections.disconnect(socket);

});
```

***
## session.connect([*socket*], [*user*]):
This method connects a socket instance to the library. In most scenarios, you will want to invoke this method immediately after establishing your websocket connection.

It is the shorthand way of calling `session.connections.connect()`.

- This method takes 2 parameters, the second being optional.

**Arguments**([*1*], [*2*]):

1. [*socket*]:
    - The socket instance
2. [*user*] - (***optional***):
    - An object containing any initial properties to set on the user

**Returns**: [*null*]

**Example**:
```js
session.connect(socket, {
  name: 'Don',
  location: 'Vancouver'
});
```

**Full example**:
```js
const io = require('socket.io');
const session = require('session-socket');

io.on('connection', (socket) => {
  session.connect(socket);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
```

***
## session.disconnect([*socket*]):
This method disconnects a socket instance from the library. Call it from within your disconnect handler.

It is the shorthand way of calling `session.connections.disconnect()`.

- This method takes 1 parameter.

**Arguments**([*1*]):

1. [*socket*]:
    - The socket instance

**Returns**: [*null*]

**Example**:
```js
session.disconnect(socket);
```

**Full example**:
```js
const io = require('socket.io');
const session = require('session-socket');

io.on('connection', (socket) => {
  session.connect(socket);

  socket.on('disconnect', () => {
    session.disconnect(socket);
    console.log(`User disconnected: ${socket.id}`);
  });
});
```

***
## session.get([*socket*]):
This method takes a socket object as a parameter and returns the corresponding user.

It is the shorthand way of calling `session.connections.get()`.

Add any additional properties you wish to set on the user to the object returned by this method.

- This method takes 1 parameter.

**Arguments**([*1*]):

1. [*socket*]:
    - The socket instance

**Returns**: [*obj*]
```js
// Default properties:
{
  rooms(),
  roomList(),
  joinRoom(),
  leaveRoom()
}
```

**Example**:
```js
session.get(socket);
```

**Full example**:
```js
const io = require('socket.io');
const session = require('session-socket');

io.on('connection', (socket) => {
  session.connect(socket);

  const user = session.get(socket);

  // Get an object of all joined rooms:
  user.rooms();

  // Get an array of all joined rooms:
  user.roomList();

  // Join a new room:
  user.joinRoom('chatroom1');

  // Leave a room:
  user.leaveRoom('chatroom1');

  socket.on('disconnect', () => {
    session.disconnect(socket);
    console.log(`User disconnected: ${socket.id}`);
  });
});
```

***
## session.addPlugin([*name*], [*plugin*]):
This method takes a name and either an object or function as parameters and stores it on the `session` object.

It's a convenience method that let's you write and store custom session/user related plugins for the library.  

- This method takes 2 parameters.

**Arguments**([*1*], [*2*]):

1. [*name*]:
    - The key to use for accessing your plugin
2. [*plugin*]
    - The object or function containing the code for your plugin

**Returns**: [*null*]

**Example**:
```js
session.addPlugin('getAndSetLocation', (userObj) => {
  // ... some code to figure out their location:
  const location = 'Vancouver';

  return userObj.location = location;
});
```

**Full example**:
```js
const io = require('socket.io');
const session = require('session-socket');

io.on('connection', (socket) => {
  session.connect(socket);

  session.addPlugin('getAndSetLocation', (userObj) => {
    // ... some code to figure out their location:
    const location = 'Vancouver';

    return userObj.location = location;
  });

  session.getAndSetLocation(session.get(socket));

  console.log(session.get(socket)) // { location: 'Vancouver' }

  socket.on('disconnect', () => {
    session.disconnect(socket);
    console.log(`User disconnected: ${socket.id}`);
  });
});
```

***
## Dependencies:
##### Soft dependency:
1. [**socket.io**](https://socket.io/)

## Author:
**[Dane Sirois](https://www.linkedin.com/in/dane-sirois/)**

## License:
**[MIT](https://opensource.org/licenses/MIT)**
