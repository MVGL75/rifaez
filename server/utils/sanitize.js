export default function ({username, name, raffles, phone, facebook, workers, logo, companyName, _id}){
    const safeUser = {
        _id,
        username,
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