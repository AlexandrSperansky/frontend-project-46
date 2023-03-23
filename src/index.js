import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const genDiff = (path1, path2) => {
  const data1 = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '__fixtures__', path1), 'utf-8'));
  const data2 = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '__fixtures__', path2), 'utf-8'));
  const keys = _.union(Object.keys(data1).concat(Object.keys(data2))).sort()
    .map((key) => {
      if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
        return { key, value: data1[key], type: 'deleted' };
      }
      if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
        return { key, value: data2[key], type: 'added' };
      }
      if (data1[key] !== data2[key]) {
        return { key, oldValue: data1[key], newValue: data2[key], type: 'changed' };
      }
      return { key, value: data1[key], type: 'not changed' }
    });
  const result = keys.map((item) => {
    switch (item.type) {
      case 'deleted':
        return `  - ${item.key}: ${item.value}`;
      case 'added':
        return `  + ${item.key}: ${item.value}`;
      case 'changed':
        return [[`  - ${item.key}: ${item.oldValue}`], [`  + ${item.key}: ${item.newValue}`]].flat();
      case 'not changed':
        return `    ${item.key}: ${item.value}`
    }
  })
  console.log(result.flat().join('\n'));
};

export default genDiff;