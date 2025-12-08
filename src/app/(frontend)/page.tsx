import Hero from '@/components/frontend/Hero'
import AboutUs from '@/components/frontend/About'

export default function HomePage() {
  return (
    <div className="home bg-black">
      <Hero />
      <AboutUs />
      <div className="content flex justify-center items-center">{/* <TestComponent /> */}</div>
    </div>
  )
}
