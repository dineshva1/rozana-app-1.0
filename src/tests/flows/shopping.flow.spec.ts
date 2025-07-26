// src/tests/flows/shopping.flow.spec.ts - Fixed version with multiple swipes

import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { CategoriesPage } from "../../pages/categories.page";
import { ProductsPage } from "../../pages/products.page";
import { CartOperationsPage } from "../../pages/cartoperations.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Shopping Flow - My Deals and Categories", () => {
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

  it("should complete shopping flow through My Deals and different categories", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Shopping Flow - My Deals & Categories ==="));
    
    try {
      // PHASE 1: Initial Setup and My Deals
      console.log("\n========== PHASE 1: Home Page & My Deals ==========");
      
      // Step 1: Verify home page
      console.log("\nStep 1: Verifying home page...");
      await TestHelpers.waitForApp(3000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✅ Home page confirmed");
      await TestHelpers.takeScreenshot('01-home-page');
      
      // Step 2: Click on My Deals
      console.log("\nStep 2: Clicking on My Deals...");
      const myDealsClicked = await categoriesPage.clickMyDeals();
      expect(myDealsClicked).toBe(true);
      console.log("✅ My Deals selected");
      
      // IMPORTANT: Wait for My Deals page to load
      console.log("⏳ Waiting for My Deals page to load...");
      await TestHelpers.waitForApp(3000);
      await TestHelpers.takeScreenshot('02-my-deals-loaded');
      
      // Step 3: Multiple swipes to find products in My Deals
      console.log("\nStep 3: Swiping up multiple times to find products in My Deals...");
      
      // First swipe up
      console.log("📱 Swipe 1: Initial swipe up");
      await productsPage.swipeUp();
      await TestHelpers.waitForApp(1500);
      
      // Second swipe up
      console.log("📱 Swipe 2: Continuing to scroll");
      await productsPage.swipeUp();
      await TestHelpers.waitForApp(1500);
      
      // Third swipe up
      console.log("📱 Swipe 3: Looking for products");
      await productsPage.swipeUp();
      await TestHelpers.waitForApp(1500);
      
      // Check if products are visible
      console.log("🔍 Checking for products...");
      let productsFound = await productsPage.areProductsLoaded();
      
      // Continue swiping if needed
      if (!productsFound) {
        console.log("📱 Products not found yet, continuing to swipe...");
        for (let i = 4; i <= 6; i++) {
          console.log(`📱 Swipe ${i}: Still looking for products`);
          await productsPage.swipeUp();
          await TestHelpers.waitForApp(1500);
          
          productsFound = await productsPage.areProductsLoaded();
          if (productsFound) {
            console.log(`✅ Products found after ${i} swipes!`);
            break;
          }
        }
      } else {
        console.log("✅ Products found!");
      }
      
      await TestHelpers.takeScreenshot('03-my-deals-products-visible');
      
      // Add first product from My Deals
      console.log("\n➕ Adding first product from My Deals");
      let added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      // Swipe up to find different products
      console.log("\n📱 Swiping up to find more products");
      await productsPage.swipeUp();
      await TestHelpers.waitForApp(2000);
      
      // Add second product from My Deals
      console.log("➕ Adding second product from My Deals");
      added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      console.log("✅ Added 2 products from My Deals");
      await TestHelpers.takeScreenshot('04-my-deals-products-added');
      
      // PHASE 2: Fashion Category
      console.log("\n========== PHASE 2: Fashion Category ==========");
      
      console.log("\nStep 4: Navigating to Fashion category...");
      const fashionClicked = await categoriesPage.clickCategory('Fashion');
      expect(fashionClicked).toBe(true);
      console.log("✅ Fashion category selected");
      
      // Wait for Fashion page to load
      console.log("⏳ Waiting for Fashion page to load...");
      await TestHelpers.waitForApp(3000);
      
      // Multiple swipes for Fashion products
      console.log("\n📱 Swiping to find Fashion products...");
      for (let i = 1; i <= 3; i++) {
        console.log(`📱 Swipe ${i}`);
        await productsPage.swipeUp();
        await TestHelpers.waitForApp(1000);
      }
      
      await TestHelpers.takeScreenshot('05-fashion-category');
      
      // Add products from Fashion
      console.log("\nAdding products from Fashion...");
      
      // Add first product
      console.log("➕ Adding first product");
      added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      // Swipe up
      console.log("📱 Swiping up for more products");
      await productsPage.swipeUp();
      await TestHelpers.waitForApp(2000);
      
      // Add second product
      console.log("➕ Adding second product");
      added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      console.log("✅ Added 2 products from Fashion");
      
      // PHASE 3: Grocery Category
      console.log("\n========== PHASE 3: Grocery Category ==========");
      
      console.log("\nStep 5: Navigating to Grocery category...");
      const groceryClicked = await categoriesPage.clickCategory('Grocery');
      expect(groceryClicked).toBe(true);
      console.log("✅ Grocery category selected");
      
      // Wait for Grocery page to load
      console.log("⏳ Waiting for Grocery page to load...");
      await TestHelpers.waitForApp(3000);
      
      // Multiple swipes for Grocery products
      console.log("\n📱 Swiping to find Grocery products...");
      for (let i = 1; i <= 3; i++) {
        console.log(`📱 Swipe ${i}`);
        await productsPage.swipeUp();
        await TestHelpers.waitForApp(1000);
      }
      
      await TestHelpers.takeScreenshot('06-grocery-category');
      
      // Add products from Grocery
      console.log("\nAdding products from Grocery...");
      
      // Add first product
      console.log("➕ Adding first product");
      added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      // Swipe up
      console.log("📱 Swiping up for more products");
      await productsPage.swipeUp();
      await TestHelpers.waitForApp(2000);
      
      // Add second product
      console.log("➕ Adding second product");
      added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      console.log("✅ Added 2 products from Grocery");
      
      // PHASE 4: Footwears Category
      console.log("\n========== PHASE 4: Footwears Category ==========");
      
      console.log("\nStep 6: Navigating to Footwears category...");
      const footwearsClicked = await categoriesPage.clickCategory('Footwears');
      expect(footwearsClicked).toBe(true);
      console.log("✅ Footwears category selected");
      
      // Wait for Footwears page to load
      console.log("⏳ Waiting for Footwears page to load...");
      await TestHelpers.waitForApp(3000);
      
      // Multiple swipes for Footwears products
      console.log("\n📱 Swiping to find Footwears products...");
      for (let i = 1; i <= 3; i++) {
        console.log(`📱 Swipe ${i}`);
        await productsPage.swipeUp();
        await TestHelpers.waitForApp(1000);
      }
      
      await TestHelpers.takeScreenshot('07-footwears-category');
      
      // Add products from Footwears
      console.log("\nAdding products from Footwears...");
      
      // Add first product
      console.log("➕ Adding first product");
      added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      // Swipe up
      console.log("📱 Swiping up for more products");
      await productsPage.swipeUp();
      await TestHelpers.waitForApp(2000);
      
      // Add second product
      console.log("➕ Adding second product");
      added = await productsPage.addProductByIndex(0);
      expect(added).toBe(true);
      await TestHelpers.waitForApp(1500);
      
      console.log("✅ Added 2 products from Footwears");
      
      // PHASE 5: View Cart
      console.log("\n========== PHASE 5: View Cart ==========");
      
      console.log("\nStep 7: Clicking View Cart...");
      const cartClicked = await productsPage.clickViewCart();
      expect(cartClicked).toBe(true);
      console.log("✅ View Cart clicked");
      await TestHelpers.waitForApp(3000);
      await TestHelpers.takeScreenshot('08-cart-opened');
      
      // PHASE 6: Cart Operations (remain the same)
      console.log("\n========== PHASE 6: Cart Operations ==========");
      
      console.log("\nStep 8: Performing cart operations...");
      
      // Increase quantity of first item
      console.log("\n1️⃣ Increasing quantity of first item");
      const increased = await cartOperationsPage.increaseFirstItemQuantity(3);
      expect(increased).toBe(true);
      await TestHelpers.waitForApp(2000);
      await TestHelpers.takeScreenshot('08-quantity-increased');
      
      // Decrease quantity
      console.log("\n2️⃣ Decreasing quantity of same item");
      const decreased = await cartOperationsPage.decreaseFirstItemQuantity(2);
      expect(decreased).toBe(true);
      await TestHelpers.waitForApp(2000);
      
      // Delete ONLY ONE item
      console.log("\n3️⃣ Deleting ONLY FIRST item");
      const itemsBeforeDelete = await cartOperationsPage.getItemCount();
      const deleted = await cartOperationsPage.deleteOnlyFirstItem();
      expect(deleted).toBe(true);
      await TestHelpers.waitForApp(2000);
      
      const itemsAfterDelete = await cartOperationsPage.getItemCount();
      console.log(`Items before delete: ${itemsBeforeDelete}, after delete: ${itemsAfterDelete}`);
      expect(itemsAfterDelete).toBe(itemsBeforeDelete - 1);
      await TestHelpers.takeScreenshot('09-one-item-deleted');
      
      // Clear entire cart
      console.log("\n4️⃣ Clearing entire cart (remaining items)");
      const cleared = await cartOperationsPage.clearCart();
      expect(cleared).toBe(true);
      await TestHelpers.waitForApp(3000);
      await TestHelpers.takeScreenshot('10-cart-cleared');
      
      // Verify empty cart
      console.log("\nVerifying cart is empty...");
      const isEmpty = await cartOperationsPage.isCartEmpty();
      expect(isEmpty).toBe(true);
      console.log("✅ Cart is empty");
      
      // PHASE 7: Return to Home
      console.log("\n========== PHASE 7: Return to Home ==========");
      
      console.log("\nStep 9: Clicking Start Shopping...");
      const startShoppingClicked = await cartOperationsPage.clickStartShopping();
      expect(startShoppingClicked).toBe(true);
      console.log("✅ Start Shopping clicked");
      await TestHelpers.waitForApp(3000);
      
      // Verify back on home page
      const isHomeAgain = await homePage.isHomePageDisplayed();
      expect(isHomeAgain).toBe(true);
      console.log("✅ Successfully returned to home page");
      await TestHelpers.takeScreenshot('11-back-to-home');
      
      // Test Summary
      console.log(TestHelpers.formatSuccessLog("\n🎉 Shopping flow completed successfully! 🎉"));
      console.log("\n📋 Test Summary:");
      console.log("✅ Added 2 products from My Deals");
      console.log("✅ Added 2 products from Fashion");
      console.log("✅ Added 2 products from Grocery");
      console.log("✅ Added 2 products from Footwears");
      console.log("✅ Total: 8 products added to cart");
      console.log("✅ Performed all cart operations");
      console.log("✅ Verified empty cart state");
      console.log("✅ Returned to home page");
      console.log("\n✅ All test objectives achieved!");
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Shopping flow failed: ${error}`));
      await TestHelpers.takeScreenshot('test-error-shopping');
      throw error;
    }
  });
});