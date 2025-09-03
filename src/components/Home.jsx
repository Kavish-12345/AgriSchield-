
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Shield, TrendingUp, Users, Leaf, DollarSign, Sprout, Globe, Lock, Activity, Database, Wheat, Zap, Brain, Satellite, Coffee, Coins, Droplets, Box } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
const Home = () => {
  const [activeRole, setActiveRole] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const canvasRef = useRef(null);
  
  // Enhanced particle system with teal/orange theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        color: Math.random() > 0.6 ? '#0F766E' : '#16A085' // Teal variations
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Connect nearby particles with teal lines
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(15, 118, 110, ${0.2 * (100 - distance) / 100})`;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Agricultural floating elements
  const FloatingElement = ({ className, style, type = 'leaf', size = 'medium' }) => {
    const sizeClasses = {
      small: 'w-12 h-12',
      medium: 'w-16 h-16',
      large: 'w-20 h-20'
    };

    const elements = {
      leaf: (
        <div className="relative">
          <Leaf className="w-full h-full text-teal-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-xl animate-pulse" />
        </div>
      ),
      wheat: (
        <div className="relative">
          <Wheat className="w-full h-full text-yellow-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
        </div>
      ),
      sprout: (
        <div className="relative">
          <Sprout className="w-full h-full text-emerald-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
        </div>
      )
    };

    return (
      <div className={`fixed ${className} ${sizeClasses[size]} opacity-60 pointer-events-none`} style={style}>
        {elements[type]}
      </div>
    );
  };

  const commodities = [
    { 
      name: "Coffee",
      icon: Coffee,
      price: "$1.85/lb",
      change: "-8.2%",
      status: "critical",
      volume: "2.4M",
      description: "Premium arabica beans"
    },
    { 
      name: "Gold",
      icon: Coins,
      price: "$1925/oz",
      change: "+0.8%",
      status: "stable",
      volume: "8.7M",
      description: "24K pure gold bullion"
    },
    { 
      name: "Oil",
      icon: Droplets,
      price: "$73.50/barrel",
      change: "-1.8%",
      status: "stable",
      volume: "12.2M",
      description: "Crude oil benchmark"
    },
    { 
      name: "Sugar",
      icon: Box,
      price: "$0.19/lb",
      change: "-5.2%",
      status: "warning",
      volume: "6.8M",
      description: "Non-GMO refined sugar"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated particle background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Agricultural grid pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(15,118,110,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,118,110,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Mouse-following glow effect */}
      <div 
        className="fixed pointer-events-none z-5 mix-blend-screen"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(15,118,110,0.1) 0%, rgba(234,88,12,0.05) 50%, transparent 70%)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Floating agricultural elements */}
      <FloatingElement 
        className="left-16 top-32 z-10" 
        style={{ 
          transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`
        }}
        type="leaf"
        size="large"
      />
      <FloatingElement 
        className="right-20 top-48 z-10" 
        style={{ 
          transform: `translateY(${scrollY * -0.12}px) rotate(${scrollY * -0.03}deg)`
        }}
        type="wheat"
        size="medium"
      />
      <FloatingElement 
        className="left-1/3 top-64 z-5" 
        style={{ 
          transform: `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.02}deg)`
        }}
        type="sprout"
        size="small"
      />
      <FloatingElement 
        className="right-1/3 top-80 z-5" 
        style={{ 
          transform: `translateY(${scrollY * -0.06}px) rotate(${scrollY * -0.04}deg)`
        }}
        type="leaf"
        size="small"
      />

      {/* Fixed Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-lg z-50 border-b border-teal-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-orange-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg blur-lg opacity-30 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-orange-700 to-teal-400 tracking-wide">
                  AGRISCHIELD
                </span>
                <div className="text-xs text-teal-400 opacity-80 font-mono">FARM PROTECTION</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button className="relative group bg-gradient-to-r  from-teal-500/20 to-teal-600 hover:from-teal-500/20 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-orange-500/10 opacity-0 group-hover:opacity-500 transition-opacity duration-300" />
                <span className="relative z-10">Connect Wallet</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/20 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent animate-pulse" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="inline-block mb-8">
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-orange-400 to-teal-400 animate-pulse">
                    SMART
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-100 to-orange-100">
                    COMMODITY
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-orange-300 to-teal-300">
                    INSURANCE
                  </span>
                </h1>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-orange-500/20 blur-3xl -z-10" />
              </div>
            </div>
            
            <div className="relative">
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
                Protect your commodities with{' '}
                <span className="text-teal-400 font-semibold">AI-powered weather prediction</span>,{' '}
                <span className="text-orange-400 font-semibold">satellite monitoring</span>, and{' '}
                <span className="text-emerald-400 font-semibold">blockchain-verified claims</span>
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 blur-2xl -z-10" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-16">
            {/* PROTECT COMMODITIES Button */}
            <button className="group relative overflow-hidden bg-gradient-to-r from-teal-500/20 to-teal-600 hover:from-teal-500/20 hover:to-orange-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-500 transform hover:scale-105 cursor-pointer shadow-lg shadow-teal-600/30">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-orange-400/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-3">
                <Shield className="w-5 h-5" />
                PROTECT COMMODITIES
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-orange-400 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

            <button className="group relative overflow-hidden border-2 border-teal-500 text-teal-400 hover:bg-teal-500/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-500 transform hover:scale-105 shadow-inner shadow-teal-500/20 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-3">
                <Database className="w-5 h-5" />
                LEARN MORE
              </span>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-orange-400 blur-sm opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            </button>
          </div>

          {/* Agricultural Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '$47.2M', label: 'PROTECTION', icon: Shield },
              { value: '8,423', label: 'FARMERS COVERED', icon: Users },
              { value: '127', label: 'CROP TYPES', icon: Sprout },
              { value: '99.1%', label: 'CLAIM SUCCESS', icon: Activity }
            ].map((stat, index) => (
              <div key={index} className="group relative cursor-pointer transform transition-transform duration-500 hover:scale-105">
                <div className="relative overflow-hidden bg-black/50 backdrop-blur-sm border border-teal-500/10 rounded-xl p-6 transition-all duration-500 group-hover:border-teal-500/30">
                  <div className="absolute inset-0 bg-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <stat.icon className="w-8 h-8 text-teal-400 mb-3" />
                    <div className="text-2xl font-bold mb-1 text-teal-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative">
            <ChevronDown className="w-8 h-8 text-teal-400 animate-bounce" />
            <div className="absolute inset-0 bg-teal-500 rounded-full blur-lg opacity-30 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-24 px-4 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/10 to-black/80" />
        <div className="max-w-7xl mx-auto relative">
          {/* Section Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-orange-400 to-teal-400">
              INSURANCE
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select your commodities and get instant insurance quotes
            </p>
          </div>

          {/* Commodities Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {commodities.map((commodity, index) => (
              <div 
                key={index}
                className="group cursor-pointer transform transition-all duration-700 hover:scale-105"
              >
                <div className="relative overflow-hidden bg-black/70 backdrop-blur-md border border-teal-500/20 rounded-xl p-6 transition-all duration-500 group-hover:border-teal-500/50 min-h-[320px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className="text-5xl mb-4 filter drop-shadow-lg text-center">
                      <commodity.icon className="w-10 h-10 mx-auto text-teal-400" />
                    </div>

                    {/* Commodity Name */}
                    <h3 className="text-2xl font-bold mb-1 text-teal-300 text-center">
                      {commodity.name.toUpperCase()}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm text-center mb-4">
                      {commodity.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white font-semibold">{commodity.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Change:</span>
                        <span className={`font-semibold ${
                          commodity.change.startsWith('+') ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                          {commodity.change}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Volume:</span>
                        <span className="text-yellow-400 font-semibold">{commodity.volume}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-3 h-3 rounded-full ${
                        commodity.status === 'stable' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                        commodity.status === 'warning' ? 'bg-yellow-500 shadow-yellow-500/50' : 
                        'bg-orange-500 shadow-orange-500/50'
                      } animate-pulse`} />
                      <span className="ml-2 text-xs text-gray-400">
                        {commodity.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                    onClick={() => navigate('/Registration')}
                     className="mt-auto w-full group/btn relative overflow-hidden bg-gradient-to-r from-teal-500/20 to-teal-600 hover:from-teal-500/20 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-500 cursor-pointer">
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                        <Lock className="w-4 h-4" />
                        GET COVERAGE
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section id="features" className="py-24 px-4 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/10 to-black/80" />
        <div className="max-w-7xl mx-auto relative">
          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-orange-400 to-teal-400">
              NEXT-GEN PROTECTION
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionizing agriculture with AI, IoT, and blockchain synergy.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-10">
            {[
              {
                icon: <Brain className="w-14 h-14" />,
                title: "AI Weather Prediction",
                description: "Predicts micro-climate weather patterns with 95% accuracy up to 14 days in advance using machine learning on 10,000+ stations & satellite data.",
                stats: ["95% Accuracy", "14-Day Forecast", "Micro-Climate Insights"]
              },
              {
                icon: <Satellite className="w-14 h-14" />,
                title: "Satellite Monitoring",
                description: "Real-time NDVI and soil moisture surveillance for early crop stress detection, maximizing yield and proactive protection.",
                stats: ["Real-Time NDVI", "Soil Moisture", "Early Stress Alerts"]
              },
              {
                icon: <Zap className="w-14 h-14" />,
                title: "Instant Claims Processing",
                description: "Smart contracts automate claims based on satellite damage confirmation. Zero paperwork. Instant payouts upon validation.",
                stats: ["Automatic Payouts", "Blockchain Secured", "No Delays"]
              }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-black/60 backdrop-blur-sm border border-teal-500/10 rounded-xl p-8 hover:border-teal-500/30 transition-all duration-500 shadow-md hover:shadow-teal-500/10">
                {/* Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-600/20 to-orange-600/20 flex items-center justify-center text-teal-400 shadow-inner">
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-4 text-center text-teal-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-center mb-6 text-sm">
                  {feature.description}
                </p>

                {/* Stats */}
                <div className="space-y-2">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                      <span className="text-teal-400 text-xs">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    
  );
};
export default Home;
