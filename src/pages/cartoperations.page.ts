// src/pages/cartoperations.page.ts - Updated with deleteOnlyFirstItem method

import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class CartOperationsPage extends BasePage {
// Cart page selectors
  private get myCartTitle() {
    return '//android.widget.TextView[contains(@text, "My Cart")]';
  }
  
  private get emptyCartMessage() {
    return '//android.widget.TextView[@text="Your Cart is Empty"]';
  }
  
  private get startShoppingButton() {
    return '//android.widget.Button[@content-desc="Start Shopping"]';
  }
  
  // Clear cart button - second button in header
  private get clearCartButton() {
    return 'android=new UiSelector().className("android.widget.Button").instance(1)';
  }
  
  // Clear confirmation button in dialog
  private get clearCartConfirmButton() {
    return '//android.widget.Button[@content-desc="Clear"]';
  }
  
  // Get all cart items
  private get cartItems() {
    return '//android.widget.ImageView[contains(@content-desc, "item")]';
  }
  
  // Get plus button for first item
  private get firstItemPlusButton() {
    return '(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[2])[1]';
  }
  
  // Get minus button for first item
  private get firstItemMinusButton() {
    return '(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[1])[1]';
  }
  
  // Verify cart page is displayed
  async isCartPageDisplayed(): Promise<boolean> {
    try {
      await browser.pause(1000);
      
      // Check multiple indicators
      const indicators = [
        this.myCartTitle,
        this.emptyCartMessage,
        '//android.widget.TextView[contains(@text, "Cart")]',
        '//android.widget.Button[1]' // Back button
      ];
      
      for (const selector of indicators) {
        const element = await $(selector);
        if (await element.isExisting()) {
          console.log(`Cart page confirmed`);
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error("Error checking cart page:", error);
      return false;
    }
  }
  

  
  // Get item count in cart
  async getItemCount(): Promise<number> {
    try {
      const items = await $$(this.cartItems);
      return items.length;
    } catch (error) {
      console.error("Error getting item count:", error);
      return 0;
    }
  }
  
  // Increase quantity of first item
  async increaseFirstItemQuantity(times: number = 1): Promise<boolean> {
    try {
      console.log(`Clicking + button ${times} times...`);
      
      const plusButton = await $(this.firstItemPlusButton);
      
      if (await plusButton.isExisting()) {
        for (let i = 0; i < times; i++) {
          await plusButton.click();
          console.log(`Click ${i + 1}/${times}`);
          await browser.pause(800);
        }
        console.log(`✓ Increased quantity by ${times}`);
        return true;
      }
      
      console.log("Plus button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to increase quantity:", error);
      return false;
    }
  }
  
  // Decrease quantity of first item
  async decreaseFirstItemQuantity(times: number = 1): Promise<boolean> {
    try {
      console.log(`Clicking - button ${times} times...`);
      
      const minusButton = await $(this.firstItemMinusButton);
      
      if (await minusButton.isExisting()) {
        for (let i = 0; i < times; i++) {
          await minusButton.click();
          console.log(`Click ${i + 1}/${times}`);
          await browser.pause(800);
        }
        console.log(`✓ Decreased quantity by ${times}`);
        return true;
      }
      
      console.log("Minus button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
      return false;
    }
  }
  
  // Delete ONLY the first item (not all items)
  async deleteOnlyFirstItem(): Promise<boolean> {
    try {
      console.log("Deleting ONLY the first item...");
      
      const itemCountBefore = await this.getItemCount();
      console.log(`Items before deletion: ${itemCountBefore}`);
      
      const minusButton = await $(this.firstItemMinusButton);
      
      if (await minusButton.isExisting()) {
        // Get the current quantity of first item (usually visible in content-desc)
        // Keep clicking minus until this specific item is removed
        let clickCount = 0;
        const maxClicks = 10;
        
        while (clickCount < maxClicks) {
          // Check if minus button still exists
          if (await minusButton.isExisting()) {
            await minusButton.click();
            clickCount++;
            await browser.pause(500);
            
            // Check if item count decreased by 1
            const currentItemCount = await this.getItemCount();
            if (currentItemCount === itemCountBefore - 1) {
              console.log(`✓ First item deleted after ${clickCount} clicks`);
              return true;
            }
          } else {
            // Minus button disappeared, item might be deleted
            break;
          }
        }
        
        // Verify deletion
        const itemCountAfter = await this.getItemCount();
        if (itemCountAfter === itemCountBefore - 1) {
          console.log("✓ Successfully deleted only first item");
          return true;
        }
      }
      
      console.log("Could not delete first item");
      return false;
      
    } catch (error) {
      console.error("Failed to delete first item:", error);
      return false;
    }
  }
  

  

  // Check if cart is empty - FIXED to wait for empty state
  async isCartEmpty(): Promise<boolean> {
    try {
      console.log("Checking if cart is empty...");
      
      // Wait a bit for empty cart state to appear
      await browser.pause(1000);
      
      // Check for empty cart message
      const emptyMessage = await $(this.emptyCartMessage);
      const isEmpty = await emptyMessage.isExisting();
      
      if (isEmpty) {
        console.log("✓ Cart is empty - 'Your Cart is Empty' message found");
        return true;
      }
      
      // Also check if Start Shopping button is visible
      const startButton = await $(this.startShoppingButton);
      const hasStartButton = await startButton.isExisting();
      
      if (hasStartButton) {
        console.log("✓ Cart is empty - Start Shopping button found");
        return true;
      }
      
      console.log("Cart is not empty");
      return false;
      
    } catch (error) {
      console.error("Error checking empty cart:", error);
      return false;
    }
  }
  
  // Other methods remain the same...
  
  // Clear entire cart - FIXED with better waiting
  async clearCart(): Promise<boolean> {
    try {
      console.log("Clearing entire cart...");
      
      // Click clear button (2nd button in header)
      const clearButton = await $(this.clearCartButton);
      
      if (await clearButton.isExisting()) {
        await clearButton.click();
        console.log("Clear button clicked");
      } else {
        // Try alternative selector
        const altClearButton = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[2]');
        if (await altClearButton.isExisting()) {
          await altClearButton.click();
          console.log("Clear button clicked (alt selector)");
        } else {
          console.log("Clear button not found");
          return false;
        }
      }
      
      await browser.pause(1000);
      
      // Click Clear in confirmation dialog
      const confirmButton = await $(this.clearCartConfirmButton);
      
      if (await confirmButton.isExisting()) {
        await confirmButton.click();
        console.log("✓ Clear confirmed");
        // Wait longer for cart to clear
        await browser.pause(3000);
        return true;
      }
      
      console.log("Confirmation dialog not found");
      return false;
      
    } catch (error) {
      console.error("Failed to clear cart:", error);
      return false;
    }
  }
  
  // Click Start Shopping button - FIXED with better waiting
  async clickStartShopping(): Promise<boolean> {
    try {
      console.log("Looking for Start Shopping button...");
      
      // Wait for Start Shopping button to appear
      await browser.pause(1000);
      
      const startButton = await $(this.startShoppingButton);
      
      // Wait for button to be visible
      let attempts = 0;
      while (!await startButton.isExisting() && attempts < 5) {
        console.log(`Waiting for Start Shopping button... (attempt ${attempts + 1})`);
        await browser.pause(1000);
        attempts++;
      }
      
      if (await startButton.isExisting()) {
        await startButton.click();
        console.log("✓ Start Shopping clicked");
        return true;
      }
      
      console.log("Start Shopping button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to click Start Shopping:", error);
      return false;
    }
  }
}