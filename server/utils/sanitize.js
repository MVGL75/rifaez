export default function ({username, payment_methods, name, raffles, phone, facebook, workers, logo, companyName, _id}){
    const safeUser = {
        _id,
        username,
        payment_methods,
        name,
        raffles,
        phone,
        facebook,
        workers,
        logo,
        companyName
    }
    return safeUser
}