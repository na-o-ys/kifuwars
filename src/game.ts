import fetch from "node-fetch"
import parse from "./parse"
import convertCsa from "./convert/csa"

export async function fetchGame(gameId: string, options: Option = { format: "csa" }): Promise<string> {
    const warsGameUrl = `http://shogiwars.heroz.jp:3002/games/${gameId}`
    const body = await fetch(warsGameUrl).then(b => b.text())
    if (!body) throw `can't fetch url '${warsGameUrl}'`
    const parsed = parse(body, warsGameUrl)

    switch (options.format) {
        default:
            return convertCsa(parsed)
    }
}

interface Option {
    format: "csa"
}