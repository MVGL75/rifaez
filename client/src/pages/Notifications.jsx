import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
export default function Notifications({setSelectedRaffle}){
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
    if (user?.raffles) {
        const all = [];
        user.raffles.forEach(raffle => {
        if (raffle.notifications) {
            const modifiedNotifications = raffle.notifications.map(n => ({...n, fromId: raffle.id, fromName: raffle.title }))
            all.push(...modifiedNotifications);
        }
        });
        setNotifications(all);
    }
    }, [user.raffles]);

    return (
        <div className="space-y-10 px-8">
        <h1 className="text-2xl text-center">Notificaciones</h1>
        <div className="max-w-[700px] mx-auto flex flex-col gap-5 items-center">
            
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg w-full ${
                    notification.type === "pending"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-muted/50 border border-gray-200"
                  }`}
                >
                    <div className="flex items-center justify-between p-4">
                        <span className="text-base">{notification.fromName}</span>
                        <span className="text-base">{notification.fromId}</span>
                    </div>

                  <div className="flex items-center justify-between p-4 bg-background ">
                    <span className="text-base">
                      {notification.message}
                      {notification.type === "pending" && (
                        <span className="ml-2 text-yellow-600">
                          (Pendiente - {notification.amount})
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No tienes ninguna notificación.</div>
            )}
        </div>
        </div>
    )
}