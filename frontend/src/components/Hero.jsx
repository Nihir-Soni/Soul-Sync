import React from 'react'
import { useNavigate } from 'react-router';

const Hero = () => {
    const navigate=useNavigate();
     const handleOpenDiary = () => {
    if (localStorage.getItem("authToken")) {
      navigate("/diary");
    } else {
      navigate("/login"); // or show login popup
    }
  };
    return (
        <section className='absolute left-[140px] top-[170px]'>
            <div className="text-white max-w-2xl px-6 py-10 bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg animate-fadeIn">
            <h1 className='text-4xl mb-4'>
                Sync your thoughts....
            </h1>
                <h2 className="text-xl font-bold leading-tight mb-1 drop-shadow-lg">
                    Some days you just need a quiet page.
                </h2>

                <h2 className="text-xl font-semibold mb-3 drop-shadow-lg">
                    Other days, you need someone to listen.
                </h2>

                <p className="text-lg leading-relaxed text-white/90">
                    Write privately — or talk to your AI companion<br />
                    who understands, remembers, and supports your journey.
                </p>
               


                <button className="mt-6 px-6 py-3 bg-white/90 text-black rounded-xl cursor-pointer font-semibold hover:bg-white transition shadow-lg hover:shadow-xl"
                onClick={handleOpenDiary}
                >
                    Open Your Diary
                </button>
            </div>

        </section>
    )
}

export default Hero
