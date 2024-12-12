import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screensaver } from '../../components/index'
import { ACTIVEKEYS, BREAK } from '../../const'
import { GigContext } from '../../context/index'
import { TSong } from '../../types'
import LyricPage from './LyricPage'
import TitlePage from './TitlePage'
import { ManageInteraction } from './interaction'
import { fetchSong } from './utils'

const Song: React.FC = () => {
  const Navigate = useNavigate()
  const { setlist } = useContext(GigContext) ?? { setlist: [] }
  const { id } = useParams()
  const [setlistIndex, setSetlistIndex] = useState<number>(parseInt(id!))
  const [song, setSong] = useState<TSong>()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [timerIsHalted, setTimerIsHalted] = useState<boolean>(false)
  const duration = song?.pages[currentPage - 1]?.duration || 0

  useEffect(() => {
    const newIndex = parseInt(id!)
    setSetlistIndex(newIndex)
  }, [id])

  useEffect(() => {
    const searchIndex = setlist[setlistIndex]

    const getAndSaveSong = async (): Promise<void> => {
      if (searchIndex !== BREAK && (!song || song.id != searchIndex)) {
        const fetchedSong = await fetchSong(searchIndex)
        if (!fetchedSong) {
          console.error('No song found')
          return
        }

        setSong(fetchedSong)
      }
    }
    getAndSaveSong()
  }, [setlistIndex, setlist, song])

  useEffect(() => {
    const handleFootswitchInput = (event: KeyboardEvent): void => {
      if (ACTIVEKEYS.includes(event.key)) {
        ManageInteraction({
          showingScreensaver: setlist[setlistIndex] === BREAK,
          footswitchInput: event.key,
          currentSong: setlistIndex,
          totalSongs: setlist.length,
          currentPage,
          setCurrentPage,
          hasTimer: !!duration && !!song?.pages.length && currentPage < song.pages.length,
          timerHalted: timerIsHalted,
          setTimerHalted: setTimerIsHalted,
          songPages: song?.pages.length || 0,
          Navigate
        })
      }
    }

    document.addEventListener('keydown', handleFootswitchInput)

    return (): void => {
      document.removeEventListener('keydown', handleFootswitchInput)
    }
  }, [setlistIndex, setlist, currentPage, duration, timerIsHalted, song, Navigate])

  if (setlist[setlistIndex] === BREAK)
    return <Screensaver isStart={!setlistIndex} isLastSong={setlistIndex === setlist.length - 1} />

  if (!song) {
    return (
      <>
        <h1>No song found!</h1>
        <p>setlist[setlistIndex]: {setlist[setlistIndex]}</p>
      </>
    )
  }
  return (
    <div className="w-full overflow-x-hidden">
      {song && !currentPage ? (
        <TitlePage
          title={song.title}
          scale={song.scale ?? undefined}
          setup={song.setup ?? undefined}
          tempo={song.tempo ?? undefined}
          notes={song.notes ?? undefined}
          timeSignature={song.timeSignature ?? undefined}
          isLastSong={setlistIndex === setlist.length - 1}
        />
      ) : null}
      {song && currentPage ? (
        <LyricPage
          song={song}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          timerHalted={timerIsHalted}
        />
      ) : null}
    </div>
  )
}

export default Song
