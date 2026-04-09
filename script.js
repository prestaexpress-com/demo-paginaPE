// Funcionalidad de la Barra de Navegación (Sticky y Sombra al hacer scroll)
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Cambiar estilo del navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navbar.classList.toggle('menu-open');
        
        // Cambiar el icono a "X" cuando está abierto
        if (navLinks.classList.contains('active')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Cerrar menú móvil al hacer click en un enlace
    const mobileLinks = document.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                navbar.classList.remove('menu-open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Sistema de reajuste en caso de cambiar tamaño de pantalla
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            navbar.classList.remove('menu-open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Animación interactiva en los beneficios (Lift up and Pop on Scroll - Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.benefit-card, .step');
    animatedElements.forEach(el => observer.observe(el));

    // Lógica para las pestañas de "Nosotros"
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones y contenidos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Añadir active al botón actual
            btn.classList.add('active');

            // Mostrar el contenido asociado
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
});

// =========================================================
// WIDGET FLOTANTE DE WHATSAPP (CHATBOT)
// =========================================================
(function(){
  var css = `
  #wa-widget { position:fixed; bottom:20px; right:20px; z-index:9999; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  .wa-btn { display:flex; align-items:center; justify-content:center; width:60px; height:60px; background-color:#f59e0b; color:#fff; border-radius:50%; border:none; cursor:pointer; box-shadow:0 4px 15px rgba(245,158,11,0.3); transition:transform 0.3s ease; position:relative; }
  .wa-btn:hover { transform:scale(1.05); background-color:#d98216; }
  .wa-btn svg { width:35px; height:35px; fill:currentColor; }
  .wa-badge { position:absolute; top:-2px; right:-2px; background:#ef4444; color:#fff; font-size:12px; font-weight:bold; height:20px; width:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.2); }
  .wa-card { position:absolute; bottom:80px; right:0; width:340px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.15); overflow:hidden; opacity:0; pointer-events:none; visibility:hidden; transform:translateY(20px); transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display:flex; flex-direction:column; }
  .wa-card.open { opacity:1; pointer-events:auto; visibility:visible; transform:translateY(0); }
  .wa-card-head { background:linear-gradient(135deg, #f59e0b, #d98216); color:#fff; padding:15px; display:flex; align-items:center; gap:12px; position:relative; }
  .wa-av { width:45px; height:45px; background:rgba(255,255,255,1); border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative; flex-shrink:0; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
  .wa-av img { width:100%; height:100%; object-fit:contain; border-radius:50%; padding:4px; }
  .wa-dot { position:absolute; bottom:0; right:0; width:12px; height:12px; background:#10b981; border-radius:50%; border:2px solid #d98216; }
  .wa-hname { font-weight:bold; font-size:16px; margin-bottom:2px; }
  .wa-hsub { font-size:12px; opacity:0.9; }
  .wa-x { background:none; border:none; color:#fff; font-size:20px; cursor:pointer; position:absolute; right:15px; top:20px; opacity:0.7; transition:opacity 0.2s; }
  .wa-x:hover { opacity:1; }
  .wa-card-body { padding:20px 15px; background:#f8fafc; min-height:120px; position:relative; }
  .wa-card-body::before { content:""; position:absolute; top:0; left:0; right:0; bottom:0; opacity:0.04; background-image:url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h10v10H20z'/%3E%3C/svg%3E"); pointer-events:none; }
  .wa-bubble { background:#fff; padding:10px 15px 14px; border-radius:0 12px 12px 12px; font-size:14px; color:#1e293b; position:relative; box-shadow:0 1px 3px rgba(0,0,0,0.05); width:fit-content; max-width:85%; transform-origin: top left; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; line-height:1.4; border: 1px solid rgba(0,0,0,0.05); }
  .wa-bubble::before { content:""; position:absolute; top:-1px; left:-10px; border-style:solid; border-width:0 10px 10px 0; border-color:transparent #fff transparent transparent; }
  .wa-btime { font-size:10px; color:#94a3b8; text-align:right; margin-top:5px; margin-bottom:-4px; }
  .wa-card-foot { padding:15px; background:#fff; text-align:center; border-top: 1px solid rgba(0,0,0,0.05); }
  .wa-cta { display:inline-flex; align-items:center; justify-content:center; gap:8px; background:#f59e0b; color:#fff; text-decoration:none; padding:12px 24px; border-radius:24px; font-weight:bold; transition:all 0.3s ease; font-size:15px; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.2); }
  .wa-cta:hover { background:#d98216; color:#fff; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(245, 158, 11, 0.3); }
  .wa-cta svg { width:20px; height:20px; fill:currentColor; }
  @keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
  .wa-typing { display:flex; gap:4px; padding:4px 0; }
  .wa-typing span { width:6px; height:6px; background:#cbd5e1; border-radius:50%; animation:waBounce 1.4s infinite ease-in-out both; }
  .wa-typing span:nth-child(1) { animation-delay:-0.32s; }
  .wa-typing span:nth-child(2) { animation-delay:-0.16s; }
  @keyframes waBounce { 0%, 80%, 100% { transform:scale(0); } 40% { transform:scale(1); } }
  @media (max-width: 480px) {
      .wa-card { width: calc(100vw - 40px); bottom: 90px; }
  }
  `;

  var WA_ICON = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  var PRESTA_LOGO = '<img src="https://www.prestaexpress.com.gt/web/image/website/1/favicon?unique=9cf2bc0" alt="Presta Express" />';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var wrap = document.createElement('div');
  wrap.id = 'wa-widget';
  wrap.innerHTML =
    '<div class="wa-card" id="wa-card">' +
      '<div class="wa-card-head">' +
        '<div class="wa-av">' + PRESTA_LOGO + '<span class="wa-dot"></span></div>' +
        '<div><div class="wa-hname">PRESTA EXPRESS</div><div class="wa-hsub">● En línea ahora</div></div>' +
        '<button class="wa-x" id="wa-x">✕</button>' +
      '</div>' +
      '<div class="wa-card-body">' +
        '<div class="wa-bubble" id="wa-bubble">' +
          '<div class="wa-typing"><span></span><span></span><span></span></div>' +
        '</div>' +
      '</div>' +
      '<div class="wa-card-foot">' +
        '<a href="https://api.whatsapp.com/send/?phone=50224259700&text=Hola,%20me%20gustar%C3%ADa%20más%20informaci%C3%B3n%20sobre%20un%20pr%C3%A9stamo%20hipotecario&type=phone_number&app_absent=0" target="_blank" rel="noopener" class="wa-cta">' +
          WA_ICON + ' Chatear ahora' +
        '</a>' +
      '</div>' +
    '</div>' +
    '<button class="wa-btn" id="wa-fab" aria-label="WhatsApp">' +
      WA_ICON +
      '<span class="wa-badge">1</span>' +
    '</button>';

  document.body.appendChild(wrap);

  var fab = document.getElementById('wa-fab');
  var card = document.getElementById('wa-card');
  var btnX = document.getElementById('wa-x');
  var bubble = document.getElementById('wa-bubble');
  var open = false, msgReady = false, dismissed = false;

  function showMsg(){
    if(msgReady) return; msgReady = true;
    setTimeout(function(){
      var now = new Date();
      var h = now.getHours().toString().padStart(2,'0');
      var m = now.getMinutes().toString().padStart(2,'0');
      bubble.innerHTML = '¡Hola! 👋 ¿En qué podemos ayudarte para tu préstamo hipotecario?<div class="wa-btime">'+h+':'+m+' ✓✓</div>';
    }, 1500);
  }

  function openCard(){ open=true; card.classList.add('open'); var b=fab.querySelector('.wa-badge'); if(b)b.remove(); showMsg(); }
  function closeCard(){ open=false; card.classList.remove('open'); }

  fab.addEventListener('click', function(){ open ? closeCard() : openCard(); });
  btnX.addEventListener('click', function(){ closeCard(); dismissed=true; });

  setTimeout(function(){ if(!dismissed) openCard(); }, 3500);
})();

