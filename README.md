# Desafio 5 - Back Api

##  Banco de dados: cadastro e login de usuário

### table: users

- **id**: serial primary key
- **name**: varchar not null
- **email**: text not null unique
- **password**: text not null
- **cpf**: varchar (11)
- **phone**: varchar (11)

## Endpoints: cadastro e login de usuário

### POST/register:

- receber no body todos os campos necessários para registro de usuário (name, email, password)
- verificar se nenhum campo obrigatório está faltando e se os campos estão válidos
- criar um hash da senha para armazenar no banco de dados
- registrar no banco de dados o novo usuário

#### Dados retornados:
-  sucesso: 
    -  mensagem de sucesso no cadastro
    -  extra: email de boas vindas
-  erro: 
    -  mensagem do erro gerado
#### Nota:
- armazenar dados sensíveis de conexão com o banco de dados em variáveis de ambiente
- adicionar variáveis de ambiente no .gitignore

### POST/login:
- receber no body todos os campos necessários para o login (email, password)
- verificar se o usuário está cadastrado
    - verificar hash da senha
- gerar token de acesso com os dados do usuário e um _secret_

#### Dados retornados:
- sucesso:
    - dados do usuário
    - token de autenticação (jwt)
    - extra: email de notificação de login
- erro:
    - mensagem do erro gerado

#### Nota:
- armazenar _secret_ em uma variável de ambiente

## Endpoints: Editar e ver perfil de usuário

### GET/profile (rota protegida):
- verificar token de autenticação Bearer (middleware)

#### Dados retornados:
- sucesso:
    - dados do usuário
- erro:
    - mensagem do erro gerado

### PUT/profile (rota protegida):
- verificar token de autenticação Bearer (middleware)
- receber dados da edição no body (name, email, password, cpf, phone)
- verificar dados obrigatórios (name, email, password)
- se email não for igual ao cadastrado, verificar se está disponível
- se a senha for nova, criar novo hash de senha
- extra: verificar se cpf é valido
- se tudo estiver correto, fazer update do cadastro

#### Dados retornados:
- sucesso:
    - mensagem de sucesso
- erro:
    - mesagem do erro gerado
