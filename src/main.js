let isOpen= false;

function mobileNav(){
    const mob=document.querySelector('.mobile__nav');
    if (isOpen){
    mob.style.display='none';
    isOpen= false;
    document.body.style.overflowY='auto';
    }
    else{
    mob.style.display='flex';
    isOpen= true;
    document.body.style.overflowY='hidden';
    }
}
function removeAutoFlow(){
    isOpen= false;
    document.body.style.overflowY='auto';
    const mob=document.querySelector('.mobile__nav');
    mob.style.display='none';
}

function toggleMode(){
    document.body.classList.toggle('light-mode');
}



// const abtImg = document.querySelector('.abt__img');
const feaImg =document.querySelectorAll('.featured__img');
const workImg =document.querySelectorAll('.work__img');

const lazyLoad = function(en,ob){
    const [e] = en;
    e.target.classList.remove('lazy-img');
    imgObs.unobserve(e.target)

}

const imgObs = new IntersectionObserver(lazyLoad,{root:null,
threshold:0.15
})

// imgObs.observe(abtImg);
feaImg.forEach((img)=>imgObs.observe(img));
workImg.forEach((img)=>imgObs.observe(img));
