import {Install} from "./Install";
const installServiceWorker = (path: string) => {
    const worker = new Install();
    worker.register(path).then((res) => {
        console.info("registered", res);
    }).catch((err) => {
        console.error(err);
    })
};
installServiceWorker("worker.js");
