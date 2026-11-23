document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
  btn.addEventListener('click', () => btn.setAttribute('aria-expanded', menu.classList.toggle('open')));
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  document.getElementById('anio').textContent = new Date().getFullYear();

  const code = document.getElementById('typed'), texto = code.dataset.text;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) code.textContent = texto;
  else { let i = 0; (function escribir() { code.textContent = texto.slice(0, ++i); if (i < texto.length) setTimeout(escribir, 35); })(); }

  const form = document.getElementById('form'), estado = document.getElementById('estado');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    estado.className = ''; estado.textContent = '';
    let valido = true;
    form.querySelectorAll('[required]').forEach(c => { const mal = !c.value.trim() || (c.type === 'email' && !c.checkValidity()); c.classList.toggle('err', mal); if (mal) valido = false; });
    if (!valido) { estado.className = 'mal'; estado.textContent = 'Completa nombre, correo válido y mensaje.'; return; }
    const enviar = form.querySelector('button'); enviar.disabled = true; estado.textContent = 'Enviando…';
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
      if (!r.ok) throw new Error('error');
      estado.className = 'ok'; estado.textContent = 'Mensaje enviado. Gracias por escribirme.'; form.reset();
    } catch (err) {
      estado.className = 'mal'; estado.textContent = 'No se pudo enviar el mensaje. Inténtalo otra vez en unos minutos.';
    }
    enviar.disabled = false;
  });
});
