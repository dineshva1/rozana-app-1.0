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

  
  private get profileButtonAlt() {
    return '~Profile';
  }

  // Edit Profile elements

  
  private get fullNameInputByUiSelector() {
    return 'android=new UiSelector().text("Test")';
  }
  

  
  private get emailInputByUiSelector() {
    return 'android=new UiSelector().text("test@somethibg.com")';
  }
  
 
  
  private get saveButtonAlt() {
    return '~Save';
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
  // Profile button selectors
  private get profileButton() {
    return '//android.widget.Button[@content-desc="Profile"]';
  }
  
  private get profileButtonByAccessibility() {
    return '~Profile';
  }
  
  private get profileButtonByUiSelector() {
    return 'android=new UiSelector().description("Profile")';
  }

  // Edit Profile page elements
  private get fullNameInput() {
    return '//android.widget.EditText[1]'; // First EditText for Full Name
  }
  
  private get fullNameInputByIndex() {
    return 'android=new UiSelector().className("android.widget.EditText").instance(0)';
  }
  
  private get emailInput() {
    return '//android.widget.EditText[2]'; // Second EditText for Email
  }
  
  private get emailInputByIndex() {
    return 'android=new UiSelector().className("android.widget.EditText").instance(1)';
  }
  
  // Dynamic selectors for existing values
  private getFullNameInputWithText(text: string) {
    return `//android.widget.EditText[@text="${text}"]`;
  }
  
  private getEmailInputWithText(text: string) {
    return `//android.widget.EditText[@text="${text}"]`;
  }

  // Save button selectors
  private get saveButton() {
    return '//android.widget.Button[@content-desc="Save"]';
  }
  
  private get saveButtonByAccessibility() {
    return '~Save';
  }
  
  private get saveButtonByUiSelector() {
    return 'android=new UiSelector().description("Save")';
  }

  // Close button (if needed)
  private get closeButton() {
    return '//android.widget.Button[@content-desc="Close" or @text="Close"]';
  }

  // Edit Profile Header
  private get editProfileHeader() {
    return '//*[@text="Edit Profile" or contains(@content-desc, "Edit Profile")]';
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
   // Click on Profile button to open Edit Profile page
  async clickProfile(): Promise<boolean> {
    console.log("\n📍 Clicking on Profile button to open Edit Profile...");
    
    const selectors = [
      this.profileButton,
      this.profileButtonByAccessibility,
      this.profileButtonByUiSelector
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✅ Profile button clicked");
          await browser.pause(2000);
          
          // Verify Edit Profile page opened
          const editProfileHeader = await $(this.editProfileHeader);
          if (await editProfileHeader.isExisting()) {
            console.log("✅ Edit Profile page opened");
          }
          
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    console.error("❌ Failed to click Profile button");
    return false;
  }

  // Clear and update Full Name field
  private async updateFullName(newName: string): Promise<boolean> {
    console.log(`\n📝 Updating Full Name to: ${newName}`);
    
    try {
      // Try multiple selectors for the full name input
      const selectors = [
        this.fullNameInput,
        this.fullNameInputByIndex
      ];
      
      for (const selector of selectors) {
        try {
          const element = await $(selector);
          if (await element.isExisting()) {
            // Click on the field
            await element.click();
            await browser.pause(500);
            
            // Clear existing value
            await element.clearValue();
            await browser.pause(500);
            
            // Enter new value
            await element.setValue(newName);
            await browser.pause(500);
            
            console.log("✅ Full Name updated");
            return true;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      console.error("❌ Failed to update Full Name");
      return false;
    } catch (error) {
      console.error("Error updating full name:", error);
      return false;
    }
  }

  // Clear and update Email field
  private async updateEmail(newEmail: string): Promise<boolean> {
    console.log(`\n📧 Updating Email to: ${newEmail}`);
    
    try {
      // Try multiple selectors for the email input
      const selectors = [
        this.emailInput,
        this.emailInputByIndex
      ];
      
      for (const selector of selectors) {
        try {
          const element = await $(selector);
          if (await element.isExisting()) {
            // Click on the field
            await element.click();
            await browser.pause(500);
            
            // Clear existing value
            await element.clearValue();
            await browser.pause(500);
            
            // Enter new value
            await element.setValue(newEmail);
            await browser.pause(500);
            
            // Hide keyboard if visible
            try {
              await browser.hideKeyboard();
            } catch (e) {
              // Keyboard might not be visible
            }
            
            console.log("✅ Email updated");
            return true;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      console.error("❌ Failed to update Email");
      return false;
    } catch (error) {
      console.error("Error updating email:", error);
      return false;
    }
  }

  // Click Save button
  private async clickSave(): Promise<boolean> {
    console.log("\n💾 Clicking Save button...");
    
    const selectors = [
      this.saveButton,
      this.saveButtonByAccessibility,
      this.saveButtonByUiSelector
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✅ Save button clicked");
          await browser.pause(2000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    console.error("❌ Failed to click Save button");
    return false;
  }

  // Complete profile update flow
  async updateProfileDetails(newName: string, newEmail: string): Promise<boolean> {
    console.log("\n=== Starting Profile Update ===");
    console.log(`New Name: ${newName}`);
    console.log(`New Email: ${newEmail}`);
    
    try {
      // Update Full Name
      if (!await this.updateFullName(newName)) {
        throw new Error("Failed to update full name");
      }
      
      // Update Email
      if (!await this.updateEmail(newEmail)) {
        throw new Error("Failed to update email");
      }
      
      // Save changes
      if (!await this.clickSave()) {
        throw new Error("Failed to save profile changes");
      }
      
      console.log("✅ Profile updated successfully");
      
      // Wait for save operation to complete
      await browser.pause(2000);
      
      // Verify we're back on profile page
      const profileDisplayed = await this.isProfilePageDisplayed();
      if (profileDisplayed) {
        console.log("✅ Returned to profile page after save");
      }
      
      return true;
      
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      
      // Try to close if still on edit page
      try {
        const closeBtn = await $(this.closeButton);
        if (await closeBtn.isExisting()) {
          await closeBtn.click();
          console.log("ℹ️ Closed edit profile page");
        }
      } catch (e) {
        // Ignore if close button not found
      }
      
      return false;
    }
  }

  // Generate random profile data
  generateRandomProfileData(): { name: string; email: string } {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    
    return {
      name: `TestUser${randomNum}`,
      email: `testuser${timestamp}@example.com`
    };
  }

  // Update profile with random data
  async updateProfileWithRandomData(): Promise<boolean> {
    const randomData = this.generateRandomProfileData();
    console.log("\n🎲 Updating profile with random data:");
    console.log(`Name: ${randomData.name}`);
    console.log(`Email: ${randomData.email}`);
    
    return await this.updateProfileDetails(randomData.name, randomData.email);
  }

  // Get current profile values (for verification)
  async getCurrentProfileValues(): Promise<{ name: string | null; email: string | null }> {
    try {
      let currentName = null;
      let currentEmail = null;
      
      // Try to get current name
      try {
        const nameElement = await $(this.fullNameInput);
        if (await nameElement.isExisting()) {
          currentName = await nameElement.getText();
        }
      } catch (e) {
        // Continue
      }
      
      // Try to get current email
      try {
        const emailElement = await $(this.emailInput);
        if (await emailElement.isExisting()) {
          currentEmail = await emailElement.getText();
        }
      } catch (e) {
        // Continue
      }
      
      return { name: currentName, email: currentEmail };
      
    } catch (error) {
      console.error("Error getting current profile values:", error);
      return { name: null, email: null };
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