"""
Selenium Automation Module
Simulates automatic order placement workflow after order confirmation.
"""
import time
import os
import sys

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("Warning: Selenium not installed. Run: pip install selenium")


class OrderAutomation:
    """Automates the order placement workflow using Selenium"""

    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.driver = None

    def setup_driver(self):
        """Initialize Chrome WebDriver"""
        if not SELENIUM_AVAILABLE:
            raise RuntimeError("Selenium is not installed. Run: pip install selenium")

        options = Options()
        options.add_argument('--start-maximized')
        options.add_argument('--disable-notifications')
        # options.add_argument('--headless')  # Uncomment for headless mode

        try:
            self.driver = webdriver.Chrome(options=options)
            self.driver.implicitly_wait(10)
            print("✅ Chrome WebDriver initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize WebDriver: {e}")
            print("Make sure Chrome and ChromeDriver are installed.")
            raise

    def simulate_order_placement(self, order_data=None):
        """
        Simulate the complete order placement workflow:
        1. Navigate to the app
        2. Browse menu
        3. Add items to cart
        4. Fill checkout form
        5. Submit order
        6. Verify success
        """
        if not self.driver:
            self.setup_driver()

        results = {
            'steps': [],
            'success': False,
            'order_id': None
        }

        try:
            # Step 1: Navigate to home page
            print("\n📍 Step 1: Navigating to home page...")
            self.driver.get(self.base_url)
            time.sleep(2)
            results['steps'].append({'step': 'Navigate to home', 'status': 'success'})
            print("   ✅ Home page loaded")

            # Step 2: Navigate to menu page
            print("📍 Step 2: Going to menu page...")
            self.driver.get(f"{self.base_url}/menu")
            time.sleep(2)
            results['steps'].append({'step': 'Open menu page', 'status': 'success'})
            print("   ✅ Menu page loaded")

            # Step 3: Add items to cart (click first few Add to Cart buttons)
            print("📍 Step 3: Adding items to cart...")
            try:
                add_buttons = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_all_elements_located(
                        (By.CSS_SELECTOR, '[data-testid="add-to-cart-btn"]')
                    )
                )
                # Add first 2 items
                for i, btn in enumerate(add_buttons[:2]):
                    btn.click()
                    time.sleep(0.5)
                    print(f"   ✅ Added item {i + 1} to cart")

                results['steps'].append({'step': 'Add items to cart', 'status': 'success'})
            except Exception as e:
                print(f"   ⚠️ Could not click add buttons: {e}")
                results['steps'].append({'step': 'Add items to cart', 'status': 'skipped'})

            # Step 4: Navigate to checkout
            print("📍 Step 4: Going to checkout...")
            self.driver.get(f"{self.base_url}/checkout")
            time.sleep(2)
            results['steps'].append({'step': 'Navigate to checkout', 'status': 'success'})
            print("   ✅ Checkout page loaded")

            # Step 5: Fill checkout form
            print("📍 Step 5: Filling order form...")
            try:
                name_field = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="checkout-name"]')
                name_field.clear()
                name_field.send_keys("Selenium Test User")

                phone_field = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="checkout-phone"]')
                phone_field.clear()
                phone_field.send_keys("9876543210")

                address_field = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="checkout-address"]')
                address_field.clear()
                address_field.send_keys("123 Test Street, Automation City")

                time.sleep(1)
                results['steps'].append({'step': 'Fill order form', 'status': 'success'})
                print("   ✅ Form filled successfully")
            except Exception as e:
                print(f"   ⚠️  Could not fill form: {e}")
                results['steps'].append({'step': 'Fill order form', 'status': 'skipped'})

            # Step 6: Submit order
            print("📍 Step 6: Submitting order...")
            try:
                submit_btn = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable(
                        (By.CSS_SELECTOR, '[data-testid="place-order-btn"]')
                    )
                )
                submit_btn.click()
                time.sleep(3)
                results['steps'].append({'step': 'Submit order', 'status': 'success'})
                print("   ✅ Order submitted!")
            except Exception as e:
                print(f"   ⚠️ Could not submit: {e}")
                results['steps'].append({'step': 'Submit order', 'status': 'skipped'})

            # Step 7: Verify success
            print("📍 Step 7: Verifying order success...")
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, '[data-testid="order-success"]')
                    )
                )
                results['success'] = True
                results['steps'].append({'step': 'Verify success', 'status': 'success'})
                print("   ✅ Order placed successfully!")
            except Exception:
                # Check URL for confirmation
                if 'confirmation' in self.driver.current_url or 'success' in self.driver.current_url:
                    results['success'] = True
                    results['steps'].append({'step': 'Verify success', 'status': 'success'})
                    print("   ✅ Order confirmation page reached!")
                else:
                    results['steps'].append({'step': 'Verify success', 'status': 'unknown'})
                    print("   ⚠️ Could not verify success page")

            time.sleep(3)

        except Exception as e:
            print(f"\n❌ Automation error: {e}")
            results['steps'].append({'step': 'Error', 'status': 'failed', 'error': str(e)})

        return results

    def close(self):
        """Close the browser"""
        if self.driver:
            self.driver.quit()
            print("🔒 Browser closed")


def run_automation():
    """Run the full automation workflow"""
    print("=" * 60)
    print("🤖 SELENIUM ORDER AUTOMATION")
    print("=" * 60)

    automation = OrderAutomation()

    try:
        results = automation.simulate_order_placement()

        print("\n" + "=" * 60)
        print("📊 AUTOMATION RESULTS")
        print("=" * 60)
        for step in results['steps']:
            icon = "✅" if step['status'] == 'success' else "⚠️"
            print(f"   {icon} {step['step']}: {step['status']}")

        print(f"\n   Overall: {'✅ SUCCESS' if results['success'] else '⚠️ PARTIAL'}")
        print("=" * 60)

    finally:
        automation.close()


if __name__ == '__main__':
    run_automation()
