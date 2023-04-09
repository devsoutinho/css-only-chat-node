export const idGenerator = function () {
  let id = 0;
  return () => `000${id++}`.slice(-3);
};
export const PORT = 8085;
export const SEND_LETTER = '-';
export const PRESS_EVENT = 'press-key';
export const LETTERS = [
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 
  's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  'z', 'x', 'c', 'v', 'b', 'n', 'm'
];
export const INTRO_HTML = `
  <html>
    <head>
      <title>CSS-only Chat APP</title>
      <link rel='stylesheet' href='style.css'/>
      <style>
        body {
          font-family: sans-serif;
          background-color: #222222;
          color: #DDDDDD;
        }
        a {
          color: rgb(243, 86, 39);
        }
        .user {
          display: inline-block;
          padding: 4px 4px; 
          border-radius: 4px;
        }
        .keyboard {
          display: flex;
          flex-wrap: wrap;
          width: 320px;
          margin: auto;
          justify-content: center;
        }
      </style>
    </head>
    <body>
    <h1>Welcome to CSS-only Chat!</h1>
    <p>This page uses no javascript whatsosever - only CSS and html. Blame @kkuchta for this.</p>
    <p>This is a
      <a target="_blank" href="https://github.com/alienzhou/css-only-chat-node">NodeJS version</a>
      for
      <a target="_blank" href="https://github.com/kkuchta/css-only-chat">@kkuchta/css-only-chat</a>.
      Open <a target="_blank" href="http://localhost:${PORT}">a new tab</a> for chatting.
    </p>
    <p>Your id is <span class="user" style="background: %id%;">%id%</span>.</p>
`;
export const STYLE_TEXT = `
    .keys {
        position: absolute;
        left: 10px;
        top: 200px;
    }
    .messages {
        position: absolute;
        top: 260px;
        left: 10px;
    }
    .btn {
        width: 40px;
        padding: 0;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
    }
    .send {
        border: none;
        border-radius: 4px;
        padding: 0 20px;
        line-height: 30px;
        background: rgb(243, 86, 39);
        color: #fff;
        cursor: pointer;
        margin: auto;
    }
    .send-block {
        margin: 10px 0;
        text-align: center;
    }
`;
