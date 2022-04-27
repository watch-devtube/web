module.exports.isValidEmail = (email) => {
  return email?.match("^(.+)@(.+)\\.(.+)$");
}