const pool = require('../conexao')


const campoNome = async (req, res, next) => {
    const { nome } = req.body

try {
    if (!nome){
        return res.status(400).json({mensagem: 'Nome obrigatorio'})
    }
    next()
} catch (error) {
    return res.status(400).json({mensagem : error.messege})
}
}

const campoEmailSenha = async (req, res, next) => {
    const { email, senha } = req.body

try {    
    if (!email){
        return res.status(400).json({mensagem: 'Email obrigatorio'})
    }
    if (!senha){
        return res.status(400).json({mensagem: 'Senha obrigatoria'})
    }
    next()
} catch (error) {
    return res.status(400).json({mensagem : error.messege})
}
    
}

const emailExiste = async (req, res, next) => {
    const { email } = req.body

try {
    const resultado = (await pool.query("select * from usuarios where email = $1", [email]))

    req.verificarEmail = resultado.rowCount
    req.email = resultado

    next()
} catch (error) {
    return res.status(400).json({mensagem : error.messege})
}    
}





module.exports = {
    campoNome,
    campoEmailSenha,
    emailExiste
}

