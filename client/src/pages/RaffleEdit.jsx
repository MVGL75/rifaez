
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Image as ImageIcon, 
  Eye,
  Plus,
  ChevronLeft,
  Sun,
  Moon,
  CaptionsOff,
  Ticket,
  Save,
  Captions,
  CalendarClock,
  Files,
  CircleChevronRight,
  CircleChevronLeft,
  AlertCircle,
  CircleMinus,
  ClockArrowDown,
} from "lucide-react";
import { raffleValidationSchema } from "../validation/raffleSchemaValidate";
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, 
});

const RaffleEditPage = ({}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setUser, user, setPopError, } = useAuth()
  const [saveLoader, setSaveLoader] = useState(null)
  const dateRef = useRef(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [raffle, setRaffle] = useState(null); 
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [initialActive, setInitialActive] = useState(null)
  const [filesArray, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [oldPublicIds, setOldPublicIds] = useState([])
  const [carousel, setCarousel] = useState(0)
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];  
    setMinDate(today);
  }, []);
  function removeIdFields(data) {
    if (Array.isArray(data)) {
      return data.map(item => removeIdFields(item));
    }
    if (data !== null && typeof data === 'object') {
      return Object.keys(data).reduce((result, key) => {
        if (key === '_id' || key === 'id' || key === 'imageUrls') {
          return result;
        }
        result[key] = removeIdFields(data[key]);
        return result;
      }, {});
    }
   
    return data;
  }
  const fetchRaffle = async () => {
    try {
      const res = await api.get(`/api/raffle/edit/${id}`);
      const raffle = res.data?.raffle;
      const raffleWithoutId = removeIdFields(raffle)
      const oldPub = raffle.images || [];
      const newPub = oldPub.map(img => ({url: img.url, public_id: img.public_id}))
      const imgPrev = raffle.images.map(image => image.url)
      if (raffle) {
        setOldPublicIds(JSON.stringify(newPub))
        setPreviews(imgPrev)
        setInitialActive(raffleWithoutId.isActive)
        setRaffle({...raffleWithoutId, fileCounter: raffle.images.length}); 
      }
    } catch (error) {
      console.error('Error fetching raffle:', error);
    }
  };

  useEffect(() => {
    fetchRaffle(); 
  }, [id]);

  const validateForm = () => {
    const filteredRaffle = Object.fromEntries(
      Object.entries(raffle).filter(([key, value]) => {
        return key !== "_id" && key !== "id" && key !== "totalVisits" && key !== "totalRevenue" && key !== "totalSales" && key !== "readableEndDate"
    })
    );
    const {error, value} = raffleValidationSchema.validate(filteredRaffle, { abortEarly: false, stripUnknown: true, })
    return [error, value]
  }
  const checkError = (error)=>{
    const errorsObj = {}
    error.details.forEach(err => {
      const fieldName = err.path[0];
      if (err.path.length > 1) {
        const fullPath = err.path.join('.'); 
        errorsObj[fullPath] = err.message; 
      } else {
        errorsObj[fieldName] = err.message;
      }
    });
    setErrors({...errorsObj});
  }


  const handlePaletteChange = (e) => {
    const {name, value} = e.target
    console.log(name, value)
    setRaffle(prev => ({...prev, colorPalette: {...prev.colorPalette, [name]: value}}))
  }

  const submitPalette = () => {
    document.getElementById("create-palette").close()
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if(type === "file"){
      const limitedFiles = files.length > 10 ? Array.from(files).slice(0, 10) : Array.from(files);
      setRaffle(prev => ({...prev, fileCounter: limitedFiles.length}))
      const objectUrls = limitedFiles.map(file => URL.createObjectURL(file));
      setPreviews(objectUrls);
      setFiles(limitedFiles);
      return;
    }
    setRaffle((prev) => {
      const newData = { ...prev, [name]: value };
      
      if (name === "price" || name === "maxParticipants") {
        const price = parseFloat(name === "price" ? value : newData.price) || 0;
        const participants = parseInt(name === "maxParticipants" ? value : newData.maxParticipants) || 0;
        newData.totalRevenue = price * participants;
      }
      return newData;
    });
  };


  const templates = {
    basic : [["Clasico", "classic"]],
    pro: [["Clasico", "classic"], ["Minimalista", "minimalist"]],
    business: [["Clasico", "classic"], ["Minimalista", "minimalist"], ["Moderno", "modern"]],
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
  const planRaffleAmount = {
    basic : 1,
    pro: 3,
    business: "unlimited",
  }

  useEffect(()=>{
    if(!raffle) return;
    const [error, value] = validateForm()
    if(error){
      checkError(error)
    } else {
      setErrors({})
    }
  }, [raffle])

  const getRaffleEndDate = ()=>{
    if (raffle.endDate) {
      const endDate = new Date(raffle.endDate);
      if (!isNaN(endDate)) {
        const formattedDate = endDate.toISOString().split('T')[0]; 
        return formattedDate;
      } else {
        return raffle.endDate; 
      }
      } else {
        return "2025-06-06"; 
      }
  }
  const addPrize = () => {
    setRaffle(prev => ({...prev, additionalPrizes: [...prev.additionalPrizes, { place: prev.additionalPrizes.length + 2, prize: "" }]
    }));
  };
  const removePrize = (indexOld) => {
    setRaffle(prev => {
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
    setRaffle(prev => {
      const newPrizes = [...prev.additionalPrizes];
      newPrizes[index].prize = value;
      return { ...prev, additionalPrizes: newPrizes };
    });
  };

  const handlePreview = () => {
    navigate(`/raffle/${id}`);
  };
  const changeCarousel = (direction) => {
    let num
    if(direction === "right"){
      num = carousel + 1;
    } else {
      num = carousel - 1;
    }
    setCarousel(num)
  }
  const switchHeader = (mode) => {
    setRaffle(prev => ({...prev, header: mode}));
  }
  const switchMode = (mode) => {
    const permission = planRaffleAmount[user.currentPlan]
    if(permission){
      if(permission !== "unlimited"){
        const activeRaffles = user.raffles?.filter(r => r.isActive);
        const base = initialActive ? 1 : 0;
        const notAllowed = (activeRaffles.length - base) >= permission;
        if(!raffle.isActive && notAllowed){
          return setPopError({message: "Has alcanzado tu límite de rifas activas. Mejora tu plan para crear más o desactiva otra rifa.", status: 808})
        }
      }
    }
    if(mode === "night"){
      setRaffle(prev => ({...prev, nightMode: !prev.nightMode}))   
    }
    if(mode === "active"){
      setRaffle(prev => ({...prev, isActive: !prev.isActive}))   
    }
  }

  const handleSave = async () => {
      setSaveLoader(true)
      const [error, value] = validateForm()
      if(error){
        checkError(error)
        setSaveLoader(false)
      } else {
        const newRaffleData = new FormData();
        Object.entries(value).forEach(([key, value]) => {
          if (key === "additionalPrizes" || key === "paymentMethods") {
            const serialized = value && value.length > 0 ? JSON.stringify(value) : JSON.stringify([]);
            newRaffleData.append(key, serialized);
          } else if (key === "colorPalette"){
            const serialized = JSON.stringify(value)
            newRaffleData.append(key, serialized);
          } else if (key !== "fileCounter") {
            newRaffleData.append(key, value);
          }
        });
        newRaffleData.append("oldPublicIds", oldPublicIds)
        if(filesArray && filesArray.length > 0) filesArray.forEach(image => newRaffleData.append('images', image));
        try {
            const res = await api.post(`/api/raffle/edit/${id}`, newRaffleData)
            console.log(res)
            if(res.data.status === 200){
              setSaveLoader(false)
              setSuccessMessage('Rifa actualizada exitosamente.');
              setUser(res.data.user)
            } else {
              setSaveLoader(false)
              setFormError(res.data.message)
            }
          } catch (error) {
            console.log(error)
            setFormError(error)
        }
        
      }
  };
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [successMessage]);



  if(!raffle) return null;
  if(formError) return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg p-8 shadow-lg text-center space-y-6"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold">Error guardando rifa</h2>
        <p className="text-muted-foreground">
          Hubo un error al crear tu rifa asegurese de que haya ingresado la informacion correcta.
        </p>

      </motion.div>
    </div>
  );
  return (
    
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/raffle-admin/edit")}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver</span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground">Editar Rifa</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Modifica los detalles de tu rifa
        </p>
      </motion.div>

      <div className="bg-card rounded-lg p-6 shadow-lg space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Información Principal</h2>
          <div>
            <label className={`block text-sm font-medium mb-2 ${errors.title && "text-red-500"}`}>
              Nombre del Premio
            </label>
            <input
              type="text"
              name="title"
              value={raffle.title}
              onChange={handleChange}
              className={`w-full p-2 rounded-md border ${errors.title ? "border-red-500" : "border-input"} bg-background `}
              placeholder="Ej: iPhone 15 Pro"
            />
           
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${errors.description && "text-red-500"}`}>
              Descripcion
            </label>
            <textarea
              type="text"
              name="description"
              value={raffle.description}
              onChange={handleChange}
              className={`w-full p-2 rounded-md border ${errors.description ? "border-red-500" : "border-input"} bg-background min-h-fit h-fit`}
              placeholder="Ej: iPhone 15 Pro"
            />
           
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Multimedia
            </label>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
              <div>
                <div className="relative">
                  <input id="fileCounter" accept="image/*" type="file" name="fileCounter" onChange={handleChange} multiple
                  className="opacity-0 w-full pl-10 p-2 rounded-md border bg-background"/>
                  <div className={`flex items-center  absolute left-0 top-0 w-full h-full rounded-md border ${errors.fileCounter ? "border-red-500" : "border-input"} bg-background`}>
                    <Files className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                    <label htmlFor="fileCounter" className="pl-10 p-2 text-gray-600 w-full">{raffle.fileCounter && raffle.fileCounter > 0 ? `${raffle.fileCounter} archivo(s)` : "Escoge Archivo"}</label>
                  </div>
                </div>
              </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Actualizar fotos del premio
                </p>
              </div>
              {/* <div>
              <div>
                <div className="relative">
                  <input id="fileCounter" accept="image/*" type="file" name="fileCounter" onChange={handleChange} multiple
                  className="opacity-0 w-full pl-10 p-2 rounded-md border bg-background"/>
                  <div className={`flex items-center  absolute left-0 top-0 w-full h-full rounded-md border ${errors.fileCounter ? "border-red-500" : "border-input"} bg-background`}>
                    <Files className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                    <label htmlFor="fileCounter" className="pl-10 p-2 text-gray-600 w-full">{raffle.fileCounter && raffle.fileCounter > 0 ? `${raffle.fileCounter} archivo(s)` : "Escoge Archivo"}</label>
                  </div>
                </div>
              </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Actualizar videos del premio
                </p>
              </div> */}
            </div>
            <div className="max-h-[300px] mt-4 rounded-lg overflow-hidden relative">
              {previews.map((url, index) => (
                <img key={index} className={carousel !== index ? "hidden" : ""} src={url} alt={`Image ${index}`} />
              ))}
              {previews && previews.length > 1 &&
              <>
              {carousel < previews.length - 1 &&
                <CircleChevronRight onClick={()=>{changeCarousel("right")}} fill="white" strokeWidth={1.5} className="bg-white text-gray-600 rounded-full p-1 w-10 h-10 absolute top-1/2 -translate-y-1/2 right-6 z-10"/>
              }
              {carousel !== 0 &&
                <CircleChevronLeft onClick={()=>{changeCarousel("left")}} fill="white" strokeWidth={1.5} className="bg-white text-gray-600 rounded-full p-1 w-10 h-10 absolute top-1/2 -translate-y-1/2 left-6 z-10"/>
              }
              </>
                }
            </div>
          </div>
        </div>

        {/* Price and Participants */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Detalles de la Rifa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Precio por Boleto
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="number"
                  name="price"
                  value={raffle.price}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Número de Boletos
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="number"
                  name="maxParticipants"
                  value={raffle.maxParticipants}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  placeholder="100"
                />
              </div>
            </div>
           
          </div>

          {/* Revenue Calculator */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Ingresos Estimados</h3>
            <p className="text-2xl font-bold text-primary">
              ${raffle.totalRevenue}
            </p>
            <p className="text-sm text-muted-foreground">
              Si se venden todos los boletos
            </p>
          </div>
          <div>
              <label htmlFor="timeLimitPay" className={`block text-sm font-medium mb-2 ${errors.timeLimitPay && "text-red-500"}`}>
                  Tiempo limite para pago (dias)
                </label>
                <div className="relative">
                  <input id="timeLimitPay" value={raffle.timeLimitPay} type="number" name="timeLimitPay" onChange={handleChange} 
                  className={`w-full pl-10 p-2 rounded-md border ${errors.timeLimitPay ? "border-red-500" : "border-input"} bg-background`}
                  min={'1'}/>
                  <CalendarClock className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  </div>
              </div>
        </div>
      
        {/* Additional Prizes */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <h3 className="text-xl font-semibold">Premios Adicionales</h3>
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

          {raffle.additionalPrizes.map((prize, index) => (
            <div key={index} className="flex flex-col  gap-4">
              <header className="flex items-center justify-between w-full">
              <span className={`font-medium min-w-[100px] ${errors[`additionalPrizes.${index}.prize`] && "text-red-500"}`}>
                {prize.place}º Lugar
              </span>
              <CircleMinus onClick={()=>{removePrize(index)}} className="w-5 h-5 text-red-500"/>
              </header>
              <input
                type="text"
                value={prize.prize}
                onChange={(e) => handlePrizeChange(index, e.target.value)}
                className={`flex-1 p-2 rounded-md border ${errors[`additionalPrizes.${index}.prize`] ? "border-red-500" : "border-input"} bg-background`}
                placeholder="Describe el premio"
              />
            </div>
          ))}
        </div>

        {/* Template Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Diseño</h2>
          <div>
                <label className={`block text-sm font-medium mb-2 ${errors.template && "text-red-500"}`}>
                  Plantilla
                </label>
                <select
                  name="template"
                  value={raffle.template}
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
                  { `Encabezado: ${colorCheck[raffle.colorPalette?.header]}, Fondo: ${colorCheck[raffle.colorPalette?.background]}, Detalles: ${colorCheck[raffle.colorPalette?.accent]}, Bordes: ${colorCheck[raffle.colorPalette?.borders]}, Letra: ${colorCheck[raffle.colorPalette?.color]}`}
                </div>
                <dialog id="create-palette" className="rounded-md shadow-lg text-foreground">
                  <div className="space-y-5 p-5 w-[400px] bg-background">
                    <h1 className="text-lg">Colores de Rifa</h1>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="encabezado_color" className={`text-sm ${errors.colorPalette?.header && "text-red-500"}`}>Encabezado</label>
                        <select 
                          id="encabezado_color" 
                          name="header" 
                          value={raffle.colorPalette.header} 
                          onChange={handlePaletteChange} 
                          className={`w-full p-2 rounded-md bg-background border ${errors.colorPalette?.header ? "border-red-500" : "border-input"}`} >
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
                            value={raffle.colorPalette.background} 
                            onChange={handlePaletteChange} 
                            className={`w-full p-2 rounded-md bg-background border ${errors.colorPalette?.background ? "border-red-500" : "border-input"}`} >
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
                        value={raffle.colorPalette.accent} 
                        onChange={handlePaletteChange} 
                        className={`w-full p-2 rounded-md bg-background border ${errors.colorPalette?.accent ? "border-red-500" : "border-input"}`} >
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
                            value={raffle.colorPalette.borders} 
                            onChange={handlePaletteChange} 
                            className={`w-full p-2 rounded-md bg-background border ${errors.colorPalette?.borders ? "border-red-500" : "border-input"}`} >
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
                            value={raffle.colorPalette.color} 
                            onChange={handlePaletteChange} 
                            className={`w-full p-2 rounded-md bg-background border ${errors.colorPalette?.color ? "border-red-500" : "border-input"}`} >
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
                  value={raffle.logo_position}
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
                <label className={`block text-sm font-medium mb-2 ${errors.font && "text-red-500"}`}>
                  Fuentes
                </label>
                <select
                  name="font"
                  value={raffle.font}
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
                  <select id="countdown" name="countdown" value={raffle.countdown}  onChange={handleChange} 
                  className={`w-full pl-10 p-2 rounded-md border ${errors.countdown ? "border-red-500" : "border-input"} bg-background `}
                   >
                    <option value="on">Si</option>
                    <option value="off">No</option>
                    
                  </select>
                  <ClockArrowDown className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${errors.header && "text-red-500"}`}>
                Encabezado
              </label>
              <div className="flex gap-4">
              <div onClick={()=>{switchHeader("on")}} className={`border-[1.5px] rounded-lg cursor-pointer ${raffle.header ==="on" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-xs h-8 w-8 flex items-center justify-center`}>
                <Captions/>
              </div>
              <div onClick={()=>{switchHeader("off")}} className={`border-[1.5px] rounded-lg cursor-pointer ${raffle.header === "off" ? "border-blue-500 text-blue-500"  : "border-input" } bg-background text-sm h-8 w-8 flex items-center justify-center`}>
                <CaptionsOff/>
              </div>
              </div>
            </div>
            <div>
                <label className={`block text-sm font-medium mb-2 ${errors.isActive && "text-red-500"}`}>
                  Activo
              </label>
              <div onClick={()=>{switchMode("active")}} className={`rounded-[100px] w-[60px] py-1 px-1 flex ${raffle.isActive ? "bg-blue-300 flex-row-reverse" : "bg-gray-200 flex-row"}`}>
                  <div className="h-5 w-5 rounded-full bg-white"></div>
              </div>
            </div>
        </div>
        
        {/* Additional Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Información Adicional</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${errors.endDate && "text-red-500"}`}>
                Fecha de Finalización
              </label>
              <div 
              onClick={() => dateRef.current?.showPicker?.()}
              className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                ref={dateRef}
                  type="date"
                  name="endDate"
                  min={minDate}
                  value={getRaffleEndDate()}
                  onChange={handleChange}
                  className={`w-full pl-10 p-2 rounded-md border ${errors.endDate ? "border-red-500" : "border-input"} bg-background`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Información Extra (opcional)
              </label>
              <textarea
                name="extraInfo"
                value={raffle.extraInfo}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-input bg-background h-32"
                placeholder="Ej: RIFA SUJETA AL 80% DE LOS BOLETOS VENDIDOS..."
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Máximo 500 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePreview}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Vista Previa</span>
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center space-x-2"
          >
            { saveLoader || successMessage ? <span>{successMessage ||  "Guardando..." }</span> :
              <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
              </>
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RaffleEditPage;
