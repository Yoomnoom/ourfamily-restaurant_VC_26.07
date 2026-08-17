"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { mealSummary } from "../../lib/data.mjs";

type Profile = { id: string; name: string; email?: string };
type Household = { id: string; name: string; owner_id: string; role: "owner" | "co-admin" | "member" };
type MealResponseRow = {
  id: string;
  profile_id: string | null;
  guest_name: string | null;
  is_guest: boolean;
  status: "attending" | "absent";
  arrival_time: string | null;
};
type Meal = {
  id: string;
  household_id: string;
  creator_id: string;
  date: string;
  time: string;
  kind: string;
  menu: string;
  note: string;
  status: "open" | "confirmed" | "cancelled";
  meal_participants: { profile_id: string }[];
  meal_responses: MealResponseRow[];
};
type Notification = { id: string; text: string; detail: string; read: boolean; meal_id: string | null };
type MenuRequest = { id: string; menu: string; profiles: { id: string; name: string } | null };
type Overlay = "menu" | "notifications" | "households" | "members" | null;

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || "request_failed");
  return body;
}

const Icon = ({ name }: { name: string }) => (
  <span className="icon" aria-hidden="true">
    {{ home: "⌂", table: "♟", add: "+", calendar: "▦", records: "▤", bell: "♢", menu: "☰", pot: "♨", users: "♟", close: "×" }[name]}
  </span>
);
const go = (path: string) => {
  history.pushState({}, "", path);
  dispatchEvent(new PopStateEvent("popstate"));
};
const prettyDate = (date: string) => new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "long" }).format(new Date(`${date}T00:00:00`));
function seoulParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const map = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return { year: Number(map.year), month: Number(map.month), day: Number(map.day) };
}
const todayString = () => {
  const { year, month, day } = seoulParts();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

async function copyShareLink(mealId: string) {
  const { path } = await api(`/api/meals/${mealId}/share-link`, { method: "POST" });
  const url = `${location.origin}${path}`;
  await navigator.clipboard.writeText(url).catch(() => {});
  alert(`공유 링크를 복사했어요.\n${url}`);
}

function MealCard({ meal, profile, compact = false, onChanged }: { meal: Meal; profile: Profile; compact?: boolean; onChanged: () => void }) {
  const summary = mealSummary(meal);
  const mine = meal.meal_responses.find((item) => item.profile_id === profile.id);
  const [busy, setBusy] = useState(false);

  const respond = async (status: "attending" | "absent") => {
    setBusy(true);
    try {
      await api(`/api/meals/${meal.id}/responses`, { method: "POST", body: JSON.stringify({ status, arrivalTime: status === "attending" ? meal.time : "" }) });
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    try {
      await api(`/api/meals/${meal.id}`, { method: "PATCH", body: JSON.stringify({ status: "confirmed" }) });
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className={`card meal-card ${compact ? "compact" : ""}`}>
      <div className="meal-art">
        <Icon name="pot" />
      </div>
      <div className="meal-copy">
        <p className="eyebrow">{meal.status === "confirmed" ? "확정된 식사" : mine ? "오늘의 식탁" : "응답이 필요해요"}</p>
        <p className="muted">
          {prettyDate(meal.date)} · {meal.time}
        </p>
        <h2>{meal.menu}</h2>
        <p className="counts">
          <strong>{summary.attending}명 먹어요</strong>
          <span>{summary.absent}명 안 먹어요</span>
          <em>{summary.pending}명 확인 전</em>
        </p>
        {!compact && (
          <div className="actions">
            {!mine && (
              <>
                <button disabled={busy} onClick={() => respond("attending")}>
                  먹어요
                </button>
                <button className="secondary" disabled={busy} onClick={() => respond("absent")}>
                  안 먹어요
                </button>
              </>
            )}
            {mine && meal.status === "open" && (
              <button disabled={busy} onClick={confirm}>
                현재 인원으로 확정
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Header({ households, currentHouseholdId, overlay, setOverlay }: { households: Household[]; currentHouseholdId: string | null; overlay: Overlay; setOverlay: (value: Overlay) => void }) {
  const household = households.find((item) => item.id === currentHouseholdId);
  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("/")} aria-label="홈으로">
        <span>♜</span>우리집식당
      </button>
      <button className="household" aria-expanded={overlay === "households"} onClick={() => setOverlay(overlay === "households" ? null : "households")}>
        {household?.name ?? "우리집"}⌄
      </button>
      <div className="top-actions">
        <button className="icon-button" aria-label="알림 열기" onClick={() => setOverlay("notifications")}>
          <Icon name="bell" />
        </button>
        <button className="icon-button" aria-label="전체 메뉴 열기" onClick={() => setOverlay("menu")}>
          <Icon name="menu" />
        </button>
      </div>
    </header>
  );
}

function BottomNav({ path }: { path: string }) {
  const items: [string, string, string][] = [
    ["/", "home", "홈"],
    ["/tables", "table", "내 식탁"],
    ["/meals/new", "add", "식사 만들기"],
    ["/calendar", "calendar", "달력"],
    ["/records", "records", "기록"]
  ];
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {items.map(([href, icon, label], index) => (
        <button key={href} aria-current={path === href ? "page" : undefined} className={index === 2 ? "create" : ""} onClick={() => go(href)}>
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function MembersPanel({ householdId, myRole, close }: { householdId: string; myRole: Household["role"]; close: () => void }) {
  const [members, setMembers] = useState<{ id: string; role: string; profiles: { id: string; name: string } | null }[]>([]);
  const [invite, setInvite] = useState("");
  const isAdmin = myRole === "owner" || myRole === "co-admin";

  useEffect(() => {
    api(`/api/households/${householdId}/members`).then((body) => setMembers(body.members));
  }, [householdId]);

  const createInvite = async () => {
    const { code } = await api(`/api/households/${householdId}/invites`, { method: "POST" });
    setInvite(code);
  };

  const removeMember = async (memberId: string) => {
    await api(`/api/households/${householdId}/members/${memberId}`, { method: "DELETE" });
    setMembers((current) => current.filter((member) => member.id !== memberId));
  };

  return (
    <div className="notification-list">
      {members.map((member) => (
        <div key={member.id} className="strip" style={{ cursor: "default" }}>
          <span className="avatar">{member.profiles?.name?.[0] ?? "?"}</span>
          <span>
            <b>{member.profiles?.name}</b>
            <small>{member.role === "owner" ? "오너" : member.role === "co-admin" ? "공동 관리자" : "구성원"}</small>
          </span>
          {isAdmin && member.role !== "owner" && <button className="secondary" onClick={() => removeMember(member.id)}>내보내기</button>}
        </div>
      ))}
      {isAdmin && (
        <div style={{ padding: "17px 20px" }}>
          {invite ? (
            <p className="muted">
              초대 코드: <b>{invite}</b> (한 번만 표시돼요)
            </p>
          ) : (
            <button className="secondary" onClick={createInvite}>초대 코드 만들기</button>
          )}
        </div>
      )}
      <button className="reset" onClick={close}>닫기</button>
    </div>
  );
}

function OverlayPanel({
  overlay,
  households,
  currentHouseholdId,
  setCurrentHouseholdId,
  myRole,
  notifications,
  close,
  onNotificationsChanged,
  onHouseholdsChanged
}: {
  overlay: Overlay;
  households: Household[];
  currentHouseholdId: string | null;
  setCurrentHouseholdId: (id: string) => void;
  myRole: Household["role"] | undefined;
  notifications: Notification[];
  close: () => void;
  onNotificationsChanged: () => void;
  onHouseholdsChanged: () => void;
}) {
  useEffect(() => {
    if (!overlay) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [overlay, close]);

  if (!overlay) return null;

  if (overlay === "households") {
    const createHousehold = async () => {
      const name = prompt("새 가구 이름을 입력해주세요.");
      if (!name) return;
      const { household } = await api("/api/households", { method: "POST", body: JSON.stringify({ name }) });
      onHouseholdsChanged();
      setCurrentHouseholdId(household.id);
      close();
    };
    const joinHousehold = async () => {
      const code = prompt("초대 코드를 입력해주세요.");
      if (!code) return;
      try {
        const { household } = await api("/api/invites/redeem", { method: "POST", body: JSON.stringify({ code }) });
        onHouseholdsChanged();
        setCurrentHouseholdId(household.id);
      } catch {
        alert("초대 코드가 올바르지 않거나 만료됐어요.");
      }
      close();
    };
    return (
      <div className="scrim" onMouseDown={(event) => event.target === event.currentTarget && close()}>
        <div className="popover" role="dialog" aria-modal="true" aria-label="가구 선택" tabIndex={-1}>
          <h2>가구 선택</h2>
          {households.map((house) => (
            <button key={house.id} onClick={() => { setCurrentHouseholdId(house.id); close(); }}>
              <span>
                <b>{house.name}</b>
              </span>
              {house.id === currentHouseholdId && <strong>✓</strong>}
            </button>
          ))}
          <button onClick={createHousehold}>새 가구 만들기</button>
          <button onClick={joinHousehold}>초대 코드로 참여</button>
        </div>
      </div>
    );
  }

  if (overlay === "members") {
    return (
      <div className="scrim" onMouseDown={(event) => event.target === event.currentTarget && close()}>
        <aside className="drawer" role="dialog" aria-modal="true" aria-label="가족 구성원" tabIndex={-1}>
          <div className="drawer-head">
            <h2>가족 구성원</h2>
            <button className="icon-button" aria-label="닫기" onClick={close}>
              <Icon name="close" />
            </button>
          </div>
          {currentHouseholdId && myRole && <MembersPanel householdId={currentHouseholdId} myRole={myRole} close={close} />}
        </aside>
      </div>
    );
  }

  const notificationsOverlay = overlay === "notifications";
  const groups = notificationsOverlay
    ? []
    : [
        ["가족과 가구", "가족 구성원"],
        ["반복 설정", "요일별 기본 응답", "반복 식사 관리", "자주 가는 곳", "알림 설정"],
        ["살림과 제안", "우리집 냉장고", "밀키트 둘러보기"],
        ["서비스", "지문 로그인 등록", "계정 설정", "도움말", "개인정보 및 데이터"]
      ];

  const markAllRead = async () => {
    await api("/api/notifications", { method: "PATCH", body: JSON.stringify({ all: true }) });
    onNotificationsChanged();
  };
  const markRead = async (id: string) => {
    await api("/api/notifications", { method: "PATCH", body: JSON.stringify({ id }) });
    onNotificationsChanged();
  };

  return (
    <div className="scrim" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={notificationsOverlay ? "알림" : "전체 메뉴"} tabIndex={-1}>
        <div className="drawer-head">
          <h2>{notificationsOverlay ? "알림" : "전체 메뉴"}</h2>
          {notificationsOverlay && <button onClick={markAllRead}>모두 읽음</button>}
          <button className="icon-button" aria-label="닫기" onClick={close}>
            <Icon name="close" />
          </button>
        </div>
        {notificationsOverlay ? (
          <div className="notification-list">
            {notifications.length === 0 && <p className="muted" style={{ padding: "20px 3px" }}>아직 알림이 없어요.</p>}
            {notifications.map((item) => (
              <button key={item.id} className={item.read ? "read" : ""} onClick={() => markRead(item.id)}>
                <span className="avatar">{item.read ? "✓" : "!"}</span>
                <span>
                  <b>{item.text}</b>
                  <small>{item.detail}</small>
                </span>
              </button>
            ))}
          </div>
        ) : (
          groups.map(([title, ...items]) => (
            <section className="menu-group" key={title}>
              <h3>{title}</h3>
              {items.map((item) =>
                item === "가족 구성원" ? (
                  <button key={item} onClick={() => { close(); setTimeout(() => window.dispatchEvent(new CustomEvent("open-members")), 0); }}>
                    {item}
                    <span>›</span>
                  </button>
                ) : item === "지문 로그인 등록" ? (
                  <button key={item} onClick={() => { close(); setTimeout(() => window.dispatchEvent(new CustomEvent("register-passkey")), 0); }}>
                    {item}
                    <span>›</span>
                  </button>
                ) : (
                  <button key={item}>
                    {item}
                    <span>›</span>
                  </button>
                )
              )}
            </section>
          ))
        )}
        {!notificationsOverlay && (
          <form action="/api/auth/signout" method="post">
            <button className="reset" style={{ width: "100%" }}>로그아웃</button>
          </form>
        )}
      </aside>
    </div>
  );
}

function Onboarding({ onReady }: { onReady: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const createHousehold = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") || "").trim();
    if (!name) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/households", { method: "POST", body: JSON.stringify({ name }) });
      onReady();
    } catch {
      setError("가구를 만들지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  const joinHousehold = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get("code") || "").trim();
    if (!code) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/invites/redeem", { method: "POST", body: JSON.stringify({ code }) });
      onReady();
    } catch {
      setError("초대 코드가 올바르지 않거나 만료됐어요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="guest-page warm-table">
      <div className="guest-brand wt-serif">우리집식당</div>
      <section className="guest-intro">
        <h1 className="wt-serif">우리집을 시작해요</h1>
        <p>새 가구를 만들거나, 가족에게 받은 초대 코드로 참여해요.</p>
      </section>
      <form className="card response-form" onSubmit={createHousehold}>
        <label>
          가구 이름
          <input name="name" placeholder="예: 우리집" required />
        </label>
        <button className="submit" disabled={busy}>가구 만들기</button>
      </form>
      <form className="card response-form" onSubmit={joinHousehold}>
        <label>
          초대 코드
          <input name="code" placeholder="가족에게 받은 코드" required />
        </label>
        <button className="submit" disabled={busy}>코드로 참여하기</button>
      </form>
      {error && <p className="muted">{error}</p>}
    </main>
  );
}

function Home({ meals, profile, onChanged }: { meals: Meal[]; profile: Profile; onChanged: () => void }) {
  const today = meals.find((meal) => meal.date === todayString());
  const upcoming = meals.filter((meal) => meal.status === "open" && meal.date > todayString());
  if (!today) {
    return (
      <>
        <h1 className="greeting">좋은 저녁이에요, {profile.name} 님</h1>
        <section className="card empty">
          <div className="empty-art">
            ⌂<span>♧</span>
          </div>
          <h2>오늘 열린 식사가 없어요</h2>
          <p>
            식사를 만들면 가족에게 누가 먹는지
            <br />
            바로 물어볼 수 있어요.
          </p>
          <button onClick={() => go("/meals/new")}>오늘 식사 만들기</button>
        </section>
        <HomeExtras meals={meals} upcomingCount={upcoming.length} />
      </>
    );
  }
  const summary = mealSummary(today);
  return (
    <>
      <h1 className="greeting">좋은 저녁이에요, {profile.name} 님</h1>
      <MealCard meal={today} profile={profile} onChanged={onChanged} />
      {summary.pending > 0 && (
        <section className="card todo">
          <div>
            <p className="eyebrow">
              내가 할 일 <em>!</em>
            </p>
            <h3>
              <strong>{summary.pending}명</strong>이 아직 응답하지 않았어요
            </h3>
          </div>
          <button className="secondary" onClick={() => copyShareLink(today.id)}>미응답자에게 알리기</button>
        </section>
      )}
      <HomeExtras meals={meals} upcomingCount={upcoming.length} />
    </>
  );
}

function HomeExtras({ meals, upcomingCount }: { meals: Meal[]; upcomingCount: number }) {
  const [menuRequests, setMenuRequests] = useState<MenuRequest[]>([]);
  useEffect(() => {
    const householdId = meals[0]?.household_id;
    if (!householdId) return;
    api(`/api/menu-requests?householdId=${householdId}`).then((body) => setMenuRequests(body.menuRequests));
  }, [meals]);
  const lastConfirmed = meals.filter((meal) => meal.status === "confirmed").slice(-1)[0];
  return (
    <>
      <button className="card strip" onClick={() => go("/calendar")}>
        <Icon name="calendar" />
        <span>
          <b>앞으로 예정된 식사 {upcomingCount}개</b>
          <small>미리 답해두고 조율을 줄여보세요</small>
        </span>
        <strong>미리 답해두기 ›</strong>
      </button>
      {menuRequests.length > 0 && (
        <section>
          <h2 className="section-title">가족이 먹고 싶어 해요</h2>
          <div className="card request-list">
            {menuRequests.map((request) => (
              <button key={request.id} onClick={() => go(`/meals/new?menu=${encodeURIComponent(request.menu)}`)}>
                <span className="avatar">{request.profiles?.name?.[0]}</span>
                <span>
                  {request.profiles?.name} · <b>{request.menu}</b>
                </span>
                <strong>이걸로 만들기 ›</strong>
              </button>
            ))}
          </div>
        </section>
      )}
      {lastConfirmed && (
        <button className="card strip" onClick={() => go(`/meals/new?menu=${encodeURIComponent(lastConfirmed.menu)}`)}>
          <Icon name="pot" />
          <span>
            <b>지난 식사 다시 만들기</b>
            <small>가족이 함께 먹은 구성을 불러와요</small>
          </span>
          <strong>›</strong>
        </button>
      )}
    </>
  );
}

function Tables({ meals, profile, onChanged }: { meals: Meal[]; profile: Profile; onChanged: () => void }) {
  return (
    <>
      <div className="page-head">
        <h1>내 식탁</h1>
        <p>내가 만들거나 참여하는 식사</p>
      </div>
      <div className="stack">
        {meals.filter((meal) => meal.status !== "cancelled").map((meal) => (
          <MealCard key={meal.id} meal={meal} profile={profile} onChanged={onChanged} />
        ))}
        {meals.length === 0 && <p className="muted">아직 만든 식사가 없어요.</p>}
      </div>
    </>
  );
}

function Calendar({ meals }: { meals: Meal[] }) {
  const { year, month, day: todayDay } = seoulParts();
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const mealByDay = new Map(meals.filter((meal) => meal.date.startsWith(monthPrefix)).map((meal) => [Number(meal.date.slice(-2)), meal]));
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => (index < firstWeekday ? null : index - firstWeekday + 1));
  const todayMeal = mealByDay.get(todayDay);
  return (
    <>
      <div className="page-head">
        <h1>식사 달력</h1>
      </div>
      <section className="card calendar">
        <div className="month">
          <button aria-label="이전 달" disabled>‹</button>
          <h2>{year}년 {month}월</h2>
          <button aria-label="다음 달" disabled>›</button>
        </div>
        <div className="weekdays">
          {"일월화수목금토".split("").map((day) => (
            <b key={day}>{day}</b>
          ))}
        </div>
        <div className="days">
          {cells.map((day, index) => {
            const meal = day ? mealByDay.get(day) : undefined;
            return (
              <button key={index} disabled={!day} className={day === todayDay ? "selected" : ""} onClick={() => meal && go("/tables")}>
                <span>{day}</span>
                {meal && <small>•<br />{meal.menu}</small>}
              </button>
            );
          })}
        </div>
      </section>
      <section className="card date-detail">
        <Icon name="pot" />
        <div>
          <h2>{prettyDate(todayString())}</h2>
          <p>{todayMeal ? `오늘 · ${todayMeal.menu} · ${todayMeal.time}` : "오늘은 열린 식사가 없어요"}</p>
        </div>
        {todayMeal && <strong onClick={() => go("/tables")} style={{ cursor: "pointer" }}>응답 필요 ›</strong>}
      </section>
    </>
  );
}

function Records({ meals }: { meals: Meal[] }) {
  const records = meals.filter((meal) => meal.status === "confirmed").sort((a, b) => (a.date < b.date ? 1 : -1));
  const attendanceCounts = records.map((meal) => mealSummary(meal).attending);
  const averageAttendance = attendanceCounts.length ? Math.round(attendanceCounts.reduce((sum, value) => sum + value, 0) / attendanceCounts.length) : 0;
  const menuCounts = new Map<string, number>();
  records.forEach((meal) => menuCounts.set(meal.menu, (menuCounts.get(meal.menu) ?? 0) + 1));
  let favoriteMenu = "-";
  let bestCount = 0;
  menuCounts.forEach((count, menu) => {
    if (count > bestCount) {
      bestCount = count;
      favoriteMenu = menu;
    }
  });
  return (
    <>
      <div className="page-head">
        <h1>식사 기록</h1>
        <p>지난 결정은 다시 써요</p>
      </div>
      <section className="card stats">
        <h2>한눈에 보기</h2>
        <div>
          <span>
            <Icon name="users" />
            <small>함께 먹은 식사</small>
            <b>{records.length}번</b>
          </span>
          <span>
            <Icon name="table" />
            <small>평균 참여</small>
            <b>{averageAttendance}명</b>
          </span>
          <span>
            <Icon name="pot" />
            <small>자주 먹은 메뉴</small>
            <b>{favoriteMenu}</b>
          </span>
        </div>
      </section>
      <div className="stack">
        {records.map((meal) => (
          <article className="card record" key={meal.id}>
            <div className="meal-art">
              <Icon name="pot" />
            </div>
            <div>
              <p className="muted">{prettyDate(meal.date)}</p>
              <h2>{meal.menu}</h2>
              <p>{mealSummary(meal).attending}명 함께 먹었어요</p>
              <button className="secondary" onClick={() => go(`/meals/new?menu=${encodeURIComponent(meal.menu)}`)}>같은 구성으로 만들기</button>
            </div>
          </article>
        ))}
        {records.length === 0 && <p className="muted">아직 확정된 식사가 없어요.</p>}
      </div>
    </>
  );
}

function NewMeal({ householdId, onCreated }: { householdId: string; onCreated: () => void }) {
  const params = typeof location === "undefined" ? null : new URLSearchParams(location.search);
  const [kind, setKind] = useState("집밥");
  const [members, setMembers] = useState<{ id: string; profiles: { id: string; name: string } | null }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    api(`/api/households/${householdId}/members`).then((body) => setMembers(body.members));
  }, [householdId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const { meal } = await api("/api/meals", {
        method: "POST",
        body: JSON.stringify({
          householdId,
          date: String(form.get("date")),
          time: String(form.get("time")),
          kind,
          menu: String(form.get("menu")),
          note: String(form.get("note"))
        })
      });
      const { path } = await api(`/api/meals/${meal.id}/share-link`, { method: "POST" });
      setShareUrl(`${location.origin}${path}`);
      onCreated();
    } catch {
      setError("식사를 만들지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  if (shareUrl) {
    return (
      <section className="card success" style={{ marginTop: 40 }}>
        <div className="success-mark">✓</div>
        <h1>식사를 만들었어요</h1>
        <p>가족에게 이 링크를 보내주세요.</p>
        <p className="muted" style={{ wordBreak: "break-all" }}>{shareUrl}</p>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(shareUrl).catch(() => {});
            alert("링크를 복사했어요.");
          }}
        >
          링크 복사하기
        </button>
        <button className="secondary" style={{ marginTop: 10 }} onClick={() => go("/")}>홈으로</button>
      </section>
    );
  }

  return (
    <form className="meal-form" onSubmit={submit}>
      <div className="form-head">
        <h1>새 식사 만들기</h1>
        <button type="button" className="icon-button" aria-label="닫기" onClick={() => history.back()}>
          <Icon name="close" />
        </button>
      </div>
      <div className="progress">
        <i />
      </div>
      <fieldset className="card">
        <legend>식사 종류</legend>
        <div className="segments">
          {["집밥", "외식", "배달"].map((item) => (
            <button type="button" className={kind === item ? "active" : ""} key={item} onClick={() => setKind(item)}>
              {item}
            </button>
          ))}
        </div>
      </fieldset>
      <label>
        날짜
        <input name="date" type="date" defaultValue={todayString()} required />
      </label>
      <label>
        시간
        <input name="time" type="time" defaultValue="19:00" required />
      </label>
      <label>
        메뉴
        <input name="menu" defaultValue={params?.get("menu") || ""} placeholder="무엇을 먹나요?" required />
      </label>
      <label>
        메모
        <textarea name="note" placeholder="가족에게 전할 내용 (선택)" />
      </label>
      <fieldset className="card participants">
        <legend>참여자</legend>
        {members.map((member) => (
          <span key={member.id}>{member.profiles?.name} ✓</span>
        ))}
      </fieldset>
      {error && <p className="muted">{error}</p>}
      <button className="submit" disabled={busy}>{busy ? "만드는 중" : "식사 만들고 링크 보기"}</button>
    </form>
  );
}

function Respond({ token }: { token: string }) {
  const [meal, setMeal] = useState<{ meal_id: string; date: string; time: string; menu: string } | null | "error">(null);
  const [guestToken] = useState(() => (typeof localStorage === "undefined" ? "" : localStorage.getItem(`guest-${token}`) || crypto.randomUUID()));
  const [saved, setSaved] = useState<{ respondent_name?: string; guest_name?: string; status: string; arrival_time: string | null } | null>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/respond/${token}`)
      .then((body) => setMeal(body.meal))
      .catch(() => setMeal("error"));
  }, [token]);

  useEffect(() => {
    if (!meal || meal === "error") return;
    api(`/api/respond/${token}/response?guestToken=${guestToken}`).then((body) => {
      setSaved(body.response);
      setEditing(!body.response);
    });
  }, [meal, token, guestToken]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      localStorage.setItem(`guest-${token}`, guestToken);
      const { response } = await api(`/api/respond/${token}/response`, {
        method: "POST",
        body: JSON.stringify({
          guestToken,
          name: String(form.get("name")),
          status: String(form.get("status")),
          arrivalTime: String(form.get("arrivalTime") || "")
        })
      });
      setSaved(response);
      setEditing(false);
    } catch {
      setError("응답을 보내지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  if (meal === "error") {
    return (
      <main className="guest-page">
        <div className="guest-brand">♜ 우리집식당</div>
        <section className="card empty">
          <h2>링크를 찾을 수 없어요</h2>
          <p>만료됐거나 잘못된 링크예요.</p>
        </section>
      </main>
    );
  }

  if (!meal) return null;

  if (saved && !editing) {
    return (
      <main className="guest-page">
        <div className="guest-brand">♜ 우리집식당</div>
        <section className="card success">
          <div className="success-mark">✓</div>
          <h1>응답을 전했어요</h1>
          <p>
            <b>{saved.guest_name}</b> 님은 {meal.menu}를
            <br />
            <strong>{saved.status === "attending" ? "먹어요" : "안 먹어요"}</strong>
            {saved.arrival_time && ` · ${saved.arrival_time} 도착`}
          </p>
          <button onClick={() => setEditing(true)}>응답 수정하기</button>
        </section>
      </main>
    );
  }

  return (
    <main className="guest-page">
      <div className="guest-brand">♜ 우리집식당</div>
      <section className="guest-intro">
        <p>
          {prettyDate(meal.date)} · {meal.time}
        </p>
        <h1>{meal.menu}, 함께 먹을까요?</h1>
        <p>회원가입 없이 30초면 답할 수 있어요.</p>
      </section>
      <form className="card response-form" onSubmit={submit}>
        <label>
          이름
          <input name="name" defaultValue={saved?.guest_name || ""} required autoComplete="name" />
        </label>
        <fieldset>
          <legend>참여 여부</legend>
          <label className="choice">
            <input type="radio" name="status" value="attending" defaultChecked={saved?.status !== "absent"} />
            <span>먹어요</span>
          </label>
          <label className="choice">
            <input type="radio" name="status" value="absent" defaultChecked={saved?.status === "absent"} />
            <span>안 먹어요</span>
          </label>
        </fieldset>
        <label>
          도착 시간 <small>(먹는 경우)</small>
          <input type="time" name="arrivalTime" defaultValue={saved?.arrival_time || meal.time} />
        </label>
        {error && <p className="muted">{error}</p>}
        <button className="submit" disabled={busy}>{busy ? "보내는 중" : "응답 보내기"}</button>
      </form>
    </main>
  );
}

function Landing() {
  return (
    <main className="guest-page warm-table">
      <div className="guest-brand wt-serif">우리집식당</div>
      <section className="guest-intro">
        <h1 className="wt-serif">묻지 않아도 아는 집</h1>
        <p>가족 식사에서 반복되는 질문과 인원 조율을 줄여주는 서비스예요.</p>
      </section>
      <section className="card response-form">
        <p>
          <b>식사 만들기</b> → 링크 공유 → 가족이 <b>먹어요/안 먹어요</b> 응답 → 인원 확정 → 기록으로 다시 만들기.
          <br />
          <br />
          가족이 아니어도 공유받은 링크가 있다면 <b>회원가입 없이</b> 그 자리에서 바로 응답할 수 있어요.
        </p>
        <button className="submit" onClick={() => (location.href = "/login")}>
          로그인하고 시작하기
        </button>
      </section>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState("/");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [households, setHouseholds] = useState<Household[] | null>(null);
  const [currentHouseholdId, setCurrentHouseholdIdState] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const navigate = () => {
      setPath(location.pathname);
      setOverlay(null);
    };
    navigate();
    addEventListener("popstate", navigate);
    return () => removeEventListener("popstate", navigate);
  }, []);

  const setCurrentHouseholdId = useCallback((id: string) => {
    setCurrentHouseholdIdState(id);
    localStorage.setItem("current-household-id", id);
  }, []);

  const loadSession = useCallback(async () => {
    try {
    const response = await fetch("/api/me");
    if (response.status === 401) {
      if (location.pathname === "/") {
        setShowLanding(true);
        return;
      }
      location.href = `/login?next=${encodeURIComponent(location.pathname)}`;
      return;
    }
    if (!response.ok) {
      setLoadError(true);
      return;
    }
    const body = await response.json();
    setProfile(body.profile);
    setHouseholds(body.households);
    const saved = localStorage.getItem("current-household-id");
    const validSaved = body.households.find((house: Household) => house.id === saved);
    if (validSaved) setCurrentHouseholdIdState(validSaved.id);
      else if (body.households[0]) setCurrentHouseholdId(body.households[0].id);
    } catch {
      setLoadError(true);
    }
  }, [setCurrentHouseholdId]);

  useEffect(() => {
    if (!path.startsWith("/respond/")) loadSession();
  }, [loadSession, path]);

  const loadMeals = useCallback(async () => {
    if (!currentHouseholdId) return;
    const body = await api(`/api/meals?householdId=${currentHouseholdId}`);
    setMeals(body.meals);
  }, [currentHouseholdId]);

  const loadNotifications = useCallback(async () => {
    const body = await api("/api/notifications");
    setNotifications(body.notifications);
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  useEffect(() => {
    if (profile) loadNotifications();
  }, [profile, loadNotifications]);

  useEffect(() => {
    const openMembers = () => setOverlay("members");
    window.addEventListener("open-members", openMembers);
    return () => window.removeEventListener("open-members", openMembers);
  }, []);

  useEffect(() => {
    const registerPasskey = async () => {
      try {
        const optionsResponse = await fetch("/api/webauthn/register/options", { method: "POST" });
        if (!optionsResponse.ok) throw new Error("options_failed");
        const options = await optionsResponse.json();
        const attestation = await startRegistration({ optionsJSON: options });
        const verifyResponse = await fetch("/api/webauthn/register/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attestation)
        });
        if (!verifyResponse.ok) throw new Error("verify_failed");
        alert("이 기기에 지문 로그인을 등록했어요.");
      } catch {
        alert("지문 로그인 등록에 실패했어요. 기기가 지문/패스키를 지원하는지 확인해주세요.");
      }
    };
    window.addEventListener("register-passkey", registerPasskey);
    return () => window.removeEventListener("register-passkey", registerPasskey);
  }, []);

  if (path.startsWith("/respond/")) return <Respond token={path.split("/")[2]} />;

  if (showLanding) return <Landing />;

  if (loadError) {
    return (
      <main className="guest-page">
        <div className="guest-brand">♜ 우리집식당</div>
        <section className="card empty">
          <h2>불러오지 못했어요</h2>
          <p>잠시 후 다시 시도해주세요.</p>
        </section>
      </main>
    );
  }

  if (!profile || !households) {
    return (
      <main className="guest-page">
        <div className="guest-brand">♜ 우리집식당</div>
        <p className="muted" style={{ padding: 24 }}>불러오는 중이에요…</p>
      </main>
    );
  }

  if (households.length === 0) return <Onboarding onReady={loadSession} />;

  const currentHousehold = households.find((house) => house.id === currentHouseholdId);
  const page =
    path === "/tables" ? (
      <Tables meals={meals} profile={profile} onChanged={loadMeals} />
    ) : path === "/calendar" ? (
      <Calendar meals={meals} />
    ) : path === "/records" ? (
      <Records meals={meals} />
    ) : path === "/meals/new" ? (
      currentHouseholdId && <NewMeal householdId={currentHouseholdId} onCreated={loadMeals} />
    ) : (
      <Home meals={meals} profile={profile} onChanged={loadMeals} />
    );

  return (
    <div className="app-shell">
      <Header households={households} currentHouseholdId={currentHouseholdId} overlay={overlay} setOverlay={setOverlay} />
      <main className="content">{page}</main>
      {path !== "/meals/new" && <BottomNav path={path} />}
      <OverlayPanel
        overlay={overlay}
        households={households}
        currentHouseholdId={currentHouseholdId}
        setCurrentHouseholdId={setCurrentHouseholdId}
        myRole={currentHousehold?.role}
        notifications={notifications}
        close={() => setOverlay(null)}
        onNotificationsChanged={loadNotifications}
        onHouseholdsChanged={loadSession}
      />
    </div>
  );
}
