function mockIAResponse(pergunta) {
  if (pergunta.toLowerCase().includes("contrato")) {
    return "Este documento trata de cláusulas contratuais.";
  }
  return "A IA identificou informações relevantes.";
}

module.exports = {
  mockIAResponse,
}; 