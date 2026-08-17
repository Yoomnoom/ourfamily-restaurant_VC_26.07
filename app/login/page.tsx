"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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

  if (status === "sent") {
    return (
      <section className="card success">
        <div className="success-mark">✓</div>
        <h1>메일을 보냈어요</h1>
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
        <h1>묻지 않아도 아는 집</h1>
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
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="guest-page">
      <div className="guest-brand">♜ 우리집식당</div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
