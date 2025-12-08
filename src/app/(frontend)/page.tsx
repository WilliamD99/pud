import Hero from '@/components/frontend/Hero'
import AboutUs from '@/components/frontend/About'
import FAQ from '@/components/frontend/FAQ'

export default function HomePage() {
  return (
    <div className="home bg-black">
      <Hero />
      <AboutUs />
      <FAQ />
      <div className="content flex justify-center items-center">{/* <TestComponent /> */}</div>
    </div>
  )
}
