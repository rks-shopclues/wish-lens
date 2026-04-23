'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Search, Clock, FlaskConical, ArrowLeft, Phone,
  Microscope, Activity, ChevronRight, Droplets
} from 'lucide-react'
import Link from 'next/link'

const WHATSAPP_NUMBER = '917669989614'

const getWhatsAppUrl = (itemName) => {
  const message = encodeURIComponent(`Hi, I'd like to book ${itemName}`)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const pathologyTests = [
  { code: "DL12524", name: "ANTI CCP", mrp: 1500, tat: "Next Working Day", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11149", name: "Anti HCV", mrp: 800, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12569", name: "Anti Mullerian Hormone (AMH)", mrp: 1850, tat: "Next Working Day", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12473", name: "Anti Nuclear Antibody (ANA/ANF)", mrp: 700, tat: "Next Working Day", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11423", name: "Anti TPO Antibody", mrp: 1000, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11187", name: "Antibody to HIV I & II", mrp: 500, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11414", name: "Beta-HCG (BHCG)", mrp: 800, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11112", name: "Blood Urea", mrp: 160, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11115", name: "Blood Glucose Fasting", mrp: 80, tat: "4-6 Hours", specimen: "3ml Whole Blood in Sodium Citrate Tube" },
  { code: "DL11074", name: "BUN", mrp: 160, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11415", name: "CA 125", mrp: 1200, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11413", name: "Carcino Embryonic Antigen (CEA)", mrp: 900, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11382", name: "Complete Blood Count (CBC)", mrp: 400, tat: "4-6 Hours", specimen: "3ml Whole Blood in EDTA" },
  { code: "DL12580", name: "Cortisol (Morning)", mrp: 400, tat: "Next Working Day", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11189", name: "CRP - Reactive Protein Quantitative", mrp: 400, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11183", name: "Dengue NS1 Antigen", mrp: 1200, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12563", name: "Double Marker Test", mrp: 2500, tat: "2 Work Days", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11431", name: "Estradiol (E2)", mrp: 650, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11421", name: "Ferritin", mrp: 600, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11420", name: "Folic Acid", mrp: 800, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11433", name: "FSH", mrp: 500, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12608", name: "Hb Electrophoresis", mrp: 800, tat: "Next Working Day", specimen: "3ml Whole Blood in EDTA" },
  { code: "DL11179", name: "HBsAg", mrp: 400, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11106", name: "HDL Cholesterol", mrp: 250, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12533", name: "HsCRP", mrp: 600, tat: "Next Working Day", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11118", name: "Kidney Function Test (KFT)", mrp: 700, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11434", name: "LH", mrp: 500, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11120", name: "Lipid Profile", mrp: 800, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11117", name: "Liver Function Test (LFT)", mrp: 700, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11438", name: "Parathyroid Hormone (PTH)", mrp: 1200, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11430", name: "Progesterone", mrp: 500, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11432", name: "Prolactin", mrp: 500, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12494", name: "QuantiFERON-TB Gold", mrp: 3000, tat: "2 Work Days", specimen: "3ml Whole Blood in Lithium Heparin Tube" },
  { code: "DL11192", name: "R.A. Factor (Quantitative)", mrp: 400, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11108", name: "Serum Cholesterol", mrp: 200, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11111", name: "Serum Creatinine", mrp: 160, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11076", name: "Serum Iron", mrp: 250, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11080", name: "Serum Magnesium", mrp: 400, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11102", name: "Serum Total Bilirubin", mrp: 200, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11110", name: "Serum Uric Acid", mrp: 160, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11436", name: "Serum Insulin (Fasting)", mrp: 700, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11107", name: "Serum Triglycerides", mrp: 250, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11070", name: "Serum Zinc", mrp: 1500, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11099", name: "SGOT/AST", mrp: 200, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11098", name: "SGPT/ALT", mrp: 200, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11437", name: "Testosterone Total", mrp: 600, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11439", name: "Thyroid Function Test (T3, T4, TSH)", mrp: 650, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12437", name: "Total IgE", mrp: 600, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11416", name: "Total PSA", mrp: 600, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11409", name: "TSH (Ultrasensitive)", mrp: 350, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL12570", name: "tTG Antibody (IgA)", mrp: 1500, tat: "Next Working Day", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11175", name: "Typhi Dot (IgG & IgM)", mrp: 450, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11313", name: "Urine Culture & Sensitivity", mrp: 500, tat: "3 Work Days", specimen: "10ml morning urine in sterile container" },
  { code: "DL11155", name: "Urine Examination R/M", mrp: 100, tat: "4-6 Hours", specimen: "10ml morning urine in sterile container" },
  { code: "DL11422", name: "Vitamin B12", mrp: 800, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
  { code: "DL11419", name: "Vitamin D3 25-OH", mrp: 1500, tat: "4-6 Hours", specimen: "3ml Serum in Plain/Gel Tube" },
]

const scanTests = [
  { code: "DL12839", name: "X-ray Chest P.A", mrp: 400, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12810", name: "Ultrasound Whole Abdomen", mrp: 1800, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12809", name: "Ultrasound KUB", mrp: 800, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12802", name: "Penile Art Color Doppler", mrp: 4000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12798", name: "TVS (Trans Vaginal Scan)", mrp: 2000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12797", name: "2D Echocardiography", mrp: 3000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12796", name: "TMT (Treadmill Test)", mrp: 2000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12790", name: "EEG", mrp: 2500, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12789", name: "ECG (Electrocardiography)", mrp: 300, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12779", name: "Ovulation Studies", mrp: 2500, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12774", name: "Uroflowmetry", mrp: 1000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12770", name: "Ultrasound Early Pregnancy", mrp: 2000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12767", name: "Stress Echo", mrp: 4500, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12751", name: "Arterial & Venous Doppler", mrp: 4000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12665", name: "Ultrasound with PVR", mrp: 2000, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12651", name: "Male Ultrasound Whole Abdomen", mrp: 1800, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12648", name: "TVS (Trans Vaginal Scan)", mrp: 1800, tat: "4-6 Hours", specimen: "NA" },
  { code: "DL12647", name: "4D Ultrasound Level 2", mrp: 3000, tat: "4-6 Hours", specimen: "NA" },
]

export default function AllTestsPage() {
  const [activeTab, setActiveTab] = useState('pathology')
  const [search, setSearch] = useState('')

  const currentTests = activeTab === 'pathology' ? pathologyTests : scanTests

  const filteredTests = currentTests.filter(test =>
    !search || test.name.toLowerCase().includes(search.toLowerCase()) || test.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="bg-clinical text-white text-sm py-1.5">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <span className="font-medium">Dr Lalchandani Labs &bull; NABL Accredited &bull; CGHS Empanelled</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I want to book a test")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-green-200 transition"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" /> Book on WhatsApp
            </a>
          </div>
        </div>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Dr Lalchandani Labs" className="h-12 w-auto" />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-clinical transition px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-red-100 text-clinical hover:bg-red-100 mb-3">Complete Test Catalog</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">All Diagnostic Tests</h1>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Browse our complete range of NABL accredited diagnostic tests and imaging services</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => { setActiveTab('pathology'); setSearch('') }}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'pathology'
                  ? 'bg-clinical text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Pathology ({pathologyTests.length} tests)
            </button>
            <button
              onClick={() => { setActiveTab('scans'); setSearch('') }}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'scans'
                  ? 'bg-clinical text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              <Activity className="w-4 h-4" />
              Scans & Imaging ({scanTests.length} tests)
            </button>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab === 'pathology' ? 'pathology tests' : 'scans & imaging'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          {/* Tests Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test, i) => (
              <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-gray-100 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeTab === 'pathology' ? 'bg-red-50 text-clinical' : 'bg-purple-50 text-purple-600'}`}>
                      {activeTab === 'pathology' ? <Droplets className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    </div>
                    <Badge variant="outline" className="text-[10px] text-gray-400">{test.code}</Badge>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-clinical transition">{test.name}</h3>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-clinical" />
                      <span>TAT: <strong>{test.tat}</strong></span>
                    </div>
                    {test.specimen !== "NA" && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FlaskConical className="w-3.5 h-3.5 text-gray-400" />
                        <span className="line-clamp-1">{test.specimen}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="mb-3" />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-gray-900">&#8377;{test.mrp}</span>
                    <a
                      href={getWhatsAppUrl(test.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" /> Book Now
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tests found matching your search.</p>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-12 bg-white rounded-2xl p-8 border">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Can&apos;t find what you&apos;re looking for?</h3>
            <p className="text-gray-500 text-sm mb-4">We offer 500+ diagnostic tests. Chat with us on WhatsApp for any test not listed here.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm looking for a specific test. Can you help?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-3 font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Dr Lalchandani Labs. All rights reserved. NABL Accredited &bull; CGHS Empanelled
            </p>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
              &larr; Back to Main Website
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
