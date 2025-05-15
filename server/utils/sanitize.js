export default function ({username, name, raffles, phone, facebook, currentPlan, workers, logo, companyName, _id}){
    const safeUser = {
        _id,
        username,
        name,
        raffles,
        phone,
        facebook,
        currentPlan,
        workers,
        logo,
        companyName
    }
    return safeUser
}