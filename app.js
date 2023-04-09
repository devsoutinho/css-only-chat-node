import http from 'http';
import EventEmitter from 'events';
import { Cache } from './cache.js';
import {
    PORT,
    LETTERS,
    SEND_LETTER,
    idGenerator,
    STYLE_TEXT,
    INTRO_HTML,
    PRESS_EVENT
} from './util.js';

const cache = new Cache();
const msgList = [];
const event = new EventEmitter();
const getId = idGenerator();

function createPanel(id, current = '') {
    const prev = cache.getHistory(id) || '';
    const prevMsg = cache.getMsg(id) || '';
    const now = prev + current;
    const createKey = letter => {
        const prefix = now ? `${now}-${letter}` : letter;
        return `
            <style>.btn_${prefix}:active { background-image: url('/keys/${prefix}_${id}_${letter}') }</style>
            <button class="btn btn_${prefix}" style="grid-area: ${letter};">${letter}</button>
        `;
    };
    const msgListHtml = () => msgList.reduce((prev, item) => `${prev}<li><span class="user" style="background:#${item.id}">#${item.id}</span>: ${item.msg}</li>`, '');

    const sendBtnHTML = `
        <div class="send-block">
            <style>.send_${now}:active { background-image: url('/send-${now}_${id}') }</style>
            <button class="send send_${now}">💬 Send</button>
        </div>
    `;
    const keysStyle = current ? `<style>.main_${prev}{display: none;}</style>` : '';
    const currentText = `${prevMsg}${current}`;
    const msgHTML = msgListHtml();

    return `
        ${keysStyle}
        <div class="main main_${now}">
            <div class="keyboard">
              ${LETTERS.map(createKey).join('')}
            </div>
            ${sendBtnHTML}
            <div>
              <h2>
                Current Message:
              </h2>
              <p>
                ${currentText === SEND_LETTER ? '' : currentText}
              </p>
            </div>
            ${msgHTML ? '<h2>Message List:</h2>' : ''}
            <ul style="max-width: 300px; text-align: left; margin: auto;">
              ${msgHTML}
            </ul>
        </div>
    `;
}



const app = http.createServer((req, res) => {
    if (/^\/$/.test(req.url)) {
        req.url = '/index';
    }

    if (/^\/index$/.test(req.url) && req.method === 'GET') {
        const clientId = getId();
        cache.add(clientId, '');

        const send = ({id, letter}) => clientId === id && res.write(createPanel(id, letter));

        res.statusCode = 200;
        res.setHeader('connection', 'keep-alive');
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.write(INTRO_HTML.replaceAll('%id%', `#${clientId}`));
        res.write(createPanel(clientId));

        event.addListener(PRESS_EVENT, send);
        req.socket.on('close', () => event.removeListener(PRESS_EVENT, send));

        // 3) The connection NEVER ENDS
        // res.end();
        return;
    }

    if (/^\/send-/.test(req.url)) {
        // 2) ============== 
        // console.log("2) CSS :active on send sends the message", req.url);
        // =================
        const clientId = req.url.split('_')[1];
        const msg = cache.getMsg(clientId);

        cache.clear(clientId);
        msgList.push({id: clientId, msg});

        cache.ids().forEach(id => {
            event.emit(PRESS_EVENT, {id, letter: SEND_LETTER});
            cache.add(id, SEND_LETTER);
        });

        res.statusCode = 204;
        res.end();
        return
    }

    if (/^\/keys/.test(req.url)) {
        // 1) ============== 
        // console.log("1) CSS :active triggers request ", req.url);
        // =================
        const segments = req.url.split('_');
        const letter = segments[2];
        const id = segments[1];
        event.emit(PRESS_EVENT, {id, letter});
        cache.add(id, letter);

        res.statusCode = 204;
        res.end();
        return;
    }

    if (/^\/style.css$/.test(req.url) && req.method === 'GET') {
        res.setHeader('content-type', 'text/css');
        res.end(STYLE_TEXT);
        return;
    }

    res.statusCode = 404;
    res.end('404');
});

app.listen(PORT, () => console.log('listening on %s port', PORT));
