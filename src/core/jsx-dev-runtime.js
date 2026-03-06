// design-template code, don't change this file.
import * as React from 'react';

let sourceIdCounter = 0;
const HTML_TAGS = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
  'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
  'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del',
  'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img',
  'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map',
  'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol',
  'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress',
  'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select',
  'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
  'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead',
  'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'svg',
  'path', 'g', 'defs', 'linearGradient', 'radialGradient', 'stop', 'rect',
  'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan',
  'clipPath', 'mask', 'pattern', 'symbol', 'use', 'view'
]);

const generateSourceId = () => {
  return ++sourceIdCounter;
};

const extractWorkspacePath = (fullPath) => {
  if (!fullPath) return fullPath;
  const match = fullPath.match(/(\/workspace\/.+)/);
  return match ? match[1] : fullPath;
};

export function jsx(type, config, maybeKey) {
  let propName;
  const props = {};
  let key = null;
  let ref = null;

  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  if (config != null) {
    if (config.key !== undefined) key = '' + config.key;
    if (config.ref !== undefined) ref = config.ref;
    for (propName in config) {
      if (
        Object.prototype.hasOwnProperty.call(config, propName) &&
        propName !== 'key' &&
        propName !== 'ref'
      ) {
        props[propName] = config[propName];
      }
    }
  }

  if (key) props.key = key;
  if (ref) props.ref = ref;
  return React.createElement(type, props);
}

export function jsxs(type, config, maybeKey) {
  return jsx(type, config, maybeKey);
}

export function jsxDEV(type, props, key, isStaticChildren, source, self) {
  const { children, ...restProps } = props || {};
  const sourceObj = source || null;
  const elementProps = {
    ...restProps,
    key,
    __source: sourceObj,
    __self: self,
  };

  const isDomTag = typeof type === 'string' && HTML_TAGS.has(type);
  if (isDomTag) {
    elementProps['data-source-id'] = generateSourceId();
    if (sourceObj && (sourceObj.fileName || sourceObj.lineNumber)) {
      const fileName = extractWorkspacePath(sourceObj.fileName);
      elementProps['data-source'] = `${fileName || ''}:${sourceObj.lineNumber || ''}:${sourceObj.columnNumber || ''}`;
      if (fileName) elementProps['data-source-file'] = fileName;
      if (sourceObj.lineNumber) elementProps['data-source-line'] = String(sourceObj.lineNumber);
      if (sourceObj.columnNumber) {
        elementProps['data-source-column'] = String(sourceObj.columnNumber);
      }
    }
  }

  return React.createElement(type, elementProps, children);
}

export const Fragment = React.Fragment;
