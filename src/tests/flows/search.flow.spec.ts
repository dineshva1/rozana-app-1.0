// src/tests/flows/search.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { SearchPage } from "../../pages/search.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Search Flow - New UI", () => {
  let homePage: HomePage;
  let searchPage: SearchPage;

  before(() => {
    homePage = new HomePage();
    searchPage = new SearchPage();
  });

  it("should search for products using suggestions and add them to cart", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Search Products Flow (New UI) ==="));
    
    try {
      // Step 1: Ensure we're on home page
      console.log("\nStep 1: Verifying we're on home page...");
      await TestHelpers.waitForApp(3000);
      
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      
      await TestHelpers.takeScreenshot('search-00-home-page');
      
      // Step 2: Search and add products
      console.log("\nStep 2: Searching and adding products (milk, oil, biscuit, soap, bread)...");
      const productsAdded = await searchPage.searchAndAddProducts();
      
      // Verify we added at least some products
      expect(productsAdded).toBeGreaterThan(0);
      console.log(`✓ Added ${productsAdded} products via search`);
      
      // Step 3: Verify we're back on home page
      console.log("\nStep 3: Verifying return to home page...");
      await TestHelpers.waitForApp(2000);
      
      const isBackHome = await homePage.isHomePageDisplayed();
      expect(isBackHome).toBe(true);
      console.log("✓ Successfully returned to home page");
      
      await TestHelpers.takeScreenshot('search-06-final-home');
      
      console.log(TestHelpers.formatSuccessLog(`Search flow completed! Added ${productsAdded}/5 products`));
      
      // Extra pause to ensure stability
      await TestHelpers.waitForApp(2000);
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Search flow failed: ${error}`));
      await TestHelpers.takeScreenshot('search-error-final');
      
      // Try to recover
      try {
        console.log("Attempting recovery...");
        // Multiple back presses to ensure we get to home
        for (let i = 0; i < 3; i++) {
          await browser.back();
          await TestHelpers.waitForApp(1000);
          
          const isHome = await homePage.isHomePageDisplayed();
          if (isHome) {
            console.log("✓ Recovered to home page");
            break;
          }
        }
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  });
});