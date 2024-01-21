const { test } = require("../support");

test("Efetuar login como administrador", async ({ page }) => {
  await page.login.visit();
  await page.login.submit("admin@zombieplus.com", "pwd123");
  await page.login.isLoggedIn("Admin");
});

test("Não deve efetuar login com senha inválida", async ({ page }) => {
  await page.login.visit();
  await page.login.submit("admin@zombieplus.com", "123456");

  const message =
    "Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.";

  await page.popup.haveText(message);
});

test("Não deve efetuar login com e-mail inválido", async ({ page }) => {
  await page.login.visit();
  await page.login.submit("adminzombieplus.com", "pwd123");
  await page.login.alertHaveText("Email incorreto");
});

test("Não deve efetuar login campo e-mail vazio", async ({ page }) => {
  await page.login.visit();
  await page.login.submit("", "123456");
  await page.login.alertHaveText("Campo obrigatório");
});

test("Não deve efetuar login campo senha vazio", async ({ page }) => {
  await page.login.visit();
  await page.login.submit("admin@zombieplus.com", "");
  await page.login.alertHaveText("Campo obrigatório");
});

test("Não deve efetuar login todos campos vazios", async ({ page }) => {
  await page.login.visit();
  await page.login.submit("", "");
  await page.login.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
