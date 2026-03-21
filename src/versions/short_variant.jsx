import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield, ShieldCheck, CheckCircle, ArrowRight, Lock,
  Phone, Mail, User, Home,
  Scale, ChevronRight, Sun, Moon, Check,
  FileText, Handshake, Award, Users
} from "lucide-react";
import { getThemesForVariant, ThemeCtx, useT } from "../theme.js";
import { LANDING_VARIANTS } from "../landingVariants.js";
import shieldDarkImg from "../assets/images/shield_dark.png";
import shieldLightImg from "../assets/images/shield_light.png";
import structureDarkImg from "../assets/images/structure_dark.png";
import structureLightImg from "../assets/images/structure_light.png";

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
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const css = `
    *{box-sizing:border-box;margin:0;}
    html,body{min-height:100%;background:${T.bg};color:${T.textPrimary};}
    ::selection{background:rgba(28,187,131,0.25);}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-track{background:${T.scrollbarTrack};}
    ::-webkit-scrollbar-thumb{background:${T.scrollbarThumb};border-radius:4px;}
    .pulse-btn{animation:pulse-glow 2.8s ease-in-out infinite;}
    @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 ${T.ctaGlow},0 8px 28px ${T.ctaGlow};}50%{box-shadow:0 0 0 12px rgba(28,187,131,0),0 8px 36px ${T.ctaGlow};}}
    .cta-btn{background:linear-gradient(135deg,${T.cta},${T.ctaHover});color:#fff;border:none;cursor:pointer;font-family:Manrope,sans-serif;font-weight:800;border-radius:12px;transition:all 0.25s;display:inline-flex;align-items:center;gap:8px;letter-spacing:-0.01em;}
    .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px ${T.ctaGlow};}
    .cta-btn:active{transform:translateY(0);}
    input{background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:12px;color:${T.inputColor};font-family:Manrope,sans-serif;font-size:15px;padding:14px 16px;width:100%;transition:border-color 0.2s,background 0.2s;outline:none;}
    input:focus{border-color:${T.info};background:${T.inputFocusBg};}
    input::placeholder{color:${T.inputPlaceholder};}
    .tag-info{display:inline-flex;align-items:center;gap:6px;background:${T.tagInfoBg};border:1px solid ${T.tagInfoBorder};border-radius:99px;padding:4px 12px;color:${T.tagInfoColor};font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;}
    .short-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;}
    .hero-heading-wrap{text-align:center;margin-bottom:40px;}
    @media(max-width:850px){.hero-heading-wrap{margin-bottom:20px;}}
    .value-section-heading{text-align:center;margin-bottom:48px;}
    @media(max-width:850px){.value-section-heading{margin-bottom:28px;}}
    .hero-split{display:flex;align-items:stretch;gap:clamp(20px,3vw,40px);max-width:1100px;margin:0 auto 40px;}
    .hero-split-left{flex:1 1 55%;min-width:0;}
    .hero-split-right{flex:0 0 auto;display:flex;align-items:center;justify-content:center;}
    .hero-split-right img{height:100%;width:auto;max-width:420px;object-fit:contain;border-radius:12px;}
    @media(max-width:850px){.short-cards{grid-template-columns:1fr!important;}.hero-split{flex-direction:column;align-items:center;}.hero-split-right{display:none;}.hero-theses-card{padding:18px 18px!important;}}
    @media(max-width:500px){.nav-cta-text{display:none;}.toggle-label{display:none;}.hero-trust-wrap{flex-direction:column;}.hero-theses-card{padding:8px 14px!important;}}
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

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      icon: <FileText size={26} />, badge: "01", accent: "cta", iC: T.cta,
      title: "Umowa najmu",
      desc: "Nasza umowa najmu to nie zwykły szablon, lecz realne narzędzie ochrony, bez niejasnych i ogólnych zapisów.Została opracowana na podstawie rzeczywistych sporów i zabezpiecza kluczowe ryzyka, zanim jeszcze się pojawią.Jeśli warunki umowy zostaną naruszone, istnieją konkretne mechanizmy ich egzekwowania, w tym mediacja i procedury sądowe. Jasne sankcje. Przejrzysty tryb powiadomień.Dokumentowanie naruszeń.",
      features: ["Klauzule chroniące kaucję i własność", "Podpis elektroniczny eIDAS", "Weryfikacja tożsamości najemcy", "Archiwum dokumentów 10 lat"],
    },
    {
      icon: <ShieldCheck size={26} />, badge: "02", accent: "info", iC: T.info,
      title: "Ubezpieczenie",
      desc: "Specjalna polisa ubezpieczeniowa chroni Twoje mienie i ogranicza straty finansowe związane z najmem.",
      features: ["uszkodzenie mienia", "straty wynikające z zaległości w płatnościach"],
    },
    {
      icon: <Home size={26} />, badge: "03", accent: "cta", iC: T.cta,
      title: "Najem okazjonalny online",
      desc: "Pełne oformienie najmu okazjonalnego bez wizyty u notariusza. Wszystkie dokumenty przygotowane i podpisane elektronicznie — szybciej i wygodniej.",
      features: ["Tryb okazjonalny (art. 19a)", "Oświadczenie najemcy online", "Komplet dokumentów w jednym miejscu"],
    },
    {
      icon: <Handshake size={26} />, badge: "04", accent: "info", iC: T.info,
      title: "Mediacja sporów",
      desc: "Profesjonalny mediator pomaga rozwiązać konflikt z najemcą bez sądu — szybko, poufnie i ze skutkiem prawnym. Ugoda jest wiążąca dla obu stron.",
      features: ["Certyfikowany mediator", "Rozwiązanie sporu w 14 dni", "Ugoda z mocą wyroku sądowego"],
    },
    {
      icon: <Scale size={26} />, badge: "05", accent: "cta", iC: T.cta,
      title: "Wsparcie prawne",
      desc: "Gdy mediacja nie wystarczy — partnerski zespół prawników prowadzi sprawę w sądzie lub postępowaniu egzekucyjnym. Nie zostajesz sam z problemem.",
      features: ["Partner prawny na wypadek eksmisji", "Prowadzenie sprawy sądowej", "Doradztwo na każdym etapie najmu"],
    },
  ];

  const FAQ_ITEMS = [
    {
      q: "Czy umowa podpisana online jest ważna w polskim sądzie?",
      a: "Tak. Korzystamy ze standardu eIDAS — podpis elektroniczny ma taką samą moc prawną jak podpis własnoręczny. Polskie sądy w pełni uznają tak podpisane dokumenty.",
    },
    {
      q: "Co się stanie, jeśli najemca przestanie płacić?",
      a: "Aktywujemy wsparcie: mediator podejmuje kontakt z najemcą w celu polubownego rozwiązania. Jeśli to nie zadziała — partner prawny przeprowadzi Cię przez proces eksmisji i windykacji należności.",
    },
    {
      q: "Czy mogę skorzystać tylko z wybranej usługi?",
      a: "Tak. Możesz zacząć od samej umowy, a dodatkowe zabezpieczenia (mediacja, ubezpieczenie, najem okazjonalny) aktywować w dowolnym momencie trwania najmu.",
    },
  ];

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Manrope,system-ui,sans-serif", color: T.textPrimary, transition: "background 0.4s,color 0.4s" }}>
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
                    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
                    return (
                      <Link key={id} to={path} style={{
                        padding: "4px 4px", borderRadius: 8, fontSize: 14,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? T.cta : T.textSecondary,
                        textDecoration: "none",
                        background: isActive ? T.ctaDim : "transparent",
                        border: `1px solid ${isActive ? T.ctaBorder : "transparent"}`,
                        transition: "color 0.2s, background 0.2s",
                      }}>{label}</Link>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setIsDark(!isDark)} style={{ background: T.toggleBg, border: `1px solid ${T.toggleBorder}`, borderRadius: 99, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: T.textSecondary, fontSize: 13, fontWeight: 600, fontFamily: "Manrope,sans-serif", transition: "all 0.25s", flexShrink: 0 }}>
                {isDark ? <><Sun size={15} color="#f59e0b" /><span className="toggle-label" style={{ color: "#f59e0b" }}>Jasny</span></> : <><Moon size={15} color={T.info} /><span className="toggle-label" style={{ color: T.info }}>Ciemny</span></>}
              </button>
              <button onClick={scrollToForm} className="cta-btn" style={{ padding: "10px 20px", fontSize: 15 }}>
                <span className="nav-cta-text">Dołącz do pilotażu</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </nav>

        <main style={{ overflowX: "hidden" }}>
          {/* HERO */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(24px,4.5vw,64px) clamp(16px,4vw,48px) clamp(40px,5vw,64px)", overflow: "hidden" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div className="hero-heading-wrap">
                <h1 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(36px,5.5vw,64px)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 16, color: T.textPrimary }}>
                  <span style={{ color: T.info }}>Serwis</span> ochrony umowy najmu
                </h1>
                <p style={{ color: T.textSecondary, fontSize: "clamp(15px,2vw,20px)", lineHeight: 1.55, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
                  Podpisz ekspercką umowę najmu z RentStandard i zyskaj dostęp do 5 poziomów ochrony najmu na korzystnych warunkach
                </p>
              </div>

              {/* Two-column: theses + infographic */}
              <div className="hero-split">
                <div className="hero-split-left">
                  <div className="hero-theses-card" style={{
                    textAlign: "left", height: "100%",
                    background: T.bentoCtaBg, border: `1px solid ${T.bentoCtaBorder}`,
                    borderRadius: 20, padding: "28px 32px", position: "relative", overflow: "hidden",
                    backdropFilter: "blur(12px)", boxShadow: `0 8px 40px ${T.bentoGlow}`,
                    display: "flex", flexDirection: "column", justifyContent: "center",
                  }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg,${T.info},${T.cta})`, borderRadius: "20px 0 0 20px" }} />
                    {[
                      {
                        title: "Ekspercka i wykonalna umowa najmu oraz podpis elektroniczny",
                        text: "Zweryfikowana w praktyce sądowej, opracowana przez prawników z 11-letnim doświadczeniem w najmie",
                      },
                      {
                        title: "Ubezpieczenie",
                        text: "Specjalne polisy ubezpieczeniowe dla najmu na korzystnych warunkach",
                      },
                      {
                        title: "Najem okazjonalny",
                        text: "Szybkie przygotowanie dokumentów do zawarcia najmu okazjonalnego online",
                      },
                      {
                        title: "Mediacja",
                        text: "W przypadku konfliktu nasi profesjonalni mediatorzy pomogą polubownie rozwiązać spór bez sądu, w możliwie najkrótszym czasie",
                      },
                      {
                        title: "Wsparcie prawne",
                        text: "Nasi doświadczeni prawnicy w możliwie najkrótszym czasie przeprowadzą niezbędne procedury sądowe",
                      },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0" }}>
                        <span
                          style={{
                            flexShrink: 0,
                            width: 22,
                            height: 22,
                            borderRadius: "999px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            color: isDark ? T.textSecondary : T.cta,
                            background: isDark ? "rgba(15,118,110,0.25)" : "rgba(15,118,110,0.08)",
                            border: `1px solid ${T.ctaBorder}`,
                            marginTop: 2,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ color: isDark ? T.cardLineHi : T.textPrimary, fontSize: "clamp(16px,1.4vw,20px)", fontWeight: 800, lineHeight: 1.2 }}>
                            {item.title}
                          </span>
                          <span style={{ color: isDark ? T.cardLineHi : T.textPrimary, fontSize: "clamp(13px,1.6vw,15px)", lineHeight: 1.6 }}>
                            {item.text}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hero-split-right">
                  <img
                    src={isDark ? structureDarkImg : structureLightImg}
                    alt="Infografika przedstawiająca 6 poziomów ochrony najmu: umowa, weryfikacja, podpis, mediacja, wsparcie prawne i ubezpieczenie"
                  />
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <button onClick={scrollToForm} className="cta-btn pulse-btn" style={{ padding: "18px 32px", fontSize: 18 }}>
                  Dołącz do pilotażu <ArrowRight size={18} />
                </button>

                {/* Trust badges */}
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }} className="hero-trust-wrap">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.ctaDim, border: `1px solid ${T.ctaBorder}`, borderRadius: 99, padding: "8px 20px" }}>
                    <Users size={18} color={T.cta} />
                    <span style={{ fontSize: 20, fontWeight: 800, color: T.cta, fontFamily: "Inter Tight,sans-serif" }}>2 400+</span>
                    <span style={{ fontSize: 14, color: T.textSecondary }}>chronionych właścicieli</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", color: T.badgesColor, fontSize: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Award size={12} /> Zgodność z eIDAS</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Scale size={12} /> RODO 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* VALUE CARDS */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(32px,4.8vw,64px) clamp(16px,4vw,48px)", paddingTop: "clamp(26px,3.8vw,52px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <FadeIn>
                <div className="value-section-heading">
                  <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>Jak to działa</div>
                  <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>Pięć poziomów Twojej ochrony</h2>
                </div>
              </FadeIn>
              <div className="short-cards">
                {VALUE_CARDS.map((card, i) => (
                  <FadeIn key={i} delay={i * 0.12}>
                    <BentoCard accent={card.accent} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ background: `${card.iC}18`, border: `1px solid ${card.iC}40`, borderRadius: 14, padding: 12, display: "flex" }}>
                          <span style={{ color: card.iC }}>{card.icon}</span>
                        </div>
                        <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 40, color: `${card.iC}20`, fontWeight: 700, lineHeight: 1 }}>{card.badge}</span>
                      </div>
                      <h3 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 22, marginBottom: 12, color: T.textPrimary, lineHeight: 1.25 }}>{card.title}</h3>
                      <p style={{ color: T.pillarDesc, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{card.desc}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
                        {card.features.map((f, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <CheckCircle size={14} color={card.iC} />
                            <span style={{ fontSize: 13, color: T.pillarFeat, lineHeight: 1.6 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </BentoCard>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* LEAD FORM */}
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
                            <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,36px)", letterSpacing: "-0.03em", marginBottom: 8, color: T.textPrimary }}>
                              Zabezpiecz swój najem
                            </h2>
                            <p className="form-sub-desktop" style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                              Uruchomienie serwisu planowane jest na <strong style={{ color: T.cta }}>2026</strong> rok.{" "}
                              <strong style={{ color: T.cta }}>Pierwsi użytkownicy</strong> zyskają specjalne warunki i realny wpływ na jego rozwój
                            </p>
                            <p className="form-sub-mobile" style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                              <strong style={{ color: T.info }}>Dołącz</strong> do pilotażu serwisu{" "}
                              <strong style={{ color: T.cta }}>ochrony najmu</strong>
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
                                type="email"
                                placeholder="twoj@email.pl"
                                required
                                value={formData.email}
                                onChange={e => { setFormData({ ...formData, email: e.target.value }); if (emailError) setEmailError(null); }}
                                onBlur={validateEmail}
                                style={{ paddingLeft: 40, borderColor: emailError ? T.warn : undefined }}
                              />
                            </div>
                            <div style={{ minHeight: 14, marginTop: 4 }}>
                              <p style={{ margin: 0, fontSize: 12, color: T.warn, opacity: emailError ? 1 : 0 }}>
                                {emailError || " "}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, color: T.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: ".03em" }}>
                              NUMER TELEFONU
                            </label>
                            <div style={{ position: "relative" }}>
                              <Phone size={16} color={T.inputPlaceholder} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                              <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9 ]*"
                                placeholder="516 123 456"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                                style={{ paddingLeft: 40 }}
                              />
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
                              Wyrażam zgodę na przetwarzanie moich danych osobowych przez Rent Standard Polska sp. z o.o. w celu otrzymania materiałów i kontaktu handlowego. Mogę cofnąć zgodę w każdej chwili.
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
                            {isSubmitting ? "Wysyłanie..." : <>Dołącz do pilotażu <ArrowRight size={18} /></>}
                          </button>
                          <div style={{ minHeight: 18, marginTop: 8 }}>
                            <p style={{ margin: 0, fontSize: 12, color: T.warn, opacity: submitError ? 1 : 0 }}>
                              {submitError || " "}
                            </p>
                          </div>
                          <p style={{ textAlign: "center", fontSize: 12, color: T.formPrivacy, lineHeight: 1.5 }}>
                            <Lock size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
                            Administratorem Twoich danych jest Rent Standard Polska. Zgodne z RODO. Nie spamujemy — gwarantujemy.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${T.cta},${T.ctaHover})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 0 0 20px ${T.ctaDim}` }}>
                          <CheckCircle size={36} color="#fff" />
                        </div>
                        <h3 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 28, marginBottom: 12, color: T.textPrimary }}>Gotowe! Twoje dane zostały wysłane.</h3>
                        <p style={{ color: T.textSecondary, fontSize: 16 }}>
                          Skontaktujemy się z Tobą w najbliższym czasie.
                        </p>
                      </div>
                    )}
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* MINI FAQ */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
            <div style={{ width: 120, height: 3, margin: "0 auto 48px", background: `linear-gradient(90deg,${T.cta},${T.info})`, borderRadius: 99 }} />
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <FadeIn>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
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
                        background: T.bentoNoneBg,
                        border: `1px solid ${isOpen ? T.cta : T.bentoNoneBorder}`,
                        borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)",
                        boxShadow: isOpen ? `0 8px 32px ${T.bentoGlow}` : "0 2px 12px rgba(0,0,0,0.04)",
                        transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                      }}>
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          style={{
                            width: "100%", padding: "22px 28px", background: "none",
                            border: "none", cursor: "pointer", display: "flex",
                            alignItems: "center", gap: 18, textAlign: "left",
                          }}
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
                          <ChevronRight
                            size={18}
                            color={isOpen ? T.cta : T.textMuted}
                            style={{ flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease, color 0.3s ease" }}
                          />
                        </button>
                        <div style={{
                          maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0,
                          overflow: "hidden", transition: "max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s ease",
                        }}>
                          <div style={{ padding: "0 28px 24px 82px" }}>
                            <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${T.cta},transparent)`, borderRadius: 99, marginBottom: 14 }} />
                            <p style={{ margin: 0, color: T.textSecondary, fontSize: 15, lineHeight: 1.75 }}>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${T.footerBorder}`, padding: "32px clamp(16px,4vw,48px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: `linear-gradient(135deg,${T.info},${T.ctaHover})`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={14} color="#fff" />
                </div>
                <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 16, fontWeight: 700, color: T.textPrimary }}>Rent Standard</span>
              </div>
              <p style={{ color: T.footerText, fontSize: 13 }}>© 2026 Rent Standard Polska sp. z o.o. · KRS 0000000000 · RODO · Polityka prywatności</p>
              <div style={{ display: "flex", gap: 20 }}>
                {["Regulamin", "RODO", "Kontakt"].map((link) => (
                  <a key={link} href="#" style={{ color: T.footerLink, fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = T.cta}
                    onMouseLeave={e => e.target.style.color = T.footerLink}
                  >{link}</a>
                ))}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}
