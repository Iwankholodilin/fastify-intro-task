import { generateToken, buildIdGenerator } from "../utils.js";

export default (app) => {
  const users = [];

  const generateId = buildIdGenerator();

  app.get("/users/new", (req, res) => res.view("src/views/users/new"));

  // BEGIN (write your solution here)
   app.post("/users", (req, res) => {
    const { email, firstName, lastName } = req.body;
    
    const newUser = {
      id: generateId(),
      email,
      firstName,
      lastName,
      token: generateToken(),
    };
    
    users.push(newUser);
    
    res.setCookie('token', newUser.token);
    
    return res.redirect(`/users/${newUser.id}`);
  });
  
  app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);
    
    const token = req.cookies?.token;
    
    if (!user || user.token !== token) {
      return res.code(404).send('User not found');
    }
    
    return res.view("src/views/users/show", { user });
  });
  // END
};
