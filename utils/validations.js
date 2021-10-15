const { cpf: cpfValidator } = require('cpf-cnpj-validator');

function cpfValidation(str) {
    if (!cpfValidator.isValid(str)) {
        throw {
          status: 400,
          message: 'cpf inválido'
        }
    }
};

function phoneValidation(str){
    if (isNaN(str) || str.length != 11 ){
        throw {
          status: 400,
          message: 'telefone inválido'
        }
      } 
};

function zipCodeValidation(str){
    if (str.length != 8){
        throw {
          status: 400,
          message: 'cep inválido'
        }
      }
};

module.exports = {
    cpfValidation,
    phoneValidation,
    zipCodeValidation
};