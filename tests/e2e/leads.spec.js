const { test, expect } = require("../support");
const { faker } = require("@faker-js/faker");
const { executeSQL } = require("../support/dataBase");

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM leads`);
});

test("Cadastro do Lead na fila de espera com sucesso", async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message =
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.";

  await page.popup.haveText(message);
});

test("Não deve cadastrar email com duplicidade", async ({ page, request }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  const newLead = await request.post("http://localhost:3333/leads", {
    data: {
      name: leadName,
      email: leadEmail,
    },
  });

  expect(newLead.ok()).toBeTruthy();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message =
    "Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.";

  await page.popup.haveText(message);
});

test("Não deve cadastrar com e-mail incorreto", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("Samuel", "samuel.com");

  await page.leads.alertHaveText("Email incorreto");
});

test("Não deve cadastrar campo nome vazio", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("", "samuel@gmail.com");

  await page.leads.alertHaveText("Campo obrigatório");
});

test("Não deve cadastrar campo e-mail vazio", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("Samuel", "");

  await page.leads.alertHaveText("Campo obrigatório");
});

test("Não deve cadastrar com todos os campos vazios", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("", "");

  await page.leads.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
