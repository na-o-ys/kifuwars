import scrape from './scrape.js'
import convertCsa from './convert_csa.js'

export default (url, options) => {
  scrape(url)
    .then(({game_data, moves}) => {
      switch (options.format) {
        default:
          return convertCsa(game_data, moves)
      }
    })
    .catch(e => (e))
}
