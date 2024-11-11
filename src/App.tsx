import { Bubble } from '@typebot.io/react'
import Select from './components/select'

function App() {
  return (
    <>
      <div className="bg-[#f7f8ff]">
        <Select url="https://legacy-api.maiscontroleerp.com.br/maiscontrole/services/participants/infinite-search" />
      </div>

      <Bubble
        typebot="busca-din-mica-22xpzg5"
        theme={{ button: { backgroundColor: '#0042DA' } }}
      />
    </>
  )
}

export default App
