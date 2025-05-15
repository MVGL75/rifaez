import Raffle from '../models/Raffle.js';
import {User} from '../models/Users.js'
import sanitizeUser from '../utils/sanitize.js';
import sanitizeRaffle from '../utils/sanitizeRaffle.js';
import { raffleValidationSchema } from '../validators/raffleSchema.js';
import { contactValidationSchema } from '../../src/validation/contactSchemaValidate.js';
import { ticketInfoValidationSchema } from '../validators/ticketInfoSchemaValidate.js';
import { getNextTransactionId, RaffleCounter } from '../models/RaffleCounter.js';
import { v2 as cloudinary } from 'cloudinary';



const generateUser = async (id) => {
  const PopUser = await User.findOne({raffles: id}).populate('raffles')
  const cleanUser = sanitizeUser(PopUser)
  return cleanUser
}


export const createRaffle = async(req, res)=>{
      const images = req.files.map(file => ({url: file.path, public_id: file.filename})); 
      const parsedBody = {
        ...req.body,
        images,
        paymentMethods: JSON.parse(req.body.paymentMethods || '[]'),
        additionalPrizes: JSON.parse(req.body.additionalPrizes || '[]'),
      };
      const {error, value} = raffleValidationSchema.validate({...parsedBody})
      if(error){
        res.json({message: error.details, status: 400})
        return;
      }
      const raffle = await Raffle.create({...value, isActive: true})
      const user = await User.findByIdAndUpdate(req.user._id, { $push: { raffles: raffle._id } }, { new: true } );
      if(user && raffle){
        const PopUser = await user.populate('raffles')
        const cleanUser = sanitizeUser(PopUser)
        res.json({message: "Raffle created", link: raffle._id, status: 200, user: cleanUser})
      } else {
        res.json({message: "User not found", status: 400})
      }
  }
  export const deleteRaffle = async(req, res)=>{
      const {id} = req.params;
      const deleteRaffle = await Raffle.findByIdAndDelete(id)
      const images = deleteRaffle.images
      if(images){
        for (const {public_id} of images) {
          await cloudinary.uploader.destroy(public_id);
        }
      }
      const user = await User.findOneAndUpdate(
        { raffles: id }, 
        { $pull: { raffles: id } }, 
        { new: true }
      );
      if(user && deleteRaffle){
        const PopUser = await user.populate('raffles')
        const cleanUser = sanitizeUser(PopUser)
        res.json({message: "Raffle deleted", status: 200, user: cleanUser})
      } else {
        res.json({message: "User not found", status: 400})
      }
  }

