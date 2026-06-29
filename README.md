# 📋 Sistema de Venda de Peças

Sistema desenvolvido para a disciplina de **Engenharia de Software II**, com o objetivo de gerenciar o cadastro de peças, categorias, clientes e pedidos por meio de uma API REST. O sistema realiza o controle de estoque, valida regras de negócio e permite o gerenciamento completo das vendas.

A aplicação expõe uma API REST construída em **Node.js**, seguindo uma **Arquitetura em Camadas**, utilizando os padrões **Repository** e **Service Layer**, além de princípios **SOLID** para garantir organização, reutilização e manutenção do código.

---

# 🛠️ Tecnologias Utilizadas


- **Linguagem:** JavaScript (Node.js v20.x LTS ou superior)
- **Framework:** Express 5.2.1
- **Banco de Dados:** PostgreSQL 16.x
- **Driver de Banco:** pg 8.21.0
- **Validação de Dados:** Zod 4.4.3
- **Gerenciamento de Variáveis de Ambiente:** dotenv 17.4.2
- **Ferramenta de Desenvolvimento:** Nodemon 3.1.14
- **Ferramentas para Testes da API:** Insomnia ou Postman

---

# ✅ Pré-requisitos

Antes de executar o projeto, certifique-se de possuir os seguintes programas instalados:

* Node.js **20.x (LTS)** ou superior;
* npm (instalado juntamente com o Node.js);
* PostgreSQL **16.x** ou superior;
* pgAdmin 4 (recomendado para criar e configurar o banco de dados);
* Git (clonar repositório);
* Insomnia ou Postman para testar a API.


---

# 🚀 Instalação e Execução

## 1. Clonar o projeto

```bash
git clone https://github.com/ArieleMacedo/API-VENDA-PECAS.git
cd API-VENDA-PECAS
npm install
```

## 2. Configurar o Banco de Dados

Utilizando o **pgAdmin**:

1. Abra o pgAdmin.
2. Conecte ao servidor PostgreSQL.
3. Crie um banco chamado **venda_pecas**.
4. Abra o **Query Tool**.
5. Execute o arquivo:

```text
src/config/schema.sql
```

Após a execução serão criadas as tabelas:

* clientes
* categorias
* pecas
* pedidos
* itens_pedido

## 3. Configurar o arquivo .env

Renomeie o arquivo:

```text
.env.example
```

para

```text
.env
```

e configure:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=venda_pecas
```

## 4. Executar o projeto

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

---

# 📂 Estrutura do Projeto

```text
src/
├── config/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── middlewares/
├── exceptions/
├── utils/
├── app.js
└── server.js
```

---

# 📡 Endpoints da API

## Categorias

```text
POST   /api/categorias
GET    /api/categorias
GET    /api/categorias/:id
PATCH  /api/categorias/:id
DELETE /api/categorias/:id
```

Exemplo:

```json
{
  "nome": "Motor"
}
```

## Clientes

```text
POST   /api/clientes
GET    /api/clientes
GET    /api/clientes/:id
PATCH  /api/clientes/:id
DELETE /api/clientes/:id
```

Exemplo:

```json
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "telefone": "86999999999"
}
```

## Peças

```text
POST   /api/pecas
GET    /api/pecas
GET    /api/pecas/:id
PATCH  /api/pecas/:id
DELETE /api/pecas/:id
```

Exemplo:

```json
{
  "codigo": "P001",
  "nome": "Filtro de Óleo",
  "preco": 45.90,
  "quantidade_estoque": 50,
  "categoria_id": 1
}
```

## Pedidos

```text
POST   /api/pedidos
GET    /api/pedidos
GET    /api/pedidos/:id
PATCH  /api/pedidos/:id/status
DELETE /api/pedidos/:id
```
Exemplo

### Exemplo

```json
{
  "cliente_id": 1,
  "itens": [
    {
      "peca_id": 1,
      "quantidade": 2
    },
    {
      "peca_id": 3,
      "quantidade": 1
    }
  ]
}
```


---

# 🧪 Como Executar os Testes

Os testes da API são realizados manualmente utilizando o **Insomnia** ou **Postman**.

Após iniciar o servidor com:

```bash
npm run dev
```

acesse a API em:

```text
http://localhost:3000
```

e envie requisições para os endpoints disponíveis, verificando os retornos e as validações implementadas.

---

# ⚠️ Limitações Conhecidas

- É necessário ter o PostgreSQL instalado e em execução 
- Não há autenticação implementada nesta versão 


---

# 👥 Integrantes

* Ariele de Macedo Silva
* Camila Raquel Sousa de Brito
* Hilton Tavares de Arruda Filho
* Lya Raquel Rodrigues de Sousa
