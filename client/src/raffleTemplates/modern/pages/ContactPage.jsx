
import {useState, useEffect} from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';
import { Mail, Phone, Send } from 'lucide-react';
import axios from "axios";
import { useOutletContext, useParams } from 'react-router-dom';
import ContactSuccess from '../../components/ContactSuccess';
import { contactValidationSchema } from '../../../validation/contactSchemaValidate';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const ContactPage = () => {
  const {id} = useParams()
  const [contactSent, setContactSent] = useState(false)
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const raffle = useOutletContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(prev => ({...prev, [name]: value}))
  }
  const validateForm = () => {
    const errorObj = {}
    let isValid = true
    const {error, value} = contactValidationSchema.validate(formData, { abortEarly: false })
    if(error){
      isValid = false
      error.details.forEach(detail => errorObj[detail.context.key] = detail.message)
    }
    setErrors(errorObj)
    return [isValid, value]
  }


  useEffect(()=>{
    if(wasSubmitted){
      validateForm()
    }
  },[formData])
  const setPhoneFormat = (phone) => {
    if(phone){
      const digits = phone?.replace(/\D/g, ''); 

      const parts = [];

      if (digits.length > 0) {
        parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
      }
      if (digits.length >= 4) {
        parts[0] += ') ';
        parts.push(digits.substring(3, Math.min(6, digits.length)));
      }
      if (digits.length >= 7) {
        parts.push('-' + digits.substring(6, 10));
      }

      return parts.join('');
    }
    
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasSubmitted(true)
    const [isValid, value] = validateForm()
    if(isValid){
      const res = await api.post(`/api/raffle/${id}/contact`, value)
      if(res.data.status === 200){
        setContactSent(true)
      }
    }
  };

  return (
    <motion.div 
      className="space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      <section className="text-center">
        <h1 className="text-4xl font-bold text-primaryRaffle mb-4">Ponte en Contacto</h1>
        <p className="text-lg text-colorRaffle-300 max-w-2xl mx-auto">
          ¿Tienes alguna pregunta o comentario? Nos encantaría saber de ti. Completa el formulario o utiliza nuestros datos de contacto.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl">
            {contactSent ? (
              <div className='p-6'>
                <ContactSuccess/>
                </div>
            ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-primaryRaffle flex items-center">
                  <Send className="mr-2 h-6 w-6" /> Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${errors.name ? "text-red-500" : "text-colorRaffle"} mb-1`}>Nombre Completo</label>
                  <input type="text" name="name" onChange={handleChange} value={formData.name} id="name" className={`bg-transparent w-full px-3 py-2 border ${errors.name ? "border-red-400" : "border-borderRaffle"} rounded-md shadow-sm focus:outline-none focus:ring-primaryRaffle focus:border-primaryRaffle`} />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${errors.email ? "text-red-500" : "text-colorRaffle"} mb-1`}>Correo Electrónico</label>
                  <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} className={`bg-transparent  w-full px-3 py-2 border ${errors.email ? "border-red-400" : "border-borderRaffle"} rounded-md shadow-sm focus:outline-none focus:ring-primaryRaffle focus:border-primaryRaffle`} />
                </div>
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${errors.message ? "text-red-500" : "text-colorRaffle"} mb-1`}>Mensaje</label>
                  <textarea id="message" rows="4" name="message" onChange={handleChange} value={formData.message} className={`bg-transparent  w-full px-3 py-2 border ${errors.message ? "border-red-400" : "border-borderRaffle"} rounded-md shadow-sm focus:outline-none focus:ring-primaryRaffle focus:border-primaryRaffle`} ></textarea>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Enviar Mensaje
                </Button>
              </CardContent>
            </>)}
          </Card>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-colorRaffle">Información de Contacto</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-cardRaffle rounded-lg">
              <Mail className="h-6 w-6 text-primaryRaffle mt-1" />
              <div>
                <h3 className="font-semibold text-colorRaffle">Correo Electrónico</h3>
                <p className="text-colorRaffle-300 hover:text-primaryRaffle transition-colors cursor-pointer">{raffle.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-cardRaffle rounded-lg">
              <Phone className="h-6 w-6 text-primaryRaffle mt-1" />
              <div>
                <h3 className="font-semibold text-colorRaffle">Teléfono</h3>
                <p className="text-colorRaffle-300 hover:text-primaryRaffle transition-colors cursor-pointer">{setPhoneFormat(raffle.phone)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
  