const path = require('path');
const fs = require('fs');
const SVGO = require('svgo');
const parser = require('posthtml-parser');

const svgo = new SVGO({
  plugins: [
    { removeXMLNS: true },
    { removeViewBox: false },
    { removeDimensions: true },
  ],
});

const cache = {};

module.exports = function postHtmlInlineSvg(options) {
  const root = options.root || process.cwd();
  const tag = options.tag || 'icon';
  const attr = options.attr || 'src';

  const localCache = {};

  const getSVG = (filePath) => {
    if (localCache[filePath]) {
      return localCache[filePath];
    }

    const stats = fs.statSync(filePath);
    const modifiedAt = stats.mtimeMs;

    if (cache[filePath] && cache[filePath].modifiedAt === modifiedAt) {
      localCache[filePath] = cache[filePath].promise;
      return cache[filePath].promise;
    }

    const promise = new Promise((resolve) => {
      const data = fs.readFileSync(filePath);
      return svgo.optimize(data.toString()).then(result => resolve(result.data));
    });

    cache[filePath] = { promise, modifiedAt };
    localCache[filePath] = promise;

    return promise;
  };

  return tree => new Promise((resolve, reject) => {
    const promises = [];

    tree.match({ tag }, (node) => {
      promises.push(new Promise(async (resolve, reject) => {
        try {
          const src = node.attrs[attr];
          const svg = await getSVG(path.resolve(root, src));
          const nodes = parser(svg);
          const attrs = node.attrs;
          delete attrs[attr];

          Object.assign(nodes[0].attrs, attrs);
          node.tag = false;
          node.content = nodes;
          resolve();
        } catch (err) {
          reject(err);
        }
      }));
      return node;
    });

    Promise.all(promises)
      .then(() => resolve(tree))
      .catch(reject);
  });
};
