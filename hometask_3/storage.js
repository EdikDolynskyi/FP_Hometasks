const Books = [
    {
        id: 1,
        title: 'Robin Hood',
        author: 'Anonymous balladeers',
        publishingHouse: 'DomDom',
        date: 'Sat Jan 26 2019 16:01:26 GMT+0200',
        tags: ['adventures'],
        isRead: false
    },
    {
        id: 2,
        title: 'The Adventures of Tom Sawyer',
        author: 'Mark Twain',
        publishingHouse: 'Boom',
        date: 'Sat Jan 26 1876 16:01:26 GMT+0200',
        tags: ['adventures'],
        isRead: true
    },
    {
        id: 3,
        title: 'I, Robot',
        author: 'Isaac Asimov',
        publishingHouse: 'Boom',
        date: 'Sat Jan 26 1950 16:01:26 GMT+0200',
        tags: ['science fiction'],
        isRead: true
    }
];

storage = {
    books: Immutable.List(Books),
    getList() {
        return this.books;
    },
    getIndex(id) {
        return this.books.findIndex(item => item.id === id);
    },
    addEntity(entity) {
        this.books = this.books.push(entity);
    },
    editEntity(id, entity) {
        const oldEntityIndex = this.getIndex(id);
        const updater = (item) => mergeDeep(item, entity);
        this.books = this.books.update(oldEntityIndex, updater);
    },
    removeEntity(id) {
        const itemIndex = this.getIndex(id);
        this.books = this.books.delete(itemIndex)
    }
};
