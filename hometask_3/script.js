(() => {
    const createElement = elType => document.createElement(elType);
    const getElementById = id => document.getElementById(id);
    
    const booksElem = getElementById('books');
    const isReadElem = getElementById("isRead");
    const autorElem = getElementById("author");
    const dateElem = getElementById("date");
    const tagItemsElem = getElementById("tag-items");
    const tagSelectBoxElem = getElementById("selectBox");
    const modal = getElementById('modal');
    const addBookBtn = getElementById('addBook');
    const cancelBtn = getElementById('cancel');
    const saveBtn = getElementById('save');
    const isReadModalInput = getElementById('isReadModalInput');
    const titleModalInput = getElementById('titleModalInput');
    const authorModalInput = getElementById('authorModalInput');
    const publishingHouseModalInput = getElementById('publishingHouseModalInput');
    const dateModalInput = getElementById('dateModalInput');
    const tagsModalInput = getElementById('tagsModalInput');
    

    const viewState = {
        expandedMultiSelect: false,
        isModalShown: false
    }; 
    
    const setState = (keyword, value) => {
        viewState[keyword] = value;
    };

    const eventHandling = () => {
        isReadElem.onclick = () => render();
        autorElem.onchange = () => render();
        dateElem.onchange = () => render();
        tagItemsElem.onchange = () => render();
        tagSelectBoxElem.onclick = () => showCheckboxes();
        addBookBtn.onclick = () => showModal();
        cancelBtn.onclick = () => showModal();
        saveBtn.onclick = () => addNewBook();
    };

    const showCheckboxes = () => {
        const style = viewState.expandedMultiSelect ? 'none' : 'block';
        tagItemsElem.style.display = style;
        setState('expandedMultiSelect', !viewState.expandedMultiSelect);
    };

    const showModal = () => {
        const style = viewState.isModalShown ? 'none' : 'block';
        modal.style.display = style;
        setState('isModalShown', !viewState.isModalShown);
    };

    const clearModal = () => {
        isReadModalInput.checked = false;
        titleModalInput.value = '';
        authorModalInput.value = '';
        publishingHouseModalInput.value = '';
        dateModalInput.value;
        // tagsModalInput.value = '';
    };

    const addNewBook = () => {
        const isRead = isReadModalInput.checked;
        const title = titleModalInput.value;
        const author = authorModalInput.value;
        const publishingHouse = publishingHouseModalInput.value;
        const date = dateModalInput.value;
        // const tags = tagsModalInput.value;

        storage.addEntity({
            isRead,
            title,
            author,
            publishingHouse,
            date
        });
        clearModal();
        showModal();
        render();
    };

    const editBook = (id) => {
        storage.removeEntity(id);
        render();
    };

    const deleteBook = (id) => {
        storage.removeEntity(id);
        render();
    };

    const getListItem = (data) => {
        const { id, title, author, publishingHouse, date, tags, isRead } = data;
        const container = createElement('li');
        const containerHeader = createElement('div');
        const containerMenu = createElement('div');

        const getTitleEl = (title) => {
            const el = createElement('span');
            el.innerText = title;
            el.className = 'title';
            return el;
        };
    
        const getAuthorEl = (autor) => {
            const el = createElement('span');
            el.innerText = `author: ${autor}`;
            el.className = 'author';
            return el;
        };
    
        const getIsReadEl = (isRead) => {
            const el = createElement('span');
            el.checked = isRead;
            return el;
        };
    
        const getDateEl = (date) => {
            const el = createElement('span');
            el.innerText = `Date: ${date}`;
            return el;
        };
    
        const getPublishingHouseEl = (publishingHouse) => {
            const el = createElement('span');
            el.innerText = `Publishing House: ${publishingHouse}`;
            return el;
        };
    
        const getTagsEl = (tags) => {
            const el = createElement('span');
            return el;
        };

        const getItemButton = (text, event, id) => {
            const btn = createElement('button');
            btn.innerHTML = text;
            btn.onclick = function() {
                return event(id);
            };
            return btn;  
        };

        const titleEl = getTitleEl(title);
        const authorEl = getAuthorEl(author);
        const isReadEl = getIsReadEl(isRead);
        const publishingHouseEl = getPublishingHouseEl(publishingHouse);
        const dateEl = getDateEl(date);
        const tagsEl = getTagsEl(tags);
        const detailsText = createElement('span');
        const detailsEl = createElement('div');
        const deleteButton = getItemButton('Delete', deleteBook, id);
        const editButton = getItemButton('Edit', editBook, id);

        detailsText.innerText = 'Details';
        detailsEl.className = 'details';
        detailsEl.append(detailsText);
        detailsEl.append(publishingHouseEl);
        detailsEl.append(dateEl);
        detailsEl.append(tagsEl);
        
        containerHeader.className = 'containerHeader';
        containerHeader.append(isReadEl);
        containerHeader.append(titleEl);
        containerHeader.append(authorEl);
        
        containerMenu.className = 'containerMenu';
        containerMenu.append(deleteButton);
        containerMenu.append(editButton);

        container.id = id;
        container.append(containerHeader);
        container.append(containerMenu);
        container.append(detailsEl);
        return container;
    };

    const getSelectedTags = (tagItemsElem) => {
        const allInputs = tagItemsElem.getElementsByTagName('input');
        return [...allInputs].filter(item => {
            return item.checked;
        }).map(item => item.value);
    }

    const getViewParams = () => {
        const isRead = isReadElem.checked;
        const author = autorElem.options[autorElem.selectedIndex].text;
        const date = dateElem.options[dateElem.selectedIndex].text;
        const tags = getSelectedTags(tagItemsElem);
        return { isRead, author, date, tags };
    };

    const updateFilterOptions = () => {
        const booksData = storage.getList();
        const autors = booksData.map(item => item.author).toSet().toList();
        const dates = booksData.map(item => item.date).toSet().toList();
        const tags = booksData.reduce((accum, curValue) => {
            return accum.concat(curValue.tags);
        }, Immutable.List([])).toSet().toList();

        const addOptions = (el, options) => {
            options.forEach(option => {
                el.options.add( new Option(option, option));
            });
        };
    
        const addTagOptions = (el, options) => {
            options.forEach(option => {
                const input = createElement('input');
                input.type = 'checkbox';
                input.value = option;
                input.id = option;
    
                const label = createElement('label');
                label.htmlFor = option;
                label.appendChild(input);
                label.appendChild(document.createTextNode(option));            
                el.append(label);
            });
        };

        addOptions(autorElem, autors);
        addOptions(dateElem, dates);
        addTagOptions(tagItemsElem, tags);
    };

    const render = () => {
        const uploadList = (viewParams) => {
            const filteredList = storage.getFilterEntites(viewParams);
            booksElem.innerHTML = '';
            filteredList.forEach(item => booksElem.appendChild(getListItem(item)));
        };

        const viewParams = getViewParams();
        uploadList(viewParams);
    };

    const initialisation = () => {
        eventHandling();
        updateFilterOptions();
        render();
    };

    initialisation();
})();