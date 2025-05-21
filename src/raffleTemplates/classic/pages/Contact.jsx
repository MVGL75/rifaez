
import {useState, useEffect} from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { MailCheck } from 'lucide-react';
import {contactValidationSchema} from '../../../validation/contactSchemaValidate.js'
const api = axios.create({
  baseURL: 'http://localhost:5050',
  withCredentials: true,
});

const Contact = () => {
  const location = useLocation()
  const [contactSent, setContactSent] = useState(false)
  const [wasSubmitted, setWasSubmitted] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasSubmitted(true)
    const [isValid, value] = validateForm()
    if(isValid){
      const res = await api.post(location.pathname, value)
      if(res.data.status === 200){
        setContactSent(true)
      }
    }
  };


  return (
    <div className="max-w-[100vw] w-[1400px] mx-auto px-4 py-8 h-[calc(100vh-280px)] min-h-[500px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-cardRaffle p-8 rounded-lg"
      >
        {contactSent ?  (
          <div className="text-colorRaffle text-center flex flex-col items-center space-y-3">
            <MailCheck size={45}/>
            <h1 className="text-3xl">Mensaje Enviado</h1>
            <p className="text-base text-colorRaffle-300">
              Tu mensaje ha sido enviado exitosamente.
            </p>
          </div>) : 
        <>
        <h2 className="text-2xl font-bold text-colorRaffle mb-6">
          Contáctanos
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className={`block ${errors.name ? "text-red-400" : "text-colorRaffle"} mb-2`}>
              Nombre
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className={`w-full bg-transparent p-2 rounded text-colorRaffle border ${errors.name ? "border-red-400" : "border-borderRaffle"}`}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className={`block ${errors.email ? "text-red-400" : "text-colorRaffle"} mb-2`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className={`w-full bg-transparent p-2 rounded text-colorRaffle border ${errors.email ? "border-red-400" : "border-borderRaffle"}`}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className={`block ${errors.message ? "text-red-400" : "text-colorRaffle"} mb-2`}>
              Mensaje
            </label>
            <textarea
              name="message"
              onChange={handleChange}
              value={formData.message}
              className={`w-full p-2 rounded text-colorRaffle bg-transparent border ${errors.message ? "border-red-400" : "border-borderRaffle"} h-32`}
              placeholder="Tu mensaje"
            />
          </div>
          <Button type="submit" className="w-full bg-primaryRaffle hover:bg-primaryRaffle-dark">
            Enviar Mensaje
          </Button>
        </form>
        </>
        }
      </motion.div>
    </div>
  );
};

export default Contact;
