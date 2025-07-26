// src/tests/flows/profile.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { ProfilePage } from "../../pages/profile.page";
import { OrdersPage } from "../../pages/orders.page";
import { HomePage } from "../../pages/home.page";
import { LoginPage } from "../../pages/login.page";
import { TestHelpers } from "../../utils/test-helpers";
import * as userData from "../../test-data/users.json";

describe("Profile Flow", () => {
  let profilePage: ProfilePage;
  let ordersPage: OrdersPage;
  let homePage: HomePage;
  let loginPage: LoginPage;

  before(() => {
    profilePage = new ProfilePage();
    ordersPage = new OrdersPage();
    homePage = new HomePage();
    loginPage = new LoginPage();
  });

  it("should complete profile navigation and settings flow", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Complete Profile Flow ==="));
    
    try {
      // Pre-condition: Verify we're on home page
      console.log("\nPre-condition: Verifying home page...");
      await TestHelpers.waitForApp(2000);
      const isOnHomePage = await homePage.isHomePageDisplayed();
      expect(isOnHomePage).toBe(true);
      console.log(TestHelpers.formatSuccessLog("Home page verified"));
      await TestHelpers.takeScreenshot('home-page-initial');
      
      // Step 1: Navigate to Profile
      console.log("\nStep 1: Navigating to Profile tab...");
      const navigatedToProfile = await profilePage.navigateToProfile();
      expect(navigatedToProfile).toBe(true);
      
      // Verify profile page is displayed
      const isProfileDisplayed = await profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).toBe(true);
      console.log(TestHelpers.formatSuccessLog("Profile page displayed"));
      await TestHelpers.takeScreenshot('profile-page');
      
      // Step 2: Access Your Orders
      console.log("\nStep 2: Accessing Your Orders...");
      await profilePage.clickYourOrders();
      await TestHelpers.waitForApp(2000);
      await TestHelpers.takeScreenshot('orders-page');
      
      // Step 3: Click on first order
      console.log("\nStep 3: Clicking on first order...");
      const orderClicked = await ordersPage.clickFirstOrder();
      expect(orderClicked).toBe(true);
      console.log(TestHelpers.formatSuccessLog("First order opened"));
      await TestHelpers.takeScreenshot('order-details');
      
      // Step 4: Swipe up and go back
      console.log("\nStep 4: Scrolling through order details...");
      await ordersPage.scrollToBottomOfOrderDetails();
      await ordersPage.goBack();
      console.log(TestHelpers.formatSuccessLog("Returned to orders list"));
      
      // Step 5: Navigate through all tabs
      console.log("\nStep 5: Navigating through all order tabs...");
      await ordersPage.navigateThroughAllTabs();
      console.log(TestHelpers.formatSuccessLog("Completed navigation through all order tabs"));
      
      // Step 6: Go back to Home (from orders)
      console.log("\nStep 6: Going back to Home...");
      await ordersPage.goBack();
      await TestHelpers.waitForApp(2000);
      
      // Navigate to Profile again
      console.log("\nNavigating back to Profile...");
      await profilePage.navigateToProfile();
      await TestHelpers.waitForApp(1000);
      
      // Step 7: Access Saved Addresses
      console.log("\nStep 7: Accessing Saved Addresses...");
      await profilePage.clickSavedAddresses();
      await TestHelpers.takeScreenshot('saved-addresses');
      console.log(TestHelpers.formatSuccessLog("Saved addresses displayed"));
      
      // Go back to profile
      await profilePage.goBackFromAddresses();
      await TestHelpers.waitForApp(1000);
      
      // Step 8: Edit Profile
  console.log("\nStep 8: Editing Profile...");
  await profilePage.clickProfile();
  await TestHelpers.takeScreenshot('edit-profile-page');

  // Option 1: Update with specific values
  const profileUpdated = await profilePage.updateProfileDetails('TestUser', 'testuser123@example.com');

  // Option 2: Update with random values
  // const profileUpdated = await profilePage.updateProfileWithRandomData();

  expect(profileUpdated).toBe(true);
  console.log(TestHelpers.formatSuccessLog("Profile updated successfully"));
  await TestHelpers.takeScreenshot('profile-updated');
      
      
      // // Step 9: Language change flow
      // console.log("\nStep 9: Language change flow...");
      
      // // Scroll to find language option
      // const foundLanguage = await profilePage.scrollToLanguageOption();
      // expect(foundLanguage).toBe(true);
      // await TestHelpers.takeScreenshot('language-option-visible');
      
      // // Change to Hindi
      // console.log("\n--- Changing language to Hindi ---");
      // await profilePage.changeLanguage('Hindi');
      // console.log(TestHelpers.formatSuccessLog("Language changed to Hindi"));
      
      // // Wait for UI to stabilize
      // await browser.pause(2000);
      
      // // Change back to English
      // console.log("\n--- Changing language back to English ---");
      // await profilePage.scrollToLanguageOption();
      // await profilePage.changeLanguage('English');
      // console.log(TestHelpers.formatSuccessLog("Language changed back to English"));
      
      // Step 10: Logout
      console.log("\nStep 10: Logging out...");
      await profilePage.scrollToBottom();
      const loggedOut = await profilePage.logout();
      expect(loggedOut).toBe(true);
      console.log(TestHelpers.formatSuccessLog("Logged out successfully"));
      await TestHelpers.takeScreenshot('logged-out');
      
      // Step 11: Login flow
      console.log("\nStep 11: Performing login flow...");
      const loginSuccess = await loginPage.performCompleteLoginProduction(
        userData.productionUser.mobileNumber
      );
      expect(loginSuccess).toBe(true);
      console.log(TestHelpers.formatSuccessLog("Logged in successfully"));
      
      console.log(TestHelpers.formatSuccessLog("\n=== Profile flow completed successfully ===\n"));
      await TestHelpers.takeScreenshot('profile-flow-complete');
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Profile flow test failed: ${error}`));
      await TestHelpers.takeScreenshot('profile-flow-error');
      throw error;
    }
  });
});