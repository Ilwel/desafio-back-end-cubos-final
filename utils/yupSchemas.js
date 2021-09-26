const yup = require('yup');
const { setLocale } = require('yup');
const { pt } = require('yup-locales');

setLocale(pt);

const userSchema = yup.object().shape({

  name: yup
    .string()
    .required(),

  email: yup
    .string()
    .email()
    .required(),

  password: yup
    .string()
    .min(8)
    .required(),

});

const loginSchema = yup.object().shape({

  email: yup
    .string()
    .required(),

  password: yup
    .string()
    .required(),

})

module.exports = {
  userSchema,
  loginSchema,
}