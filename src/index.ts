import scrape from "./scrape"
import convertCsa from "./convertCsa"

export function main(url: string, options: any): Promise<any> {
    return scrape(url)
        .then(scraped => {
            switch (options.format) {
                default:
                    return convertCsa(scraped)
            }
        })
}
main(process.argv[2], { format: "csa" })
    .then(console.log)