// const input = `
// {
//     "id": "TestClass",
//     "type": "aggregate",
//     "attributes": [
//       {
//         "id": "miles",
//         "type": "Miles"
//       }
//     ]
//   }
// `;
// console.log(
//   'Parsed:',
//   JSON.parse(input, (key: string, value: any) => {
//     if (key === '') {
//       console.log('My parsed:', value);
//     }
//     return value;
//   })
// );
export * from './builder';
export * from './evaluation';
export * from './exceptions';
export * from './model';
export * from './retriever';
