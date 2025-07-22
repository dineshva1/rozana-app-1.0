// src/tests/flows/home.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Home Page Flow - App Launch Verification", () => {
  let homePage: HomePage;

  before(() => {
    homePage = new HomePage();
  });

  it("should launch the app and verify home page", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: App Launch Verification ==="));
    
    // Wait for app to fully load
    await TestHelpers.waitForApp(3000); // Reduced wait time
    
    // Take initial screenshot
    await TestHelpers.takeScreenshot('app-initial-launch');
    
    // Wait for home page to load (optimized)
    const startTime = Date.now();
    const pageLoaded = await homePage.waitForHomePageToLoad();
    const loadTime = Date.now() - startTime;
    
    console.log(TestHelpers.formatTestLog(`Home page load time: ${loadTime}ms`));
    
    // Quick assertion
    expect(pageLoaded).toBe(true);
    
    // Verify home page is displayed (should be instant now)
    const isHomePageDisplayed = await homePage.verifyHomePage();
    expect(isHomePageDisplayed).toBe(true);
    
    // Log success
    console.log("\n" + TestHelpers.formatSuccessLog("=== App Launch Verification Complete ==="));
    console.log(TestHelpers.formatSuccessLog("✓ Home page successfully loaded"));
    
    // Optional: Check which elements are available (only for debugging)
    if (process.env.DEBUG) {
      const elements = await homePage.getAvailableHomeElements();
      console.log("\nAvailable elements:", elements);
    }
    
    // Take final screenshot
    await TestHelpers.takeScreenshot('home-page-verified');
  });
});