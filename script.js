(function(){
  const EMAIL = "stephank18@gmail.com";
  const form = document.getElementById("inquiry");
  const quick = document.getElementById("quick");
  const offerSel = document.getElementById("f-offer");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll("[data-offer]").forEach(b => b.addEventListener("click", () => {
    offerSel.value = b.dataset.offer;
    document.getElementById("contact").scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    setTimeout(() => document.getElementById("f-name").focus({preventScroll:true}), 400);
  }));

  function setErr(id, msg){ document.getElementById(id).textContent = msg; }

  // Replaces a submitted form with the copy/email fallback. Elements are found inside `done`, so both forms can use it.
  function showDone(target, text, subject){
    const body = encodeURIComponent(text.split("\n").slice(2).join("\n"));
    target.innerHTML = "";
    const done = document.createElement("div");
    done.className = "done";
    done.innerHTML = `
      <h3>One last step</h3>
      <p>Send this to <span class="addr"></span> and we'll reply within two business days.</p>
      <pre></pre>
      <div class="done-actions">
        <button class="btn btn-primary" type="button">Copy message</button>
        <a class="btn btn-ghost">Open in email app</a>
      </div>
      <small aria-live="polite"></small>`;
    target.appendChild(done);
    const summary = done.querySelector("pre"), status = done.querySelector("small");
    done.querySelector(".addr").textContent = EMAIL;
    summary.textContent = text;
    done.querySelector("a").href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
    done.querySelector("button").addEventListener("click", () => {
      navigator.clipboard.writeText(text).then(
        () => { status.textContent = "Copied. Paste it into an email to " + EMAIL + "."; },
        () => { const r = document.createRange(); r.selectNodeContents(summary); const s = getSelection(); s.removeAllRanges(); s.addRange(r); status.textContent = "Text selected. Press Ctrl+C or Cmd+C to copy."; }
      );
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    let ok = true;
    setErr("e-name",""); setErr("e-email",""); setErr("e-company",""); setErr("e-msg","");
    if(!d.name.trim()){ setErr("e-name","Add your name."); ok=false; }
    if(!EMAIL_RE.test(d.email.trim())){ setErr("e-email","Enter an email like name@company.com."); ok=false; }
    if(!d.company.trim()){ setErr("e-company","Add your company name."); ok=false; }
    if(d.message.trim().length < 10){ setErr("e-msg","Add a sentence or two about the product and the decision."); ok=false; }
    if(!ok) return;

    const subject = `Inquiry: ${d.offer} (${d.company})`;
    const text =
`Subject: ${subject}

Name: ${d.name}
Email: ${d.email}
Company: ${d.company}
Role: ${d.role || "—"}
Interested in: ${d.offer}
Stage: ${d.stage}
Budget: ${d.budget}
Timeline: ${d.timeline}

${d.message}`;
    showDone(form, text, subject);
  });

  quick.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(quick).entries());
    let ok = true;
    setErr("qe-name",""); setErr("qe-email",""); setErr("qe-msg","");
    if(!d.name.trim()){ setErr("qe-name","Add your name."); ok=false; }
    if(!EMAIL_RE.test(d.email.trim())){ setErr("qe-email","Enter an email like name@company.com."); ok=false; }
    if(d.message.trim().length < 10){ setErr("qe-msg","Add a sentence about what you're building."); ok=false; }
    if(!ok) return;

    const subject = `Quick inquiry (${d.name.trim()})`;
    const text =
`Subject: ${subject}

Name: ${d.name}
Email: ${d.email}

${d.message}`;
    showDone(quick, text, subject);
  });
})();
