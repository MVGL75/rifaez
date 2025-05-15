
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Facebook, Mail, Lock, Unlock, AlertCircle } from "lucide-react";
// import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {

  const { login } = useAuth();

  
  const [loginError, setLoginError] = useState(null)
  const [isLocked, setLock] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here we would validate credentials with backend
    const data = await login({
      username: formData.email,
      password: formData.password
    });
    if(data){
      setLoginError(data.message)
    }
  };

  const handleFacebookLogin = () => {
    window.FB.login(function(response) {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name, email' }, function(response) {
          login({
            email: response.email,
            name: response.name,
            provider: 'facebook'
          });
        });
      }
    }, { scope: 'public_profile,email' });
  };

  // const handleGoogleLogin = (credentialResponse) => {
  //   const decoded = jwtDecode(credentialResponse.credential);
  //   login({
  //     email: decoded.email,
  //     name: decoded.name,
  //     provider: 'google'
  //   });
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
          <p className="mt-2 text-muted-foreground">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <div className="relative">
              { isLocked ?
              <Lock onClick={()=> setLock(prev => !prev)} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" /> :
              <Unlock onClick={()=> setLock(prev => !prev)} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              }
              <input
                type={isLocked ? "password" : "text"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                placeholder="••••••••"
              />
            </div>
          </div>
          { !loginError ? '' :
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle stroke="red" className="h-4 w-4"/>
            <span>El correo electrónico o la contraseña son incorrectos.</span>
          </div>
          }
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleFacebookLogin}
            className="flex items-center justify-center space-x-2"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>Facebook</span>
          </Button>

          {/* <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              toast({
                title: "Error",
                description: "Error al iniciar sesión con Google",
                variant: "destructive"
              });
            }}
          /> */}
        </div>

        <p className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
