const plans = {
    [process.env.PRICE_ID_BASIC]: {
        name: "basic",
        activeRaffles: 1,
        templates: ["classic"],
        workers: 2,
        rank: 1,
        methods: 3,
    },
    [process.env.PRICE_ID_PRO]: {
        name: "pro",
        activeRaffles: 10, 
        templates: ["classic", "popular"],
        workers: 5,
        rank: 2,
        methods: 10,


    },
    [process.env.PRICE_ID_BUSINESS]: {
        name: "business",
        activeRaffles: "unlimited",
        templates: ["classic", "popular", "modern"],
        workers: 10,
        rank: 3,
        methods: 15,


    },
}

export default plans;