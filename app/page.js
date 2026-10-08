'use client'

import { useState, useEffect, createContext, useContext, useRef } from 'react'
import Link from 'next/link'
import { packages as staticPackages } from './data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Phone, MapPin, Clock, Search, Upload,
  FileText, CheckCircle, Shield, Award, Users, Microscope, Heart,
  FlaskConical, Droplets, Timer, Star, ChevronRight, Menu, X,
  ArrowRight, Stethoscope, Truck, BadgeCheck, Activity, Download,
  Sun, Zap, PieChart, TestTubes, Home, Calendar,
  CircleDot, Package, UserCheck, ClipboardList, PhoneCall, MapPinned
} from 'lucide-react'

// ============ WHATSAPP HELPER ============
const WHATSAPP_NUMBER = '917669989614'

const getWhatsAppUrl = (itemName) => {
  const message = encodeURIComponent(`Hi, I'd like to book ${itemName}`)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

const getWhatsAppGenericUrl = (text) => {
  const message = encodeURIComponent(text || "Hi, I want to book a test")
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ============ APP CONTEXT ============
const AppContext = createContext()

function AppProvider({ children }) {
  const [sessionId, setSessionId] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    let sid = localStorage.getItem('lab_session_id')
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('lab_session_id', sid)
    }
    setSessionId(sid)
    const savedUser = localStorage.getItem('lab_user')
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)) } catch(e) {}
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('lab_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lab_user')
  }

  return (
    <AppContext.Provider value={{ sessionId, user, login, logout }}>
      {children}
    </AppContext.Provider>
  )
}

const useApp = () => useContext(AppContext)

// ============ TEST ICON HELPER ============
const TestIcon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    droplet: Droplets,
    sun: Sun,
    activity: Activity,
    heart: Heart,
    flask: FlaskConical,
    zap: Zap,
    shield: Shield,
    'pie-chart': PieChart,
    users: Users,
  }
  const Icon = icons[name] || FlaskConical
  return <Icon className={className} />
}

