import fastify from "fastify";
import view from "@fastify/view";
import pug from "pug";
import formbody from "@fastify/formbody";
import getUsers, { generateId, crypto } from "./utils.js";

export default async () => {
  const app = fastify();

  const users = getUsers();

  await app.register(view, { engine: { pug } });
  await app.register(formbody);

  app.get("/", (req, res) => res.view("src/views/index"));

  app.get("/users", (req, res) => {
    const { term } = req.query;
    let currentUsers = users;

    if (term) {
      currentUsers = users.filter((user) =>
        user.username.toLowerCase().includes(term.toLowerCase())
      );
    }
    res.view("src/views/users/index", { users: currentUsers });
  });

  // BEGIN (write your solution here)
  app.get("/users/new", (req, res) => {
  return res.view("src/views/users/new");
});

app.post("/users", (req, res) => {
  const { username, email, password } = req.body;
  
  const passwordConfirm = req.body.passwordConfirm;
  if (passwordConfirm && password !== passwordConfirm) {
    return res.status(422).send("Passwords do not match");
  }
  
  const normalizedUsername = (username || '').trim();
  const normalizedEmail = (email || '').trim().toLowerCase();
  
  const newUser = {
    id: generateId(),
    username: normalizedUsername,
    email: normalizedEmail,
    password: crypto(password || '')
  };
  
  users.push(newUser);
  
  return res.redirect("/users");
});
  // END

  app.get("/users/:id", (req, res) => {
    const user = users.find(({ id }) => id === req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.view("src/views/users/show", { user });
  });

  return app;
};
