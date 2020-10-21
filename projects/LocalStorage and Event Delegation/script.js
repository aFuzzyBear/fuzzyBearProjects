/**
 * @var form - <form.form> Element from DOM 
 */
const form = document.querySelector('.form')
/**
 * @var domList - <ul.class> from DOM
 */
const domList = document.querySelector('.list')
/**
 * @var getItemsLocalStorage - Takes Items that persist through localStorage and Parses them from string to objects using JSON.parse()
 */
const getItemsLocalStorage = JSON.parse(localStorage.getItem('StoredItems'))
/**
 * @var clearListBtn - <button.btn-clearList> from DOM
 */
const clearListBtn = document.querySelector('.btn-clearList')
/**
 * @var items - Array which will contain the list objects
 */
let items = []

function addItem(/**{Event} */ event){
    //This prevents the page reloading when submitting the form

    event.preventDefault();
    //@this binds to the form element not the window 
    const text = (this.querySelector('#checklist-item')).value
    const item = {
        text,
        checked:false,

    }
    items.push(item)
    //restores the forms default values
    // items += addItems
    this.reset();
    
    populateList(items,domList)
    localStorage.setItem('StoredItems',JSON.stringify(items))
    console.log(items, item)
    // return items = addItems
}
/**
 * 
 * @param {Array} items 
 * @param {HTMLUListElement} DOMList 
 */
function populateList(items = [], DOMList){
    DOMList.innerHTML =  items.map((current,index)=>{
        return `
        
        <li class="item">
            <input type='checkbox' data-index=${index} id="item-${index}" ${current.checked ? 'checked': ''}>
            
               <p class="item-text"> ${current.text}</p>
                ${current.checked ? `<button class="btn-delete" data-index=${index}>DEL</button>` : ''}
            </li>
        `
    }).join('');

}
function toggleDone(event){
    //Event delegation
    if(!event.target.matches('input')) return
    const element = event.target;
    const index = element.dataset.index;

    if(items.length > 0) items[index].checked = !items[index].checked
    
    localStorage.setItem('StoredItems',JSON.stringify(items))
    populateList(items,domList)
}
function deleteItem(event){
    console.log(event.target)
    
    if(event.target.matches('.btn-delete')) {

    const element = event.target
    const index = element.dataset.index

    // remove item from list
    items.splice(index,1)
    populateList(items,domList)
    localStorage.setItem('StoredItems',JSON.stringify(items))
    }
}

function clearList(event){
    if(event.target.matches('.btn-clearList')){
        items = new Array();
        
        localStorage.clear()
        populateList(items,domList)



    }
}
function onloadPopulateList(){
    if(getItemsLocalStorage != null){
        items = [...getItemsLocalStorage]
        populateList(items,domList)
    }else{
        ''
    }
}
populateList(items,domList)


//Event Listeners
document.addEventListener('DOMContentLoaded',onloadPopulateList)

form.addEventListener('submit', addItem)

clearListBtn.addEventListener('click',clearList)

domList.addEventListener('click',toggleDone)
domList.addEventListener('click',deleteItem)

