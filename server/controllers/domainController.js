import customDomain from '../models/CustomDomain.js';
import dns from 'dns/promises';
import axios from 'axios';
import renderApi from '@api/render-api';
renderApi.auth(process.env.RENDER_API_KEY);


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

  //   const entry = await customDomain.findOne({domain: domain});
  //   if(entry){ 
  //     if(userId === entry.userId.toString()){
  //     return res.json({
  //       message: 'Please add the following CNAME record to your DNS settings:',
  //       record: {
  //         type: 'CNAME',
  //         name: `subdomain`,
  //         value: 'domains.rifaez.com',
  //       },
  //       status: 200,
  //     }
  //   )
  //   } else {
  //     return res.json({
  //       message: 'Este dominio ya esta registrado con otro usuario.',
  //       status: 400,
  //     })
  //   }
  // }

    if (!userId || !domain) return res.status(400).json({ error: 'Missing data' });
  
    const verificationToken = Math.random().toString(36).substring(2, 15);

    const domainBody = {
      userId,
      domain,
      verificationToken,
    };
    
    const existingDomain = await customDomain.findOne({ userId });
    
    let savedDomain;

    // console.log(existingDomain)
    // return;
    if (existingDomain) {
      try {
        const response = await renderApi.createCustomDomain({name: domainBody.domain}, {serviceId: process.env.RENDER_SERVICE_ID})
        // await renderApi.deleteCustomDomain({serviceId: process.env.RENDER_SERVICE_ID, customDomainIdOrName: existingDomain.domain})
        existingDomain.domain = domain;
        existingDomain.verificationToken = verificationToken;
        existingDomain.status = "unverified";
        savedDomain = await existingDomain.save();
        console.log(response, "data")
        if(response.data[0].domainType === "apex"){
          return res.json({
              status: 200,
              type: "apex"
          });
        } else {
          return res.json({
              status: 200,
              type: "subdomain"
          });
        }
        
      } catch (error) {
        const status = error.status || 500;
        const errorTranslations = {
          400: 'La solicitud no pudo ser entendida por el servidor.',
          401: 'Falta información de autorización o es inválida.',
          402: 'Debe ingresar información de pago para realizar esta solicitud.',
          403: 'No tiene permisos para el recurso solicitado.',
          404: 'No se pudo encontrar el dominio solicitado.',
          406: 'No se pudo generar los tipos de medios preferidos como se especificó en el encabezado Accept.',
          409: 'Este dominio ya existe en otra pagina.',
          410: 'El recurso solicitado ya no está disponible.',
          429: 'Se ha superado el límite de solicitudes.',
          500: 'Ha ocurrido un error inesperado en el servidor.',
          503: 'El servidor no está disponible en este momento.',
        };
        const message = status || errorTranslations.status || 'Error desconocido';
        
        return res.status(status).json({
          message,
        });
      }
       
    } else {
      try {
        const response = await renderApi.createCustomDomain({name: domainBody.domain}, {serviceId: process.env.RENDER_SERVICE_ID})
        console.log(response, "data")
        savedDomain = await customDomain.create(domainBody);
        if(response.data[0].domainType === "apex"){
          return res.json({
            message: 'Please add the following CNAME record to your DNS settings:',
              record: {
                type: 'CNAME',
                name: `subdomain`,
                value: 'domains.rifaez.com',
              },
              status: 200,
              type: "apex"
          });
        } else {
          return res.json({
            message: 'Please add the following CNAME record to your DNS settings:',
              record: {
                type: 'CNAME',
                name: `subdomain`,
                value: 'rifaez.onrender.com',
              },
              status: 200,
              type: "subdomain"
          });
        }
        
      } catch (error) {
        const status = error.status || 500;
        const errorTranslations = {
          400: 'La solicitud no pudo ser entendida por el servidor.',
          401: 'Falta información de autorización o es inválida.',
          402: 'Debe ingresar información de pago para realizar esta solicitud.',
          403: 'No tiene permisos para el recurso solicitado.',
          404: 'No se pudo encontrar el dominio solicitado.',
          406: 'No se pudo generar los tipos de medios preferidos como se especificó en el encabezado Accept.',
          409: 'Este dominio ya existe en otra pagina.',
          410: 'El recurso solicitado ya no está disponible.',
          429: 'Se ha superado el límite de solicitudes.',
          500: 'Ha ocurrido un error inesperado en el servidor.',
          503: 'El servidor no está disponible en este momento.',
        };
        const message = status || errorTranslations.status || 'Error desconocido';
        
        return res.status(status).json({
          message,
        });
      }
    }

    
    
    
  
   
  }


  export const verifyCname = async (req, res) => {
    try {
      const { domain } = req.body;
      console.log('Creating Custom Hostname for:', domain);
  
      await renderApi.refreshCustomDomain({
        serviceId: process.env.RENDER_SERVICE_ID,
        customDomainIdOrName: domain
      })

      const result = await renderApi.retrieveCustomDomain({serviceId: process.env.RENDER_SERVICE_ID, customDomainIdOrName: domain})
  
      // Extract hostname ID (needed to poll later)
      const verificationStatus = result.data.verificationStatus;

      const entry = await customDomain.findOne({ domain });
      // console.log(entry)
      entry.status = verificationStatus;
      entry.hostnameId = result.data.id; // Save hostnameId so you can poll later
      await entry.save();
      return res.json({
        domain: entry,
        verificationStatus,
      });
    } catch (err) {
      console.error('Error creating custom hostname:', err.response?.data || err.message);
      return res.status(400).json({ valid: false, error: err.message, status: 400 });
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
  
  

 





