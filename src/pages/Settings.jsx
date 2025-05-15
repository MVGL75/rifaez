
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { saveSchema, workerSchema } from "../validation/userSchema";
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
  CircleX
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user, save, connectDomain, verifyDomain, verifyCNAME } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [theme, setTheme] = useState(user.theme ? user.theme : "system");
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState("es");
  const [wasSubmitted, setWasSubmitted] = useState({})
  const [openObj, setOpenObj] = useState({})
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [newWorker, setNewWorker] = useState({});
  const [domainV, setDomainV] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState(null)
  const [record, setRecord] = useState({step: 0,})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    name: user.name || "Juan Pérez",
    email: user.username || "juan@example.com",
    companyName: user.companyName,
    logo: user.logo,
    workers: user.workers,
    currentPlan: user.currentPlan,
    facebook: user.facebook,
    phone: user.phone,
  });

  const handleLogout = () => {
    logout(); // This will handle both state cleanup and navigation
  };

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: URL.createObjectURL(file) }));
    }
  };

  const handleAddWorker = () => {
    setWasSubmitted(prev => ({...prev, worker: true}))
    const {error, value} = workerSchema.validate(newWorker, {abortEarly: false});
    let newObj = {}
    if(error){
      error.details.forEach(detail => {
        newObj[detail.context.key] = detail.message
      })
    }
    setErrors(prev => ({...prev, worker: newObj}))

    if(error){
      return;
    }

    setFormData(prev => ({
      ...prev,
      workers: [...prev.workers, value]
    }));
    setWasSubmitted(prev => ({...prev, worker: undefined}))
    setNewWorker({email: '', password: ''})
  };

  const handleRemoveWorker = (email) => {
    setFormData(prev => ({
      ...prev,
      workers: prev.workers.filter(worker => worker.email !== email)
    }));

    toast({
      title: "Trabajador eliminado",
      description: "El trabajador ha sido eliminado exitosamente"
    });
  };


  const formValidate = () => {
    const {error, value} = saveSchema.validate(formData, {abortEarly: false})
    let newObj = {}
    if(error){
      error?.details.forEach(detail => {
        newObj[detail.context.key] =  detail.message
      })
    }
    console.log(newObj.name)
    setErrors(newObj)
    return {error, value}
  }
  const togglePasswordReq = () => {
    setOpenObj(prev => ({...prev, pass_req: !prev.pass_req}));
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
      console.log("try")
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
    const {error, value} = workerSchema.validate(newWorker, {abortEarly: false});
    console.log(error, value)
    let newObj = {}
    if(error){
      error.details.forEach(detail => {
        newObj[detail.context.key] = detail.message
      })
    }
    setErrors(prev => ({...prev, worker: newObj}))
  }, [newWorker])

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

  const saveSettings = async () => {
    setLoading(true);
    const {error, value} = formValidate();
    if(error){
      console.log(error);
      return;
    }
    try {
      const res = await save(formData)
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
  const plans = [
    {
      id: "basic",
      name: "Plan Básico",
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
      price: "$19.99",
      features: [
        "Rifas ilimitadas",
        "Soporte prioritario",
        "Estadísticas avanzadas",
        "Dominio personalizado"
      ]
    },
    {
      id: "enterprise",
      name: "Plan Empresarial",
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
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Contraseña actual"
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nueva contraseña"
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                </div>
              </div>
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
                  {formData.logo && (
                    <img
                      src={formData.logo}
                      alt="Logo"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
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
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full pl-10 p-2 rounded-md border border-input bg-background"
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
                <div className="flex items-center justify-between mb-4">
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
                  {formData.workers.map((worker, index) => (
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
                <dialog id="add-worker" className="p-6 rounded-lg shadow-lg bg-background">
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
                        <Info onClick={togglePasswordReq} className="w-4 h-4"/>
                      </div>
                      {openObj.pass_req &&
                      <div className="absolute top-8 left-0 bg-white py-2 px-2 rounded border border-input shadow-sm">
                        <ul className="list-disc pl-4">
                          <li className="text-sm">Min - 8 caracteres</li>
                          <li className="text-sm">Mayuscula y Minuscula</li>
                          <li className="text-sm">Min - 1 Numero</li>
                        </ul>
                      </div>
                      }
                      <input
                        type="password"
                        name="worker_password"
                        value={newWorker.password}
                        onChange={handleChange}
                        className={`w-full p-2 rounded-md border ${errors.worker?.password ? "border-red-500" : "border-input"} bg-background`}
                        placeholder="Ingresa tu contraseña para confirmar"
                      />
                    </div>
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
                  className={`p-6 rounded-lg border ${
                    formData.currentPlan === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-input"
                  }`}
                >
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

                  <Button
                    className="w-full mt-6"
                    variant={formData.currentPlan === plan.id ? "outline" : "default"}
                  >
                    {formData.currentPlan === plan.id ? "Plan Actual" : "Cambiar Plan"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancelar Suscripción</span>
              </Button>
            </div>
          </div>
        );

      case "gateways":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Pasarelas de Pago</h2>
            
            <div className="space-y-4">
              {paymentGateways.map((gateway) => (
                <div
                  key={gateway.id}
                  className="p-6 rounded-lg border border-input"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {gateway.id === "stripe" && <PaymentIcon className="w-6 h-6" />}
                      {gateway.id === "paypal" && <DollarSign className="w-6 h-6" />}
                      {gateway.id === "custom" && <Bank className="w-6 h-6" />}
                      <div>
                        <h3 className="font-medium">{gateway.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Comisión: {gateway.commission}
                        </p>
                      </div>
                    </div>
                    <Button variant={gateway.connected ? "outline" : "default"}>
                      {gateway.connected ? "Configurar" : "Conectar"}
                    </Button>
                  </div>

                  {gateway.id === "custom" && (
                    <div className="mt-4">
                      <textarea
                        value={paymentInstructions}
                        onChange={(e) => setPaymentInstructions(e.target.value)}
                        placeholder="Ingresa las instrucciones de pago (ej: datos bancarios)"
                        className="w-full p-3 rounded-lg border min-h-[100px]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
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

              <div>
                <h3 className="text-lg font-medium mb-4">Tamaño de Letra</h3>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>Pequeño</span>
                  <span>Normal</span>
                  <span>Grande</span>
                </div>
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
    { id: "gateways", icon: <PaymentIcon />, label: "Pasarelas" },
    { id: "domains", icon: <Globe />, label: "Dominios" },
    { id: "appearance", icon: <Palette />, label: "Apariencia" }
  ];

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
