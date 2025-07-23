// src/pages/orders.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class OrdersPage extends BasePage {
  // Order tabs
  private get allTab() {
    return '//android.widget.Button[@content-desc="All"]';
  }

  private get pendingTab() {
    return '//android.widget.Button[@content-desc="Pending"]';
  }

  private get activeTab() {
    return '//android.widget.Button[@content-desc="Active"]';
  }

  private get deliveredTab() {
    return '//android.widget.Button[@content-desc="Delivered"]';
  }

  private get cancelledTab() {
    return '//android.widget.Button[@content-desc="Cancelled"]';
  }

  // Back button selectors
  private get backButton() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[1]';
  }

  private get backButtonAlt() {
    return '(//android.widget.Button)[1]';
  }
  
  private get backButtonByUiSelector() {
    return 'android=new UiSelector().className("android.widget.Button").instance(0)';
  }

  // Order detail back button
  private get orderDetailBackButton() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button[1]';
  }

  // First order selector
  private get firstOrder() {
    return '//android.view.View[contains(@content-desc, "Order #")]';
  }
  
  private get firstOrderByAccessibility() {
    return '~Order #17PQ+258\nOrder Placed\n23/7/2025\nTomorrow, 11:30 AM\n13 items\n₹747.36';
  }
  
  private get firstOrderGeneric() {
    return '//android.view.View[contains(@content-desc, "Order #") and contains(@content-desc, "Order Placed")]';
  }

  // Click on first order
  async clickFirstOrder(): Promise<boolean> {
    console.log("Clicking on first order...");
    
    const selectors = [
      this.firstOrder,
      this.firstOrderGeneric
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ First order clicked");
          await browser.pause(2000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    // Try clicking by dynamic accessibility id
    try {
      const orders = await $$(this.firstOrder);
      if (await orders.length > 0) {
        await orders[0].click();
        console.log("✓ First order clicked (dynamic)");
        await browser.pause(2000);
        return true;
      }
    } catch (error) {
      console.error("Failed to click first order:", error);
    }
    
    return false;
  }

  // Scroll to bottom of order details
  async scrollToBottomOfOrderDetails(): Promise<void> {
    console.log("Scrolling through order details...");
    
    for (let i = 0; i < 5; i++) {
      await SwipeUtils.swipeUp(0.6);
      await browser.pause(500);
    }
    
    console.log("✓ Scrolled to bottom of order details");
  }

  // Click on a specific tab
  async clickTab(tabName: 'All' | 'Pending' | 'Active' | 'Delivered' | 'Cancelled'): Promise<void> {
    console.log(`Clicking on ${tabName} tab...`);
    
    let selector;
    switch(tabName) {
      case 'All':
        selector = this.allTab;
        break;
      case 'Pending':
        selector = this.pendingTab;
        break;
      case 'Active':
        selector = this.activeTab;
        break;
      case 'Delivered':
        selector = this.deliveredTab;
        break;
      case 'Cancelled':
        selector = this.cancelledTab;
        break;
    }
    
    try {
      const element = await $(selector);
      await element.click();
      console.log(`✓ ${tabName} tab clicked`);
      await browser.pause(2000);
    } catch (error) {
      console.error(`Failed to click ${tabName} tab:`, error);
      throw error;
    }
  }

  // Swipe to reveal Cancelled tab
  async swipeToRevealCancelledTab(): Promise<void> {
    console.log("Swiping to reveal Cancelled tab...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      await SwipeUtils.swipeLeftExact(
        width * 0.8,
        height * 0.15,
        width * 0.2,
        height * 0.15,
        800
      );
      
      console.log("✓ Swiped to reveal more tabs");
      await browser.pause(1000);
    } catch (error) {
      console.error("Failed to swipe for Cancelled tab:", error);
    }
  }

  // Navigate through all tabs
  // Navigate through all tabs
  async navigateThroughAllTabs(): Promise<void> {
    console.log("=== Navigating through all order tabs ===");
    
    const tabs: Array<'All' | 'Pending' | 'Active' | 'Delivered' | 'Cancelled'> = 
      ['Pending', 'Active', 'Delivered', 'Cancelled'];
    
    for (const tab of tabs) {
      try {
        // Swipe to reveal Cancelled tab if needed
        if (tab === 'Cancelled') {
          await this.swipeToRevealCancelledTab();
        }
        
        await this.clickTab(tab);
        console.log(`✓ ${tab} tab opened`);
        
        // Wait for orders to load
        await browser.pause(2000);
        
        // Take screenshot of each tab
        await this.takeScreenshot(`orders-${tab.toLowerCase()}`);
        
      } catch (error) {
        console.error(`Error in ${tab} tab:`, error);
        continue;
      }
    }
  }

  // Go back to previous screen
  async goBack(): Promise<boolean> {
    console.log("Going back...");
    
    const selectors = [
      this.backButton,
      this.backButtonAlt,
      this.backButtonByUiSelector,
      this.orderDetailBackButton
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Back button clicked");
          await browser.pause(2000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    console.error("Back button not found");
    return false;
  }
}