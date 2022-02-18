const usuariosGet = (req, res)=> {

    res.render('home')

}

const getTransact = ( req, res ) =>{
    res.render('transactions')
    titulo: 'Transactions'
}

const signIn = ( req, res )=>{
    res.render('sign-in')
}

const newRecord = (req, res) =>{
    console.log(req.data)
    const data = req.body
    res.json({data})
}



module.exports = {
    usuariosGet,
    getTransact,
    signIn,
    newRecord
}