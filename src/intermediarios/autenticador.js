const jwt = require ('jsonwebtoken');
const pool = require("../conexao");
const senhaJWT = require('../passJWT');

async function verificadorToken (req,res,next) {
    //traz o token do front verifica e extrai somente o token com split maroto
    const {authorization} = req.headers
    if(!authorization)return res.status(401).json({mensagem:"Para acessar este recurso um token de autenticação válido deve ser enviado."});
    const token = authorization.split(' ')[1];

    try {
        //verificar se o token está válido e com tempo
        const {id} = jwt.verify(token,senhaJWT);
        //verificar se usuário de fato existe no sistema
        const query = 'select * from usuarios where id = $1'
        const {rows,rowCount} = await pool.query(query,[id])
        if(rowCount===0)return res.status(401).json({mensagem:"Não autorizado"});
        const {senha:$, ...usuario} = rows[0];
        req.usuario = usuario;

        next();        
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({mensagem:"Não autorizado"});
    }
};
module.exports=verificadorToken;