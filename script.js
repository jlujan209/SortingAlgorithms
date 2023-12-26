const insertion = document.getElementById('insertion-sort');
const selection = document.getElementById('selection-sort');
const quick = document.getElementById('quick-sort');
const radix = document.getElementById('radix-sort');
const shell = document.getElementById('shell-sort');
const merge = document.getElementById('merge-sort');
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

///////////////////////////////////////////////////////////////////////Insertion Sort

async function InsertionSort(ms){
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
    await updateHeights();
}

//////////////////////////////////////////////////////////////////Selection Sort

async function SelectionSort(ms){
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
}

///////////////////////////////////////////////////////////////////

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
/////////////////////////////////////////////////////////////QuickSort
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
//////////////////////////////////////////////////////////////Radix Sort

function getMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  }
  
  async function countingSort(exp, ms) {
    const n = elements.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
  
    for (let i = 0; i < n; i++) {
      count[Math.floor(elements[i] / exp) % 10]++;
    }
  
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
  
    for (let i = n - 1; i >= 0; i--) {
      output[count[Math.floor(elements[i] / exp) % 10] - 1] = elements[i];
      count[Math.floor(elements[i] / exp) % 10]--;
    }
  
    for (let i = 0; i < n; i++) {
      elements[i] = output[i];
      
      await sleep(ms);
      updateHeights();
    }
  }
  
  async function RadixSort(ms) {
    const max = getMax(elements);
  
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      await countingSort(exp, ms);
    }
  }


///////////////////////////////////////////////////////////////Shell Sort
async function ShellSort(ms) {
    const n = elements.length;
    let gap = Math.floor(n / 2);
  
    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        let temp = elements[i];
        let j = i;
  
        while (j >= gap && elements[j - gap] > temp) {
          elements[j] = elements[j - gap];
          await swapHeight(j - gap, j, ms);
          j -= gap;
        }
  
        elements[j] = temp;
      }
  
      gap = Math.floor(gap / 2);
    }
    
    await InsertionSort(5);
}  
  
///////////////////////////////////////////////////////////////////Merge Sort
async function Merge(i, j, k, ms){
    let mergedSize = k - i + 1;
    let mergePos = 0;
    let leftPos = i;
    let rightPos = j + 1;
    let mergedNums = new Array(mergedSize).fill(0);

    while(leftPos <= j && rightPos <= k){
        if(elements[leftPos] < elements[rightPos]){
            mergedNums[mergePos] = elements[leftPos];
            leftPos++;
        }
        else{
            mergedNums[mergePos] = elements[rightPos];
            rightPos++;
        }
        mergePos++;
    }

    while(leftPos <= j){
        mergedNums[mergePos] = elements[leftPos];
        leftPos++;
        mergePos++;
    }
    while(rightPos <= k){
        mergedNums[mergePos] = elements[rightPos];
        rightPos++;
        mergePos++;
    }

    for (mergePos = 0; mergePos < mergedSize; ++mergePos) {
        elements[i + mergePos] = mergedNums[mergePos];
        await sleep(ms);
        updateHeights();
     }
  

}

async function MergeSort(i, k, ms){
    if(i >= k) return;
    let j = Math.floor((i + k) / 2);

    await MergeSort(i, j, ms);
    await MergeSort(j + 1, k, ms);
    await Merge(i, j, k, ms);
}
//Initial:
randMix();
updateHeights();

merge.addEventListener("click", async () =>{
    if(!ongoingSort){
        ongoingSort = true;
        await MergeSort(0, elements.length - 1, 15);
        ongoingSort = false;
    }else{
        alert('Sorting Algorithm is currently running.');
    }
})

shell.addEventListener("click", async ()=>{
    if(!ongoingSort){
        ongoingSort = true;
        await ShellSort(30);
        ongoingSort = false;
    }else{
        alert('Sorting Algorithm is currently running.');
    }
})

radix.addEventListener("click", async ()=>{
    if(!ongoingSort){
        ongoingSort = true;
        await RadixSort(15);
        ongoingSort = false;
    }else{
        alert('Sorting Algorithm is currently running.');
    }
})

quick.addEventListener("click", async()=>{
    if(!ongoingSort){
        ongoingSort = true;
        await QuickSort(0, elements.length - 1, 50);
        ongoingSort = false;
    }else{
        alert('Sorting Algorithm is currently running.');
    }
})


insertion.addEventListener("click", async ()=>{
    if(!ongoingSort){
        ongoingSort = true;
        await InsertionSort(10);
        ongoingSort = false;
    }else{
        alert('Sorting Algorithm is currently running.');
    }
});

selection.addEventListener("click", async ()=>{
    if(!ongoingSort){
        ongoingSort = true;
        await SelectionSort(40);
        ongoingSort = false;
    }else{
        alert('Sorting Algorithm is currently running.');
    }
})

mixButton.addEventListener("click", ()=>{
    if(!ongoingSort){
        randMix();
        updateHeights();
    }else{
        alert('Sorting Algorithm is currently running.');
    }
});
