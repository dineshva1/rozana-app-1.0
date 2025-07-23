// src/pages/products.page.ts - Fixed swipe methods

import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class ProductsPage extends BasePage {
  // View cart selector
  private get viewCartButton() {
    return '//android.view.View[contains(@content-desc, "Cart Total") and contains(@content-desc, "View Cart")]';
  }
  
  // Add first available product
  async addFirstAvailableProduct(): Promise<boolean> {
    try {
      console.log("Looking for Add button...");
      
      // Find all Add buttons
      const addButtons = await $$('//android.view.View[@content-desc="Add"]');
      const buttonCount = await addButtons.length;
      
      if (buttonCount > 0) {
        await addButtons[0].click();
        console.log(`✓ Product added`);
        return true;
      }
      
      console.log("No Add buttons found");
      return false;
      
    } catch (error) {
      console.error("Failed to add product:", error);
      return false;
    }
  }
  
  // CONTROLLED swipe left for different products (not too aggressive)
  async swipeLeftLonger(): Promise<void> {
    try {
      const { width, height } = await browser.getWindowSize();
      
      // More controlled swipe - from 70% to 30% instead of 95% to 5%
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.7, y: height * 0.5 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.3, y: height * 0.5 })
        .up({ button: 0 })
        .perform();
      
      console.log("✓ Performed controlled horizontal swipe");
      
      // Wait for UI to stabilize
      await browser.pause(500);
      
    } catch (error) {
      console.error("Failed to swipe products:", error);
    }
  }
  
  // CONTROLLED swipe up to reach different sub-category
  async swipeUpLonger(): Promise<void> {
    try {
      const { width, height } = await browser.getWindowSize();
      
      // More controlled swipe - from 75% to 25% instead of 85% to 15%
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.75 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.5, y: height * 0.25 })
        .up({ button: 0 })
        .perform();
      
      console.log("✓ Performed controlled vertical swipe");
      
      // Wait for UI to stabilize
      await browser.pause(500);
      
    } catch (error) {
      console.error("Failed to swipe up:", error);
    }
  }
  
  // Multiple small swipes method as alternative
  async multipleSmallSwipesLeft(count: number = 2): Promise<void> {
    try {
      const { width, height } = await browser.getWindowSize();
      
      console.log(`Performing ${count} small swipes left...`);
      
      for (let i = 0; i < count; i++) {
        await browser.action('pointer')
          .move({ duration: 0, x: width * 0.6, y: height * 0.5 })
          .down({ button: 0 })
          .move({ duration: 800, x: width * 0.4, y: height * 0.5 })
          .up({ button: 0 })
          .perform();
        
        await browser.pause(300);
      }
      
      console.log("✓ Completed multiple small swipes");
      
    } catch (error) {
      console.error("Failed multiple swipes:", error);
    }
  }
  
  // Click View Cart
  async clickViewCart(): Promise<boolean> {
    try {
      console.log("Looking for View Cart button...");
      
      // Wait a bit for cart to update
      await browser.pause(1000);
      
      const viewCartBtn = await $(this.viewCartButton);
      
      if (await viewCartBtn.isExisting()) {
        await viewCartBtn.click();
        console.log("✓ View Cart clicked");
        return true;
      }
      
      console.log("View Cart button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to click View Cart:", error);
      return false;
    }
  }
}