const { test } = require("@playwright/test");
const { LandingPage } = require("../pages/LandingPage");
const { Toast } = require("../pages/Components");

let landingPage;
let toast

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  toast = new Toast(page)
});

test("Cadastro do Lead na fila de espera com sucesso", async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("Samuel", "samuel@gmail.com");

  const message =
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!";

    await toast.haveText(message);
});

test("Não deve cadastrar com e-mail incorreto", async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("Samuel", "samuel.com");

  await landingPage.alertHaveText("Email incorreto");
});

test("Não deve cadastrar campo nome vazio", async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("", "samuel@gmail.com");

  await landingPage.alertHaveText("Campo obrigatório");
});

test("Não deve cadastrar campo e-mail vazio", async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("Samuel", "");

  await landingPage.alertHaveText("Campo obrigatório");
});

test("Não deve cadastrar com todos os campos vazios", async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("", "");

  await landingPage.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
