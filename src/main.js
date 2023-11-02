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


const abt = document.queryselector('.abt_img');

const lazyLoad = function(){

abt.classlist.remove('blur');

}

const abtImgObs = new IntersectionObserver(lazyLoad);

abtImgObs.observe(abt);