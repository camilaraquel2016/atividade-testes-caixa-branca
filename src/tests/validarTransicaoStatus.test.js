import { describe, it, expect } from 'vitest';
const PedidoService = require('../services/PedidoService');

describe('Testes de Caixa Branca - validarTransicaoStatus', () => {

  it('CT-01: Deve lançar exceção quando o novo status for inválido', () => {
    expect(() => {
      PedidoService.validarTransicaoStatus('PENDENTE', 'INVALIDO');
    }).toThrow('Status informado é inválido.');
  });

  it('CT-02: Deve lançar exceção ao tentar alterar para o mesmo status atual', () => {
    expect(() => {
      PedidoService.validarTransicaoStatus('PENDENTE', 'PENDENTE');
    }).toThrow('O pedido já está com o status PENDENTE.');
  });

  it('CT-03: Deve lançar exceção ao tentar alterar status de pedido encerrado', () => {
    expect(() => {
      PedidoService.validarTransicaoStatus('FINALIZADO', 'CONFIRMADO');
    }).toThrow('Não é permitido alterar o status de um pedido que já está FINALIZADO.');
  });

  it('CT-04: Deve lançar exceção ao tentar pular etapas do fluxo', () => {
    expect(() => {
      PedidoService.validarTransicaoStatus('PENDENTE', 'FINALIZADO');
    }).toThrow('Não é permitido finalizar um pedido PENDENTE. Ele precisa ser CONFIRMADO primeiro.');
  });

  it('CT-05: Deve lançar exceção ao tentar regressão de status', () => {
    expect(() => {
      PedidoService.validarTransicaoStatus('CONFIRMADO', 'PENDENTE');
    }).toThrow('Este pedido já foi CONFIRMADO. Você não pode fazê-lo voltar para PENDENTE.');
  });

  it('CT-06: Deve permitir transição válida de PENDENTE para CONFIRMADO', () => {
    const resultado = PedidoService.validarTransicaoStatus('PENDENTE', 'CONFIRMADO');
    expect(resultado).toBe('CONFIRMADO');
  });

});