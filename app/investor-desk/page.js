'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, ChevronRight, ArrowLeft, Phone, MapPin, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function InvestorDeskPage() {
  const [activeTab, setActiveTab] = useState('Announcements')

  const categories = {
    'Announcements': [
      { name: 'Voting Results AGM 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/1.Announcements/1.%20Voting%20Results%20AGM%202025.pdf' },
      { name: 'Proceedings AGM 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/1.Announcements/2.%20Proceedings%20AGM%202025.pdf' },
      { name: 'Book Closure AGM 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/1.Announcements/3%20Book%20Closure%20AGM%202025.pdf' },
      { name: 'Outcome BM 05.09.2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/1.Announcements/4.%20Outcome%20BM%2005.09.2025.pdf' },
      { name: 'Audited Results March 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/1.Announcements/5.%20Audited%20Results%20March%202025.pdf' },
      { name: 'Appointment of CS Saniya Hussain', url: 'https://lalchandanipathlab.com/assets/website/pdf/1.Announcements/6.%20Appointment%20of%20CS_Saniya%20Hussain.pdf' },
    ],
    'Financial Results': [
      { name: 'Unaudited Results Sep 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/4.Financial%20Results/Unaudited%20Results%20September%202025.pdf' },
      { name: 'Audited Results March 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/4.Financial%20Results/1.%20Audited%20Results%20March%202025.pdf' },
      { name: 'Unaudited Results 30.09.2024', url: 'https://lalchandanipathlab.com/assets/website/pdf/4.Financial%20Results/2.%20Unaudited%20Results_30.09.2024.pdf' },
      { name: 'Audited Results March 2024', url: 'https://lalchandanipathlab.com/assets/website/pdf/4.Financial%20Results/3.%20Audited%20Results%20March%202024.pdf' },
      { name: 'Unaudited Results 30.09.2023', url: 'https://lalchandanipathlab.com/assets/website/pdf/4.Financial%20Results/4.%20Unaudited%20Results%2030.09.2023.pdf' },
      { name: 'Audited Results March 2023', url: 'https://lalchandanipathlab.com/assets/website/pdf/4.Financial%20Results/5.%20Audited%20Results%20March%202023.pdf' },
    ],
    'Annual Reports': [
      { name: 'Annual Report 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/6.Notice%20and%20Annual%20Reports/16.%20Annual%20Report%202025.pdf' },
      { name: 'Annual Report 2024', url: 'https://lalchandanipathlab.com/assets/website/pdf/6.Notice%20and%20Annual%20Reports/14.%20Annual%20Report%202024.pdf' },
      { name: 'Notice 2024', url: 'https://lalchandanipathlab.com/assets/website/pdf/6.Notice%20and%20Annual%20Reports/13.Notice%202024.pdf' },
      { name: 'Annual Report 2023', url: 'https://lalchandanipathlab.com/assets/website/pdf/6.Notice%20and%20Annual%20Reports/12.%20Annual%20Report%202023.pdf' },
      { name: 'Annual Report 2022', url: 'https://lalchandanipathlab.com/assets/website/pdf/6.Notice%20and%20Annual%20Reports/10.%20Annual%20Report%202022.pdf' },
      { name: 'Annual Report 2021', url: 'https://lalchandanipathlab.com/assets/website/pdf/6.Notice%20and%20Annual%20Reports/8.%20Annual%20Report%202021.pdf' },
    ],
    'Corporate Governance': [
      { name: 'CG Non Applicability Dec 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/CG%20NON%20Applicability%20december%202025.pdf' },
      { name: 'CG Non Applicability Sep 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/3.Corporate%20Governance/10.CG%20Non-applicability%20Sep%202025.pdf' },
      { name: 'CG Non Applicability June 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/3.Corporate%20Governance/9.CG%20Non-applicability%20June%202025.pdf' },
      { name: 'CG Non Applicability March 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/3.Corporate%20Governance/8.CG%20Non-applicability%20March%202025.pdf' },
    ],
    'Shareholding': [
      { name: 'Shareholding Pattern Sep 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/10.Shareholding%20pattern/SHP/September%202025.pdf' },
      { name: 'Shareholding Pattern March 2025', url: 'https://lalchandanipathlab.com/assets/website/pdf/10.Shareholding%20pattern/SHP/March%202025.pdf' },
      { name: 'Shareholding Pattern Sep 2024', url: 'https://lalchandanipathlab.com/assets/website/pdf/10.Shareholding%20pattern/SHP/September%202024.pdf' },
      { name: 'Shareholding Pattern March 2024', url: 'https://lalchandanipathlab.com/assets/website/pdf/10.Shareholding%20pattern/SHP/March%202024.pdf' },
    ],
    'Policies': [
      { name: 'Familarization Policy', url: 'https://lalchandanipathlab.com/assets/website/pdf/policies/familarization-policy.pdf' },
      { name: 'DDP', url: 'https://lalchandanipathlab.com/assets/website/pdf/policies/DDP.pdf' },
      { name: 'RPT Policy', url: 'https://lalchandanipathlab.com/assets/website/pdf/policies/RPT%20policy.pdf' },
      { name: 'Vigil Mechanism Policy', url: 'https://lalchandanipathlab.com/assets/website/pdf/policies/Vigil%20Mechanism%20Policy.pdf' },
      { name: 'Code of Conduct', url: 'https://lalchandanipathlab.com/assets/website/pdf/policies/Code_of_Conduct_for_Directors_&_Senior_Management.pdf' },
      { name: 'Materiality Policy', url: 'https://lalchandanipathlab.com/assets/website/pdf/policies/Materiality%20Policy.pdf' },
    ],
  }

  const tabs = Object.keys(categories)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="bg-clinical text-white text-sm py-1.5">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <span className="font-medium">Dr Lalchandani Labs &bull; BSE-SME Listed Diagnostic Company</span>
            <span className="text-red-200 text-xs hidden sm:inline">40 Years of Trust &bull; CGHS Empanelled</span>
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
      <main className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-clinical/10 text-clinical hover:bg-clinical/10 mb-3">BSE-SME Listed</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Investor Desk</h1>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Access financial reports, announcements, and corporate governance documents</p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-clinical text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories[activeTab]?.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-clinical/30 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-clinical group-hover:text-white transition">
                  <FileText className="w-5 h-5 text-clinical group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-clinical transition">{doc.name}</p>
                  <p className="text-[10px] text-gray-400">PDF Document</p>
                </div>
                <Download className="w-4 h-4 text-gray-300 group-hover:text-clinical transition shrink-0" />
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://lalchandanipathlab.com/investordesk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-clinical font-semibold text-sm hover:underline"
            >
              View All Documents on Official Investor Desk <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Dr Lalchandani Labs. All rights reserved.
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
