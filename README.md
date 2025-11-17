# Desafio Técnico – Cadastro de Pacientes

Esse projeto consiste em uma aplicação completa para realizar o cadastro e edição de pacientes.

A arquitetura foi iniciada pelo back-end para garantir a integridade das
regras de negócio e consumir endpoints reais no front-end, priorizando a
usabilidade e clareza do código final.

## Tecnologias utilizadas

**Front-end:** HTML5 semântico, CSS3, Sass/SCSS, JavaScript,
TypeScript, Node.js, Angular\
**Back-end:** C# (.NET)\
**Banco de Dados:** SQLite

------------------------------------------------------------------------

## Ferramentas necessárias para executar localmente

-   Git
-   .NET v10.0
-   .NET SDK v10.0.100
-   Node.js v22.20.0
-   Angular v20.3.0

------------------------------------------------------------------------

## Clonando o repositório

``` bash
git clone https://github.com/MateusDanieel/be3-cadastro-pacientes.git
```

------------------------------------------------------------------------

# Como Executar

## Back-end (.NET)

``` bash
cd ./be3-cadastro-pacientes/backend/Be3.Pacientes.Api
dotnet run
```

O servidor abrirá nas portas `http://localhost:5155` e
`https://localhost:7240` (confirme no terminal).

Abra o Swagger para testar os endpoints:\
**http://localhost:5155/swagger**

### OBS.

-   O projeto utiliza **EF Core**, que cria o arquivo `.db`
    automaticamente na primeira execução.
-   O backend já está configurado com **CORS liberado para o Angular**.

------------------------------------------------------------------------

## Front-end (Angular)

Abra **uma nova janela do Terminal** (mantenha o back-end rodando).

Instale o Angular CLI:

``` bash
npm install -g @angular/cli@20.3.0
```

Entre na pasta do front-end:

``` bash
cd ./be3-cadastro-pacientes/frontend/be3-pacientes
```

Instale as dependências:

``` bash
npm install
```

Execute o projeto:

``` bash
npx ng serve
```

Acesse no navegador:\
**http://localhost:4200/**

### Observação

-   O Angular está configurado para consumir a API na porta **:5155**

------------------------------------------------------------------------

# Possíveis erros e soluções

### Back-end não executa

-   Verifique as versões instaladas:

``` bash
dotnet --info
```

-   Confirme se usa **.NET 10.0** e **SDK 10.0.100**.

### Angular CLI não funciona

-   Pode ser problema de PATH/variáveis de ambiente.\
    [Guia útil](https://horadecodar.com.br/resolvendo-o-erro-ng-nao-e-reconhecido-como-um-comando-interno-ou-externo/#:~:text=Este%20erro%20%C3%A9%20comum%20e%20geralmente%20indica%20que,o%20Angular%20CLI%20funcione%20corretamente%20em%20sua%20m%C3%A1quina)

### Versões incompatíveis

Se as versões de .NET, Node ou Angular forem diferentes das
especificadas, erros podem ocorrer.