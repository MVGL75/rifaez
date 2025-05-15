
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { raffleValidationSchema } from "../validation/raffleSchemaValidate";
import axios from "axios";
const api = axios.create({
  baseURL: 'http://localhost:5050',
  withCredentials: true, // same as fetch's credentials: 'include'
});
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  DollarSign, 
  Users,
  Copy,
  Facebook,
  Check,
  Share2,
  AlertCircle,
  Moon, 
  Sun, 
  Captions,
  CaptionsOff,
  Ticket,
  CalendarClock,
  Files
} from "lucide-react";
import { array } from "joi";

const CreateRafflePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newRaffleId, setNewRaffleId] = useState(null);
  const [wasSubmitted, setWasSubmitted] = useState({})
  const [formError, setFormError] = useState(null)
  const [justAddedPrize, setAddedPrize] = useState(false)
  const [stopSubmit, setStopSubmit] = useState(true)
  const [filesArray, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    maxParticipants: "",
    font: "",
    header: "on",
    nightMode: false,
    logo_position: "",
    colorPalette: "",
    endDate: "",
    maxTpT: "",
    fileCounter: 0,
    timeLimitPay: "",
    paymentMethods: [],
    additionalPrizes: []
  });

  const [totalRevenue, setTotalRevenue] = useState(0);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: "stripe", name: "Stripe", enabled: false },
    { id: "paypal", name: "PayPal", enabled: false },
    { id: "custom", name: "Instrucciones de Pago", enabled: false }
  ]);

  const handlePaymentMethodToggle = (methodId) => {
    setPaymentMethods(prev => prev.map(method => 
      method.id === methodId 
        ? { ...method, enabled: !method.enabled }
        : method
    ));
  };
  useEffect(()=>{
    const methods = paymentMethods.filter(payment => payment.enabled === true)
    const methodsID = methods.map(method => method.id)
    setFormData(prev => {
      return {...prev, paymentMethods: [...methodsID]}
    })
  },[paymentMethods])
  const formValidate = () => {
    const {error} = raffleValidationSchema.validate(formData, { abortEarly: false })
    const newObj = {}
    let keys = []
    if(error){
      switch (currentStep) {
        case 1:
            keys.push("title", "description");
            break;
        case 2:
            keys.push("price", "maxParticipants", "additionalPrizes");
            break;
        case 3:
            keys.push("colorPalette", "logo_position", "header", "font", "nightMode");
            break;
        case 4:
            keys.push("endDate", "maxTpT", "timeLimitPay", 'fileCounter');
            break;
        case 5:
            keys.push("paymentMethods", "payment_instructions");
            break;
      }
      const newArray = error.details.filter(detail => detail.context.key === keys.find(key => key === detail.context.key))
      for (const detail of newArray) {
          if(detail.path.length > 1){
            detail.context.key = `${detail.path[0]}_${detail.path[1]}`
          }
          newObj[detail.context.key] = true;
      }
    }
    setErrors({...newObj});
    return (Object.keys(newObj).length > 0)
  }

  const handleNextStep = () => {
    setWasSubmitted(prev => ({...prev, [currentStep]: true}))
    let isInvalid = formValidate();
    if(isInvalid){
      return
    }
    setCurrentStep(currentStep + 1);
  };
  const setSelected = (size) => {
    setFormData(prev => ({...prev, font: size}));
  }
  const switchHeader = (mode) => {
    setFormData(prev => ({...prev, header: mode}));
  }
  const switchMode = () => {
    setFormData(prev => ({...prev, nightMode: !prev.nightMode}))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(stopSubmit){
      setStopSubmit(false)
      return;
    }
    setWasSubmitted(prev => ({...prev, [currentStep]: true}))
    const isInvalid = formValidate();
    if(isInvalid) return;
    const {error, value} = raffleValidationSchema.validate(formData)
    if(error){
      setFormError(error)
    } else {
      const newRaffleData = new FormData();
      Object.entries(value).forEach(([key, value]) => {
        if (key === "additionalPrizes" || key === "paymentMethods") {
          const serialized = value && value.length > 0 ? JSON.stringify(value) : JSON.stringify([]);
          newRaffleData.append(key, serialized);
        } else if (key !== "fileCounter") {
          newRaffleData.append(key, value);
        }
      });
      filesArray.forEach(image => newRaffleData.append('images', image));
      try {
        const res = await api.post("/raffle/create", newRaffleData)
        console.log(res)
        if(res.data.status === 200){
          setUser(res.data.user)
          setNewRaffleId(res.data.link)
          setShowSuccess(true);
        } else {
          setFormError(res.data.message)
        }
      } catch (error) {
        setFormError(error.message)
      }
    }
  };

  const handleCopyLink = () => {
    const raffleUrl = `${window.location.origin}/raffle/${newRaffleId}`;
    navigator.clipboard.writeText(raffleUrl);
    toast({
      title: "Enlace copiado",
      description: "El enlace ha sido copiado al portapapeles"
    });
  };

  const handleShareFacebook = () => {
    const raffleUrl = `${window.location.origin}/raffle/${newRaffleId}`;
    window.FB.ui({
      method: 'share',
      href: raffleUrl,
    });
  };

  const getToday = () => {
    const today = new Date().toISOString().split("T")[0]; 
    return today;
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if(type === "file"){
      setFormData(prev => ({...prev, fileCounter: files.length}))
      setFiles(Array.from(files));
      return;
    }
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === "price" || name === "maxParticipants") {
        const price = parseFloat(name === "price" ? value : newData.price) || 0;
        const participants = parseInt(name === "maxParticipants" ? value : newData.maxParticipants) || 0;
        setTotalRevenue(price * participants);
      }
      
      return newData;
    });
  };
    useEffect(()=>{
      if(wasSubmitted[currentStep] && !justAddedPrize) {
        formValidate()
      } else {
        setAddedPrize(false)
      }
    },[formData])
  const addPrize = () => {
    setAddedPrize(true)
    setFormData(prev => ({
      ...prev,
      additionalPrizes: [...prev.additionalPrizes, { place: prev.additionalPrizes.length + 2, prize: "" }]
    }));
  };

  const handlePrizeChange = (index, value) => {
    setFormData(prev => {
      const newPrizes = [...prev.additionalPrizes];
      newPrizes[index].prize = value;
      return { ...prev, additionalPrizes: newPrizes };
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Información Básica</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.title && "text-red-500"}`}>
                  Título de la Rifa
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.title ? "border-red-500" :"border-input"} bg-background`}
                  placeholder="Ej: iPhone 15 Pro"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.description && "text-red-500"}`}>
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.description ? "border-red-500" : "border-input"} bg-background h-32`}
                  placeholder="Describe el premio..."
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Detalles de la Rifa</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.price && "text-red-500"}`}>
                  Precio por Boleto
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    min={'0'}
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full pl-10 p-2 rounded-md border ${errors.price ? "border-red-500" : "border-input"} bg-background`}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.maxParticipants && "text-red-500"}`}>
                  Número de Boletos
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="number"
                    min={'0'}
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className={`w-full pl-10 p-2 rounded-md border ${errors.maxParticipants ? "border-red-500" : "border-input"} bg-background`}
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Revenue Calculator */}
              {(formData.price && formData.maxParticipants) && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Ingresos Estimados</h3>
                  <p className="text-2xl font-bold text-primary">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Si se venden todos los boletos
                  </p>
                </div>
              )}

              {/* Additional Prizes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Premios Adicionales</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPrize}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Premio</span>
                  </Button>
                </div>

                {formData.additionalPrizes.map((prize, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className={`font-medium min-w-[100px] ${errors[`additionalPrizes_${index}`] && "text-red-500"}`}>
                      {prize.place}º Lugar
                    </span>
                    <input
                      type="text"
                      value={prize.prize}
                      onChange={(e) => handlePrizeChange(index, e.target.value)}
                      className={`flex-1 p-2 rounded-md border bg-background ${errors[`additionalPrizes_${index}`] ? "border-red-500" : "border-input"}`}
                      placeholder="Describe el premio"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Diseño de la Página</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.colorPalette && "text-red-500"}`}>
                  Paleta de Colores
                </label>
                <select
                  name="colorPalette"
                  value={formData.colorPalette}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.colorPalette ? "border-red-500" : "border-input"} bg-background`}
                >
                  <option value="">Selecciona una paleta</option>
                  <option value="blue">Azul</option>
                  <option value="green">Verde</option>
                  <option value="purple">Púrpura</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.logo_position && "text-red-500"}`}>
                  Posicionamiento de Logo
                </label>
                <select
                  name="logo_position"
                  value={formData.logo_position}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.logo_position ? "border-red-500" : "border-input"} bg-background`}
                >
                  <option value="">Selecciona una plantilla</option>
                  <option value="left">Izquierdo</option>
                  <option value="center">Centro</option>
                  <option value="right">Derecho</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.header && "text-red-500"}`}>
                  Encabezado
                </label>
                <div className="flex gap-4">
                <div onClick={()=>{switchHeader("on")}} className={`border-[1.5px] rounded-lg cursor-pointer ${formData.header ==="on" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-xs h-8 w-8 flex items-center justify-center`}>
                  <Captions/>
                </div>
                <div onClick={()=>{switchHeader("off")}} className={`border-[1.5px] rounded-lg cursor-pointer ${formData.header === "off" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-sm h-8 w-8 flex items-center justify-center`}>
                  <CaptionsOff/>
                </div>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.font && "text-red-500"}`}>
                  Letra
                </label>
                <div className="flex gap-4">
                <div onClick={()=>{setSelected('xs')}} className={`border-[1.5px] rounded-lg cursor-pointer ${formData.font ==="xs" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-xs h-8 w-8 flex items-center justify-center`}>xs</div>
                <div onClick={()=>{setSelected('s')}} className={`border-[1.5px] rounded-lg cursor-pointer ${formData.font === "s" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-sm h-8 w-8 flex items-center justify-center`}>s</div>
                <div onClick={()=>{setSelected('m')}} className={`border-[1.5px] rounded-lg cursor-pointer ${formData.font === "m" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-base h-8 w-8 flex items-center justify-center`}>m</div>
                <div onClick={()=>{setSelected('l')}} className={`border-[1.5px] rounded-lg cursor-pointer ${formData.font === "l" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-lg h-8 w-8 flex items-center justify-center`}>l</div>
                <div onClick={()=>{setSelected('xl')}} className={`border-[1.5px] rounded-lg cursor-pointer ${formData.font ==="xl" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-xl h-8 w-8 flex items-center justify-center`}>xl</div>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.nightMode && "text-red-500"}`}>
                  Modo Obscuro
                </label>
                <div onClick={switchMode} className={`rounded-[100px] w-[60px] py-1 px-1 flex justify-between ${formData.nightMode ? "bg-purple-200" : "bg-yellow-200"}`}>
                  { formData.nightMode ? (
                    <>
                     <Moon className="w-5 h-5"/>
                    <div className="h-5 w-5 rounded-full bg-[rgba(0,0,0,0.15)]"></div>
                    </>
                  ) : ( <>
                  <div className="h-5 w-5 rounded-full bg-[rgba(0,0,0,0.15)]"></div>
                  <Sun className="w-5 h-5"/>
                  </>)}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${errors.paymentMethods ? "space-y-4" : "space-y-6"}`}
            >
              <h2 className="text-2xl font-semibold">Configuración de Rifa</h2>
              <div>
              <label htmlFor="date" className={`block text-sm font-medium mb-2 ${errors.endDate && "text-red-500"}`}>
                  Fecha de rifa
                </label>
                <input id="date" name="endDate" value={formData.endDate} onChange={handleChange} min={getToday()} type="date" 
                className={`w-full px-3 py-2 rounded-md border ${errors.endDate ? "border-red-500" : "border-input"} bg-background`} />
              </div>
              <div>
              <label htmlFor="maxPerT" className={`block text-sm font-medium mb-2 ${errors.maxTpT && "text-red-500"}`}>
                  Numero de boletos por transaccion
                </label>
                <div className="relative">
                  <input id="maxPerT" name="maxTpT" value={formData.maxTpT} type="number" onChange={handleChange} 
                  className={`w-full pl-10 p-2 rounded-md border ${errors.maxTpT ? "border-red-500" : "border-input"} bg-background`}
                  min={'0'}
                   max={formData.maxParticipants} />
                  <Ticket className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  </div>
              </div>
              <div>
              <label htmlFor="timeLimitPay" className={`block text-sm font-medium mb-2 ${errors.timeLimitPay && "text-red-500"}`}>
                  Tiempo limite para pago (dias)
                </label>
                <div className="relative">
                  <input id="timeLimitPay" value={formData.timeLimitPay} type="number" name="timeLimitPay" onChange={handleChange} 
                  className={`w-full pl-10 p-2 rounded-md border ${errors.timeLimitPay ? "border-red-500" : "border-input"} bg-background`}
                  min={'1'}/>
                  <CalendarClock className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  </div>
              </div>
              <div>
              <label htmlFor="files" className={`block text-sm font-medium mb-2 ${errors.fileCounter && "text-red-500"}`}>
                  Imagenes
                </label>
                <div className="relative">
                  <input id="fileCounter" accept="image/*" type="file" name="fileCounter" onChange={handleChange} multiple
                  className="opacity-0 w-full pl-10 p-2 rounded-md border bg-background"/>
                  <div className={`flex items-center  absolute left-0 top-0 w-full h-full rounded-md border ${errors.fileCounter ? "border-red-500" : "border-input"} bg-background`}>
                    <Files className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                    <label htmlFor="fileCounter" className="pl-10 p-2 text-gray-600 w-full">{formData.fileCounter && formData.fileCounter > 0 ? `${formData.fileCounter} archivo(s)` : "Escoge Archivo"}</label>
                  </div>
                </div>
              </div>
            </motion.div>
        );
        case 5:
          return (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${errors.paymentMethods ? "space-y-4" : "space-y-6"}`}
            >
              <h2 className="text-2xl font-semibold">Configuración de Pagos</h2>
              {errors.paymentMethods && 
              <div className="text-red-500 flex items-center space-x-2">
                <AlertCircle></AlertCircle>
                <span>Deberas elegir una configuracion de pago</span>
              </div>}
              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <span>{method.name}</span>
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${
                        method.enabled ? 'bg-primary' : 'bg-gray-200'
                      } cursor-pointer`}
                      onClick={() => handlePaymentMethodToggle(method.id)}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          method.enabled ? 'translate-x-7' : 'translate-x-1'
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                ))}
  
                {paymentMethods.find(m => m.id === "custom")?.enabled && (
                  <textarea
                    name="payment_instructions"
                    onChange={handleChange}
                    placeholder="Ingresa las instrucciones de pago..."
                    className={`w-full p-3 rounded-lg border min-h-[100px] ${errors.payment_instructions && "border-red-500"}`}
                  />
                )}
              </div>
            </motion.div>
          );
  
      default:
        return null;
    }
  };
  if(formError){
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-lg p-8 shadow-lg text-center space-y-6"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold">Error creando rifa</h2>
          <p className="text-muted-foreground">
            Hubo un error al crear tu rifa asegurese de que haya ingresado la informacion correcta.
          </p>

        </motion.div>
      </div>
    );
  }
  if (showSuccess) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-lg p-8 shadow-lg text-center space-y-6"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold">¡Rifa Creada con Éxito!</h2>
          <p className="text-muted-foreground">
            Tu rifa ha sido publicada y está lista para compartir
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Enlace</span>
            </Button>

            <Button
              className="flex items-center justify-center space-x-2"
              onClick={handleShareFacebook}
            >
              <Facebook className="w-4 h-4" />
              <span>Compartir en Facebook</span>
            </Button>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              onClick={() => navigate(`/raffle/${newRaffleId}`)}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Ver Rifa</span>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground">Crear Nueva Rifa</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Configura los detalles de tu rifa
        </p>
      </motion.div>

      <div className="bg-card rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-full flex items-center ${
                step === 5 ? "" : "after:content-[''] after:h-1 after:flex-1"
              } ${
                step <= currentStep
                  ? "after:bg-primary text-primary"
                  : "after:bg-gray-200 text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200"
                }`}
              >
                {step}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStep()}

          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>
            )}
            
            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className={`flex items-center space-x-2 ${currentStep === 1 ? "" : "ml-auto"}`}
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto"
              >
                Publicar Rifa
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRafflePage;
