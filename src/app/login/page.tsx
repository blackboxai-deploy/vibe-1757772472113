'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CrownIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-react';
import { authenticate } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = authenticate(formData);
      
      if (result) {
        // Redireccionar según el rol del usuario
        if (result.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/member/dashboard');
        }
      } else {
        setError('Credenciales incorrectas o usuario inactivo');
      }
    } catch {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  const demoCredentials = [
    { role: 'Administrador', email: 'admin@cebip.com', password: 'admin123' },
    { role: 'Miembro Premium', email: 'maria@example.com', password: 'maria123' },
    { role: 'Miembro Básico', email: 'carlos@example.com', password: 'carlos123' },
    { role: 'Miembro VIP', email: 'luis@example.com', password: 'luis123' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <CrownIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-poppins">
                CEBIP
              </h1>
              <p className="text-gray-600 font-medium">Membresía Premium</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Accede a tu mundo de 
              <span className="text-blue-600"> beneficios exclusivos</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Inicia sesión para disfrutar de descuentos únicos, promociones especiales 
              y experiencias premium diseñadas especialmente para ti.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">200+</div>
              <div className="text-gray-600">Establecimientos</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">5k+</div>
              <div className="text-gray-600">Miembros Activos</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ingresa tus credenciales para acceder a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircleIcon className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ejemplo@email.com"
                    className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Tu contraseña"
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                    Credenciales de Demostración
                  </span>
                </div>
                <div className="grid gap-2">
                  {demoCredentials.map((cred, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fillDemoCredentials(cred.email, cred.password)}
                      className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                    >
                      <div className="font-medium text-sm text-gray-900">{cred.role}</div>
                      <div className="text-xs text-gray-600">{cred.email}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <Link 
                  href="/"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ← Volver al inicio
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}