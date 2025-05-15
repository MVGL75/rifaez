import CustomDomain from "../models/CustomDomain.js";

export default async (req, res, next) => {
    const fullHost = req.headers.host?.split(':')[0]; // removes port if present
    const domainEntry = await CustomDomain.findOne({ domain: fullHost, verified: true });
  
    if (!domainEntry) {
      return res.status(404).send('Subdomain not recognized or not verified.');
    }
  
    req.userId = domainEntry.userId;
    req.customDomain = domainEntry.domain;
    next();
  }