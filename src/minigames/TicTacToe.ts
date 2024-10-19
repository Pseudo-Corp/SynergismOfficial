export type Turn = 'X' | 'O' | null

export type Difficulty = 'easy' | 'normal' | 'impossible'

export class TicTacToe {
  #turns = 0
  #difficulty: Difficulty

  board: Turn[] = Array<null>(9).fill(null)
  turn: Turn = 'X'

  constructor (difficulty: Difficulty) {
    this.#difficulty = difficulty
  }

  /** Go at a given position (0-8) */
  go (at: number): true | Turn {
    if (this.winner()) {
      return this.turn
    }

    this.board[at] = this.turn
    this.#turns++

    if (this.winner()) {
      return this.turn
    }

    this.setTurn()
    return true
  }

  /** Use totally legit AI (copyright 2021, @KhafraDev) to go */
  botGo (): true | undefined | Turn {
    const lines = [
      // horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // vertical
      [0, 3, 6],
      [4, 7, 1],
      [2, 5, 8],
      // diagonal
      [0, 4, 8],
      [2, 4, 6]
    ]

    if (this.#difficulty !== 'easy') {
      let potential: number | undefined

      for (const [a, b, c] of lines) {
        const atA = this.board[a]
        const atB = this.board[b]
        const atC = this.board[c]

        // If two spots in the same row are empty, ignore it.
        if (
          atA === null && atB === null
          || atA === null && atC === null
          || atB === null && atC === null
        ) {
          continue
        }

        // If the difficulty is medium, have a 50% chance
        // of throwing the game.
        if (this.#difficulty === 'normal' && Math.random() * 10 < 5) {
          continue
        }

        // Find the first row where 1 space is empty and 2
        // spaces are controlled by the same player.
        // It also prioritizes choosing a spot where both
        // taken spaces are controlled by the bot.
        if (atC === null && atA === atB) {
          if (atA === 'X') {
            potential = c
          } else {
            return this.go(c)
          }
        } else if (atB === null && atA === atC) {
          if (atA === 'X') {
            potential = b
          } else {
            return this.go(b)
          }
        } else if (atA === null && atB === atC) {
          if (atB === 'X') {
            potential = a
          } else {
            return this.go(a)
          }
        }
      }

      if (potential !== undefined) {
        return this.go(potential)
      }
    }

    while (!this.isFull()) {
      const random = Math.floor(Math.random() * 9) // [0, 8]
      if (this.board[random] === null) { // is an empty space
        return this.go(random) // go at empty space
      }
    }
  }

  /** Utility method to change turns */
  setTurn (): 'X' | 'O' {
    return this.turn = this.turn === 'X' ? 'O' : 'X'
  }

  /** Detect if the board is full */
  isFull (): boolean {
    return this.#turns === 9
  }

  isBotTurn () {
    return this.turn === 'O'
  }

  winner (): boolean {
    // winning options
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    for (const [a, b, c] of lines) {
      if (
        this.board[a] !== null // make sure it's not an empty box
        && this.board[a] === this.board[b]
        && this.board[a] === this.board[c]
      ) {
        return true
      }
    }

    return false
  }
}
