const pool = require("../conexao");
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const senhaJWT = require('../passJWT');


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const senhaCriptografada = bcrypt.hashSync(senha, 10)
    const emailVerificado = req.verificarEmail
    
    try {

        if (emailVerificado){
            return res.status(400).json({
                mensagem: "Já existe usuário cadastrado com o e-mail informado"
            })
        }

        const { rows } = await pool.query("insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email ", [nome, email, senhaCriptografada])
        
        return res.status(201).json(rows)

    } catch (error) {
        return res.status(400).json({mensagem: error.message})
    }
}

async function loginUsuario(req,res) {
    const {email,senha} = req.body;
    try {
        const {rows,rowCount} = req.email;
        if(rowCount === 0)return res.status(404).json({mensagem:'Email ou senha inválidos'});
        //verificar se a senha é válida via bcrypt
        const senhaVerificada = await bcrypt.compare (senha,rows[0].senha);
        if (!senhaVerificada)return res.status(400).json({mensagem:'Email ou senha inválidos'});
        //gerar token
        const token = jwt.sign({id:rows[0].id},senhaJWT,{expiresIn:'8h'})
        //retornar token para o front sem a senha do usuário
        const {senha:$, ...usuarioLogado} = rows[0];
        return res.json({usuario:usuarioLogado,token})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({mensagem:'erro interno do servidor'});
    }

};

function detalharUsuario(req,res) {
    const usuario = req.usuario;
    res.status(200).json(usuario);
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.usuario
    const { nome, email, senha } = req.body
    const senhaCriptografada = bcrypt.hashSync(senha, 10)
    const emailVerificado = req.verificarEmail
  
    try {
        
        if (emailVerificado){
            return res.status(403).json({mensagem: "O e-mail informado já está sendo utilizado por outro usuário."})
    }

    const { rows } = await pool.query("update usuarios set nome = $1, email = $2, senha = $3 where id = $4", [nome, email, senhaCriptografada, id])
    return res.status(204).json({rows})

    } catch (error) {
        return res.status(400).json({mensagem: error.message})
    }


}

module.exports = {
    cadastrarUsuario,
    atualizarUsuario,
    loginUsuario,
    detalharUsuario
}

