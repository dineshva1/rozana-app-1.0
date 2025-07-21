// src/tests/flows/home.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Home Page Flow - App Launch Verification", () => {
  let homePage: HomePage;

  before(() => {
    homePage = new HomePage();
  });

  it("should launch the app and verify search bar and location", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: App Launch Verification ==="));
    console.log(TestHelpers.formatTestLog("Verifying: Search Bar and Location"));
    
    // Wait for app to fully load
    await TestHelpers.waitForApp(5000);
    
    // Take initial screenshot
    await TestHelpers.takeScreenshot('app-initial-launch');
    
    // Wait for home page to load
    const pageLoaded = await homePage.waitForHomePageToLoad();
    expect(pageLoaded).toBe(true);
    
    // Verify required elements
    const elements = await homePage.verifyHomePageElements();
    
    // Take screenshot after elements check
    await TestHelpers.takeScreenshot('home-page-elements');
    
    // Assertions for each element
    console.log("\n" + TestHelpers.formatTestLog("=== Element Verification Results ==="));
    
    // 1. Search Bar
    if (elements.searchBar) {
      console.log(TestHelpers.formatSuccessLog("✓ Search Bar is displayed"));
    } else {
      console.log(TestHelpers.formatTestLog("✗ Search Bar NOT found"));
    }
    expect(elements.searchBar).toBe(true);
    
    // 2. Location
    if (elements.location) {
      console.log(TestHelpers.formatSuccessLog("✓ Location is displayed"));
      const locationText = await homePage.getLocationText();
      console.log(TestHelpers.formatTestLog(`  Location: ${locationText}`));
    } else {
      console.log(TestHelpers.formatTestLog("✗ Location NOT found"));
    }
    expect(elements.location).toBe(true);
    
    // Final verification
    const allElementsPresent = elements.searchBar && elements.location;
    
    if (allElementsPresent) {
      console.log("\n" + TestHelpers.formatSuccessLog("=== App Launch Verification Complete ==="));
      console.log(TestHelpers.formatSuccessLog("All required elements (Search Bar & Location) are present"));
    } else {
      console.log("\n" + TestHelpers.formatTestLog("=== App Launch Verification Failed ==="));
      console.log(TestHelpers.formatTestLog("Some required elements are missing"));
    }
    
    expect(allElementsPresent).toBe(true);
    
    // Take final screenshot
    await TestHelpers.takeScreenshot('app-launch-final');
  });
});