// =========================================================
// FUNCIONALIDAD DEL FORMULARIO DE CONTACTO
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const tipoPropiedad = document.querySelector('input[name="tipoPropiedad"]:checked');
            
            // Validar campos requeridos
            if (!nombre || !telefono || !email || !tipoPropiedad) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }
            
            // Construir el mensaje para WhatsApp
            let whatsappMessage = `*Nueva Solicitud de Crédito Hipotecario*%0A%0A`;
            whatsappMessage += `👤 *Nombre:* ${nombre}%0A`;
            whatsappMessage += `📱 *Teléfono:* ${telefono}%0A`;
            whatsappMessage += `📧 *Email:* ${email}%0A`;
            
            // Mapear el tipo de propiedad
            const propiedades = {
                'casa': '🏠 Casa',
                'apartamento': '🏢 Apartamento',
                'finca': '🌳 Finca'
            };
            whatsappMessage += `🏡 *Tipo de Propiedad:* ${propiedades[tipoPropiedad.value] || tipoPropiedad.value}%0A`;
            
            // Número de WhatsApp de Presta Express
            const whatsappNumber = '50224259700'; // Formato internacional sin + ni espacios
            
            // Abrir WhatsApp con el mensaje
            window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
            
            // Mostrar mensaje de confirmación
            alert('¡Gracias por tu solicitud! Serás redirigido a WhatsApp para completar tu consulta.');
            
            // Limpiar el formulario
            contactForm.reset();
        });
        
        // Agregar formato automático al campo de teléfono
        const telefonoInput = document.getElementById('telefono');
        if (telefonoInput) {
            telefonoInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) {
                    value = value.substring(0, 4) + '-' + value.substring(4, 8);
                }
                e.target.value = value;
            });
        }
    }
});
