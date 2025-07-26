// src/pages/products.page.ts - Updated with new methods

import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class ProductsPage extends BasePage {
  // Add button selectors
  private getAddButtonByIndex(index: number): string {
    return `(//android.view.View[@content-desc="Add"])[${index + 1}]`;
  }
  
  private getAddButtonByUiSelector(index: number): string {
    return `android=new UiSelector().description("Add").instance(${index})`;
  }
  
  // View cart selector - dynamic to handle different totals
  private get viewCartButton() {
    return '//android.view.View[contains(@content-desc, "Cart Total") and contains(@content-desc, "View Cart")]';
  }
  
  private get viewCartButtonAlt() {
    return '//android.view.View[contains(@content-desc, "View Cart")]';
  }
  
  // Add product by specific index
  async addProductByIndex(index: number = 0): Promise<boolean> {
    try {
      console.log(`Looking for Add button at index ${index}...`);
      
      const selectors = [
        this.getAddButtonByIndex(index),
        this.getAddButtonByUiSelector(index)
      ];
      
      for (const selector of selectors) {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log(`✅ Product added (index ${index})`);
          return true;
        }
      }
      
      // Fallback: try to find any Add button
      const addButtons = await $$('//android.view.View[@content-desc="Add"]');
      if (await addButtons.length > index) {
        await addButtons[index].click();
        console.log(`✅ Product added using fallback`);
        return true;
      }
      
      console.log("❌ No Add button found at specified index");
      return false;
      
    } catch (error) {
      console.error("Failed to add product:", error);
      return false;
    }
  }
  
  // Add first available product
  async addFirstAvailableProduct(): Promise<boolean> {
    return await this.addProductByIndex(0);
  }
  
  // Swipe up to find more products
  async swipeUp(): Promise<void> {
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.75 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.5, y: height * 0.25 })
        .up({ button: 0 })
        .perform();
      
      console.log("✅ Swiped up");
      await browser.pause(500);
      
    } catch (error) {
      console.error("Failed to swipe up:", error);
    }
  }
  
  // Controlled swipe up
  async swipeUpLonger(): Promise<void> {
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.8 })
        .down({ button: 0 })
        .move({ duration: 1200, x: width * 0.5, y: height * 0.2 })
        .up({ button: 0 })
        .perform();
      
      console.log("✅ Performed longer swipe up");
      await browser.pause(500);
      
    } catch (error) {
      console.error("Failed to swipe up:", error);
    }
  }
  
  // Click View Cart with multiple selectors
  async clickViewCart(): Promise<boolean> {
    try {
      console.log("Looking for View Cart button...");
      
      // Wait a bit for cart to update
      await browser.pause(1000);
      
      const selectors = [
        this.viewCartButton,
        this.viewCartButtonAlt,
        '//android.view.View[contains(@content-desc, "₹") and contains(@content-desc, "View Cart")]'
      ];
      
      for (const selector of selectors) {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✅ View Cart clicked");
          return true;
        }
      }
      
      console.log("❌ View Cart button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to click View Cart:", error);
      return false;
    }
  }
  
  // Get cart count from View Cart button
  async getCartCount(): Promise<number> {
    try {
      const viewCartElement = await $(this.viewCartButton);
      if (await viewCartElement.isExisting()) {
        const contentDesc = await viewCartElement.getAttribute('content-desc');
        // Extract number from "2\nCart Total\n₹680.41\nView Cart"
        const match = contentDesc.match(/^(\d+)/);
        if (match) {
          return parseInt(match[1]);
        }
      }
      return 0;
    } catch (error) {
      console.error("Failed to get cart count:", error);
      return 0;
    }
  }
  
  // Check if products are loaded
  async areProductsLoaded(): Promise<boolean> {
    try {
      // Check for any Add buttons
      const addButtons = await $$('//android.view.View[@content-desc="Add"]');
      return await addButtons.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  // Wait for products to load
  async waitForProducts(timeout: number = 5000): Promise<boolean> {
    try {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        if (await this.areProductsLoaded()) {
          console.log("✅ Products loaded");
          return true;
        }
        await browser.pause(500);
      }
      
      console.log("❌ Products did not load in time");
      return false;
      
    } catch (error) {
      console.error("Error waiting for products:", error);
      return false;
    }
  }
  // Add this method to products.page.ts

// Swipe up multiple times to find products
async swipeUpToFindProducts(maxSwipes: number = 5): Promise<boolean> {
  console.log(`🔍 Swiping up to find products (max ${maxSwipes} swipes)...`);
  
  for (let i = 1; i <= maxSwipes; i++) {
    console.log(`📱 Swipe ${i}/${maxSwipes}`);
    await this.swipeUp();
    await browser.pause(1500);
    
    // Check if products are visible
    if (await this.areProductsLoaded()) {
      console.log(`✅ Products found after ${i} swipes!`);
      return true;
    }
  }
  
  console.log(`❌ No products found after ${maxSwipes} swipes`);
  return false;
}
}