Feature: saucedemo website

    In order to ensure proper authentication
    Users must see appropriate error messages
    when attempting to log in without providing credentials.

Scenario: Try to login without login and password
    Given I'm located on the "login" page of saucedemo website
    When I click "Login" button
    Then I should see "Epic sadface: Username is required" error message
    



