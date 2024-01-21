const { test, expect } = require("../support");

const data = require("../support/fixtures/movies.json");

const { executeSQL } = require("../support/dataBase");

test.beforeAll(async ()=>{
  await executeSQL(`DELETE FROM movies`);
})

test("Validar cadastro de um novo filme", async ({ page }) => {
  const movie = data.create;

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.toast.containText("Cadastro realizado com sucesso!");
});

test("Validar cadastro de duplicidade de título do filme", async ({ page, request }) => {
  const movie = data.duplicate;
  await request.api.postMovie(movie)
  
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.toast.containText("Oops!Este conteúdo já encontra-se cadastrado no catálogo");
});

test("Validar obrigatoriedade ao cadastrar filme", async ({ page }) => {
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.goForm();
  await page.movies.submit();

  await page.movies.alertHaveText([
    "Por favor, informe o título.",
    "Por favor, informe a sinopse.",
    "Por favor, informe a empresa distribuidora.",
    "Por favor, informe o ano de lançamento.",
  ]);
});
