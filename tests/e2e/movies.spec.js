const { test, expect } = require("../support");

const data = require("../support/fixtures/movies.json");

const { executeSQL } = require("../support/dataBase");

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM movies`);
});

test("Validar cadastro de um novo filme", async ({ page }) => {
  const movie = data.create;

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.popup.haveText(
    `O filme '${movie.title}' foi adicionado ao catálogo.`
  );
});

test("Validar exclusão de um filme", async ({ page, request }) => {
  const movie = data.to_remove;
  await request.api.postMovie(movie);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.remove(movie.title);
  await page.popup.haveText("Filme removido com sucesso.");
});

test("Validar cadastro de duplicidade de título do filme", async ({
  page,
  request,
}) => {
  const movie = data.duplicate;
  await request.api.postMovie(movie);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.popup.haveText(
    `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
  );
});

test("Validar obrigatoriedade ao cadastrar filme", async ({ page }) => {
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.goForm();
  await page.movies.submit();

  await page.movies.alertHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
  ]);
});

test("Validar consulta pelo termo Zumbi", async ({ page, request }) => {
  const films = data.search;

  films.data.forEach(async (m) => {
    await request.api.postMovie(m);
  })

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.search(films.input)
  await page.movies.tableHave(films.outputs)
});
