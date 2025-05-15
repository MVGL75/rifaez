export default function (raffle){
    const safeRaffle = Object.fromEntries(
        Object.entries(raffle).filter(([key, value]) => {
            if(key !== "__v" && key !== "stats" && key !== "_id" && key !== "id" && key !== "currentParticipants" && key !== "contact" ){
                return true
            }
            return false
        })
      );
    return safeRaffle
}