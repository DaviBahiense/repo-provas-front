describe("Auth", () => {
  it("Register", () => {
    cy.visit("http://localhost:3000/");

    cy.get("input[type=email]").type("user@email.com");
    cy.get("input[name=password").type("123");
    cy.get("input[name=passwordConfirmation").type("123");
    cy.get("button[type=submit]").click();

    cy.url().should("equal", "http://localhost:3000/login");
  });

  it("Login", () => {
    cy.get("input[name=email]").type("user@email.com");
    cy.get("input[name=password").type("123");
    cy.get("button[type=submit]").click();

    cy.url().should("equal", "http://localhost:3000/app/disciplinas");
  });
});
