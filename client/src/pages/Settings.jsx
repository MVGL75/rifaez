
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { saveSchema, workerSchema, passwordSchema, methodSchema } from "../validation/userSchema";
import DefaultLogo from "../raffleTemplates/components/ui/default-logo";
import { 
  User, 
  CreditCard, 
  Palette, 
  Globe, 
  Building2, 
  Upload, 
  Moon, 
  Sun, 
  Languages, 
  AlertTriangle, 
  Plus, 
  Link as LinkIcon, 
  FileText, 
  LogOut, 
  Mail, 
  Lock, 
  Building, 
  Check, 
  X, 
  DollarSign, 
  CreditCard as PaymentIcon, 
  Wallet as Bank,
  Users,
  Facebook,
  Phone,
  Save,
  Info,
  CircleX,
  CircleAlert,
  CirclePlus,
  Trash2
} from 'lucide-react';


import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});



const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout, user, setUser, save, setAppError, setPopError, connectDomain, verifyDomain, verifyCNAME } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [theme, setTheme] = useState(user.theme ? user.theme : "system");
  const [language, setLanguage] = useState("es");
  const [wasSubmitted, setWasSubmitted] = useState({})
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [newWorker, setNewWorker] = useState({});
  const [newMethod, setNewMethod] = useState({})
  const [domainV, setDomainV] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState(null)
  const [record, setRecord] = useState({step: 0,})
  const [fileState, setFileState] = useState(null)
  const [changedPassword, setChangedPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({});
  const [methods, setMethods] = useState(user.payment_methods || [])

  const [workers, setWorkers] = useState(user.workers || [])
  const [successMessage, setSuccessMessage] = useState("")
  const [passwordObj, setPasswordObj] = useState({})
  const [formData, setFormData] = useState({
    name: user.name || "Juan Pérez",
    email: user.username || "juan@example.com",
    companyName: user.companyName,
    logo: user.logo || undefined,
    facebook: user.facebook,
    phone: user.phone,
  });

  const handleLogout = () => {
    logout(); // This will handle both state cleanup and navigation
  };

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: {url: URL.createObjectURL(file)} }));
      setFileState(file)
    }
  };
  const formatMethodNumber = (input) => {
    const digits = String(input).replace(/\D/g, '');
  
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  

  const addPaymentMethod = async () => {
    setWasSubmitted(prev => ({...prev, method: true}))
    const {error, value} = methodSchema.validate(newMethod, {abortEarly: false});
    let newObj = {}
    if(error){
      error.details.forEach(error => {
        newObj[error.context.key] = error.message
      })
      
    }
    setErrors(prev => ({...prev, method: newObj}))

    if(error){
      return;
    }

    const res = await api.post("/auth/save_settings/add_method", value)
    console.log(res)
    if(res.data.status === 200){
      setUser(res.data.user)
      setMethods(prev => [...prev, {...value, _id: res.data.id}])
      setWasSubmitted(prev => ({...prev, method: undefined}))
      setErrors(prev => ({...prev, method: undefined}))
      setNewMethod({bank: '', person: '', number: ""})
    } else {
      setAppError({message: "error creating method"})
    }
  };

const removeMethod = async (methodInp) => {
  const methodNew = methodInp
  const res = await api.post("/auth/save_settings/remove_method", {id: methodNew._id})
  if(res.data.status === 200){
    setUser(res.data.user)
    setMethods(prev => prev.filter(method => method._id !== methodNew._id) || [])
  } else {
    setErrors(prev => ({...prev, removeWorker: "Invalid"}))
  }
  
}
  const handleAddWorker = async () => {
    setWasSubmitted(prev => ({...prev, worker: true}))
    const {password, email} = newWorker

    
    const {error, value} = workerSchema.validate({email}, {abortEarly: false});
    let newObj = {}
    if(error){
      newObj[error.details[0].context.key] = error.details[0].message
    }
    setErrors(prev => ({...prev, worker: newObj}))

    if(error){
      return;
    }

    const res = await api.post("/auth/save_settings/add_worker", {email, password})

    if(res.data.status === 200){
      setWorkers(prev => [...prev, value])
      setWasSubmitted(prev => ({...prev, worker: undefined}))
      setErrors(prev => ({...prev, addWorker: undefined}))
      setNewWorker({email: '', password: ''})
    } else if (res.data.status === 808){
      setPopError({message: res.data.message, status: 808})
    } else {
      setErrors(prev => ({...prev, passwordIncorrect: "Invalid"}))
    }
  };

  const handleRemoveWorker = async (email) => {
    const res = await api.post("/auth/save_settings/remove_worker", {email})

    if(res.data.status === 200){
      setWorkers(prev => prev.filter(worker => worker.email !== email) || [])
    } else {
      setErrors(prev => ({...prev, removeWorker: "Invalid"}))
    }
  };

  useEffect(()=>{
    if(wasSubmitted.form){
      formValidate();
    }
  }, [formData])

  const formValidate = () => {
    const {error, value} = saveSchema.validate(formData, {abortEarly: false, stripUnknown: true})
    let newObj = {}
    if(error){
      error?.details.forEach(detail => {
        newObj[detail.context.key] =  detail.message
      })
    }
    setErrors(newObj)
    return {error, value}
  }
 
  const handlePhoneChange = () => {
    setWasSubmitted(prev => ({...prev, phone: true}))
    const {error, value} = saveSchema.extract('phone').validate(newPhoneNumber);
    if(error){
      setErrors(prev => ({...prev, phone: error}))
      return;
    } else {
      setErrors(prev => ({...prev, phone: undefined}))
    }
    setFormData(prev => ({...prev, phone: value}))
    document.getElementById("change-phone").close()
    setNewPhoneNumber(null);
  }
  const handleDomainChange = (e) => {
    setDomainV(e.target.value)
  }
  const connectDomainFunc = async (type) => {
    if(type === "create"){
      const res = await connectDomain(domainV);
      const newErr = {}
      if(res.status ===  200){
        setRecord({step: 1, ...res.record})
      } else {
        newErr.domain_verification = true
      }
      setErrors(prev => ({...prev, ...newErr}))
      return;
    } 
   if(type === "verify"){
      const res = await verifyDomain(domainV);
      const newErr = {}
      
      if(res.status ===  200){
        const newRecord = {
          subdomainName: res.record.domain,
          serverIP: res.record.serverIP,
          ngrokDomain: res.record.ngrokDomain,
        }
        setRecord({step: 2, ...newRecord})
      } else {
        newErr.domain_verification = true
      }
      setErrors(prev => ({...prev, ...newErr}))
      return;
   }
    if(type === "cname"){
      const res = await verifyCNAME(domainV);
      const newErr = {}
      if(res.status ===  200){
        setRecord({step: 3})
      } else {
        newErr.domain_verification = true
      }
      setErrors(prev => ({...prev, ...newErr}))
    }
  }

  const handleChange = (e) => {
    let {name, value} = e.target;
    if(name === "phone"){
      value = value.replace(/\D/g, '');
      if(value.length > 10){
        value = value.slice(0, 10); 
      }
      setNewPhoneNumber(value);
      return;
    }
    if(name === "worker_email" || name === "worker_password"){
      setNewWorker(prev => ({...prev, [name.slice(7)]: value}));
      return;
    }
    if(name === "method_person" || name === "method_number" || name === "method_bank"){
      if(name === "method_number"){
        let digits = value.replace(/\D/g, '');
        if (digits.length > 16) {
          digits = digits.slice(0, 16);
        }
        value = digits
      }
      
      setNewMethod(prev => ({...prev, [name.slice(7)]: value}));
      return;
    }
    setFormData(prev => ({...prev, [name]: value}));
  }


  useEffect(() => {
    if(!wasSubmitted.phone) return;
    const {error} = saveSchema.extract('phone').validate(newPhoneNumber);
    if(error){
      setErrors(prev => ({...prev, phone: error}))
      return;
    } else {
      setErrors(prev => ({...prev, phone: undefined}))
    }
  }, [newPhoneNumber])
  useEffect(() => {
    if(!wasSubmitted.worker) return;
    const {email} = newWorker
    const {error} = workerSchema.validate(email, {abortEarly: false});
    let newObj = {}
    if(error){
      newObj[error.details[0].context.key] = error.details[0].message
    }
    setErrors(prev => ({...prev, worker: newObj}))
  }, [newWorker])
  useEffect(() => {
    if(!wasSubmitted.method) return;
    const {error} = methodSchema.validate(newMethod, {abortEarly: false});
    let newObj = {}
    if(error){
      error.details.forEach(error => {
        newObj[error.context.key] = error.message
      })
      
    }
    setErrors(prev => ({...prev, method: newObj}))
  }, [newMethod])

  const setPhoneFormat = (phone) => {
    if (typeof phone !== 'string') {
      phone = String(phone); 
    }

    const digits = phone?.replace(/\D/g, ''); 
    const parts = [];

    if (digits?.length > 0) {
      parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
    }
    if (digits?.length >= 4) {
      parts[0] += ') ';
      parts.push(digits.substring(3, Math.min(6, digits.length)));
    }
    if (digits?.length >= 7) {
      parts.push('-' + digits.substring(6, 10));
    }

    return parts.join('');
  }

  const handlePasswordChange = (e) => {
    const {name, value} = e.target
    setPasswordObj(prev => ({...prev, [name]: value}));
  }

  const passwordChange = async () => {
    setWasSubmitted(prev => ({...prev, password: true}));
    if(!passwordObj.password){
      setErrors(prev => ({...prev, password: "llena contraseña"}))
      return;
    }
    const res = await api.post("/auth/check_password", {password: passwordObj.password})
    if(res.data.status === 200){
      setErrors(prev => ({...prev, password: undefined}))
      const {error, value} = passwordSchema.validate(passwordObj.password_new)
      if(error){
        setErrors(prev => ({...prev, password_new: "contraseña no cumple los requisitos"}));
        return;
      } else if (passwordObj.password_new === passwordObj.password_new_confirm){
        const res = await api.post("/auth/change_password", {password: passwordObj.password, password_new: value})
        if(res.data.status === 200){
          setWasSubmitted(prev => ({...prev, password: undefined}));
          setPasswordObj({});
          setChangedPassword(true)
          setErrors(prev => ({...prev, password: undefined, password_new: undefined, password_new_confirm: undefined,}))
        }
      } else {
        setErrors(prev => ({...prev, password_new_confirm: "contraseñas deben ser iguales"}));
      }
    } else {
      setErrors(prev => ({...prev, password: "contraseña es incorrecta"}))
    }
    
  }

  useEffect(() => {
    if (wasSubmitted.password) {
      const {error} = passwordSchema.validate(passwordObj.password_new)
      if(error){
        setErrors(prev => ({...prev, password_new: "contraseña no cumple los requisitos"}));
      } else if (passwordObj.password_new !== passwordObj.password_new_confirm){
        setErrors(prev => ({...prev, password_new_confirm: "contraseñas deben ser iguales"}));
      } else {
        setErrors(prev => ({...prev, password: undefined, password_new: undefined, password_new_confirm: undefined,}))
      }
    }
  }, [passwordObj])

  useEffect(() => {
    let timer;
    if (changedPassword) {
      timer = setTimeout(() => {
        setChangedPassword(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [changedPassword])
  const saveSettings = async () => {
    setLoading(true);
    setWasSubmitted({form: true});
    const {error, value} = formValidate();
    if(error){
      setLoading(false);
      return;
    }
    try {
      const newRaffleData = new FormData();
      Object.entries(value).forEach(([key, value]) => {
        if(key !== "logo"){
          newRaffleData.append(key, value);
        }
      });
      if(fileState){
        newRaffleData.append("logo", fileState);
      }
      const res = await save(newRaffleData)
      console.log(res)
      if(res.status === 200){
        setSuccessMessage('Usuario guardado exitosamente.');
      } else {
        console.log('Error saving user');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const element = document.documentElement;
    switch (theme) {
      case "dark":
        element.classList.add("dark")
        localStorage.setItem("theme", "dark")
        break;
      case "light":
          element.classList.remove("dark")
          localStorage.setItem("theme", "light")
      break;
    }
  }, [theme]);
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleSubscribe = (priceId) => {
      navigate(`/checkout?price_id=${priceId}`);
  }
  const handleSubscribeChange = async (priceId) => {
    try {
      const res = await api.post("/stripe/update-plan", {newPriceId: priceId});
      if(res.data){
        setUser(res.data)
      }
    } catch (error) {
      console.log(error)
      setAppError(error)
    }
  }
  const handleCancelSubscription = async (priceId) => {
    try {
      const res = await api.post("/stripe/cancel-subscription");
      if(res.data){
        setUser(res.data)
      }
    } catch (error) {
      console.log(error)
      setAppError(error)
    }
  }

  const plans = [
    {
      id: "basic",
      name: "Plan Básico",
      price_id: import.meta.env.VITE_PRICE_ID_BASIC, 
      price: "$9.99",
      features: [
        "Hasta 5 rifas activas",
        "Soporte básico",
        "Estadísticas básicas"
      ]
    },
    {
      id: "pro",
      name: "Plan Pro",
      price_id: import.meta.env.VITE_PRICE_ID_PRO,
      price: "$19.99",
      features: [
        "Rifas ilimitadas",
        "Soporte prioritario",
        "Estadísticas avanzadas",
        "Dominio personalizado"
      ]
    },
    {
      id: "business",
      name: "Plan Empresarial",
      price_id: import.meta.env.VITE_PRICE_ID_BUSINESS,
      price: "$49.99",
      features: [
        "Todo lo del Plan Pro",
        "API access",
        "Soporte 24/7",
        "Múltiples dominios"
      ]
    }
  ];

  const paymentGateways = [
    {
      id: "stripe",
      name: "Stripe",
      commission: "2.9% + $0.30",
      connected: false
    },
    {
      id: "paypal",
      name: "PayPal",
      commission: "3.5% + $0.30",
      connected: false
    },
    {
      id: "custom",
      name: "Instrucciones de Pago",
      commission: "0%",
      connected: true
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Perfil</h2>
              <Button 
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.name && "text-red-500"}`}>
                  Nombre
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.name ? "border-red-500" : "border-input"} bg-background`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.email && "text-red-500"}`}>
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.email ? "border-red-500" : "border-input"} bg-background`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cambiar Contraseña
                </label>
              
                <div className="space-y-2 mb-4">
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña actual"
                    onChange={handlePasswordChange}
                    value={passwordObj.password}
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                  {errors.password &&
                    <p className="text-red-500 mb-2 text-sm">
                      Contraseña actual es incorrecta.
                    </p>
                  }
                  <input
                    type="password"
                    name="password_new"
                    placeholder="Nueva contraseña"
                    onChange={handlePasswordChange}
                    value={passwordObj.password_new}

                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                  <input
                    type="password"
                    name="password_new_confirm"
                    placeholder="Confirmar nueva contraseña"
                    onChange={handlePasswordChange}
                    value={passwordObj.password_new_confirm}
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                </div>
                {(errors.password_new || errors.password_new_confirm)  &&
                    <p className="text-red-500 mb-2 text-sm">
                      {errors.password_new ? "La contraseña debe tener al menos 8 caracteres, e incluir como mínimo una letra mayúscula, una letra minúscula y un número." : "Contraseñas deben coincidir" }
                    </p>
                  }
              </div>
              {changedPassword ?
              <button className="text-sm px-5 py-2 rounded-full text-primary-foreground bg-primary ">
                Contraseña cambiado
              </button>
              :
              <button onClick={passwordChange} className="text-sm px-5 py-2 rounded-full text-primary-foreground bg-primary ">
                Cambiar
              </button>
            }
            </div>
          </div>
        );

      case "company":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Empresa</h2>
            
            <div className="space-y-4">
            <div>
                <label className={`block text-sm font-medium mb-2 ${errors.companyName && "text-red-500"}`}>
                  Nombre de la Empresa
                </label>
                <input
                  name="companyName"
                  type="email"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.companyName ? "border-red-500" : "border-input"} bg-background`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo de la Empresa
                </label>
                <div className="flex items-center space-x-4">
                  {formData.logo ? (
                    <img
                      src={formData.logo.url}
                      alt="Logo"
                      className="border-2 border-input h-10 w-10 rounded-full"
                    />
                  ): <DefaultLogo className="border-2 border-input h-10 w-10 rounded-full" />}
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("logo-upload").click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Cargar Logo</span>
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLogo}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Redes Sociales
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <Facebook className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.facebook ? "text-red-500" : "text-muted-foreground"} w-5 h-5`} />
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                      className={`w-full pl-10 p-2 rounded-md border ${errors.facebook ? "border-red-500" : "border-input"} bg-background`}
                      placeholder="URL de Facebook"
                    />
                  </div>
                  <div className="relative cursor-pointer" onClick={() => document.getElementById("change-phone").showModal()} >
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <div
                      className="w-full pl-10 p-2 rounded-md border border-input bg-background text-muted-foreground"
                      placeholder="Número de Teléfono"
                    >{ setPhoneFormat(formData.phone) }</div>
                  </div>
                </div>
                <dialog id="change-phone" className="p-6 rounded-lg shadow-lg bg-background">
                  <h3 className="text-lg font-medium mb-4">Cambiar telefono</h3>
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${errors.phone && "text-red-500"}`}>
                        Numero de Telefono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={setPhoneFormat(newPhoneNumber)}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.phone ? "border-red-500" : "border-input"} bg-background`}
                        placeholder="(654) 328-4545"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("change-phone").close()}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handlePhoneChange}>
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </dialog>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Trabajadores</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={() => document.getElementById("add-worker").showModal()}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Trabajador</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {workers.map((worker, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span>{worker.email}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveWorker(worker.email)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Worker Dialog */}
                <dialog id="add-worker" className="z-[100] p-6 rounded-lg shadow-lg bg-background">
                  <h3 className="text-lg font-medium mb-4">Agregar Trabajador</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${errors.worker?.email && "text-red-500"}`}>
                        Correo del Trabajador
                      </label>
                      <input
                        name="worker_email"
                        type="email"
                        value={newWorker.email}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.worker?.email ? "border-red-500" : "border-input"} bg-background`}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div className="relative">
                      <div className={`flex items-center gap-3 mb-2 ${errors.worker?.password && "text-red-500"}`}>
                        <label className="block text-sm font-medium">
                          Tu Contraseña
                        </label> 
                       
                      </div>
                      <input
                        type="password"
                        name="worker_password"
                        value={newWorker.password}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.worker?.password ? "border-red-500" : "border-input"} bg-background`}
                        placeholder="Ingresa tu contraseña para confirmar"
                      />
                    </div>
                    {errors.passwordIncorrect &&
                    <div className="text-red-500 flex gap-2 items-center">
                      <CircleAlert className="h-4 w-4"/>
                      <p className="text-sm">La contraseña es incorrecta</p>
                    </div>
                    }
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("add-worker").close()}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddWorker}>
                        Agregar
                      </Button>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
        );

      case "subscription":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Suscripción</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-lg border 
                    ${plan.id === user.currentPlan ?
                     "border-primary bg-primary/5" : 
                     "border-input"}  h-[350px] flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-3xl font-bold mt-2">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">por mes</p>
                    
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {user.currentPlan ? (
                    <Button
                      onClick={user.currentPlan === plan.id ? undefined : () => handleSubscribeChange(plan.price_id)}
                      className="w-full mt-auto"
                      variant={user.currentPlan === plan.id ? "outline" : "default"}
                      disabled={user.currentPlan === plan.id} // Optional for UX
                    >
                      {user.currentPlan === plan.id ? "Plan Actual" : "Cambiar Plan"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.price_id)}
                      className="w-full mt-auto"
                      variant="default"
                    >
                      Suscribir
                    </Button>
                  )}

                
                </div>
              ))}
            </div>

            {user.currentPlan && <div className="mt-8">
              <Button
                variant="destructive"
                className="flex items-center space-x-2"
                onClick={()=>{handleCancelSubscription()}}
              >
                <X className="w-4 h-4" />
                <span>Cancelar Suscripción</span>
              </Button>
            </div> }
          </div>
        );

      case "gateways":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Metodos de Pago</h2>
            
            <div className="space-y-4">
              <button onClick={()=>{document.getElementById("add-method").showModal()}} className="flex justify-center items-center gap-4 py-3 w-full border rounded-lg border-input hover:bg-gray-100">
                <span>Agregar Metodo</span>
                <CirclePlus strokeWidth={1.5} className="w-5 h-5"/>
                </button>
                {methods && methods.map((method) => (
                  <div key={method._id} className="bg-white border border-input rounded-lg w-full">
                    <div className="flex items-center justify-between px-4 py-3 bg-muted px-4 py-3">
                      <div className="">{method.bank}</div>
                      <div onClick={()=>{removeMethod(method)}} className="bg-red-500 rounded-sm p-2"><Trash2 className="h-4 w-4 text-white"/></div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>{method.person}</div>
                      <div>{formatMethodNumber(method.number)}</div>
                    </div>
                  </div>

                ))}
            </div>
            <dialog id="add-method" className="w-screen h-screen bg-transparent">
              <div className="flex justify-center items-center w-full h-full">
              <div className="bg-background p-6 shadow-lg rounded-lg w-[300px]">
                      <h3 className="text-lg font-medium mb-4">Agregar Metodo de Pago</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.bank && "text-red-500"}`}>
                            Banco
                          </label>
                          <input
                            name="method_bank"
                            type="text"
                            value={newMethod.bank}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.method?.bank ? "border-red-500" : "border-input"} bg-background`}
                            placeholder="BBVA"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.person && "text-red-500"}`}>
                            Beneficiario
                          </label>
                          <input
                            name="method_person"
                            type="text"
                            value={newMethod.person}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.method?.person ? "border-red-500" : "border-input"} bg-background`}
                            placeholder="Pedro Carreras"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.number && "text-red-500"}`}>
                            Numero de Cuenta
                          </label>
                          <input
                            name="method_number"
                            type="text"
                            value={formatMethodNumber(newMethod.number)}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.method?.number ? "border-red-500" : "border-input"} bg-background`}
                            placeholder="1111 2222 3333 4444"
                          />
                        </div>
                     
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("add-method").close()}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={addPaymentMethod}>
                            Agregar
                          </Button>
                        </div>
                      </div>
                </div>
              </div>
            </dialog>
          </div>
        );

      case "domains":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Dominios</h2>
            
            <div className="space-y-4">
              <div className="p-6 rounded-lg border border-input">
                <h3 className="font-medium mb-4">Conectar Dominio</h3>
                <div className="space-y-4">
                  <div className="relative">
                  <input
                    disabled={record.step !== 0}
                    type="text"
                    value={domainV}
                    onChange={handleDomainChange}
                    placeholder="ejemplo.com"
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                   {errors.domain_verification && <CircleX className="w-5 h-5 text-red-500 absolute right-5 top-1/2 -translate-y-1/2"/>}
                  </div>
                  {record.step === 0 && <Button onClick={()=>{connectDomainFunc("create")}} className="w-full">Conectar Dominio</Button> }
                  {record.step === 1 && <Button onClick={()=>{connectDomainFunc("verify")}} className="w-full">Verificar</Button>}
                  {record.step === 2 && <Button onClick={()=>{connectDomainFunc("cname")}} className="w-full">Verificar CNAME</Button>}
                </div>
              </div>
              {record.step === 1 && (
              <div className="p-4 bg-white border rounded">
                <h2 className="text-base font-medium mb-2">Agrega este registro TXT a tu DNS:</h2>
                <div className="space-y-1 text-sm">
                  <p>Tipo: {record?.type}</p>
                  <p>Nombre: {record?.name}</p>
                  <p>Valor: {record?.value}</p>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Una vez que hayas agregado este registro a tu proveedor de dominio (como GoDaddy, Namecheap o Cloudflare),
                  haz clic en “Verificar” para confirmar la propiedad del dominio.
                </p>
              </div>
              )} {record.step === 2 && (
              <div className="p-4 bg-white border rounded mt-6">
                  <h2 className="text-base font-medium mb-2">Configura el CNAME o A Record en tu DNS:</h2>
                  <div className="space-y-1 text-sm">
                    <p><strong>Opción 1: CNAME</strong> (recomendado si usas un subdominio)</p>
                    <p>Tipo: CNAME</p>
                    <p>Nombre: <code>{record.subdomainName}</code></p>
                    <p>Valor: <code>{record.ngrokDomain}</code></p>
                  </div>

                  <div className="space-y-1 text-sm mt-4">
                    <p><strong>Opción 2: A Record</strong> (si no puedes usar CNAME)</p>
                    <p>Tipo: A</p>
                    <p>Nombre: <code>{record.subdomainName}</code></p>
                    <p>Valor: <code>{record.serverIP}</code></p>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    Agrega uno de estos registros en el panel DNS de tu proveedor (como GoDaddy, Namecheap o Cloudflare).
                    Esto permitirá que tu dominio apunte correctamente a nuestra plataforma. Si ya lo hiciste, puedes proceder con la verificación.
                  </p>
                </div>

                 )}
                {record.step === 3 && (
              <div className="p-4 bg-white border rounded mt-6">
                  <h2 className="text-base font-medium mb-2">Exito</h2>
                </div>
                 )}
              <div className="p-6 rounded-lg border border-input">
                <h3 className="font-medium mb-4">Configuración DNS</h3>
                <div className="space-y-2 text-sm">
                  <p>1. Agrega un registro CNAME en tu proveedor de dominio:</p>
                  <code className="block p-2 bg-muted rounded">
                    CNAME @ yourapp.example.com
                  </code>
                  <p>2. Agrega un registro TXT para verificación:</p>
                  <code className="block p-2 bg-muted rounded">
                    TXT @ verify=abc123
                  </code>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Apariencia</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tema</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-lg border ${
                      theme === "light" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Sun className="w-6 h-6 mb-2" />
                    <span>Claro</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-lg border ${
                      theme === "dark" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Moon className="w-6 h-6 mb-2" />
                    <span>Oscuro</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Idioma</h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const menuItems = [
    { id: "account", icon: <User />, label: "Cuenta" },
    { id: "company", icon: <Building2 />, label: "Empresa" },
    { id: "subscription", icon: <CreditCard />, label: "Suscripción" },
    { id: "gateways", icon: <PaymentIcon />, label: "Metodos de Pago" },
    { id: "domains", icon: <Globe />, label: "Dominios" },
    { id: "appearance", icon: <Palette />, label: "Apariencia" }
  ];

  useEffect(() => {
    if (user?.asWorker) {
      setActiveSection("appearance");
    }
  }, [user?.asWorker]);

  if(user.asWorker){
    return (
      <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground">Configuración</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Administra tu cuenta y preferencias
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="gap-2 flex flex-col"
        >
            <button
              key="appearance"
              onClick={() => setActiveSection("appearance")}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                activeSection === "appearance"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Palette />
              <span>Apariencia</span>
            </button>
           
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-lg p-6 shadow-lg"
        >
           <div className="space-y-6">
            <header className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Apariencia</h2>
              <Button 
                  variant="destructive"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </Button>
            </header>

            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tema</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-lg border ${
                      theme === "light" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Sun className="w-6 h-6 mb-2" />
                    <span>Claro</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-lg border ${
                      theme === "dark" ? "border-primary bg-primary/5" : "border-input"
                    }`}
                  >
                    <Moon className="w-6 h-6 mb-2" />
                    <span>Oscuro</span>
                  </button>
                </div>
              </div>


            </div>
          </div>
        </motion.div>
      </div>
    </div>
    )
  }
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground">Configuración</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Administra tu cuenta y preferencias
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="gap-2 flex flex-col"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
           
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          {renderContent()}
          <button
              key="save"
              onClick={saveSettings}
              className="ml-auto flex items-center px-4 py-2 space-x-2 mt-10 text-base rounded-lg transition-colors bg-primary text-primary-foreground "
            >
            { loading || successMessage ? (<span>{successMessage || "Loading..."}</span>) : 
              (
                <>
                  <Save stroke="currentColor" className="h-5 w-5" />
                  <span>Guardar</span>
                </>
              )
            }
            </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
