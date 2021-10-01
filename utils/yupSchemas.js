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

const userPutSchemaNameEmail = yup.object().shape({

  name: yup
    .string()
    .required(),

  email: yup
    .string()
    .email()
    .required(),


});

const userPutSchemaPassword = yup.object().shape({

  password: yup
    .string()
    .min(8)
    .required()

});

const loginSchema = yup.object().shape({

  email: yup
    .string()
    .required(),

  password: yup
    .string()
    .required(),

});

const clientSchema = yup.object().shape({
  name: yup
    .string()
    .required(),

  email: yup
    .string()
    .email()
    .required(),

  cpf: yup
    .string()
    .required(),

  phone: yup
    .string()
    .required(),
})

module.exports = {
  userSchema,
  userPutSchemaNameEmail,
  userPutSchemaPassword,
  loginSchema,
  clientSchema
}