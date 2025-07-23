// src/pages/categories.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class CategoriesPage extends BasePage {
  // Tab selectors
  private get categoriesTab() {
    return '//android.widget.ImageView[@content-desc="Categories\nTab 2 of 4"]';
  }

  private get homeTab() {
    return '//android.widget.ImageView[@content-desc="Home\nTab 1 of 4"]';
  }

  // Subcategory selectors - Direct subcategories under Grocery & Staple
  private get sweetenersSubcategory() {
    return '//android.widget.ImageView[@content-desc="Sweeteners"]';
  }

  // Subcategories under Snacks & Bakery
  private get readyToEatSubcategory() {
    return '//android.widget.ImageView[@content-desc="Ready to Eat & Cook"]';
  }

  // Subcategories under Energy & Health
  private get digestivesSubcategory() {
    return '//android.widget.ImageView[@content-desc="Digestives & Acidity Relief"]';
  }

  // Product selectors - UPDATED with multiple variants for all products
  // Parijaat Mishri selectors
  private get parijatMishriProduct() {
    return '//android.widget.ImageView[@content-desc="Parijaat Mishri - 200 Gm\n₹16 ₹40"]';
  }
  
  private get parijatMishriProductAlt1() {
    return '//android.widget.ImageView[@content-desc="Parijaat Mishri - 200 Gm ₹16 ₹40"]';
  }
  
  private get parijatMishriProductAlt2() {
    return '//android.widget.ImageView[contains(@content-desc, "Parijaat Mishri") and contains(@content-desc, "200 Gm")]';
  }
  
  private get parijatMishriProductByUiSelector() {
    return 'android=new UiSelector().description("Parijaat Mishri - 200 Gm ₹16 ₹40")';
  }

  // Weikfield Pasta selectors
  private get weikfieldPastaProduct() {
    return '//android.widget.ImageView[@content-desc="Weikfield Instant Pasta Cheezy Creamy Pouch - 64 Gm\n₹21 ₹32"]';
  }
  
  private get weikfieldPastaProductAlt1() {
    return '//android.widget.ImageView[@content-desc="Weikfield Instant Pasta Cheezy Creamy Pouch - 64 Gm ₹21 ₹32"]';
  }
  
  private get weikfieldPastaProductAlt2() {
    return '//android.widget.ImageView[contains(@content-desc, "Weikfield Instant Pasta") and contains(@content-desc, "64 Gm")]';
  }
  
  private get weikfieldPastaProductByUiSelector() {
    return 'android=new UiSelector().description("Weikfield Instant Pasta Cheezy Creamy Pouch - 64 Gm ₹21 ₹32")';
  }

  // Hajmola selectors
  private get hajmolaProduct() {
    return '//android.widget.ImageView[@content-desc="Hajmola Regular 120 Tabs Bottle - Rs 70\n₹60 ₹70"]';
  }
  
  private get hajmolaProductAlt1() {
    return '//android.widget.ImageView[@content-desc="Hajmola Regular 120 Tabs Bottle - Rs 70 ₹60 ₹70"]';
  }
  
  private get hajmolaProductAlt2() {
    return '//android.widget.ImageView[contains(@content-desc, "Hajmola Regular") and contains(@content-desc, "120 Tabs")]';
  }
  
  private get hajmolaProductByUiSelector() {
    return 'android=new UiSelector().description("Hajmola Regular 120 Tabs Bottle - Rs 70 ₹60 ₹70")';
  }

  // Product detail page selectors
  private get addToCartButton() {
    return '//android.view.View[@content-desc="Add to Cart"]';
  }

  private get viewSimilarSection() {
    return '//android.view.View[@content-desc="View Similar"]';
  }

  private get moreFromBrandSection() {
    return '//*[contains(@content-desc, "More from")]';
  }

  // Back button selectors
  private get backButtonWithAccessibility() {
    return '//android.widget.Button[@content-desc="Back"]';
  }

  private get backButtonGeneric() {
    return '//android.widget.Button';
  }
  // Add View Cart selectors
  private get viewCartFloatingButton() {
    return '//android.view.View[contains(@content-desc, "Cart Total") and contains(@content-desc, "View Cart")]';
  }
  
  private get viewCartFloatingButtonAlt() {
    return '//android.view.View[contains(@content-desc, "₹") and contains(@content-desc, "View Cart")]';
  }
  
  private get viewCartFloatingButtonByText() {
    return 'android=new UiSelector().descriptionContains("View Cart")';
  }

private getCategorySelector(categoryName: string) {
    return `//android.widget.ImageView[@content-desc="${categoryName}"]`;
  }
  
  // Categories container
  private get categoriesContainer() {
    return '//android.widget.HorizontalScrollView[.//android.widget.ImageView[@content-desc="All"]]';
  }
  // Add button selector for products in detail page
  private getAddButtonByIndex(index: number) {
    return `(//android.view.View[@content-desc="Add"])[${index}]`;
  }
