import customDomain from '../models/CustomDomain.js';
import dns from 'dns/promises';
import axios from 'axios';
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function createCustomHostname(hostname) {
  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/bf7cf8a974e628dd5389769df3af9cee/custom_hostnames`,
      {
        hostname: hostname,
        ssl: {
          method: "http",
          type: "dv",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Custom hostname created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating custom hostname:', error.response?.data || error.message);
    throw error;
  }
}


const getCustomHostnameStatus = async (hostnameId) => {
  try {
    const response = await axios.get(
      `https://api.cloudflare.com/client/v4/zones/bf7cf8a974e628dd5389769df3af9cee/custom_hostnames/${hostnameId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching hostname status:', error.response?.data || error.message);
    throw error;
  }
};


// createCustomHostname("make.com")


export const createDomain = async (req, res) => {
    const { userId, domain } = req.body;
    const entry = await customDomain.findOne({domain: domain});
    if(entry){ 
      if(userId === entry.userId.toString()){
      return res.json({
        message: 'Please add the following CNAME record to your DNS settings:',
        record: {
          type: 'CNAME',
          name: `subdomain`,
          value: 'domains.rifaez.com',
        },
        status: 200,
      }
    )
    } else {
      return res.json({
        message: 'Este dominio ya esta registrado con otro usuario.',
        status: 400,
      })
    }
  }

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
      message: 'Please add the following CNAME record to your DNS settings:',
        record: {
          type: 'CNAME',
          name: `subdomain`,
          value: 'domains.rifaez.com',
        },
        status: 200,
    });
  }


  export const verifyCname = async (req, res) => {
    try {
      const { domain, subdomain } = req.body;
      const hostname = subdomain + '.' + domain;
      console.log('Creating Custom Hostname for:', hostname);
  
      // Call Cloudflare API to create the custom hostname
      const result = await createCustomHostname(hostname);
  
      // Extract hostname ID (needed to poll later)
      const hostnameId = result.result?.id;
      const sslStatus = result.result?.ssl?.status || 'unknown';
  
      console.log(`Custom hostname created with status: ${sslStatus}`);
  
      // Save initial entry in DB
      const entry = await customDomain.findOne({ domain });
      entry.subdomain = subdomain;
      entry.status = sslStatus === 'active' ? 'active' : 'pending';
      entry.hostnameId = hostnameId; // Save hostnameId so you can poll later
      await entry.save();
  
      return res.json({
        valid: true,
        status: 200,
        domain: entry,
        hostnameId,
        sslStatus,
      });
    } catch (err) {
      console.error('Error creating custom hostname:', err.response?.data || err.message);
      return res.json({ valid: false, error: err.message, status: 400 });
    }
  };

  export const pollHostnameStatus = async (req, res) => {
    try {
      const { hostnameId } = req.body;
      const result = await getCustomHostnameStatus(hostnameId); // Your function to call Cloudflare API GET /custom_hostnames/:id
  
      const sslStatus = result.result?.ssl?.status || 'unknown';
      console.log(`Polling hostname status: ${sslStatus}`);
  
      // Optionally update DB
      const entry = await customDomain.findOne({ hostnameId });
      if (entry) {
        entry.status = sslStatus === 'active' ? 'active' : 'pending';
        await entry.save();
      }

      console.log(entry)
  
      return res.json({
        valid: sslStatus === 'active',
        status: 200,
        sslStatus,
        domain: entry,
      });
    } catch (err) {
      console.error('Error polling hostname status:', err.response?.data || err.message);
      return res.json({ valid: false, error: err.message, status: 400 });
    }
  };
  
  

 





