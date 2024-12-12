import PropTypes from 'prop-types'

type TProps = {
  currentPage: number
  title: string
  totalPages: number
  pageHasChords: boolean
}

const PageTitle: React.FC<TProps> = ({ currentPage, pageHasChords, title, totalPages }) => {
  return (
    <div
      className={`flex ${pageHasChords ? 'flex-start flex-col' : 'w-1/2 flex-row justify-between'} text-left  font-semibold text-bj-green-light`}
    >
      <p className="text-5xl">{title}</p>

      <p className="text-4xl">
        {currentPage}/{totalPages}
      </p>
    </div>
  )
}

PageTitle.propTypes = {
  currentPage: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageHasChords: PropTypes.bool.isRequired
}

export default PageTitle
