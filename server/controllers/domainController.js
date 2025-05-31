import customDomain from '../models/CustomDomain.js';
import dns from 'dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const createDomain = async (req, res) => {
    const { userId, domain } = req.body;
    const entry = await customDomain.findOne({domain: domain});

    if(entry) return res.json({
        message: 'Please add the following TXT record to your DNS settings:',
        record: {
          type: 'TXT',
          name: `_raffle-verification.${entry.domain}`,
          value: entry.verificationToken,
        },
        status: 200,
      }
    );

    if (!userId || !domain) return res.status(400).json({ error: 'Missing data' });
  
    const verificationToken = Math.random().toString(36).substring(2, 15);

    const domainBody = {
      userId,
      domain,
      verificationToken,
    };
    
    const existingDomain = await customDomain.findOne({ userId });
    
    let savedDomain;
    
    if (existingDomain) {
      // Update existing record
      existingDomain.domain = domain;
      existingDomain.verificationToken = verificationToken;
      savedDomain = await existingDomain.save();
    } else {
      // Create new record
      savedDomain = await customDomain.create(domainBody);
    }
  
    return res.json({
      message: 'Please add the following TXT record to your DNS settings:',
      record: {
        type: 'TXT',
        name: `_raffle-verification.${domain}`,
        value: verificationToken,
      },
      status: 200,
    });
  }

export const verifyDomain = async (req, res) => {
    const { domain } = req.body;
    const entry = await customDomain.findOne({domain: domain});
    if (!entry) return res.status(404).json({ error: 'Domain not found' });
  
    try {
      const records = await dns.resolveTxt(`_raffle-verification.${domain}`);
      const flat = records.flat().join('');
      if (flat === entry.verificationToken) {
        entry.verified = true;
        entry.lastVerifiedAt = new Date();
        await entry.save();
        return res.json({ 
            status: 200,
            record: {
                domain: entry.domain,
                rifaezDomain: process.env.CURRENT_DOMAIN,
                serverIP: "127.0.0.1:4040",
            },
        });
      }
      return res.json({ error: 'Verification token does not match' });
    } catch (err) {
        console.log(err)
      return res.json({ error: 'DNS lookup failed', detail: err.message });
    }
  }

  export const verifyCname = async (req, res) => {
    try {
    const {domain, subdomain} = req.body
      const records = await dns.resolveCname(subdomain + '.' + domain); // returns an array 
      console.log(records)
      const match = records.some(record => record === 'proxy.rifaez.com');
      if(match){
        const entry = await customDomain.findOne({domain: domain});
        entry.subdomain = subdomain;
        entry.status = 'active';
        await entry.save();
        console.log(entry)
        return res.json({ valid: true, status: 200, domain: entry })
      } else {
        res.json({ valid: false, records });
      }
    } catch (err) {
      return res.json({ valid: false, error: err.message });
    }
  }


import axios from 'axios';




export const addCustomDomainToVercel = async (domain) => {
  try {
    const response = await axios.post(
      `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
      { name: domain },
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};
