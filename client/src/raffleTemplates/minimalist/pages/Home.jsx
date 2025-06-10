
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronDown, SearchIcon, Shuffle, ArrowRight, ArrowLeft, CircleX } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ticketInfoValidationSchema} from "../../../validation/ticketInfoSchemaValidate"
import Countdown from "../../components/Countdown";
import { Button } from "../../components/ui/button";
import mexicanStates from "../../lib/mexicanStates";
import { cn } from '../../lib/utils';
import { VirtuosoGrid } from 'react-virtuoso';
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
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [allTickets, setAllTickets] = useState([]);
  const [searchTicket, setSearchTicket] = useState("")
  const purchaseFormRef = useRef(null);
  const ticketSectionRef = useRef(null);
  const [errors, setErrors] = useState({})
  const [direction, setDirection] = useState("left");
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
      const intDir = direction === "left" ? 1 : -1;
      setCurrentImageIndex((prev) => (prev + intDir + prizeImages.length) % prizeImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [direction]);


  useEffect(() => {
    const TOTAL_TICKETS = raffle.maxParticipants;
    const initialTickets = Array.from({ length: TOTAL_TICKETS }, (_, i) => {
      const number = i + 1;
      let status = "purchased"
      if(availableTickets.includes(number)) status = "available"
      return {
        id: number,
        number: String(number).padStart(3, '0'),
        status,
      };
    });
    if(raffle.purchasedTicketDisplay === "hide") {
      setAllTickets(initialTickets.filter(ticket => ticket.status === "available"));
    } else {
      setAllTickets(initialTickets);
    }

    const storedSelectedTickets = JSON.parse(localStorage.getItem('selectedTickets')) || [];
    setSelectedTickets(storedSelectedTickets.map(id => initialTickets.find(t => t.id === id)).filter(Boolean));
  }, [availableTickets]);

  const filteredTickets = useMemo(() => {
    if (!searchTicket) return allTickets;
    return allTickets.filter(ticket => ticket.number.includes(searchTicket));
  }, [allTickets, searchTicket]);

  const minSwipeDistance = 50;


  function formatSpanishDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    return new Intl.DateTimeFormat('es-ES', options).format(date);
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


  const handlePriceClick = (quantity) => {
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

  const handleSelectRandomTicket = () => {

    const availableTickets = allTickets.filter(
      ticket => ticket.status === 'available' && !selectedTickets.find(st => st.id === ticket.id)
    );
    if (availableTickets.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableTickets.length);
    const randomTicket = availableTickets[randomIndex];
    setSelectedTickets(prevSelected => [...prevSelected, randomTicket]);
  };

  const handleTicketClick = (ticket) => {
    if (ticket.status === 'purchased') {
      return;
    }

    setSelectedTickets(prevSelected => {
      const isSelected = prevSelected.find(st => st.id === ticket.id);
      if (isSelected) {
        return prevSelected.filter(st => st.id !== ticket.id);
      } else {
        return [...prevSelected, ticket];
      }
    });
  };

  const removeTicket = (ticket) =>{
    setSelectedTickets(prev => prev.filter(t => t.id !== ticket.id))
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
      const newSelectedTickets = selectedTickets.map(ticket => ticket.id)
      const res = await api.post(`/api/raffle/${id}/payment`, {...value, tickets: newSelectedTickets})
      if(res.data.status === 200){
        localStorage.setItem('selectedTickets', JSON.stringify(newSelectedTickets));
        localStorage.setItem('userInfo', JSON.stringify(value));
        setAvailableTickets(prev => prev.filter(p => !newSelectedTickets.includes(p)))
        setSelectedTickets([])
        navigate('payment');
      } else {
        console.log(res)
      }
    }
  };

  const scrollToTicketSection = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

function goToNext() {
  setDirection(1);
  setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
}

function goToPrev() {
  setDirection(-1);
  setCurrentImageIndex((prev) =>
    prev === 0 ? prizeImages.length - 1 : prev - 1
  );
}

const touchStartX = useRef(0);
const touchStartY = useRef(0);

const handleTouchStart = (e) => {
  const touch = e.touches[0];
  touchStartX.current = touch.clientX;
  touchStartY.current = touch.clientY;
};