// Method to click View Cart from Categories page
  async clickViewCartFromCategories(): Promise<boolean> {
    console.log("\n📱 Looking for View Cart button on Categories page...");
    
    try {
      // Wait a bit for the floating button to appear
      await browser.pause(2000);
      
      // Try multiple selectors
      const selectors = [
        this.viewCartFloatingButton,
        this.viewCartFloatingButtonAlt,
        this.viewCartFloatingButtonByText
      ];
      
      for (const selector of selectors) {
        try {
          const viewCartBtn = await $(selector);
          if (await viewCartBtn.isExisting()) {
            console.log("✅ Found View Cart button");
            await this.takeScreenshot('view-cart-button-found');
            
            await viewCartBtn.click();
            console.log("✅ Clicked View Cart button");
            await browser.pause(3000);
            return true;
          }
        } catch (error) {
          // Try next selector
        }
      }
      
      console.error("❌ View Cart button not found with any selector");
      await this.takeScreenshot('view-cart-not-found');
      return false;
      
    } catch (error) {
      console.error("❌ Failed to click View Cart:", error);
      return false;
    }
  }
  // Custom scroll methods
  async scrollToSnacksBakery(): Promise<void> {
    console.log("📜 Scrolling to Snacks & Bakery...");
    await browser.action('pointer')
      .move({ duration: 0, x: 473, y: 1771 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 490, y: 924 })
      .up({ button: 0 })
      .perform();
    await browser.pause(1500);
  }
// Replace the scrollToEnergyHealth method with this implementation:
async scrollToEnergyHealth(): Promise<void> {
  console.log("📜 Scrolling to Energy & Health using proven manual coordinates...");
  
  try {
    // Get device dimensions for reference
    const { width, height } = await browser.getWindowSize();
    console.log(`📱 Device dimensions: ${width}x${height}`);
    
    // Your exact recorded scroll sequences that work
    const manualScrollSequence = [
      {
        startX: 522, startY: 1919,
        endX: 526, endY: 280,
        duration: 1000,
        pauseAfter: 500
      },
      {
        startX: 552, startY: 2191,
        endX: 565, endY: 237,
        duration: 1000,
        pauseAfter: 500
      },
      {
        startX: 556, startY: 2066,
        endX: 569, endY: 280,
        duration: 1000,
        pauseAfter: 500
      },
      {
        startX: 556, startY: 2126,
        endX: 556, endY: 298,
        duration: 1000,
        pauseAfter: 500
      },
      {
        startX: 578, startY: 1928,
        endX: 599, endY: 1190,
        duration: 1000,
        pauseAfter: 1000
      }
    ];
    
    // Execute each scroll exactly as recorded
    for (let i = 0; i < manualScrollSequence.length; i++) {
      const scroll = manualScrollSequence[i];
      console.log(`Executing scroll ${i + 1}/${manualScrollSequence.length}...`);
      console.log(`  From: (${scroll.startX}, ${scroll.startY}) To: (${scroll.endX}, ${scroll.endY})`);
      
      await browser.action('pointer')
        .move({ duration: 0, x: scroll.startX, y: scroll.startY })
        .down({ button: 0 })
        .move({ duration: scroll.duration, x: scroll.endX, y: scroll.endY })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(scroll.pauseAfter);
      
      // After 3rd scroll, check if Digestives is visible
      if (i >= 2) {
        const digestivesElement = await $(this.digestivesSubcategory);
        if (await digestivesElement.isExisting()) {
          console.log(`✅ Found Digestives subcategory after scroll ${i + 1}`);
          
          // Get element position
          const location = await digestivesElement.getLocation();
          const size = await digestivesElement.getSize();
          console.log(`Digestives position: x=${location.x}, y=${location.y}, height=${size.height}`);
          
          // Check if element is in safe clickable zone (not too close to bottom)
          // Assuming View Cart appears in bottom ~200-300 pixels
          if (location.y > height - 300) {
            console.log("⚠️ Digestives is too close to bottom, adjusting position...");
            
            // Do a small adjustment scroll to center the element
            await browser.action('pointer')
              .move({ duration: 0, x: width / 2, y: location.y })
              .down({ button: 0 })
              .move({ duration: 500, x: width / 2, y: height / 2 })
              .up({ button: 0 })
              .perform();
            await browser.pause(500);
          }
          
          await this.takeScreenshot('energy-health-found');
          return; // Success!
        }
      }
    }
    
    // If we completed all scrolls but didn't find it during the loop, check one more time
    console.log("\n🔍 Final check for Digestives element...");
    await browser.pause(1000);
    
    // Try multiple selectors
    const alternativeSelectors = [
      this.digestivesSubcategory,
      '//android.widget.ImageView[contains(@content-desc, "Digestives")]',
      '//android.widget.ImageView[contains(@content-desc, "Digestives & Acidity")]',
      '//*[contains(@content-desc, "Digestives")][@clickable="true"]',
      '//android.view.View[contains(@content-desc, "Digestives")]'
    ];
    
    let found = false;
    for (const selector of alternativeSelectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          console.log(`✅ Found Digestives using selector: ${selector}`);
          found = true;
          
          // Final position check
          const location = await element.getLocation();
          if (location.y > height - 300) {
            console.log("Performing final position adjustment...");
            await browser.action('pointer')
              .move({ duration: 0, x: 540, y: height - 400 })
              .down({ button: 0 })
              .move({ duration: 500, x: 540, y: height - 700 })
              .up({ button: 0 })
              .perform();
            await browser.pause(500);
          }
          
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!found) {
      console.error("❌ Could not find Digestives subcategory!");
      await this.takeScreenshot('digestives-not-found-final');
      
      // As a last resort, try one more aggressive scroll
      console.log("🔄 Last resort: One final scroll attempt...");
      await browser.action('pointer')
        .move({ duration: 0, x: 560, y: 2000 })
        .down({ button: 0 })
        .move({ duration: 1500, x: 560, y: 200 })
        .up({ button: 0 })
        .perform();
      await browser.pause(1000);
      
      // Check one more time
      const lastCheck = await $(this.digestivesSubcategory);
      if (!await lastCheck.isExisting()) {
        throw new Error("Energy & Health section not reachable even with manual coordinates!");
      }
    }
    
    console.log("✅ Successfully scrolled to Energy & Health section!");
    
  } catch (error) {
    console.error("❌ Critical error in scrollToEnergyHealth:", error);
    await this.takeScreenshot('scroll-error-critical');
    throw error;
  }
}

