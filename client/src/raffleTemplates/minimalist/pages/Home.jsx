
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronDown, SearchIcon, Shuffle, ArrowDown } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ticketInfoValidationSchema} from "../../../validation/ticketInfoSchemaValidate"
import Countdown from "../../components/Countdown";
import { Button } from "../../components/ui/button";
import mexicanStates from "../../lib/mexicanStates";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const Home = ({availableTickets, setAvailableTickets}) => {
  const newMexicanStates = mexicanStates.filter(state => state !== "Extranjero")
  const navigate = useNavigate();
  const raffle = useOutletContext();
  const {id} = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredStates, setFilteredStates] = useState([...newMexicanStates, "Extranjero"]);
  const [filteredTickets, setFilteredTickets] = useState([...availableTickets])
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [touchStart, setTouchStart] = useState(null);
  const [searchTicket, setSearchTicket] = useState("")
  const [touchEnd, setTouchEnd] = useState(null);
  const purchaseFormRef = useRef(null);
  const ticketSectionRef = useRef(null);
  const [errors, setErrors] = useState({})
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    state: ""
  });

  const prizeImages = raffle.images && raffle.images?.length > 0 ? raffle.images.map((value, index) => {
    return { url: value.url, description: "", alt: `Imagen ${index}` }
  }) : [{url: '', description: '', alt: ''}]
 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  function formatSpanishDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + prizeImages.length) % prizeImages.length);
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value
    setSearchTicket(query)
    const filteredArray = availableTickets?.filter((item) =>
      item.toString().includes(query)
    );
    setFilteredTickets(filteredArray)
  }
  const ticketPrices = [
    { quantity: 1, price: raffle?.price },
    { quantity: 2, price: raffle?.price * 2 },
    { quantity: 4, price: raffle?.price * 4 },
    { quantity: 10, price: raffle?.price * 10 },
    { quantity: 20, price: raffle?.price * 20 },
    { quantity: 50, price: raffle?.price * 50 },
    { quantity: 100, price: raffle?.price * 100 }
  ];

  const handleTicketSelection = (ticket) => {
    if (selectedTickets.includes(ticket)) {
      setSelectedTickets(selectedTickets.filter(t => t !== ticket));
    } else {
        setSelectedTickets(prev => [...prev, ticket]); 
    }
  };

  const handlePriceClick = (quantity) => {
    setShowTicketModal(true);
    document.getElementById('ticketsSection').scrollIntoView({ behavior: 'smooth' });
  };

  const validateForm = () => {
    const errorObj = {}
    let isValid = true
    const {error, value} = ticketInfoValidationSchema.validate(userInfo, { abortEarly: false })
    if(error){
      isValid = false
      error.details.forEach(detail => errorObj[detail.context.key] = detail.message)
    }
    setErrors(errorObj)
    return [isValid, value]
    
  }

  const randomizeSelection = () => {
    const availableTicketsFiltered = availableTickets.filter(ticket => !selectedTickets.includes(ticket))
    const random = Math.floor(Math.random() * availableTicketsFiltered.length);
    setSelectedTickets(prev => [...prev, availableTicketsFiltered[random]]);
  }

  const handleChange = (e) => {
    const name = e.target.name
    let value = e.target.value
    if(name === "state"){
      setShowSearch(true)
      const filteredStates = newMexicanStates.filter(state => {
        return state.toLowerCase().includes(value.toLowerCase())
      })
      setFilteredStates([...filteredStates, "Extranjero"])
    }
    if(name === "phone"){
      value = value.replace(/\D/g, '');
      if(value.length > 10){
        value = value.slice(0, 10); 
      }
    }
    setUserInfo(prev => ({...prev, [name]: value}))
    
  }
  const setPhoneFormat = () => {
    const digits = userInfo.phone.replace(/\D/g, ''); 

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
  const selectState = (e) => {
    const value = e.target.textContent
    setShowSearch(false)
    setUserInfo(prev => ({...prev, state: value}))
  }

  useEffect(()=>{
    if(wasSubmitted){
      validateForm()
    }
  },[userInfo])

  const handlePurchase = async (e) => {
    e.preventDefault();
    setWasSubmitted(true)
    const [isValid, value] = validateForm();
    if (selectedTickets.length === 0) {
      alert("Por favor selecciona al menos un boleto");
      return;
    }
    if(isValid){
      const res = await api.post(`/api/raffle/${id}/payment`, {...value, tickets: [...selectedTickets]})
      if(res.data.status === 200){
        localStorage.setItem('selectedTickets', JSON.stringify(selectedTickets));
        localStorage.setItem('userInfo', JSON.stringify(value));
        setAvailableTickets(prev => prev.filter(p => !selectedTickets.includes(p)))
        navigate('payment');
      }  else {
        console.log(res)
      }
    }
  };

  const scrollToPurchaseForm = () => {
    purchaseFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToTicketSection = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-backgroundRaffle">
      <div className=" w-[1400px] max-w-[100vw] mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Prize Amount */}
          <div className="flex flex-col lg:flex-row lg:pt-20 gap-20">
          <div className="lg:w-[40%] pt-10">
            <h1 className="text-4xl xxs:text-5xl md:text-6xl font-bold text-colorRaffle mb-14">
            {raffle?.title}
            </h1>
            <p className="mb-10">{raffle.description}</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-colorRaffle-300 font-semibold">Precio de Boleto</span>
              <span>${raffle.price}</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-colorRaffle-300 font-semibold">Fecha de rifa</span>
              <span>{formatSpanishDate(raffle?.endDate)}</span>
            </div>
            <button onClick={scrollToTicketSection} className="flex px-4 py-2 bg-primaryRaffle text-colorRaffle-foreground rounded-lg items-center gap-2">
              <span>Boletos</span>
              <ChevronDown/>
            </button>
          </div>

          {/* Image Carousel */}
          <div className="grow">
              <div 
                className="relative h-[400px] mb-8 rounded-3xl overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="absolute inset-0"
                  >
                    <img 
                      className="w-full h-full object-cover"
                      alt={prizeImages[currentImageIndex].alt}
                      src={prizeImages[currentImageIndex].url}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h2 className="text-2xl font-bold">{prizeImages[currentImageIndex].description}</h2>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>


              {/* Prize Places */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {raffle?.additionalPrizes.map((prize, index) => (
                <motion.div
                key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-cardRaffle p-4 rounded-lg"
                >
                  <h3 className="text-lg font-bold text-primaryRaffle">{prize.place}do Lugar</h3>
                  <p>{prize.prize}</p>
                </motion.div>
                ))}
              </div>
              </div>
          </div>
        </motion.div>
      </div>
      <section className="w-[1400px] max-w-[100vw] px-4 mb-10">
      {raffle.countdown === "on" &&
        <Countdown targetDate={raffle.endDate}/>
      }
      </section>

      {/* Ticket Prices */}
      <div className="w-full bg-lightTint py-8 border-t-2 border-b-2 border-borderRaffle py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Precios de Boletos</h2>
          <div className="flex flex-col space-y-2 items-center">
            {ticketPrices.map(({ quantity, price }) => (
              <motion.button
                key={quantity}
                onClick={() => handlePriceClick(quantity)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-colorRaffle bg-cardRaffle shadow-lg p-3 w-full max-w-sm rounded-lg text-center transform transition-all hover:bg-primaryRaffle hover:text-colorRaffle-foreground"
              >
                <p className="">{quantity} boleto{quantity > 1 ? 's' : ''}</p>
                <p className="text-lg">${price} MXN</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Tickets Section */}
      <div id="ticketsSection" className="w-full bg-backgroundRaffle py-12">
        <div className="w-[1400px] max-w-[100vw] mx-auto px-4 text-center">
          
          
          {/* Selected Tickets Display */}
          <div ref={ticketSectionRef} className="mb-8 px-8 py-6 border border-borderRaffle rounded-lg text-left">
            <div className="flex flex-col gap-4 sm:flex-row justify-between sm:items-center mb-4">
              <h3 className="text-xl">Selecciona tus boletos </h3>
              <div className="relative flex items-center gap-5">
              <div className="relative w-full sm:w-auto">
              <input value={searchTicket} onChange={handleSearch} className="border-2 bg-backgroundRaffle w-full sm:w-[300px] rounded-full px-4 pl-10 py-2 border-borderRaffle text-sm" type="text" />
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"/>
              </div>
              <div className="absolute right-4 sm:right-auto  sm:relative">
                <Shuffle className="w-5 h-5 sm:w-6 sm:h-6" onClick={randomizeSelection} />
              </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-left">
              {selectedTickets.map(ticket => (
                <span key={ticket} className="bg-primaryRaffle text-colorRaffle-foreground px-3 py-1 rounded-full">
                  #{ticket}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xl">
              Total: ${selectedTickets.length * raffle?.price} MXN
            </p>
          </div>

          {/* Ticket Grid */}
          <div className="grid grid-cols-5 p-4 border border-borderRaffle rounded-lg md:grid-cols-10 gap-2">
            {filteredTickets?.map( i => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTicketSelection(i)}
                className={`p-2 text-sm rounded transition-colors ${
                  selectedTickets.includes(i)
                    ? "bg-primaryRaffle text-colorRaffle-foreground"
                    : "border border-borderRaffle hover:border-0 hover:text-colorRaffle-foreground"
                }`}
              >
                {i}
              </motion.button>
            ))}
          </div>

          {/* Centered Scroll Arrow - Only shows when tickets are selected */}
          {/* {selectedTickets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            >
              <motion.button
                onClick={scrollToPurchaseForm}
                className="bg-primaryRaffle p-4 rounded-full shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown size={32} className="text-colorRaffle-foreground" />
              </motion.button>
            </motion.div>
          )} */}

          {/* Purchase Form */}
          {selectedTickets.length > 0 && (
            <motion.form
              ref={purchaseFormRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-md mx-auto sticky bottom-0 bg-backgroundRaffle border border-borderRaffle rounded-lg px-4 py-4"
              onSubmit={handlePurchase}
              noValidate
            >
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre Completo"
                  className={`w-full bg-transparent p-3 rounded border ${errors.name ? "border-red-400" : "border-borderRaffle"}`}
                  value={userInfo.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  className={`w-full p-3 bg-transparent rounded border ${errors.phone ? "border-red-400" : "border-borderRaffle"}`}
                  value={setPhoneFormat()}
                  onChange={handleChange}
                  required
                />

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Estado"
                    name="state"
                    className={`w-full bg-transparent p-3 rounded border ${errors.state ? "border-red-400" : "border-borderRaffle"}`}
                    value={userInfo.state}
                    onChange={handleChange}
                    required
                  />
                  {showSearch &&
                  <div className="max-h-[200px] overflow-scroll flex flex-col absolute top-[calc(100%+5px)] border border-gray-700 bg-cardRaffle w-full rounded">
                    {filteredStates.map(state => {
                      return <div key={state} onClick={selectState} className="py-2 hover:bg-[rgba(0,0,0,0.2)]">{state}</div>
                    })}
                  </div>}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primaryRaffle hover:bg-primaryRaffle text-white py-4 rounded-lg text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={22} />
                  Comprar Boletos
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
      {raffle.extraInfo &&
        <section className="max-w-4xl w-full px-4 space-y-3">
          <header className="bg-primaryRaffle text-primaryRaffle-foreground rounded-md px-4 py-3">Informacion Adicional</header>
          <div className="border border-borderRaffle p-4 text-colorRaffle">{raffle.extraInfo}</div>
        </section>
      }
    </div>
  );
};

export default Home;
