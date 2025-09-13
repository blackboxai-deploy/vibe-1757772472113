'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CrownIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon,
  UsersIcon,
  TrendingUpIcon,
  AwardIcon
} from 'lucide-react';

const membershipPlans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 299,
    currency: 'ARS',
    popular: false,
    features: [
      'Acceso a beneficios básicos',
      'Descuentos en restaurantes',
      'Soporte por email',
      'App móvil',
      '10 beneficios mensuales'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 599,
    currency: 'ARS',
    popular: true,
    features: [
      'Todos los beneficios básicos',
      'Acceso a promociones exclusivas',
      'Descuentos premium en spa y bienestar',
      'Soporte prioritario 24/7',
      'Beneficios ilimitados',
      'Eventos exclusivos'
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 999,
    currency: 'ARS',
    popular: false,
    features: [
      'Todos los beneficios premium',
      'Concierge personal',
      'Acceso a ofertas VIP',
      'Descuentos máximos garantizados',
      'Eventos privados exclusivos',
      'Asesoramiento personalizado',
      'Beneficios internacionales'
    ]
  }
];

const benefits = [
  {
    icon: '🍽️',
    title: 'Gastronomía Premium',
    description: 'Descuentos hasta 25% en los mejores restaurantes de la ciudad'
  },
  {
    icon: '🧘',
    title: 'Bienestar & Spa',
    description: 'Tratamientos de relajación y bienestar con descuentos exclusivos'
  },
  {
    icon: '🎭',
    title: 'Entretenimiento',
    description: 'Entradas preferenciales para cines, teatros y eventos culturales'
  },
  {
    icon: '✈️',
    title: 'Viajes & Turismo',
    description: 'Descuentos especiales en hoteles, vuelos y paquetes turísticos'
  },
  {
    icon: '🏥',
    title: 'Salud & Medicina',
    description: 'Consultas médicas preferenciales y descuentos en estudios clínicos'
  },
  {
    icon: '🎓',
    title: 'Educación',
    description: 'Cursos y talleres con descuentos para el desarrollo profesional'
  }
];

const testimonials = [
  {
    name: 'María González',
    role: 'Miembro Premium',
    content: 'Los beneficios de CEBIP han transformado mi estilo de vida. Increíbles descuentos y atención excepcional.',
    rating: 5
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Miembro VIP',
    content: 'El servicio de concierge es impresionante. Siempre encuentran las mejores opciones para mis necesidades.',
    rating: 5
  },
  {
    name: 'Ana Martínez',
    role: 'Miembro Básico',
    content: 'Excelente relación calidad-precio. Los descuentos en restaurantes son fantásticos.',
    rating: 5
  }
];

export default function HomePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleMercadoPagoPayment = (planId: string) => {
    setSelectedPlan(planId);
    // Aquí se integraría con MercadoPago SDK
    // Por ahora simularemos el proceso
    alert(`Redirigiendo a MercadoPago para el plan: ${planId.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CrownIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CEBIP
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/login')}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Acceder
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-medium">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Membresía Premium Exclusiva
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Beneficios Exclusivos
              <br />
              <span className="text-blue-600">Para Tu Estilo de Vida</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Únete a CEBIP y descubre un mundo de beneficios premium, descuentos exclusivos 
              y experiencias únicas diseñadas especialmente para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Ver Planes Premium
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Conocer Beneficios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <UsersIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5,000+</div>
              <div className="text-gray-600">Miembros Activos</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUpIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">200+</div>
              <div className="text-gray-600">Establecimientos Afiliados</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <AwardIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Satisfacción de Miembros</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Beneficios Exclusivos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre todos los beneficios que tenemos preparados para hacer tu vida más cómoda y placentera.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planes" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6 bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
              Planes de Membresía
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elige el plan que mejor se adapte a tu estilo de vida y comienza a disfrutar de beneficios exclusivos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <StarIcon className="w-4 h-4 mr-1" />
                      Más Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                        : 'bg-gradient-to-br from-gray-600 to-gray-800'
                    }`}>
                      {plan.id === 'vip' ? (
                        <CrownIcon className="w-8 h-8 text-white" />
                      ) : plan.id === 'premium' ? (
                        <ShieldCheckIcon className="w-8 h-8 text-white" />
                      ) : (
                        <SparklesIcon className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${plan.price}
                    <span className="text-lg text-gray-600 font-normal"> /{plan.currency}</span>
                  </div>
                  <div className="text-gray-600">por mes</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handleMercadoPagoPayment(plan.id)}
                    className={`w-full py-3 font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    disabled={selectedPlan === plan.id}
                  >
                    {selectedPlan === plan.id ? 'Procesando...' : 'Elegir Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Lo Que Dicen Nuestros Miembros
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Testimonios reales de miembros satisfechos que ya disfrutan de todos nuestros beneficios.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{testimonial.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-white mb-6">
            ¿Listo Para Comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Únete a miles de miembros que ya disfrutan de beneficios exclusivos. 
            Tu nueva experiencia premium te está esperando.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Elegir Mi Plan
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push('/login')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Ya Soy Miembro
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <CrownIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CEBIP</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Tu membresía premium para una experiencia de vida excepcional con beneficios exclusivos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Servicios</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Gastronomía</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Bienestar</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Entretenimiento</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Viajes</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Soporte</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Centro de Ayuda</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Términos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Contacto</h3>
              <div className="space-y-3 text-gray-400">
                <p>Email: info@cebip.com</p>
                <p>Teléfono: +54 11 1234-5678</p>
                <p>Horario: 9:00 - 18:00 hs</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CEBIP. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}