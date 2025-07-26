// src/tests/flows/shopping-without-login.flow.spec.ts

import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { ProductsPage } from "../../pages/products.page";
import { CartPage } from "../../pages/cart.page";
import { LoginPage } from "../../pages/login.page";
import { TestHelpers } from "../../utils/test-helpers";
import * as userData from "../../test-data/users.json";

describe("Shopping Flow Without Login", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let loginPage: LoginPage;

  before(() => {
    homePage = new HomePage();
    productsPage = new ProductsPage();
    cartPage = new CartPage();
    loginPage = new LoginPage();
  });

  it("should complete shopping flow with location change and login from cart", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Shopping Without Login + Location Change ==="));
    
    try {
      // PHASE 1: Handle Location Not Serving
      console.log("\n========== PHASE 1: Handle Location Not Serving ==========");
      
      // Step 1: Check initial location
      console.log("\nStep 1: Checking initial location...");
      await TestHelpers.waitForApp(3000);
      
      // Check if "Not Serving This Location" appears
      const notServingElement = await $('//*[contains(@text, "Not Serving This Location")]');
      const tryAnotherButton = await $('//android.widget.Button[@content-desc="Try Another Location"]');
      
      if (await notServingElement.isExisting() || await tryAnotherButton.isExisting()) {
        console.log("⚠️ Location not served - need to change location");
        await TestHelpers.takeScreenshot('01-location-not-served');
        
        // Click on current location widget or Try Another Location
        const currentLocationWidget = await $('//android.widget.ImageView[contains(@content-desc, "Current") and contains(@content-desc, "Deliver in")]');
        
        if (await currentLocationWidget.isExisting()) {
          await currentLocationWidget.click();
          console.log("✅ Clicked on current location widget");
        } else if (await tryAnotherButton.isExisting()) {
          await tryAnotherButton.click();
          console.log("✅ Clicked Try Another Location");
        }
        
        await TestHelpers.waitForApp(2000);
      }
      
      // Step 2: Search for Raebareli
      console.log("\nStep 2: Searching for Raebareli...");
      const searchInput = await $('//android.widget.EditText');
      
      if (await searchInput.isExisting()) {
        await searchInput.click();
        await browser.pause(500);
        await searchInput.clearValue();
        await browser.pause(500);
        await searchInput.setValue('raebareli');
        console.log("✅ Entered 'raebareli' in search");
        await TestHelpers.takeScreenshot('02-location-search');
        await browser.pause(2000);
        
        // Step 3: Click on first Raebareli suggestion
        console.log("\nStep 3: Selecting Raebareli from suggestions...");
        const raebareliButton = await $('//android.widget.Button[@content-desc="Raebareli, Uttar Pradesh, India"]');
        
        if (await raebareliButton.isExisting()) {
          await raebareliButton.click();
          console.log("✅ Selected 'Raebareli, Uttar Pradesh, India'");
        }
        
        await TestHelpers.waitForApp(3000);
        await TestHelpers.takeScreenshot('03-location-selected');
        
        // Step 4: Confirm Location
        console.log("\nStep 4: Confirming location...");
        const confirmButton = await $('//android.widget.Button[@content-desc="Confirm Location"]');
        
        if (await confirmButton.isExisting()) {
          await confirmButton.click();
          console.log("✅ Location confirmed");
          await TestHelpers.waitForApp(3000);
        }
      }
      
      // PHASE 2: Shop Without Login
      console.log("\n========== PHASE 2: Add Products Without Login ==========");
      
      // Step 5: Verify home page
      console.log("\nStep 5: Verifying home page...");
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✅ Home page displayed");
      await TestHelpers.takeScreenshot('04-home-page');
      
      // Step 6: Swipe up to find My Deals products
      console.log("\nStep 6: Swiping up to find products in My Deals...");
      
      // Multiple swipes to reach My Deals products
      for (let i = 1; i <= 3; i++) {
        console.log(`📱 Swipe ${i}: Looking for products`);
        await productsPage.swipeUp();
        await browser.pause(1500);
      }
      
      await TestHelpers.takeScreenshot('05-my-deals-visible');
      
      // Step 7: Add 5 products
      console.log("\nStep 7: Adding 5 products to cart...");
      let productsAdded = 0;
      
      for (let i = 0; i < 5; i++) {
        console.log(`\n➕ Adding product ${i + 1}/5`);
        
        const added = await productsPage.addProductByIndex(0);
        
        if (added) {
          productsAdded++;
          await browser.pause(1000);
          
          if (i < 4) {
            console.log("📱 Swiping for more products");
            await productsPage.swipeUp();
            await browser.pause(1500);
          }
        } else {
          console.log("⚠️ No more products found, swiping up");
          await productsPage.swipeUp();
          await browser.pause(1500);
          i--;
        }
      }
      
      console.log(`✅ Added ${productsAdded} products to cart`);
      expect(productsAdded).toBe(5);
      await TestHelpers.takeScreenshot('06-products-added');
      
      // Step 8: Click View Cart
      console.log("\nStep 8: Clicking View Cart...");
      const viewCartClicked = await productsPage.clickViewCart();
      expect(viewCartClicked).toBe(true);
      console.log("✅ View Cart clicked");
      await TestHelpers.waitForApp(3000);
      await TestHelpers.takeScreenshot('07-cart-opened');
      
      // PHASE 3: Login from Cart (Only up to OTP)
      console.log("\n========== PHASE 3: Login from Cart (OTP Only) ==========");
      
      // Step 9: Click Login to Proceed
      console.log("\nStep 9: Clicking Login to Proceed...");
      const loginButton = await $('//android.widget.Button[@content-desc="Login to Proceed"]');
      
      if (await loginButton.isExisting()) {
        await loginButton.click();
        console.log("✅ Login to Proceed clicked");
        await TestHelpers.waitForApp(3000);
        await TestHelpers.takeScreenshot('08-login-page');
        
        // Step 10: Perform login ONLY up to OTP entry
        console.log("\nStep 10: Performing login (OTP only)...");
        
        // Cancel Google Phone Picker if it appears
        await loginPage.cancelGooglePhonePicker();
        
        // Enter mobile number
        const mobileEntered = await loginPage.enterMobileNumber(userData.productionUser.mobileNumber);
        expect(mobileEntered).toBe(true);
        console.log("✅ Mobile number entered");
        
        // Click Send OTP
        const otpSent = await loginPage.clickSendOTP();
        expect(otpSent).toBe(true);
        console.log("✅ OTP sent");
        
        // Handle OTP (auto-fill or manual)
        const otpHandled = await loginPage.handleOTPProduction(userData.productionUser.manualOTP);
        expect(otpHandled).toBe(true);
        console.log("✅ OTP entered");
        
        // Wait for auto-redirect back to My Cart
        console.log("\n⏳ Waiting for redirect back to My Cart...");
        await TestHelpers.waitForApp(5000);
        await TestHelpers.takeScreenshot('09-back-to-cart');
      }
      
      // PHASE 4: Select Address and Place Order
      console.log("\n========== PHASE 4: Complete Order ==========");
      
      // Step 11: Click Select Address
      console.log("\nStep 11: Clicking Select Address...");
      const selectAddressButton = await $('//android.widget.Button[@content-desc="Select Address"]');
      
      // Wait for Select Address button to appear
      let addressButtonFound = false;
      for (let i = 0; i < 5; i++) {
        if (await selectAddressButton.isExisting()) {
          addressButtonFound = true;
          break;
        }
        console.log(`⏳ Waiting for Select Address button... (${i + 1}/5)`);
        await browser.pause(1000);
      }
      
      if (addressButtonFound) {
        await selectAddressButton.click();
        console.log("✅ Select Address clicked");
        await TestHelpers.waitForApp(2000);
        await TestHelpers.takeScreenshot('10-address-selection');
        
        // Select HOME address
        console.log("\nSelecting HOME address...");
        const homeAddressSelectors = [
          '//android.view.View[@content-desc="HOME\nBKT, Bargadi Magath, Uttar Pradesh, 226201"]',
          '//android.view.View[contains(@content-desc, "HOME") and contains(@content-desc, "Bargadi Magath")]',
          '//android.view.View[contains(@content-desc, "HOME") and contains(@content-desc, "226201")]'
        ];
        
        let addressSelected = false;
        for (const selector of homeAddressSelectors) {
          const homeAddress = await $(selector);
          if (await homeAddress.isExisting()) {
            await homeAddress.click();
            console.log("✅ HOME address selected");
            addressSelected = true;
            break;
          }
        }
        
        expect(addressSelected).toBe(true);
        await TestHelpers.waitForApp(2000);
      }
      
      // Step 12: Place Order
      console.log("\nStep 12: Placing order...");
      await TestHelpers.takeScreenshot('11-before-place-order');
      
      const placeOrderButton = await $('//android.widget.Button[@content-desc="Place Order"]');
      
      // Wait for Place Order button
      let placeOrderFound = false;
      for (let i = 0; i < 5; i++) {
        if (await placeOrderButton.isExisting()) {
          placeOrderFound = true;
          break;
        }
        console.log(`⏳ Waiting for Place Order button... (${i + 1}/5)`);
        await browser.pause(1000);
      }
      
      if (placeOrderFound) {
        await placeOrderButton.click();
        console.log("✅ Place Order clicked");
        await TestHelpers.waitForApp(3000);
      }
      
      // Step 13: Handle Order Success
      console.log("\nStep 13: Waiting for order confirmation...");
      const continueShoppingButton = await $('//android.widget.Button[@content-desc="Continue Shopping"]');
      
      // Wait for order success
      let orderSuccess = false;
      for (let i = 0; i < 10; i++) {
        if (await continueShoppingButton.isExisting()) {
          console.log("✅ Order placed successfully!");
          await TestHelpers.takeScreenshot('12-order-success');
          orderSuccess = true;
          break;
        }
        console.log(`⏳ Waiting for confirmation... (${i + 1}/10)`);
        await browser.pause(1000);
      }
      
      expect(orderSuccess).toBe(true);
      
      // Click Continue Shopping
      await continueShoppingButton.click();
      console.log("✅ Continue Shopping clicked");
      await TestHelpers.waitForApp(3000);
      
      // Step 14: Verify home page
      console.log("\nStep 14: Verifying return to home page...");
      const isBackHome = await homePage.isHomePageDisplayed();
      expect(isBackHome).toBe(true);
      console.log("✅ Successfully returned to home page");
      await TestHelpers.takeScreenshot('13-final-home');
      
      // Test Summary
      console.log(TestHelpers.formatSuccessLog("\n🎉 Shopping without login flow completed! 🎉"));
      console.log("\n📋 Test Summary:");
      console.log("✅ Changed location to Raebareli");
      console.log("✅ Added 5 products without login");
      console.log("✅ Clicked View Cart → Login to Proceed");
      console.log("✅ Entered mobile number and OTP only");
      console.log("✅ Auto-redirected back to My Cart");
      console.log("✅ Selected HOME address");
      console.log("✅ Placed order successfully");
      console.log("✅ Returned to home page");
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Test failed: ${error}`));
      await TestHelpers.takeScreenshot('error-final');
      throw error;
    }
  });
});