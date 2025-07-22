// src/pages/home.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class HomePage extends BasePage {
  // Priority 1: Profile icon - most reliable and quickest to find
  private get profileIcon() {
    return '//android.widget.ImageView[@instance="2" or position()=3][parent::android.view.View]';
  }
  
  private get profileIconByUiAutomator() {
    return 'android=new UiSelector().className("android.widget.ImageView").instance(2)';
  }

  // Priority 2: Switch language icon
  private get switchLanguageIcon() {
    return '//android.widget.ImageView[@instance="1" or position()=2][parent::android.view.View]';
  }
  
  private get switchLanguageByUiAutomator() {
    return 'android=new UiSelector().className("android.widget.ImageView").instance(1)';
  }

  // Priority 3: Search bar
  private get searchBar() { 
    return '//android.widget.EditText[contains(@text, "Search for")]'; 
  }

  // Priority 4: Bottom navigation - Home tab
  private get homeTab() {
    return '//*[@text="Home" or @content-desc="Home"][parent::*[contains(@resource-id, "tab") or contains(@class, "Tab")]]';
  }

  // Quick check for profile icon only
  private async isProfileIconDisplayed(): Promise<boolean> {
    try {
      // Try UiAutomator first (faster)
      if (await this.isElementExisting(this.profileIconByUiAutomator)) {
        return true;
      }
      // Fallback to xpath
      return await this.isElementExisting(this.profileIcon);
    } catch (error) {
      return false;
    }
  }

  // Quick check for switch language icon
  private async isSwitchLanguageDisplayed(): Promise<boolean> {
    try {
      // Try UiAutomator first (faster)
      if (await this.isElementExisting(this.switchLanguageByUiAutomator)) {
        return true;
      }
      // Fallback to xpath
      return await this.isElementExisting(this.switchLanguageIcon);
    } catch (error) {
      return false;
    }
  }

  // Quick check for search bar
  private async isSearchBarDisplayed(): Promise<boolean> {
    try {
      return await this.isElementExisting(this.searchBar);
    } catch (error) {
      return false;
    }
  }

  // Quick check for home tab
  private async isHomeTabDisplayed(): Promise<boolean> {
    try {
      return await this.isElementExisting(this.homeTab);
    } catch (error) {
      return false;
    }
  }

  // Optimized home page detection - stops at first found element
  async isHomePageDisplayed(): Promise<boolean> {
    try {
      // Check in priority order - stop at first match
      
      // 1. Profile icon (fastest and most reliable)
      if (await this.isProfileIconDisplayed()) {
        console.log("Home page detected via Profile icon");
        return true;
      }
      
      // 2. Switch language icon
      if (await this.isSwitchLanguageDisplayed()) {
        console.log("Home page detected via Switch Language icon");
        return true;
      }
      
      // 3. Search bar
      if (await this.isSearchBarDisplayed()) {
        console.log("Home page detected via Search bar");
        return true;
      }
      
      // 4. Home tab (last resort)
      if (await this.isHomeTabDisplayed()) {
        console.log("Home page detected via Home tab");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if home page is displayed:', error);
      return false;
    }
  }

  // Fast wait for home page - checks profile icon first
  async waitForHomePageToLoad(): Promise<boolean> {
    console.log("Waiting for home page to load...");
    
    try {
      // Wait for profile icon first (most reliable)
      await browser.waitUntil(
        async () => {
          // Quick check for profile icon
          if (await this.isProfileIconDisplayed()) {
            return true;
          }
          // If not found, check other elements
          return await this.isHomePageDisplayed();
        },
        {
          timeout: 15000,
          timeoutMsg: 'Home page did not load within 15 seconds',
          interval: 500 // Check every 500ms
        }
      );
      
      // Small pause to ensure page is stable
      await browser.pause(1000);
      
      console.log("Home page loaded successfully");
      return true;
    } catch (error) {
      console.error('Error waiting for home page:', error);
      return false;
    }
  }

  // Get all available home page elements (for debugging)
  async getAvailableHomeElements(): Promise<{
    profile: boolean;
    switchLanguage: boolean;
    searchBar: boolean;
    homeTab: boolean;
  }> {
    return {
      profile: await this.isProfileIconDisplayed(),
      switchLanguage: await this.isSwitchLanguageDisplayed(),
      searchBar: await this.isSearchBarDisplayed(),
      homeTab: await this.isHomeTabDisplayed()
    };
  }

  // Quick verification - just checks if we're on home page
  async verifyHomePage(): Promise<boolean> {
    return await this.isHomePageDisplayed();
  }
}