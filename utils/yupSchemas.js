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
 
const userSchemaCpf = yup.object().shape({
  cpf: yup
    .string()
    .max(11),
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
    .required()
    .max(11),

  phone: yup
    .string()
    .required(),

});

const chargeSchema = yup.object().shape({
  client_id: yup
    .number()
    .required(),

  description: yup
    .string()
    .required(),

  paid: yup
    .boolean()
    .required(),
  
  value: yup
    .number()
    .required(),
  
  due_date: yup
    .date()
    .required()
});

module.exports = {
  userSchema,
  userSchemaCpf,
  userPutSchemaNameEmail,
  userPutSchemaPassword,
  loginSchema,
  clientSchema,
  chargeSchema
}