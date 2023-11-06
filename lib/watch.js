import chokidar from 'chokidar';

// One-liner for current directory, ignores .dotfiles
const watcher = chokidar.watch('.', {
  ignored: [/(^|[\/\\])\../, '**/node_modules', 'README.md', 'index.js', 'package-lock.json', 'package.json'],
  ignoreInitial: true
});

export default (cb) => {
  watcher.on('all', (event, path) => {
    if (cb) {
      cb(event, path);
    }
  });
};
