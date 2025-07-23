// src/pages/cart.page.ts - Updated with better swipe handling

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
  
  // Improved swipe method with smaller increments
  async swipeUpSmall() {
    console.log("Performing small swipe up...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      // Smaller swipe distance for better control
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.6 })
        .down({ button: 0 })
        .move({ duration: 800, x: width * 0.5, y: height * 0.4 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(1000);
      
    } catch (error) {
      console.error("Error during small swipe:", error);
    }
  }

  // Swipe to find element with multiple attempts
  async swipeUntilElementVisible(selector: string, maxSwipes: number = 10): Promise<boolean> {
    console.log(`Swiping to find element: ${selector}`);
    
    for (let i = 0; i < maxSwipes; i++) {
      try {
        const element = await $(selector);
        if (await element.isExisting() && await element.isDisplayed()) {
          console.log(`✅ Element found after ${i} swipes`);
          return true;
        }
      } catch (e) {
        // Element not found yet
      }
      
      console.log(`Swipe attempt ${i + 1}/${maxSwipes}`);
      await this.swipeUpSmall();
    }
    
    console.log(`❌ Element not found after ${maxSwipes} swipes`);
    return false;
  }

  // Method to handle address change with improved scrolling
  async changeDeliveryAddress(): Promise<boolean> {
    console.log("\n=== Changing Delivery Address ===");
    
    try {
      // Step 1: Find the Change button by scrolling
      console.log("Step 1: Looking for Change button...");
      
      // First check if it's already visible
      let changeBtn = await $(this.changeAddressButton);
      let isVisible = await changeBtn.isExisting() && await changeBtn.isDisplayed();
      
      if (!isVisible) {
        // Swipe to find it
        console.log("Change button not immediately visible, scrolling to find it...");
        isVisible = await this.swipeUntilElementVisible(this.changeAddressButton, 8);
      }
      
      if (!isVisible) {
        console.error("❌ Change button not found after multiple swipes");
        await this.takeScreenshot('change-button-not-found');
        return false;
      }
      
      // Click the Change button
      changeBtn = await $(this.changeAddressButton);
      await changeBtn.click();
      console.log("✅ Clicked Change button");
      await browser.pause(2000);
      await this.takeScreenshot('select-address-page');
      
      // Step 2: Select HOME address
      console.log("Step 2: Selecting HOME address...");
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
      
      // Step 3: Wait for redirect back to cart
      console.log("Step 3: Waiting for redirect to cart...");
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
    
    // Improved scrolling to see complete order details
    console.log("Scrolling to see complete order details...");
    
    // Method 1: Scroll until we reach the bottom
    await this.scrollToBottomOfOrderDetails();
    
    // Take final screenshot
    await this.takeScreenshot('order-details-complete');
    
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

// Add this new method to properly scroll through Order Details
async scrollToBottomOfOrderDetails(): Promise<void> {
  console.log("📜 Scrolling to bottom of Order Details page...");
  
  try {
    const { width, height } = await browser.getWindowSize();
    let previousPageSource = '';
    let currentPageSource = await browser.getPageSource();
    let scrollCount = 0;
    let screenshotCount = 1;
    const maxScrolls = 15; // Increased for long order lists
    
    while (scrollCount < maxScrolls) {
      previousPageSource = currentPageSource;
      
      // Perform scroll with appropriate distance for Order Details
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.8 })
        .down({ button: 0 })
        .move({ duration: 800, x: width * 0.5, y: height * 0.2 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(1000);
      
      // Take screenshot every 3 scrolls
      if (scrollCount % 3 === 0 && scrollCount > 0) {
        await this.takeScreenshot(`order-details-section-${screenshotCount}`);
        screenshotCount++;
      }
      
      currentPageSource = await browser.getPageSource();
      
      // Check if we've reached the bottom (page source doesn't change)
      if (previousPageSource === currentPageSource) {
        console.log(`✅ Reached bottom of Order Details after ${scrollCount} scrolls`);
        break;
      }
      
      scrollCount++;
      console.log(`Scroll ${scrollCount}/${maxScrolls}...`);
    }
    
    // Final check - try to find any bottom indicators
    const bottomIndicators = [
      '//android.widget.TextView[contains(@text, "Total")]',
      '//android.widget.TextView[contains(@text, "Grand Total")]',
      '//android.view.View[contains(@content-desc, "Total Amount")]'
    ];
    
    let foundBottom = false;
    for (const indicator of bottomIndicators) {
      const element = await $(indicator);
      if (await element.isExisting()) {
        foundBottom = true;
        console.log(`✅ Found bottom indicator: ${indicator}`);
        break;
      }
    }
    
    if (!foundBottom && scrollCount === maxScrolls) {
      console.log("⚠️ Reached max scrolls, might not have seen entire order");
    }
    
  } catch (error) {
    console.error("Error scrolling Order Details:", error);
  }
}

// Alternative aggressive scroll method for Order Details
async aggressiveScrollOrderDetails(): Promise<void> {
  console.log("📜 Using aggressive scroll for Order Details...");
  
  const { width, height } = await browser.getWindowSize();
  
  // Perform multiple aggressive scrolls
  for (let i = 0; i < 10; i++) {
    console.log(`Aggressive scroll ${i + 1}/10...`);
    
    await browser.action('pointer')
      .move({ duration: 0, x: width * 0.5, y: height - 50 })
      .down({ button: 0 })
      .move({ duration: 600, x: width * 0.5, y: 50 })
      .up({ button: 0 })
      .perform();
    
    await browser.pause(500);
    
    // Check if we can still scroll
    if (i % 3 === 2) {
      const canScroll = await this.canScrollMore();
      if (!canScroll) {
        console.log("✅ Reached absolute bottom");
        break;
      }
    }
  }
}

// Helper method to detect if scrolling is still possible
async canScrollMore(): Promise<boolean> {
  try {
    const { height } = await browser.getWindowSize();
    
    // Get current page source
    const beforeScroll = await browser.getPageSource();
    
    // Do a small test scroll
    await browser.action('pointer')
      .move({ duration: 0, x: 540, y: height - 100 })
      .down({ button: 0 })
      .move({ duration: 300, x: 540, y: 100 })
      .up({ button: 0 })
      .perform();
    
    await browser.pause(500);
    
    // Check if page changed
    const afterScroll = await browser.getPageSource();
    
    return beforeScroll !== afterScroll;
    
  } catch (error) {
    return false;
  }
}

// Enhanced method to capture entire order details
async captureCompleteOrderDetails(): Promise<void> {
  console.log("📸 Capturing complete order details...");
  
  try {
    // Take initial screenshot
    await this.takeScreenshot('order-details-top');
    
    // Scroll in sections and capture
    const sections = ['products', 'pricing', 'totals', 'bottom'];
    
    for (let i = 0; i < sections.length; i++) {
      // Perform measured scroll
      await this.swipeUpSmall();
      await browser.pause(800);
      
      // Capture section
      await this.takeScreenshot(`order-details-${sections[i]}`);
    }
    
    // Try to scroll more to ensure we got everything
    const canScroll = await this.canScrollMore();
    if (canScroll) {
      await this.aggressiveScrollOrderDetails();
      await this.takeScreenshot('order-details-final-bottom');
    }
    
  } catch (error) {
    console.error("Error capturing order details:", error);
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
    
    // Place order - may need to scroll to find it
    console.log("\n📦 Looking for Place Order button...");
    
    // Check if Place Order is visible, if not scroll to it
    let placeOrderFound = await this.swipeUntilElementVisible(this.placeOrderButton, 5);
    
    if (!placeOrderFound) {
      console.error("❌ Place Order button not found");
      return result;
    }
    
    const placeOrderBtn = await $(this.placeOrderButton);
    await placeOrderBtn.click();
    console.log("✅ Place Order clicked");
    await browser.pause(3000);
    
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
        
        // ENHANCED ORDER DETAILS HANDLING
        console.log("\n📋 === CAPTURING COMPLETE ORDER DETAILS ===");
        
        // Take initial screenshot
        await this.takeScreenshot('order-details-top');
        
        // Use the enhanced scrolling method to capture all details
        await this.scrollToBottomOfOrderDetails();
        
        // Alternative: Use aggressive scrolling if needed
        // await this.captureCompleteOrderDetails();
        
        // Navigate back to home
        console.log("\n🔙 Navigating back to home...");
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
          console.log("Using device back button...");
          await browser.back();
          await browser.pause(2000);
        }
        
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

  // Original swipe implementation (for larger swipes)
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

  // Get cart total - simplified version
  async getCartTotal(): Promise<string> {
    try {
      // Look for any price element that might be the total
      const priceElements = await $$('//android.view.View[contains(@content-desc, "₹")]');
      const elementsCount = await Promise.resolve(priceElements.length);
      
      if (elementsCount > 0) {
        // Get the last price element (usually the total)
        const lastElement = priceElements[elementsCount - 1];
        const contentDesc = await lastElement.getAttribute('content-desc');
        
        // Extract price from content-desc
        const priceMatch = contentDesc.match(/₹[\d,]+/);
        if (priceMatch) {
          return priceMatch[0];
        }
      }
      
      return "Total not found";
      
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
      
      // Don't check for change address button here as it might not be visible yet
      const hasAddress = true; // Assume address exists
      
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

  // Helper method to scroll to bottom of cart
  async scrollToCartBottom(): Promise<void> {
    console.log("Scrolling to bottom of cart...");
    
    let previousPageSource = '';
    let currentPageSource = await browser.getPageSource();
    let scrollCount = 0;
    const maxScrolls = 10;
    
    while (previousPageSource !== currentPageSource && scrollCount < maxScrolls) {
      previousPageSource = currentPageSource;
      await this.swipeUpSmall();
      currentPageSource = await browser.getPageSource();
      scrollCount++;
    }
    
    console.log(`Reached bottom after ${scrollCount} scrolls`);
  }

  // Alternative method to find and click Place Order
  async findAndClickPlaceOrder(): Promise<boolean> {
    console.log("Looking for Place Order button...");
    
    // First scroll to bottom
    await this.scrollToCartBottom();
    
    // Now try to find Place Order button
    const placeOrderBtn = await $(this.placeOrderButton);
    if (await placeOrderBtn.isExisting() && await placeOrderBtn.isDisplayed()) {
      await placeOrderBtn.click();
      console.log("✅ Place Order clicked");
      return true;
    }
    
    console.log("❌ Place Order button not found");
    return false;
  }
}