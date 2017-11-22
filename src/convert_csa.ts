import * as moment from "moment"
import * as _ from "lodash"

// WarsCSA -> CSA
export default function(game_data: any, moves: any) {
    let header = generateHeader(game_data)
    let body   = generateBody(game_data, moves)
    return [header, body].join("\n")
}

function generateHeader(game_data: any) {
    let rule = g_rules[game_data.gtype]
    let date = moment(game_data.date).format("YYYY/MM/DD HH:mm:SS")
    let players = {
        black: game_data.players.black.name + ` (${game_data.players.black.grade})`,
        white: game_data.players.white.name + ` (${game_data.players.white.grade})`
    }
    return [
        `N+${players.black}`,
        `N-${players.white}`,
        "V2.2",
        `$EVENT:将棋ウォーズ ${rule.rule}`,
        `$START_TIME:${date}`,
        `$TIME_LIMIT:${rule.time_limit}`,
        "+" // 先手番
    ].join("\n")
}

function generateBody(game_data: any, raw_moves: any) {
    let time_limit = g_rules[game_data.gtype].initial_time_limit
    let prev = [time_limit, time_limit]
    let moves: any = []
    raw_moves.forEach((raw_move: any, i: any) => {
        // 消費時間のフォーマット
        if (["+", "-"].includes(raw_move[0])) {
            let curr = Number(raw_move.match(/,L(\d{1,3})/)[1])
            let consumed = prev[i%2] - curr
            prev[i%2] = curr
            let move = raw_move.match(/^(.*),L/)[1]
            moves.push([move, `T${consumed}`].join("\n"))
        } else if (raw_move.includes("_WIN_TORYO") || raw_move.includes("_WIN_DISCONNECT")) {
            moves.push("%TORYO")
        } else if (raw_move.includes("_WIN_TIMEOUT")) {
            moves.push("%TIME_UP")
        } else if (raw_move.includes("_WIN_ENTERINGKING")) {
            moves.push("%KACHI")
        } else if (raw_move.includes("DRAW_SENNICHI")) {
            moves.push("%SENNICHITE")
        }
    })
    return moves.join("\n")
}

let g_rules: any = {
    '': {
        initial_time_limit: 600,
        rule: "10分切れ負け",
        time_limit: "00:10+00"
    },
    'sb': {
        initial_time_limit: 360,
        rule: "3分切れ負け",
        time_limit: "00:03+00"
    },
    's1': {
        initial_time_limit: 3600,
        rule: "秒読み10秒",
        time_limit: "00:00+10"
    },
}
