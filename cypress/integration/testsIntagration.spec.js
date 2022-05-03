import { faker } from "@faker-js/faker";

describe("Integration", () => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  it("Register", () => {
    cy.visit("http://localhost:3000/");

    cy.get("input[type=email]").type(email);
    cy.get("input[name=password").type(password);
    cy.get("input[name=passwordConfirmation").type(password);
    cy.get("button[type=submit]").click();

    cy.url().should("equal", "http://localhost:3000/login");
  });

  it("Login", () => {
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password").type(password);
    cy.get("button[type=submit]").click();

    cy.url().should("equal", "http://localhost:3000/app/disciplinas");
    cy.visit("http://localhost:3000/app/adicionar");
  });

  it("Create Test", () => {
    cy.get("input[name=name]").type("prova1");

    cy.get("input[name=pdfUrl").type("www.google.com");

    cy.get(".category").click();
    cy.get("li[data-option-index=0]").then((option) => {
      option[0].click();
    });

    cy.get(".discipline").click();
    cy.get("li[data-option-index=0]").then((option) => {
      option[0].click();
    });

    cy.get(".teacher").click();
    cy.get("li[data-option-index=0]").then((option) => {
      option[0].click();
    });

    cy.get("button[type=submit]").click();

    cy.get(".MuiAlert-standardSuccess");
  });
});
