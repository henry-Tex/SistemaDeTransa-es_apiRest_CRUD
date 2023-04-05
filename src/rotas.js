const express = require('express')
const { listarCategorias } = require('./controladores/categorias')
const { listarTransacoes, detalharTransacao, cadastrarTransacao, extratoTransacoes, atualizarTransação, excluirTransacao } = require('./controladores/transacoes')
const { cadastrarUsuario, atualizarUsuario, loginUsuario, detalharUsuario } = require('./controladores/usuarios')
const verificadorToken = require('./intermediarios/autenticador')
const { camposTransacao, validarCategoria, validarTipo } = require('./intermediarios/validacoesTransacoes')
const { campoNome, campoEmailSenha, emailExiste } = require('./intermediarios/validacoesUsuario')

const rotas = express.Router()

rotas.post('/usuario',campoNome,campoEmailSenha,emailExiste,cadastrarUsuario)
rotas.post('/login',campoEmailSenha,emailExiste,loginUsuario)
rotas.use(verificadorToken)
rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', campoNome, campoEmailSenha, emailExiste, atualizarUsuario)
rotas.get('/categoria', listarCategorias)
rotas.post('/transacao', camposTransacao, validarCategoria, validarTipo, cadastrarTransacao)
rotas.get('/transacao', listarTransacoes)
rotas.get('/transacao/extrato',extratoTransacoes);
rotas.get('/transacao/:id', detalharTransacao)
rotas.put('/transacao/:id',camposTransacao,validarTipo,atualizarTransação);
rotas.delete('/transacao/:id',excluirTransacao);



module.exports = rotas