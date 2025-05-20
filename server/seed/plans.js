const plans = {
    [process.env.PRICE_ID_BASIC]: {
        name: "basic",
        permissions: ["active_raffles:1"],
        templates: ["classic"],
        workers: 2,
    },
    [process.env.PRICE_ID_PRO]: {
        name: "pro",
        permissions: ["active_raffles:10"], 
        templates: ["classic", "modern"],
        workers: 5,
    },
    [process.env.PRICE_ID_BUSINESS]: {
        name: "business",
        permissions: ["active_raffles:unlimited"],
        templates: ["classic", "modern", "minimalist"],
        workers: 10,
    },
}

export default plans;