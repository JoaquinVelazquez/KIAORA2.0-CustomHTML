import express from 'express';
import http from 'http';
import { create } from 'express-handlebars';
import { WebSocketServer } from 'ws';
import path from 'path';
import { v4 as uuid } from 'uuid';
import opn from 'opn';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import sass from 'node-sass';
import watcher from './lib/watch.js';
import data from './mock.js';

const app = express();
const __dirname = path.resolve(path.dirname(''));
let dataMock = JSON.parse(JSON.stringify(data));

const getTheme = async () => {
  const routeviews = path.join(__dirname, 'views');
  let theme = ['views/partials/'];
  return new Promise((resolve, reject) => {
    fs.readdir(
      path.resolve(routeviews, 'partials'),
      (err, files) => {
        if (err) reject(err);
        const templates = files.filter(f => !f.includes('.') && f !== 'components' && f !== 'icons').map(f => `views/partials/${f}/`);
        resolve([...theme, ...templates]);
      }
    );
  });
};

const compileStyles = async (templateName) => {
  console.log("template" + templateName);
  const stylesPath = `views/partials/${templateName}/styles`;
  const file = `${stylesPath}/main.scss`;
  if (fs.existsSync(file)) {
    sass.render(
      {
        file,
        includePaths: [stylesPath],
        outputStyle: 'compressed'
      },
      (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        fs.writeFileSync(path.join(__dirname, 'static', templateName + '.css'), result.css);
      }
    );
  }
};

async function start() {
  try {
    let connections = [];
    const PORT = process.env.PORT || 3000;
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });
    const startServerSpinner = ora('Starting server').start();
    const pathThemes = await getTheme();
    const hbs = create({
      extname: '.hbs',
      partialsDir: pathThemes,
      helpers: {
        toJSON(object) {
          return JSON.stringify(object);
        },
        concat() {
          return [...arguments].slice(0, -1).join('');
        }
      }
    });

    app.use(express.static(path.join(__dirname, 'static')));
    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');
    app.set('views', './views');

    app.get('/', function (req, res) {
      res.render('default', dataMock);
    });

    server.listen(PORT, () => {
      startServerSpinner.succeed(`Ready on ${chalk.cyan('http://localhost' + PORT)}`);
      const connectionsSpinner = ora('Checking for open hotreload connections').start();

      setTimeout(() => {
        if (!connections.length) {
          connectionsSpinner.info('0 hotreload connections found, opening a new tab');
          opn(`http://localhost:${PORT}`);
        } else {
          connectionsSpinner.info(`${connections.length} hotreload connections found`);
        }
      }, 5500);
    });

    wss.on('connection', socket => {
      const id = uuid();
      connections.push({ id, socket });
      socket.on('close', () => {
        connections = connections.filter(({ id: socketId }) => socketId !== id);
      });
    });

    watcher((type, file) => {
      console.log(`[${chalk.blue(type)}] > ${file}`);
    
      if (file === 'mock.js') {
        import('./mock.js').then((module) => {
          dataMock = module.default;
        });
      }
    
      if (file.match(/^views\/partials\/\w+\/styles\/(\w|-|\/)+\.scss$/)) {
        const templateName = file.split('/')[2];
        compileStyles(templateName);
      }
    
      for (const { socket } of connections) {
        socket.send(`[${type}] > ${file}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

start();

export default app;
