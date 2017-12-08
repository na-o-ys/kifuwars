import * as Express from "express"
import { fetchGame } from "./game"
import { fetchHistory } from "./history"

async function fetchGameAndRender(res: Express.Response, gameId: string) {
    console.log(gameId)
    const csa = await fetchGame(gameId)

    res.header("Content-Type", "text/plain;charset=utf-8")
    res.send(csa)
}

const app = Express()

app.get("/games/:gameId", async (req, res) => {
    const gameId: string = req.params["gameId"]
    await fetchGameAndRender(res, gameId)
})

app.get("/users/:userId/:count", async (req, res) => {
    const userId: string = req.params["userId"]
    const count: number = req.params["count"] == "latest" ? 0 : Number(req.params["count"])
    const histories = await fetchHistory(userId)
    const gameId = histories[count].gameId
    await fetchGameAndRender(res, gameId)
})

const port = Number(process.env.PORT || 3000)
app.listen(port)