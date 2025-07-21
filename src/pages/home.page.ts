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

  async isHomePageDisplayed(): Promise<boolean> {
    try {
      // Check if either search bar or location is displayed
      // This indicates we're on the home page
      const searchBarDisplayed = await this.isSearchBarDisplayed();
      const locationDisplayed = await this.isLocationDisplayed();
      
      return searchBarDisplayed || locationDisplayed;
    } catch (error) {
      console.error('Error checking if home page is displayed:', error);
      return false;
    }
  }

  async verifyHomePageElements(): Promise<{
    searchBar: boolean;
    location: boolean;
  }> {
    console.log("Verifying home page elements...");
    
    const results = {
      searchBar: await this.isSearchBarDisplayed(),
      location: await this.isLocationDisplayed()
    };
    
    console.log(`Search Bar present: ${results.searchBar}`);
    console.log(`Location present: ${results.location}`);
    
    if (results.location) {
      const locationText = await this.getLocationText();
      console.log(`Location text: ${locationText}`);
    }
    
    return results;
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
    return elements.searchBar && elements.location;
  }
}