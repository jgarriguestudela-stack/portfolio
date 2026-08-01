  // CANVAS SCROLL-SCRUB
  const videoScroll = document.querySelector('.video-scroll');
  const canvas = document.getElementById('portfolioCanvas');
  const ctx = canvas.getContext('2d');
  const FRAME_COUNT = 31;
  const FRAME_FOLDER = 'VideoScroll';
  const frames = [];
  let framesLoaded = 0;
  let allFramesReady = false;
  let currentFrameIndex = 0;

  function frameUrl(i){ return `${FRAME_FOLDER}/Frame%20(${i}).jpg`; }

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameIndex);
  }

  function drawCover(img){
    if(!img || !img.complete) return;
    const cr = canvas.width/canvas.height;
    const ir = img.naturalWidth/img.naturalHeight;
    let dw,dh,dx,dy;
    if(ir>cr){ dh=canvas.height; dw=img.naturalWidth*(dh/img.naturalHeight); dx=(canvas.width-dw)/2; dy=0; }
    else { dw=canvas.width; dh=img.naturalHeight*(dw/img.naturalWidth); dx=0; dy=(canvas.height-dh)/2; }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,dx,dy,dw,dh);
  }

  function drawFrame(index){ const img=frames[index]; if(img&&img.complete) drawCover(img); }

  function preloadFrames(){
  for (let i = 2; i <= FRAME_COUNT; i++) {
    const img = new Image();
    img.onload = () => {
      framesLoaded++;
      if (framesLoaded === FRAME_COUNT - 1) {
        allFramesReady = true;
      }
    };
    img.src = frameUrl(i);
    frames[i - 1] = img;
  }
}

function loadFirstFrame(){
  const img = new Image();
  img.onload = () => {
    frames[0] = img;
    framesLoaded++;
    drawFrame(0);
    preloadFrames();
  };
  img.src = frameUrl(1);
}

  function getProgress(){
    const rect=videoScroll.getBoundingClientRect();
    const total=videoScroll.offsetHeight-window.innerHeight;
    return Math.min(Math.max(-rect.top/total,0),1);
  }

  function loop(){
    const p=getProgress();
    if(allFramesReady){
      const t=Math.min(FRAME_COUNT-1,Math.floor(p*FRAME_COUNT));
      if(t!==currentFrameIndex){ currentFrameIndex=t; drawFrame(currentFrameIndex); }
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize',resizeCanvas);
  resizeCanvas(); loadFirstFrame(); requestAnimationFrame(loop);

  // REVEALS
  const reveals=document.querySelectorAll('.reveal');
  reveals.forEach(el=>{ el.style.opacity=0; el.style.transform='translateY(30px)'; });
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; } });
  },{threshold:0.1});
  reveals.forEach(el=>observer.observe(el));

  // FAQ ACCORDION
  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item=btn.closest('.faq-item');
      const answer=item.querySelector('.faq-a');
      const isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o=>{ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight='0'; });
      if(!isOpen){ item.classList.add('open'); answer.style.maxHeight=answer.scrollHeight+'px'; }
    });
  });
