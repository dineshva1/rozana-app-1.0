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
      
      // Step 2: Navigate to categories and add products
      console.log("\n📦 Step 2: Shopping from categories...");
      const categoriesResult = await categoriesPage.testCategoriesFlowWithCheckout();
      
      expect(categoriesResult.productsAdded).toBeGreaterThan(0);
      console.log(`✅ Added ${categoriesResult.productsAdded} products from categories`);
      
      // Step 3: Complete checkout from cart
      if (categoriesResult.orderPlaced) {
        console.log("\n💳 Step 3: Completing checkout...");
        const checkoutResult = await cartPage.completeFullCheckoutFlow();
        
        expect(checkoutResult.orderPlaced).toBe(true);
        console.log("✅ Order placed successfully!");
        console.log(`   - Order ID: ${checkoutResult.orderId || 'N/A'}`);
        console.log(`   - Order Total: ${checkoutResult.orderTotal || 'N/A'}`);
        
        // Step 4: Verify we're back on home page
        console.log("\n🏠 Step 4: Verifying return to home page...");
        await TestHelpers.waitForApp(2000);
        
        const isBackHome = await homePage.isHomePageDisplayed();
        expect(isBackHome).toBe(true);
        console.log("✅ Successfully returned to home page");
      } else {
        throw new Error("Failed to navigate to cart from categories");
      }
      
      await TestHelpers.takeScreenshot('complete-flow-success');
      
      console.log(TestHelpers.formatSuccessLog("Complete shopping flow test passed!"));
      console.log("\n📊 === TEST SUMMARY ===");
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
      
      // Try to recover by navigating to home
      try {
        console.log("Attempting to recover and navigate to home...");
        await browser.back();
        await TestHelpers.waitForApp(1000);
        await browser.back();
        await TestHelpers.waitForApp(1000);
        
        const isHome = await homePage.isHomePageDisplayed();
        if (!isHome) {
          await categoriesPage.navigateToHome();
        }
        await TestHelpers.waitForApp(2000);
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  });
});