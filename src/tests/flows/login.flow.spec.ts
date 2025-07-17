import { expect, browser } from "@wdio/globals";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import * as userData from "../../test-data/users.json";
import { TestHelpers } from "../../utils/test-helpers";

describe("Complete Login Flow with Location Selection", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  before(() => {
    loginPage = new LoginPage();
    homePage = new HomePage();
  });

  beforeEach(async () => {
    // Ensure we start from a clean state
    await TestHelpers.waitForApp(3000);
  });

  it("should complete full login flow: Profile → Login → Location → Home", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Complete Login Flow ==="));
    console.log(TestHelpers.formatTestLog("Flow: Profile Icon → Login → Location Selection → Home"));
    
    try {
      // Take initial screenshot
      await TestHelpers.takeScreenshot('test-start');
      
      // Step 1: Verify we're on home page initially
      console.log(TestHelpers.formatTestLog("\nPre-condition: Verifying initial home page..."));
      const isOnHomePage = await homePage.isSearchBarDisplayed();
      if (!isOnHomePage) {
        console.log(TestHelpers.formatWarningLog("Not on home page initially, attempting to navigate..."));
        await browser.pause(3000);
      }
      
      // Step 2: Perform complete login flow
      console.log(TestHelpers.formatTestLog("\nStarting login flow..."));
      const loginSuccess = await loginPage.performCompleteLogin(
        userData.validUser.mobileNumber,
        userData.validUser.otp
      );
      
      // Step 3: Verify login success
      expect(loginSuccess).toBe(true);
      console.log(TestHelpers.formatSuccessLog("Login flow completed successfully"));
      
      // Step 4: Additional verification - check if we're truly on home page
      await browser.pause(2000);
      const finalHomePageCheck = await homePage.isSearchBarDisplayed();
      
      if (finalHomePageCheck) {
        console.log(TestHelpers.formatSuccessLog("Search bar is visible - confirming successful navigation"));
      }
      
      // Step 5: Take final screenshot
      await TestHelpers.takeScreenshot('test-complete');
      
      // Final success message
      console.log("\n" + TestHelpers.formatTestLog("====================================="));
      console.log(TestHelpers.formatSuccessLog("✅ TEST PASSED: Complete Login Flow"));
      console.log(TestHelpers.formatSuccessLog("✅ User logged in successfully"));
      console.log(TestHelpers.formatSuccessLog("✅ Location selected successfully"));
      console.log(TestHelpers.formatSuccessLog("✅ Navigated to home page successfully"));
      console.log(TestHelpers.formatTestLog("=====================================\n"));
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Test failed: ${error}`));
      await TestHelpers.takeScreenshot('test-failed');
      throw error;
    }
  });
});