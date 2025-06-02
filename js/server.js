const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5432;

const dashboardRoutes = require('/routes/dashboard');

app.use(cors());
app.use(express.json());
app.use(express.static('pages'));

app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
