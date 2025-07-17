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

  // Address selection
  private get homeAddressOption() {
    return '//android.view.View[@content-desc="HOME 31, Raebareli, Uttar Pradesh, 229010"]';
  }
  
  private get homeAddressAlternative() {
    return '//android.view.View[contains(@content-desc, "HOME") and contains(@content-desc, "Raebareli")]';
  }
  
  private get homeAddressText() {
    return '//*[contains(@content-desc, "HOME") and contains(@content-desc, "31, Raebareli")]';
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

  // Step 8: Select HOME Address
  async selectHomeAddress(): Promise<boolean> {
    console.log("\nStep 8: Selecting HOME address...");
    await browser.pause(2000);
    
    const selectors = [
      this.homeAddressOption,
      this.homeAddressAlternative,
      this.homeAddressText
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✅ HOME address selected");
          await browser.pause(3000); // Wait for redirect
          return true;
        }
      } catch (error) {
        // Continue
      }
    }
    
    console.error("❌ Failed to select HOME address");
    return false;
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

  // Complete Login Flow with Location Selection
  async performCompleteLogin(mobileNumber: string, otp: string): Promise<boolean> {
    console.log("\n=== Starting Complete Login Flow ===");
    console.log("This includes: Login + Location Selection");
    
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
        console.log("ℹ️ Location might already be set");
      }
      await TestHelpers.takeScreenshot('06-location-clicked');
      
      // Step 8: Select HOME Address
      if (!await this.selectHomeAddress()) {
        console.log("ℹ️ HOME address might already be selected");
      }
      await TestHelpers.takeScreenshot('07-address-selected');
      
      // Step 9: Verify Success
      const success = await this.verifyHomePageAfterLogin();
      await TestHelpers.takeScreenshot('08-login-complete');
      
      if (success) {
        console.log("\n✅ ===========================================");
        console.log("✅ LOGIN FLOW COMPLETED SUCCESSFULLY!");
        console.log("✅ User logged in and location selected");
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
}