// ============ HEADER ============
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="bg-clinical text-white text-sm py-1.5">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <a
              href={getWhatsAppGenericUrl("Hi, I want to book a test")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-200 transition font-medium"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Book on WhatsApp</span>
              <span className="hidden sm:inline text-red-200">|</span>
              <span className="hidden sm:inline text-red-200 text-xs">Same-Day Collection</span>
            </a>
            <div className="flex items-center gap-3 text-xs">
              <a
                href="https://maps.app.goo.gl/iGHoRNLMN4jss5Gw5"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1 hover:text-green-200 transition"
              >
                <MapPin className="w-3.5 h-3.5" /> Home Collection in Entire Delhi NCR
              </a>
              <span className="hidden md:inline text-red-200">|</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 40 Years of Trust
              </span>
              <span className="text-red-200">|</span>
              <span className="flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> CGHS Empanelled
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => scrollTo('home')} className="flex items-center">
              <img src="/logo.png" alt="Dr Lalchandani Labs" className="h-12 w-auto" />
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Health Packages', id: 'packages' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-clinical hover:bg-red-50 rounded-lg transition"
                >
                  {item.label}
                </button>
              ))}
              <Link
                href="/all-tests"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-clinical hover:bg-red-50 rounded-lg transition"
              >
                All Tests
              </Link>
              <Link
                href="/investor-desk"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-clinical hover:bg-red-50 rounded-lg transition"
              >
                Investor Desk
              </Link>
              <button
                onClick={() => scrollTo('prescription')}
                className="ml-1 bg-lifegreen text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" /> Upload Prescription
              </button>
              <a
                href={getWhatsAppGenericUrl("Hi, I'd like to download my test reports")}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-clinical hover:bg-red-50 rounded-lg transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Reports
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppGenericUrl("Hi, I want to book a test")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
              >
                <WhatsAppIcon className="w-4 h-4" /> Book Now
              </a>
              <button
                className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pb-3 border-t pt-3 space-y-1 animate-fade-in">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Health Packages', id: 'packages' },
                { label: 'Upload Prescription', id: 'prescription' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-left py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              <Link
                href="/all-tests"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                All Tests
              </Link>
              <Link
                href="/investor-desk"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Investor Desk
              </Link>
              <a
                href={getWhatsAppGenericUrl("Hi, I'd like to download my test reports")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Download Reports
              </a>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

// ============ HERO SECTION ============
function HeroSection() {
  const [mobile, setMobile] = useState('')
  const [pincode, setPincode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mobile.length !== 10 || pincode.length !== 6) return
    const message = `Hi, I'd like to book a home collection. My mobile: ${mobile}, Pincode: ${pincode}`
    window.open(getWhatsAppGenericUrl(message), '_blank')
    toast.success('Redirecting to WhatsApp for quick booking!')
  }

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50/30"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-100/20 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <Badge className="bg-red-100 text-clinical hover:bg-red-100 text-sm px-3 py-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 mr-1.5" /> 40 Years of Trust &bull; CGHS Empanelled
            </Badge>

            <h2 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              40 Years of Trust{' '}
              <br className="hidden sm:block" />
              Reports in{' '}
              <span className="text-clinical relative">
                6 Hours
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="#C8102E" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>

            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Trusted by <strong className="text-gray-700">20 Lakh+ patients</strong> across New Delhi.
              40 years of clinical excellence under the direct supervision of Dr A. Lalchandani.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { value: '40+', label: 'Years Legacy' },
                { value: '500+', label: 'Tests Available' },
                { value: '5', label: 'Delhi Centers' }
              ].map((stat, i) => (
                <div key={i} className="text-center p-3.5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-extrabold text-clinical">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {[
                { icon: Award, label: '40 Years Trust', color: 'text-yellow-500' },
                { icon: BadgeCheck, label: 'CGHS Empanelled', color: 'text-blue-600' },
                { icon: Shield, label: 'BSE-SME Listed', color: 'text-green-500' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.getElementById('prescription')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-white border-2 border-clinical text-clinical px-5 py-3 rounded-xl font-semibold hover:bg-clinical hover:text-white transition-all shadow-sm"
            >
              <Upload className="w-5 h-5" /> Upload Prescription
            </button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-clinical to-clinical-dark text-white p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-5 h-5" />
                  <span className="text-sm font-medium text-red-200">FREE Home Collection</span>
                </div>
                <CardTitle className="text-xl font-bold">Book Home Collection</CardTitle>
                <CardDescription className="text-red-100 text-sm">
                  Get your samples collected at home. Reports in 6 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mobile Number</label>
                      <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-clinical/20 focus-within:border-clinical">
                        <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r font-medium">+91</span>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="border-0 focus-visible:ring-0 text-base"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Pincode</label>
                      <Input
                        type="text"
                        placeholder="Enter area pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-base"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-lifegreen hover:bg-green-600 text-white text-base py-6 font-bold shadow-lg shadow-green-200"
                      disabled={mobile.length !== 10 || pincode.length !== 6}
                    >
                      <span className="flex items-center gap-2">
                        <WhatsAppIcon className="w-5 h-5" /> Book on WhatsApp
                      </span>
                    </Button>
                    <p className="text-[11px] text-center text-gray-400 leading-relaxed">
                      You will be redirected to WhatsApp to complete your booking.
                    </p>
                  </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ TRUST BADGES ============
function TrustBadges() {
  return (
    <section className="bg-white border-y border-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
          {[
            { icon: Clock, text: 'Reports in 6 Hours', color: 'text-clinical', highlight: false },
            { icon: Truck, text: 'Free Home Collection', color: 'text-lifegreen', highlight: false },
            { icon: Award, text: '40 Years of Trust', color: 'text-yellow-600', highlight: false },
            { icon: Stethoscope, text: 'Doctor Supervised', color: 'text-red-500', highlight: false },
            { icon: BadgeCheck, text: 'CGHS Empanelled', color: 'text-blue-700', highlight: true },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 ${item.highlight ? 'bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full ${item.highlight ? 'bg-blue-100' : 'bg-gray-50'} flex items-center justify-center ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className={`text-sm font-semibold ${item.highlight ? 'text-blue-700' : 'text-gray-600 font-medium'}`}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ TEST CATALOG ============
// ============ HEALTH PACKAGES ============
function HealthPackages() {
  const packages = staticPackages

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-green-100 text-lifegreen hover:bg-green-100 mb-3">Popular Tests</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Health Checkup Packages</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Comprehensive health packages curated by our doctors. Save up to 50% compared to individual tests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  pkg.recommended ? 'border-2 border-clinical shadow-lg ring-2 ring-clinical/10' : 'border-gray-100'
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute top-0 right-0 bg-clinical text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      pkg.recommended ? 'bg-clinical text-white' : 'bg-red-50 text-clinical'
                    }`}>
                      <TestIcon name={pkg.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] font-medium">{pkg.ageGroup}</Badge>
                        <Badge variant="outline" className="text-[10px] font-medium">{pkg.gender}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-clinical">{pkg.testCount}</p>
                      <p className="text-[10px] text-gray-400">Tests</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-clinical">{pkg.parameterCount}</p>
                      <p className="text-[10px] text-gray-400">Parameters</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-lifegreen">{Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%</p>
                      <p className="text-[10px] text-gray-400">Savings</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Includes</p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.testsIncluded?.map((test, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-white">{test}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-5 px-6 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-gray-900">&#8377;{pkg.price}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">&#8377;{pkg.originalPrice}</span>
                  </div>
                  <a
                    href={getWhatsAppUrl(pkg.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white shadow-md rounded-md px-4 py-2 text-sm font-semibold transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" /> Book Now
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>

        {/* View All Tests Button */}
        <div className="text-center mt-10">
          <Link
            href="/all-tests"
            className="inline-flex items-center gap-2 bg-clinical hover:bg-red-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            View All Tests <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-400 text-xs mt-2">Browse our complete catalog of 70+ diagnostic tests & imaging services</p>
        </div>
      </div>
    </section>
  )
}

// ============ SERVICES SECTION ============
function ServicesSection() {
  const services = [
    { name: 'Blood Tests', image: 'https://images.unsplash.com/photo-1656337426953-554b8e5b50f5?auto=format&fit=crop&w=600&q=80', desc: '500+ diagnostic blood tests backed by 40 Years of Trust' },
    { name: 'X-Ray', image: 'https://images.unsplash.com/photo-1758691461957-13aff0c37c6f?auto=format&fit=crop&w=600&q=80', desc: 'Digital X-ray with instant results and expert radiologist reporting' },
    { name: 'Ultrasound & Color Doppler', image: 'https://images.unsplash.com/photo-1691933880096-4046bc9e2fa0?auto=format&fit=crop&w=600&q=80', desc: 'Advanced ultrasound imaging with color Doppler technology' },
    { name: 'ECG', image: 'https://images.unsplash.com/photo-1596354762473-6706bf6d5626?auto=format&fit=crop&w=600&q=80', desc: 'Electrocardiogram for heart rhythm and electrical activity analysis' },
    { name: 'TMT', image: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Treadmill stress test for cardiac fitness and exercise tolerance' },
    { name: 'Uroflowmetry', image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Non-invasive urine flow rate measurement for urological assessment' },
    { name: 'Pulmonary Function Test', image: 'https://images.pexels.com/photos/7579828/pexels-photo-7579828.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Comprehensive lung function and breathing capacity assessment' },
    { name: 'Liver Fibroscan', image: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Non-invasive liver stiffness measurement for fibrosis detection' },
    { name: 'NCV & EMG', image: 'https://images.pexels.com/photos/5473184/pexels-photo-5473184.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'Nerve conduction velocity and electromyography for nerve health' },
    { name: 'EEG', image: 'https://images.unsplash.com/photo-1631217868204-db1ed6bdd224?auto=format&fit=crop&w=600&q=80', desc: 'Electroencephalogram for brain electrical activity monitoring' },
  ]

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 mb-3">Our Services</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Health Scans and Imaging Tests</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Comprehensive range of health scans and imaging services under one roof with state-of-the-art equipment</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service, i) => (
            <Card key={i} className="group border-gray-100 hover:shadow-lg hover:border-clinical/20 transition-all duration-300 text-center overflow-hidden">
              <div className="relative w-full h-32 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1.5">{service.name}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ HOW IT WORKS ============
function HowItWorks() {
  const steps = [
    { icon: Search, title: 'Select Test', desc: 'Choose from 500+ tests or upload a prescription', color: 'bg-red-50 text-clinical' },
    { icon: Calendar, title: 'Book Slot', desc: 'Pick your preferred date, time & collection type', color: 'bg-green-50 text-lifegreen' },
    { icon: Home, title: 'Sample Collection', desc: 'Our trained phlebotomist visits your home', color: 'bg-orange-50 text-orange-500' },
    { icon: FileText, title: 'Get Reports', desc: 'Reports in 6 hours, backed by 40 Years of Trust', color: 'bg-purple-50 text-purple-500' },
  ]

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 mb-3">Simple Process</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-2">Get tested in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200"></div>
              )}
              <div className="text-center relative z-10">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-clinical text-white text-xs font-bold mb-2">{i + 1}</span>
                <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ PRESCRIPTION UPLOAD ============
function PrescriptionUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleFile = (file) => {
    if (!file) return
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF, JPG, or PNG files only')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB')
      return
    }
    setFileName(file.name)
    setUploaded(true)
    toast.success('Prescription noted! Please share it on WhatsApp to complete your booking.')
    const message = `Hi, I have a prescription to share for booking tests. File: ${file.name}`
    setTimeout(() => {
      window.open(getWhatsAppGenericUrl(message), '_blank')
    }, 1000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  const handleChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  return (
    <section id="prescription" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mb-3">Easy Upload</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Upload Prescription</h2>
            <p className="text-gray-500 mt-2">Upload your doctor's prescription and we'll handle the rest</p>
          </div>

          {uploaded ? (
            <Card className="border-2 border-lifegreen bg-green-50/50">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-lifegreen" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Prescription Uploaded!</h3>
                <p className="text-gray-600 mb-1">
                  <strong>{fileName}</strong>
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Our doctor is reviewing your prescription and will call you to finalize your booking.
                </p>
                <Button onClick={() => { setUploaded(false); setFileName('') }} variant="outline">
                  Upload Another
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card
              className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
                dragActive ? 'border-clinical bg-red-50/50 scale-[1.02]' : 'border-gray-200 hover:border-clinical/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-10 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="hidden"
                />
                {uploaded ? (
                  <div className="space-y-3 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10 text-lifegreen" />
                    </div>
                    <p className="text-gray-900 font-semibold">{fileName}</p>
                    <p className="text-gray-500 text-sm">Please share the prescription on WhatsApp to complete your booking.</p>
                    <a
                      href={getWhatsAppGenericUrl(`Hi, I have a prescription to share for booking tests. File: ${fileName}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-5 py-2.5 font-semibold transition"
                    >
                      <WhatsAppIcon className="w-4 h-4" /> Share on WhatsApp
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-clinical" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Drag & Drop your prescription here</h3>
                    <p className="text-gray-500 text-sm mb-4">or click to browse files</p>
                    <div className="flex justify-center gap-3">
                      {['PDF', 'JPG', 'PNG'].map(type => (
                        <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Maximum file size: 10MB</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}

// ============ WHY CHOOSE US ============
function WhyChooseUs() {
  const features = [
    { icon: BadgeCheck, title: 'CGHS Empanelled', desc: 'Empanelled under Central Government Health Scheme. Trusted by government employees and pensioners for quality diagnostics.', color: 'bg-blue-50 text-blue-600', highlight: true },
    { icon: Award, title: '40 Years of Trust', desc: 'Four decades of clinical excellence under the direct supervision of Dr A. Lalchandani.', color: 'bg-yellow-50 text-yellow-600' },
    { icon: Clock, title: 'Reports in 6 Hours', desc: 'Fast turnaround time with real-time tracking. Most reports delivered within 6 hours of sample collection.', color: 'bg-red-50 text-clinical' },
    { icon: Stethoscope, title: 'Doctor Supervised', desc: 'Every report is verified and signed by qualified pathologists under Dr Lalchandani\'s supervision.', color: 'bg-red-50 text-red-500' },
    { icon: Truck, title: 'Free Home Collection', desc: 'Trained phlebotomists come to your doorstep. Free collection across all Delhi NCR locations.', color: 'bg-green-50 text-lifegreen' },
    { icon: Users, title: '40 Years of Trust', desc: 'Serving 20 lakh+ patients since 1986. A legacy of accuracy, reliability, and patient care.', color: 'bg-orange-50 text-orange-500' },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-clinical/10 text-clinical hover:bg-clinical/10 mb-3">Why Choose Us</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">The Dr Lalchandani Labs Difference</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Why 20 lakh+ patients trust us with their health diagnostics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <Card key={i} className={`hover:shadow-lg transition-all duration-300 group ${feat.highlight ? 'border-2 border-blue-300 bg-blue-50/30 ring-1 ring-blue-100' : 'border-gray-100'}`}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${feat.highlight ? 'text-blue-700' : 'text-gray-900'}`}>{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ LOCATIONS ============
function LocationsSection() {
  const centers = [
    { name: 'Greater Kailash-1', address: 'M-20, Greater Kailash Part-1, New Delhi', timings: 'Mon-Sat: 8AM-7PM | Sun: 8AM-5PM' },
    { name: 'Punjabi Bagh', address: 'Ring Road, Near Metro Station, New Delhi', timings: 'Mon-Sat: 8AM-7PM | Sun: 8AM-5PM' },
    { name: 'Lajpat Nagar', address: 'Central Market, Lajpat Nagar II, New Delhi', timings: 'Mon-Sat: 8AM-7PM | Sun: 8AM-5PM' },
    { name: 'Saket', address: 'J Block, Saket, Near Select City Walk, New Delhi', timings: 'Mon-Sat: 8AM-7PM | Sun: 8AM-5PM' },
    { name: 'Dwarka', address: 'Sector 12, Near Dwarka Court, New Delhi', timings: 'Mon-Sat: 8AM-7PM | Sun: 8AM-5PM' },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-3">Our Centers</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Collection Centers in Delhi</h2>
          <p className="text-gray-500 mt-2">Visit any of our 5 centers across New Delhi, backed by 40 Years of Trust</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.map((center, i) => (
            <Card key={i} className="border-gray-100 hover:border-clinical/30 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <MapPinned className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{center.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{center.address}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-clinical">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{center.timings}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ CTA SECTION ============
function CTASection() {
  return (
    <section className="py-16 bg-clinical text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Book Your Health Checkup?</h2>
        <p className="text-red-100 text-lg max-w-xl mx-auto mb-8">
          Get started with a free home sample collection. Reports delivered in 6 hours, backed by 40 Years of Trust.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={getWhatsAppGenericUrl("Hi, I want to book a health checkup")} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-6 shadow-lg">
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              Book on WhatsApp
            </Button>
          </a>
          <a href="tel:8010689689">
            <Button className="bg-white text-clinical hover:bg-gray-100 font-bold text-lg px-8 py-6">
              <PhoneCall className="mr-2 w-5 h-5" /> Call 80-10-689-689
            </Button>
          </a>
        </div>

        <p className="mt-4 text-red-200 font-medium flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" /> Same-day home collection available on all bookings
        </p>

        <div className="mt-8 flex justify-center items-center gap-2 text-red-200 text-sm">
          <Shield className="w-4 h-4" />
          <span>ABDM Ready &bull; Link your ABHA ID for seamless health records</span>
        </div>
      </div>
    </section>
  )
}

// ============ PHOTO GALLERY CAROUSEL ============
function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const photos = [
    { src: '/gallery/biochemistry-machine.jpg', caption: 'Biochemistry Machine - Dimension RXL (Siemens)' },
    { src: '/gallery/xray-room.jpg', caption: 'Digital X-Ray Room - Machine from Siemens' },
    { src: '/gallery/dr-lalchandani-chamber.jpg', caption: 'Dr A Lalchandani Chamber' },
    { src: '/gallery/immunoassay-dept.jpg', caption: 'Immunoassay & Biochemistry Department' },
    { src: '/gallery/conference-room.jpg', caption: 'Conference Room & VIP Seating' },
    { src: '/gallery/centre-panoramic-view.jpg', caption: 'Overall Centre View (Panoramic)' },
    { src: '/gallery/physician-examination-room.jpg', caption: 'Physician - Medical Examination Room' },
    { src: '/gallery/reception-view.jpg', caption: 'Reception Area' },
    { src: '/gallery/ultrasound-room.jpg', caption: 'Ultrasound Room & Medical Examination' },
    { src: '/gallery/lab-image-3.jpg', caption: 'Laboratory - Diagnostic Equipment' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (idx) => setCurrentIndex(idx)
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % photos.length)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="bg-red-100 text-clinical hover:bg-red-100 mb-3">Our Facility</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">State-of-the-Art Laboratory</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">World-class equipment from Siemens and advanced diagnostic infrastructure</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[16/9] bg-gray-200">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white font-semibold text-lg">{photo.caption}</p>
                </div>
              </div>
            ))}

            {/* Nav Arrows */}
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition z-10"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                  idx === currentIndex ? 'border-clinical shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-2 h-2 rounded-full transition ${idx === currentIndex ? 'bg-clinical w-5' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-24 lg:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo-footer.png" alt="Dr Lalchandani Labs" className="h-14 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              40 Years of Trust and clinical excellence in diagnostic laboratory services.
              Trusted by 20 lakh+ patients across New Delhi.
            </p>
            <div className="flex items-center gap-3">
              <Badge className="bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/30">40 Years Trust</Badge>
              <Badge className="bg-red-900/30 text-red-400 hover:bg-red-900/30">CGHS</Badge>
              <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/30">BSE-SME</Badge>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Home', 'Book a Test', 'Health Packages', 'Upload Prescription', 'Download Reports'].map(link => (
                <li key={link}>
                  <button className="text-sm text-gray-400 hover:text-white transition">{link}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Popular Tests</h4>
            <ul className="space-y-2.5">
              {['Complete Blood Count', 'Thyroid Profile', 'Vitamin D', 'Lipid Profile', 'Liver Function Test', 'HbA1c'].map(test => (
                <li key={test}>
                  <button className="text-sm text-gray-400 hover:text-white transition">{test}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:8010689689" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                <Phone className="w-4 h-4 text-clinical" /> 80-10-689-689
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-clinical shrink-0 mt-0.5" />
                <span>M-20, Greater Kailash Part-1,<br />New Delhi - 110048</span>
                <a
                  href="https://maps.app.goo.gl/iGHoRNLMN4jss5Gw5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 ml-1 p-1 rounded hover:bg-gray-700 transition"
                  title="Open in Google Maps"
                >
                  <svg className="w-5 h-5 text-green-400 hover:text-green-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-clinical" /> Mon-Sat: 8 AM - 7 PM | Sun: 8 AM - 5 PM
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Dr Lalchandani Labs. All rights reserved. | DPDP Act 2023 Compliant | DISHA Framework Ready
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <button className="hover:text-white transition">Privacy Policy</button>
            <button className="hover:text-white transition">Terms of Service</button>
            <button className="hover:text-white transition">Consent Manager</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============ OTP DIALOG ============
function OTPDialog({ open, onOpenChange }) {
  const { login } = useApp()
  const [step, setStep] = useState(1)
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [hint, setHint] = useState('')

  const sendOTP = () => {
    if (mobile.length !== 10) return
    setStep(2)
    setHint('Use OTP: 123456')
    toast.success('OTP sent to your mobile')
  }

  const verifyOTP = () => {
    if (otp.length !== 6) return
    if (otp === '123456') {
      login({ id: 'user_' + mobile, mobile, name: 'Patient' })
      toast.success('Login successful!')
      resetAndClose()
    } else {
      toast.error('Invalid OTP. Use 123456')
    }
  }

  const resetAndClose = () => {
    setStep(1)
    setMobile('')
    setOtp('')
    setHint('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-clinical" />
            {step === 1 ? 'Login / Download Reports' : 'Enter OTP'}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Enter your registered mobile number to access your reports'
              : `We sent a 6-digit OTP to +91 ${mobile}`
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mobile Number</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r font-medium">+91</span>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="border-0 focus-visible:ring-0 text-base"
                  autoFocus
                />
              </div>
            </div>
            <Button
              className="w-full bg-clinical hover:bg-clinical-dark py-5"
              onClick={sendOTP}
              disabled={mobile.length !== 10}
            >
              Send OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex justify-center">
              <div className="flex gap-2">
                {[0,1,2,3,4,5].map(i => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      const newOtp = otp.split('')
                      newOtp[i] = val
                      setOtp(newOtp.join('').slice(0, 6))
                      if (val && e.target.nextSibling) e.target.nextSibling.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && e.target.previousSibling) e.target.previousSibling.focus()
                    }}
                    className="w-11 h-12 text-center text-lg font-bold border-2 rounded-lg focus:border-clinical focus:ring-2 focus:ring-clinical/20 outline-none transition"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>
            {hint && (
              <p className="text-xs text-center text-orange-500 font-medium">{hint}</p>
            )}
            <Button
              className="w-full bg-lifegreen hover:bg-green-600 py-5"
              onClick={verifyOTP}
              disabled={otp.length !== 6}
            >
              Verify & Login
            </Button>
            <button
              onClick={() => { setStep(1); setOtp('') }}
              className="w-full text-sm text-gray-500 hover:text-clinical transition"
            >
              Change number
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============ WHATSAPP FLOATING BUTTON ============
function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppGenericUrl("Hi, I want to book a test")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Chat on WhatsApp
      </span>
    </a>
  )
}

// ============ MOBILE STICKY BAR ============
function MobileStickyBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl px-4 py-2.5">
      <div className="flex gap-2">
        <a
          href={getWhatsAppGenericUrl("Hi, I want to book a home collection")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm"
        >
          <WhatsAppIcon className="w-5 h-5 drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
          Home Collection
        </a>
        <a
          href={getWhatsAppGenericUrl("Hi, I want to book a test")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-clinical text-white py-2.5 rounded-xl font-semibold text-sm"
        >
          <WhatsAppIcon className="w-4 h-4" /> Book Now
        </a>
        <a
          href="tel:8010689689"
          className="flex-1 flex items-center justify-center gap-1.5 bg-lifegreen hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm"
        >
          <PhoneCall className="w-4 h-4" /> Call Now
        </a>
      </div>
      <p className="text-center text-[10px] text-gray-500 mt-1.5 font-medium flex items-center justify-center gap-1">
        <Clock className="w-3 h-3 text-clinical" /> Same-day home collection available on all bookings
      </p>
    </div>
  )
}

// ============ MAIN PAGE ============
export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          <TrustBadges />
          <HealthPackages />
          <ServicesSection />
          <HowItWorks />
          <PrescriptionUpload />
          <WhyChooseUs />
          <PhotoGallery />
          <CTASection />
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileStickyBar />
      </div>
    </AppProvider>
  )
}
