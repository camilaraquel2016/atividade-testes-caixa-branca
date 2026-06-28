const pool = require('../config/database');
const Pedido = require('../models/Pedido');
const ItemPedido = require('../models/ItemPedido');

class PedidoRepository {

    async create(dadosPedido, listaItens) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const queryPedido = `
                INSERT INTO PEDIDOS (NUMERO, CLIENTE_ID, STATUS, VALOR_TOTAL)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;

            const valoresPedido = [
                dadosPedido.numero,
                dadosPedido.cliente_id,
                dadosPedido.status || 'PENDENTE',
                dadosPedido.valor_total
            ];

            const resPedido = await client.query(queryPedido, valoresPedido);
            const novoPedido = new Pedido(resPedido.rows[0]);

            for (const item of listaItens) {
                const queryItem = `
                    INSERT INTO ITENS_PEDIDO (PEDIDO_ID, PECA_ID, QUANTIDADE, PRECO_UNITARIO, SUBTOTAL)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *
                `;

                const valoresItem = [
                    novoPedido.id,
                    item.peca_id,
                    item.quantidade,
                    item.preco_unitario,
                    item.subtotal
                ];

                const resItem = await client.query(queryItem, valoresItem);
                novoPedido.itens.push(new ItemPedido(resItem.rows[0]));

                const queryEstoque = `
                    UPDATE PECAS
                    SET qtd_estoque = qtd_estoque - $1
                    WHERE id = $2
                `;
                await client.query(queryEstoque, [item.quantidade, item.peca_id]);
            }

            await client.query('COMMIT');
            return novoPedido;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async findAll(filtros) {
        let query = `SELECT * FROM PEDIDOS`;
        const valores = [];
        const condicoes = [];

        if (filtros && filtros.situacao) {
            valores.push(filtros.situacao.toUpperCase());
            condicoes.push(`STATUS = $${valores.length}`);
        }

        if (filtros && filtros.cliente_id) {
            valores.push(filtros.cliente_id);
            condicoes.push(`CLIENTE_ID = $${valores.length}`);
        }

        if (condicoes.length > 0) {
            query += ` WHERE ` + condicoes.join(' AND ');
        }

        query += ` ORDER BY CRIADO_EM DESC`;

        const resultado = await pool.query(query, valores);

        return resultado.rows.map(row => {
            const pedido = new Pedido(row);
            delete pedido.itens;
            return pedido;
        });
    }

    async findById(id) {
        const queryPedido = `SELECT * FROM PEDIDOS WHERE ID = $1`;
        const resPedido = await pool.query(queryPedido, [id]);

        if (resPedido.rows.length === 0) {
            return null;
        }

        const pedido = new Pedido(resPedido.rows[0]);

        const queryItens = `
            SELECT ip.*, p.nome as peca_nome 
            FROM ITENS_PEDIDO ip
            INNER JOIN PECAS p ON ip.peca_id = p.id
            WHERE ip.pedido_id = $1
        `;
        const resItens = await pool.query(queryItens, [id]);

        pedido.itens = resItens.rows.map(row => new ItemPedido(row));
        return pedido;
    }

    async update(id, dados) {
        const query = `
            UPDATE PEDIDOS 
            SET STATUS = $1,
            ATUALIZADO_EM = NOW() 
            WHERE ID = $2 
            RETURNING *
        `;
        const resultado = await pool.query(query, [dados.status, id]);
        return resultado.rows.length > 0 ? new Pedido(resultado.rows[0]) : null;
    }

    async delete(id) {
        const query = `DELETE FROM PEDIDOS WHERE ID = $1 RETURNING *`;
        const resultado = await pool.query(query, [id]);
        return resultado.rows.length > 0;
    }
}

module.exports = new PedidoRepository();