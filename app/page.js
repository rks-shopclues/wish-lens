'use client'

import { useState, useEffect, createContext, useContext, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Phone, MapPin, Clock, Search, ShoppingCart, Trash2, Upload,
  FileText, CheckCircle, Shield, Award, Users, Microscope, Heart,
  FlaskConical, Droplets, Timer, Star, ChevronRight, Menu, X,
  ArrowRight, Stethoscope, Truck, BadgeCheck, Activity, Download,
  Sun, Zap, PieChart, TestTubes, Home, Calendar, CreditCard,
  CircleDot, Package, UserCheck, ClipboardList, PhoneCall, MapPinned
} from 'lucide-react'

// ============ CART CONTEXT ============
const CartContext = createContext()

function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [sessionId, setSessionId] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
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
    fetchCart(sid)
  }, [])

  const fetchCart = async (sid) => {
    try {
      const res = await fetch(`/api/cart/${sid || sessionId}`)
      const data = await res.json()
      setCart(data.cart || [])
    } catch (e) { console.error('Cart fetch failed', e) }
  }

  const addToCart = async (item) => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          itemId: item.id,
          itemType: item.itemType || 'test',
          name: item.name,
          price: item.price
        })
      })
      const data = await res.json()
      if (data.cart) setCart(data.cart)
      setIsCartOpen(true)
      toast.success(`${item.name} added to cart`)
    } catch (e) {
      toast.error('Failed to add to cart')
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, itemId })
      })
      const data = await res.json()
      if (data.cart) setCart(data.cart)
      toast.info('Item removed from cart')
    } catch (e) {
      toast.error('Failed to remove item')
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0)

  const isInCart = (itemId) => cart.some(item => item.itemId === itemId)

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('lab_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lab_user')
  }

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, cartTotal,
      isCartOpen, setIsCartOpen, sessionId,
      user, login, logout, fetchCart, isInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

const useCart = () => useContext(CartContext)

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
  const { cart, setIsCartOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

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
              href="https://wa.me/918010689689?text=Hi%2C%20I%20want%20to%20book%20a%20test"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-200 transition font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>Book on WhatsApp</span>
              <span className="hidden sm:inline text-red-200">|</span>
              <span className="hidden sm:inline text-red-200 text-xs">Same-Day Collection</span>
            </a>
            <div className="flex items-center gap-3 text-xs">
              <span className="hidden md:flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> New Delhi &bull; 5 Centers
              </span>
              <span className="hidden md:inline text-red-200">|</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> NABL Accredited
              </span>
              <span className="text-red-200">|</span>
              <span className="flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> ISO 15189
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
                { label: 'Book a Test', id: 'tests' },
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
              <button
                onClick={() => scrollTo('prescription')}
                className="ml-1 bg-lifegreen text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" /> Upload Prescription
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="ml-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-clinical hover:bg-red-50 rounded-lg transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Reports
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-lg hover:bg-gray-100 transition"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-lifegreen text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
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
                { label: 'Book a Test', id: 'tests' },
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
              <button
                onClick={() => { setShowLogin(true); setMobileMenuOpen(false) }}
                className="block w-full text-left py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Download Reports
              </button>
            </div>
          )}
        </div>
      </header>
      <OTPDialog open={showLogin} onOpenChange={setShowLogin} />
    </>
  )
}

