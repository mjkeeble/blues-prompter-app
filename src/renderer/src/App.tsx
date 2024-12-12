// import Versions from './components/Versions'
import { Route, Routes } from 'react-router-dom'
import { Gigs, Repertoire, Setlist, Song } from './components'
import { ConfigProvider, GigProvider } from './context'

function App(): JSX.Element {
  return (
    <>
      return (
      <div id="App" className="cursor-none overflow-y-hidden text-bj-white">
        <ConfigProvider>
          <GigProvider>
            <Routes>
              <Route path="/" element={<Gigs />} />
              <Route path="song/:id" element={<Song />} />
              <Route path="setlist/" element={<Setlist />} />
              {/* <Route path="setlist/:id" element={<Setlist />} /> */}
              <Route path="repertoire/" element={<Repertoire />} />
            </Routes>
          </GigProvider>
        </ConfigProvider>
      </div>
      );
    </>
  )
}

export default App
