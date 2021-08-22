let errorText = document.querySelector('#errorText');
let addWork = document.querySelector('#addWork');
let workName = document.querySelector('#workName');
let workDiv = document.querySelector('.works');
let statusSelector = document.querySelector('#statusSelector');
let searchBar = document.querySelector('#searchBar');


// Adding element to container div
let addElement = (newWork, num = 0, divId) =>{
    let newDiv = document.createElement('div');
        newDiv.classList.add('single-work');
        let newP = document.createElement('p');
        newP.innerText = newWork;
        newDiv.appendChild(newP);

        let deleteSpan = document.createElement('span');
        let checkSpan = document.createElement('span');

        deleteSpan.className = 'fa fa-trash icon red';
        checkSpan.className = 'fa fa-check-square-o icon green';

        newDiv.appendChild(deleteSpan);
        newDiv.appendChild(checkSpan);

        if(statusSelector.value === 'Completed'){
            newDiv.classList.add('hiding-input');
        }
        newDiv.draggable = true;
        if(num === 1){
            newDiv.classList.add('scale-down');
        }
        newDiv.id = divId;
        if(searchBar.value.length !== 0 && searchBar.value.indexOf(newWork) === -1){
            newDiv.classList.add('hiding-input');
        }
        newDiv.classList.add('scale-up');
        workDiv.appendChild(newDiv);
        setTimeout(() => {
            newDiv.classList.remove('scale-up');
        }, 500)
        

}

// pre loading initial localStorage elements to container div
window.addEventListener('DOMContentLoaded', () => {
    let workArray = JSON.parse(localStorage.getItem('workArray'));
    for(let i = 0; i < workArray.length; i++){
        addElement(workArray[i].name, workArray[i].val, workArray[i].date);
    }
})

// creating new element entered by user
addWork.addEventListener('click', () => {
    if(workName.value.length === 0){
        errorText.classList.remove('hiding-input');
    }else{
        let newWork = workName.value;
        workName.value = '';
        
        let workArray = JSON.parse(localStorage.getItem('workArray'));
        if(workArray === null){
            workArray = [];
        }
        let currDate = Date.now();

        addElement(newWork, 0, currDate);
        const newArrayElement = {'name': newWork, 'val': 0, 'date': currDate};
        workArray.push(newArrayElement);
        localStorage.setItem('workArray', JSON.stringify(workArray));

    }
})
// error message trigger on empty length work add
workName.addEventListener('input', () =>{
    errorText.classList.add('hiding-input');
})


workDiv.addEventListener('click', (e) =>{
    if(e.target.nodeName === 'SPAN'){

        let tempWorkArray = JSON.parse(localStorage.getItem('workArray'));
        let clickedDivId = e.target.parentElement.id;
        let pos = -1;
        for(let i = tempWorkArray.length - 1; i >= 0; i--){
            if(tempWorkArray[i].date === Number(clickedDivId)){
                if(e.target.classList.contains('red')){
                    e.target.parentElement.classList.add('scale-super-down');
                    setTimeout(() => {
                        e.target.parentElement.remove();
                    },500);
                    tempWorkArray.splice(i, 1);
                    pos = i;
                }else if(e.target.classList.contains('green')){
                    e.target.parentElement.classList.toggle('scale-down');
                    tempWorkArray[i].val ^= 1;
                }
            }
        }
        localStorage.setItem('workArray', JSON.stringify(tempWorkArray));
    }
})

let getClosestElement = (y) => {
    let minimum = Number.NEGATIVE_INFINITY;
    let minElement = null;
    let allWorks = document.querySelectorAll('.single-work');
    for(let i = 0; i < allWorks.length; i++){
        let box = allWorks[i].getBoundingClientRect();
        let diff = y - box.top - box.height / 2;
        if(diff < 0 && diff > minimum){
            minimum = diff;
            minElement = allWorks[i];
        }
    }
    return minElement;
}
workDiv.addEventListener('dragstart', (e) =>{
    if(e.target.nodeName === 'DIV'){
        e.target.classList.add('current-drag');
    }
})
workDiv.addEventListener('dragend', (e) =>{
    if(e.target.nodeName === 'DIV'){
        e.target.classList.remove('current-drag');
    }
})
workDiv.addEventListener('dragover', (e) => {
    if(e.target.nodeName === 'DIV'){
        e.preventDefault();
        const dragElement = document.querySelector('.current-drag');
        let closestElement = getClosestElement(e.clientY);
        
        if(closestElement !== null){
            workDiv.insertBefore(dragElement, closestElement);
        }else{
            workDiv.appendChild(dragElement);
        }
    }
})


// search and select bar filter
let doChangeInView = () => {
    let tempWorkArray = JSON.parse(localStorage.getItem('workArray'));
    for(let work of tempWorkArray){
        let divWithThisId = document.getElementById(work.date.toString());
        if((work.name.toLowerCase()).indexOf(searchBar.value.toLowerCase()) === -1){
            divWithThisId.classList.add('hiding-input');
        }
        else{
            if(statusSelector.value === 'Completed' && !divWithThisId.classList.contains('scale-down')){
                divWithThisId.classList.add('hiding-input');
            } else if(statusSelector.value === 'Incomplete' && divWithThisId.classList.contains('scale-down')){
                divWithThisId.classList.add('hiding-input');
            }else{
                divWithThisId.classList.remove('hiding-input');
            }
        }
    }
}
searchBar.addEventListener('input', () => {
    doChangeInView();
})
statusSelector.addEventListener('change', () => {
    doChangeInView();
})
