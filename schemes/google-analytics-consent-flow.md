# Google Analytics 4 (gtag) and cookie consent

```mermaid
sequenceDiagram
  participant App as AppBootstrap
  participant Stub as GtagConsentStub
  participant Opt as OptionalScripts
  participant GA as GoogleAnalyticsModule
  participant Net as googletagmanager.com

  App->>Stub: initGtagConsentStub_once
  Note over Stub: dataLayer, gtag fn, consent default denied
  App->>Opt: registerOptionalConsentHooks
  Opt->>GA: syncGaWithConsent
  alt analytics denied or no measurement ID
    GA-->>Opt: no script
  else analytics granted
    GA->>Net: inject gtag/js?id=G-xxx
    Net-->>GA: script loaded
    GA->>GA: consent update granted
    GA->>GA: gtag config send_page_view
  end
  Note over GA: on consent revoke: consent update denied
```
