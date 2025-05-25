import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button";
export default function Notifications({setSelectedRaffle}){
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([]);
    const [contactMessage, setContactMessage] = useState({})

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

    const openContactModal = (contact) => {
        setContactMessage(contact)
        document.getElementById("contact-message").showModal();
    }

    return (
        <div className="space-y-10 px-8">
        <h1 className="text-2xl text-center">Notificaciones</h1>
        <div className="max-w-[700px] mx-auto flex flex-col gap-5 items-center">
        <dialog id="contact-message" className="bg-transparent focus-visible:outline-none focus-visible:ring-0">
            <div className="p-6 rounded-lg shadow-lg w-[300px] max-w-[calc(100vw-24px)] bg-card text-card-foreground space-y-4">
                <header className="text-xl font-medium">
                    Contacto
                </header>
                <div className="space-y-2">
                    <span>Nombre</span>
                    <p>{contactMessage.name}</p>
                </div>
                <div className="space-y-2">
                    <span>Correo</span>
                    <p>{contactMessage.email}</p>
                </div>
                <div className="space-y-2">
                    <span>Mensaje</span>
                    <p>{contactMessage.message}</p>
                </div>
                <div className="space-y-2">
                    <span>Fecha</span>
                    <p>{contactMessage.date}</p>
                </div>
                <footer>
                <Button
                        variant="outline"
                        className="focus-visible:outline-none focus-visible:ring-0"
                        onClick={()=>{document.getElementById("contact-message").close()}}
                      >Cancelar</Button>
                </footer>
            </div>
        </dialog>
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg w-full overflow-hidden ${
                    notification.type === "pending"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-muted/50 border border-gray-200"
                  }`}
                  onClick={notification.type === "contact" ? ()=>{openContactModal(notification.contact)} : null}
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