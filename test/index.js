const expect = require('expect');
const posthtml = require('posthtml');
const inlineSVG = require('..');

function run(html, options) {
  return posthtml([inlineSVG(options)])
    .process(html)
    .then(result => result.html);
}

describe('posthtml-inline-svg', () => {
  const options = { cwd: './test/assets' };

  it('should inline SVG', () => {
    return run(
      '<icon src="icon.svg"></icon>',
      options
    ).then(res => {
      expect(res).toBe(
        '<svg viewBox="0 0 100 100"><path d="M6 0l8 89.9L49.9 100 86 89.9 94 0H6zm70.6 29.3H34.5l.9 11.3h40.2l-3.1 34-22.4 6.2v.1h-.3l-22.6-6.2-1.4-17.4h10.9l.8 8.8 12.2 3.3L62.2 66l1.4-14.3H25.3l-2.9-33.4h55.3l-1.1 11z"></path></svg>'
      );
    });
  });

  it('should keep attributes', () => {
    return run(
      '<icon class="icon" aria-hidden="true" src="icon.svg"></icon>',
      options
    ).then(res => {
      expect(res).toBe(
        '<svg viewBox="0 0 100 100" class="icon" aria-hidden="true"><path d="M6 0l8 89.9L49.9 100 86 89.9 94 0H6zm70.6 29.3H34.5l.9 11.3h40.2l-3.1 34-22.4 6.2v.1h-.3l-22.6-6.2-1.4-17.4h10.9l.8 8.8 12.2 3.3L62.2 66l1.4-14.3H25.3l-2.9-33.4h55.3l-1.1 11z"></path></svg>'
      );
    });
  });

  it('should support custom tag', () => {
    return run(
      '<svg-icon src="icon.svg"></svg-icon>',
      Object.assign({}, options, { tag: 'svg-icon' })
    ).then(res => {
      expect(res).toBe(
        '<svg viewBox="0 0 100 100"><path d="M6 0l8 89.9L49.9 100 86 89.9 94 0H6zm70.6 29.3H34.5l.9 11.3h40.2l-3.1 34-22.4 6.2v.1h-.3l-22.6-6.2-1.4-17.4h10.9l.8 8.8 12.2 3.3L62.2 66l1.4-14.3H25.3l-2.9-33.4h55.3l-1.1 11z"></path></svg>'
      );
    });
  });

  it('should support custom attribute', () => {
    return run(
      '<icon icon-src="icon.svg"></icon>',
      Object.assign({}, options, { attr: 'icon-src' })
    ).then(res => {
      expect(res).toBe(
        '<svg viewBox="0 0 100 100"><path d="M6 0l8 89.9L49.9 100 86 89.9 94 0H6zm70.6 29.3H34.5l.9 11.3h40.2l-3.1 34-22.4 6.2v.1h-.3l-22.6-6.2-1.4-17.4h10.9l.8 8.8 12.2 3.3L62.2 66l1.4-14.3H25.3l-2.9-33.4h55.3l-1.1 11z"></path></svg>'
      );
    });
  });

  it('should work without cwd option', () => {
    return run(
      '<icon src="test/assets/icon.svg"></icon>',
      {}
    ).then(res => {
      expect(res).toBe(
        '<svg viewBox="0 0 100 100"><path d="M6 0l8 89.9L49.9 100 86 89.9 94 0H6zm70.6 29.3H34.5l.9 11.3h40.2l-3.1 34-22.4 6.2v.1h-.3l-22.6-6.2-1.4-17.4h10.9l.8 8.8 12.2 3.3L62.2 66l1.4-14.3H25.3l-2.9-33.4h55.3l-1.1 11z"></path></svg>'
      );
    });
  });

  // https://github.com/andrey-hohlov/posthtml-inline-svg/issues/6
  it('should apply custom svgo config', () => {
    return run(
      '<icon src="test/assets/icon-with-title.svg"></icon>',
      {
        svgo: {
          plugins: [
            { removeTitle: false },
            { removeXMLNS: true },
            { removeViewBox: false },
            { removeDimensions: true },
          ],
        },
      },
    ).then(res => {
      expect(res).toBe(
        '<svg viewBox="0 0 100 100"><title>Title</title><path d="M6 0l8 89.9L49.9 100 86 89.9 94 0H6zm70.6 29.3H34.5l.9 11.3h40.2l-3.1 34-22.4 6.2v.1h-.3l-22.6-6.2-1.4-17.4h10.9l.8 8.8 12.2 3.3L62.2 66l1.4-14.3H25.3l-2.9-33.4h55.3l-1.1 11z"></path></svg>'
      );
    });
  });
});
