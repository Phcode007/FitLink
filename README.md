# 🏋️‍♂️ FitLink

**FitLink** é um web app que conecta **alunos**, **personais trainers** e **nutricionistas** num único lugar. Ideal para acompanhar treinos, planos alimentares e evolução física de forma prática, rápida e moderna.

---

## 📌 Funcionalidades principais

- Cadastro e login com autenticação JWT para:
  - 👤 Aluno
  - 🧑‍🏫 Personal Trainer
  - 🥗 Nutricionista

- Dashboards específicas para cada tipo de usuário
- Criação e agendamento de treinos
- Prescrição de planos alimentares
- Acompanhamento de progresso físico
- Sistema de notificações básicas
- Interface moderna e responsiva (mobile-first)

---

## 🚀 Tecnologias usadas

### Front-end
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/) (build rápido)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) (requisições HTTP)
- [React Router DOM](https://reactrouter.com/)

### Back-end
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/) (autenticação)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) (criptografia de senhas)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize ou Knex.js](https://sequelize.org/) (ORM/Query Builder, opcional)

### Deploy
- **Front-end:** Vercel
- **Back-end:** Render ou Railway
- **Banco de dados:** Supabase ou Railway (PostgreSQL)

---

## 📁 Estrutura do Projeto

```bash
FitLink/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
├── .env
├── README.md
└── package.json
