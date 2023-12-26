const insertion = document.getElementById('insertion-sort');
const selection = document.getElementById('selection-sort');
const quick = document.getElementById('quick-sort');
const mixButton = document.getElementById('entropy');
const IDS = "el_";
let elements = [];
let ongoingSort = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function randMix(){
    elements = [];

    for(let i = 0; i < 60; i++){
        elements.push(Math.floor(Math.random() * 400) + 100);
    }
}

async function InsertionSort(ms){
    ongoingSort = true;
    for(let i = 1; i < elements.length; i++){
        let j = i;
        while(j > 0 && elements[j] < elements[j - 1]){
            let temp = elements[j];
            elements[j] = elements[j - 1];
            elements[j - 1] = temp;
            await swapHeight(j, j - 1, ms);
            j--;
        }
    }
    ongoingSort = false;
}

async function SelectionSort(ms){
    ongoingSort = true;
    for (let i = 0; i < elements.length; ++i) {
        let indexSmallest = i;
        for (let j = i + 1; j < elements.length; ++j) {
            if (elements[j] < elements[indexSmallest]) {
                indexSmallest = j;
            }
        }
        let temp = elements[i];
        elements[i] = elements[indexSmallest];
        elements[indexSmallest] = temp;
        await swapHeight(i, indexSmallest, ms);
    }
    ongoingSort = false;
}

function updateHeights(){
    for(let i = 1; i <= elements.length; i++){
        let id = IDS + "" + i;
        let el = document.getElementById(id);
        el.style.height = elements[i - 1] + 'px';
    }
}

async function swapHeight(i, j, ms){
    await sleep(ms);
    let one = document.getElementById(IDS + '' + (i + 1));
    let two = document.getElementById(IDS + '' + (j + 1));
    one.style.height = elements[i] + 'px';
    two.style.height = elements[j] + 'px';
}

async function Partition(i, k, ms){
    let l = i;
    let h = k;
    let midpoint = Math.floor(i + (k - i) / 2);
    let pivot = elements[midpoint];
    let done = false;

    while(!done){
        while(elements[l] < pivot){
            l++;
        }
        while(elements[h] > pivot){
            h--;
        }

        if(l>=h){
            done = true;
        }
        else{
            let temp = elements[l];
            elements[l] = elements[h];
            elements[h] = temp;
            await swapHeight(l, h, ms);
            l++;
            h--;
        }
    }

    return h;
}

async function QuickSort(i, k, ms){
    if(i >= k) return;
    j = await Partition(i, k, ms);
    await QuickSort(i, j, ms);
    await QuickSort(j + 1,k, ms);
}

//Initial:
randMix();
updateHeights();

quick.addEventListener("click", ()=>{
    if(!ongoingSort){
        ongoingSort = true;
        QuickSort(0, elements.length - 1, 50);
        ongoingSort = false;
    }else{
        alert('Sorting algorithm is currently ongoing');
    }
})


insertion.addEventListener("click", ()=>{
    if(!ongoingSort){
        InsertionSort(10);
    }else{
        alert('Sorting algoritm is currently ongoing.');
    }
});

selection.addEventListener("click", ()=>{
    if(!ongoingSort){
        SelectionSort(40);
    }else{
        alert('Sorting algoritm is currently ongoing.');
    }
})

mixButton.addEventListener("click", ()=>{
    if(!ongoingSort){
        randMix();
        updateHeights();
    }else{
        alert('Sorting algoritm is currently ongoing.');
    }
});
