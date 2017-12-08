import * as _ from "lodash"

export default parse

export function parse(body: string, url: string): Parsed {
    const gameData = extractGameData(body, url)
    const { moves, ending} = extractMoves(body, gameData.initialRemainingSec)
    return { gameData, moves, ending }
}

export interface Parsed {
    gameData: GameData,
    moves: Move[],
    ending: CSAEnding
}

export interface GameData {
    date: Date
    rule: string
    csaTimeLimit: string
    initialRemainingSec: number
    url: string
    players: {
        black: {
            name: string
            grade: string
        }
        white: {
            name: string
            grade: string
        }
    }
}

function extractGameData(body: string, url: string): GameData {
    const black_grade = assumeNotNull(body.match(/\s+dan0:\s"(.*)"/))[1]
    const white_grade = assumeNotNull(body.match(/\s+dan1:\s"(.*)"/))[1]
    const gtype       = assumeNotNull(body.match(/\s+gtype:\s"(.*)"/))[1]
    const raw_name    = assumeNotNull(body.match(/\s+name:\s"(.*)"/))[1]
    const [, black_name, white_name, raw_date] = assumeNotNull(
        raw_name.match(/(.*)-(.*)-(.*)/)
    )
    const [, Y, M, D, H, m, S] = assumeNotNull(
        raw_date.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/)
    )
    return {
        date: new Date(`${Y}-${M}-${D}T${H}:${m}:${S}+09:00`),
        rule: WarsRules[gtype].rule,
        csaTimeLimit: WarsRules[gtype].csaTimeLimit,
        initialRemainingSec: WarsRules[gtype].initialRemainingSec,
        url,
        players: {
            black: {
                name: black_name,
                grade: black_grade
            },
            white: {
                name: white_name,
                grade: white_grade
            }
        }
    }
}

function extractMoves(body: string, initialRemainingSec: number) {
    // +7776FU,L599
    // -3334FU,L599
    // ...
    // +0044GI,L238
    // SENTE_WIN_TORYO
    const lines = assumeNotNull(body.match(/receiveMove\("(.*)"\)/))[1].split("\t")

    let ending: CSAEnding = "%ERROR"
    let moves: Move[] = []
    let prevRemainingSec = [initialRemainingSec, initialRemainingSec]
    for (const line of lines) {
        if (!["+", "-"].includes(line[0])) {
            ending = parseEnding(line)
            break
        }
        // move
        const { color, csaMove } = parseMove(line)
        const time = parseTime(line, prevRemainingSec[color])
        prevRemainingSec[color] -= time.consumedSec
        moves.push({ color, csaMove, time })
    }
    return { moves, ending }
}

export interface Move {
    color: 0 | 1,
    csaMove: string,
    time: {
        remainingSec: number,
        consumedSec: number
    }
}

function parseMove(line: string) {
    const color: 0 | 1 = line[0] == "+" ? 0 : 1
    const csaMove = assumeNotNull(line.match(/^(.*),L/))[1]
    return { color, csaMove }
}

function parseTime(line: string, prevRemainingSec: number) {
    const remainingSec = Number(assumeNotNull(line.match(/,L(\d{1,3})/))[1])
    const consumedSec = prevRemainingSec - remainingSec
    return { remainingSec, consumedSec }
}

function parseEnding(line: string): CSAEnding {
    if (line.includes("_WIN_TORYO") || line.includes("_WIN_DISCONNECT")) {
        return "%TORYO"
    } else if (line.includes("_WIN_TIMEOUT")) {
        return "%TIME_UP"
    } else if (line.includes("_WIN_ENTERINGKING")) {
        return "%KACHI"
    } else if (line.includes("DRAW_SENNICHI")) {
        return "%SENNICHITE"
    }
    return "%ERROR"
}

export type CSAEnding = "%TORYO" | "%TIME_UP" | "%KACHI" | "%SENNICHITE" | "%ERROR"

const WarsRules: { [key: string]: WarsRule } = {
    '': {
        initialRemainingSec: 600,
        rule: "10分切れ負け",
        csaTimeLimit: "00:10+00"
    },
    'sb': {
        initialRemainingSec: 360,
        rule: "3分切れ負け",
        csaTimeLimit: "00:03+00"
    },
    's1': {
        initialRemainingSec: 3600,
        rule: "秒読み10秒",
        csaTimeLimit: "00:00+10"
    },
}

interface WarsRule {
    initialRemainingSec: number
    rule: string
    csaTimeLimit: string
}

function assumeNotNull<T>(o: T | null) {
    if (!o) throw "error"
    return o
}