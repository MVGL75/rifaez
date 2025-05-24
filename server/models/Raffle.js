


import mongoose from "mongoose"
const RaffleSchema = new mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            endDate: {
                type: Date,
                default: () => {
                    const now = new Date();
                    now.setDate(now.getDate() + 30);
                    now.setHours(23, 59, 59, 999); 
                    return now;
                  }                
            },
            maxParticipants: {
                type: Number,
                required: true
            },
            currentParticipants: {
                type: [{
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    state: {
                        type: String
                    },
                    date: {
                        type: String
                    },
                    tickets: {
                        type: [Number]
                    },
                    amount: {
                        type: Number
                    },
                    status: {
                        type: String,
                        default: "pending"
                    },
                    transactionID: {
                        type: String,
                    },
                    notes: {
                        type: [String],
                        default: []
                    }
                }],
                required: true,
                default: []
            },
            isActive: {
                type: Boolean,
                required: true
            },
            paymentMethods: {
                type: [{
                  bank: String,
                  person: String, 
                  number: String,
                  clabe: String,
                  instructions: String,
                }],
                default: [],
              },
            additionalPrizes: {
                type: [{
                    place: Number,
                    prize: String
                }],
                default: []
            },
            template: {
                type: String,
                required: true,
            },
            colorPalette: {
                type: {
                    header: String,
                    background: String,
                    accent: String,
                    borders: String,
                    color: String,
                },
                required: true,
            },
            logo_position: {
                type: String,
                default: "center"
            },
            header: {
                type: String,
                default: "on"
            },
            countdown: {
                type: String,
                default: "off"
            },
            font: {
                type: String,
            },
            // nightMode: {
            //     type: Boolean,
            //     default: false
            // },
            // maxTpT: {
            //     type: Number,
            //     default: 10
            // },
            timeLimitPay: {
                type: Number,
                min: 1,
                default: 3
            },
            images: {
                type: [{
                    url: String,
                    public_id: String
                }],
                default: []
            },
            extraInfo: {
                type: String,
            },
            contact: {
                type: [{
                    name: String,
                    email: String,
                    message: String,
                    date: String
                }],
                default: []
            },
            stats: {
                dailyVisitStats: {
                    type: [
                        {
                            date: String, // e.g., '2024-05-02'
                            count: Number,
                            time: {
                                type: [{
                                    hour: { type: String, required: true }, // e.g., "19:00"
                                    count: { type: Number, required: true }
                                  }],
                                default: []
                            },
                        }
                    ],
                    default: []
                },
                dailySales: {
                    type: [
                        {
                            date: String, // e.g., '2024-05-02'
                            count: Number,
                            time: {
                                type: [{
                                    hour: { type: String, required: true }, // e.g., "19:00"
                                    count: { type: Number, required: true }
                                  }],
                                default: []
                            },
                        }
                    ],
                    default: []
                },
                paidParticipants: { type: Number, default: 0 }
            }
        }
)

RaffleSchema.virtual('totalVisits').get(function () {
    return this.stats?.dailyVisitStats?.reduce((sum, visit) => sum + visit?.count, 0) || 0;
  });

  const calcTimeAgo = (notifyDate) => {
    const getToday = new Date();
    const notificationDate = new Date(notifyDate);
    const diffInMs = getToday - notificationDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `Hace ${diffInDays} días`;
    } else if (diffInHours > 0) {
        return `Hace ${diffInHours} horas`;
    } else if (diffInMinutes > 0) {
        return `Hace ${diffInMinutes} minutos`;
    } else if (diffInSeconds > 0) {
        return `Hace ${diffInSeconds} segundos`;
    } else {
        return "Justo ahora";
    }
};

RaffleSchema.virtual('notifications').get(function () {
    const getToday = new Date();
    const getTodayIso = getToday.toISOString().split('T')[0]; 
    const notifications = [];
    let id = 0;

    const curr = this.currentParticipants?.filter((part) => part.date.split('T')[0] === getTodayIso);
    if (curr && curr.length > 0) {
        curr.forEach((participant) => {
            id += 1;
            const notifyTime = calcTimeAgo(participant.date);
            notifications.push({
                id: id,
                type: "sale",
                message: `Transacción #${participant.transactionID}`,
                time: notifyTime
            });
        });
    }
    const cont = this.contact?.filter((part) => part.date.split('T')[0] === getTodayIso);

    if (cont && cont.length > 0) {
        cont.forEach((contact) => {
            id += 1;
            const notifyTime = calcTimeAgo(contact.date);
            notifications.push({
                id: id,
                type: "contact",
                message: `Te contactó ${contact.name}`,
                time: notifyTime
            });
        });
    }

    return notifications;
});




RaffleSchema.virtual('totalSales').get(function () {
    return this.stats.dailySales.reduce((sum, sale) => sum + sale.count, 0);
  });
RaffleSchema.virtual('readableEndDate').get(function () {
    const humanReadableDate = this.endDate.toLocaleString(); 
    return humanReadableDate
});
RaffleSchema.virtual('totalRevenue').get(function () {
    const totalRevenue = this.price * this.maxParticipants;
    return totalRevenue
});
RaffleSchema.set('toJSON', {
virtuals: true 
});
RaffleSchema.set('toObject', {
    virtuals: true 
});

export default mongoose.model('Raffle', RaffleSchema);


