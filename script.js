'use strict';
// CONFIGURAÇÃO: coloque aqui o WhatsApp da Pcpropr, com DDI + DDD + número.
// Use somente números. Deixe vazio enquanto o contato não estiver definido.
const WHATSAPP = '+55 44 9918-5267';

const slides = [
 {label:'01 / PRESENÇA DIGITAL',title:'Seu negócio merece<br>um site que <span>trabalha<br>por você.</span>',text:'Sites com identidade, páginas focadas em conversão e tráfego pago para conectar sua empresa a novas oportunidades.',caption:'Uma boa primeira impressão começa aqui.'},
 {label:'02 / TRÁFEGO PAGO',title:'Sua marca na frente<br>de quem <span>procura<br>o que você faz.</span>',text:'Campanhas com objetivo, público e mensagem alinhados. Transforme a divulgação do seu negócio em uma estratégia.',caption:'Mais direção para o seu investimento.'},
 {label:'03 / ESTRATÉGIA',title:'Do primeiro clique<br>à próxima <span>conversa<br>com um cliente.</span>',text:'Conecte site, anúncios e WhatsApp em uma jornada simples para quem quer conhecer e contratar o seu negócio.',caption:'Cada etapa com um próximo passo claro.'}
];
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
let currentSlide = 0;
let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pauseButton = $('[data-action="pause"]');
function updatePause(){
 pauseButton.textContent = paused ? '▶' : 'Ⅱ';
 pauseButton.setAttribute('aria-label',paused?'Retomar carrossel':'Pausar carrossel');
}
function showSlide(index){
 currentSlide=(index+slides.length)%slides.length;
 const slide=slides[currentSlide];
 $('.hero-copy h1').innerHTML=slide.title; // Somente textos fixos definidos acima.
 $('.hero-copy > p').textContent=slide.text;
 $('.slide-controls > span').textContent=slide.label;
 $('.photo-bottom > span').textContent=slide.caption;
 $$('.photo-frame > img').forEach((image,i)=>image.classList.toggle('visible',i===currentSlide));
 $$('[data-slide]').forEach((button,i)=>{button.classList.toggle('active',i===currentSlide);button.setAttribute('aria-current',String(i===currentSlide));});
}
function manualSlide(index){paused=true;updatePause();showSlide(index);}
$$('[data-slide]').forEach(button=>button.addEventListener('click',()=>manualSlide(Number(button.dataset.slide))));
$('[data-action="prev"]').addEventListener('click',()=>manualSlide(currentSlide-1));
$('[data-action="next"]').addEventListener('click',()=>manualSlide(currentSlide+1));
pauseButton.addEventListener('click',()=>{paused=!paused;updatePause();});
updatePause();
setInterval(()=>{if(!paused&&!document.hidden&&!$('dialog').open)showSlide(currentSlide+1);},7000);

function closeMenu(){$('nav').classList.remove('open');$('.menu').setAttribute('aria-expanded','false');}
$('.menu').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('.menu').setAttribute('aria-expanded',String(open));});
$$('nav a').forEach(link=>link.addEventListener('click',closeMenu));

const dialog=$('dialog');
let service='Site ou landing page';
let message='';
let contactTrigger=null;
function selectService(value){
 service=value;
 $$('[data-service]').forEach(button=>{
  const selected=button.dataset.service===service;
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
}
function showStep(step){
 [1,2,3].forEach(n=>{$(`#step-${n}`).hidden=n!==step;});
 $('#step-label').textContent=`VAMOS TIRAR SUA IDEIA DO PAPEL · ${step}/3`;
 $('#contact-notice').hidden=true;
 if(step===2)$('#name').focus();
 if(step===3)$('#send-whatsapp').focus();
}
$$('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
 contactTrigger=button;
 if(button.dataset.contact)selectService(button.dataset.contact);
 showStep(1);closeMenu();dialog.showModal();
 $('.choices button.selected').focus();
}));
$$('[data-service]').forEach(button=>button.addEventListener('click',()=>selectService(button.dataset.service)));
selectService(service);
$('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>contactTrigger?.focus());
dialog.addEventListener('click',event=>{
 const r=dialog.getBoundingClientRect();
 if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();
});
$('#to-details').addEventListener('click',()=>showStep(2));
$('#back-service').addEventListener('click',()=>{showStep(1);$('.choices button.selected').focus();});
$('#edit-details').addEventListener('click',()=>showStep(2));
['name','business'].forEach(id=>$('#'+id).addEventListener('input',()=>$('#'+id).setCustomValidity('')));
$('#step-2').addEventListener('submit',event=>{
 event.preventDefault();
 for(const id of ['name','business']){
  const field=$('#'+id);
  if(!field.value.trim()){field.setCustomValidity('Preencha este campo.');field.reportValidity();return;}
 }
 message=`Olá, Pcpropr! Meu nome é ${$('#name').value.trim()}. Meu negócio é ${$('#business').value.trim()}. Tenho interesse em ${service.toLowerCase()} e meu objetivo é ${$('#objective').value.toLowerCase()}. Gostaria de conversar sobre um orçamento.`;
 $('#message-preview').textContent=message;
 showStep(3);
});
$('#send-whatsapp').addEventListener('click',()=>{
 const phone=WHATSAPP.replace(/\D/g,'');
 if(!phone){$('#contact-notice').textContent='O WhatsApp da Pcpropr ainda não foi configurado. Nenhuma informação foi enviada ou armazenada.';$('#contact-notice').hidden=false;return;}
 window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
});

const video=$('video');
const playButton=$('.play');
playButton.addEventListener('click',async()=>{
 video.controls=true;playButton.hidden=true;
 try{await video.play();}catch{video.controls=false;playButton.hidden=false;}
});
video.addEventListener('ended',()=>{video.controls=false;playButton.hidden=false;});
$('footer > span').textContent=`© ${new Date().getFullYear()} Pcpropr`;
