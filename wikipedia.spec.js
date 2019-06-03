const { Builder, Capabilities, By, until } = require("selenium-webdriver");
const {
  Eyes,
  ConsoleLogHandler,
  Target
} = require("@applitools/eyes-selenium");
const chalk = require("chalk");

(async () => {
  // Open a Chrome browser
  const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes();
  eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
  eyes.setLogHandler(new ConsoleLogHandler(false));

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(
      driver,
      "Testing Wikipedia with Applitools and Selenium",
      "Search for Software Testing",
      {
        width: 1400,
        height: 800
      }
    );

    // Navigate the browser to the Wikipedia home page
    await driver.get("https://www.wikipedia.org/");

    // Take a visual checkpoint
    await eyes.check("Home page", Target.window());

    // Locate the English hyerlink and click it
    await driver.findElement(By.id("js-link-box-en")).click();

    // Verify "Welcome to Wikipedia" text is available
    const text = (await driver
      .findElement(By.id("mp-topbanner"))
      .getText()).toLowerCase();
    if (text && text.indexOf("welcome to wikipedia") >= 0) {
      console.log(`\n"Welcome to Wikipedia" is found!\n`);
    }

    // Take a visual checkpoint
    await eyes.check("English Home page", Target.window());

    // Locate the Search input field, enter the text "Software Testing" and hit Enter
    let searchInputField = await driver.findElement(By.name("search"));
    if (searchInputField) {
      searchInputField.sendKeys("Software Testability\n");
    }

    // Wait until the page loads and the firstHeading element is rendered
    await driver.wait(function() {
      return driver.findElement(By.id("firstHeading"));
    }, 2000);

    console.log(chalk.black.bgGreen(`\Done!!\n`));

    // Take a visual checkpoint
    await eyes.check("Software Testing page", Target.window());

    // End the test.
    await eyes.close();
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abortIfNotClosed();
  }
})();
