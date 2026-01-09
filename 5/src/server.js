import fastify from "fastify";
import view from "@fastify/view";
import pug from "pug";
import getUsers from "./utils.js";

export default async () => {
  const app = fastify();

  const users = getUsers();

  // BEGIN (write your solution here)
  app.get('/users', async (request, reply) => {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Users List</title>
      </head>
      <body>
        <h1>Users List</h1>
        <table border="1">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    users.forEach((user, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td><a href="/users/${user.id}">View</a></td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    reply.type('text/html');
    return html;
  });
  
  app.get('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return reply.code(404).send('User not found');
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Details</title>
      </head>
      <body>
        <h1>User Details</h1>
        <div>
          <p><strong>ID:</strong> ${user.id}</p>
          <p><strong>Username:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <a href="/users">Back to Users List</a>
        </div>
      </body>
      </html>
    `;
    
    reply.type('text/html');
    return html;
  });
  
  // END

  return app;
};
