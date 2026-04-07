import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield, CheckCircle, ArrowRight, Lock,
  Phone, Mail, User,
  Scale, ChevronRight, Sun, Moon, Check,
  FilePenLine, Gavel, AlertTriangle,
  Camera, CreditCard,
  ClipboardList, X as XIcon,
} from "lucide-react";
import { getThemesForVariant, ThemeCtx, useT } from "../theme.js";
import { LANDING_VARIANTS } from "../landingVariants.js";
import {
  CookieConsentProvider,
  CookieBanner,
  CookiePreferencesModal,
  CookieFooterButton,
  identifySmartlookLead,
  trackSmartlookEvent,
  trackGaUiClick,
} from "../consent/index.js";
import shieldDarkImg from "../assets/images/shield_dark.png";
import shieldLightImg from "../assets/images/shield_light.png";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function BentoCard({ children, style = {}, accent = "none" }) {
  const T = useT();
  const [hovered, setHovered] = useState(false);
  const map = {
    cta: { border: T.bentoCtaBorder, bg: T.bentoCtaBg, glow: T.bentoGlow },
    info: { border: T.bentoInfoBorder, bg: T.bentoInfoBg, glow: "transparent" },
    none: { border: T.bentoNoneBorder, bg: T.bentoNoneBg, glow: "transparent" },
  };
  const t = map[accent] || map.none;
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: t.bg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 28, backdropFilter: "blur(12px)",
      boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.12),0 0 0 1px ${t.glow}` : "0 4px 24px rgba(0,0,0,0.06)",
      transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
      transition: "all 0.35s cubic-bezier(.4,0,.2,1)", ...style
    }}>{children}</div>
  );
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s,transform 0.7s ease ${delay}s` }}>{children}</div>
  );
}

function LifecycleTimeline() {
  const stages = [
    { Icon: FilePenLine, label: "Zawarcie umowy", sub: "Konstruktor · weryfikacja · e-podpis" },
    { Icon: Camera, label: "Początek najmu", sub: "Protokół · warunki · harmonogram" },
    { Icon: CreditCard, label: "W trakcie najmu", sub: "Płatności · powiadomienia · spory" },
    { Icon: ClipboardList, label: "Zakończenie", sub: "Protokół · rozliczenie · eskalacja" },
  ];

  return (
    <div className="lifecycle-timeline">
      <div className="lifecycle-track" />
      {stages.map(({ Icon, label, sub }, i) => (
        <div key={i} className="lifecycle-stage" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
          <div className="lifecycle-dot">
            <Icon size={20} strokeWidth={2} />
          </div>
          <div className="lifecycle-text">
            <span className="lifecycle-label">{label}</span>
            <span className="lifecycle-sub">{sub}</span>
          </div>
        </div>
      ))}
      <div className="lifecycle-badge">
        <Shield size={14} />
        <span>Platforma = źródło prawdy</span>
      </div>
    </div>
  );
}

