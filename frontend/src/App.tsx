import Depth from './components/Depth'
import Quote from './components/Quote'
import UserComponent from './components/User'

function App() {
  return (
    <main>
      <p className='text-2xl font-black text-center pt-5'>GOOGLE STOCK</p>
      <Depth />
      <Quote />
      <UserComponent />
    </main>
  )
}

export default App
