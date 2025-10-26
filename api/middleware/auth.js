/**
 * Middleware de Autenticação por Token
 * 
 * Valida o token de autenticação enviado no header Authorization
 * O token é comparado com a variável de ambiente API_TOKEN
 */

const authenticate = (req, res, next) => {
  // Obter token do header Authorization
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Token de autenticação não fornecido',
      message: 'Use o header Authorization: Bearer <seu-token>'
    });
  }

  // Verificar formato Bearer token
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      error: 'Formato de token inválido',
      message: 'Use o formato: Authorization: Bearer <seu-token>'
    });
  }

  const token = parts[1];

  // Validar token
  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({ 
      error: 'Token de autenticação inválido',
      message: 'O token fornecido não é válido'
    });
  }

  // Token válido, prosseguir
  next();
};

module.exports = authenticate;
