import { expect, test, type Page, type Route } from "@playwright/test";

type MembershipApplicationRequest = {
  department: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  otherClub: string;
  bankName: string;
  iban: string;
  bic: string;
  accountHolder: string;
  place: string;
  applicationDate: string;
  legalGuardianName: string;
  acceptsStatutes: boolean;
  acceptsEmailInvitation: boolean;
  acceptsPrivacyPolicy: boolean;
  confirmsMinorAttachment: boolean;
};

async function stubAppBootstrap(route: Route): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ member: [], totalItems: 0 }),
  });
}

async function preparePage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("cookie_consent", "rejected");
  });

  await page.route("**/api/**", async (route) => {
    if (route.request().url().includes("/api/membership-application")) {
      await route.fallback();
      return;
    }

    await stubAppBootstrap(route);
  });
}

async function gotoForm(page: Page, query = ""): Promise<void> {
  await page.goto(`/verein/aufnahmeantrag${query}`);
  await expect(page.getByRole("heading", { name: "Abteilung" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Aufnahmeantrag senden" })).toBeVisible();
}

async function selectDepartment(page: Page, name: string): Promise<void> {
  await page.locator("label", { hasText: name }).click();
}

async function fillAdultApplication(page: Page): Promise<void> {
  await selectDepartment(page, "Volleyball");
  await page.locator("#lastName").fill("Mustermann");
  await page.locator("#firstName").fill("Max");
  await page.locator("#birthDate").fill("1990-05-10");
  await page.locator("#phone").fill("0301234567");
  await page.locator("#street").fill("Musterstraße 1");
  await page.locator("#postalCode").fill("10115");
  await page.locator("#city").fill("Berlin");
  await page.locator("#email").fill("max@example.com");
  await page.locator("#bankName").fill("Musterbank");
  await page.locator("#accountHolder").fill("Max Mustermann");
  await page.locator("#iban").fill("de44 5001 0517 5407 3249 31");
  await page.locator("#bic").fill("testdeffxxx");
  await page.locator("#place").fill("Berlin");
  await page.getByLabel("Ich habe die Vereinssatzung und Beitragsordnung zur Kenntnis genommen. *").check();
  await page.getByLabel("Ich willige in die Verarbeitung und Speicherung personenbezogener Daten nach DSGVO ein. *").check();
  await page.getByLabel("Ich bestätige, dass dieses Formular auch ohne Unterschrift gültig ist.").check();
}

test.beforeEach(async ({ page }) => {
  await preparePage(page);
});

test("übernimmt die Abteilung aus dem Query-Parameter", async ({ page }) => {
  await gotoForm(page, "?abteilung=badminton");

  await expect(page.getByLabel("Badminton")).toBeChecked();
});

test("zeigt für Minderjährige zusätzliche Pflichtfelder an", async ({ page }) => {
  await gotoForm(page);

  await selectDepartment(page, "Badminton");
  await page.locator("#birthDate").fill("2012-05-10");
  await page.getByLabel("Ich bestätige, dass dieses Formular auch ohne Unterschrift gültig ist.").check();
  await page.getByRole("button", { name: "Aufnahmeantrag senden" }).click();

  await expect(page.getByText("Für Minderjährige gelten zusätzliche Hinweise zur Aufsichtspflicht.")).toBeVisible();
  await expect(page.getByLabel("Gesetzliche VertreterIn *")).toBeVisible();
  await expect(
    page.getByLabel("Ich habe den Hinweis zur Aufsichtspflicht für Minderjährige zur Kenntnis genommen. *"),
  ).toBeVisible();
});

test("sendet den Aufnahmeantrag erfolgreich ab und zeigt den PDF-Link an", async ({ page }) => {
  let requestBody: MembershipApplicationRequest | null = null;

  await page.route("**/api/membership-application", async (route) => {
    requestBody = route.request().postDataJSON() as MembershipApplicationRequest;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ pdfUrl: "https://example.com/antrag.pdf" }),
    });
  });

  await gotoForm(page);
  await fillAdultApplication(page);
  await page.getByRole("button", { name: "Aufnahmeantrag senden" }).click();

  await expect(page.getByText("Der Aufnahmeantrag wurde erfolgreich versendet.")).toBeVisible();
  await expect(page.getByRole("link", { name: "PDF zum Aufnahmeantrag öffnen" })).toHaveAttribute(
    "href",
    "https://example.com/antrag.pdf",
  );

  expect(requestBody).not.toBeNull();
  expect(requestBody).toMatchObject({
    department: "volleyball",
    firstName: "Max",
    lastName: "Mustermann",
    iban: "DE44500105175407324931",
    bic: "TESTDEFFXXX",
    acceptsStatutes: true,
    acceptsPrivacyPolicy: true,
    confirmsMinorAttachment: false,
  });
});

test("zeigt API-Fehler aus dem Backend an", async ({ page }) => {
  await page.route("**/api/membership-application", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ message: "Die IBAN ist ungültig." }),
    });
  });

  await gotoForm(page);
  await fillAdultApplication(page);
  await page.getByRole("button", { name: "Aufnahmeantrag senden" }).click();

  await expect(page.getByRole("alert")).toContainText("Die IBAN ist ungültig.");
});
