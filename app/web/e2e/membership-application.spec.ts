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
  acceptsStatutes: boolean;
  acceptsEmailInvitation: boolean;
  acceptsPrivacyPolicy: boolean;
  place: string;
  applicationDate: string;
  bankName: string;
  iban: string;
  bic: string;
  accountHolder: string;
  legalGuardianName: string;
  confirmsMinorAttachment: boolean;
  isChild: boolean;
  guardianOneName: string;
  guardianOneAddress: string;
  guardianOnePhone: string;
  guardianTwoName: string;
  guardianTwoAddress: string;
  guardianTwoPhone: string;
  underTwelveMayWalkHomeAlone: boolean | null;
  overTwelveMayWalkHomeAlone: boolean | null;
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
  await page.locator("#street").fill("Musterstraße 1");
  await page.locator("#postalCode").fill("10115");
  await page.locator("#city").fill("Berlin");
  await page.locator("#phone").fill("0301234567");
  await page.locator("#email").fill("max@example.com");
  await page.locator("#bankName").fill("Musterbank");
  await page.locator("#accountHolder").fill("Max Mustermann");
  await page.locator("#iban").fill("de44 5001 0517 5407 3249 31");
  await page.locator("#bic").fill("testdeffxxx");
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

test("zeigt für Kinder zusätzliche Felder zur Aufsichtspflicht an", async ({ page }) => {
  await gotoForm(page);

  await page.getByLabel("Es handelt sich bei der antragstellenden Person um ein Kind.").check();

  await expect(page.getByRole("heading", { name: "Erziehungsberechtigte Person 1" })).toBeVisible();
  await expect(
    page.getByText("Bitte ergänze die Angaben aus der Erklärung zur Aufsichtspflicht."),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Sofern unser/mein Kind das 12. Lebensjahr noch nicht vollendet hat, verpflichten",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Sofern unser/mein Kind das 12. Lebensjahr vollendet hat, darf es nach dem regulären",
    ),
  ).toBeVisible();
  await expect(page.locator('input[name="underTwelveMayWalkHomeAlone"]')).toHaveCount(2);
  await expect(page.locator('input[name="overTwelveMayWalkHomeAlone"]')).toHaveCount(2);
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
    city: "Berlin",
    place: "Berlin",
    iban: "DE44500105175407324931",
    bic: "TESTDEFFXXX",
    acceptsStatutes: true,
    acceptsPrivacyPolicy: true,
    confirmsMinorAttachment: false,
    isChild: false,
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
