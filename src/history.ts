import fetch from "node-fetch"

export interface History {
    gameId: string
}

export async function fetchHistory(userName: string): Promise<History[]> {
    const url = `https://shogiwars.heroz.jp/users/history/${userName}`
    const body = await fetch(url).then(b => b.text())
    if (!body) throw `can't fetch url '${url}'`
    return assumeNotNull(body.match(/\/kif-pona.heroz.jp\/games\/.*?\?locale=ja/g))
        .map(game =>
            ({
                gameId: assumeNotNull(game.match(/games\/(.*)\?locale=ja/))[1]
            })
        )
}

function assumeNotNull<T>(o: T | null) {
    if (!o) throw "error"
    return o
}
