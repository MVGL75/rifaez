const plans = {
    [process.env.PRICE_ID_BASIC]: {
        name: "basic",
        activeRaffles: 1,
        templates: ["classic"],
        workers: 2,
        rank: 1,
    },
    [process.env.PRICE_ID_PRO]: {
        name: "pro",
        activeRaffles: 10, 
        templates: ["classic", "minimalist"],
        workers: 5,
        rank: 2,

    },
    [process.env.PRICE_ID_BUSINESS]: {
        name: "business",
        activeRaffles: "unlimited",
        templates: ["classic", "modern", "minimalist"],
        workers: 10,
        rank: 3,

    },
}

export default plans;