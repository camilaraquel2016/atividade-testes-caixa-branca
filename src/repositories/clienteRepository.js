const pool = require('../config/database');
const Cliente = require('../models/Cliente');

class ClienteRepository {

    async create(dadosCliente) {
        const query = `
            INSERT INTO CLIENTES (NOME, CPF, TELEFONE) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const result = await pool.query(query, [dadosCliente.nome, dadosCliente.cpf, dadosCliente.telefone]);
        return new Cliente(result.rows[0]);
    }

    async findByCpf(cpf) {
        const query = `SELECT * FROM CLIENTES WHERE CPF = $1;`;
        const result = await pool.query(query, [cpf]);
        if (result.rows.length === 0) return null;
        return new Cliente(result.rows[0]);
    }

    async findByTelefone(telefone) {
        const query = `SELECT * FROM CLIENTES WHERE TELEFONE = $1;`;
        const result = await pool.query(query, [telefone]);
        if (result.rows.length === 0) return null;
        return new Cliente(result.rows[0]);
    }

    async findById(id) {
        const query = `SELECT * FROM CLIENTES WHERE ID = $1;`;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return null;
        return new Cliente(result.rows[0]);
    }

    async findAll(filtros) {
        let query = `SELECT * FROM CLIENTES`;
        const values = [];

        if (filtros && filtros.nome) {
            query += ` WHERE NOME ILIKE $1`;
            values.push(`%${filtros.nome}%`);
        }

        query += ` ORDER BY NOME ASC;`;
        const result = await pool.query(query, values);
        return result.rows.map(row => new Cliente(row));
    }

    async update(id, dados) {
        const query = `
            UPDATE CLIENTES 
            SET NOME = $1, TELEFONE = $2
            WHERE ID = $3
            RETURNING *;
        `;
        const result = await pool.query(query, [dados.nome, dados.telefone, id]);
        if (result.rows.length === 0) return null;
        return new Cliente(result.rows[0]);
    }

    async delete(id) {
        const query = `DELETE FROM CLIENTES WHERE ID = $1;`;
        await pool.query(query, [id]);
        return true;
    }
}

module.exports = new ClienteRepository();