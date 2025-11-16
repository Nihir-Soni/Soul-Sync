
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import bgimg from '../assets/book1.jpg';

const LandingPage = () => {
  return (
    <div className='relative min-h-screen w-full bg-cover bg-no-repeat bg-center overflow-hidden font-sans' style={{backgroundImage:`url(${bgimg})`}}>
      <NavBar/>
      <Hero/>
    </div>
  )
}

export default LandingPage
