import { useContext } from 'react'
import { ConfigContext } from '../../context/'
import { TSong } from '../../types'
import Chords from './Chords'
import Lyrics from './Lyrics'
import ProgressBar from './ProgressBar'
import PageTitle from './SectionTitle'
import { fetchScreenSplit } from './utils'

type TProps = {
  song: TSong
  currentPage: number
  setCurrentPage: (page: number) => void
  timerHalted: boolean
}

import PropTypes from 'prop-types'

const LyricPage: React.FC<TProps> = ({ song, currentPage, setCurrentPage, timerHalted }) => {
  const config = useContext(ConfigContext)
  const currentPageData = song.pages[currentPage - 1]

  if (!currentPageData) {
    return <div>Error: Page data not found</div>
  }

  const pageHasProgressBar: boolean =
    !!currentPageData && !!song.tempo && !!song.timeSignature && !!currentPageData.duration
  const pageHasChords: boolean = !!currentPageData.chords.length
  const lyricBoxHeight = pageHasProgressBar ? '100vh - 84px' : '100vh - 60px'

  const screenSplit = fetchScreenSplit(
    song.configChordPaneSize || config?.chordPaneSize,
    pageHasChords
  )

  return (
    <div className="flex h-screen flex-col overflow-y-hidden">
      {pageHasProgressBar ? (
        <ProgressBar
          tempo={song.tempo!}
          timeSignature={song.timeSignature!}
          timerHalted={timerHalted}
          duration={currentPageData.duration || undefined}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          finalPage={song.pages.length === currentPage}
        />
      ) : null}
      {pageHasChords ? null : (
        <PageTitle
          currentPage={currentPage}
          title={currentPageData.section}
          totalPages={song.pages.length}
          pageHasChords={pageHasChords}
        />
      )}

      <div className="grid flex-1 grid-cols-10 divide-x overflow-y-auto">
        <div className={`col-span-${screenSplit} p-4`}>
          {pageHasChords ? (
            <PageTitle
              currentPage={currentPage}
              title={currentPageData.section}
              totalPages={song.pages.length}
              pageHasChords={pageHasChords}
            />
          ) : null}
          <Chords
            chords={currentPageData.chords}
            isLastPage={currentPage === song.pages.length}
            timerHalted={timerHalted}
            hasTimer={!!currentPageData.duration}
          />
        </div>
        <div
          className={`col-span-${10 - screenSplit} overflow-y-clip px-4`}
          style={{ height: `calc(${lyricBoxHeight})` }}
        >
          <Lyrics lyrics={currentPageData.lyrics} />
        </div>
      </div>
    </div>
  )
}

LyricPage.propTypes = {
  song: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    version: PropTypes.string,
    writtenBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    gemaWerknummer: PropTypes.string,
    lineup: PropTypes.string,
    scale: PropTypes.string,
    tempo: PropTypes.number,
    timeSignature: PropTypes.string,
    configChordPaneSize: PropTypes.number,
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        chords: PropTypes.arrayOf(PropTypes.string),
        duration: PropTypes.number,
        section: PropTypes.string,
        lyrics: PropTypes.string
      })
    ).isRequired,
    notes: PropTypes.string
  }).isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  timerHalted: PropTypes.bool.isRequired
}

export default LyricPage
