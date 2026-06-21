const pool = require('../config/database');
const Categoria = require('../models/Categoria');

class CategoriaRepository {

    async create(nome) {
        const query = `
            INSERT INTO CATEGORIAS (NOME)
            VALUES ($1)
            RETURNING *;
        `;

        const result = await pool.query(query, [nome]);

        return new Categoria(result.rows[0]);
    }

    async findAll() {
        const query = `
            SELECT * 
            FROM CATEGORIAS;
        `;

        const result = await pool.query(query);

        return result.rows.map(row => new Categoria(row));
    }

    async findById(id) {
        const query = `
            SELECT * 
            FROM CATEGORIAS 
            WHERE ID = $1;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length == 0) return null;
        return new Categoria(result.rows[0]);
    }

    async findByNome(nome) {
        const query = `
            SELECT *
            FROM CATEGORIAS
            WHERE NOME ILIKE ($1);
        `;

        const result = await pool.query(query, [nome]);

        if (result.rows.length == 0) return null;
        return new Categoria(result.rows[0]);
    }

    async update(id, nome) {
        const query = `
            UPDATE CATEGORIAS 
            SET NOME = $1
            WHERE ID = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [nome, id]);

        if (result.rows.length == 0) return null;
        return new Categoria(result.rows[0]);
    }

    async delete(id) {
        const query = `
            DELETE FROM CATEGORIAS
            WHERE ID = $1;
        `;

        await pool.query(query, [id]);
        return true;
    } 
}

module.exports = new CategoriaRepository(); 