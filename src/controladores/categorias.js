const pool = require("../conexao")

async function listarCategorias(req,res) {
    try {
        const query = `select * from categorias`
        const {rows} = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.log(erro.message);
        res.status(400).json({mensagem:"erro interno do servidor"})  
    }
};

module.exports={listarCategorias}