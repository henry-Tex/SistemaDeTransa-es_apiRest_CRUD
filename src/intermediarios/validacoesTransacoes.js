const pool = require("../conexao")

const camposTransacao = async (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body

try {
    if (!descricao){
        return res.status(400).json({mensagem: 'Descrição obrigatoria'})
    }
    if (!valor){
        return res.status(400).json({mensagem: 'Valor obrigatorio'})
    }
    if (!data){
        return res.status(400).json({mensagem: 'Data obrigatoria'})
    }
    if (!categoria_id){
        return res.status(400).json({mensagem: 'Id da categoria obrigatorio'})
    }
    if (!tipo){
        return res.status(400).json({mensagem: 'Tipo de transação obrigatorio'})
    }
    next()

} catch (error) {
    return res.status(400).json({mensagem : error.message})
}
}

const validarCategoria = async (req, res, next) => {
    const { categoria_id } = req.body

    try {
        const linhas = (await pool.query("select * from categorias where id = $1", [categoria_id])).rowCount

        if (!linhas){
            return res.status(404).json({mensagem : "Categoria não existe"})
        }
        next()

    } catch (error) {
        return res.status(400).json({mensagem : error.mensage})
    }
}

const validarTipo = async (req, res, next) => {
    const { tipo } = req.body

    try {
        const tipoTransacao = await tipo.trim().toLowerCase()
        if (tipoTransacao !== "entrada" && tipoTransacao !== "saida"){
            return res.status(404).json({mensagem : "Tipo de transação não existe"})
        }
        next()        
    } catch (error) {
        return res.status(400).json({mensagem : error.mensage})
    }
}


module.exports = {
    camposTransacao,
    validarCategoria,
    validarTipo
}