import validator from 'validator';

// const passwordValidator = require('password-validator');
import passwordValidator from 'password-validator';

export function validateEmail(email: string) : boolean{
  if (!validator.isEmail(email)) {
    return false;
  }
  return true;
}

export function validatePassword(password:string) : boolean | string[]{
  const schema = new passwordValidator();
  schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(1) // Must have at least 1 digit
    .has().not().spaces(); // Should not have spaces

  return schema.validate(password, { list: true });
}

module.exports ={
  validateEmail,
  validatePassword
}
