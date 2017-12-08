import * as moment from "moment"
import * as _ from "lodash"
import { GameData, Move, CSAEnding, Parsed } from "../parse"

// WarsCSA -> CSA
export default convert

export function convert({ gameData, moves, ending }: Parsed) {
    let header = generateHeader(gameData)
    let body   = generateBody(moves, ending)
    return [header, body].join("\n")
}

function generateHeader(gameData: GameData) {
    let date = moment(gameData.date).format("YYYY/MM/DD HH:mm:SS")
    let players = {
        black: gameData.players.black.name + ` (${gameData.players.black.grade})`,
        white: gameData.players.white.name + ` (${gameData.players.white.grade})`
    }
    return [
        "V2.2",
        `N+${players.black}`,
        `N-${players.white}`,
        `$EVENT:将棋ウォーズ ${gameData.rule} (${gameData.url})`,
        `$START_TIME:${date}`,
        `$TIME_LIMIT:${gameData.csaTimeLimit}`,
        "PI",
        "+" // 先手番
    ].join("\n")
}

function generateBody(moves: Move[], ending: CSAEnding) {
    return [
        moves.map(move =>
            [move.csaMove, `T${move.time.consumedSec}`].join("\n")
        ).join("\n"),
        ending
    ].join("\n")
}
