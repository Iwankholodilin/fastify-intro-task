import fastify from "fastify";
import getCompanies from "./utils.js";

export default () => {
  const app = fastify();

  const companies = getCompanies();

  // BEGIN (write your solution here)
  app.get('/companies/:id', async (request, reply) => {
    const { id } = request.params;
    
    const company = companies.find(c => c.id === id);
    
    if (!company) {
      return reply.code(404).send('Company not found');
    }
    
    return company;
  });
  // END

  return app;
};
