const EMPTY_VALUE = fn => {
  const _VALUES = {
    String: '',
    Number: 0,
    Array: [],
    Object: {},
    Boolean: false
  };
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? _VALUES[match[1]] : null;
};

export function indent(str, num, len = 2) {
  if (num === 0) return str;
  const isLeft = num < 0; const result = []; let reg; let
    spaces = '';
  if (isLeft) {
    num *= -1;
    reg = new RegExp(`(^\\s{0,${num * len}})`, 'g');
  } else {
    for (let i = 0; i < num * len; i++) spaces += ' ';
  }

  str.split('\n').forEach(line => {
    line = isLeft ? line.replace(reg, '') : spaces + line;
    result.push(line);
  });
  return result.join('\n');
}

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase());
}

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}
export function importUtils(conf) {
  if (conf.model.form.importUtils && conf.model.form.utilsName.length) {
    return `import ${conf.model.form.utilsName} from 'km-common-utils'`;
  }
  return '';
}

export const exportDefault = 'export default ';


export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
};

function stringify(obj) {
  return JSON.stringify(obj, (key, val) => {
    if (typeof val === 'function') {
      return `${val}`;
    }
    return val;
  });
}

function parse(str) {
  JSON.parse(str, (k, v) => {
    if (v.indexOf && v.indexOf('function') > -1) {
      return eval(`(${v})`);
    }
    return v;
  });
}

export function jsonClone(obj) {
  return parse(stringify(obj));
}

export function getStore(modelName, key) {
  const obj = window.localStorage && window.localStorage.getItem(modelName + key);
  if (obj && obj !== 'undefined' && obj !== 'null') {
    return JSON.parse(obj);
  }
  return '';
}
export function setStore(modelName, key, val) {
  window.localStorage && window.localStorage.setItem(modelName + key, JSON.stringify(val));
}
export function removeStore(modelName, key) {
  if (modelName + key) {
    window.localStorage && window.localStorage.removeItem(modelName + key);
  } else {
    // eslint-disable-next-line
    for (const i in arguments) {
      window.localStorage && window.localStorage.removeItem(arguments[i]);
    }
  }
}

export function setSession(name, value) {
  const v = value ? JSON.stringify(value) : '';
  sessionStorage.setItem(`${name}`, v);
}

export function getSession(name, type = Object, defVal) {
  const v = sessionStorage.getItem(`${name}`);
  return v ? JSON.parse(v) : EMPTY_VALUE(type, defVal);
}

export function removeSession(name) {
  sessionStorage.removeItem(`${name}`);
}