// Alternative method that's even more aggressive if needed
async scrollToEnergyHealthAggressive(): Promise<void> {
  console.log("📜 Using AGGRESSIVE scroll method for Energy & Health...");
  
  try {
    // Direct execution of your exact commands
    await browser.action('pointer')
      .move({ duration: 0, x: 522, y: 1919 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 526, y: 280 })
      .up({ button: 0 })
      .perform();
    await browser.pause(500);
    
    await browser.action('pointer')
      .move({ duration: 0, x: 552, y: 2191 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 565, y: 237 })
      .up({ button: 0 })
      .perform();
    await browser.pause(500);
    
    await browser.action('pointer')
      .move({ duration: 0, x: 556, y: 2066 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 569, y: 280 })
      .up({ button: 0 })
      .perform();
    await browser.pause(500);
    
    await browser.action('pointer')
      .move({ duration: 0, x: 556, y: 2126 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 556, y: 298 })
      .up({ button: 0 })
      .perform();
    await browser.pause(500);
    
    await browser.action('pointer')
      .move({ duration: 0, x: 578, y: 1928 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 599, y: 1190 })
      .up({ button: 0 })
      .perform();
    await browser.pause(1000);
    
    console.log("✅ Aggressive scroll sequence completed!");
    
    // Verify we can see Digestives
    const digestives = await $(this.digestivesSubcategory);
    if (!await digestives.isExisting()) {
      // Try with alternative selectors
      const altDigestives = await $('//android.widget.ImageView[contains(@content-desc, "Digestives")]');
      if (!await altDigestives.isExisting()) {
        throw new Error("Digestives not visible after aggressive scroll!");
      }
    }
    
    console.log("✅ Energy & Health section is now visible!");
    
  } catch (error) {
    console.error("❌ Aggressive scroll failed:", error);
    throw error;
  }
}

// Debug method to understand why scrolling might not work
async debugScrollIssue(): Promise<void> {
  console.log("\n🔍 DEBUG: Analyzing scroll behavior...");
  
  try {
    const { width, height } = await browser.getWindowSize();
    console.log(`Device screen: ${width}x${height}`);
    
    // Get all visible elements before scroll
    const elementsBefore = await $$('//android.widget.ImageView[@content-desc]');
    const countBefore = elementsBefore.length;
    console.log(`Elements before scroll: ${countBefore}`);
    
    // Try a simple scroll with your coordinates
    console.log("Testing scroll with your coordinates...");
    await browser.action('pointer')
      .move({ duration: 0, x: 550, y: 2000 })
      .down({ button: 0 })
      .move({ duration: 1000, x: 550, y: 300 })
      .up({ button: 0 })
      .perform();
    await browser.pause(1000);
    
    // Check if anything changed
    const elementsAfter = await $$('//android.widget.ImageView[@content-desc]');
    const countAfter = elementsAfter.length;
    console.log(`Elements after scroll: ${countAfter}`);
    
    if (countBefore === countAfter) {
      console.log("⚠️ WARNING: Scroll might not be working properly!");
      console.log("Possible issues:");
      console.log("1. The scrollable container might not be the entire screen");
      console.log("2. Touch events might be intercepted by another element");
      console.log("3. The app might have custom scroll handling");
    } else {
      console.log("✅ Scroll is working! New elements appeared.");
    }
    
    // Check for any overlaying elements
    const viewCartButton = await $('//android.view.View[contains(@content-desc, "View Cart")]');
    if (await viewCartButton.isExisting()) {
      const vcLocation = await viewCartButton.getLocation();
      console.log(`⚠️ View Cart button detected at y=${vcLocation.y}`);
    }
    
  } catch (error) {
    console.error("Debug failed:", error);
  }
}



