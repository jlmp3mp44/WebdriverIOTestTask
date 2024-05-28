const page = require("./page");

class LoginPage extends page {
  get inputUsername() {
    return $('[data-test="username"]');
  }

  get inputPassword() {
    return $("#password");
  }

  get btnSubmit() {
    return $("#login-button");
  }

  get errorMessage() {
    return $('[data-test = "error"]');
  }

  async submit() {
    await this.btnSubmit.click();
    await browser.pause(500);
  }

  //get error icon near to inputs
  async getUsernameErrorIcon() {
    return this.inputUsername.$("~ svg.error_icon");
  }

  async getPasswordErrorIcon() {
    return this.inputPassword.$("~ svg.error_icon");
  }
  //set values to the inputs
  async setUsername(username) {
    await this.inputUsername.setValue(username);
  }

  async setPassword(password) {
    (await this.inputPassword).setValue(password);
  }
  //get are fields highlighted with red
  async isUsernameFieldHighlighted() {
    return (await this.inputUsername.getAttribute("class")).includes("error");
  }

  async isPasswordFieldHighlighted() {
    return (await this.inputPassword.getAttribute("class")).includes("error");
  }

  async login(username, password) {
    await this.setUsername(username);
    await this.setPassword(password);
    await this.btnSubmit.click();
    await browser.pause(500);
  }

  open() {
    return browser.url("");
  }
}

module.exports = new LoginPage();
