# API Centralizada de Documentos e Consultas

## Fluxograma Visual do Sistema

```mermaid
flowchart TD
   Start([Início]) --> Login["Login / Cadastro"];
    Login -- "Admin" --> Painel["Admin: Painel de Administração"];
    Login -- "User" --> Chatbot["Usuário: Chatbot"];
    Painel --> Upload["Upload de Dataset"];
    Upload --> DatasetsAdmin["Datasets Públicos (Admin)"];
    Chatbot --> Consulta["Consulta IA"];
    DatasetsAdmin -.-> Consulta;
    Chatbot --> DatasetsUser["Meus Datasets"];
    DatasetsUser --> Consulta;
```

> O fluxograma acima ilustra o fluxo principal do sistema: autenticação, separação de papéis, upload de datasets pelo admin (que ficam públicos), uso do chatbot e consultas sobre os documentos.

---

Esta é uma API RESTful desenvolvida para simular o backend de uma plataforma centralizada. O projeto inclui ingestão e gerenciamento de documentos, autenticação de usuários com diferentes níveis de acesso e um chatbot para consultas simuladas via IA.

A plataforma conta com duas interfaces principais:
- **Painel de Administração:** Uma área protegida para administradores, permitindo o gerenciamento e upload de documentos que podem ser compartilhados com todos os usuários.
- **Chatbot:** Uma interface de chat para que usuários (`USER`) possam fazer perguntas sobre seus próprios documentos ou sobre os documentos públicos cadastrados por administradores.

## Fluxo de Uso e Funcionalidades

1.  **Acesso Inicial:** A página principal é a de autenticação.
2.  **Usuário Administrador Padrão:** Um usuário `ADMIN` é criado automaticamente na configuração inicial do banco de dados, permitindo acesso imediato ao painel de administração.
3.  **Sistema de Papéis:**
    -   **ADMIN:** Acessa o painel de administração (`/index.html`), gerencia documentos e seus datasets são visíveis para todos os usuários.
    -   **USER:** Usuários registrados pela interface. São redirecionados para o chatbot (`/chat.html`) após o login e podem ver seus próprios datasets e os datasets dos administradores.
4.  **Upload de Documentos:** Admins e usuários podem fazer upload de arquivos `.csv` e `.pdf`.
5.  **Consulta com IA (Mock):** Através do chatbot, usuários podem selecionar um documento e fazer perguntas em linguagem natural, recebendo respostas simuladas baseadas em palavras-chave.

## Tecnologias Utilizadas

- **Backend:** Node.js com Express
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT com sistema de papéis (Admin/User)
- **Containerização:** Docker e Docker Compose
- **Frontend:** HTML, JavaScript e Tailwind CSS (via CDN)
- **Documentação:** Swagger UI

---

## Como Executar o Projeto

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose

### 1. Instalar as Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# URL de conexão para o banco de dados PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5434/mydatabase?schema=public"

# Chave secreta para assinar os tokens JWT
JWT_SECRET="your-super-secret-key-that-is-long-and-secure"
```

### 3. Subir os Contêineres e Preparar o Banco

Com o Docker em execução, execute os dois comandos abaixo em sequência:

1.  **Inicie os serviços:**
    ```bash
    docker-compose up -d
    ```

2.  **Crie as tabelas e o usuário admin:**
    ```bash
    npx prisma migrate dev
    ```
    Este comando irá criar as tabelas e executar um script ("seed") que popula o banco com o usuário administrador padrão.

---

## Acesso e Credenciais

### Usuário Administrador

Um usuário **Admin** é criado automaticamente. Utilize estas credenciais para acessar o painel administrativo:
- **Email:** `admin@example.com`
- **Senha:** `admin123`

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
