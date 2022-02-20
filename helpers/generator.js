const generateCreditCard = () =>{
    const prefix = 888855558888;
    const random = Math.floor(Math.random() * (1000) + 1000);

    return prefix+random;
}

const generateDebitCard = () =>{
    const prefix = 222244442222;
    const random = Math.floor(Math.random() * (1000) + 1000);

    return prefix+random;
}

const cvvGenerator =()=>{
    return Math.floor((Math.random() * (999 - 100 + 1)) + 100);
}

const idGenerator = () =>{
    const random = Math.floor(Math.random() * (10000) + 1000); 
    

    return random + '-' + (new Date()).getTime().toString(36);
}
module.exports = {
    generateCreditCard,
    generateDebitCard,
    cvvGenerator,
    idGenerator
}