// ============ HERO SECTION ============
function HeroSection() {
  const [mobile, setMobile] = useState('')
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mobile.length !== 10 || pincode.length !== 6) return
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, pincode })
      })
      if (res.ok) {
        setSuccess(true)
        toast.success('We will call you back within 15 minutes!')
      }
    } catch (e) {
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false)
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
              <Shield className="w-3.5 h-3.5 mr-1.5" /> NABL Accredited &bull; ISO 15189 Certified
            </Badge>

            <h2 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              NABL Accredited{' '}
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
              Trusted by <strong className="text-gray-700">5 Lakh+ patients</strong> across New Delhi.
              40 years of clinical excellence under the direct supervision of Dr. Lalchandani.
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
                { icon: Award, label: 'NABL', color: 'text-yellow-500' },
                { icon: BadgeCheck, label: 'ISO 15189', color: 'text-clinical' },
                { icon: Shield, label: 'BSE-SME Listed', color: 'text-green-500' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
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
                {success ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-lifegreen" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                    <p className="text-gray-500 mt-2">We will call you back within <strong className="text-clinical">15 minutes</strong></p>
                    <Button onClick={() => setSuccess(false)} className="mt-5 bg-clinical hover:bg-clinical-dark">
                      Book Another
                    </Button>
                  </div>
                ) : (
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
                      disabled={loading || mobile.length !== 10 || pincode.length !== 6}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Get Callback in 15 Mins <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                    <p className="text-[11px] text-center text-gray-400 leading-relaxed">
                      By submitting, you agree to our Privacy Policy and consent to data processing under DPDP Act 2023.
                    </p>
                  </form>
                )}
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
            { icon: Clock, text: 'Reports in 6 Hours', color: 'text-clinical' },
            { icon: Truck, text: 'Free Home Collection', color: 'text-lifegreen' },
            { icon: Award, text: 'NABL Accredited', color: 'text-yellow-600' },
            { icon: Stethoscope, text: 'Doctor Supervised', color: 'text-red-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-600">
              <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ TEST CATALOG ============
function TestCatalog() {
  const { addToCart, isInCart } = useCart()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showAll, setShowAll] = useState(false)

  const categories = ['All', 'Haematology', 'Biochemistry', 'Endocrinology', 'Diabetology', 'Clinical Pathology', 'Immunology']

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      // First try to seed
      await fetch('/api/seed', { method: 'POST' })
      const res = await fetch('/api/tests')
      const data = await res.json()
      setTests(data.tests || [])
    } catch (e) {
      console.error('Failed to fetch tests', e)
    }
    setLoading(false)
  }

  const filteredTests = tests.filter(test => {
    const matchesCategory = activeCategory === 'All' || test.category === activeCategory
    const matchesSearch = !search || test.name.toLowerCase().includes(search.toLowerCase()) || test.shortName?.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const displayTests = showAll ? filteredTests : filteredTests.slice(0, 8)

  return (
    <section id="tests" className="py-16 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-red-100 text-clinical hover:bg-red-100 mb-3">Popular Tests</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Book a Diagnostic Test</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Choose from 500+ NABL accredited tests with home sample collection and reports in 6 hours</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tests... (e.g. CBC, Thyroid, Vitamin D)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowAll(false) }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-clinical text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayTests.map(test => (
                <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-gray-100 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${test.fastingRequired ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-clinical'}`}>
                        <TestIcon name={test.icon} />
                      </div>
                      {test.popular && (
                        <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-[10px]">Popular</Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-clinical transition">{test.name}</h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{test.description}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-clinical" />
                        <span>TAT: <strong>{test.tat}</strong></span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs ${test.fastingRequired ? 'text-orange-600' : 'text-green-600'}`}>
                        <CircleDot className="w-3.5 h-3.5" />
                        <span className="font-medium">{test.fastingInfo}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
                        <span>{test.parameters} Parameters</span>
                      </div>
                    </div>

                    <Separator className="mb-3" />

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-gray-900">&#8377;{test.price}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">&#8377;{test.originalPrice}</span>
                        <span className="text-xs text-lifegreen font-semibold ml-1">
                          {Math.round((1 - test.price / test.originalPrice) * 100)}% off
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => addToCart({ id: test.id, name: test.name, price: test.price, itemType: 'test' })}
                      disabled={isInCart(test.id)}
                      className={`w-full mt-3 text-sm font-semibold ${
                        isInCart(test.id)
                          ? 'bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-default'
                          : 'bg-lifegreen hover:bg-green-600 text-white shadow-sm'
                      }`}
                      size="sm"
                    >
                      {isInCart(test.id) ? (
                        <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Added to Cart</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><ShoppingCart className="w-4 h-4" /> Add to Cart</span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTests.length > 8 && !showAll && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(true)}
                  className="border-clinical text-clinical hover:bg-clinical hover:text-white"
                >
                  View All {filteredTests.length} Tests <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            )}

            {filteredTests.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tests found. Try a different search or category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

// ============ HEALTH PACKAGES ============
function HealthPackages() {
  const { addToCart, isInCart } = useCart()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages')
      const data = await res.json()
      setPackages(data.packages || [])
    } catch (e) {
      console.error('Failed to fetch packages', e)
    }
    setLoading(false)
  }

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-green-100 text-lifegreen hover:bg-green-100 mb-3">Save More</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Health Checkup Packages</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Comprehensive health packages curated by our doctors. Save up to 50% compared to individual tests.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
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
                  <Button
                    onClick={() => addToCart({ id: pkg.id, name: pkg.name, price: pkg.price, itemType: 'package' })}
                    disabled={isInCart(pkg.id)}
                    className={isInCart(pkg.id) ? 'bg-gray-100 text-gray-500 hover:bg-gray-100' : 'bg-lifegreen hover:bg-green-600 text-white shadow-md'}
                    size="sm"
                  >
                    {isInCart(pkg.id) ? 'In Cart' : 'Book Now'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
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
    { icon: FileText, title: 'Get Reports', desc: 'Receive NABL accredited reports in 6 hours', color: 'bg-purple-50 text-purple-500' },
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
  const { sessionId } = useCart()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleFile = async (file) => {
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

    setUploading(true)
    setFileName(file.name)
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          sessionId
        })
      })
      const data = await res.json()
      if (res.ok) {
        setUploaded(true)
        toast.success('Prescription uploaded successfully!')
      }
    } catch (e) {
      toast.error('Upload failed. Please try again.')
    }
    setUploading(false)
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
                {uploading ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 border-4 border-clinical border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 font-medium">Uploading {fileName}...</p>
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
    { icon: Award, title: 'NABL Accredited', desc: 'Highest quality standards certified by National Accreditation Board for Testing and Calibration Laboratories.', color: 'bg-yellow-50 text-yellow-600' },
    { icon: Clock, title: 'Reports in 6 Hours', desc: 'Fast turnaround time with real-time tracking. Most reports delivered within 6 hours of sample collection.', color: 'bg-red-50 text-clinical' },
    { icon: Stethoscope, title: 'Doctor Supervised', desc: 'Every report is verified and signed by qualified pathologists under Dr. Lalchandani\'s supervision.', color: 'bg-red-50 text-red-500' },
    { icon: Truck, title: 'Free Home Collection', desc: 'Trained phlebotomists come to your doorstep. Free collection across all Delhi NCR locations.', color: 'bg-green-50 text-lifegreen' },
    { icon: Shield, title: 'Data Privacy (DPDP)', desc: 'Your health data is protected under DPDP Act 2023 with strict consent-based data processing.', color: 'bg-purple-50 text-purple-500' },
    { icon: Users, title: '40 Years of Trust', desc: 'Serving 5 lakh+ patients since 1986. A legacy of accuracy, reliability, and patient care.', color: 'bg-orange-50 text-orange-500' },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-clinical/10 text-clinical hover:bg-clinical/10 mb-3">Why Choose Us</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">The Dr. Lalchandani Labs Difference</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Why 5 lakh+ patients trust us with their health diagnostics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <Card key={i} className="border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feat.title}</h3>
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
    { name: 'Greater Kailash-1', address: 'M-12, GK-1 Main Market, New Delhi', timings: '7 AM - 9 PM' },
    { name: 'Punjabi Bagh', address: 'Ring Road, Near Metro Station, New Delhi', timings: '7 AM - 8 PM' },
    { name: 'Lajpat Nagar', address: 'Central Market, Lajpat Nagar II, New Delhi', timings: '7 AM - 9 PM' },
    { name: 'Saket', address: 'J Block, Saket, Near Select City Walk, New Delhi', timings: '8 AM - 8 PM' },
    { name: 'Dwarka', address: 'Sector 12, Near Dwarka Court, New Delhi', timings: '7 AM - 8 PM' },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-3">Our Centers</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Collection Centers in Delhi</h2>
          <p className="text-gray-500 mt-2">Visit any of our 5 NABL accredited centers across New Delhi</p>
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
          Get started with a free home sample collection. NABL accredited reports delivered in 6 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/918010689689?text=Hi%2C%20I%20want%20to%20book%20a%20test" target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-6 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-24 lg:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Dr Lalchandani Labs" className="h-12 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              NABL accredited diagnostic laboratory with 40+ years of clinical excellence. 
              Trusted by 5 lakh+ patients across New Delhi.
            </p>
            <div className="flex items-center gap-3">
              <Badge className="bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/30">NABL</Badge>
              <Badge className="bg-red-900/30 text-red-400 hover:bg-red-900/30">ISO 15189</Badge>
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
                <span>M-12, GK-1 Main Market,<br />New Delhi - 110048</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-clinical" /> Mon-Sat: 7 AM - 9 PM
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Dr. Lalchandani Labs. All rights reserved. | DPDP Act 2023 Compliant | DISHA Framework Ready
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

// ============ CART SHEET ============
function CartSheet() {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen, sessionId } = useCart()
  const [showBooking, setShowBooking] = useState(false)

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-clinical" />
              Your Cart ({cart.length} items)
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="font-bold text-gray-900 text-lg">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-1">Add tests or packages to get started</p>
              <Button
                className="mt-4 bg-clinical hover:bg-clinical-dark"
                onClick={() => {
                  setIsCartOpen(false)
                  document.getElementById('tests')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Browse Tests
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.itemType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">&#8377;{item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">&#8377;{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Home Collection</span>
                  <span className="text-lifegreen font-semibold">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-extrabold text-xl text-clinical">&#8377;{cartTotal}</span>
                </div>
              </div>

              <Button
                className="w-full bg-lifegreen hover:bg-green-600 text-white py-6 text-base font-bold mt-4"
                onClick={() => { setIsCartOpen(false); setShowBooking(true) }}
              >
                Proceed to Book <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-[10px] text-center text-gray-400">
                Payment options: Pay Online or Pay at Home
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <BookingDialog open={showBooking} onOpenChange={setShowBooking} />
    </>
  )
}

// ============ BOOKING DIALOG ============
function BookingDialog({ open, onOpenChange }) {
  const { cart, cartTotal, sessionId, user, fetchCart } = useCart()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'male',
    mobile: user?.mobile || '',
    address: '',
    timeSlot: '',
    collectionType: 'home',
    paymentMethod: 'pay_at_home'
  })
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  const timeSlots = [
    '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'
  ]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sessionId,
          userId: user?.id,
          items: cart.map(i => ({ id: i.itemId, name: i.name, price: i.price, type: i.itemType })),
          totalAmount: cartTotal
        })
      })
      const data = await res.json()
      if (res.ok) {
        setBooking(data.booking)
        setStep(3)
        fetchCart(sessionId)
        toast.success('Booking confirmed!')
      }
    } catch (e) {
      toast.error('Booking failed. Please try again.')
    }
    setLoading(false)
  }

  const resetAndClose = () => {
    setStep(1)
    setBooking(null)
    setFormData({ patientName: '', patientAge: '', patientGender: 'male', mobile: '', address: '', timeSlot: '', collectionType: 'home', paymentMethod: 'pay_at_home' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-clinical" />
            {step === 3 ? 'Booking Confirmed!' : 'Complete Your Booking'}
          </DialogTitle>
          {step !== 3 && <DialogDescription>Step {step} of 2</DialogDescription>}
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Patient Name</label>
              <Input
                placeholder="Enter full name"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({...prev, patientName: e.target.value}))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Age</label>
                <Input
                  type="number"
                  placeholder="Age"
                  value={formData.patientAge}
                  onChange={(e) => setFormData(prev => ({...prev, patientAge: e.target.value}))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Gender</label>
                <div className="flex gap-2">
                  {['male', 'female', 'other'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData(prev => ({...prev, patientGender: g}))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium capitalize transition ${
                        formData.patientGender === g ? 'bg-clinical text-white border-clinical' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mobile Number</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r">+91</span>
                <Input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)}))}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <Button
              className="w-full bg-clinical hover:bg-clinical-dark py-5"
              onClick={() => setStep(2)}
              disabled={!formData.patientName || !formData.mobile || formData.mobile.length !== 10}
            >
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Collection Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'home', label: 'Home Collection', icon: Home }, { value: 'center', label: 'Visit Center', icon: MapPinned }].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFormData(prev => ({...prev, collectionType: opt.value}))}
                    className={`p-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition ${
                      formData.collectionType === opt.value ? 'bg-clinical text-white border-clinical' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" /> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.collectionType === 'home' && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Address</label>
                <Input
                  placeholder="Enter complete address with pincode"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Preferred Time Slot</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setFormData(prev => ({...prev, timeSlot: slot}))}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                      formData.timeSlot === slot ? 'bg-clinical text-white border-clinical' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'pay_at_home', label: 'Pay at Home', icon: CreditCard }, { value: 'online', label: 'Pay Online', icon: CreditCard }].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFormData(prev => ({...prev, paymentMethod: opt.value}))}
                    className={`p-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition ${
                      formData.paymentMethod === opt.value ? 'bg-clinical text-white border-clinical' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" /> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium">&#8377;{item.price}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-clinical">&#8377;{cartTotal}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                className="flex-1 bg-lifegreen hover:bg-green-600"
                onClick={handleSubmit}
                disabled={loading || !formData.timeSlot || (formData.collectionType === 'home' && !formData.address)}
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && booking && (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-lifegreen" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-500 text-sm mb-1">Booking ID: <strong>{booking.id?.slice(0, 8).toUpperCase()}</strong></p>
            <p className="text-gray-500 text-sm mb-6">
              Our phlebotomist will arrive at your selected time. You will receive a confirmation SMS shortly.
            </p>
            <Button onClick={resetAndClose} className="bg-clinical hover:bg-clinical-dark">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============ OTP DIALOG ============
function OTPDialog({ open, onOpenChange }) {
  const { login } = useCart()
  const [step, setStep] = useState(1)
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState('')

  const sendOTP = async () => {
    if (mobile.length !== 10) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      })
      const data = await res.json()
      if (res.ok) {
        setStep(2)
        setHint(data.hint || '')
        toast.success('OTP sent to your mobile')
      } else {
        toast.error(data.error || 'Failed to send OTP')
      }
    } catch (e) {
      toast.error('Failed to send OTP')
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      })
      const data = await res.json()
      if (res.ok) {
        login(data.user)
        toast.success('Login successful!')
        resetAndClose()
      } else {
        toast.error(data.error || 'Invalid OTP')
      }
    } catch (e) {
      toast.error('Verification failed')
    }
    setLoading(false)
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
              disabled={loading || mobile.length !== 10}
            >
              {loading ? 'Sending...' : 'Send OTP'}
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
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
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
      href="https://wa.me/918010689689?text=Hi%2C%20I%20want%20to%20book%20a%20test"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
      title="Chat on WhatsApp"
    >
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Chat on WhatsApp
      </span>
    </a>
  )
}

// ============ MOBILE STICKY BAR ============
function MobileStickyBar() {
  const { cart, setIsCartOpen } = useCart()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl px-4 py-2.5">
      <div className="flex gap-2">
        <a
          href="https://wa.me/918010689689?text=Hi%2C%20I%20want%20to%20book%20a%20home%20collection"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-white py-2.5 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: '#80C7C8' }}
        >
          <svg className="w-5 h-5 drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Home Collection
        </a>
        <button
          onClick={() => {
            if (cart.length > 0) {
              setIsCartOpen(true)
            } else {
              document.getElementById('tests')?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="flex-1 flex items-center justify-center gap-1.5 bg-clinical text-white py-2.5 rounded-xl font-semibold text-sm relative"
        >
          <ShoppingCart className="w-4 h-4" />
          {cart.length > 0 ? `Cart (${cart.length})` : 'Book Test'}
        </button>
        <a
          href="tel:8010689689"
          className="flex-1 flex items-center justify-center gap-1.5 text-white py-2.5 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: '#80C7C8' }}
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
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          <TrustBadges />
          <TestCatalog />
          <HealthPackages />
          <HowItWorks />
          <PrescriptionUpload />
          <WhyChooseUs />
          <LocationsSection />
          <CTASection />
        </main>
        <Footer />
        <CartSheet />
        <WhatsAppButton />
        <MobileStickyBar />
      </div>
    </CartProvider>
  )
}
