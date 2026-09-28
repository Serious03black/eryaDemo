gsap.registerPlugin(ScrollTrigger);

const loader = document.querySelector('.loader');
const loaderLine = document.querySelector('.loader-line span');
const loaderCount = document.querySelector('.loader-count');

const loaderObj = {value:0};
gsap.to(loaderObj,{
  value:100,duration:1.5,ease:"power2.out",
  onUpdate:()=>{loaderCount.textContent=Math.round(loaderObj.value).toString().padStart(2,"0")+"%";loaderLine.style.width=loaderObj.value+"%"},
  onComplete:()=>{
    gsap.to(loader,{yPercent:-100,duration:1,ease:"power4.inOut"});
    gsap.from(".hero-title",{y:90,opacity:0,duration:1.3,delay:.15,ease:"power4.out"});
    gsap.from(".hero-copy,.hero-actions,.hero-note",{y:35,opacity:0,duration:.9,delay:.5,stagger:.12,ease:"power3.out"});
    gsap.from(".hero-image",{scale:1.12,opacity:0,duration:1.5,delay:.15,ease:"power3.out"});
  }
});

let loco;
if(window.innerWidth > 800){
  loco = new LocomotiveScroll({
    el:document.querySelector('[data-scroll-container]'),
    smooth:true,
    lerp:.075,
    multiplier:1
  });

  loco.on("scroll", ScrollTrigger.update);
  ScrollTrigger.scrollerProxy("#scroll-container",{
    scrollTop(value){
      return arguments.length ? loco.scrollTo(value,0,0) : loco.scroll.instance.scroll.y;
    },
    getBoundingClientRect(){return {top:0,left:0,width:innerWidth,height:innerHeight};},
    pinType:document.querySelector("#scroll-container").style.transform ? "transform":"fixed"
  });
  ScrollTrigger.addEventListener("refresh",()=>loco.update());
}

const scroller = window.innerWidth > 800 ? "#scroll-container" : window;

function reveal(selector, options={}){
  gsap.utils.toArray(selector).forEach(el=>{
    gsap.fromTo(el,
      {y:options.y||60,opacity:0},
      {y:0,opacity:1,duration:options.duration||1.1,ease:"power3.out",
       scrollTrigger:{trigger:el,scroller,start:"top 82%",toggleActions:"play none none reverse"}}
    );
  });
}
reveal(".intro-copy,.section-heading,.product,.feature-copy,.craft-intro,.craft-item,.dark-banner,.contact", {y:55});

gsap.utils.toArray(".product-image img").forEach(img=>{
  gsap.fromTo(img,{scale:1.18},{scale:1, ease:"none",
    scrollTrigger:{trigger:img,scroller,start:"top bottom",end:"bottom top",scrub:1}
  });
});

gsap.to(".intro-word",{x:-100,ease:"none",scrollTrigger:{trigger:".intro",scroller,start:"top bottom",end:"bottom top",scrub:1.2}});
gsap.to(".contact-ring",{rotation:180,ease:"none",scrollTrigger:{trigger:".contact",scroller,start:"top bottom",end:"bottom top",scrub:1}});
gsap.to(".marquee",{xPercent:-30,ease:"none",scrollTrigger:{trigger:".marquee-section",scroller,start:"top bottom",end:"bottom top",scrub:1}});

const progress = document.querySelector(".progress");
const updateProgress = y=>{
  const max = document.body.scrollHeight - window.innerHeight;
  progress.style.width = Math.max(0,Math.min(100,(y/max)*100))+"%";
};
if(loco){loco.on("scroll",args=>updateProgress(args.scroll.y));}
else window.addEventListener("scroll",()=>updateProgress(window.scrollY));

const cursor = document.querySelector(".cursor");
window.addEventListener("pointermove",e=>{
  gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.35,ease:"power2.out"});
});

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    const r=el.getBoundingClientRect(), x=e.clientX-(r.left+r.width/2), y=e.clientY-(r.top+r.height/2);
    gsap.to(el,{x:x*.16,y:y*.16,duration:.35,ease:"power2.out"});
  });
  el.addEventListener("mouseleave",()=>gsap.to(el,{x:0,y:0,duration:.5,ease:"elastic.out(1,.4)"}));
});

document.querySelectorAll(".magnetic-card").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    gsap.to(card,{rotationY:x*3,rotationX:-y*3,transformPerspective:800,duration:.45});
  });
  card.addEventListener("mouseleave",()=>gsap.to(card,{rotationY:0,rotationX:0,duration:.6,ease:"power3.out"}));
});

document.querySelectorAll(".craft-item").forEach(item=>{
  item.addEventListener("mouseenter",()=>gsap.to(item.querySelector(".plus"),{rotation:90,duration:.35}));
  item.addEventListener("mouseleave",()=>gsap.to(item.querySelector(".plus"),{rotation:0,duration:.35}));
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(!target)return;
    e.preventDefault();
    if(loco) loco.scrollTo(target,{offset:-70,duration:1.2,easing:[0.25,0,0.35,1]});
    else target.scrollIntoView({behavior:"smooth"});
  });
});

window.addEventListener("load",()=>setTimeout(()=>{if(loco)ScrollTrigger.refresh();},300));
