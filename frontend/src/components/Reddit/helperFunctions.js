import axios from 'axios';
const c = require('./constants/constants');

export function getUncommon(sentence) {
  let words = sentence.match(/\w+/g);
  let common = new Set(c.WORDLIST);
  let uncommon = [];
  for (let word of words) {
    let cleaned = word.trim().toLowerCase();
    if (!common.has(cleaned)) {
      uncommon.push(cleaned);
    }
  }
  return uncommon;
}

export function isFalsy(obj) {
  Object.values(obj).every((value) => {
    if (!value) {
      return true;
    }
    return false;
  });
}

export function getWordList(str) {
  let arr = [];
  let array = str.split(' ');
  let map = {};
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    map[item] = map[item] + 1 || 1;
  }
  for (const property in map) {
    let obj = {};
    obj.value = property;
    obj.count = map[property];
    arr.push(obj);
  }
  arr.sort((a, b) => b.count - a.count);
  return arr.slice(0, 30);
}
