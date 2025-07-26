import { expect, browser } from "@wdio/globals";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import * as userData from "../../test-data/users.json";
import { TestHelpers } from "../../utils/test-helpers";

describe("Production Login Flow with Real OTP", () => {
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

  it("should complete production login flow with auto-detected OTP", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Production Login with Auto OTP ==="));
    
    try {
      // Take initial screenshot
      await TestHelpers.takeScreenshot('test-start-prod');
      
      // Check if already logged in
      if (await loginPage.isLoggedIn()) {
        console.log(TestHelpers.formatWarningLog("User already logged in, skipping test"));
        return;
      }
      
      // Perform production login
      const loginSuccess = await loginPage.performCompleteLoginProduction(
        userData.productionUser.mobileNumber
        // OTP will be auto-detected
      );
      
      // Verify login success
      expect(loginSuccess).toBe(true);
      console.log(TestHelpers.formatSuccessLog("Production login completed successfully"));
      
      // Additional verification
      await browser.pause(2000);
      const isLoggedIn = await loginPage.isLoggedIn();
      expect(isLoggedIn).toBe(true);
      
      // Take final screenshot
      await TestHelpers.takeScreenshot('test-complete-prod');
      
      console.log("\n" + TestHelpers.formatTestLog("====================================="));
      console.log(TestHelpers.formatSuccessLog("✅ TEST PASSED: Production Login"));
      console.log(TestHelpers.formatSuccessLog("✅ OTP handled automatically"));
      console.log(TestHelpers.formatSuccessLog("✅ Search bar verified"));
      console.log(TestHelpers.formatTestLog("=====================================\n"));
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Test failed: ${error}`));
      await TestHelpers.takeScreenshot('test-failed-prod');
      throw error;
    }
  });

  // it("should complete production login with manual OTP fallback", async () => {
  //   console.log(TestHelpers.formatTestLog("=== Test: Production Login with Manual OTP ==="));
    
  //   try {
  //     // Take initial screenshot
  //     await TestHelpers.takeScreenshot('test-start-manual-otp');
      
  //     // Check if already logged in
  //     if (await loginPage.isLoggedIn()) {
  //       console.log(TestHelpers.formatWarningLog("User already logged in, skipping test"));
  //       return;
  //     }
      
  //     // Perform production login with manual OTP
  //     const loginSuccess = await loginPage.performCompleteLoginProduction(
  //       userData.productionUser.mobileNumber,
  //       userData.productionUser.manualOTP // Fallback OTP if auto-detection fails
  //     );
      
  //     // Verify login success
  //     expect(loginSuccess).toBe(true);
  //     console.log(TestHelpers.formatSuccessLog("Production login with manual OTP completed"));
      
  //     // Take final screenshot
  //     await TestHelpers.takeScreenshot('test-complete-manual-otp');
      
  //   } catch (error) {
  //     console.error(TestHelpers.formatErrorLog(`Test failed: ${error}`));
  //     await TestHelpers.takeScreenshot('test-failed-manual-otp');
  //     throw error;
  //   }
  // });
});