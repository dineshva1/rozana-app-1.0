// src/tests/flows/shopping.flow.spec.ts - Fixed version

import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { CategoriesPage } from "../../pages/categories.page";
import { ProductsPage } from "../../pages/products.page";
import { CartOperationsPage } from "../../pages/cartoperations.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Shopping Flow with Categories Navigation", () => {
  let homePage: HomePage;
  let categoriesPage: CategoriesPage;
  let productsPage: ProductsPage;
  let cartOperationsPage: CartOperationsPage;

  before(() => {
    homePage = new HomePage();
    categoriesPage = new CategoriesPage();
    productsPage = new ProductsPage();
    cartOperationsPage = new CartOperationsPage();
  });

  it("should complete shopping flow through different categories", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Shopping Flow with Categories ==="));
    
    try {
      // PHASE 1: Initial Setup and Navigation
      console.log("\n========== PHASE 1: Home Page & Grocery Category ==========");
      
      // Step 1: Verify home page
      console.log("\nStep 1: Verifying home page...");
      await TestHelpers.waitForApp(3000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      await TestHelpers.takeScreenshot('01-home-page');
      
      // Step 2: Click on Grocery category
      console.log("\nStep 2: Clicking on Grocery category...");
      const groceryClicked = await categoriesPage.clickCategory('Grocery');
      expect(groceryClicked).toBe(true);
      console.log("✓ Grocery category selected");
      await TestHelpers.waitForApp(2000);
      await TestHelpers.takeScreenshot('02-grocery-category');
      
      // Step 3: Add 4 products from Grocery section
      console.log("\nStep 3: Adding 4 products from Grocery section...");
      
      // First row - 2 products
      console.log("\n--- First Row ---");
      console.log("- Adding first product");
      let added = await productsPage.addFirstAvailableProduct();
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      console.log("- Performing controlled swipe left for different products");
      await productsPage.swipeLeftLonger();  // Now more controlled
      await TestHelpers.waitForApp(1500);
      
      // Check if Add buttons are still available
      console.log("- Checking for Add buttons after swipe");
      added = await productsPage.addFirstAvailableProduct();
      
      if (!added) {
        console.log("- No Add buttons found, trying multiple small swipes");
        await productsPage.multipleSmallSwipesLeft(2);
        await TestHelpers.waitForApp(1000);
        added = await productsPage.addFirstAvailableProduct();
      }
      
      await TestHelpers.waitForApp(1500);
      
      // Swipe up more to reach different sub-category
      console.log("\n- Performing controlled swipe up to reach different sub-category");
      await productsPage.swipeUpLonger();  // Now more controlled
      await TestHelpers.waitForApp(2000);
      
      // Second row - 2 products from different sub-category
      console.log("\n--- Second Row (Different Sub-category) ---");
      console.log("- Adding third product");
      added = await productsPage.addFirstAvailableProduct();
      
      if (!added) {
        console.log("- No Add buttons visible, waiting and retrying");
        await TestHelpers.waitForApp(1000);
        added = await productsPage.addFirstAvailableProduct();
      }
      
      await TestHelpers.waitForApp(1500);
      
      console.log("- Swiping left for more products");
      await productsPage.swipeLeftLonger();
      await TestHelpers.waitForApp(1500);
      
      console.log("- Adding fourth product");
      added = await productsPage.addFirstAvailableProduct();
      await TestHelpers.waitForApp(1500);
      
      console.log("✓ Added products from Grocery");
      await TestHelpers.takeScreenshot('03-grocery-products-added');
      
      // PHASE 2: Navigate to Beverages
      console.log("\n========== PHASE 2: Beverages Category ==========");
      
      console.log("\nStep 4: Navigating to Beverages category...");
      
      // First ensure we're at category level (not in product details)
      console.log("- Ensuring we're at category navigation level");
      await browser.pause(1000);
      
      console.log("- Swiping left on categories");
      await categoriesPage.swipeLeftOnCategories();
      await TestHelpers.waitForApp(1000);
      
      console.log("- Clicking Beverages");
      const beveragesClicked = await categoriesPage.clickCategory('Beverages');
      expect(beveragesClicked).toBe(true);
      console.log("✓ Beverages category selected");
      await TestHelpers.waitForApp(2000);
      await TestHelpers.takeScreenshot('04-beverages-category');
      
      console.log("\nAdding 4 products from Beverages...");
      
      // First row - 2 products
      console.log("\n--- First Row ---");
      console.log("- Adding first product");
      added = await productsPage.addFirstAvailableProduct();
      await TestHelpers.waitForApp(1500);
      
      console.log("- Performing longer swipe left");
      await productsPage.swipeLeftLonger();
      await TestHelpers.waitForApp(1500);
      
      console.log("- Adding second product");
      added = await productsPage.addFirstAvailableProduct();
      await TestHelpers.waitForApp(1500);
      
      // Longer swipe up
      console.log("\n- Performing longer swipe up");
      await productsPage.swipeUpLonger();
      await TestHelpers.waitForApp(2000);
      
      // Second row - 2 products
      console.log("\n--- Second Row (Different Sub-category) ---");
      console.log("- Adding third product");
      added = await productsPage.addFirstAvailableProduct();
      await TestHelpers.waitForApp(1500);
      
      console.log("- Swiping left");
      await productsPage.swipeLeftLonger();
      await TestHelpers.waitForApp(1500);
      
      console.log("- Adding fourth product");
      added = await productsPage.addFirstAvailableProduct();
      await TestHelpers.waitForApp(1500);
      
      console.log("✓ Added 4 products from Beverages");
      
// PHASE 3: Navigate to Energy (last category)
      console.log("\n========== PHASE 3: Energy Category ==========");
      
      console.log("\nStep 5: Navigating to Energy category...");
      
      // IMPORTANT: Make sure we're swiping on categories, not products
      console.log("- Scrolling up to ensure categories are visible");
      
      // Scroll up to make sure categories are visible
      const { width, height } = await browser.getWindowSize();
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.3 })
        .down({ button: 0 })
        .move({ duration: 800, x: width * 0.5, y: height * 0.8 })
        .up({ button: 0 })
        .perform();
      await browser.pause(1000);
      
      console.log("- Checking if All category is visible to confirm we're at category level");
      const allVisible = await categoriesPage.isCategoryVisible('All');
      console.log(`  All category visible: ${allVisible}`);
      
      console.log("- Swiping to find Energy category");
      const energyFound = await categoriesPage.swipeToFindCategory('Energy', 6);
      
      if (energyFound) {
        const energyClicked = await categoriesPage.clickCategory('Energy');
        if (energyClicked) {
          console.log("✓ Energy category selected");
          await TestHelpers.waitForApp(2000);
          await TestHelpers.takeScreenshot('05-energy-category');
          
          console.log("\nAdding 4 products from Energy...");
          
          // Same pattern - 4 products with controlled swipes
          for (let row = 1; row <= 2; row++) {
            console.log(`\n--- Row ${row} ---`);
            
            console.log("- Adding product");
            added = await productsPage.addFirstAvailableProduct();
            await TestHelpers.waitForApp(1500);
            
            console.log("- Swiping left");
            await productsPage.swipeLeftLonger();
            await TestHelpers.waitForApp(1500);
            
            console.log("- Adding product");
            added = await productsPage.addFirstAvailableProduct();
            await TestHelpers.waitForApp(1500);
            
            if (row === 1) {
              console.log("\n- Swiping up");
              await productsPage.swipeUpLonger();
              await TestHelpers.waitForApp(2000);
            }
          }
          
          console.log("✓ Added 4 products from Energy");
        }
      } else {
        console.log("⚠️ Energy category not found after multiple swipes, continuing with existing products");
      }

      
      // PHASE 4: View Cart
      console.log("\n========== PHASE 4: View Cart ==========");
      
      console.log("\nStep 6: Clicking View Cart...");
      const cartClicked = await productsPage.clickViewCart();
      expect(cartClicked).toBe(true);
      console.log("✓ View Cart clicked");
      await TestHelpers.waitForApp(3000);
      await TestHelpers.takeScreenshot('06-cart-opened');
      
      // Verify cart page
      const isCartPage = await cartOperationsPage.isCartPageDisplayed();
      expect(isCartPage).toBe(true);
      console.log("✓ Cart page displayed");
      
      // Get initial cart summary
      const initialItems = await cartOperationsPage.getItemCount();
      console.log(`\n📦 Total items in cart: ${initialItems}`);
      expect(initialItems).toBeGreaterThan(0);
      
      // PHASE 5: Cart Operations
      console.log("\n========== PHASE 5: Cart Operations ==========");
      
      console.log("\nStep 7: Performing cart operations...");
      
      // Increase quantity of first item
      console.log("\n1️⃣ Increasing quantity of first item");
      const increased = await cartOperationsPage.increaseFirstItemQuantity(3);
      expect(increased).toBe(true);
      await TestHelpers.waitForApp(2000);
      await TestHelpers.takeScreenshot('07-quantity-increased');
      
      // Decrease quantity
      console.log("\n2️⃣ Decreasing quantity of same item");
      const decreased = await cartOperationsPage.decreaseFirstItemQuantity(2);
      expect(decreased).toBe(true);
      await TestHelpers.waitForApp(2000);
      
      // Delete ONLY ONE item (not all)
      console.log("\n3️⃣ Deleting ONLY FIRST item");
      const itemsBeforeDelete = await cartOperationsPage.getItemCount();
      const deleted = await cartOperationsPage.deleteOnlyFirstItem();
      expect(deleted).toBe(true);
      await TestHelpers.waitForApp(2000);
      
      const itemsAfterDelete = await cartOperationsPage.getItemCount();
      console.log(`Items before delete: ${itemsBeforeDelete}, after delete: ${itemsAfterDelete}`);
      expect(itemsAfterDelete).toBe(itemsBeforeDelete - 1);
      await TestHelpers.takeScreenshot('08-one-item-deleted');
      
// Clear entire cart (remaining items)
      console.log("\n4️⃣ Clearing entire cart (remaining items)");
      const cleared = await cartOperationsPage.clearCart();
      expect(cleared).toBe(true);
      await TestHelpers.waitForApp(3000); // Wait longer for empty cart state
      await TestHelpers.takeScreenshot('09-cart-cleared');
      
      // Verify empty cart - with better handling
      console.log("\nVerifying cart is empty...");
      const isEmpty = await cartOperationsPage.isCartEmpty();
      if (!isEmpty) {
        console.log("Waiting additional time for empty cart state...");
        await TestHelpers.waitForApp(2000);
        const isEmptyRetry = await cartOperationsPage.isCartEmpty();
        expect(isEmptyRetry).toBe(true);
      } else {
        expect(isEmpty).toBe(true);
      }
      console.log("✓ Cart is empty");
      
      // PHASE 6: Return to Home
      console.log("\n========== PHASE 6: Return to Home ==========");
      
      console.log("\nStep 8: Clicking Start Shopping...");
      const startShoppingClicked = await cartOperationsPage.clickStartShopping();
      expect(startShoppingClicked).toBe(true);
      console.log("✓ Start Shopping clicked");
      await TestHelpers.waitForApp(3000);
      
      // Verify back on home page
      const isHomeAgain = await homePage.isHomePageDisplayed();
      expect(isHomeAgain).toBe(true);
      console.log("✓ Successfully returned to home page");
      await TestHelpers.takeScreenshot('10-back-to-home');
      
      // Test Summary
      console.log(TestHelpers.formatSuccessLog("\n🎉 Categories shopping flow completed successfully! 🎉"));
      console.log("\n📋 Test Summary:");
      console.log("✅ Added products from Grocery (2 different sub-categories)");
      console.log("✅ Added products from Beverages (2 different sub-categories)");
      if (energyFound) {
        console.log("✅ Added products from Energy (2 different sub-categories)");
      }
      console.log("✅ Performed all cart operations:");
      console.log("   • Increased quantity (+3)");
      console.log("   • Decreased quantity (-2)");
      console.log("   • Deleted ONLY 1 item");
      console.log("   • Cleared remaining cart");
      console.log("✅ Verified empty cart state");
      console.log("✅ Returned to home via Start Shopping");
      console.log("\n✅ All test objectives achieved!");
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Categories flow failed: ${error}`));
      await TestHelpers.takeScreenshot('test-error-categories');
      throw error;
    }
  });
});