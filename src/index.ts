import scrape from './scrape'
import convertCsa from './convert_csa'

export function main(url: any, options: any): Promise<any> {
    return scrape(url)
        .then(({game_data, moves}: any) => {
            switch (options.format) {
                default:
                    return convertCsa(game_data, moves)
            }
        })
}
main(process.argv[2], { format: 'csa' })
    .then(console.log)