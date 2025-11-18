import { useEffect, useMemo, useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Spline from '@splinetool/react-spline'
import { Menu, Phone, Mail, MapPin, CalendarDays, Fish, Drumstick, Pizza, Images, ChevronRight } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useScrapedContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${BACKEND}/api/scrape`, { signal: controller.signal })
        if (!res.ok) throw new Error('Errore durante l\'import dei contenuti')
        const json = await res.json()
        setData(json)
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [])

  return { data, loading, error }
}

function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-semibold text-slate-800 tracking-tight">Ristorante Pizzeria Le Marinelle</a>
        <div className="hidden md:flex items-center gap-6 text-slate-700">
          <a href="#specialita" className="hover:text-slate-900">Specialità</a>
          <a href="#galleria" className="hover:text-slate-900">Galleria</a>
          <a href="#contatti" className="hover:text-slate-900">Contatti</a>
          <a href="tel:+393407040530" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
            <Phone size={18}/> Prenota
          </a>
        </div>
        <button className="md:hidden p-2 rounded border text-slate-700">
          <Menu/>
        </button>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 drop-shadow-sm">Ristorante Pizzeria Le Marinelle</h1>
        <p className="mt-3 text-slate-700 max-w-3xl">Accogliente e professionale, con veranda e giardino. Pesce fresco, carne selezionata e pizze a lunga lievitazione cotte in forno a legna.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="tel:+393407040530" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-700">
            <Phone size={18}/> Prenota ora
          </a>
          <a href="#menu" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50">
            Guarda il menù <ChevronRight size={18}/>
          </a>
        </div>
      </div>
    </section>
  )
}

function Presentazione({ data }) {
  const subtitle = data?.description || 'Cucina di mare e di terra con ingredienti di qualità e ospitalità familiare.'
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Benvenuti</h2>
        <p className="mt-4 text-slate-700 leading-relaxed">{subtitle}</p>
        <ul className="mt-6 space-y-2 text-slate-700">
          <li>• Pesce fresco</li>
          <li>• Carne selezionata</li>
          <li>• Pizze al forno a legna a lunga lievitazione</li>
          <li>• Friggitoria</li>
          <li>• Buffet ed eventi</li>
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data?.images?.slice(0,4)?.map((src, i) => (
          <img key={i} src={src} loading="lazy" className="h-44 w-full object-cover rounded-lg" alt="Galleria" />
        ))}
      </div>
    </section>
  )
}

function Specialita() {
  const items = [
    { icon: <Fish/>, title: 'Pesce Fresco', desc: 'Selezione quotidiana dal mare Adriatico.' },
    { icon: <Drumstick/>, title: 'Carne', desc: 'Tagli scelti e cotture perfette.' },
    { icon: <Pizza/>, title: 'Pizze', desc: 'Lievitazione lunga e forno a legna.' },
  ]
  return (
    <section id="specialita" className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Le nostre specialità</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border hover:shadow-md transition-shadow">
              <div className="text-emerald-600">{it.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{it.title}</h3>
              <p className="text-slate-700 text-sm mt-1">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Galleria({ data }) {
  const images = data?.images?.slice(0, 12) || []
  return (
    <section id="galleria" className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2">
        <Images className="text-slate-700"/>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Galleria</h2>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((src, idx) => (
          <img key={idx} src={src} loading="lazy" className="aspect-square w-full object-cover rounded-lg" alt="Galleria" />
        ))}
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-14">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-white text-2xl font-semibold">Prenota un tavolo</h3>
          <p className="text-emerald-100">Chiama ora e vivi un'esperienza autentica a Termoli.</p>
        </div>
        <a href="tel:+393407040530" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-md hover:bg-emerald-50">
          <Phone size={18}/> +39 340 704 0530
        </a>
      </div>
    </section>
  )
}

function Contatti() {
  return (
    <section id="contatti" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Contatti e mappa</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-3 text-slate-700">
          <p className="flex items-center gap-2"><Phone size={18}/> +39 340 704 0530</p>
          <p className="flex items-center gap-2"><Mail size={18}/> info@ristorantepizzerialemarinelle.it</p>
          <p className="flex items-center gap-2"><MapPin size={18}/> Via Marinelle 1, Termoli (CB)</p>
          <p className="flex items-center gap-2"><CalendarDays size={18}/> Aperto a pranzo e cena</p>
        </div>
        <iframe
          title="Mappa"
          loading="lazy"
          className="w-full h-64 rounded-lg border"
          src="https://www.google.com/maps?q=Via%20Marinelle%201%2C%20Termoli%20(CB)&output=embed"
        />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p>© {new Date().getFullYear()} Ristorante Pizzeria Le Marinelle</p>
        <div className="flex items-center gap-4">
          <a href="tel:+393407040530" className="hover:text-slate-900">Telefono</a>
          <a href="mailto:info@ristorantepizzerialemarinelle.it" className="hover:text-slate-900">Email</a>
          <a href="#contatti" className="hover:text-slate-900">Dove siamo</a>
        </div>
      </div>
    </footer>
  )
}

function HomePage() {
  const { data, loading, error } = useScrapedContent()

  return (
    <div className="bg-white text-slate-900">
      <Navbar />
      <Hero />

      <main>
        {loading && (
          <div className="max-w-6xl mx-auto px-6 py-16 text-slate-600">Caricamento contenuti…</div>
        )}
        {error && (
          <div className="max-w-6xl mx-auto px-6 py-16 text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <>
            <Presentazione data={data} />
            <Specialita />
            <Galleria data={data} />
            <CTA />
            <Contatti />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return <HomePage />
}