const handleTouchEnd = (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX.current;
  const deltaY = touch.clientY - touchStartY.current;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0) {
      setDirection("left")
      setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
    } else {
      setDirection("right")
      setCurrentImageIndex((prev) => (prev - 1 + prizeImages.length) % prizeImages.length);  
    }
  }
};



  return (
    <div className="flex flex-col items-center min-h-screen bg-backgroundRaffle">
      <div className="flex flex-col bg-headerRaffle items-center w-full px-3 py-4 text-headerRaffle-foreground">
      <h1 className="text-4xl xxs:text-5xl md:text-6xl font-bold mb-5 mt-2">
       {raffle?.title}
       </h1>
        {raffle.description && <p className="mb-3 text-lg">{raffle.description}</p> }
        <p className="mb-5 text-2xl">{formatSpanishDate(raffle?.endDate)}</p>
      </div>
      <div className=" w-[1400px] max-w-[100vw] mx-auto px-4 py-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-[800px]"
        >
          {/* Prize Amount */}
          <div className="flex flex-col pt-2 lg:pt-3 gap-8">
          <div className="text-center flex flex-col items-center">
           
            <button onClick={scrollToTicketSection} className="flex px-4 py-2 text-colorRaffle rounded-lg items-center gap-2 text-center text-xl sm:text-2xl md:text-3xl font-bold">
              <ChevronDown className="text-primaryRaffle w-[40px] md:w-[50px] h-[40px] md:h-[50px]"/>
              <span className="uppercase">Lista De Boletos Abajo</span>
              <ChevronDown className="text-primaryRaffle w-[40px] md:w-[50px] h-[40px] md:h-[50px]"/>
            </button>
          </div>

          {/* Image Carousel */}

          <div className="flex w-full gap-5 flex-col">
              <div 
                className="relative h-[400px] rounded-3xl overflow-hidden border-4 border-borderRaffle"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {prizeImages.map((img, index) => {
                    const isCurrent = index === currentImageIndex;
                    const intDir = direction === "left" ? 1 : -1;
                    const isPrevious =
                      index === (currentImageIndex - intDir + prizeImages.length) % prizeImages.length;



                    return (
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.alt}
                        className="absolute top-0 -left-[100%] w-full h-full object-cover"
                        style={{
                          animation: isCurrent
                          ? (direction === "left"
                              ? 'slideInFromLeft 0.5s ease-in-out forwards'
                              : 'slideInFromRight 0.5s ease-in-out forwards')
                          : (isPrevious
                              ? (direction === "left"
                                  ? 'slideOutLeft 0.5s ease-in-out forwards'
                                  : 'slideOutRight 0.5s ease-in-out forwards')
                              : undefined)
                        }}
                      />
                    );
                  })}

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
      <div className="uppercase w-full text-center py-4 px-3 bg-headerRaffle text-headerRaffle-foreground mb-8 text-xl">1 Boleto por $5</div>
      {raffle.extraInfo &&
        <section className="w-full text-center px-4 mb-4 space-y-3 whitespace-pre-line">
          <div className=" p-4 text-xl text-colorRaffle">{raffle.extraInfo}</div>
        </section>
      }
      <section className="w-[1400px] max-w-[100vw] px-4 mb-10">
      {raffle.countdown === "on" &&
        <Countdown targetDate={raffle.endDate}/>
      }
      </section>

      {/* Ticket Prices */}
      {/* <div className="w-full bg-lightTint py-8 border-t-2 border-b-2 border-borderRaffle py-20">
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
      </div> */}

      <section className="bg-headerRaffle text-center w-full text-headerRaffle-foreground flex flex-col items-center gap-5 px-3 py-6">
        <div className="flex items-center justify-center gap-5">
          <ChevronDown className="hidden md:block w-[50px] h-[50px]"/>
          <span className="text-xl md:text-3xl">HAZ CLICK ABAJO EN TU NÚMERO DE LA SUERTE</span>
          <ChevronDown className="hidden md:block w-[50px] h-[50px]"/>
        </div>
        {(selectedTickets && selectedTickets.length > 0) && 
        <div className="space-y-4 flex flex-col items-center">
        <button className="px-4 w-fit py-2 rounded-md bg-primaryRaffle text-primaryRaffle-foreground flex items-center gap-3">
          <ArrowRight/>
          <span className="text-lg" onClick={()=>{document.getElementById('purchase-form').showModal()}}>Apartar</span>
          <ArrowLeft/>
        </button>
        <div className="flex flex-wrap gap-2 justify-center">
              {selectedTickets.map(ticket => (
                <span key={ticket.id} onClick={()=>{removeTicket(ticket)}} className="border border-primaryRaffle text-headerRaffle-foreground px-3 py-1 rounded-full cursor-pointer">
                  #{ticket.number}
                </span>
              ))}
          </div>
           <p className="text-xl">
           Total: ${selectedTickets.length * raffle?.price} MXN
         </p>
         </div>
        }
      </section>

      {/* Available Tickets Section */}
      <div id="ticketsSection" className="w-full bg-backgroundRaffle py-10">
        <div className="w-[1400px] max-w-[100vw] mx-auto px-4 text-center">
          
          
          {/* Selected Tickets Display */}
          <div ref={ticketSectionRef} className="mb-6 px-8 py-3 rounded-lg text-left">
            <div className="flex gap-6 flex-col justify-between sm:items-center">
              <div className="relative w-full sm:w-auto">
              <input placeholder="BUSCAR" value={searchTicket} onChange={(e)=>{setSearchTicket(e.target.value)}} className="border-2 bg-backgroundRaffle w-full sm:w-[300px] rounded-lg px-4 pl-10 py-2 border-borderRaffle text-base" type="text" />
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"/>
              </div>
              <div className="flex gap-2 px-3 py-2 border-2 border-borderRaffle rounded-lg cursor-pointer justify-between" onClick={handleSelectRandomTicket}>
                <span className="uppercase">Maquinita de la suerte</span>
                <Shuffle className="w-6 h-6"  />
              </div>
            </div>
          
          </div>

          {/* Ticket Grid */}
          {filteredTickets.length > 0 ? (
            <div className="py-4 rounded-lg">
              <VirtuosoGrid
              totalCount={filteredTickets.length}
              itemContent={(index) => (
                <TicketItem 
                  key={filteredTickets[index].id}
                  ticket={filteredTickets[index]}
                  onClick={() => handleTicketClick(filteredTickets[index])}
                  isSelected={selectedTickets.some(st => st.id === filteredTickets[index].id)}
                />
              )}
              listClassName="grid grid-cols-5 px-4 md:grid-cols-10 gap-1"
              style={{ height: 500 }}
            />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
              No se encontraron boletos con el número "{searchTicket}". Intenta con otro número o revisa los disponibles.
            </p>
          )}
          {/* <div className="grid grid-cols-5 p-4 border border-borderRaffle rounded-lg md:grid-cols-10 gap-2">
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
          </div> */}

       
          {/* Purchase Form */}
          {selectedTickets.length > 0 && (
            <dialog id="purchase-form" className="bg-transparent w-screen h-screen">
              <div className="flex w-full h-full items-center justify-center px-3">
                <motion.form
                  ref={purchaseFormRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 max-w-md mx-auto sticky bottom-0 bg-backgroundRaffle rounded-lg px-4 py-4"
                  onSubmit={handlePurchase}
                  noValidate
                >
                  <header className="flex justify-between items-center mb-4">
                  <h1 className="text-lg">Apartar Boletos</h1>
                  <CircleX onClick={()=>{document.getElementById('purchase-form').close()}} className="w-8 h-8"/>
                  </header>
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
                      className="w-full bg-primaryRaffle text-primaryRaffle-foreground hover:bg-primaryRaffle py-4 px-6 sm:px-8 rounded-lg text-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={22} />
                      Comprar Boletos
                    </Button>
                  </div>
                </motion.form>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
};

const TicketItem = ({ ticket, onClick, isSelected }) => {
  const ticketClasses = cn(
    "p-2 border rounded-md text-center font-medium transition-all duration-200 transform text-xs sm:text-sm",
    {
      "bg-lightTint border-borderRaffle text-colorRaffle-600 line-through cursor-not-allowed": ticket.status === 'purchased',
      "bg-primaryRaffle border-0 text-primaryRaffle-foreground shadow-md scale-105": ticket.status === 'available' && isSelected,
      "bg-backgroundRaffle text-primaryRaffle border-primaryRaffle hover:bg-primaryRaffle-300 hover:text-primaryRaffle-foreground cursor-pointer": ticket.status === 'available' && !isSelected,
    }
  );

  return (
    <div className="p-0.5">
    <motion.div
      onClick={ticket.status === 'available' ? () => onClick(ticket) : undefined}
      className={ticketClasses}
      whileHover={ticket.status === 'available' ? { scale: 1.1 } : {}}
      whileTap={ticket.status === 'available' ? { scale: 0.95 } : {}}
      layout
    >
      {ticket.number}
    </motion.div>
    </div>
  );
};

export default Home;