export const editRaffle = async (req, res) => {
  const { id } = req.params;
  const { oldPublicIds, ...restBody } = req.body;
  const parsedOldIds = req.body.oldPublicIds ? JSON.parse(req.body.oldPublicIds) : []
  let uploadedImages = [];
  if(req.files && req.files.length > 0){
    if(parsedOldIds && parsedOldIds.length > 0){
      for (const {url, public_id} of parsedOldIds) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
    uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));
  }
    const newRaffle = {
      ...restBody,
      additionalPrizes: req.body.additionalPrizes ? JSON.parse(req.body.additionalPrizes) : [],
      paymentMethods: req.body.paymentMethods ? JSON.parse(req.body.paymentMethods) : [],
      images: uploadedImages.length > 0 ? uploadedImages : parsedOldIds,
    };

    const { error, value } = raffleValidationSchema.validate(newRaffle);
    if (error) {
      return res.json({ message: error.details, status: 400 });
    }
    const updatedRaffle = await Raffle.findByIdAndUpdate(id, { $set: value }, { new: true });

    if (updatedRaffle) {
      const user = await generateUser(id);
      return res.json({ message: 'Raffle edited', status: 200, user });
    } else {
      return res.json({ message: 'Error updating raffle', status: 400 });
    }
};

  export const findRaffle = async (req, res)=>{
    const raffleID = req.params.id
    const raffle = await Raffle.findById(raffleID).lean()
    const cleanRaffle = sanitizeRaffle(raffle)
    const unavailableTickets = raffle.currentParticipants.flatMap(part => part.tickets);
    const availableTickets = []
    for (let i = 1; i < raffle.maxParticipants + 1; i++) {
      if(!unavailableTickets.includes(i)){
        availableTickets.push(i)
      }
    }
    if(cleanRaffle){
      res.json({message: "Raffle found", status: 200, raffle: {...cleanRaffle, availableTickets: availableTickets}})
    } else {
      res.json({message: "Raffle not found", status: 400})
    }
  }
  export const contactRaffle = async (req, res)=>{
    const raffleID = req.params.id
    const contactData = req.body
    const {error, value} = contactValidationSchema.validate(contactData)
    if(error){
      res.json({message: error.details, status: 400})
    }
    await Raffle.updateOne(
      { _id: raffleID },
      { $push: { contact: value } }
    );
    res.json({message: "Contact Sent", status: 200})
  }
  export const paymentRaffle = async (req, res)=>{
    const raffleID = req.params.id
    const raffle = await Raffle.findById(raffleID)
    const body = req.body
    const transactionId = await getNextTransactionId(raffle._id.toString());
    const amount = raffle.price * body.tickets.length
    const newBody = {
      ...body,
      transactionID: transactionId,
      amount: amount
    }
    const {error, value} = ticketInfoValidationSchema.validate(newBody)
    if(error){
      res.json({message: error.details, status: 400})
    }
    raffle.currentParticipants.push(value)
    await updateStats(raffle, "dailySales", amount);
    await raffle.save()
    res.json({message: "Contact Sent", status: 200})
  }
  export const editFindRaffle = async (req, res)=>{
    const raffleID = req.params.id
    const raffle = await Raffle.findById(raffleID);
    const cleanRaffle = sanitizeRaffle(raffle.toObject())
    if(raffle){
      res.json({message: "Raffle found", status: 200, raffle: {...cleanRaffle}})
    } else {
      res.json({message: "Raffle not found", status: 200})
    }
  }
  export const markPaid = async (req, res)=>{
    const {raffleID, id} = req.params
    const raffle = await Raffle.findById(raffleID);
    const transaction = raffle.currentParticipants.id(id)
    if(transaction?.status === "pending"){
      transaction.status = "paid"
      raffle.stats.paidParticipants += 1;
      await raffle.save();
      const user = await generateUser(raffleID);
      if(user){
        res.json({message: "Updated", status: 200, user: {...user}})
      } else {
        res.json({message: "Raffle not found", status: 400})
      }
    } else {
      res.json({message: "already marked as paid", status: 400})
    }
  }
  export const addNote = async (req, res)=>{
    const {raffleID, id} = req.params
    const {note} = req.body
    const raffle = await Raffle.findById(raffleID);
    const transaction = raffle.currentParticipants.id(id)
    if(transaction){
      transaction.notes.push(note)
      await raffle.save();
      res.json({message: "note added", status: 200})
    } else {
      res.json({message: "transaction not found", status: 400})
    }
  }
  export const viewUpdateRaffle = async (req, res) => {
    const { id } = req.params
    const raffle = await Raffle.findById(id)
    if(raffle){
      await updateStats(raffle, "dailyVisitStats", 1);
      res.json({message: "view updated"})
    }
  }


  async function updateStats(raffle, type, amount){
    const currentDate = new Date();
    const [isoDateShort, time] = currentDate.toISOString().split('T');
    const hour = time.split(":")[0] + ':00';  
    let isDateInside = false
    raffle.stats[type] = raffle.stats[type].map(visit => {
      if(visit.date === isoDateShort){
        visit.count += amount;
        let exists = false
        for (let i = 0; i < visit.time.length; i++) {
          if(visit.time[i].hour === hour){
            visit.time[i].count += amount;
            exists = true
          }
        }
        if(!exists){
          visit.time.push({
            hour: hour,
            count: amount
          })
        }
        isDateInside = true;
      }
      return visit
  })
    if(!isDateInside){
      raffle.stats[type].push({date: isoDateShort, count: amount, time:[{
        hour: hour,
        count: amount
      }]})
    }
    return await raffle.save()
  }


  // import {RaffleCounter} from "../models/RaffleCounter.js"
  // async function update(){
  //   // await getNextTransactionId('68157b7126cb3bba807324a3')
  //   const raffle = await Raffle.findById('68157b7126cb3bba807324a3')
  //   raffle.stats.dailySales[1].time[0].count = 32
  //   await raffle.save()
  //   console.log(raffle.stats.dailySales[1].time[0].count)
  // }
  // update()


