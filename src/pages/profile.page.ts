// src/pages/profile.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class ProfilePage extends BasePage {
  // Profile Tab selectors
  private get profileTab() {
    return '//android.widget.ImageView[@content-desc="Profile Tab 4 of 4"]';
  }
  
  private get profileTabByInstance() {
    return 'android=new UiSelector().className("android.widget.ImageView").instance(2)';
  }
  
  private get profileTabByXpath() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.widget.ImageView[3]';
  }

  // Profile page elements
  private get yourOrdersCard() {
    return '//android.widget.Button[@content-desc="Your Orders"]';
  }

  private get yourOrdersCardAlt() {
    return '~Your Orders';
  }
  
  private get yourOrdersCardByUiSelector() {
    return 'android=new UiSelector().description("Your Orders")';
  }

  // Saved Addresses
  private get savedAddressesButton() {
    return '//android.widget.Button[contains(@content-desc, "Saved Addresses")]';
  }
  
  private get savedAddressesButtonAlt() {
    return '~Saved Addresses\n3 Addresses';
  }
  
  private get savedAddressesButtonByUiSelector() {
    return 'android=new UiSelector().description("Saved Addresses 3 Addresses")';
  }

  // Back button from addresses
  private get backButtonFromAddresses() {
    return '//android.widget.Button[@content-desc="Back"]';
  }
  
  private get backButtonFromAddressesAlt() {
    return '~Back';
  }

  // Profile button
  private get profileButton() {
    return '//android.widget.Button[@content-desc="Profile"]';
  }
  
  private get profileButtonAlt() {
    return '~Profile';
  }

  // Edit Profile elements
  private get fullNameInput() {
    return '//android.widget.EditText[@text="Test"]';
  }
  
  private get fullNameInputByUiSelector() {
    return 'android=new UiSelector().text("Test")';
  }
  
  private get emailInput() {
    return '//android.widget.EditText[@text="test@somethibg.com"]';
  }
  
  private get emailInputByUiSelector() {
    return 'android=new UiSelector().text("test@somethibg.com")';
  }
  
  private get saveButton() {
    return '//android.widget.Button[@content-desc="Save"]';
  }
  
  private get saveButtonAlt() {
    return '~Save';
  }
  
  private get closeButton() {
    return '//android.widget.Button[@content-desc="Close"]';
  }
  
  private get closeButtonAlt() {
    return '~Close';
  }

  // Logout button
  private get logoutButton() {
    return '//android.widget.Button[@content-desc="Logout"]';
  }
  
  private get logoutButtonAlt() {
    return '~Logout';
  }
  
  private get logoutButtonByUiSelector() {
    return 'android=new UiSelector().description("Logout")';
  }

  // Language selectors (from previous implementation)
  private get languageButtonEnglish() {
    return '//android.widget.Button[@content-desc="Language\nEnglish"]';
  }

  private get languageButtonHindi() {
    return '//android.widget.Button[@content-desc="Language\nहिंदी"]';
  }

  private get languageButtonGeneric() {
    return '//android.widget.Button[contains(@content-desc, "Language") or contains(@content-desc, "भाषा")]';
  }

  private get englishDropdownOption() {
    return '//android.widget.Button[@content-desc="English"]';
  }

  private get hindiDropdownOption() {
    return '//android.widget.Button[@content-desc="हिंदी"]';
  }

  private get homeTab() {
    return '//android.widget.ImageView[@content-desc="Home Tab 1 of 4"]';
  }

  // Navigate to Profile
  async navigateToProfile(): Promise<boolean> {
    console.log("Navigating to Profile tab...");
    
    const selectors = [
      this.profileTab,
      this.profileTabByInstance,
      this.profileTabByXpath
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Profile tab clicked");
          await browser.pause(2000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    console.error("Profile tab not found");
    await this.takeScreenshot('profile-navigation-failed');
    return false;
  }

  // Check if profile page is displayed
  async isProfilePageDisplayed(): Promise<boolean> {
    try {
      const selectors = [
        this.yourOrdersCard,
        this.yourOrdersCardAlt,
        this.yourOrdersCardByUiSelector
      ];
      
      for (const selector of selectors) {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }

  // Click on Your Orders
  async clickYourOrders(): Promise<void> {
    console.log("Clicking on Your Orders...");
    
    const selectors = [
      this.yourOrdersCard,
      this.yourOrdersCardAlt,
      this.yourOrdersCardByUiSelector
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Your Orders clicked");
          await browser.pause(2000);
          return;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    throw new Error("Your Orders card not found");
  }

  // Click on Saved Addresses
  async clickSavedAddresses(): Promise<void> {
    console.log("Clicking on Saved Addresses...");
    
    const selectors = [
      this.savedAddressesButton,
      this.savedAddressesButtonAlt,
      this.savedAddressesButtonByUiSelector
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Saved Addresses clicked");
          await browser.pause(2000);
          return;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    throw new Error("Saved Addresses button not found");
  }

  // Go back from addresses
  async goBackFromAddresses(): Promise<void> {
    console.log("Going back from addresses...");
    
    try {
      let element = await $(this.backButtonFromAddresses);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Back button clicked");
        await browser.pause(1500);
        return;
      }
      
      element = await $(this.backButtonFromAddressesAlt);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Back button clicked (alt)");
        await browser.pause(1500);
        return;
      }
      
      throw new Error("Back button not found");
    } catch (error) {
      console.error("Failed to go back:", error);
      throw error;
    }
  }

  // Click on Profile button
  async clickProfile(): Promise<void> {
    console.log("Clicking on Profile button...");
    
    try {
      let element = await $(this.profileButton);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Profile button clicked");
        await browser.pause(2000);
        return;
      }
      
      element = await $(this.profileButtonAlt);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Profile button clicked (alt)");
        await browser.pause(2000);
        return;
      }
      
      throw new Error("Profile button not found");
    } catch (error) {
      console.error("Failed to click Profile:", error);
      throw error;
    }
  }

  // Update profile details
  async updateProfileDetails(fullName: string, email: string): Promise<boolean> {
    console.log(`Updating profile: Name=${fullName}, Email=${email}`);
    
    try {
      // Update Full Name
      let nameInput = await $(this.fullNameInput);
      if (!await nameInput.isExisting()) {
        nameInput = await $(this.fullNameInputByUiSelector);
      }
      
      await nameInput.clearValue();
      await nameInput.setValue(fullName);
      console.log("✓ Full name updated");
      
      // Update Email
      let emailInput = await $(this.emailInput);
      if (!await emailInput.isExisting()) {
        emailInput = await $(this.emailInputByUiSelector);
      }
      
      await emailInput.clearValue();
      await emailInput.setValue(email);
      console.log("✓ Email updated");
      
      // Click Save
      let saveBtn = await $(this.saveButton);
      if (!await saveBtn.isExisting()) {
        saveBtn = await $(this.saveButtonAlt);
      }
      
      await saveBtn.click();
      console.log("✓ Save button clicked");
      await browser.pause(2000);
      
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return false;
    }
  }

  // Close edit profile
  async closeEditProfile(): Promise<void> {
    console.log("Closing edit profile...");
    
    try {
      let element = await $(this.closeButton);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Close button clicked");
        await browser.pause(1500);
        return;
      }
      
      element = await $(this.closeButtonAlt);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Close button clicked (alt)");
        await browser.pause(1500);
        return;
      }
      
      throw new Error("Close button not found");
    } catch (error) {
      console.error("Failed to close edit profile:", error);
      throw error;
    }
  }

  // Scroll to bottom
  async scrollToBottom(): Promise<void> {
    console.log("Scrolling to bottom...");
    
    for (let i = 0; i < 5; i++) {
      await SwipeUtils.swipeUp(0.6);
      await browser.pause(300);
    }
    
    await browser.pause(1000);
  }

  // Logout
  async logout(): Promise<boolean> {
    console.log("Logging out...");
    
    const selectors = [
      this.logoutButton,
      this.logoutButtonAlt,
      this.logoutButtonByUiSelector
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Logout button clicked");
          await browser.pause(3000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    console.error("Logout button not found");
    return false;
  }

  // Get current language
  async getCurrentLanguage(): Promise<'English' | 'Hindi' | 'Unknown'> {
    try {
      // Check for language buttons
      if (await $(this.languageButtonEnglish).isDisplayed()) {
        return 'English';
      }
      if (await $(this.languageButtonHindi).isDisplayed()) {
        return 'Hindi';
      }
      
      // Check generic button
      const genericButton = await $(this.languageButtonGeneric);
      if (await genericButton.isDisplayed()) {
        const text = await genericButton.getAttribute('content-desc');
        if (text.includes('English')) return 'English';
        if (text.includes('हिंदी')) return 'Hindi';
      }
      
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  // Scroll to find language option
  async scrollToLanguageOption(): Promise<boolean> {
    console.log("Scrolling to find Language option...");
    
    let maxScrolls = 8;
    let scrollCount = 0;
    
    // First try to find without scrolling
    const currentLang = await this.getCurrentLanguage();
    if (currentLang !== 'Unknown') {
      console.log(`✓ Language option already visible: ${currentLang}`);
      return true;
    }
    
    while (scrollCount < maxScrolls) {
      try {
        const currentLang = await this.getCurrentLanguage();
        if (currentLang !== 'Unknown') {
          console.log(`✓ Language option found: ${currentLang}`);
          return true;
        }
      } catch {
        // Continue scrolling
      }
      
      await SwipeUtils.swipeUp(0.4);
      scrollCount++;
      await browser.pause(500);
    }
    
    console.error("Could not find Language option after scrolling");
    return false;
  }

  // Change language (reusing existing implementation)
  async changeLanguage(toLanguage: 'Hindi' | 'English'): Promise<void> {
    console.log(`Changing language to ${toLanguage}...`);
    
    try {
      const currentLang = await this.getCurrentLanguage();
      console.log(`Current language: ${currentLang}`);
      
      if (currentLang === toLanguage) {
        console.log(`Language is already set to ${toLanguage}`);
        return;
      }
      
      // Click on language button
      const genericButton = await $(this.languageButtonGeneric);
      await genericButton.click();
      console.log("✓ Language dropdown opened");
      await browser.pause(1500);
      
      // Select the desired language
      if (toLanguage === 'Hindi') {
        const hindiOption = await $(this.hindiDropdownOption);
        await hindiOption.waitForDisplayed({ timeout: 5000 });
        await hindiOption.click();
        console.log("✓ Hindi selected");
      } else {
        const englishOption = await $(this.englishDropdownOption);
        await englishOption.waitForDisplayed({ timeout: 5000 });
        await englishOption.click();
        console.log("✓ English selected");
      }
      
      await browser.pause(3000);
      console.log(`✓ Language changed to ${toLanguage}`);
      
    } catch (error) {
      console.error(`Failed to change language: ${error}`);
      throw error;
    }
  }

  // Navigate to Home
  async navigateToHome(): Promise<boolean> {
    console.log("Navigating to Home tab...");
    
    try {
      const element = await $(this.homeTab);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Home tab clicked");
        await browser.pause(2000);
        return true;
      }
      
      console.error("Home tab not found");
      return false;
    } catch (error) {
      console.error("Failed to navigate to Home:", error);
      return false;
    }
  }

  // Scroll to top
  async scrollToTop(): Promise<void> {
    console.log("Scrolling to top...");
    
    for (let i = 0; i < 5; i++) {
      await SwipeUtils.swipeDown(0.4);
      await browser.pause(300);
    }
    
    await browser.pause(1000);
  }
}