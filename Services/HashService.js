class PasswordHesher {
  generate(originalPassword) {
    let receivedPassword = originalPassword.split("");
    if (receivedPassword.length > 1) {
      receivedPassword.reverse().push("13");
      receivedPassword = receivedPassword.join("");
      return receivedPassword;
    }
    receivedPassword.push("onesimpol13");
    receivedPassword = receivedPassword.join("");
    return receivedPassword;
  }
  verify(originalPassword, hashedPassFromDb) {
    const receivedPassword = this.generate(originalPassword);
    return receivedPassword === hashedPassFromDb;
  }
}

module.exports = PasswordHesher;
