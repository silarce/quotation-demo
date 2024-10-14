import { camelCase } from 'change-case';

// .netCore api返回的資料都是蛇式命名，
// 使的來自js/api/dtoTypes.ts的dto也都變成蛇式命名，導致型別不對
// 因此使用這個函數將dto轉換成駝峰式命名

const snakeToCamel = (property: any) => {
  if (Array.isArray(property)) {
    property.forEach((item) => snakeToCamel(item));
  } else if (typeof property === 'object' && property !== null) {
    property = Object.entries(property).reduce((newProperty, [key, value]) => {
      newProperty[camelCase(key)] = snakeToCamel(value);
      delete newProperty[key];

      return newProperty;
    }, property);
  }

  return property;
};

const dtoSnakeToCamel = (dto: object) => {
  return snakeToCamel(dto);
};

export { dtoSnakeToCamel };

// copilot的版本，要注意的是這個版本是camelToSnake
// const convertKeysToSnakeCase = (obj: any): any => {
//   if (Array.isArray(obj)) {
//     return obj.map((item) => convertKeysToSnakeCase(item));
//   } else if (obj !== null && obj.constructor === Object) {
//     return Object.keys(obj).reduce((acc, key) => {
//       const snakeKey = snakeCase(key);
//       acc[snakeKey] = convertKeysToSnakeCase(obj[key]);
//       return acc;
//     }, {} as any);
//   }
//   return obj;
// };
