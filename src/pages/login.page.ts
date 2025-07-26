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

  // OTP input
  private get otpInput() {
    return '//android.widget.EditText';
  }

  // OTP verification button (if exists)
  private get verifyOTPButton() {
    return '//android.widget.Button[@content-desc="Verify OTP" or @text="Verify OTP"]';
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

  // Search bar selectors (NEW - for verification)
  private get searchBar() {
    return '//android.widget.ImageView[@content-desc="Search for \'milk\'"]';
  }
  
  private get searchBarByAccessibility() {
    return '~Search for \'milk\'';
  }
  
  private get searchBarByUiSelector() {
    return 'android=new UiSelector().description("Search for \'milk\'")';
  }

  // Address selectors
  private get homeAddressOption() {
    return '//android.view.View[@content-desc="HOME\nXWMC+JQX, Bargadi Magath, Uttar Pradesh, 226201"]';
  }
  
  private get homeAddressAlternative() {
    return '//android.view.View[contains(@content-desc, "HOME") and contains(@content-desc, "Bargadi Magath")]';
  }
  
  private get homeAddressByText() {
    return '//*[contains(@content-desc, "HOME") and contains(@content-desc, "226201")]';
  }

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

  // Helper to extract OTP from SMS
private async extractOTPFromSMS(): Promise<string | null> {
  console.log("📱 Attempting to extract OTP from SMS...");

  try {
    // Get all available contexts (could be strings or objects depending on driver version)
    const contexts: any[] = await browser.getContexts();

    // Log all contexts for debugging
    console.log("Available contexts:", contexts);

    // Try to find the native app context safely
    const nativeContext = contexts.find((ctx: any) => {
      if (typeof ctx === 'string') {
        return ctx.includes('NATIVE_APP');
      } else if ('id' in ctx && typeof ctx.id === 'string') {
        return ctx.id.includes('NATIVE_APP');
      }
      return false;
    });

    // Switch to native context if found
    if (nativeContext) {
      const contextId = typeof nativeContext === 'string' ? nativeContext : nativeContext.id;
      await browser.switchContext(contextId);
      console.log(`🔁 Switched to context: ${contextId}`);
    } else {
      console.warn("⚠️ Native context not found");
    }

    // OTP regex patterns
    const otpPatterns = [
      /(\d{6})/,
      /OTP.*?(\d{6})/,
      /code.*?(\d{6})/i,
      /verification.*?(\d{6})/i
    ];

    // SMS or notification UI selectors
    const notificationSelectors = [
      '//android.widget.TextView[contains(@text, "OTP")]',
      '//android.widget.TextView[contains(@text, "verification")]',
      '//android.widget.TextView[contains(@text, "code")]'
    ];

    // Attempt OTP extraction
    for (const selector of notificationSelectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          const text = await element.getText();
          for (const pattern of otpPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
              console.log(`✅ OTP found: ${match[1]}`);
              return match[1];
            }
          }
        }
      } catch (e) {
        // Log and skip to next selector
        console.log(`Skipping selector ${selector} due to error:`, e);
      }
    }

    console.log("❌ OTP not found in SMS/notifications");
    return null;
  } catch (error) {
    console.error("🔥 Error extracting OTP:", error);
    return null;
  }
}


  // Wait for OTP autofill or manual entry
  private async waitForOTP(maxWaitTime: number = 30000): Promise<string | null> {
    console.log("⏳ Waiting for OTP...");
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        // Check if OTP input has value
        const otpElement = await $(this.otpInput);
        if (await otpElement.isExisting()) {
          const value = await otpElement.getText();
          if (value && value.length >= 6) {
            console.log("✅ OTP auto-filled detected");
            return value;
          }
        }

        // Check if we've moved to next screen (OTP verified automatically)
        if (await this.isOTPVerified()) {
          console.log("✅ OTP verified automatically");
          return "AUTO_VERIFIED";
        }

        await browser.pause(1000);
      } catch (error) {
        // Continue waiting
      }
    }
    
    return null;
  }

  // Check if OTP is already verified
  private async isOTPVerified(): Promise<boolean> {
    // Check if we're on location screen or home screen
    const locationWidget = await $(this.currentLocationWidget);
    const searchBar = await $(this.searchBar);
    
    return (await locationWidget.isExisting()) || (await searchBar.isExisting());
  }

  // Step 1: Click Profile Icon
  async clickProfileIcon(): Promise<boolean> {
    console.log("\n📍 Step 1: Clicking Profile Icon...");
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
    
    console.error("❌ Failed to find profile icon");
    return false;
  }

  // Step 2: Cancel Google Phone Picker
  async cancelGooglePhonePicker(): Promise<boolean> {
    console.log("\n📍 Step 2: Checking for Google Phone Picker...");
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
    return true;
  }

  // Step 3: Enter Mobile Number
  async enterMobileNumber(mobileNumber: string): Promise<boolean> {
    console.log(`\n📍 Step 3: Entering mobile number: ${mobileNumber}`);
    
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
    console.log("\n📍 Step 4: Clicking Send OTP...");
    
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
          console.log("📱 OTP will be sent to your mobile device");
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

  // Step 5: Handle OTP (Production version)
  async handleOTPProduction(manualOTP?: string): Promise<boolean> {
    console.log(`\n📍 Step 5: Handling OTP in production...`);
    
    try {
      // Wait for OTP screen to load
      await browser.pause(2000);
      
      // First, wait to see if OTP auto-fills
      const autoFilledOTP = await this.waitForOTP(15000); // Wait 15 seconds for auto-fill
      
      if (autoFilledOTP === "AUTO_VERIFIED") {
        console.log("✅ OTP was auto-verified");
        return true;
      }
      
      if (autoFilledOTP && autoFilledOTP !== "AUTO_VERIFIED") {
        console.log("✅ OTP was auto-filled");
        // Check if we need to click verify button
        const verifyBtn = await $(this.verifyOTPButton);
        if (await verifyBtn.isExisting()) {
          await verifyBtn.click();
          console.log("✅ Verify OTP button clicked");
        }
        await browser.pause(3000);
        return true;
      }
      
      // If no auto-fill, try to extract from SMS
      console.log("⚠️ OTP not auto-filled, trying to extract from SMS...");
      const extractedOTP = await this.extractOTPFromSMS();
      
      let otpToUse = extractedOTP || manualOTP;
      
      if (!otpToUse) {
        console.log("⚠️ No OTP found automatically. Please provide OTP manually.");
        // In production, you might want to wait for manual input
        // or implement a more sophisticated SMS reading mechanism
        return false;
      }
      
      // Enter OTP manually
      const input = await $(this.otpInput);
      await input.waitForDisplayed({ timeout: 5000 });
      
      await input.click();
      await browser.pause(500);
      
      await input.clearValue();
      await input.setValue(otpToUse);
      await browser.pause(1000);
      
      console.log("✅ OTP entered manually");
      
      // Check if verify button exists and click it
      const verifyBtn = await $(this.verifyOTPButton);
      if (await verifyBtn.isExisting()) {
        await verifyBtn.click();
        console.log("✅ Verify OTP button clicked");
      }
      
      await browser.pause(3000);
      return true;
      
    } catch (error) {
      console.error("❌ Failed to handle OTP:", error);
      return false;
    }
  }

  // Step 6: Handle Location Not Serving
  async handleLocationNotServing(): Promise<boolean> {
    console.log("\n📍 Step 6: Checking for location service availability...");
    await browser.pause(2000);
    
    try {
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
    console.log("\n📍 Step 7: Clicking on current location...");
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

  // Step 8: Select Address
  async selectAddress(addressType: 'HOME' | 'WORK' = 'WORK'): Promise<boolean> {
    console.log(`\n📍 Step 8: Selecting ${addressType} address...`);
    await browser.pause(2000);
    
    const selectors = this.getAddressSelector(addressType);
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log(`✅ ${addressType} address selected`);
          await browser.pause(3000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    console.error(`❌ Failed to select ${addressType} address`);
    return false;
  }

  // Step 9: Verify Home Page (Updated for search bar)
  async verifyHomePageAfterLogin(): Promise<boolean> {
    console.log("\n📍 Step 9: Verifying successful login and home page...");
    await browser.pause(2000);
    
    try {
      // Check for search bar using multiple selectors
      const searchSelectors = [
        this.searchBar,
        this.searchBarByAccessibility,
        this.searchBarByUiSelector
      ];
      
      for (const selector of searchSelectors) {
        try {
          const element = await $(selector);
          if (await element.isExisting()) {
            console.log("✅ Search bar found - Login successful!");
            return true;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      console.log("❌ Search bar not found");
      return false;
      
    } catch (error) {
      console.error("❌ Home page verification failed:", error);
      return false;
    }
  }

  // Complete Production Login Flow
  async performCompleteLoginProduction(
    mobileNumber: string, 
    manualOTP?: string,
    addressType: 'HOME' | 'WORK' = 'WORK'
  ): Promise<boolean> {
    console.log("\n🚀 === Starting Production Login Flow ===");
    console.log(`📱 Mobile: ${mobileNumber}`);
    console.log(`📍 Address Type: ${addressType}`);
    console.log(`🔐 OTP Mode: ${manualOTP ? 'Manual' : 'Auto-detect'}`);
    
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
      
      // Step 5: Handle OTP (Production)
      if (!await this.handleOTPProduction(manualOTP)) {
        throw new Error("Failed to handle OTP");
      }
      await TestHelpers.takeScreenshot('05-otp-verified');
      
      // Phase 2: Location Selection
      console.log("\n--- Phase 2: Location Selection ---");
      
      // Step 6: Handle Location Not Serving (if needed)
      await this.handleLocationNotServing();
      
      // Step 7: Click Current Location
      if (!await this.clickCurrentLocation()) {
        console.log("ℹ️ Location might already be set or accessible");
      }
      await TestHelpers.takeScreenshot('06-location-clicked');
      
      // Step 8: Select Address
      if (!await this.selectAddress(addressType)) {
        console.log(`ℹ️ ${addressType} address might already be selected`);
      }
      await TestHelpers.takeScreenshot('07-address-selected');
      
      // Step 9: Verify Success
      const success = await this.verifyHomePageAfterLogin();
      await TestHelpers.takeScreenshot('08-login-complete');
      
      if (success) {
        console.log("\n✅ ===========================================");
        console.log("✅ PRODUCTION LOGIN FLOW COMPLETED!");
        console.log(`✅ User logged in with mobile: ${mobileNumber}`);
        console.log(`✅ ${addressType} location selected`);
        console.log("✅ Home page with search bar verified");
        console.log("✅ ===========================================\n");
      } else {
        console.log("\n❌ Login flow completed but verification failed");
      }
      
      return success;
      
    } catch (error) {
      console.error("\n❌ Production login flow failed:", error);
      await TestHelpers.takeScreenshot('login-error');
      return false;
    }
  }

  // Convenience methods for production
  async loginProduction(mobileNumber: string, otp?: string): Promise<boolean> {
    return await this.performCompleteLoginProduction(mobileNumber, otp, 'WORK');
  }
  
  async loginProductionWithHome(mobileNumber: string, otp?: string): Promise<boolean> {
    return await this.performCompleteLoginProduction(mobileNumber, otp, 'HOME');
  }
  
  // Check if user is already logged in (Updated)
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check for search bar
      const searchSelectors = [
        this.searchBar,
        this.searchBarByAccessibility,
        this.searchBarByUiSelector
      ];
      
      for (const selector of searchSelectors) {
        try {
          const element = await $(selector);
          if (await element.isExisting()) {
            console.log("✅ User is already logged in");
            return true;
          }
        } catch (error) {
          // Continue
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
  // Add this method to login.page.ts for cart login flow

// Perform login from cart (only up to OTP entry, no location selection)
async performCartLogin(mobileNumber: string, manualOTP?: string): Promise<boolean> {
  console.log("\n🛒 === Starting Cart Login Flow ===");
  console.log(`📱 Mobile: ${mobileNumber}`);
  console.log(`🔐 OTP Mode: ${manualOTP ? 'Manual' : 'Auto-detect'}`);
  
  try {
    // Step 1: Cancel Google Phone Picker if it appears
    console.log("\n📍 Checking for Google Phone Picker...");
    await this.cancelGooglePhonePicker();
    
    // Step 2: Enter Mobile Number
    console.log("\n📍 Entering mobile number...");
    const mobileEntered = await this.enterMobileNumber(mobileNumber);
    if (!mobileEntered) {
      throw new Error("Failed to enter mobile number");
    }
    await TestHelpers.takeScreenshot('cart-login-01-mobile');
    
    // Step 3: Click Send OTP
    console.log("\n📍 Sending OTP...");
    const otpSent = await this.clickSendOTP();
    if (!otpSent) {
      throw new Error("Failed to send OTP");
    }
    await TestHelpers.takeScreenshot('cart-login-02-otp-sent');
    
    // Step 4: Handle OTP
    console.log("\n📍 Handling OTP...");
    const otpHandled = await this.handleOTPProduction(manualOTP);
    if (!otpHandled) {
      throw new Error("Failed to handle OTP");
    }
    await TestHelpers.takeScreenshot('cart-login-03-otp-entered');
    
    console.log("\n✅ Login steps completed");
    console.log("⏳ Waiting for auto-redirect to My Cart...");
    
    // Don't proceed with location selection - let it auto-redirect
    return true;
    
  } catch (error) {
    console.error("\n❌ Cart login failed:", error);
    await TestHelpers.takeScreenshot('cart-login-error');
    return false;
  }
}

// Check if we're back on cart page after login
async isBackOnCart(): Promise<boolean> {
  try {
    // Wait a bit for redirect
    await browser.pause(2000);
    
    // Check for cart indicators
    const cartIndicators = [
      '//android.widget.TextView[contains(@text, "My Cart")]',
      '//android.widget.Button[@content-desc="Select Address"]',
      '//android.widget.Button[@content-desc="Place Order"]',
      '//*[contains(@text, "Price Details")]'
    ];
    
    for (const selector of cartIndicators) {
      const element = await $(selector);
      if (await element.isExisting()) {
        console.log("✅ Confirmed: Back on My Cart page");
        return true;
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
}
}