export default function ShortVariant({ variantId = "short_variant" }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const themes = getThemesForVariant(variantId);
  const T = isDark ? themes.DARK : themes.LIGHT;
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [emailError, setEmailError] = useState(null);
  const [rodoChecked, setRodoChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const formRef = useRef(null);
  const layoutRootRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = layoutRootRef.current;
    if (!root) return;
    const selector = 'button, a[href], [role="button"], [role="switch"]';
    const onClickCapture = (e) => {
      const raw = e.target;
      if (!(raw instanceof Element)) return;
      const node = raw.closest(selector);
      if (!node || !root.contains(node)) return;
      if (node.matches("a[href]")) {
        const href = node.getAttribute("href") || "";
        const elementText = (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
        trackGaUiClick({ variant_id: variantId, click_type: "link", element_text: elementText, link_url: href });
        return;
      }
      const elementText = (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
      trackGaUiClick({ variant_id: variantId, click_type: "button", element_text: elementText });
    };
    root.addEventListener("click", onClickCapture, true);
    return () => root.removeEventListener("click", onClickCapture, true);
  }, [variantId]);

  const css = `
    *{box-sizing:border-box;margin:0;}
    html,body{min-height:100%;background:${T.bg};color:${T.textPrimary};}
    ::selection{background:rgba(14,124,102,0.25);}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-track{background:${T.scrollbarTrack};}
    ::-webkit-scrollbar-thumb{background:${T.scrollbarThumb};border-radius:4px;}
    .pulse-btn{animation:pulse-glow 2.8s ease-in-out infinite;}
    @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 ${T.ctaGlow},0 8px 28px ${T.ctaGlow};}50%{box-shadow:0 0 0 12px rgba(14,124,102,0),0 8px 36px ${T.ctaGlow};}}
    .cta-btn{background:linear-gradient(135deg,${T.cta},${T.ctaHover});color:#fff;border:none;cursor:pointer;font-family:Manrope,sans-serif;font-weight:800;border-radius:12px;transition:all 0.25s;display:inline-flex;align-items:center;gap:8px;letter-spacing:-0.01em;}
    .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px ${T.ctaGlow};}
    .cta-btn:active{transform:translateY(0);}
    input{background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:12px;color:${T.inputColor};font-family:Manrope,sans-serif;font-size:15px;padding:14px 16px;width:100%;transition:border-color 0.2s,background 0.2s;outline:none;}
    input:focus{border-color:${T.info};background:${T.inputFocusBg};}
    input::placeholder{color:${T.inputPlaceholder};}
    .tag-info{display:inline-flex;align-items:center;gap:6px;background:${T.tagInfoBg};border:1px solid ${T.tagInfoBorder};border-radius:99px;padding:4px 12px;color:${T.tagInfoColor};font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;}
    .short-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
    .value-section-heading{text-align:center;margin-bottom:48px;}
    @media(max-width:850px){.value-section-heading{margin-bottom:28px;}.short-cards{grid-template-columns:1fr!important;}}

    .hero-split{display:flex;gap:clamp(32px,4vw,64px);max-width:1200px;margin:0 auto;align-items:center;}
    .hero-split-left{flex:1 1 58%;min-width:0;}
    .hero-split-right{flex:1 1 38%;min-width:0;}
    @media(max-width:850px){.hero-split{flex-direction:column;gap:32px;}.hero-split-right{width:100%;}}

    .pain-bullet{display:flex;align-items:center;gap:12px;padding:10px 0;font-size:clamp(14px,1.6vw,16px);line-height:1.45;color:${T.warn};font-weight:600;}
    .pain-bullet svg{flex-shrink:0;opacity:0.7;}

    .lifecycle-timeline{position:relative;display:flex;flex-direction:column;gap:0;padding:28px 0 28px 28px;}
    .lifecycle-track{position:absolute;left:47px;top:40px;bottom:60px;width:2px;background:linear-gradient(180deg,${T.ctaBorder},${T.info});z-index:0;border-radius:2px;}
    .lifecycle-stage{position:relative;display:flex;align-items:center;gap:16px;padding:14px 0;z-index:1;opacity:0;animation:stage-in 0.5s ease forwards;}
    @keyframes stage-in{to{opacity:1;transform:translateX(0);}from{opacity:0;transform:translateX(-12px);}}
    .lifecycle-dot{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${T.bentoCtaBg};border:1.5px solid ${T.ctaBorder};color:${T.cta};transition:all 0.3s;}
    .lifecycle-stage:hover .lifecycle-dot{background:${T.cta};color:#fff;border-color:${T.cta};transform:scale(1.08);}
    .lifecycle-text{display:flex;flex-direction:column;gap:2px;}
    .lifecycle-label{font-family:"Inter Tight",sans-serif;font-size:clamp(16px,1.8vw,20px);font-weight:700;color:${T.textPrimary};line-height:1.3;}
    .lifecycle-sub{font-size:clamp(12px,1.3vw,14px);color:${T.textSecondary};line-height:1.4;}
    .lifecycle-badge{margin-top:8px;margin-left:4px;display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:99px;font-size:12px;font-weight:700;letter-spacing:.03em;color:${T.cta};background:${T.ctaDim};border:1px solid ${T.ctaBorder};}

    .compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2.5vw,32px);max-width:900px;margin:0 auto;}
    @media(max-width:700px){.compare-grid{grid-template-columns:1fr;}}
    .compare-col{border-radius:20px;padding:clamp(24px,3vw,36px);display:flex;flex-direction:column;gap:16px;}
    .compare-bad{background:${T.warnBg};border:1px solid ${T.warnBorder};}
    .compare-good{background:${T.bentoCtaBg};border:1.5px solid ${T.ctaBorder};}
    .compare-item{display:flex;align-items:flex-start;gap:10px;font-size:14px;line-height:1.55;}

    @media(max-width:500px){.nav-cta-text{display:none;}.toggle-label{display:none;}}

    .form-shield-img{flex-shrink:0;}
    .form-header-row{gap:40px;}
    .form-fields{display:flex;flex-direction:column;gap:16px;}
    .form-sub-desktop{display:block;}
    .form-sub-mobile{display:none;}
    @media(max-width:850px){
      .form-row{flex-direction:column;align-items:center;}
      .form-shield-col{justify-content:center!important;padding-right:0!important;}
      .form-shield-img{width:120px!important;max-width:120px!important;}
      .form-spacer{display:none;}
      .form-header-row{gap:20px;}
      .form-fields{gap:14px;}
      .form-sub-desktop{display:none;}
      .form-sub-mobile{display:block;}
    }
  `;

  const scrollToForm = (placement) => {
    trackSmartlookEvent("cta_click", { placement, variant_id: variantId });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
  const validateEmail = () => {
    if (!formData.email) { setEmailError("Podaj adres e-mail."); return false; }
    if (!isValidEmail(formData.email)) { setEmailError("Nieprawidłowy format adresu e-mail."); return false; }
    setEmailError(null);
    return true;
  };

  const formatPhone = (raw) => {
    const digits = (raw || "").replace(/\D/g, "").slice(0, 9);
    const groups = digits.match(/.{1,3}/g) || [];
    return groups.join(" ");
  };

  const LEADS_ENDPOINT = (import.meta.env.VITE_LEADS_ENDPOINT || "").trim();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!rodoChecked || !formData.name) return;
    if (!validateEmail()) return;
    if (!LEADS_ENDPOINT) { setSubmitError("Brak konfiguracji wysyłki."); return; }

    trackSmartlookEvent("cta_click", { placement: "form_submit", variant_id: variantId });

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const params = new URLSearchParams(window.location.search || "");
      const utm = Object.fromEntries(
        [...params.entries()].filter(([k]) => k.toLowerCase().startsWith("utm_"))
      );
      const payload = {
        name: (formData.name || "").trim(),
        email: (formData.email || "").trim(),
        phone: (formData.phone || "").replace(/\D/g, ""),
        variant_id: variantId,
        utm,
        userAgent: navigator.userAgent,
        data: JSON.stringify({ pageUrl: window.location.href, consent: true }),
      };
      const res = await fetch(LEADS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const raw = await res.text();
      let json = null;
      try { json = JSON.parse(raw); } catch { /* ignore */ }
      if (!res.ok) {
        const hint = json?.error || raw?.slice?.(0, 140) || "";
        throw new Error(`HTTP ${res.status}${hint ? `: ${hint}` : ""}`);
      }
      if (!json?.ok) {
        const hint = json?.error || raw?.slice?.(0, 140) || "Submit failed";
        throw new Error(hint);
      }
      identifySmartlookLead({ email: payload.email, name: payload.name, phone: payload.phone });
      setSubmitted(true);
    } catch (e) {
      const msg = (e && typeof e === "object" && "message" in e) ? e.message : String(e || "");
      setSubmitError(`Nie udało się wysłać formularza. ${msg}`.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const VALUE_CARDS = [
    {
      icon: <FilePenLine size={26} />, badge: "01", accent: "cta", iC: T.cta,
      title: "Zawarcie umowy",
      desc: "Inteligentny konstruktor generuje umowę dopasowaną do Twojego przypadku. Weryfikacja tożsamości stron, podpis elektroniczny eIDAS i archiwum z wersjonowaniem — umowa żyje na platformie, a nie w szufladzie.",
      features: ["Konstruktor umowy pod Twój przypadek", "Weryfikacja tożsamości najemcy", "Podpis elektroniczny eIDAS", "Archiwum dokumentów z version control"],
    },
    {
      icon: <Camera size={26} />, badge: "02", accent: "info", iC: T.info,
      title: "Początek najmu",
      desc: "Protokół zdawczo-odbiorczy z foto/wideo dokumentacją podpisany przez obie strony. Rejestracja warunków najmu i harmonogramu płatności. System staje się źródłem prawdy od pierwszego dnia.",
      features: ["Move-in protokół z fotodokumentacją", "Rejestracja warunków i kwot", "Harmonogram płatności", "Kanał komunikacji z mocą prawną"],
    },
    {
      icon: <CreditCard size={26} />, badge: "03", accent: "cta", iC: T.cta,
      title: "W trakcie najmu",
      desc: "Automatyczny tracking płatności, powiadomienia o zaległościach, naliczanie kar umownych. Jeśli pojawia się spór — system prowadzi przez mediację i eskalację prawną krok po kroku.",
      features: ["Tracking płatności i automatyczne przypomnienia", "Naliczanie kar umownych", "System rozwiązywania sporów", "Mediacja z mocą wyroku sądowego"],
    },
    {
      icon: <ClipboardList size={26} />, badge: "04", accent: "info", iC: T.info,
      title: "Zakończenie najmu",
      desc: "Protokół zdawczo-odbiorczy porównany automatycznie z move-in. Rozliczenie kaucji, dokumentacja szkód, a w razie potrzeby — eskalacja do prawnika z kompletnym materiałem dowodowym.",
      features: ["Move-out z porównaniem stanu", "Automatyczny rozrachunek kaucji", "Dokumentacja szkód gotowa do sądu", "Eskalacja prawna z pełnym logiem"],
    },
  ];

  const FAQ_ITEMS = [
    {
      q: "Czym Rent Standard różni się od zwykłego szablonu umowy?",
      a: "Szablon z internetu to martwy dokument — nie pilnuje terminów, nie zbiera dowodów, nie prowadzi procedur. Rent Standard to platforma, która zamienia umowę w działający system: automatyczne powiadomienia, tracking płatności, protokoły z fotodokumentacją i mediacja — wszystko z mocą prawną. Umowa bez platformy to papier. Umowa z platformą to mechanizm egzekwowania.",
    },
    {
      q: "Czy dane z platformy mają moc prawną?",
      a: "Tak. Platforma działa w standardzie eIDAS (kwalifikowany podpis elektroniczny) i jest w pełni zgodna z RODO. Logi zdarzeń, powiadomienia i protokoły generowane przez system stanowią materiał dowodowy dopuszczalny w postępowaniu sądowym. Umowa zawarta przez platformę wprost odnosi się do danych systemu jako źródła prawdy.",
    },
    {
      q: "Co się dzieje, gdy najemca nie płaci?",
      a: "System automatycznie wykrywa zaległość i uruchamia procedurę: najpierw powiadomienie z prawnym skutkiem, potem naliczenie kary umownej, następnie propozycja mediacji. Jeśli mediacja nie przynosi rezultatu — platforma przygotowuje kompletny pakiet dowodów i przekazuje sprawę do prawnika. Na każdym etapie masz pełny wgląd w status i dokumentację.",
    },
    {
      q: "Ile to kosztuje?",
      a: "Model cenowy oparty jest na etapach: niski koszt wejścia przy tworzeniu umowy, a następnie abonament obejmujący tracking płatności, powiadomienia i archiwum. Mediacja i wsparcie prawne rozliczane są per przypadek. Dokładny cennik opublikujemy przy starcie — pierwsi użytkownicy pilotażu uzyskają preferencyjne warunki.",
    },
    {
      q: "Na jakim etapie jest serwis?",
      a: "Budujemy platformę i stopniowo wdrażamy pierwszych użytkowników. Pilotaż pozwala nam dopracować produkt w oparciu o realne przypadki. Jeśli dołączysz teraz — będziesz współtworzyć narzędzie i zyskasz warunki niedostępne po oficjalnym starcie. Twórca platformy to prawnik z 11-letnim doświadczeniem w sporach o najem.",
    },
  ];

  return (
    <ThemeCtx.Provider value={T}>
      <CookieConsentProvider>
      <div ref={layoutRootRef} style={{ background: T.bg, minHeight: "100vh", fontFamily: "Manrope,system-ui,sans-serif", color: T.textPrimary, transition: "background 0.4s,color 0.4s" }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />

        {/* BG mesh */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -180, right: -180, width: 680, height: 680, background: `radial-gradient(ellipse,${T.meshGreen} 0%,transparent 65%)`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -120, left: -120, width: 620, height: 620, background: `radial-gradient(ellipse,${T.meshBlue} 0%,transparent 65%)`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: "45%", left: "40%", width: 460, height: 460, background: `radial-gradient(ellipse,${T.meshGreenMid} 0%,transparent 60%)`, borderRadius: "50%" }} />
        </div>

        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: T.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.surfBorder}`, padding: "0 clamp(16px,4vw,48px)", transition: "background 0.3s ease,box-shadow 0.3s ease", boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.35)" : "none" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
                <div style={{ background: `linear-gradient(135deg,${T.info},${T.ctaHover})`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${T.ctaGlow}` }}>
                  <Shield size={18} color="#fff" strokeWidth={2.5} />
                </div>
                <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: T.textPrimary }}>Rent Standard</span>
              </Link>
              {LANDING_VARIANTS.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 0, marginLeft: 0 }}>
                  {LANDING_VARIANTS.map(({ path, label, variantId: id }) => {
                    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`));
                    return (
                      <Link key={id} to={path} style={{
                        padding: "4px 4px", borderRadius: 8, fontSize: 14,
                        fontWeight: isActive ? 700 : 600, color: isActive ? T.cta : T.textSecondary,
                        textDecoration: "none", background: isActive ? T.ctaDim : "transparent",
                        border: `1px solid ${isActive ? T.ctaBorder : "transparent"}`, transition: "color 0.2s, background 0.2s",
                      }}>{label}</Link>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => { const next = !isDark; setIsDark(next); trackSmartlookEvent("theme_change", { theme: next ? "dark" : "light", variant_id: variantId }); }} style={{ background: T.toggleBg, border: `1px solid ${T.toggleBorder}`, borderRadius: 99, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: T.textSecondary, fontSize: 13, fontWeight: 600, fontFamily: "Manrope,sans-serif", transition: "all 0.25s", flexShrink: 0 }}>
                {isDark ? <><Sun size={15} color="#f59e0b" /><span className="toggle-label" style={{ color: "#f59e0b" }}>Jasny</span></> : <><Moon size={15} color={T.info} /><span className="toggle-label" style={{ color: T.info }}>Ciemny</span></>}
              </button>
              <button onClick={() => scrollToForm("nav")} className="cta-btn" style={{ padding: "10px 20px", fontSize: 15 }}>
                <span className="nav-cta-text">Przetestuj platformę</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </nav>

        <main style={{ overflowX: "hidden" }}>
          {/* ──── HERO ──── */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px) clamp(48px,6vw,80px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              {/* Centered headline */}
              <div style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}>
                <div className="tag-info" style={{ marginBottom: 20, display: "inline-flex" }}>
                  <Shield size={14} /> Platforma dla wynajmujących
                </div>
                <h1 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(34px,5.8vw,68px)", lineHeight: 1.02, letterSpacing: "-0.045em", marginBottom: 20, color: T.textPrimary, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
                  Umowa najmu to tylko papier.{" "}
                  <span style={{ color: T.cta }}>My robimy z niej system.</span>
                </h1>
                <p style={{ color: T.textSecondary, fontSize: "clamp(15px,1.8vw,20px)", lineHeight: 1.6, maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
                  Rent Standard to platforma, która zamienia Twój kontrakt w&nbsp;działający mechanizm ochrony — od podpisania umowy do rozwiązania sporu.
                </p>
              </div>

              {/* Split: pain bullets + lifecycle */}
              <div className="hero-split">
                <div className="hero-split-left">
                  <p style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: T.warn, marginBottom: 16, opacity: 0.85 }}>
                    Znasz to?
                  </p>
                  {[
                    "Najemca nie płaci — a Ty dalej spłacasz kredyt i rachunki",
                    "Umowa z internetu nic nie chroni — w sądzie jest bezwartościowa",
                    "Eksmisja trwa miesiącami, a szkody rosną każdego dnia",
                    "Kaucja nie pokrywa nawet połowy strat",
                  ].map((text, i) => (
                    <div key={i} className="pain-bullet">
                      <AlertTriangle size={16} />
                      <span>{text}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 24 }}>
                    <button onClick={() => scrollToForm("hero")} className="cta-btn pulse-btn" style={{ padding: "16px 28px", fontSize: 17 }}>
                      Zabezpiecz swój najem <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="hero-split-right">
                  <LifecycleTimeline />
                </div>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px,3vw,32px)", flexWrap: "wrap", marginTop: "clamp(28px,4vw,48px)", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSecondary }}>
                  <Scale size={14} color={T.info} /> Zgodność z eIDAS
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSecondary }}>
                  <Shield size={14} color={T.info} /> RODO 100%
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSecondary }}>
                  <Gavel size={14} color={T.info} /> 11 lat doświadczenia w sporach najmu
                </div>
              </div>
            </div>
          </section>

          {/* ──── 4 LIFECYCLE STAGES ──── */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(32px,4.8vw,64px) clamp(16px,4vw,48px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <FadeIn>
                <div className="value-section-heading">
                  <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>Jak to działa</div>
                  <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>
                    Cztery etapy najmu. Jeden system.
                  </h2>
                  <p style={{ color: T.textSecondary, fontSize: 16, lineHeight: 1.6, maxWidth: 600, margin: "14px auto 0" }}>
                    Platforma prowadzi Cię przez cały cykl życia najmu — a każde działanie staje się dowodem w systemie.
                  </p>
                </div>
              </FadeIn>
              <div className="short-cards">
                {VALUE_CARDS.map((card, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <BentoCard accent={card.accent} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ background: `${card.iC}18`, border: `1px solid ${card.iC}40`, borderRadius: 14, padding: 12, display: "flex" }}>
                          <span style={{ color: card.iC }}>{card.icon}</span>
                        </div>
                        <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 40, color: `${card.iC}20`, fontWeight: 700, lineHeight: 1 }}>{card.badge}</span>
                      </div>
                      <h3 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 22, marginBottom: 10, color: T.textPrimary, lineHeight: 1.25 }}>{card.title}</h3>
                      <p style={{ color: T.pillarDesc, fontSize: 15, lineHeight: 1.7, marginBottom: 18, flex: 1 }}>{card.desc}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {card.features.map((f, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <CheckCircle size={14} color={card.iC} />
                            <span style={{ fontSize: 13, color: T.pillarFeat, lineHeight: 1.5 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </BentoCard>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* ──── COMPARISON: Platform vs Template ──── */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,72px) clamp(16px,4vw,48px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <FadeIn>
                <div className="value-section-heading">
                  <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>Dlaczego platforma</div>
                  <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(26px,3.8vw,40px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>
                    Umowa z internetu vs. umowa na platformie
                  </h2>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="compare-grid">
                  <div className="compare-col compare-bad">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.warn}18`, border: `1px solid ${T.warn}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <XIcon size={18} color={T.warn} />
                      </div>
                      <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 18, fontWeight: 700, color: T.warn }}>Szablon z internetu</span>
                    </div>
                    {[
                      "Martwy dokument — nikt nie pilnuje terminów",
                      "Brak dowodów na uszko\u00ADdzenia — słowo przeciw słowu",
                      "Powiadomienia przez WhatsApp — bez mocy prawnej",
                      "Spór = drogi adwokat i miesiące w sądzie",
                      "Eksmisja? Zapomnij — umowa nic nie przyspieszA",
                    ].map((text, i) => (
                      <div key={i} className="compare-item">
                        <XIcon size={15} color={T.warn} style={{ flexShrink: 0, marginTop: 3 }} />
                        <span style={{ color: T.warn, opacity: 0.85 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="compare-col compare-good">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.cta}18`, border: `1px solid ${T.cta}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle size={18} color={T.cta} />
                      </div>
                      <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 18, fontWeight: 700, color: T.cta }}>Rent Standard</span>
                    </div>
                    {[
                      "Platforma śledzi cały cykl życia kontraktu",
                      "Fotoprotokoły move-in / move-out = dowód w sądzie",
                      "Powiadomienia z systemu mają moc prawną (eIDAS)",
                      "Mediacja na platformie → ugoda z mocą wyroku",
                      "Logi, terminy, kary — system prowadzi procedurę za Ciebie",
                    ].map((text, i) => (
                      <div key={i} className="compare-item">
                        <CheckCircle size={15} color={T.cta} style={{ flexShrink: 0, marginTop: 3 }} />
                        <span style={{ color: T.textPrimary }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p style={{ textAlign: "center", marginTop: 32, fontSize: 15, fontWeight: 600, color: T.textSecondary, lineHeight: 1.5 }}>
                  <span style={{ color: T.cta }}>Dane z systemu = dowód w sądzie.</span>{" "}
                  Platforma to nie dodatek do umowy — to jej warstwa wykonawcza.
                </p>
              </FadeIn>
            </div>
          </section>

          {/* ──── LEAD FORM ──── */}
          <section ref={formRef} style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
            <div style={{ width: 120, height: 3, margin: "0 auto 48px", background: `linear-gradient(90deg,${T.cta},${T.info})`, borderRadius: 99 }} />
            <div className="form-row" style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0 }}>
              <div style={{ flex: "0 0 auto", width: "100%", maxWidth: 700 }}>
                <FadeIn>
                  <div style={{ background: T.formCardBg, border: `1px solid ${T.formCardBorder}`, borderRadius: 24, padding: "clamp(28px,5vw,52px)", backdropFilter: "blur(20px)", boxShadow: T.formCardShadow }}>
                    {!submitted ? (
                      <>
                        <div className="form-header-row" style={{ display: "flex", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap" }}>
                          <div style={{ flexShrink: 0, borderRadius: 18, background: T.formIconBg, border: `1px solid ${T.formIconBorder}`, padding: 14 }}>
                            <img
                              src={isDark ? shieldDarkImg : shieldLightImg}
                              alt="Ikona tarczy symbolizująca ochronę najmu"
                              style={{ width: 80, height: "auto", maxWidth: "100%", objectFit: "contain" }}
                              className="form-shield-img"
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(26px,4vw,34px)", letterSpacing: "-0.03em", marginBottom: 8, color: T.textPrimary }}>
                              Przetestuj platformę jako jeden z pierwszych
                            </h2>
                            <p className="form-sub-desktop" style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                              Budujemy system, który zmieni sposób wynajmu w Polsce.{" "}
                              <strong style={{ color: T.cta }}>Pierwsi użytkownicy</strong> współtworzą produkt i zyskają warunki niedostępne po starcie.
                            </p>
                            <p className="form-sub-mobile" style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                              <strong style={{ color: T.cta }}>Dołącz</strong> do pilotażu i{" "}
                              <strong style={{ color: T.info }}>współtwórz platformę</strong>
                            </p>
                          </div>
                        </div>
                        <div className="form-fields" style={{ display: "flex", flexDirection: "column" }}>
                          <div>
                            <label style={{ display: "block", color: T.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: ".03em" }}>
                              IMIĘ <span style={{ color: T.cta }}>*</span>
                            </label>
                            <div style={{ position: "relative" }}>
                              <User size={16} color={T.inputPlaceholder} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                              <input type="text" placeholder="Twoje imię" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ paddingLeft: 40 }} />
                            </div>
                            <div style={{ minHeight: 14, marginTop: 4 }}>
                              <p style={{ margin: 0, fontSize: 12, color: "transparent" }}> </p>
                            </div>
                          </div>
                          <div>
                            <label style={{ display: "block", color: T.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: ".03em" }}>
                              E-MAIL <span style={{ color: T.cta }}>*</span>
                            </label>
                            <div style={{ position: "relative" }}>
                              <Mail size={16} color={emailError ? T.warn : T.inputPlaceholder} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                              <input
                                type="email" placeholder="twoj@email.pl" required
                                value={formData.email}
                                onChange={e => { setFormData({ ...formData, email: e.target.value }); if (emailError) setEmailError(null); }}
                                onBlur={validateEmail}
                                style={{ paddingLeft: 40, borderColor: emailError ? T.warn : undefined }}
                              />
                            </div>
                            <div style={{ minHeight: 14, marginTop: 4 }}>
                              <p style={{ margin: 0, fontSize: 12, color: T.warn, opacity: emailError ? 1 : 0 }}>{emailError || " "}</p>
                            </div>
                          </div>
                          <div>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, color: T.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: ".03em" }}>
                              NUMER TELEFONU
                            </label>
                            <div style={{ position: "relative" }}>
                              <Phone size={16} color={T.inputPlaceholder} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                              <input type="tel" inputMode="numeric" pattern="[0-9 ]*" placeholder="516 123 456" value={formData.phone} onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })} style={{ paddingLeft: 40 }} />
                            </div>
                            <div style={{ minHeight: 14, marginTop: 4 }}>
                              <p style={{ margin: 0, fontSize: 12, color: "transparent" }}> </p>
                            </div>
                          </div>
                          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginTop: 4 }}>
                            <div
                              onClick={() => setRodoChecked(!rodoChecked)}
                              style={{
                                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                background: rodoChecked ? T.cta : "transparent",
                                border: `2px solid ${rodoChecked ? T.cta : T.checkboxBorder}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginTop: 2, transition: "all 0.2s", cursor: "pointer",
                              }}
                            >
                              {rodoChecked && <Check size={14} color="#fff" strokeWidth={3} />}
                            </div>
                            <span style={{ color: T.consentText, fontSize: 13, lineHeight: 1.5 }}>
                              Wyrażam zgodę na przetwarzanie moich danych osobowych przez Klim Zavadski, prowadzący działalność gospodarczą pod firmą KZ, w celu kontaktu handlowego zgodnie z{" "}
                              <a href={`${import.meta.env.BASE_URL}polityka_prywatnosci.pdf`} target="_blank" rel="noopener noreferrer" style={{ color: T.info, fontWeight: 600 }}>Polityką prywatności</a>. Mogę cofnąć zgodę w każdej chwili.
                            </span>
                          </label>
                          <button
                            onClick={handleSubmit}
                            className="cta-btn"
                            disabled={isSubmitting || !rodoChecked || !formData.email || !formData.name || !!emailError}
                            style={{
                              padding: "18px 28px", fontSize: 18, justifyContent: "center", marginTop: 8,
                              opacity: isSubmitting || !rodoChecked || !formData.email || !formData.name || !!emailError ? 0.45 : 1,
                              cursor: isSubmitting || !rodoChecked || !formData.email || !formData.name || !!emailError ? "not-allowed" : "pointer"
                            }}
                          >
                            {isSubmitting ? "Wysyłanie..." : <>Zabezpiecz swój najem <ArrowRight size={18} /></>}
                          </button>
                          <div style={{ minHeight: 18, marginTop: 8 }}>
                            <p style={{ margin: 0, fontSize: 12, color: T.warn, opacity: submitError ? 1 : 0 }}>{submitError || " "}</p>
                          </div>
                          <p style={{ textAlign: "center", fontSize: 12, color: T.formPrivacy, lineHeight: 1.5 }}>
                            <Lock size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
                            Administratorem Twoich danych jest Klim Zavadski (KZ), NIP 6751776885, REGON 524256395. <br /> Szczegóły w{" "}
                            <a href={`${import.meta.env.BASE_URL}polityka_prywatnosci.pdf`} target="_blank" rel="noopener noreferrer" style={{ color: T.info, fontWeight: 600 }}>Polityce prywatności</a> i{" "}
                            <a href={`${import.meta.env.BASE_URL}regulamin_serwisu.pdf`} target="_blank" rel="noopener noreferrer" style={{ color: T.info, fontWeight: 600 }}>Regulaminie</a>.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${T.cta},${T.ctaHover})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 0 0 20px ${T.ctaDim}` }}>
                          <CheckCircle size={36} color="#fff" />
                        </div>
                        <h3 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 28, marginBottom: 12, color: T.textPrimary }}>Gotowe! Twoje dane zostały wysłane.</h3>
                        <p style={{ color: T.textSecondary, fontSize: 16 }}>Skontaktujemy się z Tobą w najbliższym czasie.</p>
                      </div>
                    )}
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ──── FAQ ──── */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
            <div style={{ width: 120, height: 3, margin: "0 auto 48px", background: `linear-gradient(90deg,${T.cta},${T.info})`, borderRadius: 99 }} />
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <FadeIn>
                <div className="value-section-heading">
                  <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>FAQ</div>
                  <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>Najczęstsze pytania</h2>
                </div>
              </FadeIn>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {FAQ_ITEMS.map((item, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <FadeIn key={i} delay={i * 0.08}>
                      <div style={{
                        background: T.bentoNoneBg, border: `1px solid ${isOpen ? T.cta : T.bentoNoneBorder}`,
                        borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)",
                        boxShadow: isOpen ? `0 8px 32px ${T.bentoGlow}` : "0 2px 12px rgba(0,0,0,0.04)",
                        transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                      }}>
                        <button
                          onClick={() => { if (!isOpen) trackSmartlookEvent("faq_open", { variant_id: variantId, faq_index: i }); setOpenFaq(isOpen ? null : i); }}
                          style={{ width: "100%", padding: "22px 28px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 18, textAlign: "left" }}
                        >
                          <span style={{
                            flexShrink: 0, width: 36, height: 36, borderRadius: 10,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isOpen ? `${T.cta}18` : `${T.info}12`,
                            border: `1px solid ${isOpen ? `${T.cta}40` : `${T.info}25`}`,
                            fontFamily: "Inter Tight,sans-serif", fontSize: 14, fontWeight: 800,
                            color: isOpen ? T.cta : T.textMuted, transition: "all 0.3s ease",
                          }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span style={{ flex: 1, fontSize: "clamp(15px,2vw,17px)", fontWeight: 600, color: T.textPrimary, lineHeight: 1.4, fontFamily: "Inter Tight,sans-serif" }}>
                            {item.q}
                          </span>
                          <ChevronRight size={18} color={isOpen ? T.cta : T.textMuted} style={{ flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease, color 0.3s ease" }} />
                        </button>
                        <div style={{ maxHeight: isOpen ? 2000 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s ease" }}>
                          <div style={{ padding: "0 28px 24px 82px" }}>
                            <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${T.cta},transparent)`, borderRadius: 99, marginBottom: 14 }} />
                            <p style={{ margin: 0, color: T.textSecondary, fontSize: 15, lineHeight: 1.75, whiteSpace: "pre-line" }}>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ──── FOOTER ──── */}
          <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${T.footerBorder}`, padding: "32px clamp(16px,4vw,48px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: `linear-gradient(135deg,${T.info},${T.ctaHover})`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={14} color="#fff" />
                </div>
                <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 16, fontWeight: 700, color: T.textPrimary }}>Rent Standard</span>
              </div>
              <p style={{ color: T.footerText, fontSize: 13 }}>© 2026 Klim Zavadski, firma KZ · info@rentstandard.pl</p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                {[
                  { label: "Regulamin", href: `${import.meta.env.BASE_URL}regulamin_serwisu.pdf`, external: true },
                  { label: "Polityka prywatności", href: `${import.meta.env.BASE_URL}polityka_prywatnosci.pdf`, external: true },
                  { label: "Kontakt", href: "mailto:info@rentstandard.pl", external: false },
                ].map(({ label, href, external }) => (
                  <a key={label} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ color: T.footerLink, fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = T.cta}
                    onMouseLeave={e => e.target.style.color = T.footerLink}
                  >{label}</a>
                ))}
                <CookieFooterButton />
              </div>
            </div>
          </footer>
        </main>
        <CookieBanner />
        <CookiePreferencesModal />
      </div>
      </CookieConsentProvider>
    </ThemeCtx.Provider>
  );
}
