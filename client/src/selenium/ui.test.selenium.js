const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Selenium UI Tests', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless())
            .build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Login Scenario', async () => {
        await driver.get('http://localhost:3000/login');
        
        // Find and fill username
        const usernameInput = await driver.findElement(By.css('input[label="Username"]'));
        await usernameInput.sendKeys('admin');
        
        // Find and fill password
        const passwordInput = await driver.findElement(By.css('input[label="Password"]'));
        await passwordInput.sendKeys('password');
        
        // Click login button
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await loginButton.click();
        
        // Wait for tasks page to load
        await driver.wait(until.elementLocated(By.css('h4')), 5000);
        const heading = await driver.findElement(By.css('h4'));
        const headingText = await heading.getText();
        
        expect(headingText).toContain('Tasks for admin');
    }, 10000);

    test('Add Task Scenario', async () => {
        // Ensure we're logged in and on the tasks page
        await driver.get('http://localhost:3000/tasks');
        
        // Find and fill new task input
        const taskInput = await driver.findElement(By.css('input[label="New Task"]'));
        const testTask = 'Test Task ' + Date.now();
        await taskInput.sendKeys(testTask);
        
        // Click add button
        const addButton = await driver.findElement(By.css('button[type="submit"]'));
        await addButton.click();
        
        // Wait for task to appear in the list
        await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(),'${testTask}')]`)), 5000);
        const taskElement = await driver.findElement(By.xpath(`//div[contains(text(),'${testTask}')]`));
        const taskText = await taskElement.getText();
        
        expect(taskText).toContain(testTask);
    }, 10000);
});