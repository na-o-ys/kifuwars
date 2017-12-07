import fetch from "node-fetch"
import parse from "./parse"
import convertCsa from "./convert/csa"

export async function main(url: string, options: Option): Promise<string> {
    const body = await fetch(url).then(b => b.text())
    if (!body) throw `can't fetch url '${url}'`
    const parsed = parse(body)

    switch (options.format) {
        default:
            return convertCsa(parsed)
    }
}

main(process.argv[2], { format: "csa" })
    .then(console.log)

interface Option {
    format: "csa"
}