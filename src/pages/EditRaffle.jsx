
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5050',
  withCredentials: true, 
});

const EditRafflePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const raffles = [
    {
      id: 1,
      title: "iPhone 15 Pro",
      description: "Gana el último iPhone 15 Pro",
      price: "5.00",
      endDate: "2025-05-01",
      maxParticipants: 100,
      participants: 45,
      status: "active",
      url: "/raffle/1",
      template: "modern",
      colorPalette: "blue",
      paymentMethod: "default",
      paymentEnabled: true,
      extraInfo: "RIFA SUJETA AL 80% DE LOS BOLETOS VENDIDOS"
    },
    {
      id: 2,
      title: "PlayStation 5",
      endDate: "2025-04-15",
      participants: 32,
      status: "active",
      url: "/raffle/2"
    },
    {
      id: 3,
      title: "MacBook Air",
      endDate: "2025-04-30",
      participants: 28,
      status: "active",
      url: "/raffle/3"
    },
  ];

  const handlePreview = (id) => {
    navigate(`/raffle/${id}`);
  };

  const handleEdit = (raffle) => {
    navigate(`/edit/${raffle.id}`);
  };

  const handleDelete = async (raffle) => {
    const res = await api.post(`/raffle/delete/${raffle.id}`)
    if(res.data.status === 200){
      setUser(res.data.user)
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
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
        <h1 className="text-4xl font-bold text-foreground">Editar Rifas</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Gestiona tus rifas activas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Fecha de Finalización
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {user.raffles.map((raffle) => (
                <tr key={raffle._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{raffle.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {raffle.readableEndDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {raffle.currentParticipants.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {raffle.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handlePreview(raffle._id)}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Vista Previa</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleEdit(raffle)}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleDelete(raffle)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default EditRafflePage;
