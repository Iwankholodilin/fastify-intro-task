import fastify from "fastify";
import view from "@fastify/view";
import pug from "pug";
import formbody from "@fastify/formbody";
import yup from "yup";
import { generateId } from "./utils.js";

export default async () => {
  const app = fastify();

  const articles = [];

  await app.register(view, { engine: { pug } });
  await app.register(formbody);

  app.get("/", (req, res) => res.view("src/views/index"));

  app.get("/articles", (req, res) => {
    res.view("src/views/articles/index", { articles });
  });

  // BEGIN (write your solution here)
  app.get("/articles/new", (req, res) => {
  return res.view("src/views/articles/new", { 
    errors: [],
    formData: {}
  });
});

app.post("/articles", async (req, res) => {
  const { title, text } = req.body;
  const formData = { title, text };
  
  const errors = [];
  
  if (!title || title.trim().length < 2) {
    errors.push({ field: 'title', message: 'Название не должно быть короче двух символов' });
  }
  
  if (!text || text.trim().length < 10) {
    errors.push({ field: 'text', message: 'Статья должна быть не короче 10 символов' });
  }
  
  if (title && title.trim().length >= 2) {
    const normalizedTitle = title.trim();
    const existingArticle = articles.find(article => 
      article.title.toLowerCase() === normalizedTitle.toLowerCase()
    );
    if (existingArticle) {
      errors.push({ field: 'title', message: 'Статья с таким названием уже существует' });
    }
  }
  
  if (errors.length > 0) {
    return res.view("src/views/articles/new", { 
      errors, 
      formData 
    });
  }
  
  const article = {
    id: generateId(),
    title: title.trim(),
    text: text.trim()
  };
  
  articles.push(article);
  
  return res.redirect("/articles");
});
  // END

  app.get("/articles/:id", (req, res) => {
    const article = articles.find(({ id }) => id === req.params.id);

    if (!article) {
      return res.status(404).send("article not found");
    }

    return res.view("src/views/articles/show", { article });
  });

  return app;
};
