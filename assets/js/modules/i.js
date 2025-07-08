function majorityElement(nums=[]) {
    nums=nums.sort((a,b)=>a-b);
    let j=0;
    for(let i=0; i<nums.length; i++){
        if(nums[i]!==nums[i+1]){
            if((i-j+1)>(nums.length/2))
            return nums[i];
            else j=i;
        }
    }
    return -1;
}
console.log(majorityElement([1,5,3,5,5]))


const random=()=>Math.floor(Math.random()*255);
    for(let i=0; i<14 ; i++){
        colors.innerHTML+=`<li class="color" onclick="changeColor(this)" style="background:linear-gradient(45deg, rgba(${random()}, ${random()}, ${random()}, ${Math.random() * 0.5 +0.5}),  rgb(${random()}, ${random()}, ${random()}, ${Math.random() * 0.7 +0.7}));"></li>`
   }