// Alternative: Add a method to check if View Cart is blocking
async isViewCartBlocking(): Promise<boolean> {
  try {
    const viewCartBtn = await $(this.viewCartFloatingButton);
    if (await viewCartBtn.isExisting()) {
      const location = await viewCartBtn.getLocation();
      const size = await viewCartBtn.getSize();
      console.log(`View Cart button location: ${JSON.stringify(location)}, size: ${JSON.stringify(size)}`);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

  // Navigation methods
  async navigateToCategories(): Promise<boolean> {
    console.log("\n📱 Navigating to Categories tab...");
    try {
      // Check if already on categories
      const sweeteners = await $(this.sweetenersSubcategory);
      if (await sweeteners.isExisting()) {
        console.log("✅ Already on Categories page");
        return true;
      }

      const categoriesElement = await $(this.categoriesTab);
      if (await categoriesElement.isExisting()) {
        await categoriesElement.click();
        await browser.pause(3000);
        console.log("✅ Categories tab opened");
        await this.takeScreenshot('categories-main-page');
        return true;
      }
      
      console.error("❌ Failed to find Categories tab");
      return false;
      
    } catch (error) {
      console.error("❌ Failed to navigate to categories:", error);
      return false;
    }
  }

  // Go back using generic button
  async goBackFromPage(): Promise<boolean> {
    try {
      const genericBack = await $(this.backButtonGeneric);
      if (await genericBack.isExisting()) {
        await genericBack.click();
        await browser.pause(1500);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to go back:", error);
      return false;
    }
  }

  // Handle product image carousel (optional)
  async handleProductImageCarousel(): Promise<void> {
    try {
      console.log("📸 Attempting to scroll product images...");
      // Simple left-right swipe on product image area
      await browser.action('pointer')
        .move({ duration: 0, x: 800, y: 600 })
        .down({ button: 0 })
        .move({ duration: 500, x: 200, y: 600 })
        .up({ button: 0 })
        .perform();
      await browser.pause(1000);
      
      await browser.action('pointer')
        .move({ duration: 0, x: 200, y: 600 })
        .down({ button: 0 })
        .move({ duration: 500, x: 800, y: 600 })
        .up({ button: 0 })
        .perform();
      await browser.pause(1000);
      console.log("✅ Product images scrolled");
    } catch (error) {
      console.log("⚠️ Image carousel handling skipped");
    }
  }

  // Process product detail page
  async processProductDetailPage(): Promise<number> {
    let productsAdded = 0;
    console.log("📱 Processing product detail page...");

    try {
      // Handle product images
      await this.handleProductImageCarousel();

      // Scroll down to find View Similar
      await SwipeUtils.swipeUp(0.6);
      await browser.pause(1500);

      // Check if View Similar section exists
      const viewSimilar = await $(this.viewSimilarSection);
      if (await viewSimilar.isExisting()) {
        console.log("📦 Found 'View Similar' section");
        
        // Try to add 2nd product (index 2)
        try {
          const addButton2 = await $(this.getAddButtonByIndex(2));
          if (await addButton2.isExisting()) {
            await addButton2.click();
            productsAdded++;
            console.log("✅ Added product from View Similar");
            await browser.pause(1000);
          }
        } catch (error) {
          console.log("⚠️ Could not add from View Similar");
        }
      }

      // Scroll more to find More from Brand
      await SwipeUtils.swipeUp(0.4);
      await browser.pause(1500);

      // Check for More from Brand section
      const moreFromBrand = await $(this.moreFromBrandSection);
      if (await moreFromBrand.isExisting()) {
        console.log("📦 Found 'More from Brand' section");
        
        // Try to add 4th product (index 4)
        try {
          const addButton4 = await $(this.getAddButtonByIndex(4));
          if (await addButton4.isExisting()) {
            await addButton4.click();
            productsAdded++;
            console.log("✅ Added product from More from Brand");
            await browser.pause(1000);
          }
        } catch (error) {
          console.log("⚠️ Could not add from More from Brand");
        }
      }

      // Click main Add to Cart button
      const addToCart = await $(this.addToCartButton);
      if (await addToCart.isExisting()) {
        await addToCart.click();
        productsAdded++;
        console.log("✅ Clicked main 'Add to Cart' button");
        await browser.pause(2000);
      } else {
        console.error("❌ Add to Cart button not found");
      }

    } catch (error) {
      console.error("Error in product detail page:", error);
    }

    return productsAdded;
  }

  // Get product selectors based on category
  private getProductSelectors(productName: string): string[] {
    switch(productName) {
      case 'parijaat':
        return [
          this.parijatMishriProduct,
          this.parijatMishriProductAlt1,
          this.parijatMishriProductAlt2,
          this.parijatMishriProductByUiSelector
        ];
      case 'weikfield':
        return [
          this.weikfieldPastaProduct,
          this.weikfieldPastaProductAlt1,
          this.weikfieldPastaProductAlt2,
          this.weikfieldPastaProductByUiSelector
        ];
      case 'hajmola':
        return [
          this.hajmolaProduct,
          this.hajmolaProductAlt1,
          this.hajmolaProductAlt2,
          this.hajmolaProductByUiSelector
        ];
      default:
        return [];
    }
  }

  // Updated processSubcategoryFlow method
  // async processSubcategoryFlow(
  //   subcategorySelector: string,
  //   productName: string,
  //   subcategoryName: string
  // ): Promise<number> {
  //   console.log(`\n📂 === Processing ${subcategoryName} ===`);
  //   let totalAdded = 0;

  //   try {
  //     // Step 1: Click on subcategory
  //     console.log(`📱 Clicking ${subcategoryName} subcategory...`);
  //     const subcategory = await $(subcategorySelector);
  //     if (await subcategory.isExisting()) {
  //       await subcategory.click();
  //       await browser.pause(3000);
  //       console.log(`✅ Opened ${subcategoryName} subcategory page`);
  //       await this.takeScreenshot(`${subcategoryName.toLowerCase().replace(/\s+/g, '-')}-subcategory`);
  //     } else {
  //       console.error(`❌ ${subcategoryName} subcategory not found`);
  //       return 0;
  //     }

  //     // Step 2: Click on product - UPDATED WITH MULTIPLE ATTEMPTS
  //     console.log(`📱 Looking for product in ${subcategoryName}...`);
      
  //     // Wait a bit for products to load
  //     await browser.pause(2000);
      
  //     // Get product selectors based on product name
  //     const productSelectors = this.getProductSelectors(productName);
      
  //     let productFound = false;
  //     for (const selector of productSelectors) {
  //       try {
  //         const product = await $(selector);
  //         if (await product.isExisting()) {
  //           await product.click();
  //           productFound = true;
  //           console.log(`✅ Clicked product using selector: ${selector}`);
  //           break;
  //         }
  //       } catch (error) {
  //         // Try next selector
  //       }
  //     }
      
  //     if (!productFound) {
  //       console.error(`❌ Product not found with any selector in ${subcategoryName}`);
  //       // Take screenshot to debug
  //       await this.takeScreenshot(`${subcategoryName}-product-not-found`);
  //       await this.goBackFromPage();
  //       return 0;
  //     }
      
  //     // Wait for product detail page to load
  //     await browser.pause(3000);
  //     console.log(`✅ Opened product detail page`);
  //     await this.takeScreenshot(`${subcategoryName.toLowerCase().replace(/\s+/g, '-')}-product-detail`);
      
  //     // Step 3: Process product detail page
  //     const addedProducts = await this.processProductDetailPage();
  //     totalAdded += addedProducts;
      
  //     // Step 4: Go back to subcategory
  //     console.log("⬅️ Going back to subcategory page...");
  //     await this.goBackFromPage();
  //     await browser.pause(2000);

  //     // Step 5: Go back to main categories
  //     console.log("⬅️ Going back to categories main page...");
  //     await this.goBackFromPage();
  //     await browser.pause(2000);

  //   } catch (error) {
  //     console.error(`❌ Error in ${subcategoryName} flow:`, error);
  //     // Try to recover by going back twice
  //     await this.goBackFromPage();
  //     await browser.pause(1000);
  //     await this.goBackFromPage();
  //     await browser.pause(1000);
  //   }

  //   console.log(`📊 Total products added from ${subcategoryName}: ${totalAdded}`);
  //   return totalAdded;
  // }
// Also update the processSubcategoryFlow method for better handling of Digestives
async processSubcategoryFlow(
  subcategorySelector: string,
  productName: string,
  subcategoryName: string
): Promise<number> {
  console.log(`\n📂 === Processing ${subcategoryName} ===`);
  let totalAdded = 0;

  try {
    // Special handling for Digestives subcategory
    if (subcategoryName === "Digestives & Acidity Relief") {
      // Double-check position before clicking
      const digestivesElement = await $(subcategorySelector);
      if (await digestivesElement.isExisting()) {
        const location = await digestivesElement.getLocation();
        const { height } = await browser.getWindowSize();
        
        // If still too close to bottom, do a small adjustment
        if (location.y > height - 300) {
          console.log("⚠️ Making final position adjustment...");
          await SwipeUtils.swipeDown(0.2); // Small swipe down
          await browser.pause(1000);
        }
      }
    }
    
    // Click on subcategory
    console.log(`📱 Clicking ${subcategoryName} subcategory...`);
    const subcategory = await $(subcategorySelector);
    
    if (await subcategory.isExisting()) {
      // For Digestives, use a more careful click approach
      if (subcategoryName === "Digestives & Acidity Relief") {
        const location = await subcategory.getLocation();
        const size = await subcategory.getSize();
        
        // Click in the center of the element
        await browser.action('pointer')
          .move({ duration: 0, x: location.x + size.width/2, y: location.y + size.height/2 })
          .down({ button: 0 })
          .up({ button: 0 })
          .perform();
        
        console.log(`✅ Clicked ${subcategoryName} using coordinates`);
      } else {
        // Regular click for other subcategories
        await subcategory.click();
        console.log(`✅ Clicked ${subcategoryName} subcategory`);
      }
      
      await browser.pause(3000);
      await this.takeScreenshot(`${subcategoryName.toLowerCase().replace(/\s+/g, '-')}-subcategory`);
      
      // Verify we're on the subcategory page
      const onSubcategory = await this.isOnSubcategoryPage();
      if (!onSubcategory) {
        console.log("❌ Click might have hit View Cart instead, not on subcategory page");
        return 0;
      }
    } else {
      console.error(`❌ ${subcategoryName} subcategory not found`);
      return 0;
    }

    // Rest of your existing code remains the same...
    console.log(`📱 Looking for product in ${subcategoryName}...`);
    await browser.pause(2000);
    
    const productSelectors = this.getProductSelectors(productName);
    let productFound = false;
    
    for (const selector of productSelectors) {
      try {
        const product = await $(selector);
        if (await product.isExisting()) {
          await product.click();
          productFound = true;
          console.log(`✅ Clicked product using selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Try next selector
      }
    }
    
    if (!productFound) {
      console.error(`❌ Product not found with any selector in ${subcategoryName}`);
      await this.takeScreenshot(`${subcategoryName}-product-not-found`);
      await this.goBackFromPage();
      return 0;
    }
    
    await browser.pause(3000);
    console.log(`✅ Opened product detail page`);
    await this.takeScreenshot(`${subcategoryName.toLowerCase().replace(/\s+/g, '-')}-product-detail`);
    
    const addedProducts = await this.processProductDetailPage();
    totalAdded += addedProducts;
    
    console.log("⬅️ Going back to subcategory page...");
    await this.goBackFromPage();
    await browser.pause(2000);

    console.log("⬅️ Going back to categories main page...");
    await this.goBackFromPage();
    await browser.pause(2000);

  } catch (error) {
    console.error(`❌ Error in ${subcategoryName} flow:`, error);
    await this.goBackFromPage();
    await browser.pause(1000);
    await this.goBackFromPage();
    await browser.pause(1000);
  }

  console.log(`📊 Total products added from ${subcategoryName}: ${totalAdded}`);
  return totalAdded;
}

// Helper method to check if we're on a subcategory page
// Helper method to check if we're on a subcategory page
async isOnSubcategoryPage(): Promise<boolean> {
  try {
    // Check for common elements on subcategory pages
    const productElements = await $$('//android.widget.ImageView[contains(@content-desc, "₹")]');
    const hasProducts = (await productElements.length) > 0;
    
    // Check if we're not on main categories page
    const sweetenersVisible = await $(this.sweetenersSubcategory).isExisting();
    
    return hasProducts && !sweetenersVisible;
  } catch (error) {
    return false;
  }
}

// Add a safer scroll method specifically for finding Energy & Health
async scrollToEnergyHealthSafe(): Promise<void> {
  console.log("📜 Safe scrolling to Energy & Health...");
  
  const { width, height } = await browser.getWindowSize();
  const maxScrolls = 6;
  let found = false;
  
  for (let i = 0; i < maxScrolls && !found; i++) {
    // Check if Digestives is visible
    const digestives = await $(this.digestivesSubcategory);
    if (await digestives.isExisting()) {
      const location = await digestives.getLocation();
      
      // Check if it's in a safe clickable area (not too close to bottom)
      if (location.y < height - 250) {
        console.log("✅ Found Digestives in safe clickable area");
        found = true;
        break;
      } else {
        console.log("Found Digestives but too close to bottom, scrolling more...");
      }
    }
    
    // Perform safe scroll
    const startY = height * 0.6;
    const endY = height * 0.25;
    
    await browser.action('pointer')
      .move({ duration: 0, x: width * 0.5, y: startY })
      .down({ button: 0 })
      .move({ duration: 800, x: width * 0.5, y: endY })
      .up({ button: 0 })
      .perform();
    
    await browser.pause(1000);
    console.log(`Scroll attempt ${i + 1}/${maxScrolls}`);
  }
  
  if (!found) {
    console.log("⚠️ Could not find Digestives in safe area after scrolling");
  }
}
  // Main test flow
  async testCategoriesFlow(): Promise<number> {
    console.log("\n🛒 === Starting Categories Shopping Flow ===");
    let totalProductsAdded = 0;
    let sweetenersAdded = 0;
    let readyToEatAdded = 0;
    let digestivesAdded = 0;

    try {
      // Navigate to Categories if not already there
      const categoriesOpened = await this.navigateToCategories();
      if (!categoriesOpened) {
        throw new Error("Failed to open categories");
      }

      // Phase 1: Grocery & Staple - Sweeteners (visible on first page)
      console.log("\n🍯 === Phase 1: Grocery & Staple - Sweeteners ===");
      console.log("ℹ️ Grocery & Staple is the first category, directly clicking Sweeteners");
      
      sweetenersAdded = await this.processSubcategoryFlow(
        this.sweetenersSubcategory,
        'parijaat',
        "Sweeteners"
      );
      totalProductsAdded += sweetenersAdded;

      // Phase 2: Snacks & Bakery - Ready to Eat & Cook
      console.log("\n🍝 === Phase 2: Snacks & Bakery - Ready to Eat & Cook ===");
      console.log("ℹ️ Scrolling to find Snacks & Bakery category");
      
      // Scroll to find Snacks & Bakery
      await this.scrollToSnacksBakery();
      
      // Process Ready to Eat subcategory
      readyToEatAdded = await this.processSubcategoryFlow(
        this.readyToEatSubcategory,
        'weikfield',
        "Ready to Eat & Cook"
      );
      totalProductsAdded += readyToEatAdded;

      // Phase 3: Energy & Health - Digestives & Acidity Relief
      console.log("\n💊 === Phase 3: Energy & Health - Digestives & Acidity Relief ===");
      console.log("ℹ️ Performing multiple scrolls to find Energy & Health category");
      
      // Perform multiple scrolls to find Energy & Health
      await this.scrollToEnergyHealth();
      
      // Process Digestives subcategory
      digestivesAdded = await this.processSubcategoryFlow(
        this.digestivesSubcategory,
        'hajmola',
        "Digestives & Acidity Relief"
      );
      totalProductsAdded += digestivesAdded;

      // Phase 4: Return to Home using back button
      console.log("\n🏠 === Phase 4: Returning to Home page ===");
      console.log("ℹ️ No Home tab visible, using back button to navigate");
      
      const wentBackToHome = await this.goBackFromPage();
      if (wentBackToHome) {
        console.log("✅ Successfully returned to Home page via back button");
        await browser.pause(2000);
        await this.takeScreenshot('categories-test-complete');
      } else {
        console.log("⚠️ Could not navigate back to home");
      }

      // Summary
      console.log("\n📊 === Categories Test Summary ===");
      console.log("✅ Categories flow completed!");
      console.log(`📦 Total products added: ${totalProductsAdded}`);
      console.log("📋 Breakdown:");
      console.log(`   - Sweeteners (Parijaat Mishri): ${sweetenersAdded} products`);
      console.log(`   - Ready to Eat & Cook (Weikfield Pasta): ${readyToEatAdded} products`);
      console.log(`   - Digestives & Acidity Relief (Hajmola): ${digestivesAdded} products`);
      console.log("================================\n");

      return totalProductsAdded;

    } catch (error) {
      console.error("\n❌ Categories flow failed:", error);
      await this.takeScreenshot('categories-error');
      
      // Try to recover and go to home
      try {
        console.log("🔧 Attempting recovery...");
        // Try multiple back presses to get to home
        for (let i = 0; i < 3; i++) {
          await this.goBackFromPage();
          await browser.pause(1000);
        }
      } catch (recoveryError) {
        console.log("Recovery failed");
      }
      
      throw error;
    }
  }

  // Backward compatibility method
  async addProductsFromMultipleCategories(): Promise<number> {
    return await this.testCategoriesFlow();
  }

  // Verify if on home page after navigation
  async isOnHomePage(): Promise<boolean> {
    try {
      // Check for home page elements like search bar or explore categories
      const searchBar = await $('//*[contains(@text, "Search")]');
      const exploreCategories = await $('//*[contains(@content-desc, "Explore") or contains(@text, "Explore")]');
      
      return (await searchBar.isExisting() || await exploreCategories.isExisting());
    } catch (error) {
      return false;
    }
  }

  // Debug helper
  async debugCurrentPage(): Promise<void> {
    console.log("\n🔍 === Debug: Current Page Analysis ===");
    try {
      // Check what's visible
      const buttons = await $$('//android.widget.Button');
      console.log(`Buttons found: ${buttons.length}`);
      
      const images = await $$('//android.widget.ImageView');
      console.log(`Images found: ${images.length}`);
      
      const tabs = await $$('//*[contains(@content-desc, "Tab")]');
      console.log(`Tabs found: ${tabs.length}`);
      
      // Check specific elements
      const sweeteners = await $(this.sweetenersSubcategory);
      console.log(`Sweeteners visible: ${await sweeteners.isExisting()}`);
      
      const addToCart = await $(this.addToCartButton);
      console.log(`Add to Cart visible: ${await addToCart.isExisting()}`);
      
      const backButton = await $(this.backButtonGeneric);
      console.log(`Back button visible: ${await backButton.isExisting()}`);
      
    } catch (error) {
      console.error("Debug failed:", error);
    }
    console.log("=== End Debug ===\n");
  }

  // Quick test method for a single category
  async testSingleCategory(categoryName: 'sweeteners' | 'readytoeat' | 'digestives'): Promise<number> {
    console.log(`\n⚡ Quick test for ${categoryName}`);
    
    try {
      await this.navigateToCategories();
      
      let result = 0;
      switch(categoryName) {
        case 'sweeteners':
          result = await this.processSubcategoryFlow(
            this.sweetenersSubcategory,
            'parijaat',
            "Sweeteners"
          );
          break;
        case 'readytoeat':
          await this.scrollToSnacksBakery();
          result = await this.processSubcategoryFlow(
            this.readyToEatSubcategory,
            'weikfield',
            "Ready to Eat & Cook"
          );
          break;
        case 'digestives':
          await this.scrollToEnergyHealth();
          result = await this.processSubcategoryFlow(
            this.digestivesSubcategory,
            'hajmola',
            "Digestives & Acidity Relief"
          );
          break;
      }
      
      // Go back to home
      await this.goBackFromPage();
      
      return result;
      
    } catch (error) {
      console.error(`Quick test failed for ${categoryName}:`, error);
      return 0;
    }
  }

  // Get category summary
  async getCategorySummary(): Promise<string> {
    const summary = `
    Categories Test Flow:
    1. Grocery & Staple → Sweeteners → Parijaat Mishri
    2. Snacks & Bakery → Ready to Eat & Cook → Weikfield Pasta
    3. Energy & Health → Digestives & Acidity Relief → Hajmola
    
    Each product detail page:
    - Scroll product images left/right
    - Add products from "View Similar" section
    - Add products from "More from Brand" section
    - Add main product to cart
    `;
    return summary;
  }
  // Updated main test flow - Phase 4 modified
  async testCategoriesFlowWithCheckout(): Promise<{ productsAdded: number; orderPlaced: boolean }> {
    console.log("\n🛒 === Starting Categories Shopping Flow with Checkout ===");
    let totalProductsAdded = 0;
    let orderPlaced = false;

    try {
      // Navigate to Categories if not already there
      const categoriesOpened = await this.navigateToCategories();
      if (!categoriesOpened) {
        throw new Error("Failed to open categories");
      }

      // Phase 1: Grocery & Staple - Sweeteners
      console.log("\n🍯 === Phase 1: Grocery & Staple - Sweeteners ===");
      const sweetenersAdded = await this.processSubcategoryFlow(
        this.sweetenersSubcategory,
        'parijaat',
        "Sweeteners"
      );
      totalProductsAdded += sweetenersAdded;

      // Phase 2: Snacks & Bakery - Ready to Eat & Cook
      console.log("\n🍝 === Phase 2: Snacks & Bakery - Ready to Eat & Cook ===");
      await this.scrollToSnacksBakery();
      const readyToEatAdded = await this.processSubcategoryFlow(
        this.readyToEatSubcategory,
        'weikfield',
        "Ready to Eat & Cook"
      );
      totalProductsAdded += readyToEatAdded;

      // Phase 3: Energy & Health - Digestives
      console.log("\n💊 === Phase 3: Energy & Health - Digestives & Acidity Relief ===");
      await this.scrollToEnergyHealth();
      const digestivesAdded = await this.processSubcategoryFlow(
        this.digestivesSubcategory,
        'hajmola',
        "Digestives & Acidity Relief"
      );
      totalProductsAdded += digestivesAdded;

      // Phase 4: Click View Cart instead of going home
      console.log("\n🛒 === Phase 4: Viewing Cart from Categories ===");
      console.log(`📦 Total products added: ${totalProductsAdded}`);
      
      if (totalProductsAdded > 0) {
        const viewCartClicked = await this.clickViewCartFromCategories();
        
        if (viewCartClicked) {
          console.log("✅ Successfully navigated to cart");
          orderPlaced = true; // Will be handled by cart page
        } else {
          console.log("❌ Failed to navigate to cart");
          orderPlaced = false;
        }
      } else {
        console.log("⚠️ No products added, cannot view cart");
      }

      return { productsAdded: totalProductsAdded, orderPlaced: orderPlaced };

    } catch (error) {
      console.error("\n❌ Categories flow failed:", error);
      await this.takeScreenshot('categories-error');
      return { productsAdded: totalProductsAdded, orderPlaced: false };
    }
  }
  // Check if a category is visible
  // async isCategoryVisible(categoryName: string): Promise<boolean> {
  //   try {
  //     const categoryElement = await $(this.getCategorySelector(categoryName));
  //     return await categoryElement.isExisting();
  //   } catch (error) {
  //     return false;
  //   }
  // }
  
 // Check if a category is visible
  async isCategoryVisible(categoryName: string): Promise<boolean> {
    try {
      const categoryElement = await $(this.getCategorySelector(categoryName));
      return await categoryElement.isExisting();
    } catch (error) {
      return false;
    }
  }
  
  // Click on a category
  async clickCategory(categoryName: string): Promise<boolean> {
    try {
      console.log(`Clicking on ${categoryName} category...`);
      const categorySelector = this.getCategorySelector(categoryName);
      
      // Don't wait for element if it's not visible yet
      const categoryElement = await $(categorySelector);
      if (await categoryElement.isExisting()) {
        await categoryElement.click();
        console.log(`✓ ${categoryName} category clicked`);
        return true;
      }
      
      console.log(`${categoryName} category not found`);
      return false;
      
    } catch (error) {
      console.error(`Failed to click ${categoryName} category:`, error);
      return false;
    }
  }
  
  // Swipe left on categories bar
  async swipeLeftOnCategories(): Promise<void> {
    try {
      const { width } = await browser.getWindowSize();
      
      // Swipe on the categories area - using fixed Y coordinate around 360-520
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.8, y: 360 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.2, y: 360 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(500);
      
    } catch (error) {
      console.error("Failed to swipe categories:", error);
    }
  }
  
  // Aggressive swipe left SPECIFICALLY on categories area for reaching Energy
  async aggressiveSwipeLeftOnCategories(): Promise<void> {
    try {
      console.log("Performing aggressive category swipe...");
      
      // Using your exact coordinates that are in the categories area
      await browser.action('pointer')
        .move({ duration: 0, x: 799, y: 520 })
        .down({ button: 0 })
        .move({ duration: 1000, x: 95, y: 524 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(800);
      
    } catch (error) {
      console.error("Failed aggressive swipe:", error);
    }
  }
  
  // Swipe to find a specific category
  async swipeToFindCategory(categoryName: string, maxSwipes: number = 5): Promise<boolean> {
    console.log(`Swiping to find ${categoryName} category...`);
    
    for (let i = 0; i < maxSwipes; i++) {
      // Check if category is visible
      if (await this.isCategoryVisible(categoryName)) {
        console.log(`✓ ${categoryName} category found after ${i} swipes`);
        return true;
      }
      
      console.log(`Swipe ${i + 1}/${maxSwipes}`);
      await this.aggressiveSwipeLeftOnCategories();
    }
    
    console.log(`${categoryName} category not found after ${maxSwipes} swipes`);
    return false;
  }
}




