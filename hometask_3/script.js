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

    isReadElem.onclick = () => render();
    autorElem.onchange = () => render();
    dateElem.onchange = () => render();
    tagItemsElem.onchange = () => render();
    tagSelectBoxElem.onclick = () => showCheckboxes();


    const getListItem = (data) => {
        const { id, title, author, publishingHouse, date, tags, isRead } = data;
        const container = createElement('li');
        const containerHeader = createElement('div');
        const containerMenu = createElement('div');
        const titleEl = getTitleEl(title);
        const authorEl = getAuthorEl(author);
        const isReadEl = getIsReadEl(isRead);
        const publishingHouseEl = getPublishingHouseEl(publishingHouse);
        const dateEl = getDateEl(date);
        const tagsEl = getTagsEl(tags);
        const detailsText = createElement('span');
        const detailsEl = createElement('div');
        const deleteButton = getDeleteButton(id);
        const editButton = getEditButton(id);

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
        el.innerText = isRead;
        return el;
    };

    const getDateEl = (date) => {
        const el = createElement('span');
        el.innerText = date;
        return el;
    };

    const getPublishingHouseEl = (publishingHouse) => {
        const el = createElement('span');
        el.innerText = publishingHouse;
        return el;
    };

    const getTagsEl = (tags) => {
        const el = createElement('span');
        el.innerText = tags;
        return el;
    };

    const getDeleteButton = (id) => {
        const btn = createElement('button');
        btn.innerHTML = 'Delete';
        btn.onclick = function() {
            return deleteItem(id);
        };
        return btn;  
    };

    const getEditButton = (id) => {
        const btn = createElement('button');
        btn.innerHTML = 'Edit';
        return btn;  
    };




    const showCheckboxes = () => {
        const tagItems = document.getElementById("tag-items");
        if (!expandedMultiSelect) {
            tagItems.style.display = "block";
            expandedMultiSelect = true;
        } else {
            tagItems.style.display = "none";
            expandedMultiSelect = false;
        }
    };




    const hasTags = (tags, itemTags) => {
        const hasTags = tags.length && itemTags.length;
        return !hasTags || tags.filter(value => itemTags.includes(value)).length;
    };

    const hasParam = (currParam, currItem) => {
        const isArray = Array.isArray(currParam);
        return isArray ? hasTags(currParam, currItem) : currParam === currItem;
    };
    
    const filterEntites = (list, params) => {
        const filterKeys = Object.keys(params).filter(item => params[item] !== 'None');
        return list.filter(item => filterKeys.every(key => hasParam(params[key], item[key])));
    };

    const uploadList = (list, viewParams) => {
        const filteredList = filterEntites(list, viewParams);
        booksElem.innerHTML = '';
        filteredList.forEach(item => {
            const el = getListItem(item);
            booksElem.appendChild(el);
        });
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

    const render = () => {
        const booksData = storage.getList();
        const viewParams = getViewParams();
        uploadList(booksData, viewParams);
    };

    const updateFilterOptions = () => {
        const booksData = storage.getList();
        const autors = booksData.map(item => item.author).toSet().toList();
        const dates = booksData.map(item => item.date).toSet().toList();
        const tags = booksData.reduce((accum, curValue) => {
            return accum.concat(curValue.tags);
        }, Immutable.List([])).toSet().toList();

        addOptions(autorElem, autors);
        addOptions(dateElem, dates);
        addTagOptions(tagItemsElem, tags);
    };

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

    const deleteItem = (id) => {
        storage.removeEntity(id);
        render();
    };

    updateFilterOptions();
    render();
})();