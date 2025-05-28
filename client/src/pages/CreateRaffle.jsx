
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { raffleValidationSchema } from "../validation/raffleSchemaValidate";
import { methodSchema } from "../validation/userSchema";
import { saveImagesToIndexedDB } from "../lib/indexedDBHelpers";
import SpinnerLogo from "../components/spinner"
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
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
  Files,
  PlusIcon,
  CircleMinus,
  ClockArrowDown,
  Calendar
} from "lucide-react";
import { array } from "joi";

const CreateRafflePage = ({userJustCreated, setUserJustCreated}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const dateRef = useRef(null)
  const [showSuccess, setShowSuccess] = useState(false);
  const [newRaffleId, setNewRaffleId] = useState(null);
  const [searchParams] = useSearchParams();
  const [wasSubmitted, setWasSubmitted] = useState({})
  const [showPaletteValue, setPaletteValue] = useState(false)
  const [formError, setFormError] = useState(null)
  const [justAddedPrize, setAddedPrize] = useState(false)
  const [newMethod, setNewMethod] = useState({bank: '', person: '', number: "", instructions: ""})
  const [methodErrors, setMethodErrors] = useState({})
  const [stopSubmit, setStopSubmit] = useState(true)
  const [spinner, setSpinner] = useState(false)
  const [filesArray, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    maxParticipants: "",
    font: "",
    header: "on",
    logo_position: "",
    countdown: "on",
    colorPalette: {
      header: "red",
      background: "red",
      accent: "red",
      borders: "red",
      color: "red",
    },
    endDate: "",
    extraInfo: "",
    fileCounter: 0,
    timeLimitPay: "",
    paymentMethods: [],
    additionalPrizes: []
  });

  const templates = {
    basic : [["Clasico", "classic"]],
    pro: [["Clasico", "classic"], ["Minimalista", "minimalist"]],
    business: [["Clasico", "classic"], ["Minimalista", "minimalist"], ["Moderno", "modern"]],
  }
  const methods = {
    basic: 3,
    pro: 10,
    business: 15,
  }
  const colors = [{id: 'red', name: "Rojo"}, {id: 'blue', name: "Azul"}, {id: 'yellow', name: "Amarillo"}, {id: 'green', name: "Verde"}, {id: 'purple', name: "Púrpura"}, {id: 'black', name: "Negro"}, {id: 'white', name: "Blanco"}]
  const colorCheck = {
    red: 'Rojo',
    blue: 'Azul',
    yellow: 'Amarillo',
    green: 'Verde',
    purple: 'Púrpura',
    black: 'Negro',
    white: 'Blanco',
  }


  const [totalRevenue, setTotalRevenue] = useState(0);
  const newMethods = user.payment_methods?.map(method => {
    return { id: method._id, bank: method.bank, person: method.person, number: method.number, clabe: method.clabe, instructions: method.instructions || undefined, enabled: false }
  })
  const [paymentMethods, setPaymentMethods] = useState(newMethods);


  const handlePaymentMethodToggle = (methodId) => {
    setPaymentMethods(prev => {
      for (const method of prev) {
        if(method.id === methodId){
          if(method.enabled){
            return prev.map(method => method.id === methodId ? {...method, enabled: false} : {...method})
          }
        }
       }
          const amountEnabled = prev.filter(method => method.enabled)
          const currAll = methods[user.currentPlan] || 3
          if(amountEnabled.length >= currAll){
            return prev.map(method => {
              if(method.id === amountEnabled[0].id){
                return {...method, enabled: false}
              }
              if(method.id === methodId){
                return {...method, enabled: true}
              }
              return method
            } )
          } else {
            return prev.map(method => method.id === methodId ? {...method, enabled: true} : {...method})
          }
        } 
    );
    
  };
  useEffect(()=>{
    if(userJustCreated){
      const link = searchParams.get("link");
      setNewRaffleId(link)
      setShowSuccess(true);
      setUserJustCreated(false)
    }
  }, [])

  
  useEffect(()=>{
    const methods = paymentMethods.filter(payment => payment.enabled === true)
    setFormData(prev => {
      return {...prev, paymentMethods: [...methods]}
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
            keys.push("price", "maxParticipants", "prize");
            break;
        case 3:
            keys.push("template", "colorPalette", "logo_position", "header", "countdown", "font",);
            break;
        case 4:
            keys.push("endDate", "timeLimitPay", 'fileCounter', 'extraInfo');
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
  const formatMethodNumber = (input) => {
    const digits = String(input).replace(/\D/g, '');
  
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  function formatCLABE(clabe) {
    if (!clabe) return "";
  
    const digits = clabe.replace(/\D/g, '').slice(0, 18);
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,11})(\d{0,1})$/);
  
    if (!match) return digits;
  
    const [, bank, branch, account, control] = match;
  
    return [bank, branch, account, control].filter(Boolean).join(' ');
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
    setMethodErrors(newObj)

    if(error){
      return;
    }
    const id = Math.random().toString(36).substring(2, 10);

      setPaymentMethods(prev => [...prev, {...value, id: id, enabled: false,}])
      setWasSubmitted(prev => ({...prev, method: undefined}))
      setMethodErrors(prev => ({...prev, method: undefined}))
      setNewMethod({bank: '', person: '', number: "", instructions: ""})
  };
  useEffect(() => {
    if(!wasSubmitted.method) return;
    const {error} = methodSchema.validate(newMethod, {abortEarly: false});
    let newObj = {}
    if(error){
      error.details.forEach(error => {
        newObj[error.context.key] = error.message
      })
      
    }
    setMethodErrors(newObj)
  }, [newMethod])
  const handleNextStep = () => {
    setWasSubmitted(prev => ({...prev, [currentStep]: true}))
    let isInvalid = formValidate();
    if(isInvalid){
      return
    }
    setCurrentStep(currentStep + 1);
  };
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
    setSpinner(true)
    setWasSubmitted(prev => ({...prev, [currentStep]: true}))
    const isInvalid = formValidate();
    if(isInvalid) return setSpinner(false);
    const {error, value} = raffleValidationSchema.validate(formData)
    console.log(error)
    if(error){
      setFormError(error)
      setSpinner(false)
    } else {
      const newRaffleData = new FormData();
      const formObject = {};
      Object.entries(value).forEach(([key, value]) => {
        if (key === "additionalPrizes" || key === "paymentMethods") {
          const serialized = JSON.stringify(
            key === "paymentMethods"
              ? value.map(v => ({
                  bank: v.bank,
                  person: v.person,
                  number: v.number,
                  clabe: v.clabe,
                  instructions: v.instructions,
                }))
              : value
          );
          newRaffleData.append(key, serialized);
          formObject[key] = serialized;
        } else if (key === "colorPalette"){
          const serialized = JSON.stringify(value)
          newRaffleData.append(key, serialized);
          formObject[key] = serialized;
        } else if (key !== "fileCounter") {
          newRaffleData.append(key, value);
          formObject[key] = value;
        }
      });
      filesArray.forEach(image => newRaffleData.append('images', image));
      try {
        const res = await api.post("/api/raffle/create", newRaffleData)
        console.log(res)
        if(res.data.status === 200){
          setNewRaffleId(res.data.link)
          setSpinner(false)
          setShowSuccess(true);
          setUser(res.data.user)
        } else if (res.data.status === 808){
          sessionStorage.setItem("pendingRaffleForm", JSON.stringify(formObject));
          await saveImagesToIndexedDB(filesArray);
          navigate("/pricing-plan");
        } else {
          setFormError(res.data.message)
          setSpinner(false)
        }
      } catch (error) {
        console.log(error)
        setFormError(error.message)
        setSpinner(false)
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
    let { name, value, type, files } = e.target;
    if(type === "file"){
      const limitedFiles = files.length > 10 ? Array.from(files).slice(0, 10) : Array.from(files);
      setFormData(prev => ({...prev, fileCounter: limitedFiles.length}))
      setFiles(limitedFiles);
      return;
    }
    if(name === "method_person" || name === "method_number" || name === "method_bank" || name === "method_instructions" || name === "method_clabe"){
        if(name === "method_number"){
          let digits = value.replace(/\D/g, '');
          if (digits.length > 16) {
            digits = digits.slice(0, 16);
          }
          value = digits
        }
        if(name === "method_clabe"){
          let digits = value.replace(/\D/g, '');
          if (digits.length > 18) {
            digits = digits.slice(0, 18);
          }
          value = digits
        }
        
      setNewMethod(prev => ({...prev, [name.slice(7)]: value}));
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
  const removePrize = (indexOld) => {
    setFormData(prev => {
      const addPrizes = prev.additionalPrizes?.filter((prize, index) => index !== indexOld)
      for (let i = 0; i < addPrizes.length; i++) {
        addPrizes[i].place = i + 2;
      }
      return {
        ...prev,
        additionalPrizes: addPrizes,
      }
    });
  }

  const handlePrizeChange = (index, value) => {
    setFormData(prev => {
      const newPrizes = [...prev.additionalPrizes];
      newPrizes[index].prize = value;
      return { ...prev, additionalPrizes: newPrizes };
    });
  };

  const handlePaletteChange = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, colorPalette: {...prev.colorPalette, [name]: value}}))
  }

  const submitPalette = () => {
    document.getElementById("create-palette").close()
    setPaletteValue(true)
  }

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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
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
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 relative">
                    <span className={`font-medium min-w-[100px] ${errors[`additionalPrizes_${index}`] && "text-red-500"}`}>
                      {prize.place}º Lugar
                    </span>
                    <div className="relative">
                    <input
                      type="text"
                      value={prize.prize}
                      onChange={(e) => handlePrizeChange(index, e.target.value)}
                      className={`flex-1 p-2 rounded-md border bg-background ${errors[`additionalPrizes_${index}`] ? "border-red-500" : "border-input"}`}
                      placeholder="Describe el premio"
                    />
                    <CircleMinus onClick={()=>{removePrize(index)}} className="text-red-500 h-5 w-5 absolute top-1/2 -translate-y-1/2 right-3"/>
                    </div>
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
                <label className={`block text-sm font-medium mb-2 ${errors.template && "text-red-500"}`}>
                  Plantilla
                </label>
                <select
                  name="template"
                  value={formData.template}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.template ? "border-red-500" : "border-input"} bg-background`}
                >
                  <option value="">Selecciona una plantilla</option>
                  {templates[user?.currentPlan] ?
                  templates[user?.currentPlan].map(template => (
                    <option key={template[1]} value={template[1]}>{template[0]}</option>
                  )): (
                    <option value="classic">Clasico</option>
                  )}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.colorPalette && "text-red-500"}`}>
                  Paleta de Colores
                </label>
                <div
                  onClick={()=>{document.getElementById("create-palette").showModal()}}
                  name="colorPalette"
                  className={`w-full p-2 rounded-md border text-muted-foreground ${errors.colorPalette ? "border-red-500" : "border-input"} bg-background`}
                >
                  { !showPaletteValue ? "Crear una paleta +" : `Encabezado: ${colorCheck[formData.colorPalette?.header]}, Fondo: ${colorCheck[formData.colorPalette?.background]}, Detalles: ${colorCheck[formData.colorPalette?.accent]}, Bordes: ${colorCheck[formData.colorPalette?.borders]}, Letra: ${colorCheck[formData.colorPalette?.color]},`}
                </div>
                <dialog id="create-palette" className="rounded-md shadow-lg text-foreground">
                  <div className="space-y-5 px-5 py-5 w-[400px] max-w-full bg-background">
                    <h1 className="text-lg">Colores de Rifa</h1>
                    <div className="space-y-3">
                      <div className="flex flex-col w-full gap-2">
                        <label htmlFor="encabezado_color" className={`text-sm ${errors.colorPalette?.header && "text-red-500"}`}>Encabezado</label>
                        <select 
                          id="encabezado_color" 
                          name="header" 
                          value={formData.colorPalette.header} 
                          onChange={handlePaletteChange} 
                          className={`w-full max-w-full p-2 rounded-md bg-background border ${errors.colorPalette?.header ? "border-red-500" : "border-input"}`} >
                            {colors.map((color, index) => (
                              <option key={index} value={color.id} >{color.name}</option>
                            ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="fondo_color" className={`text-sm ${errors.colorPalette?.background && "text-red-500"}`}>Fondo</label>
                        <select 
                            id="fondo_color" 
                            name="background" 
                            value={formData.colorPalette.background} 
                            onChange={handlePaletteChange} 
                            className={`w-full max-w-full p-2 rounded-md bg-background border ${errors.colorPalette?.background ? "border-red-500" : "border-input"}`} >
                            {colors.map((color, index) => (
                              <option key={index} value={color.id} >{color.name}</option>
                            ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="accento_color" className={`text-sm ${errors.colorPalette?.accent && "text-red-500"}`}>Detalles</label>
                        <select 
                        id="accento_color" 
                        name="accent" 
                        value={formData.colorPalette.accent} 
                        onChange={handlePaletteChange} 
                        className={`w-full max-w-full p-2 rounded-md bg-background border ${errors.colorPalette?.accent ? "border-red-500" : "border-input"}`} >
                            {colors.map((color, index) => (
                              <option key={index} value={color.id} >{color.name}</option>
                            ))}
                        </select>
                      </div> 
                      <div className="flex flex-col gap-2">
                        <label htmlFor="bordes_color" className={`text-sm  ${errors.colorPalette?.borders && "text-red-500"}`}>Bordes</label>
                        <select 
                            id="bordes_color" 
                            name="borders" 
                            value={formData.colorPalette.borders} 
                            onChange={handlePaletteChange} 
                            className={`w-full max-w-full p-2 rounded-md bg-background border ${errors.colorPalette?.borders ? "border-red-500" : "border-input"}`} >
                            {colors.map((color, index) => (
                              <option key={index} value={color.id} >{color.name}</option>
                            ))}
                        </select>
                      </div>  
                      <div className="flex flex-col gap-2">
                        <label htmlFor="color_color" className={`text-sm  ${errors.colorPalette?.color && "text-red-500"}`}>Letra</label>
                        <select 
                            id="color_color" 
                            name="color" 
                            value={formData.colorPalette.color} 
                            onChange={handlePaletteChange} 
                            className={`w-full max-w-full p-2 rounded-md bg-background border ${errors.colorPalette?.color ? "border-red-500" : "border-input"}`} >
                            {colors.map((color, index) => (
                              <option key={index} value={color.id} >{color.name}</option>
                            ))}
                        </select>
                      </div>  
                    </div>
                    <footer className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={()=>{document.getElementById("create-palette").close()}}
                      >Cancelar</Button>
                      <Button
                       type="button"
                       onClick={submitPalette}
                      >
                        Agregar
                      </Button>
                    </footer>   
                  </div>                                                
                </dialog>
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
                  <option value="">Selecciona una posicion</option>
                  <option value="left">Izquierdo</option>
                  <option value="center">Centro</option>
                  <option value="right">Derecho</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.font && "text-red-500"}`}>
                  Fuentes
                </label>
                <select
                  name="font"
                  value={formData.font}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.font ? "border-red-500" : "border-input"} bg-background`}
                >
                  <option value="">Selecciona una fuente</option>
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Manrope">Manrope</option>
                  <option value="IBM Plex Sans">IBM Plex Sans</option>
                  <option value="Work Sans">Work Sans</option>
                  <option value="Source Sans 3">Source Sans 3</option>
                  <option value="Noto Sans">Noto Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="DM Sans">DM Sans</option>
                </select>
              </div>
              <div>
              <label htmlFor="countdown" className={`block text-sm font-medium mb-2 ${errors.countdown && "text-red-500"}`}>
                  Temporizador de cuenta regresiva
                </label>
                <div className="relative">
                  <select id="countdown" name="countdown" value={formData.countdown}  onChange={handleChange} 
                  className={`w-full pl-10 p-2 rounded-md border ${errors.countdown ? "border-red-500" : "border-input"} bg-background `}
                   >
                    <option value="on">Si</option>
                    <option value="off">No</option>
                    
                  </select>
                  <ClockArrowDown className="hidden xs:block absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  </div>
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
           
              {/* <div>
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
              </div> */}
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
                <div onClick={() => dateRef.current?.showPicker?.()} className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  <input ref={dateRef}  id="date" name="endDate" value={formData.endDate} onChange={handleChange} min={getToday()} type="date" 
                  className={`w-full pl-10 pr-3 py-2 rounded-md border ${errors.endDate ? "border-red-500" : "border-input"} bg-background`} />
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
                  Imagenes Max (10) 
                </label>
                <div className="relative">
                  <input id="fileCounter" accept="image/*" type="file" max="10" name="fileCounter" onChange={handleChange} multiple
                  className="opacity-0 w-full pl-10 p-2 rounded-md border bg-background"/>
                  <div className={`flex items-center  absolute left-0 top-0 w-full h-full rounded-md border ${errors.fileCounter ? "border-red-500" : "border-input"} bg-background`}>
                    <Files className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                    <label htmlFor="fileCounter" className="pl-10 p-2 text-gray-600 w-full">{formData.fileCounter && formData.fileCounter > 0 ? `${formData.fileCounter} archivo(s)` : "Escoge Archivo"}</label>
                  </div>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.extraInfo && "text-red-500"}`}>
                  Informacion Adicional (Opcional)
                </label>
                <textarea
                  name="extraInfo"
                  value={formData.extraInfo}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${errors.extraInfo ? "border-red-500" : "border-input"} bg-background h-32`}
                  placeholder="Informacion adicional..."
                />
                <span className="mt-3 text-sm text-muted-foreground">Max 500 caracteres</span>
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
              <h2 className="text-2xl font-semibold">Metodo de Pagos</h2>
              {errors.paymentMethods && 
              <div className="text-red-500 flex items-center space-x-2">
                <AlertCircle></AlertCircle>
                <span>Deberas elegir un metodo de pago. Maximo ({methods[user.currentPlan] || 3})</span>
              </div>}
              <div className="space-y-6">
                <div className="space-y-4">
                  
                {paymentMethods.map((method, index) => (
                  <div key={index} className="bg-background border border-input rounded-lg w-full">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted px-4 py-3">
                    <div className="">{method.bank}</div>
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
                  <div className="flex gap-3 flex-col px-4 py-4">
                  <div className="flex flex-col gap-1 xs:flex-row xs:items-center xs:gap-3">
                        <span className="text-muted-foreground">Numero de tarjeta</span>
                        <span>{formatMethodNumber(method.number)}</span>
                        </div>
                    <div className="flex flex-col gap-5 xs:flex-row xs:items-center justify-between">
                      <div className="flex flex-col gap-1 xs:flex-row xs:items-center xs:gap-3">
                        <span className="text-muted-foreground">Cuenta Clabe</span>
                        <span>{formatCLABE(method.clabe)}</span>
                        </div>
                      <div>{method.person}</div>
                    </div>
                  </div>
                </div>
                ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={()=>{document.getElementById("add-method").showModal()}} className="px-4 py-2 rounded-lg text-sm border border-input flex gap-2 items-center">
                    <span>Crear Metodo</span>
                    <PlusIcon className="h-4 w-4"/>
                    </button>
                </div>

                <dialog id="add-method" className="w-screen h-screen bg-transparent">
              <div className="flex justify-center items-center w-full h-full">
              <div className="text-foreground bg-background p-6 shadow-lg rounded-lg w-[500px] max-w-[calc(100vw-24px)] ">
                      <h3 className="text-lg font-medium mb-4">Agregar Metodo de Pago</h3>
                      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 mb-4">
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
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${errors.method?.clabe && "text-red-500"}`}>
                            Cuenta Clabe
                          </label>
                          <input
                            name="method_clabe"
                            type="text"
                            value={formatCLABE(newMethod.clabe)}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.method?.clabe ? "border-red-500" : "border-input"} bg-background`}
                            placeholder="002 180 00001183597 9"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                      <label htmlFor="instructions" className={`block text-sm font-medium mb-2 ${errors.method?.instructions && "text-red-500"}`}>
                            Nota (Opcional)
                          </label>
                        <textarea  
                          onChange={handleChange} 
                          name="method_instructions" 
                          value={newMethod.instructions}
                          id="instructions"
                          className={`w-full p-2 rounded-md border ${errors.method?.instructions ? "border-red-500" : "border-input"} bg-background`}
                          ></textarea>
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
            </dialog>
                    
              </div>
            </motion.div>
          );
  
      default:
        return null;
    }
  };
  if(spinner){
    return (
      <div className="max-w-3xl mx-auto ">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card flex items-center justify-center rounded-lg p-8 	min-h-[420px] shadow-lg text-center space-y-6"
        >
          <SpinnerLogo className="w-32 h-32" />
        </motion.div>
      </div>
    )
  }
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
