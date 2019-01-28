const createElement = elType => document.createElement(elType);
const getElementById = id => document.getElementById(id);
const modalComponent = getElementById('modal');
const addBookBtn = getElementById('addBook');
const cancelBtn = getElementById('cancel');
const saveBtn = getElementById('save');
const isReadModalInput = getElementById('isReadModalInput');
const titleModalInput = getElementById('titleModalInput');
const authorModalInput = getElementById('authorModalInput');
const publishingHouseModalInput = getElementById('publishingHouseModalInput');
const dateModalInput = getElementById('dateModalInput');
const tagsModalInput = getElementById('tagsModalInput');

const eventHandling = () => {
    cancelBtn.onclick = () => modal.cancel();
    saveBtn.onclick = () => modal.saveBook();
};

modal = {
    isModalShown: false,
    currentId: '',
    getDataFromModal() {
        const isRead = isReadModalInput.checked;
        const title = titleModalInput.value;
        const author = authorModalInput.value;
        const publishingHouse = publishingHouseModalInput.value;
        const date = dateModalInput.value;
        const tags = tagsModalInput.value;

        return {
            isRead,
            title,
            author,
            publishingHouse,
            date,
            tags
        };
    },
    addBook() {
        this.showModal();
    },
    editBook(id) {
        this.showModal();
        this.currentId = id;
        const currentBook = storage.getEntity(id);
        isReadModalInput.checked = currentBook.isRead;
        titleModalInput.value = currentBook.title;
        authorModalInput.value = currentBook.author;
        publishingHouseModalInput.value = currentBook.publishingHouse;
        dateModalInput.value = currentBook.date;
        tagsModalInput.value = currentBook.tags;  
    },
    saveBook() {
        const data = this.getDataFromModal();
        const currentId = this.currentId;
        currentId ? storage.updateEntity(currentId, data) : storage.addEntity(data);
        this.clearModal();
        this.showModal();
        this.callRender();
    },
    clearModal() {
        isReadModalInput.checked = false;
        titleModalInput.value = '';
        authorModalInput.value = '';
        publishingHouseModalInput.value = '';
        dateModalInput.value = '';
        tagsModalInput.value = '';
        this.currentId = '';
    },
    showModal() {
        const style = this.isModalShown ? 'none' : 'block';
        modalComponent.style.display = style;
        this.isModalShown = !this.isModalShown;
    },
    cancel() {
        this.clearModal();
        this.showModal();
    },
    callRender() {
        pubsub.publish('render');
    }
};

eventHandling();