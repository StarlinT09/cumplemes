const products=[
{id:1,name:"Mouse inalámbrico",cat:"Accesorios",price:750,tag:"POPULAR",desc:"Diseño cómodo y conexión inalámbrica para estudiar o trabajar.",img:"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=85"},
{id:2,name:"Teclado USB",cat:"Accesorios",price:950,tag:"ESENCIAL",desc:"Teclado práctico para escribir cómodamente en tu escritorio.",img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85"},
{id:3,name:"Audífonos Bluetooth",cat:"Accesorios",price:1450,tag:"DESTACADO",desc:"Escucha música, estudia o atiende llamadas con libertad.",img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"},
{id:4,name:"Memoria USB 64 GB",cat:"Accesorios",price:550,tag:"PRÁCTICO",desc:"Opción compacta para transportar documentos y archivos.",img:"https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=700&q=85"},
{id:5,name:"Cable HDMI",cat:"Conectividad",price:400,tag:"CONECTIVIDAD",desc:"Conecta una computadora a un monitor o televisor compatible.",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=85"},
{id:6,name:"Hub USB de 4 puertos",cat:"Conectividad",price:850,tag:"ÚTIL",desc:"Amplía las conexiones disponibles para tus accesorios USB.",img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=700&q=85"},
{id:7,name:"Base para laptop",cat:"Ergonomía",price:1250,tag:"COMODIDAD",desc:"Eleva tu portátil y ayuda a organizar mejor tu espacio.",img:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=85"},
{id:8,name:"Mouse pad",cat:"Ergonomía",price:350,tag:"BÁSICO",desc:"Superficie práctica para acompañar el uso diario del mouse.",img:"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=85"}
];
const $=s=>document.querySelector(s), money=n=>new Intl.NumberFormat("es-DO",{style:"currency",currency:"DOP",maximumFractionDigits:0}).format(n);
let category="Todos",cart=JSON.parse(localStorage.getItem("techcareCart")||"[]"),toastTimer;
function renderProducts(){let term=$("#search").value.toLocaleLowerCase("es").trim();let list=products.filter(p=>(category==="Todos"||p.cat===category)&&(`${p.name} ${p.desc} ${p.cat}`.toLocaleLowerCase("es").includes(term)));$("#products").innerHTML=list.length?list.map(p=>`<article class="product"><div class="product-image"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/F4F7FA/0B1F44?text=TechCare'"><span class="tag">${p.tag}</span></div><div class="product-info"><span class="category">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}" aria-label="Agregar ${p.name}">+</button></div></div></article>`).join(""):'<div class="empty-search">No encontramos productos con esa búsqueda.</div>'}
function save(){localStorage.setItem("techcareCart",JSON.stringify(cart));renderCart()}
function add(id){let item=cart.find(i=>i.id===id);item?item.qty++:cart.push({id,qty:1});save();let p=products.find(p=>p.id===id);toast(p.name+" se agregó al carrito")}
function renderCart(){let count=cart.reduce((n,i)=>n+i.qty,0),total=cart.reduce((n,i)=>n+products.find(p=>p.id===i.id).price*i.qty,0);$("#count").textContent=count;$("#empty").hidden=cart.length>0;$("#drawerBottom").hidden=!cart.length;$("#cartItems").innerHTML=cart.map(i=>{let p=products.find(p=>p.id===i.id);return `<div class="cart-row"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><strong>${money(p.price*i.qty)}</strong><div class="qty"><button data-qty="${p.id}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><button class="remove" data-remove="${p.id}" aria-label="Eliminar ${p.name}">×</button></div>`}).join("");$("#total").textContent=money(total)}
function toast(msg){$("#toast").textContent=msg;$("#toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("#toast").classList.remove("show"),2300)}
function openCart(){$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false");$("#shade").hidden=false;document.body.style.overflow="hidden"}
function closeCart(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true");$("#shade").hidden=true;document.body.style.overflow=""}
$("#products").addEventListener("click",e=>{let b=e.target.closest("[data-add]");if(b)add(Number(b.dataset.add))});
$("#search").addEventListener("input",renderProducts);
$("#filters").addEventListener("click",e=>{let b=e.target.closest("[data-cat]");if(!b)return;document.querySelectorAll("#filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.cat;renderProducts()});
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#shade").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",e=>{let q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){let i=cart.find(x=>x.id===Number(q.dataset.qty));i.qty+=Number(q.dataset.delta);if(i.qty<1)cart=cart.filter(x=>x!==i);save()}if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));save()}});
$("#continue").addEventListener("click",()=>{closeCart();$("#productos").scrollIntoView({behavior:"smooth"})});
$("#checkout").addEventListener("click",()=>toast("Demostración académica: no hay pagos reales configurados."));
$("#hamburger").addEventListener("click",()=>$("#nav").classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});$("#year").textContent=new Date().getFullYear();renderProducts();renderCart();


// Carrusel principal de tres imágenes: cambio automático, flechas y puntos.
const heroSlides=[...document.querySelectorAll('.hero-slide')];
const heroDots=[...document.querySelectorAll('.carousel-dots button')];
const heroCounter=document.querySelector('.carousel-counter');
let heroIndex=0;
let heroTimer;
function showHeroSlide(index){
  heroIndex=(index+heroSlides.length)%heroSlides.length;
  heroSlides.forEach((slide,i)=>{const active=i===heroIndex;slide.classList.toggle('active',active);slide.setAttribute('aria-hidden',String(!active));});
  heroDots.forEach((dot,i)=>{const active=i===heroIndex;dot.classList.toggle('active',active);dot.setAttribute('aria-pressed',String(active));});
  if(heroCounter)heroCounter.textContent=`0${heroIndex+1} / 0${heroSlides.length}`;
}
function startHeroTimer(){clearInterval(heroTimer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)heroTimer=setInterval(()=>showHeroSlide(heroIndex+1),5000);}
document.querySelector('.carousel-arrow.prev')?.addEventListener('click',()=>{showHeroSlide(heroIndex-1);startHeroTimer();});
document.querySelector('.carousel-arrow.next')?.addEventListener('click',()=>{showHeroSlide(heroIndex+1);startHeroTimer();});
heroDots.forEach((dot,i)=>dot.addEventListener('click',()=>{showHeroSlide(i);startHeroTimer();}));
document.querySelector('.hero-carousel')?.addEventListener('mouseenter',()=>clearInterval(heroTimer));
document.querySelector('.hero-carousel')?.addEventListener('mouseleave',startHeroTimer);
showHeroSlide(0);startHeroTimer();
