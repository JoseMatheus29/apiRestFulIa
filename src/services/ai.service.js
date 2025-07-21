function mockIAResponse(pergunta) {
  const p = pergunta.toLowerCase();

  if (p.includes("contrato") || p.includes("cláusula")) {
    return "Este documento trata de cláusulas contratuais e termos de serviço.";
  }
  if (p.includes("financeiro") || p.includes("despesa") || p.includes("receita")) {
    return "Análise financeira indica um balanço de custos e receitas. Recomenda-se revisão dos principais indicadores.";
  }
  if (p.includes("relatório") || p.includes("vendas")) {
    return "O relatório de vendas aponta um crescimento de 15% no último trimestre, com destaque para a região Sudeste.";
  }
  if (p.includes("pagamento") || p.includes("fatura")) {
    return "O status de pagamento está em dia. Nenhuma fatura pendente foi encontrada para este período.";
  }
  if (p.includes("risco") || p.includes("segurança")) {
    return "Foram identificados potenciais riscos de segurança. É recomendável uma auditoria nos protocolos de acesso.";
  }

  return "A IA analisou o conteúdo e identificou informações relevantes para a sua pergunta.";
}

module.exports = {
  mockIAResponse,
}; 