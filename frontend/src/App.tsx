import Depth2 from './components/Depth2'
import MakeOrder from './components/MakeOrder'
import Quote from './components/Quote'
import UserComponent from './components/User'

function App() {
  return (
    <main className="min-h-screen mx-auto max-w-screen-xl">
      <p className='text-3xl font-black text-center pt-5'>TANAV STOCK EXCHANGE</p>
      <Quote />
      <Depth2 />
      <MakeOrder/>
      <UserComponent />
    </main>
  )
}

export default App
