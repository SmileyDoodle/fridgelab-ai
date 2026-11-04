import { Footer, Header, MainContent } from './components/layout/index.ts'

export default function App() {
  return (
    <div className="min-h-screen bg-cream-100 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 text-stone-900 font-sans">
      <Header />
      <MainContent />
      <Footer />
    </div>
  )
}
