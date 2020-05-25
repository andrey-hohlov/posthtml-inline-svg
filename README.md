# posthtml-inline-svg

[PostHTML](https://github.com/posthtml/posthtml) plugin that inline svg icons in HTML. Like GitHub [does](https://github.blog/2016-02-22-delivering-octicons-with-svg/) with Octicons.

### Before

```html
<icon src="icon.svg" class="icon"></icon>
```

### After

```html
<svg viewBox="0 0 100 100" class="icon">
  <path d="M6 0l8 89.9L49.9 100 86 89.9 94 0H6zm70.6 29.3H34.5l.9 11.3h40.2l-3.1 34-22.4 6.2v.1h-.3l-22.6-6.2-1.4-17.4h10.9l.8 8.8 12.2 3.3L62.2 66l1.4-14.3H25.3l-2.9-33.4h55.3l-1.1 11z"></path>
</svg>
```

## Install

```bash
npm i -D posthtml posthtml-inline-svg
```

## Usage

```js
const path = require('path')
const fs = require('fs')
const posthtml = require('posthtml');
const inlineSVG = require('posthtml-inline-svg');

posthtml(inlineSVG({
  cwd: path.resolve('src'),
  tag: 'icon',
  attr: 'src',
 }))
  .process(fs.readFileSync('index.html', 'utf8'))
  .then((result) => console.log(result.html));
```

## Options

|Option|Default|Description|
|:-:|:--|:--|
| **cwd** | `process.cwd()` | Path icon source related to |
| **tag** | `icon` | HTML-tag to process |
| **attr** | `src` | Attribute to get icon path |
| **comment** | `false` | Render HTML comment with icon source before icon markup |
| **svgo** `since 0.2.0` | `null` | Custom [SVGO](https://github.com/svg/svgo) config |
