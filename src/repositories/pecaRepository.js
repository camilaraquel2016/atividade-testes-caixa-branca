const pool = require('../config/database');
const Peca = require('../models/Peca');

class PecaRepository {

    async create(peca) {
        const {codigo, nome, categoria_id, preco, qtd_estoque} = peca;

        const query = `
        INSERT INTO PECAS
        (CODIGO, NOME, CATEGORIA_ID, PRECO, QTD_ESTOQUE)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;

        const result = await pool.query(query, [codigo, nome, categoria_id, preco, qtd_estoque]);

        return new Peca(result.rows[0]);
    }

    async findById(id) {
        const query = `
        SELECT *
        FROM PECAS
        WHERE ID = $1;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length == 0) return null;
        return new Peca(result.rows[0]);
    }

    async update(id, dados) {
        const {codigo, nome, preco, qtd_estoque, categoria_id, situacao} = dados;

        const query = `
        UPDATE PECAS
        SET CODIGO = $1, NOME = $2, PRECO = $3, QTD_ESTOQUE = $4, CATEGORIA_ID = $5, SITUACAO = $6
        WHERE ID = $7
        RETURNING *;
        `;

        const result = await pool.query(query, [codigo, nome, preco, qtd_estoque, categoria_id, situacao, id]);

        if (result.rows.length == 0) return null;
        return new Peca(result.rows[0]);
    }

    async delete(id) {
        const query = `
        DELETE FROM PECAS
        WHERE ID = $1;
        `;

        await pool.query(query, [id]);
        return true;
    } 

    async findByCodigo(codigo) {
        const query = `
        SELECT *
        FROM PECAS
        WHERE CODIGO = $1;
        `;

        const result = await pool.query(query, [codigo]);

        if (result.rows.length == 0) return null;
        return new Peca(result.rows[0]);
    }

    async findAll(filtros = {}) {
        const {nome, codigo, situacao} = filtros;

        let query = 'SELECT * FROM pecas WHERE 1=1';
        const valores = [];
        let contador = 1;

        if (nome) {
            query += ` AND NOME ILIKE $${contador}`;
            valores.push(nome);
            contador++;
        }

        if (codigo) {
            query += ` AND CODIGO = $${contador}`;
            valores.push(codigo);
            contador++;
        }

        if (situacao) {
            query += ` AND SITUACAO = $${contador}`;
            valores.push(situacao);
            contador++;
        }

        const result = await pool.query(query, valores);

        return result.rows.map(row => new Peca(row));
    }
}

module.exports = new PecaRepository();