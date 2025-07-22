// src/pages/search.page.ts
import { $ } from "@wdio/globals";
import { BasePage } from "./base.page";
import { browser } from "@wdio/globals";

export class SearchPage extends BasePage {
  private readonly searchItems = ["milk", "oil", "biscuit", "soap", "bread"];
  
  // Updated selectors for new UI
  private readonly searchBarHomeSelector = '//android.widget.ImageView[@content-desc="Search for \'milk\'"]';
  private readonly searchInputSelector = 'android.widget.EditText';
  private readonly clearSearchButtonOnProductPageSelector = '//android.widget.EditText[contains(@text, "ml") or contains(@text, "Amul") or contains(@text, "Milk")]/android.widget.Button[2]';
  private readonly clearSearchButtonGenericSelector = 'new UiSelector().className("android.widget.Button").instance(1)';
  private readonly goBackButtonSelector = '//android.widget.EditText/android.widget.Button[1]';
  
  get searchBarHome() {
    return $(this.searchBarHomeSelector);
  }
  
  get searchInput() {
    return $(this.searchInputSelector);
  }
  
  get goBackButton() {
    return $(this.goBackButtonSelector);
  }
  
  async getClearButtonOnProductPage() {
    // Try multiple selectors for the X button
    const selectors = [
      '//android.widget.EditText[contains(@text, "ml") or contains(@text, "gm") or contains(@text, "Rs")]/android.widget.Button[2]',
      '//android.widget.Button[@text="×" or @text="X" or @text="x"]',
      'android=new UiSelector().className("android.widget.Button").instance(1)',
      '(//android.widget.Button)[2]',
      '//android.widget.EditText/../android.widget.Button[2]'
    ];
    
    for (const selector of selectors) {
      try {
        const button = await $(selector);
        if (await button.isExisting() && await button.isDisplayed()) {
          return button;
        }
      } catch (e) {
        continue;
      }
    }
    
    return null;
  }
  
  getFirstAddButton() {
    return $('(//android.view.View[@content-desc="Add"])[1]');
  }
  
  async clickSearchBarFromHome() {
    console.log("Clicking on search bar from home page...");
    await this.waitForElement(this.searchBarHomeSelector, 10000);
    const searchBar = await this.searchBarHome;
    await searchBar.click();
    await browser.pause(2000);
  }
  
  async enterSearchText(text: string) {
    console.log(`Entering search text: ${text}`);
    await this.waitForElement(this.searchInputSelector, 5000);
    const searchInput = await this.searchInput;
    
    // Click on input to ensure it's focused
    await searchInput.click();
    await browser.pause(500);
    
    // Clear any existing text
    await searchInput.clearValue();
    await browser.pause(500);
    
    // Type the search term
    await searchInput.setValue(text);
    await browser.pause(2000); // Wait for suggestions to appear
  }
  
  async clickFirstSuggestion() {
    console.log("Clicking on first product suggestion (not search text)...");
    
    try {
      // Wait for suggestions to appear
      await browser.pause(1500);
      
      // Selectors for actual product suggestions (skip the search text row)
      const suggestionSelectors = [
        // Select first product that contains ml, gm, Rs, or pack
        '//android.widget.ImageView[contains(@content-desc, " ml") or contains(@content-desc, " gm") or contains(@content-desc, " Rs") or contains(@content-desc, "pack")][1]',
        // Specific selector for Amul products
        '//android.widget.ImageView[contains(@content-desc, "Amul")][1]',
        // Try by position - second item in list (first is search text)
        '(//android.widget.ListView//android.widget.ImageView)[2]',
        // Alternative: look for items with product-like descriptions
        '//android.widget.ImageView[contains(@content-desc, " - ")][1]'
      ];
      
      for (const selector of suggestionSelectors) {
        try {
          const suggestion = await $(selector);
          if (await suggestion.isExisting() && await suggestion.isDisplayed()) {
            const desc = await suggestion.getAttribute('content-desc');
            console.log(`✓ Found product suggestion: ${desc}`);
            await suggestion.click();
            console.log("✓ Clicked on product suggestion");
            await browser.pause(2500); // Wait for product page to load
            return true;
          }
        } catch (e) {
          continue;
        }
      }
      
      console.log("⚠️ No product suggestion found, trying coordinates");
      // If selectors don't work, tap on second item position (skip search text)
      await browser.touchAction([
        { action: 'tap', x: 200, y: 450 } // Adjusted Y coordinate to hit second item
      ]);
      await browser.pause(2500);
      return true;
      
    } catch (error) {
      console.log("Error clicking suggestion:", error);
      return false;
    }
  }
  
  private currentItemIndex = 0;
  
  private getCurrentSearchItem(): string {
    return this.searchItems[this.currentItemIndex];
  }
  
