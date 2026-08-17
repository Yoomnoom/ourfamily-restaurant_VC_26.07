"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { browserSupportsWebAuthn, startAuthentication } from "@simplewebauthn/browser";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyMessage, setPasskeyMessage] = useState("");
  const [passkeyBusy, setPasskeyBusy] = useState(false);

  useEffect(() => {
    fetch("/api/me").then((response) => {
      if (response.ok) location.href = next;
    });
  }, [next]);

  useEffect(() => {
    setPasskeySupported(browserSupportsWebAuthn());
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, next })
    });
    setStatus(response.ok ? "sent" : "error");
  };

  const loginWithPasskey = async () => {
    setPasskeyBusy(true);
    setPasskeyMessage("");
    try {
      const optionsResponse = await fetch("/api/webauthn/login/options", { method: "POST" });
      if (!optionsResponse.ok) throw new Error("options_failed");
      const options = await optionsResponse.json();
      const assertion = await startAuthentication({ optionsJSON: options });
      const verifyResponse = await fetch("/api/webauthn/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assertion)
      });
      if (!verifyResponse.ok) throw new Error("verify_failed");
      location.href = next;
    } catch {
      setPasskeyMessage("지문 로그인에 실패했어요. 먼저 이메일 링크로 로그인한 뒤 등록해주세요.");
    } finally {
      setPasskeyBusy(false);
    }
  };

  if (status === "sent") {
    return (
      <section className="card success">
        <div className="success-mark">✓</div>
        <h1 className="wt-serif">메일을 보냈어요</h1>
        <p>
          <b>{email}</b>로 로그인 링크를 보냈어요.
          <br />
          메일함에서 링크를 눌러 들어와주세요.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="guest-intro">
        <h1 className="wt-serif">묻지 않아도 아는 집</h1>
        <p>이메일로 로그인 링크를 받아 시작해요.</p>
      </section>
      <form className="card response-form" onSubmit={submit}>
        <label>
          이메일
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        </label>
        <button className="submit" disabled={status === "sending"}>
          {status === "sending" ? "보내는 중" : "로그인 링크 받기"}
        </button>
        {status === "error" && <p className="muted">링크를 보내지 못했어요. 잠시 후 다시 시도해주세요.</p>}
      </form>
      {passkeySupported && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 4px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span className="muted" style={{ fontSize: 13 }}>또는</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <button className="secondary" style={{ width: "100%" }} disabled={passkeyBusy} onClick={loginWithPasskey}>
            {passkeyBusy ? "지문 확인 중" : "지문/패스키로 로그인"}
          </button>
          {passkeyMessage && <p className="muted" style={{ marginTop: 8 }}>{passkeyMessage}</p>}
        </>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="guest-page warm-table">
      <div className="guest-brand wt-serif">우리집식당</div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
