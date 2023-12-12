const { test } = require("@playwright/test");

const { LoginPage } = require("../pages/LoginPage");
const { MoviesPage } = require("../pages/MoviesPage");
const { Toast } = require("../pages/Components");

let loginPage;
let moviesPage
let toast;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  moviesPage = new MoviesPage(page)
  toast = new Toast(page);
});

test("Efetuar login como administrador", async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit("admin@zombieplus.com", "pwd123");
  await moviesPage.isLoggedIn();
});

test("Não deve efetuar login com senha inválida", async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit("admin@zombieplus.com", "123456");

  const message =
    "Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.";

  await toast.haveText(message);
});

test("Não deve efetuar login com e-mail inválido", async ({ page }) => {
    await loginPage.visit();
    await loginPage.submit("adminzombieplus.com", "pwd123");
    await loginPage.alertHaveText("Email incorreto");
  });

test("Não deve efetuar login campo e-mail vazio", async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit("", "123456");
  await loginPage.alertHaveText("Campo obrigatório");
});

test("Não deve efetuar login campo senha vazio", async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit("admin@zombieplus.com", "");
  await loginPage.alertHaveText("Campo obrigatório");
});

test("Não deve efetuar login todos campos vazios", async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit("", "");
  await loginPage.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
