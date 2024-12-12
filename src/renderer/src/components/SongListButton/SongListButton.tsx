import { forwardRef } from 'react'

type TProps = {
  classes?: string
  title: string
  version?: string
  onclick?: () => void
}

const SongListButton = forwardRef<HTMLButtonElement, TProps>(
  ({ classes, title, version, onclick }, ref) => {
    return (
      <button
        ref={ref}
        className={`my-2 w-2/3 rounded-full border-none p-2 text-center  transition-colors duration-300 ease-in-out  focus:outline-none focus:ring-2 focus:ring-bj-green-dark focus:ring-offset-2 ${classes}`}
        onClick={onclick}
      >
        <h1 className="text-7xl focus:text-8xl focus:font-semibold">{title}</h1>
        {version ? <p className="text-2xl">{version}</p> : null}
      </button>
    )
  }
)

SongListButton.displayName = 'SongListButton'

export default SongListButton
