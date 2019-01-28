(() => {
    const createElement = elType => document.createElement(elType);
    const getElementById = id => document.getElementById(id);
    
    const booksElem = getElementById('books');
    const isReadElem = getElementById("isRead");
    const autorElem = getElementById("author");
    const dateElem = getElementById("date");
    const tagItemsElem = getElementById("tag-items");
    const tagSelectBoxElem = getElementById("selectBox");
    let expandedMultiSelect = false;

    const eventHandling = () => {
        isReadElem.onclick = () => render();
        autorElem.onchange = () => render();
        dateElem.onchange = () => render();
        tagItemsElem.onchange = () => render();
        tagSelectBoxElem.onclick = () => showCheckboxes();
        addBookBtn.onclick = () => addNewBook();
        pubsub.subscribe('render', () => render());
    };

    const showCheckboxes = () => {
        const style = expandedMultiSelect ? 'none' : 'block';
        tagItemsElem.style.display = style;
        expandedMultiSelect = !expandedMultiSelect;
    };

    const addNewBook = () => modal.addBook();
    const editBook = (id) => modal.editBook(id);
    const deleteBook = (id) => {
        storage.removeEntity(id);
        render();
    };

    const getListItem = (data) => {
        const { id, title, author, publishingHouse, date, tags, isRead } = data;
         
        const getTitleEl = (title) => {
            const el = createElement('span');
            el.innerText = title;
            el.className = 'title';
            return el;
        };

        const getDetailsEl = (value, keyword) => {
            const el = createElement('span');
            el.innerText = `${keyword}: ${value}`;
            el.className = keyword;
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

        const getDetailsText = () => {
            const detailsText = createElement('span');
            detailsText.innerText = 'Details';
            return detailsText;
        };
        
        const getDetailsElement = (detailsText, publishingHouseEl, dateEl, tagsEl) => {
            const detailsEl = createElement('div');
            detailsEl.className = 'details';
            detailsEl.append(detailsText);
            detailsEl.append(publishingHouseEl);
            detailsEl.append(dateEl);
            detailsEl.append(tagsEl);
            return detailsEl;
        };

        const getContainerHeader = (isReadEl, titleEl, authorEl) => {
            const containerHeader = createElement('div');
            containerHeader.className = 'containerHeader';
            containerHeader.append(isReadEl);
            containerHeader.append(titleEl);
            containerHeader.append(authorEl);
            return containerHeader;
        };

        const getContainerMenu = (deleteButton, editButton) => {
            const containerMenu = createElement('div');
            containerMenu.className = 'containerMenu';
            containerMenu.append(deleteButton);
            containerMenu.append(editButton);
            return containerMenu;
        };

        const getContainer = (containerHeader, containerMenu, detailsEl) => {
            const container = createElement('li');
            container.id = id;
            container.append(containerHeader);
            container.append(containerMenu);
            container.append(detailsEl);
            return container;
        };

        const deleteButton = getItemButton('Delete', deleteBook, id);
        const editButton = getItemButton('Edit', editBook, id);
        const titleEl = getTitleEl(title);
        const isReadEl = getDetailsEl(isRead, 'is read');
        const authorEl = getDetailsEl(author, 'author');
        const publishingHouseEl = getDetailsEl(publishingHouse, 'Publishing House');
        const dateEl = getDetailsEl(date, 'Date');
        const tagsEl = getDetailsEl(tags, 'Tags');
        const detailsText = getDetailsText();
        const detailsEl = getDetailsElement(detailsText, publishingHouseEl, dateEl, tagsEl);
        const containerHeader = getContainerHeader(isReadEl, titleEl, authorEl);
        const containerMenu = getContainerMenu(deleteButton, editButton);
        return getContainer(containerHeader, containerMenu, detailsEl);;
    };

    const getSelectedTags = (tagItemsElem) => {
        const allInputs = tagItemsElem.getElementsByTagName('input');
        return [...allInputs].filter(item => {
            return item.checked;
        }).map(item => item.value);
    };

    const updateFilterOptions = () => {
        const booksData = storage.getList();
        const autors = booksData.map(item => item.author).toSet().toList();
        const dates = booksData.map(item => item.date).toSet().toList();
        const tags = booksData.reduce((accum, curValue) => {
            return accum.concat(curValue.tags);
        }, Immutable.List([])).toSet().toList();

        const addOptions = (el, options) => {
            options.forEach(option => el.options.add( new Option(option, option)));
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
        const getViewParams = () => {
            const isRead = isReadElem.checked;
            const author = autorElem.options[autorElem.selectedIndex].text;
            const date = dateElem.options[dateElem.selectedIndex].text;
            const tags = getSelectedTags(tagItemsElem);
            return { isRead, author, date, tags };
        };

        const uploadList = (viewParams) => {
            const filteredList = storage.getFilterEntites(viewParams);
            booksElem.innerHTML = '';
            filteredList.forEach(item => booksElem.appendChild(getListItem(item)));
        };

        uploadList(getViewParams());
    };

    eventHandling();
    updateFilterOptions();
    render();
})();