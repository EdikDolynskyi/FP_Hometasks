//Hometask 1

const data = [{
    name: 'TV',
    price: 300,
    date: '2018-10-10'
}, {
    name: 'laptop',
    price: 600,
    date: '2018-10-12'
}, {
    name: 'PC',
    price: 800,
    date: '2018-09-05'
}, {
    name: 'owen',
    price: 300
}, {
    name: 'Camera',
    price: 500,
    date: '2018-03-03'
}, {
    name: 'Fridge',
    price: 1000,
    date: '2018-12-11'
}, {
    name: 'table',
    price: 150,
    date: '2018-12-10'
}, {
    name: 'Sofa',
    price: 400,
    date: '2018-12-10'
}, {
    name: 'chair',
    date: '2018-09-10'
}, {
    name: 'Window',
    price: 300,
    date: '2018-05-05'
}];

// methods can be imported from the lodash or another library
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const curry = fn => (...args) => fn.bind(null, ...args);
const map = curry((fn, arr) => arr.map(fn));
const sort = curry((fn, arr) => arr.sort(fn));
const reduce = curry((fn, arr) => arr.reduce(fn, {}));
const partial = (fn, ...initArgs) => (...restArgs) => fn(...initArgs, ...restArgs);
const partition = (array, isValid) => {
    return array.reduce(([pass, fail], elem) => {
        return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    }, [[], []]);
};
//


const print = (matrix = [], fail = []) => {
    console.log('--------  Correct data  ---------');
    Object.keys(matrix).map(key => console.log(`${key}: ${matrix[key].join(', ')}`));

    console.log('\n--------  Incorrect data  ---------');
    console.log(fail);
};

const transform = (data) => {
    const extendPrice = (currency, price) => currency + price;
    const extendPriceByDollar = partial(extendPrice, '$');
    const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('');
    const capitalizeObjectName = item => ({...item, name: capitalize(item.name) });
    const extendObjectPrice = item => ({...item, price: extendPriceByDollar(item.price) });
    const validate = item => item.name && item.price && item.date;
    const formatDate = date => parseInt(date.replace(/-/g,''));
    const comparator = (a, b) => formatDate(a.date) - formatDate(b.date);
    const getValue = item => `${item.name} - ${item.price}`;
    const combineData = (accum, crtValue) => {
        return {...accum, [crtValue.date]: [...(accum[crtValue.date] || []), getValue(crtValue)]};
    };
    
    const getMatrix = compose(
        reduce(combineData),
        sort(comparator),
        map(capitalizeObjectName),
        map(extendObjectPrice) 
    );
    
    const [pass, fail] = partition(data, validate);
    const matrix = getMatrix(pass);
    print(matrix, fail);
};

// transform(data);
