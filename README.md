# Talent Hub

Aplicação mobile desenvolvida em **React Native com Expo**, criada para permitir que usuários construam e gerenciem seu perfil profissional por meio do cadastro de habilidades (skills) e seus respectivos níveis de experiência.

O projeto possui autenticação de usuários, cadastro, login e gerenciamento completo das habilidades associadas ao perfil.

## Tecnologias utilizadas

* React Native
* Expo
* JavaScript
* React Navigation
* Axios
* Expo Linear Gradient
* AsyncStorage
* API REST desenvolvida em Java/Spring Boot

## Funcionalidades

### Autenticação

* Cadastro de novos usuários
* Login
* Armazenamento da autenticação
* Armazenamento da preferência "Lembrar de mim"
* Logout
* Redirecionamento entre telas
* Proteção das informações utilizando token de autenticação

### Gerenciamento de Skills

O usuário pode:

* Visualizar suas skills cadastradas
* Adicionar uma nova skill
* Selecionar o nível de experiência
* Alterar o nível de uma skill
* Excluir uma skill
* Visualizar a categoria e descrição da habilidade
* Visualizar a quantidade de skills cadastradas

### Níveis de experiência

Cada skill pode possuir um dos seguintes níveis:

1. **Básico** — Conhecimentos fundamentais
2. **Intermediário** — Experiência prática
3. **Avançado** — Domínio da habilidade

## Estrutura do projeto

```text
TalentHub/
│
├── assets/
│
├── components/
│
├── screens/
│   ├── LoginScreen.js
│   ├── CadastroScreen.js
│   └── SkillsScreen.js
│
├── services/
│   ├── AuthService.js
│   ├── StorageService.js
│   ├── SkillsService.js
│   └── UsuarioSkillService.js
│
├── App.js
├── package.json
└── README.md
```

A estrutura pode variar de acordo com a organização final do projeto.

## Principais telas

### Login

A tela de login permite que o usuário informe:

* E-mail
* Senha
* Preferência para lembrar da autenticação

Também possui acesso à tela de cadastro.

### Cadastro

Permite criar uma nova conta informando:

* Nome
* E-mail
* Senha
* Confirmação da senha

Antes de enviar os dados para a API, são realizadas validações básicas, como preenchimento dos campos, confirmação da senha e tamanho mínimo da senha.

### Minhas Skills

Tela principal para gerenciamento das habilidades do usuário.

Nela é possível visualizar as skills cadastradas, seus níveis, categorias e descrições.

A tela também permite adicionar, editar e excluir habilidades.

## Comunicação com a API

A aplicação utiliza serviços separados para realizar a comunicação com o backend.

### AuthService

Responsável pelas operações relacionadas à autenticação e cadastro de usuários.

Exemplos de operações:

javascript

login(email, senha);
cadastrar(nome, email, senha);


### StorageService

Responsável pelo armazenamento local das informações de autenticação e preferências do usuário.

Exemplos:

javascript

salvarAutenticacao(token, role);
salvarPreferenciaLembrar(lembrarMe);
limparAutenticacao();


### SkillsService

Responsável por consultar as skills disponíveis na API.

javascript

listarSkills();

### UsuarioSkillService

Responsável pelo gerenciamento das skills associadas ao usuário.

javascript

listarMinhasSkills();
adicionarSkill(skillId, level);
atualizarLevel(id, level);
excluirSkill(id);

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* npm
* Expo
* Android Studio, caso utilize um emulador Android

Também é necessário que o backend esteja em execução e acessível pela aplicação.

## Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd TalentHub
```

Instale as dependências:

```bash
npm install
```

## Executando o projeto

Inicie o Expo:

```bash
npx expo start
```

Depois disso, é possível executar a aplicação utilizando:

* Expo Go
* Emulador Android
* Dispositivo físico conectado

Para executar diretamente no Android:

```bash
npx expo start --android
```

## Backend

O aplicativo depende de uma API REST para realizar autenticação e gerenciamento das informações.

O backend foi desenvolvido utilizando:

* Java
* Spring Boot
* Spring Data JPA
* PostgreSQL
* JWT
* Maven

A aplicação mobile realiza as requisições HTTP para os endpoints disponibilizados pela API.

## Fluxo da aplicação

O fluxo principal da aplicação é:

```text
                    ┌───────────────┐
                    │     Login     │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          ┌─────────────┐       ┌─────────────┐
          │   Cadastro  │       │    Login    │
          └──────┬──────┘       └──────┬──────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                    ┌───────────────┐
                    │     Home      │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Minhas Skills │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          Adicionar       Editar        Excluir
            Skill          Nível          Skill
```

## Segurança

A autenticação utiliza um token fornecido pela API após o login.

O token é armazenado localmente e utilizado nas requisições que necessitam de autenticação.

Ao realizar logout, as informações de autenticação armazenadas são removidas e o usuário retorna para a tela de login.

## Interface

A interface utiliza uma identidade visual baseada principalmente em tons de azul, com:

* Gradientes
* Cards para apresentação das skills
* Modais para operações
* Indicadores de carregamento
* Mensagens de erro
* Botões de ação
* Indicadores visuais para os níveis das skills

O objetivo é oferecer uma interface simples, organizada e adequada para uma aplicação de gerenciamento de perfil profissional.

## Validações

O cadastro realiza validações antes de enviar os dados para o backend.

São verificadas:

* Existência do nome
* Existência do e-mail
* Existência da senha
* Confirmação da senha
* Igualdade entre senha e confirmação
* Senha com pelo menos 6 caracteres

No gerenciamento de skills também são verificadas as informações necessárias antes de realizar uma operação.

## Objetivo do projeto

O Talent Hub tem como objetivo oferecer uma plataforma para gerenciamento de informações profissionais, permitindo que usuários apresentem suas principais habilidades e seus respectivos níveis de conhecimento.

A aplicação também serve como projeto acadêmico e prático para aplicação dos conhecimentos de desenvolvimento mobile, consumo de APIs REST, autenticação e organização de aplicações utilizando arquitetura baseada em serviços.

## Status do projeto

**Concluído e funcional.**

As principais funcionalidades implementadas e testadas são:

* [x] Cadastro de usuário
* [x] Login
* [x] Armazenamento da autenticação
* [x] Logout
* [x] Navegação entre telas
* [x] Listagem de skills
* [x] Adição de skills
* [x] Definição do nível da skill
* [x] Edição do nível
* [x] Exclusão de skills
* [x] Tratamento de carregamento
* [x] Tratamento de erros
* [x] Interface estilizada

## Autores

Projeto desenvolvido como parte da entrevista para a Neki.

**Talent Hub — Plataforma de gerenciamento de perfil profissional.**
