/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const r = {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
  return r;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const a = Object.create(proto);
  Object.assign(a, JSON.parse(json));
  return a;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  isBasic: true,
  nameEl: '',
  nameID: '',
  nameCl: [],
  nameAt: [],
  namePC: [],
  namePE: '',
  clear() {
    const b = {};
    Object.assign(b, this);
    b.nameEl = '';
    b.nameID = '';
    b.nameCl = [];
    b.nameAt = [];
    b.namePC = [];
    b.namePE = '';
    b.isBasic = false;
    return b;
  },
  element(value) {
    let a = this;
    if (a.isBasic === true) {
      a = this.clear();
    }
    if (a.nameEl !== '') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (a.namePE !== '' || a.namePC?.length !== 0 || a.nameAt?.length !== 0
    || a.nameCl?.length !== 0 || a.nameID !== '') {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    a.nameEl = value;
    return a;
  },

  id(value) {
    let a = this;
    if (a.isBasic === true) {
      a = this.clear();
    }
    if (a.nameID !== '') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (a.namePE !== '' || a.namePC?.length !== 0 || a.nameAt?.length !== 0
    || a.nameCl?.length !== 0) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    a.nameID = value;
    return a;
  },

  class(value) {
    let a = this;
    if (a.isBasic === true) {
      a = this.clear();
    }
    if (a.namePE !== '' || a.namePC?.length !== 0 || a.nameAt?.length !== 0) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    a.nameCl.push(value);
    return a;
  },

  attr(value) {
    let a = this;
    if (a.isBasic === true) {
      a = this.clear();
    }
    a.nameAt.push(value);
    if (a.namePE !== '' || a.namePC?.length !== 0) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return a;
  },

  pseudoClass(value) {
    let a = this;
    if (a.isBasic === true) {
      a = this.clear();
    }
    if (a.namePE !== '') {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    a.namePC.push(value);
    return a;
  },

  pseudoElement(value) {
    let a = this;
    if (a.isBasic === true) {
      a = this.clear();
    }
    if (a.namePE !== '') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    a.namePE = value;
    return a;
  },

  combine(selector1, combinator, selector2) {
    const x = {
      a: selector1,
      b: combinator,
      c: selector2,
      stringify() {
        return `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
      },
    };
    return x;
  },
  stringify() {
    let str = '';
    if (this.nameEl !== '') {
      str += this.nameEl;
    }
    if (this.nameID !== '') {
      str += `#${this.nameID}`;
    }
    for (let i = 0; i < this.nameCl.length; i += 1) {
      str += `.${this.nameCl[i]}`;
    }
    for (let i = 0; i < this.nameAt.length; i += 1) {
      str += `[${this.nameAt[i]}]`;
    }
    for (let i = 0; i < this.namePC.length; i += 1) {
      str += `:${this.namePC[i]}`;
    }
    if (this.namePE !== '') {
      str += `::${this.namePE}`;
    }
    this.nameEl = '';
    this.nameID = '';
    this.nameCl = [];
    this.nameAt = [];
    this.namePC = [];
    this.namePE = '';
    return str;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
