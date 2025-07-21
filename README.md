# API Centralizada de Documentos e Consultas

Esta é uma API RESTful desenvolvida para simular o backend de uma plataforma centralizada, focando na ingestão e gerenciamento de documentos, autenticação de usuários e registro de buscas simuladas via IA.

## Tecnologias Utilizadas

- **Backend:** Node.js com Express
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** JSON Web Tokens (JWT)
- **Upload de Arquivos:** Multer
- **Containerização:** Docker e Docker Compose

---

## Instruções de Execução

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA>
```

### 2. Instalar as Dependências

Execute o comando abaixo para instalar as dependências do Node.js:

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto. Ele é fundamental para definir as credenciais de acesso ao banco de dados e o segredo do JWT.

Copie e cole o seguinte conteúdo no seu arquivo `.env`:

```env
# URL de conexão para o banco de dados PostgreSQL
# O Prisma usará esta URL para se conectar ao banco que roda no Docker
DATABASE_URL="postgresql://user:password@localhost:5434/mydatabase?schema=public"

# Chave secreta para assinar os tokens JWT
# Em um ambiente de produção, use um valor longo, complexo e seguro
JWT_SECRET="your-super-secret-key-that-is-long-and-secure"
```

### 4. Iniciar os Serviços com Docker

Com o Docker Desktop em execução, suba os contêineres da aplicação e do banco de dados em modo detached (segundo plano):

```bash
docker-compose up -d
```

### 5. Aplicar as Migrações do Banco de Dados

Na primeira vez que você executar o projeto (e sempre que houver alterações no `prisma/schema.prisma`), você precisa aplicar as migrações para criar as tabelas no banco de dados.

Execute o comando:

```bash
npx prisma migrate dev
```

### 6. Pronto!

A API estará em execução e acessível em `http://localhost:3000`.

---

## Como Parar a Aplicação

Para parar todos os serviços que estão rodando via Docker, execute:

```bash
docker-compose down
```

Para parar e remover os volumes de dados (útil para começar do zero), execute:
```bash
docker-compose down -v
``` 