const header=document.querySelector('.nav');
window.addEventListener('scroll',()=>{header.style.boxShadow=scrollY>30?'0 8px 35px rgba(0,0,0,.18)':'none'});

const items=document.querySelectorAll('.product,.feature-copy,.feature-image,.craft-item,.dark-banner,.contact');
items.forEach(x=>x.style.opacity='0');

const io=new IntersectionObserver(entries=>{
 entries.forEach(e=>{
  if(e.isIntersecting){
   e.target.animate(
    [{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:750,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'}
   );
   io.unobserve(e.target);
  }
 });
},{threshold:.1});
items.forEach(x=>io.observe(x));

document.querySelectorAll('a[href^="#"]').forEach(a=>{
 a.addEventListener('click',e=>{
  const el=document.querySelector(a.getAttribute('href'));
  if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}
 });
});
