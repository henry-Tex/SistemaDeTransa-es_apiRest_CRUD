const pool = require('../conexao') 
const { tratamentoFiltro } = require('../helpers/tratamentoFiltro')

const listarTransacoes = async (req, res) => {
    const { id } = req.usuario
    let {filtro} = req.query
   
    try {
        if(!filtro){
        const { rows } = await pool.query("select * from transacoes where usuario_id = $1", [id])

        return res.status(200).json(rows)
        }

        const query = `select ts.id, ts.tipo, ts.descricao, ts.valor, ts.data, ts.usuario_id, ct.id as "categoria_id", ct.descricao as "categoria_nome" 
        from transacoes as ts inner join categorias as ct 
        on ts.categoria_id = ct.id where ct.descricao in (${tratamentoFiltro(filtro)}) and ts.usuario_id = $1`
        
        const { rows, rowCount } = await pool.query(query, [id])

        if (rowCount === 0){
            return res.status(400).json({mensagem : "Transação não encontrada!"})
        }

        return res.status(200).json(rows)
    
    } catch (error) {
        console.log(error.messages)
        return res.status(400).json({mensagem: error.message})
    }
}

async function extratoTransacoes(req,res) {
    const {id} = req.usuario;
    try {
        //retornar o somatório dos valores de entrada e saida do usuário
        const queryEntrada = await pool.query("select sum(valor) from transacoes where usuario_id = $1 and tipo = 'entrada'",[id]);
        const querySaida = await pool.query("select sum(valor) from transacoes where usuario_id = $1 and tipo = 'saida'",[id]);
        let entrada = queryEntrada.rows[0].sum;
        let saida = querySaida.rows[0].sum;
        if (!entrada) entrada = 0;
        if (!saida) saida = 0;
        const result = {
            entrada,
            saida
        }
        res.status(200).json(result);  
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({mensagem:"Erro interno do servidor"});
    }
};

async function atualizarTransação (req,res) {
    const {descricao,valor,data,categoria_id,tipo} = req.body;
    const {id} = req.params;
    try {
        //Verificar se a transação existe e se pertence ao usuário, voltando rowsCount
        const {rowCount} = await pool.query (`select * from transacoes where id = $1 and usuario_id = $2`,[id,req.usuario.id]);
        if(rowCount===0)return res.status(404).json({mensagem:'A transação não existe'});
        //atualizar a transação associada ao usuário logado
        const query = 'update transacoes set descricao = $1,valor = $2,data = $3,categoria_id = $4,tipo = $5 where id = $6';
        await pool.query(query,[descricao,valor,data,categoria_id,tipo,id]);
        return res.status(204).send();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({mensagem:"Erro interno do servidor"});
    } 
};

const detalharTransacao = async (req, res) => {
    const { id: idUsuario } = req.usuario
    const { id: idTransacao } = req.params
    
    try {

        const { rows, rowCount } = await pool.query("select * from transacoes where id = $1 and usuario_id = $2", [idTransacao, idUsuario])

        if (rowCount === 0){
            return res.status(400).json({mensagem: "Transação não encontrada."})
        }

        return res.status(200).json({rows})

    } catch (error) {
        return res.status(400).json({mensagem: error.message})
    }
}


const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id } = req.usuario
    
    try {
        const { rows } = await pool.query("insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning id, descricao, valor, data, categoria_id, usuario_id, tipo ", [descricao, valor, data, categoria_id, id, tipo])
        
        return res.status(201).json(rows)
        
    } catch (error) {
        return res.status(400).json({mensagem : error.message})
    }
    
    
}

const excluirTransacao = async (req,res) =>{
    const {id} = req.params
    try {
        //verificar se transação existe e se pertence ao usuário, voltando rowsCount
        const {rowCount} = await pool.query (`select * from transacoes where id = $1 and usuario_id = $2`,[id,req.usuario.id]);
        if(rowCount===0)return res.status(404).json({mensagem:'A transação não existe'});
        //deletar transação
        await pool.query ('delete from transacoes where id = $1',[id])
        return res.status(204).send();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({mensagem:"Erro interno do servidor"});
    }
};

module.exports = {
    cadastrarTransacao,
    listarTransacoes,
    detalharTransacao,
    extratoTransacoes,
    atualizarTransação,
    excluirTransacao
}