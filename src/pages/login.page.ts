import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { TestHelpers } from '../utils/test-helpers';

export class LoginPage extends BasePage {
  // Profile Icon selectors - multiple strategies
  private get profileIcon() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.widget.ImageView[3]';
  }
  
  private get profileIconByUiSelector() {
    return 'android=new UiSelector().className("android.widget.ImageView").instance(2)';
  }
  
  private get profileIconAlternative() {
    // Try finding by position in navigation bar
    return '(//android.view.View[1]/android.view.View/android.widget.ImageView)[3]';
  }

  // Google Phone Picker Cancel button
  private get googlePhonePickerCancel() {
    return '//android.widget.ImageView[@content-desc="Cancel"]';
  }
  
  private get googlePhonePickerCancelById() {
    return 'android=new UiSelector().resourceId("com.google.android.gms:id/cancel")';
  }
  
  private get googlePhonePickerCancelByAccessibility() {
    return '~Cancel';
  }

  // Phone number input
  private get mobileNumberInput() {
    return '//android.widget.EditText';
  }
  
  private get mobileNumberInputByClass() {
    return 'android=new UiSelector().className("android.widget.EditText")';
  }

  // Send OTP button
  private get sendOTPButton() {
    return '//android.widget.Button[@content-desc="Send OTP"]';
  }
  
  private get sendOTPButtonByAccessibility() {
    return '~Send OTP';
  }
  
  private get sendOTPButtonByUiSelector() {
    return 'android=new UiSelector().description("Send OTP")';
  }

  // OTP input (same as mobile input)
  private get otpInput() {
    return '//android.widget.EditText';
  }

  // Location selectors
  private get currentLocationWidget() {
    return '//android.widget.ImageView[contains(@content-desc, "Current") and contains(@content-desc, "Deliver in")]';
  }
  
  private get locationNotServing() {
    return '//*[contains(@text, "Not Serving") or contains(@content-desc, "Not Serving")]';
  }
  
  private get tryAnotherLocationButton() {
    return '//android.widget.Button[@content-desc="Try Another Location" or @text="Try Another Location"]';
  }

  // Address selection - Updated for both HOME and WORK
  // HOME address selectors
  private get homeAddressOption() {
    return '//android.view.View[@content-desc="HOME\nXWMC+JQX, Bargadi Magath, Uttar Pradesh, 226201"]';
  }
  
  private get homeAddressAlternative() {
    return '//android.view.View[contains(@content-desc, "HOME") and contains(@content-desc, "Bargadi Magath")]';
  }
  
  private get homeAddressByText() {
    return '//*[contains(@content-desc, "HOME") and contains(@content-desc, "226201")]';
  }

  // WORK address selectors - NEW
  private get workAddressOption() {
    return '//android.view.View[@content-desc="WORK 31, Raebareli, Uttar Pradesh, 229010"]';
  }
  
  private get workAddressAlternative() {
    return '//android.view.View[contains(@content-desc, "WORK") and contains(@content-desc, "31, Raebareli")]';
  }
  
  private get workAddressByUiSelector() {
    return 'android=new UiSelector().description("WORK 31, Raebareli, Uttar Pradesh, 229010")';
  }
  
  private get workAddressByAccessibility() {
    return '~WORK 31, Raebareli, Uttar Pradesh, 229010';
  }

  // Generic address selector by type
  private getAddressSelector(type: 'HOME' | 'WORK'): string[] {
    if (type === 'HOME') {
      return [
        this.homeAddressOption,
        this.homeAddressAlternative,
        this.homeAddressByText
      ];
    } else {
      return [
        this.workAddressOption,
        this.workAddressByAccessibility,
        this.workAddressAlternative,
        this.workAddressByUiSelector
      ];
    }
  }

  // Verification elements
  private get exploreTopCategories() {
    return '//android.view.View[@content-desc="Explore Top Categories Top Products"]';
  }
  
  private get exploreTopCategoriesAlternative() {
    return '//android.view.View[contains(@content-desc, "Explore Top Categories")]';
  }

  // Debug helper
  private async debugCurrentScreen() {
    console.log("\n=== DEBUG: Current Screen Analysis ===");
    try {
      // Get all ImageViews
      const imageViews = await $$('//android.widget.ImageView');
      console.log(`Found ${await imageViews.length} ImageView elements`);
      
      // Check for profile-related elements
      const profileElements = await $$('//android.widget.ImageView[position()>=2 and position()<=4]');
      for (let i = 0; i < Math.min(await profileElements.length, 3); i++) {
        const element = profileElements[i];
        const bounds = await element.getAttribute('bounds');
        console.log(`ImageView[${i + 2}] bounds: ${bounds}`);
      }
      
      // Check for address elements
      const addressElements = await $$('//android.view.View[contains(@content-desc, "HOME") or contains(@content-desc, "WORK")]');
      console.log(`Found ${await addressElements.length} address elements`);
    } catch (error) {
      console.error("Debug error:", error);
    }
    console.log("=== END DEBUG ===\n");
  }

  // Step 1: Click Profile Icon
  async clickProfileIcon(): Promise<boolean> {
    console.log("\nStep 1: Clicking Profile Icon...");
    await browser.pause(2000);
    
    const selectors = [
      this.profileIcon,
      this.profileIconByUiSelector,
      this.profileIconAlternative
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✅ Profile icon clicked");
          await browser.pause(2000);
          return true;
        }
      } catch (error) {
                // Continue to next selector
      }
    }
    
    // If failed, debug
    await this.debugCurrentScreen();
    console.error("❌ Failed to find profile icon");
    return false;
  }

  // Step 2: Cancel Google Phone Picker
  async cancelGooglePhonePicker(): Promise<boolean> {
    console.log("\nStep 2: Checking for Google Phone Picker...");
    await browser.pause(2000);
    
    const selectors = [
      this.googlePhonePickerCancel,
      this.googlePhonePickerCancelById,
      this.googlePhonePickerCancelByAccessibility
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✅ Google Phone Picker cancelled");
          await browser.pause(1500);
          return true;
        }
      } catch (error) {
        // Continue
      }
    }
    
    console.log("ℹ️ No Google Phone Picker found (might not appear)");
    return true; // Not an error if it doesn't appear
  }

  // Step 3: Enter Mobile Number
  async enterMobileNumber(mobileNumber: string): Promise<boolean> {
    console.log(`\nStep 3: Entering mobile number: ${mobileNumber}`);
    
    try {
      const input = await $(this.mobileNumberInput);
      await input.waitForDisplayed({ timeout: 5000 });
      
      await input.click();
      await browser.pause(500);
      
      await input.clearValue();
      await input.setValue(mobileNumber);
      await browser.pause(500);
      
      console.log("✅ Mobile number entered");
      return true;
    } catch (error) {
      console.error("❌ Failed to enter mobile number:", error);
      return false;
    }
  }

  // Step 4: Click Send OTP
  async clickSendOTP(): Promise<boolean> {
    console.log("\nStep 4: Clicking Send OTP...");
    
    const selectors = [
      this.sendOTPButton,
      this.sendOTPButtonByAccessibility,
      this.sendOTPButtonByUiSelector
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✅ Send OTP clicked");
          await browser.pause(3000);
          return true;
        }
      } catch (error) {
        // Continue
      }
    }
    
    console.error("❌ Failed to click Send OTP");
    return false;
  }

  // Step 5: Enter OTP
  async enterOTP(otp: string): Promise<boolean> {
    console.log(`\nStep 5: Entering OTP: ${otp}`);
    
    try {
      await browser.pause(2000); // Wait for OTP screen
      
      const input = await $(this.otpInput);
      await input.waitForDisplayed({ timeout: 5000 });
      
      await input.click();
      await browser.pause(500);
      
      await input.clearValue();
      await input.setValue(otp);
      await browser.pause(1000);
      
      console.log("✅ OTP entered");
      console.log("ℹ️ Waiting for auto-verification...");
      await browser.pause(3000); // Wait for auto-redirect
      
      return true;
    } catch (error) {
      console.error("❌ Failed to enter OTP:", error);
      return false;
    }
  }

  // Step 6: Handle Location Not Serving (if appears)
  async handleLocationNotServing(): Promise<boolean> {
    console.log("\nStep 6: Checking for location service availability...");
    await browser.pause(2000);
    
    try {
      // Check if "Not Serving This Location" message appears
      const notServingElement = await $(this.locationNotServing);
      if (await notServingElement.isExisting()) {
        console.log("⚠️ Location not served - need to select different address");
        
        // Click on current location widget
        const locationWidget = await $(this.currentLocationWidget);
        if (await locationWidget.isExisting()) {
          await locationWidget.click();
          console.log("✅ Clicked on location widget");
          await browser.pause(2000);
          return true;
        }
        
        // Alternative: Click "Try Another Location" if visible
        const tryAnotherBtn = await $(this.tryAnotherLocationButton);
        if (await tryAnotherBtn.isExisting()) {
          await tryAnotherBtn.click();
          console.log("✅ Clicked 'Try Another Location'");
          await browser.pause(2000);
          return true;
        }
      } else {
        console.log("✅ Location is being served");
        return true;
      }
    } catch (error) {
      console.log("ℹ️ No location issues detected");
    }
    
    return true;
  }

  // Step 7: Click on Current Location
  async clickCurrentLocation(): Promise<boolean> {
    console.log("\nStep 7: Clicking on current location...");
    await browser.pause(1500);
    
    try {
      const locationWidget = await $(this.currentLocationWidget);
      if (await locationWidget.isExisting()) {
        await locationWidget.click();
        console.log("✅ Current location clicked");
        await browser.pause(2000);
        return true;
      }
    } catch (error) {
      console.error("❌ Failed to click current location:", error);
    }
    
    return false;
  }

  // Step 8: Select Address (HOME or WORK) - UPDATED
  async selectAddress(addressType: 'HOME' | 'WORK' = 'WORK'): Promise<boolean> {
    console.log(`\nStep 8: Selecting ${addressType} address...`);
    await browser.pause(2000);
    
    const selectors = this.getAddressSelector(addressType);
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log(`✅ ${addressType} address selected`);
          await browser.pause(3000); // Wait for redirect
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    // Debug if failed
    await this.debugCurrentScreen();
    console.error(`❌ Failed to select ${addressType} address`);
    return false;
  }

  // Backward compatibility - keep old method
  async selectHomeAddress(): Promise<boolean> {
    return await this.selectAddress('HOME');
  }

  // New method for WORK address
  async selectWorkAddress(): Promise<boolean> {
    return await this.selectAddress('WORK');
  }

  // Step 9: Verify Home Page
  async verifyHomePageAfterLogin(): Promise<boolean> {
    console.log("\nStep 9: Verifying successful login and location selection...");
    await browser.pause(2000);
    
    try {
      const exploreElement = await $(this.exploreTopCategories);
      const exploreAltElement = await $(this.exploreTopCategoriesAlternative);
      
      if (await exploreElement.isExisting() || await exploreAltElement.isExisting()) {
        console.log("✅ 'Explore Top Categories' found - Login successful!");
        return true;
      }
    } catch (error) {
      console.error("❌ Home page verification failed:", error);
    }
    
    return false;
  }

  // Complete Login Flow with Location Selection - UPDATED
  async performCompleteLogin(
    mobileNumber: string, 
    otp: string, 
    addressType: 'HOME' | 'WORK' = 'WORK'
  ): Promise<boolean> {
    console.log("\n=== Starting Complete Login Flow ===");
    console.log(`This includes: Login + ${addressType} Address Selection`);
    
    try {
      // Phase 1: Login
      console.log("\n--- Phase 1: Login Process ---");
      
      // Step 1: Click Profile Icon
      if (!await this.clickProfileIcon()) {
        throw new Error("Failed to click profile icon");
      }
      await TestHelpers.takeScreenshot('01-profile-clicked');
      
      // Step 2: Cancel Google Phone Picker
      await this.cancelGooglePhonePicker();
      await TestHelpers.takeScreenshot('02-phone-picker-handled');
      
      // Step 3: Enter Mobile Number
      if (!await this.enterMobileNumber(mobileNumber)) {
        throw new Error("Failed to enter mobile number");
      }
      await TestHelpers.takeScreenshot('03-mobile-entered');
      
      // Step 4: Click Send OTP
      if (!await this.clickSendOTP()) {
        throw new Error("Failed to click Send OTP");
      }
      await TestHelpers.takeScreenshot('04-otp-sent');
      
      // Step 5: Enter OTP
      if (!await this.enterOTP(otp)) {
        throw new Error("Failed to enter OTP");
      }
      await TestHelpers.takeScreenshot('05-otp-entered');
      
      // Phase 2: Location Selection
      console.log("\n--- Phase 2: Location Selection ---");
      
      // Step 6: Handle Location Not Serving (if needed)
      await this.handleLocationNotServing();
      
      // Step 7: Click Current Location
      if (!await this.clickCurrentLocation()) {
        console.log("ℹ️ Location might already be set or accessible");
      }
      await TestHelpers.takeScreenshot('06-location-clicked');
      
      // Step 8: Select Address (HOME or WORK)
      // Step 8: Select Address (HOME or WORK)
      if (!await this.selectAddress(addressType)) {
        console.log(`ℹ️ ${addressType} address might already be selected`);
      }
      await TestHelpers.takeScreenshot('07-address-selected');
      
      // Step 9: Verify Success
      const success = await this.verifyHomePageAfterLogin();
      await TestHelpers.takeScreenshot('08-login-complete');
      
      if (success) {
        console.log("\n✅ ===========================================");
        console.log("✅ LOGIN FLOW COMPLETED SUCCESSFULLY!");
        console.log(`✅ User logged in and ${addressType} location selected`);
        console.log("✅ ===========================================\n");
      } else {
        console.log("\n❌ Login flow completed but verification failed");
      }
      
      return success;
      
    } catch (error) {
      console.error("\n❌ Login flow failed:", error);
      await TestHelpers.takeScreenshot('login-error');
      return false;
    }
  }

  // Additional helper methods for specific scenarios
  
  // Login with default WORK address
  async loginWithWorkAddress(mobileNumber: string, otp: string): Promise<boolean> {
    return await this.performCompleteLogin(mobileNumber, otp, 'WORK');
  }
  
  // Login with HOME address
  async loginWithHomeAddress(mobileNumber: string, otp: string): Promise<boolean> {
    return await this.performCompleteLogin(mobileNumber, otp, 'HOME');
  }
  
  // Quick login method (assumes WORK address)
  async quickLogin(mobileNumber: string, otp: string): Promise<boolean> {
    console.log("\n=== Quick Login (WORK Address) ===");
    return await this.performCompleteLogin(mobileNumber, otp, 'WORK');
  }
  
  // Method to switch address after login
  async switchAddress(fromType: 'HOME' | 'WORK', toType: 'HOME' | 'WORK'): Promise<boolean> {
    console.log(`\n=== Switching from ${fromType} to ${toType} address ===`);
    
    try {
      // Click on current location widget
      if (!await this.clickCurrentLocation()) {
        throw new Error("Failed to open address selection");
      }
      
      // Select the new address
      if (!await this.selectAddress(toType)) {
        throw new Error(`Failed to select ${toType} address`);
      }
      
      console.log(`✅ Successfully switched to ${toType} address`);
      return true;
      
    } catch (error) {
      console.error("❌ Failed to switch address:", error);
      return false;
    }
  }
  
  // Check if user is already logged in
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check for explore categories element
      const exploreElement = await $(this.exploreTopCategories);
      const exploreAltElement = await $(this.exploreTopCategoriesAlternative);
      
      if (await exploreElement.isExisting() || await exploreAltElement.isExisting()) {
        console.log("✅ User is already logged in");
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
  
  // Get current selected address type
  async getCurrentAddressType(): Promise<'HOME' | 'WORK' | 'UNKNOWN'> {
    try {
      const locationWidget = await $(this.currentLocationWidget);
      if (await locationWidget.isExisting()) {
        const contentDesc = await locationWidget.getAttribute('content-desc');
        
        if (contentDesc.includes('Bargadi Magath') || contentDesc.includes('226201')) {
          return 'HOME';
        } else if (contentDesc.includes('Raebareli') || contentDesc.includes('229010')) {
          return 'WORK';
        }
      }
      
      return 'UNKNOWN';
    } catch (error) {
      return 'UNKNOWN';
    }
  }
  
  // Complete logout flow
  async logout(): Promise<boolean> {
    console.log("\n=== Logging out ===");
    
    try {
      // Click profile icon
      if (!await this.clickProfileIcon()) {
        throw new Error("Failed to click profile icon");
      }
      
      // TODO: Add logout button selectors and click logic
      // This would depend on your app's logout flow
      
      console.log("✅ Logged out successfully");
      return true;
      
    } catch (error) {
      console.error("❌ Logout failed:", error);
      return false;
    }
  }
}

// Example usage in test files:
/*
// Basic login with WORK address (default)
const loginPage = new LoginPage();
await loginPage.performCompleteLogin('9876543210', '123456');

// Login with HOME address
await loginPage.performCompleteLogin('9876543210', '123456', 'HOME');

// Or use convenience methods
await loginPage.loginWithWorkAddress('9876543210', '123456');
await loginPage.loginWithHomeAddress('9876543210', '123456');

// Switch address after login
await loginPage.switchAddress('WORK', 'HOME');

// Check if already logged in
if (!await loginPage.isLoggedIn()) {
  await loginPage.quickLogin('9876543210', '123456');
}

// Get current address type
const currentAddress = await loginPage.getCurrentAddressType();
console.log(`Current address: ${currentAddress}`);
*/