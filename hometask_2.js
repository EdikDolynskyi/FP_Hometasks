const map = require('lodash/fp/map').convert({ 'cap': false });
const chunk = require('lodash/fp/chunk');
const pipe = require('lodash/fp/pipe');
const flatten = require('lodash/fp/flatten');
const curry = require('lodash/fp/curry');

const table = [
    [
        { id: 0, row: 0, column: 0, position: 1 },
        { id: 1, row: 1, column: 0, position: 2 },
        { id: 2, row: 2, column: 0, position: 3 }
    ],
    [
        { id: 3, row: 0, column: 1, position: 4 },
        { id: 4, row: 1, column: 1, position: 5 },
        { id: 5, row: 2, column: 1, position: 6 }
    ],
    [
        { id: 6, row: 0, column: 2, position: 7 },
        { id: 7, row: 1, column: 2, position: 8 },
        { id: 8, row: 2, column: 2, position: 9 }
    ]
];

const rearrangeMatrix = (table = [], newColumn, newRow, item) => {
    const rowLength = table.length ? table[0].length : 0;

    const moveItem = (array, item, from, to) => {
        const insertItem = (list, newItem, index) => [
            ...list.slice(0, index+1),
            newItem,
            ...list.slice(index+1)
        ];

        const remove = (list, index) =>  [
            ...list.slice(0, index),
            ...list.slice(index+1)
        ];

        const index = from > to ? to : from;
        return remove(insertItem(array, item, to), index);
    };

    const move = curry((item, arr) => {
        const getItemIndex = (posX, posY, rLength) => posX * rLength + posY;
        const oldItemIndex = getItemIndex(item.column, item.row + 1, rowLength) - 1;
        const newItemIndex = getItemIndex(newColumn, newRow + 1, rowLength) - 1;
        return moveItem(arr, item, oldItemIndex, newItemIndex);
    });

    const mapper = (item, index) => ({
        id: item.id,
        row: index % rowLength,
        column: parseInt(index / rowLength),
        position: index + 1
    });

    return pipe(
        flatten,
        move(item),
        map(mapper),
        chunk(rowLength)
    )(table);
};


const newColumn = 2;
const newRow = 2;
const item = table[0][0];

const newTable = rearrangeMatrix(table, newColumn, newRow, item);
// console.log(newTable);