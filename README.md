# Memory Card Game AI - Seu Assistente de Estudos Inteligente

## Sobre o Projeto - Em desenvolvimento...

O Flashcard AI é uma aplicação inovadora baseada em flashcards, projetada para otimizar seus estudos pessoais. Com ele, você pode criar seus próprios flashcards, personalizar suas sessões de estudo e receber feedback inteligente sobre suas respostas, tudo isso impulsionado por inteligência artificial.

## Funcionalidades Principais

*   **Criação de Flashcards Personalizados:** Crie cards com tema, título e descrição detalhada para qualquer assunto.
    *   Exemplo: `Matemática - Funções - Explicação do que são funções`
*   **Sessões de Estudo Configuráveis:**
    *   **Nível de Dificuldade:** Escolha o nível de dificuldade para cada card.
    *   **Temporizador:** Defina um temporizador para cada rodada de estudo.
    *   **Quantidade de Cards:** Configure o número de cards por rodada.
*   **Avaliação Inteligente por IA:** Utilize o poder dos embeddings de IA para analisar a colinearidade da sua resposta com a resposta correta, definindo uma margem de porcentagem de acerto.
*   **Gerenciamento de Temas e Status:** Organize seus cards por temas e acompanhe seu progresso com o status de cada sessão.

## Tecnologias Utilizadas

### Frontend

*   **Framework:** Vite com React
*   **Gerenciamento de Estado:** Context API, React Query, `useState`, `useReducer`
*   **Comunicação com Backend:** Axios
*   **Roteamento:** React Router DOM

### Backend

*   **Framework:** FastAPI (Python)
*   **Banco de Dados:** PostgreSQL
*   **Módulo de IA:** Serviço separado para avaliação de respostas utilizando embeddings (interage com APIs de embeddings externas como OpenAI).

## Estrutura do Projeto

```
. (raiz do projeto)
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/  # Rotas da API (users, cards, rounds, responses, themes, status)
│   │   │   └── __init__.py
│   │   ├── core/       # Configurações, segurança, dependências
│   │   ├── crud/       # Operações CRUD para o banco de dados
│   │   ├── db/         # Configuração do banco de dados, modelos (SQLAlchemy/Pydantic)
│   │   ├── schemas/    # Modelos de dados (Pydantic)
│   │   ├── services/   # Lógica de negócio, incluindo ai_service.py
│   │   └── main.py     # Ponto de entrada da aplicação FastAPI
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── features/   # Componentes e lógica por funcionalidade
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── hooks/      # Hooks personalizados
│   │   ├── lib/        # Configurações de API, autenticação
│   │   ├── styles/     # Estilos globais e temas
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

## Como Rodar o Projeto (Instruções Simplificadas)

### Pré-requisitos

*   Python 3.9+
*   Node.js 18+
*   Docker (opcional, para banco de dados)

### Backend

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd flashcard-ai/backend
    ```
2.  **Crie e ative um ambiente virtual:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    # venv\Scripts\activate   # Windows
    ```
3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure as variáveis de ambiente:** Crie um arquivo `.env` na raiz do diretório `backend` com as configurações do banco de dados e da API de embeddings (ex: `DATABASE_URL`, `OPENAI_API_KEY`).

5.  **Inicie o servidor:**
    ```bash
    uvicorn app.main:app --reload
    ```
    O backend estará disponível em `http://localhost:8000`.

### Frontend

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd ../frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install # ou yarn install
    ```
3.  **Configure as variáveis de ambiente:** Crie um arquivo `.env` na raiz do diretório `frontend` com a URL do backend (ex: `VITE_BACKEND_URL=http://localhost:8000/api/v1`).
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev # ou yarn dev
    ```
    O frontend estará disponível em `http://localhost:5173` (ou outra porta).

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.


