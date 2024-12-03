import Depth from './components/Depth'
import MakeOrder from './components/MakeOrder'
import Quote from './components/Quote'
import UserComponent from './components/User'
import { Toaster } from 'sonner'

function App() {
  return (
    <main className="min-h-screen mx-auto max-w-screen-xl">
      <p className='text-3xl font-black text-center pt-5'>TANAV STOCK EXCHANGE</p>
      <Quote />
      <div className="flex items-start justify-center border-t">
      <Depth />
      <div>
      <MakeOrder/>
      <UserComponent />
      </div>
      </div>
      <Toaster />
    </main>
  )
}

export default App
