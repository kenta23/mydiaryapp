import confetti from '../assets/confetti.png'
import welcome from '../assets/welcome pic.png'


const Welcome = () => {
  return (
    <div className='h-screen w-full font-kaisei flex items-center justify-center '>
          <div className='flex flex-col items-center gap-8 relative'>
            <img src={welcome} className='select-none' alt="" />
            <h1 className='text-[#AB6321] text-[48px]'>Welcome <span>user!</span></h1>
          </div>

          <img className='absolute top-0 left-[68px] rotate-12' src={confetti} alt="confetti" />
    </div>
  )
}

export default Welcome