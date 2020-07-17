//Storage controller
const StorageCtrl = (function(){

    //Public method:
    return{
        storeItem: function(item){
            let items;

            //Check if any items in local storage
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);

                //Set in Local Storage
                localStorage.setItem('items', JSON.stringify(items));
            }
            else{
                //Get what is already present in LS 
                items = JSON.parse(localStorage.getItem('items'));

                //Push new item
                items.push(item);

                //Re set LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemsFromStorage: function(){
            let items;
            
            if(localStorage.getItem('items') === null){
                items = [];
            }
            else{
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage: function(updatedItem){

            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(id){

            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }

})();

//Item Controller
const ItemCtrl = (function(){

    //Item contructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name  = name;
        this.calories = calories;
    }

    //Data Structures / State
    const data = {
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 300},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {

        getItems: function() {
            return data.items;
        },

        addItem: function(name, calories){
            let ID;
            //Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }
            else{
                ID = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID, name, calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
        },
        
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(item => {
                total += item.calories;
            });

            return total;
        },
        
        getItemById: function(id){
            let found = null;
            //Loop through all the items
            data.items.forEach(item => {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },

        updateItem: function(name, calories){
            //Calories to numbver
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item === data.currentItem){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });  
            return found;
        },

        deleteItem: function(id){
            //Get ids
            ids = data.items.map(function(item){
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index, 1);
        },
        
        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        logData: function() {
            return data;
        }
    }

})();

//UI Controller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    } 

    //Public methods
    return{
        populateItemList: function(items) {

            //Show List
            this.showList();

            let html = '';

            //Add items to the list
            items.forEach(item => {
                html += ` <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em >
                <a href="#" class="secondary-content">
                  <i class="fa fa-pencil"></i>
                </a>
              </li>`;
            });

            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },

        addListItem: function(item){

            //Show List
            this.showList();

            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add ID
            li.id = `item-${item.id}`;
            //Add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em >
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil"></i>
            </a>`;

            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        addItemToForm: function(){

            //Fill in the inputs with the current item

            document.querySelector(UICtrl.getSelectors().itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UICtrl.getSelectors().itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            //Show edit state
            UICtrl.showEditState();
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // console.log(listItems);

            //Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');
                // console.log(itemId);

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em >
                    <a href="#" class="secondary-content">
                      <i class="fa fa-pencil"></i>
                    </a>
                    `;
                }
            });
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        removeItems: function(){
            let listItems = document.querySelector(UISelectors.listItems);

            //Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },

        clearEditState: function(){

            UICtrl.clearInput();

            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        },

        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'block';
        },

        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

    //Load event listener
    loadEventListener = function(){
        //Get UI Selectors
        const UISelectors = UICtrl.getSelectors(); 

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode == 13 || e.which == 13){
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', function(){
            UICtrl.clearEditState();
        });

        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        
        //Clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    //Add item submit
    const itemAddSubmit = function(e){

        //Get input from UICtrl
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ''){
            
            //Create new items
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Show total calories into UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in Loacl Storage
            StorageCtrl.storeItem(newItem);

            //Clear input
            UICtrl.clearInput();
        }

        e.preventDefault();
    }; 

    //Edit item click
    const itemEditClick = function(e){

        if(e.target.parentElement.parentElement.classList.contains('collection-item')){
            //Get list item id (item-0, item-1)
            const listId = e.target.parentElement.parentElement.id;

            //Break into array
            const listIdArr = listId.split('-');

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set Current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    };

    //Update item submit
    const itemUpdateSubmit = function(e){

        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updateditem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updateditem);
        
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Show total calories into UI
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCtrl.updateItemStorage(updateditem);

        //Clear edit state
        UICtrl.clearEditState();

        e.preventDefault();
    };

    const itemDeleteSubmit = function(e){
        
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Show total calories into UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        //Clear edit state
        UICtrl.clearEditState();

        e.preventDefault();
    };

    const clearAllItemsClick = function(e){

        //Delete all items from data structure
        ItemCtrl.clearAllItems();

        //Remove from UI
        UICtrl.removeItems();

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Show total calories
        UICtrl.showTotalCalories(totalCalories);

        //Clear items from local storage
        StorageCtrl.clearItemsFromStorage();

        //Hide UL
        UICtrl.hideList();

        e.preventDefault();
    }

    //Public methods
    return{
        init: function() {

            //Clear edit state / set initial state
            UICtrl.clearEditState();

            //Fetch Components from data structure
            const items = ItemCtrl.getItems();

            if(items.length > 0){
                //Populate list with Items
                UICtrl.populateItemList(items);

                //Get total calories
                const totalCalories = ItemCtrl.getTotalCalories();

                //Show total calories into UI
                UICtrl.showTotalCalories(totalCalories);
            }
            else{
                UICtrl.hideList();
            }

            //Load event listeners
            loadEventListener();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

//Initializing App
App.init();