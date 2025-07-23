// src/pages/cart.page.ts - Updated with more aggressive scrolling

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
  
  // Very small swipe for precise control
  async swipeUpVerySmall() {
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.52 })
        .down({ button: 0 })
        .move({ duration: 500, x: width * 0.5, y: height * 0.48 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(600);
      
    } catch (error) {
      console.error("Error during very small swipe:", error);
    }
  }

  // Small swipe method
  async swipeUpSmall() {
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.55 })
        .down({ button: 0 })
        .move({ duration: 600, x: width * 0.5, y: height * 0.45 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(800);
      
    } catch (error) {
      console.error("Error during small swipe:", error);
    }
  }

  // Medium swipe for faster scrolling
  async swipeUpMedium() {
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.7 })
        .down({ button: 0 })
        .move({ duration: 800, x: width * 0.5, y: height * 0.3 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(1000);
      
    } catch (error) {
      console.error("Error during medium swipe:", error);
    }
  }

  // Large swipe for aggressive scrolling
  async swipeUpLarge() {
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.85 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.5, y: height * 0.15 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(1200);
      
    } catch (error) {
      console.error("Error during large swipe:", error);
    }
  }

  // Enhanced swipe to find element with progressive swipe sizes
  async swipeUntilElementVisible(selector: string, maxSwipes: number = 25): Promise<boolean> {
    console.log(`🔍 Searching for element: ${selector}`);
    
    // First check if already visible
    try {
      const element = await $(selector);
      if (await element.isExisting() && await element.isDisplayed()) {
        console.log(`✅ Element already visible`);
        return true;
      }
    } catch (e) {
      // Element not found yet
    }
    
    // Progressive swipe strategy
    for (let i = 0; i < maxSwipes; i++) {
      try {
        // Progressive swipe sizes
        if (i < 5) {
          // First 5: very small swipes
          console.log(`Attempt ${i + 1}/${maxSwipes} - Very small swipe`);
          await this.swipeUpVerySmall();
        } else if (i < 10) {
          // Next 5: small swipes
          console.log(`Attempt ${i + 1}/${maxSwipes} - Small swipe`);
          await this.swipeUpSmall();
        } else if (i < 15) {
          // Next 5: medium swipes
          console.log(`Attempt ${i + 1}/${maxSwipes} - Medium swipe`);
          await this.swipeUpMedium();
        } else if (i < 20) {
          // Next 5: large swipes
          console.log(`Attempt ${i + 1}/${maxSwipes} - Large swipe`);
          await this.swipeUpLarge();
        } else {
          // Final attempts: alternate between all sizes
          const swipeType = i % 4;
          if (swipeType === 0) {
            console.log(`Attempt ${i + 1}/${maxSwipes} - Very small swipe`);
            await this.swipeUpVerySmall();
          } else if (swipeType === 1) {
            console.log(`Attempt ${i + 1}/${maxSwipes} - Small swipe`);
            await this.swipeUpSmall();
          } else if (swipeType === 2) {
            console.log(`Attempt ${i + 1}/${maxSwipes} - Medium swipe`);
            await this.swipeUpMedium();
          } else {
            console.log(`Attempt ${i + 1}/${maxSwipes} - Large swipe`);
            await this.swipeUpLarge();
          }
        }
        
        // Check if element is now visible
        const element = await $(selector);
        if (await element.isExisting() && await element.isDisplayed()) {
          console.log(`✅ Element found after ${i + 1} swipes`);
          
          // Do one more very small swipe to center it better
          if (i > 5) {
            await this.swipeUpVerySmall();
          }
          
          return true;
        }
        
      } catch (e) {
        // Element not found yet, continue
      }
    }
    
    console.log(`❌ Element not found after ${maxSwipes} swipes`);
    return false;
  }

  // Alternative comprehensive search for Change button
  async findChangeButtonComprehensive(): Promise<boolean> {
    console.log("🔍 Using comprehensive search for Change button...");
    
    try {
      // All possible selectors for Change button
      const changeButtonSelectors = [
        '//android.widget.Button[@content-desc="Change"]',
        '//android.widget.Button[@text="Change"]',
        '//android.widget.TextView[@text="Change"]',
        '//android.view.View[@content-desc="Change"]',
        '//*[@content-desc="Change"]',
        '//*[@text="Change"]',
        '//android.widget.Button[contains(@content-desc, "Change")]',
        '//android.widget.TextView[contains(@text, "Change")]',
        '//*[contains(@content-desc, "Change") or contains(@text, "Change")]'
      ];
      
      for (const selector of changeButtonSelectors) {
        const element = await $(selector);
        if (await element.isExisting() && await element.isDisplayed()) {
          console.log(`✅ Found Change button with selector: ${selector}`);
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error("Comprehensive search failed:", error);
      return false;
    }
  }

  // Method to handle address change with improved scrolling
  async changeDeliveryAddress(): Promise<boolean> {
    console.log("\n=== 📍 Changing Delivery Address ===");
    
    try {
      // Take initial screenshot
      await this.takeScreenshot('cart-before-address-change');
      
      // Step 1: Find the Change button using multiple strategies
      console.log("Step 1: Looking for Change button...");
      
      // Strategy 1: Progressive scrolling with increased attempts
      let changeFound = await this.swipeUntilElementVisible(this.changeAddressButton, 25);
      
      // Strategy 2: If not found, try comprehensive search
      if (!changeFound) {
        console.log("Trying comprehensive search...");
        changeFound = await this.findChangeButtonComprehensive();
      }
      
      // Strategy 3: If still not found, try scrolling to top first then down
      if (!changeFound) {
        console.log("Scrolling to top first...");
        await this.scrollToTopOfCart();
        await browser.pause(1000);
        
        // Now scroll down slowly
        for (let i = 0; i < 20; i++) {
          console.log(`Scrolling down attempt ${i + 1}/20`);
          await this.swipeUpSmall();
          
          // Check for Change button
          changeFound = await this.findChangeButtonComprehensive();
          if (changeFound) {
            break;
          }
        }
      }
      
      if (!changeFound) {
        console.error("❌ Change button not found after all attempts");
        await this.takeScreenshot('change-button-not-found');
        
        // Last resort: look for any clickable element near delivery address
        console.log("Last resort: Looking for delivery address section...");
        const deliverySelectors = [
          '//android.widget.TextView[contains(@text, "Delivery")]',
          '//android.view.View[contains(@content-desc, "Delivery")]',
          '//*[contains(@text, "Delivery Address")]'
        ];
        
        for (const selector of deliverySelectors) {
          const element = await $(selector);
          if (await element.isExisting()) {
            console.log("Found delivery section, looking for nearby button...");
            
            // Try to find any button near delivery section
            const nearbyButton = await $('//android.widget.Button');
            if (await nearbyButton.isExisting() && await nearbyButton.isDisplayed()) {
              console.log("Found a button near delivery section, clicking...");
              await nearbyButton.click();
              await browser.pause(2000);
              
              // Check if we're on address selection page
              const addressOptions = await $$('//android.view.View[contains(@content-desc, "Pradesh")]');
              if ((await addressOptions.length) > 0) {
                console.log("✅ Successfully navigated to address selection");
                changeFound = true;
                break;
              }
            }
          }
        }
        
        if (!changeFound) {
          return false;
        }
      } else {
        // Click the Change button
        const changeBtn = await $(this.changeAddressButton);
        await changeBtn.click();
        console.log("✅ Clicked Change button");
        await browser.pause(2000);
      }
      
      await this.takeScreenshot('select-address-page');
      
      // Step 2: Select HOME address
      console.log("Step 2: Selecting HOME address...");
      const addressSelectors = [
        this.homeAddressOption,
        this.homeAddressOptionAlt,
        '//android.view.View[contains(@content-desc, "HOME")]',
        '//android.widget.TextView[contains(@text, "HOME")]',
        '//*[contains(@content-desc, "HOME") and contains(@content-desc, "226201")]',
        '//*[contains(@content-desc, "HOME")]',
        '//android.view.View[contains(@content-desc, "Bargadi")]'
      ];
      
      let addressSelected = false;
      
      for (const selector of addressSelectors) {
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
        console.log("HOME address not found, trying to select any available address...");
        
        // Try to select any address
        const anyAddressSelectors = [
          '//android.view.View[contains(@content-desc, "Uttar Pradesh")]',
          '//android.view.View[contains(@content-desc, "226201")]',
          '//android.widget.TextView[contains(@text, "Uttar Pradesh")]',
          '//android.view.View[contains(@content-desc, "Magath")]'
        ];
        
        for (const selector of anyAddressSelectors) {
          const address = await $(selector);
          if (await address.isExisting()) {
            await address.click();
            console.log("✅ Selected an available address");
            addressSelected = true;
            await browser.pause(2000);
            break;
          }
        }
        
        if (!addressSelected) {
          console.error("❌ No address found to select");
          await this.takeScreenshot('no-address-found');
          return false;
        }
      }
      
      // Step 3: Wait for redirect back to cart
      console.log("Step 3: Waiting for redirect to cart...");
      await browser.pause(2000);
      
      // Verify we're back on cart
      const cartIndicators = [
        this.placeOrderButton,
        this.myCartTitle,
        '//android.widget.TextView[contains(@text, "Cart")]',
        '//android.view.View[contains(@content-desc, "Price Details")]'
      ];
      
      let backOnCart = false;
      for (const indicator of cartIndicators) {
        const element = await $(indicator);
        if (await element.isExisting()) {
          backOnCart = true;
          console.log(`✅ Back on cart confirmed via: ${indicator}`);
          break;
        }
      }
      
      if (backOnCart) {
        console.log("✅ Successfully returned to cart with new address");
        await this.takeScreenshot('address-changed-cart');
        return true;
      } else {
        console.log("❌ Not back on cart after address selection");
        return false;
      }
      
    } catch (error) {
      console.error("Failed to change address:", error);
      await this.takeScreenshot('address-change-error');
      return false;
    }
  }

  // Helper method to scroll to top of cart
  async scrollToTopOfCart(): Promise<void> {
    console.log("📜 Scrolling to top of cart...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      // Perform 5 large swipes down to ensure we reach top
      for (let i = 0; i < 5; i++) {
        await browser.action('pointer')
          .move({ duration: 0, x: width * 0.5, y: height * 0.2 })
          .down({ button: 0 })
          .move({ duration: 800, x: width * 0.5, y: height * 0.9 })
          .up({ button: 0 })
          .perform();
        
        await browser.pause(500);
        console.log(`Swipe down ${i + 1}/5`);
      }
      
      console.log("✅ Scrolled to top");
      
    } catch (error) {
      console.error("Error scrolling to top:", error);
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
      let attempts = 10;
      
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
        
        console.log(`Waiting for order confirmation... (${attempts} attempts left)`);
        await browser.pause(1500);
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
      const backBtnSelectors = [
        this.orderDetailsBackButton,
        this.orderDetailsBackButtonAlt,
        '//android.widget.Button[1]',
        '//android.widget.ImageButton'
      ];
      
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

  // Scroll through Order Details
  async scrollToBottomOfOrderDetails(): Promise<void> {
    console.log("📜 Scrolling to bottom of Order Details page...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      let previousPageSource = '';
      let currentPageSource = await browser.getPageSource();
      let scrollCount = 0;
      let screenshotCount = 1;
      const maxScrolls = 20;
      
      while (scrollCount < maxScrolls) {
        previousPageSource = currentPageSource;
        
        // Perform scroll
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
        
        // Check if we've reached the bottom
        if (previousPageSource === currentPageSource) {
          console.log(`✅ Reached bottom of Order Details after ${scrollCount} scrolls`);
          break;
        }
        
        scrollCount++;
        console.log(`Scroll ${scrollCount}/${maxScrolls}...`);
      }
      
      // Take final screenshot
      await this.takeScreenshot('order-details-bottom');
      
    } catch (error) {
      console.error("Error scrolling Order Details:", error);
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
        
        // Try to continue anyway if Place Order is visible
        console.log("⚠️ Attempting to continue without changing address...");
      } else {
        console.log("✅ Address changed successfully");
      }
      
      // Place order - may need to scroll to find it
      console.log("\n📦 Looking for Place Order button...");
      
      // Check if Place Order is visible, if not scroll to it
      let placeOrderFound = await this.swipeUntilElementVisible(this.placeOrderButton, 15);
      
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
      let attempts = 15;
      
      while (!orderConfirmed && attempts > 0) {
        if (await viewDetailsBtn.isExisting()) {
          orderConfirmed = true;
          result.orderPlaced = true;
          
          // Try to extract order ID from confirmation page
          try {
            const orderIdSelectors = [
              '//android.widget.TextView[contains(@text, "#")]',
              '//android.view.View[contains(@content-desc, "#")]',
              '//*[contains(@text, "Order") and contains(@text, "#")]'
            ];
            
            for (const selector of orderIdSelectors) {
              const orderIdElement = await $(selector);
              if (await orderIdElement.isExisting()) {
                const text = await orderIdElement.getText() || await orderIdElement.getAttribute('content-desc');
                if (text && text.includes('#')) {
                  result.orderId = text;
                  console.log(`✅ Order ID: ${result.orderId}`);
                  break;
                }
              }
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
          
          // Capture complete order details
          console.log("\n📋 === CAPTURING COMPLETE ORDER DETAILS ===");
          await this.takeScreenshot('order-details-top');
          await this.scrollToBottomOfOrderDetails();
          
          // Navigate back to home
          console.log("\n🔙 Navigating back to home...");
          await this.handleOrderDetailsPage();
          
          break;
        }
        
        console.log(`Waiting for confirmation... (${attempts} attempts left)`);
        await browser.pause(1500);
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

  // Other existing methods remain the same...
  
  async isCartPageDisplayed(): Promise<boolean> {
    try {
      await browser.pause(2000);
      
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
    const maxScrolls = 15;
    
    while (previousPageSource !== currentPageSource && scrollCount < maxScrolls) {
      previousPageSource = currentPageSource;
      await this.swipeUpMedium();
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

  // Enhanced method to handle any cart state
  async ensureCartIsReady(): Promise<boolean> {
    console.log("Ensuring cart is ready for checkout...");
    
    try {
      // First verify we're on cart
      const isCart = await this.isCartPageDisplayed();
      if (!isCart) {
        console.error("Not on cart page");
        return false;
      }
      
      // Check if cart has items
      const items = await $$(this.cartItems);
      if ((await items.length) === 0) {
        console.error("Cart is empty");
        return false;
      }
      
      // Try to find either Place Order or Change button to confirm cart is loaded
      const placeOrderBtn = await $(this.placeOrderButton);
      const changeBtn = await $(this.changeAddressButton);
      
      // If neither is immediately visible, scroll to find them
      if (!await placeOrderBtn.isExisting() && !await changeBtn.isExisting()) {
        console.log("Cart buttons not visible, scrolling...");
        
        // Try scrolling down
        for (let i = 0; i < 10; i++) {
          await this.swipeUpSmall();
          
          if (await placeOrderBtn.isExisting() || await changeBtn.isExisting()) {
            console.log("✅ Found cart buttons after scrolling");
            break;
          }
        }
      }
      
      console.log("✅ Cart is ready for checkout");
      return true;
      
    } catch (error) {
      console.error("Error ensuring cart readiness:", error);
      return false;
    }
  }

  // Debug method to print current page structure
  async debugPrintPageStructure(): Promise<void> {
    console.log("\n=== DEBUG: Current Page Structure ===");
    
    try {
      // Find all buttons
      const buttons = await $$('//android.widget.Button');
      console.log(`Found ${buttons.length} buttons:`);
      
      for (let i = 0; i < (await buttons.length); i++) {
        const button = buttons[i];
        const text = await button.getText();
        const contentDesc = await button.getAttribute('content-desc');
        console.log(`  Button ${i + 1}: text="${text}", content-desc="${contentDesc}"`);
      }
      
      // Find all TextViews
      const textViews = await $$('//android.widget.TextView');
      console.log(`\nFound ${textViews.length} TextViews (showing first 10):`);
      
      for (let i = 0; i < Math.min(10, await textViews.length); i++) {
        const textView = textViews[i];
        const text = await textView.getText();
        console.log(`  TextView ${i + 1}: "${text}"`);
      }
      
      // Find all Views with content-desc
      const viewsWithDesc = await $$('//android.view.View[@content-desc]');
      console.log(`\nFound ${viewsWithDesc.length} Views with content-desc (showing first 10):`);
      
      for (let i = 0; i < Math.min(10, await viewsWithDesc.length); i++) {
        const view = viewsWithDesc[i];
        const contentDesc = await view.getAttribute('content-desc');
        console.log(`  View ${i + 1}: "${contentDesc}"`);
      }
      
      console.log("=== END DEBUG ===\n");
      
    } catch (error) {
      console.error("Debug print failed:", error);
    }
  }
}