  async selectFirstProduct() {
    console.log("Looking for Add button on product page...");
    
    try {
      // Wait for product page to load
      await browser.pause(1500);
      
      // Look for Add button
      const addButton = await this.getFirstAddButton();
      
      if (await addButton.isExisting() && await addButton.isDisplayed()) {
        await addButton.click();
        console.log("✓ Product added");
        await browser.pause(2000);
        
        // After adding, we should see a success indicator (green bar at top)
        await browser.saveScreenshot(`./screenshots/search-product-added-${this.getCurrentSearchItem()}.png`);
        
        return true;
      } else {
        console.log("⚠️ Add button not found");
        return false;
      }
    } catch (error) {
      console.log("⚠️ Could not find add button:", error);
      return false;
    }
  }
  
  async clearSearchFromProductPage() {
    console.log("Clicking X button on product page to go back to search...");
    
    try {
      // Look for the X button on product page
      const clearButton = await this.getClearButtonOnProductPage();
      
      if (clearButton) {
        await clearButton.click();
        console.log("✓ Clicked X button, returning to search page");
        await browser.pause(2000);
        return true;
      }
      
      // If X button not found, try coordinates (usually top right)
      console.log("X button not found, trying tap coordinates");
      await browser.touchAction([
        { action: 'tap', x: 980, y: 260 } // Adjust based on your device
      ]);
      await browser.pause(2000);
      return true;
      
    } catch (error) {
      console.log("Error clicking X button:", error);
      // Fallback to device back
      await browser.back();
      await browser.pause(2000);
      return false;
    }
  }
  
  async clearSearchField() {
    console.log("Clearing search field...");
    
    try {
      // We should now be on search page with recent searches
      await browser.pause(1000);
      
      // Click on search input
      const searchInput = await this.searchInput;
      if (await searchInput.isExisting() && await searchInput.isDisplayed()) {
        await searchInput.click();
        await browser.pause(500);
        await searchInput.clearValue();
        await browser.pause(500);
        console.log("✓ Search field cleared");
      }
    } catch (error) {
      console.log("Error clearing search field:", error);
    }
  }
  
  async searchAndAddProducts() {
    let successfulAdds = 0;
    this.currentItemIndex = 0;
    
    try {
      // Click on search bar from home page
      await this.clickSearchBarFromHome();
      await browser.saveScreenshot('./screenshots/search-01-search-opened.png');
      
      // Process each search item
      for (let i = 0; i < this.searchItems.length; i++) {
        this.currentItemIndex = i;
        const item = this.searchItems[i];
        console.log(`\n--- Searching for item ${i + 1}/${this.searchItems.length}: ${item} ---`);
        
        // Clear search field if not first item
        if (i > 0) {
          await this.clearSearchField();
        }
        
        // Enter search text
        await this.enterSearchText(item);
        await browser.saveScreenshot(`./screenshots/search-02-typed-${item}.png`);
        
        // Click on first suggestion
        const suggestionClicked = await this.clickFirstSuggestion();
        if (!suggestionClicked) {
          console.log(`⚠️ Could not click suggestion for ${item}, skipping...`);
          continue;
        }
        await browser.saveScreenshot(`./screenshots/search-03-products-${item}.png`);
        
        // Select first product
        const added = await this.selectFirstProduct();
        if (added) {
          successfulAdds++;
          await browser.saveScreenshot(`./screenshots/search-04-added-${item}.png`);
        }
        
        // After adding product, click X to go back to search (except for last item)
        if (i < this.searchItems.length - 1) {
          await this.clearSearchFromProductPage();
          await browser.saveScreenshot(`./screenshots/search-05-back-to-search-${item}.png`);
        }
      }
      
      console.log(`\n✓ Successfully added ${successfulAdds} out of ${this.searchItems.length} items`);
      
      // Go back to home page from product page
      await this.goBackFromSearch();
      
      return successfulAdds;
      
    } catch (error) {
      console.error("Error in search and add products:", error);
      await browser.saveScreenshot('./screenshots/search-error.png');
      
      // Try to recover
      try {
        await this.recoverToHome();
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  }
  
  async goBackFromSearch() {
    console.log("\nGoing back to home page...");
    
    try {
      // First click X on product page if we're still there
      const clearButton = await this.getClearButtonOnProductPage();
      if (clearButton) {
        await clearButton.click();
        await browser.pause(1500);
      }
      
      // Now we should be on search page, click back button
      const goBackBtn = await this.goBackButton;
      if (await goBackBtn.isExisting() && await goBackBtn.isDisplayed()) {
        await goBackBtn.click();
        console.log("✓ Clicked go back button");
        await browser.pause(2000);
      } else {
        // Alternative: Use device back button
        console.log("Using device back button");
        await browser.back();
        await browser.pause(2000);
      }
    } catch (error) {
      console.log("Error with go back button, using device back:", error);
      await browser.back();
      await browser.pause(2000);
    }
  }
  
  async recoverToHome() {
    console.log("Attempting to recover to home page...");
    
    for (let i = 0; i < 3; i++) {
      try {
        await browser.back();
        await browser.pause(1500);
        
        // Check if we can see the search bar (indicating we're on home)
        const searchBar = await $(this.searchBarHomeSelector);
        if (await searchBar.isExisting()) {
          console.log("✓ Recovered to home page");
          return;
        }
      } catch (e) {
        continue;
      }
    }
  }
}