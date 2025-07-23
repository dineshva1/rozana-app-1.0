// src/tests/flows/categories.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { CategoriesPage } from "../../pages/categories.page";
import { CartPage } from "../../pages/cart.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Complete Shopping Flow - Categories to Order", () => {
  let homePage: HomePage;
  let categoriesPage: CategoriesPage;
  let cartPage: CartPage;

  before(() => {
    homePage = new HomePage();
    categoriesPage = new CategoriesPage();
    cartPage = new CartPage();
  });

  it("should complete full shopping flow from categories to order placement", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Complete Shopping Flow ==="));
    
    try {
      // Step 1: Ensure we're on home page
      console.log("\n📱 Step 1: Starting from home page...");
      await TestHelpers.waitForApp(3000);
      
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✅ Home page confirmed");
      
      // Step 1.5: Ensure categories tab is visible
      console.log("\n🔍 Step 1.5: Ensuring categories tab is visible...");
      
      const categoriesTabSelector = '//android.widget.ImageView[@content-desc="Categories\nTab 2 of 4"]';
      let categoriesTab = await $(categoriesTabSelector);
      let isTabVisible = await categoriesTab.isDisplayed();
      
      if (!isTabVisible) {
        console.log("⚠️ Categories tab not visible, swiping down to reveal it...");
        
        // Try swiping down up to 5 times to reveal the bottom navigation
        for (let i = 0; i < 5; i++) {
          await browser.execute("mobile: swipeGesture", {
            left: 200,
            top: 600,
            width: 200,
            height: 400,
            direction: "down",
            percent: 0.75
          });
          
          await TestHelpers.waitForApp(1000);
          
          // Check if tab is now visible
          categoriesTab = await $(categoriesTabSelector);
          isTabVisible = await categoriesTab.isDisplayed();
          
          if (isTabVisible) {
            console.log(`✅ Categories tab visible after ${i + 1} swipe(s)`);
            break;
          }
        }
        
        // If still not visible, try alternative approach
        if (!isTabVisible) {
          console.log("⚠️ Trying alternative: Scroll to top of page");
          
          // Try scrolling to the very top
          await browser.execute("mobile: swipeGesture", {
            left: 200,
            top: 800,
            width: 200,
            height: 600,
            direction: "down",
            percent: 1.0
          });
          
          await TestHelpers.waitForApp(1500);
          
          categoriesTab = await $(categoriesTabSelector);
          isTabVisible = await categoriesTab.isDisplayed();
        }
        
        // Final check
        if (!isTabVisible) {
          // If cart banner is blocking, try dismissing it
          const viewCartButton = await $('//android.widget.Button[@text="View Cart"]');
          if (await viewCartButton.isExisting()) {
            console.log("⚠️ Cart banner detected, attempting to dismiss...");
            
            // Try clicking outside the banner or pressing back
            await browser.back();
            await TestHelpers.waitForApp(1000);
            
            categoriesTab = await $(categoriesTabSelector);
            isTabVisible = await categoriesTab.isDisplayed();
          }
        }
      }
      
      // Verify tab is now visible
      expect(isTabVisible).toBe(true);
      console.log("✅ Categories tab is visible and accessible");
      
      // Add a small pause to ensure UI is stable
      await TestHelpers.waitForApp(1000);
      
      // Step 2: Navigate to categories and add products
      console.log("\n📦 Step 2: Shopping from categories...");
      const categoriesResult = await categoriesPage.testCategoriesFlowWithCheckout();
      
      expect(categoriesResult.productsAdded).toBeGreaterThan(0);
      console.log(`✅ Added ${categoriesResult.productsAdded} products from categories`);
      
      // Step 3: Complete checkout from cart
      if (categoriesResult.orderPlaced) {
        console.log("\n💳 Step 3: Completing checkout...");
        
        // Add a small wait to ensure cart page is fully loaded
        await TestHelpers.waitForApp(2000);
        
        // Verify we're on cart page before proceeding
        const isOnCart = await cartPage.isCartPageDisplayed();
        if (!isOnCart) {
          throw new Error("Not on cart page after clicking View Cart");
        }
        console.log("✅ Cart page confirmed");
        
        const checkoutResult = await cartPage.completeFullCheckoutFlow();
        
        expect(checkoutResult.orderPlaced).toBe(true);
        console.log("✅ Order placed successfully!");
        console.log(`   - Order ID: ${checkoutResult.orderId || 'N/A'}`);
        console.log(`   - Order Total: ${checkoutResult.orderTotal || 'N/A'}`);
        
        // Step 4: Verify we're back on home page
        console.log("\n🏠 Step 4: Verifying return to home page...");
        await TestHelpers.waitForApp(2000);
        
        const isBackHome = await homePage.isHomePageDisplayed();
        
        // If not on home page, try additional navigation
        if (!isBackHome) {
          console.log("⚠️ Not on home page yet, attempting navigation...");
          await browser.back();
          await TestHelpers.waitForApp(2000);
          
          const isBackHomeRetry = await homePage.isHomePageDisplayed();
          expect(isBackHomeRetry).toBe(true);
        } else {
          expect(isBackHome).toBe(true);
        }
        
        console.log("✅ Successfully returned to home page");
      } else {
        throw new Error("Failed to navigate to cart from categories");
      }
      
      await TestHelpers.takeScreenshot('complete-flow-success');
      
      console.log(TestHelpers.formatSuccessLog("Complete shopping flow test passed!"));
      console.log("\n📊 === TEST SUMMARY ===");
      console.log("✅ Categories tab made visible: SUCCESS");
      console.log("✅ Categories shopping: SUCCESS");
      console.log("✅ View Cart clicked: SUCCESS");
      console.log("✅ Address changed: SUCCESS");
      console.log("✅ Order placed: SUCCESS");
      console.log("✅ Order details viewed: SUCCESS");
      console.log("✅ Returned to home: SUCCESS");
      console.log("======================\n");
      
      // Add extra pause to ensure stability
      await TestHelpers.waitForApp(2000);
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Complete flow test failed: ${error}`));
      await TestHelpers.takeScreenshot('complete-flow-error');
      
      // Enhanced recovery logic
      try {
        console.log("🔧 Attempting to recover and navigate to home...");
        
        // First, check current state
        const currentlyOnHome = await homePage.isHomePageDisplayed();
        if (currentlyOnHome) {
          console.log("✅ Already on home page");
        } else {
          // Try multiple recovery strategies
          console.log("Trying recovery strategy 1: Multiple back presses");
          for (let i = 0; i < 3; i++) {
            await browser.back();
            await TestHelpers.waitForApp(1000);
            
            const nowOnHome = await homePage.isHomePageDisplayed();
            if (nowOnHome) {
              console.log(`✅ Recovered to home page after ${i + 1} back presses`);
              break;
            }
          }
          
          // If still not on home, try clicking home tab
          const stillNotHome = !(await homePage.isHomePageDisplayed());
          if (stillNotHome) {
            console.log("Trying recovery strategy 2: Click home tab");
            const homeTabSelector = '//android.widget.ImageView[@content-desc="Home\nTab 1 of 4"]';
            const homeTab = await $(homeTabSelector);
            
            if (await homeTab.isExisting()) {
              await homeTab.click();
              await TestHelpers.waitForApp(2000);
              console.log("✅ Clicked home tab");
            }
          }
        }
        
        // Final verification
        const finalHomeCheck = await homePage.isHomePageDisplayed();
        console.log(`Recovery ${finalHomeCheck ? 'successful' : 'failed'} - Home page: ${finalHomeCheck}`);
        
      } catch (recoveryError) {
        console.log("❌ Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  });
});