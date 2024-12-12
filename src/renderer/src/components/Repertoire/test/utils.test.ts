import { afterEach, describe, expect, it, vi } from 'vitest'
import { footswitch } from '../../../const'
import { TGig, TSong } from '../../../types'
import { fetchSongs, handleKeyDown, moveFocus } from '../utils'

const mockSongs: TSong[] = [
  {
    id: 1,
    title: 'Test Song',
    writtenBy: ['Test Writer'],
    pages: []
  },
  {
    id: 2,
    title: 'Test Song 2',
    writtenBy: ['Test Writer 2'],
    pages: []
  }
]

describe('fetchSongs', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should fetch songs', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockSongs)
    })

    const response = await fetchSongs()
    expect(response).toEqual(mockSongs)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/songs')
  })

  it('should return null if fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Fetch error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await fetchSongs()
    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching songs', expect.any(Error))
  })
})

describe('handleKeyDown', () => {
  const mockNavigate = vi.fn()
  const mockGig: TGig = {
    id: 'repertoire',
    venue: '',
    town: '',
    dateTime: new Date().toISOString(),
    setlist: [[]]
  }

  const mockButtonsRef = {
    current: Array(20).fill({
      focus: vi.fn(),
      click: vi.fn(),
      scrollIntoView: vi.fn()
    })
  }

  const mockEndOfListRef = {
    current: {
      scrollIntoView: vi.fn(),
      click: vi.fn(), // Add this line to define click
      align: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      accessKey: ''
      // Add other properties as needed to match HTMLDivElement
    } as unknown as HTMLDivElement
  }

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should handle centreShort key', () => {
    const event = { key: footswitch.CENTRE_SHORT }
    const mockButton = document.createElement('button')
    document.body.appendChild(mockButton)
    mockButton.focus()
    mockButtonsRef.current[0] = mockButton as unknown as HTMLButtonElement
    vi.spyOn(mockButtonsRef.current[0], 'click') // Mock the click function as a spy
    handleKeyDown(event, mockButtonsRef, mockSongs, mockEndOfListRef, mockGig, mockNavigate)
    expect(mockButtonsRef.current[0].click).toHaveBeenCalled()
  })

  it('should handle leftShort key', () => {
    const event = { key: footswitch.LEFT_SHORT }
    const mockButton1 = document.createElement('button')
    const mockButton2 = document.createElement('button')
    document.body.appendChild(mockButton1)
    document.body.appendChild(mockButton2)
    mockButton2.focus()
    mockButtonsRef.current[0] = mockButton1 as unknown as HTMLButtonElement
    mockButtonsRef.current[1] = mockButton2 as unknown as HTMLButtonElement
    vi.spyOn(mockButtonsRef.current[0], 'focus') // Mock the focus function as a spy
    vi.spyOn(mockButtonsRef.current[0], 'scrollIntoView') // Mock the scrollIntoView function as a spy
    handleKeyDown(event, mockButtonsRef, mockSongs, mockEndOfListRef, mockGig, mockNavigate)
    expect(mockButtonsRef.current[0].focus).toHaveBeenCalled()
    expect(mockButtonsRef.current[0].scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center'
    })
  })

  // Add more tests for other key events...
})

describe('moveFocus', () => {
  const mockButtonsRef = {
    current: Array(20).fill({
      focus: vi.fn(),
      scrollIntoView: vi.fn()
    })
  }

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should move focus to the next button', () => {
    vi.spyOn(mockButtonsRef.current[1], 'focus') // Mock the focus function as a spy
    vi.spyOn(mockButtonsRef.current[1], 'scrollIntoView') // Mock the scrollIntoView function as a spy
    moveFocus(mockButtonsRef, 0, 1)
    expect(mockButtonsRef.current[1].focus).toHaveBeenCalled()
    expect(mockButtonsRef.current[1].scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center'
    })
  })

  it('should move focus to the previous button', () => {
    vi.spyOn(mockButtonsRef.current[0], 'focus') // Mock the focus function as a spy
    vi.spyOn(mockButtonsRef.current[0], 'scrollIntoView') // Mock the scrollIntoView function as a spy
    moveFocus(mockButtonsRef, 1, -1)
    expect(mockButtonsRef.current[0].focus).toHaveBeenCalled()
    expect(mockButtonsRef.current[0].scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center'
    })
  })

  it('should not move focus if the target button does not exist', () => {
    vi.spyOn(mockButtonsRef.current[0], 'focus') // Mock the focus function as a spy
    vi.spyOn(mockButtonsRef.current[0], 'scrollIntoView') // Mock the scrollIntoView function as a spy
    moveFocus(mockButtonsRef, 0, -1)
    expect(mockButtonsRef.current[0].focus).not.toHaveBeenCalled()
    expect(mockButtonsRef.current[0].scrollIntoView).not.toHaveBeenCalled()
  })
})
