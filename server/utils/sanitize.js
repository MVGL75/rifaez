export default function ({username, payment_methods, name, raffles, phone, facebook, workers, logo, companyName, _id, facebookId}){
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
        companyName,
        facebookId,
    }
    return safeUser
}