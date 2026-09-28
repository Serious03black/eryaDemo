const header=document.querySelector('.header');
const dot=document.querySelector('.cursor-dot');
const ring=document.querySelector('.cursor-ring');

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>40));

window.addEventListener('pointermove',e=>{
  if(!dot||!ring)return;
  dot.style.left=e.clientX+'px'; dot.style.top=e.clientY+'px';
  ring.animate({left:e.clientX+'px',top:e.clientY+'px'},{duration:420,fill:'forwards'});
});

document.querySelectorAll('a').forEach(a=>{
  a.addEventListener('mouseenter',()=>{if(ring){ring.style.width='54px';ring.style.height='54px'}});
  a.addEventListener('mouseleave',()=>{if(ring){ring.style.width='34px';ring.style.height='34px'}});
});

const els=document.querySelectorAll('.intro-copy,.section-top,.product-card,.craft-content,.craft-image,.statement-main,.house-copy,.house-visual,.journal article,.contact');
els.forEach(e=>e.classList.add('reveal'));
const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('show');io.unobserve(entry.target)}
  });
},{threshold:.12});
els.forEach(e=>io.observe(e));

const hero=document.querySelector('.hero-bg');
window.addEventListener('scroll',()=>{
  if(hero && window.scrollY<window.innerHeight){
    hero.style.transform=`scale(1.06) translateY(${window.scrollY*.08}px)`;
  }
});
