import _ from "lodash";
import fastify from "fastify";
import getUsers from "./utils.js";

export default () => {
  const app = fastify();

  const users = getUsers();

  // BEGIN (write your solution here)
  app.get('/users', async (request, reply) => {
    const page = parseInt(request.query.page) || 1;
    const per = parseInt(request.query.per) || 5;
    
    const offset = (page - 1) * per;
    
    const paginatedUsers = users.slice(offset, offset + per);
    
    return paginatedUsers;
  });
  // END

  return app;
};
