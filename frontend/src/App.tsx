import Depth from './components/Depth'
import MakeOrder from './components/MakeOrder'
import Quote from './components/Quote'
import UserComponent from './components/User'

function App() {
  return (
    <main className="min-h-screen mx-auto max-w-screen-xl">
      <p className='text-3xl font-black text-center pt-5'>TANAV STOCK EXCHANGE</p>
      <Quote />
      <div className="flex items-start justify-center gap-4">
      <Depth />
      <div>
      <MakeOrder/>
      <UserComponent />
      </div>
      </div>
    </main>
  )
}

export default App
