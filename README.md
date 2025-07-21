# API Centralizada de Documentos e Consultas

Esta é uma API RESTful desenvolvida para simular o backend de uma plataforma centralizada. O projeto inclui ingestão e gerenciamento de documentos, autenticação de usuários com diferentes níveis de acesso e um chatbot para consultas simuladas via IA.

A plataforma conta com duas interfaces principais:
- **Painel de Administração:** Para gerenciamento de usuários e upload de documentos.
- **Chatbot:** Uma interface de chat para que usuários possam fazer perguntas sobre os documentos enviados.

## Tecnologias Utilizadas

- **Backend:** Node.js com Express
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** JSON Web Tokens (JWT) com sistema de papéis (Admin/User)
- **Upload de Arquivos:** Multer
- **Containerização:** Docker e Docker Compose
- **Frontend:** HTML, JavaScript e Tailwind CSS (via CDN)
- **Documentação:** Swagger UI

---

## Como Executar o Projeto

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

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto copiando o conteúdo abaixo. Ele é fundamental para a conexão com o banco de dados e para a segurança da autenticação.

```env
# URL de conexão para o banco de dados PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5434/mydatabase?schema=public"

# Chave secreta para assinar os tokens JWT
JWT_SECRET="your-super-secret-key-that-is-long-and-secure"
```

### 4. Subir os Contêineres

Com o Docker em execução, inicie a aplicação e o banco de dados:

```bash
docker-compose up -d
```

### 5. Preparar o Banco de Dados (Primeira Vez)

Na primeira execução, você precisa criar as tabelas e popular o banco com o usuário administrador padrão. O Prisma fará isso com um único comando:

```bash
npx prisma migrate dev
```
Este comando irá:
1.  Criar todas as tabelas no banco de dados.
2.  Executar o script de "seed" para criar o usuário **Admin**.

---

## Acesso e Credenciais

### Usuário Administrador

Um usuário **Admin** é criado automaticamente no processo de setup. Utilize estas credenciais para acessar o painel administrativo:
- **Email:** `admin@example.com`
- **Senha:** `admin123`

O administrador tem acesso ao painel completo, onde pode gerenciar e fazer upload de documentos.

### Usuários Padrão (USER)

Qualquer novo usuário registrado através da interface terá o papel de **USER**. Após o login, usuários com este papel são automaticamente redirecionados para a interface do **Chatbot**.

### Acessando as Interfaces

- **Página Principal (Login):** [http://localhost:3000](http://localhost:3000)
- **Chatbot (após login como USER):** [http://localhost:3000/chat.html](http://localhost:3000/chat.html)
- **Documentação da API (Swagger):** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Como Parar a Aplicação

Para parar todos os serviços que estão rodando via Docker:
```bash
docker-compose down
```
Para parar e **remover todos os dados do banco** (útil para recomeçar do zero):
```bash
docker-compose down -v
```
Lembre-se de rodar `npx prisma migrate dev` novamente após remover os volumes. 