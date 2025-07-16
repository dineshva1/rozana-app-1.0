// src/pages/home.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class HomePage extends BasePage {
  // Search bar selectors - robust for any search term
  private get searchBar() { 
    return '//android.widget.EditText[contains(@text, "Search for")]'; 
  }
  
  private get searchBarByAccessibility() {
    return '//android.widget.ImageView[contains(@content-desc, "Search for")]';
  }
  
  // Location selectors - robust for any location
  private get currentLocation() {
    return '//android.widget.ImageView[contains(@content-desc, "Current") and contains(@content-desc, "Deliver in")]';
  }
  
  private get currentLocationAlternative() {
    return '//android.widget.ImageView[contains(@content-desc, "Current Deliver in")]';
  }
  
  // Navigation tabs - multiple selector strategies
  private get homeTab() { 
    return '//android.widget.ImageView[@content-desc="Home Tab 1 of 4"]'; 
  }
  
  private get homeTabFlexible() {
    // Handle potential line breaks or formatting differences
    return '//android.widget.ImageView[contains(@content-desc, "Home") and contains(@content-desc, "Tab 1 of 4")]';
  }
  
  private get homeTabAnyElement() {
    // Try any element type with Home Tab text
    return '//*[contains(@content-desc, "Home") and contains(@content-desc, "Tab 1 of 4")]';
  }
  
  private get categoriesTab() {
    return '//android.widget.ImageView[@content-desc="Categories Tab 2 of 4"]';
  }
  
  private get categoriesTabFlexible() {
    return '//android.widget.ImageView[contains(@content-desc, "Categories") and contains(@content-desc, "Tab 2 of 4")]';
  }
  
  private get categoriesTabAnyElement() {
    return '//*[contains(@content-desc, "Categories") and contains(@content-desc, "Tab 2 of 4")]';
  }
  
  private get orderAgainTab() {
    return '//android.widget.ImageView[@content-desc="Order Again Tab 3 of 4"]';
  }
  
  private get myBagTab() {
    return '//android.widget.ImageView[@content-desc="My Bag Tab 4 of 4"]';
  }

  async isSearchBarDisplayed(): Promise<boolean> {
    try {
      const searchBarExists = 
        await this.isElementExisting(this.searchBar) || 
        await this.isElementExisting(this.searchBarByAccessibility);
      
      return searchBarExists;
    } catch (error) {
      console.error('Error checking search bar:', error);
      return false;
    }
  }

  async isLocationDisplayed(): Promise<boolean> {
    try {
      const locationExists = 
        await this.isElementExisting(this.currentLocation) || 
        await this.isElementExisting(this.currentLocationAlternative);
      
      return locationExists;
    } catch (error) {
      console.error('Error checking location:', error);
      return false;
    }
  }

  async getLocationText(): Promise<string> {
    try {
      let locationElement;
      
      if (await this.isElementExisting(this.currentLocation)) {
        locationElement = await this.findElement(this.currentLocation);
      } else if (await this.isElementExisting(this.currentLocationAlternative)) {
        locationElement = await this.findElement(this.currentLocationAlternative);
      }
      
      if (locationElement) {
        const contentDesc = await locationElement.getAttribute('content-desc');
        return contentDesc || '';
      }
      
      return '';
    } catch (error) {
      console.error('Error getting location text:', error);
      return '';
    }
  }

  async isHomeTabDisplayed(): Promise<boolean> {
    try {
      const homeTabExists = 
        await this.isElementExisting(this.homeTab) ||
        await this.isElementExisting(this.homeTabFlexible) ||
        await this.isElementExisting(this.homeTabAnyElement);
      
      return homeTabExists;
    } catch (error) {
      console.error('Error checking home tab:', error);
      return false;
    }
  }

  async isCategoriesTabDisplayed(): Promise<boolean> {
    try {
      const categoriesTabExists = 
        await this.isElementExisting(this.categoriesTab) ||
        await this.isElementExisting(this.categoriesTabFlexible) ||
        await this.isElementExisting(this.categoriesTabAnyElement);
      
      return categoriesTabExists;
    } catch (error) {
      console.error('Error checking categories tab:', error);
      return false;
    }
  }

  async verifyHomePageElements(): Promise<{
    searchBar: boolean;
    location: boolean;
    homeTab: boolean;
    categoriesTab: boolean;
  }> {
    console.log("Verifying home page elements...");
    
    const results = {
      searchBar: await this.isSearchBarDisplayed(),
      location: await this.isLocationDisplayed(),
      homeTab: await this.isHomeTabDisplayed(),
      categoriesTab: await this.isCategoriesTabDisplayed()
    };
    
    console.log(`Search Bar present: ${results.searchBar}`);
    console.log(`Location present: ${results.location}`);
    console.log(`Home Tab present: ${results.homeTab}`);
    console.log(`Categories Tab present: ${results.categoriesTab}`);
    
    if (results.location) {
      const locationText = await this.getLocationText();
      console.log(`Location text: ${locationText}`);
    }
    
    return results;
  }

async debugNavigationTabs() {
  console.log("\n=== DEBUG: Searching for Navigation Tabs ===");
  try {
    // Find all ImageView elements
    const imageViews = await $$('//android.widget.ImageView[@content-desc]');
    const imageViewCount = await imageViews.length; // await the length
    console.log(`Found ${imageViewCount} ImageView elements with content-desc`);
    
    // Check first 10 ImageViews for tab-related content
    for (let i = 0; i < Math.min(imageViewCount, 10); i++) {
      const contentDesc = await imageViews[i].getAttribute('content-desc');
      if (contentDesc && (contentDesc.includes('Tab') || contentDesc.includes('Home') || contentDesc.includes('Categories'))) {
        console.log(`ImageView[${i}] content-desc: "${contentDesc}"`);
      }
    }
    
    // Also check for any element with Tab in content-desc
    const tabElements = await $$('//*[contains(@content-desc, "Tab")]');
    const tabElementCount = await tabElements.length; // await the length
    console.log(`\nFound ${tabElementCount} elements with "Tab" in content-desc`);
    
    for (let i = 0; i < Math.min(tabElementCount, 5); i++) {
      const tagName = await tabElements[i].getTagName();
      const contentDesc = await tabElements[i].getAttribute('content-desc');
      console.log(`${tagName}[${i}] content-desc: "${contentDesc}"`);
    }
  } catch (error) {
    console.error('Error in debug:', error);
  }
  console.log("=== END DEBUG ===\n");
}

  async waitForHomePageToLoad(): Promise<boolean> {
    console.log("Waiting for home page to load...");
    
    try {
      await browser.waitUntil(
        async () => await this.isSearchBarDisplayed(),
        {
          timeout: 15000,
          timeoutMsg: 'Search bar did not appear within 15 seconds'
        }
      );
      
      await browser.pause(2000);
      
      console.log("Home page loaded successfully");
      return true;
    } catch (error) {
      console.error('Error waiting for home page:', error);
      return false;
    }
  }

  async isHomePageFullyLoaded(): Promise<boolean> {
    const elements = await this.verifyHomePageElements();
    return elements.searchBar && 
           elements.location && 
           elements.homeTab && 
           elements.categoriesTab;
  }
}