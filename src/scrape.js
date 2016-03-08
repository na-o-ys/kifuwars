import fetch from 'node-fetch'

export default function(url) {
  return fetch(url)
    .then(res => { return res.text() })
    .then(body => {
      let game_data = extractGameData(body)
      let moves     = extractMoves(body)
      return { game_data, moves }
    })
}

function extractGameData(body) {
  let black_grade = body.match(/\s+dan0:\s"(.*)"/)[1]
  let white_grade = body.match(/\s+dan1:\s"(.*)"/)[1]
  let gtype       = body.match(/\s+gtype:\s"(.*)"/)[1]
  let raw_name    = body.match(/\s+name:\s"(.*)"/)[1]
  let [, black_name, white_name, raw_date] = raw_name.match(/(.*)-(.*)-(.*)/)
  let [, Y, M, D, H, m, S] = raw_date.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/)
  return {
    date: new Date(`${Y}-${M}-${D}T${H}:${m}:${S}+09:00`),
    gtype,
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

function extractMoves(body) {
  let move_data = body.match(/receiveMove\("(.*)"\)/)[1]
  return move_data.split("\t")
}
