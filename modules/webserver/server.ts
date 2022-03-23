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

        this.app.get("/link/:code/:name/:uuid", (req, res) => {
            
            const code = req.params.code;
            const name = req.params.name;
            const uuid = req.params.uuid;

            const link = LinkManager.newLink(uuid, name, code);
            
            res.send(link.message);
            console.log(req.params);
            console.log(link.message);
        })

        this.app.post("/unlink", (req, res) => {
            const { uuid } = req.body;
            LinkManager.removeLink(uuid);
            res.send(200);
        })

        this.app.get("/:id", (req, res) => {

            if (!req.params.id) {
                res.send("No ID provided");
                return;
            }

            //is this a uuid or an id?
            const id = req.params.id;

            if (id.length === 36) {
                const link = LinkManager.getLinkbyUUID(id);
                if (!link) {
                    res.send("Link not found");
                    return;
                }
                res.send(link);
                return;
            } else {
                const link = LinkManager.getLinkByID(id);
                if (!link) {
                    res.send("Link not found");
                    return;
                }
                res.send(link);
                return;
            }
        })
    }
}