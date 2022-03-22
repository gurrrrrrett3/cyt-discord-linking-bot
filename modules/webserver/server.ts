import express from 'express';
import LinkManager from '../data/linkManager';

export default class Webserver {
    private app: express.Application;
    private port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.app.use(express.json());
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Webserver started on port ${this.port}`);
        });

        this.app.post("/link", (req, res) => {
            const { username, uuid, code } = req.body;
            const link = LinkManager.newLink(uuid, username, code);
            res.send(link);
        })

        this.app.post("/unlink", (req, res) => {
            const { uuid } = req.body;
            LinkManager.removeLink(uuid);
            res.send(200);
        })
    }
}