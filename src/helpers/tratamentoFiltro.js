function tratamentoFiltro(filtro) {
    let result = filtro.map((re)=>{
    tamanho = re.length; 
    return re.padStart(tamanho+1,"'").padEnd(tamanho+2,"'")
    })
    return result
};
module.exports={tratamentoFiltro}