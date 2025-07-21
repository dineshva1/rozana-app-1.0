// src/pages/cart.page.ts - Updated with Change Address flow and View Order Details

import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class CartPage extends BasePage {
  // Existing selectors remain the same
  private get myCartTitle() {
    return '//android.widget.TextView[contains(@text, "My Cart")]';
  }

  private get placeOrderButton() {
    return '//android.widget.Button[@content-desc="Place Order"]';
  }

  private get cartItems() {
    return '//android.view.View[contains(@content-desc, "₹")]';
  }

  // New selectors for the change address flow
  private get deliveryAddressSection() {
    return '//android.view.View[@content-desc="Delivery Address"]';
  }
  
  private get changeAddressButton() {
    return '//android.widget.Button[@content-desc="Change"]';
  }
  
  private get homeAddressOption() {
    return '//android.view.View[@content-desc="HOME\nXWMC+JQX, Bargadi Magath, Uttar Pradesh, 226201"]';
  }
  
  private get homeAddressOptionAlt() {
    return 'android=new UiSelector().description("HOME XWMC+JQX, Bargadi Magath, Uttar Pradesh, 226201")';
  }
  
  private get viewOrderDetailsButton() {
    return '//android.widget.Button[@content-desc="View Order Details"]';
  }
  
  private get orderDetailsBackButton() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button[1]';
  }

  private get orderDetailsBackButtonAlt() {
    return 'android=new UiSelector().className("android.widget.Button").instance(0)';
  }

  // Clear cart selectors
  private get clearCartButton() {
    return '//android.widget.Button[@content-desc="Clear"]';
  }

  private get clearCartConfirmButton() {
    return '//android.widget.Button[@text="Clear" or @content-desc="Clear"]';
  }

  // Method to handle address change
  async changeDeliveryAddress(): Promise<boolean> {
    console.log("\n=== Changing Delivery Address ===");
    
    try {
      // Step 1: Swipe up to see Delivery Address section
      console.log("Step 1: Swiping up to see Delivery Address...");
      await this.swipeUpOnCart();
      await browser.pause(1500);
      await this.takeScreenshot('delivery-address-visible');
      
      // Step 2: Click Change button
      console.log("Step 2: Looking for Change button...");
      const changeBtn = await $(this.changeAddressButton);
      
      if (!await changeBtn.isExisting()) {
        console.log("Change button not visible, trying another swipe...");
        await this.swipeUpOnCart();
        await browser.pause(1500);
      }
      
      if (await changeBtn.isExisting()) {
        await changeBtn.click();
        console.log("✅ Clicked Change button");
        await browser.pause(2000);
        await this.takeScreenshot('select-address-page');
      } else {
        console.error("❌ Change button not found");
        return false;
      }
      
      // Step 3: Select HOME address
      console.log("Step 3: Selecting HOME address...");
      const selectors = [this.homeAddressOption, this.homeAddressOptionAlt];
      let addressSelected = false;
      
      for (const selector of selectors) {
        try {
          const homeAddress = await $(selector);
          if (await homeAddress.isExisting()) {
            await homeAddress.click();
            console.log("✅ Selected HOME address");
            addressSelected = true;
            await browser.pause(2000);
            break;
          }
        } catch (error) {
          // Try next selector
        }
      }
      
      if (!addressSelected) {
        console.error("❌ HOME address not found");
        await this.takeScreenshot('home-address-not-found');
        return false;
      }
      
      // Step 4: Wait for redirect back to cart
      console.log("Step 4: Waiting for redirect to cart...");
      await browser.pause(2000);
      
      // Verify we're back on cart
      const placeOrderBtn = await $(this.placeOrderButton);
      if (await placeOrderBtn.isExisting()) {
        console.log("✅ Successfully returned to cart with new address");
        await this.takeScreenshot('address-changed-cart');
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error("Failed to change address:", error);
      return false;
    }
  }

  // Handle order confirmation and view details
  async handleOrderConfirmation(): Promise<boolean> {
    console.log("\n=== Handling Order Confirmation ===");
    
    try {
      // Wait for order confirmation page
      await browser.pause(2000);
      
      // Look for View Order Details button
      const viewDetailsBtn = await $(this.viewOrderDetailsButton);
      let detailsFound = false;
      let attempts = 5;
      
      while (!detailsFound && attempts > 0) {
        if (await viewDetailsBtn.isExisting()) {
          console.log("✅ Order placed successfully!");
          await this.takeScreenshot('order-confirmation');
          
          // Click View Order Details
          await viewDetailsBtn.click();
          console.log("✅ Clicked View Order Details");
          detailsFound = true;
          await browser.pause(3000);
          break;
        }
        
        console.log("Waiting for order confirmation...");
        await browser.pause(1000);
        attempts--;
      }
      
      if (!detailsFound) {
        console.error("❌ Order confirmation not found");
        return false;
      }
      
      // Handle Order Details page
      await this.handleOrderDetailsPage();
      
      return true;
      
    } catch (error) {
      console.error("Failed to handle order confirmation:", error);
      return false;
    }
  }

  // Handle order details page
  async handleOrderDetailsPage(): Promise<boolean> {
    console.log("\n=== Viewing Order Details ===");
    
    try {
      await this.takeScreenshot('order-details-initial');
      
      // Swipe up to see all order details
      console.log("Swiping to see complete order details...");
      await this.swipeUpOnCart();
      await browser.pause(1500);
      await this.takeScreenshot('order-details-scrolled');
      
      // Swipe again if needed
      await this.swipeUpOnCart();
      await browser.pause(1500);
      await this.takeScreenshot('order-details-bottom');
      
      // Click back button to go to home
      console.log("Clicking back button to return to home...");
      const backBtnSelectors = [this.orderDetailsBackButton, this.orderDetailsBackButtonAlt];
      let backClicked = false;
      
      for (const selector of backBtnSelectors) {
        try {
          const backBtn = await $(selector);
          if (await backBtn.isExisting()) {
            await backBtn.click();
            console.log("✅ Back button clicked");
            backClicked = true;
            await browser.pause(2000);
            break;
          }
        } catch (error) {
          // Try next selector
        }
      }
      
      if (!backClicked) {
        // Try device back button
        console.log("Using device back button...");
        await browser.back();
        await browser.pause(2000);
      }
      
      return true;
      
    } catch (error) {
      console.error("Failed in order details page:", error);
      return false;
    }
  }

  // Complete checkout with address change
  async completeCheckoutWithAddressChange(): Promise<boolean> {
    console.log("\n=== COMPLETE CHECKOUT WITH ADDRESS CHANGE ===");
    
    try {
      // Step 1: Verify we're on cart page
      const isCart = await this.isCartPageDisplayed();
      if (!isCart) {
        console.error("Not on cart page!");
        return false;
      }
      
      await this.takeScreenshot('cart-initial-state');
      
      // Step 2: Change delivery address
      console.log("\nStep 2: Changing delivery address...");
      const addressChanged = await this.changeDeliveryAddress();
      
      if (!addressChanged) {
        console.error("Failed to change address");
        return false;
      }
      
      // Step 3: Place order
      console.log("\nStep 3: Placing order...");
      const placeOrderBtn = await $(this.placeOrderButton);
      
      if (await placeOrderBtn.isExisting()) {
        await placeOrderBtn.click();
        console.log("✅ Place Order clicked");
        await browser.pause(3000);
      } else {
        console.error("❌ Place Order button not found");
        return false;
      }
      
      // Step 4: Handle order confirmation and view details
      console.log("\nStep 4: Handling order confirmation...");
      const orderSuccess = await this.handleOrderConfirmation();
      
      return orderSuccess;
      
    } catch (error) {
      console.error("Checkout failed:", error);
      await this.takeScreenshot('checkout-error');
      return false;
    }
  }

  // Complete flow from cart to order completion
  async completeFullCheckoutFlow(): Promise<{
    orderPlaced: boolean;
    orderId?: string;
    orderTotal?: string;
  }> {
    console.log("\n🛍️ === STARTING COMPLETE CHECKOUT FLOW ===");
    
    const result = {
      orderPlaced: false,
      orderId: undefined as string | undefined,
      orderTotal: undefined as string | undefined
    };
    
    try {
      // Verify we're on cart page
      const isCart = await this.isCartPageDisplayed();
      if (!isCart) {
        console.error("❌ Not on cart page!");
        return result;
      }
      
      console.log("✅ Cart page confirmed");
      await this.takeScreenshot('cart-ready-for-checkout');
      
      // Get initial cart details
      const cartSummary = await this.getCartSummary();
      console.log("📊 Cart Summary:", cartSummary);
      result.orderTotal = cartSummary.total;
      
      // Change delivery address
      console.log("\n📍 Changing delivery address...");
      const addressChanged = await this.changeDeliveryAddress();
      
      if (!addressChanged) {
        console.error("❌ Failed to change address");
        return result;
      }
      
      console.log("✅ Address changed successfully");
      
      // Place order
      console.log("\n📦 Placing order...");
      const placeOrderBtn = await $(this.placeOrderButton);
      
      if (!await placeOrderBtn.isExisting()) {
        // Try scrolling
        await this.swipeUpOnCart();
        await browser.pause(1000);
      }
      
      if (await placeOrderBtn.isExisting()) {
        await placeOrderBtn.click();
        console.log("✅ Place Order clicked");
        await browser.pause(3000);
      } else {
        console.error("❌ Place Order button not found");
        return result;
      }
      
      // Wait for order confirmation
      console.log("\n⏳ Waiting for order confirmation...");
      const viewDetailsBtn = await $(this.viewOrderDetailsButton);
      let orderConfirmed = false;
      let attempts = 10;
      
      while (!orderConfirmed && attempts > 0) {
        if (await viewDetailsBtn.isExisting()) {
          orderConfirmed = true;
          result.orderPlaced = true;
          
          // Try to extract order ID from confirmation page
          try {
            const orderIdElement = await $('//android.widget.TextView[contains(@text, "#")]');
            if (await orderIdElement.isExisting()) {
              result.orderId = await orderIdElement.getText();
              console.log(`✅ Order ID: ${result.orderId}`);
            }
          } catch (e) {
            console.log("Could not extract order ID");
          }
          
          console.log("✅ Order confirmed successfully!");
          await this.takeScreenshot('order-success-confirmation');
          
          // Click View Order Details
          await viewDetailsBtn.click();
          console.log("✅ Viewing order details...");
          await browser.pause(3000);
          
          // Handle order details page
          await this.handleOrderDetailsPage();
          
          break;
        }
        
        console.log(`Waiting for confirmation... (${attempts} attempts left)`);
        await browser.pause(1000);
        attempts--;
      }
      
      if (!orderConfirmed) {
        console.error("❌ Order confirmation timeout");
        await this.takeScreenshot('order-confirmation-timeout');
      }
      
      console.log("\n🏠 Returning to home page...");
      console.log("=====================================");
      console.log("✅ CHECKOUT FLOW COMPLETED!");
      console.log(`📦 Order Placed: ${result.orderPlaced}`);
      console.log(`🆔 Order ID: ${result.orderId || 'N/A'}`);
      console.log(`💰 Order Total: ${result.orderTotal || 'N/A'}`);
      console.log("=====================================\n");
      
      return result;
      
    } catch (error) {
      console.error("❌ Checkout flow failed:", error);
      await this.takeScreenshot('checkout-flow-error');
      return result;
    }
  }

  // Swipe implementation
  async swipeUpOnCart() {
    console.log("Performing swipe up...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.7 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.5, y: height * 0.3 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(1500);
      
    } catch (error) {
      console.error("Error during swipe:", error);
    }
  }

  // Verify cart page
  async isCartPageDisplayed(): Promise<boolean> {
    try {
      await browser.pause(2000);
      
      // Check for cart indicators
      const selectors = [
        this.myCartTitle,
        this.placeOrderButton,
        this.changeAddressButton,
        '//android.widget.TextView[contains(@text, "Cart")]',
        '//android.view.View[contains(@content-desc, "Price Details")]'
      ];
      
      for (const selector of selectors) {
        try {
          const element = await $(selector);
          if (await element.isExisting()) {
            console.log(`Cart page detected via: ${selector}`);
            return true;
          }
        } catch (e) {
          // Continue checking
        }
      }
      
      return false;
      
    } catch (error) {
      console.error("Error checking cart page:", error);
      return false;
    }
  }

  // Get cart total
  async getCartTotal(): Promise<string> {
    try {
      // Look for total amount in different possible locations
      const totalSelectors = [
        '//android.widget.TextView[contains(@text, "₹") and contains(@text, "Total")]/../android.widget.TextView[contains(@text, "₹")]',
        '//android.view.View[@content-desc="Total"]/following-sibling::android.view.View[contains(@content-desc, "₹")]',
        '//android.widget.TextView[contains(@text, "₹") and not(contains(@text, "Subtotal")) and not(contains(@text, "Tax"))]'
      ];
      
      for (const selector of totalSelectors) {
        try {
          const totalElement = await $(selector);
          if (await totalElement.isExisting()) {
            const totalText = await totalElement.getText();
            console.log(`Cart total found: ${totalText}`);
            return totalText;
          }
        } catch (e) {
          // Try next selector
        }
      }
      
      // Fallback: get all price elements and return the last one
      const priceElements = await $$('//android.widget.TextView[contains(@text, "₹")]');
      
      const elementsCount = await Promise.resolve(priceElements.length);
      
      if (elementsCount > 0) {
        const lastElement = priceElements[elementsCount - 1];
        const totalText = await lastElement.getText();
        return totalText;
      }
      
      return "0";
      
    } catch (error) {
      console.error("Failed to get cart total:", error);
      return "0";
    }
  }

  // Get cart summary
  async getCartSummary(): Promise<{
    itemCount: number;
    total: string;
    hasAddress: boolean;
    canPlaceOrder: boolean;
  }> {
    console.log("\n=== Getting cart summary ===");
    
    try {
      const items = await $$(this.cartItems);
      const itemCount: number = await Promise.resolve(items.length);
      
      const total = await this.getCartTotal();
      
      const changeAddressBtn = await $(this.changeAddressButton);
      const hasAddress = await changeAddressBtn.isExisting();
      
      const placeOrderBtn = await $(this.placeOrderButton);
      const canPlaceOrder = await placeOrderBtn.isExisting();
      
      const summary = {
        itemCount: itemCount as number,
        total: total,
        hasAddress: hasAddress,
        canPlaceOrder: canPlaceOrder
      };
      
      console.log("Cart Summary:", summary);
      return summary;
      
    } catch (error) {
      console.error("Failed to get cart summary:", error);
      return {
        itemCount: 0,
        total: "0",
        hasAddress: false,
        canPlaceOrder: false
      };
    }
  }

  // Clear cart
  async clearCart(): Promise<boolean> {
    console.log("\n=== Clearing cart ===");
    
    try {
      const clearButtonXpath = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[2]';
      const clearButton = await $(clearButtonXpath);
      
      if (!await clearButton.isExisting()) {
        const altClearButton = await $('android=new UiSelector().className("android.widget.Button").instance(1)');
        if (await altClearButton.isExisting()) {
          await altClearButton.click();
        } else {
          console.log("Clear cart button not found");
          return false;
        }
      } else {
        await clearButton.click();
      }
      
      console.log("Clear Cart button clicked, waiting for confirmation dialog...");
      await browser.pause(1000);

      const confirmClearXpath = '//android.widget.Button[@content-desc="Clear"]';
      const confirmButton = await $(confirmClearXpath);
      
      if (await confirmButton.isExisting()) {
        console.log("Confirming cart clear...");
        await confirmButton.click();
        console.log("✓ Cart cleared successfully");
        await browser.pause(2000);
        return true;
      }

      console.log("Confirmation dialog not found");
      return false;
      
    } catch (error) {
      console.error("Failed to clear cart:", error);
      return false;
    }
  }
}