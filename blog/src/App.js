import React, { useEffect, useRef } from "react";

function MatrixRain({ opacity = 0.14 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 22;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }).map(
      () => Math.random() * canvas.height
    );
    const chars =
      "アイウカサナハマアラヤタワABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    function draw() {
      ctx.fillStyle = `rgba(24,28,35,${opacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#26ffa7";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i]);

        drops[i] =
          drops[i] > canvas.height && Math.random() > 0.975
            ? 0
            : drops[i] + fontSize;
      }
    }

    const interval = setInterval(draw, 44);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      id="matrix-bg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

function LaserLine() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = Math.min(window.innerWidth * 0.88, 1120);
    const height = 7;
    canvas.width = width;
    canvas.height = height;
    let glow = 0,
      dir = 1;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(30,255,220,0.13)";
      ctx.fillRect(0, height / 2 - 1, width, 2);

      glow += dir * 0.16;
      if (glow > 14) dir = -1;
      if (glow < 0) dir = 1;
      const grad = ctx.createLinearGradient(0, height / 2, width, height / 2);
      grad.addColorStop(0, "rgba(20,255,180,0)");
      grad.addColorStop(0.1, "rgba(60,255,200,0.1)");
      grad.addColorStop(0.45, `rgba(100,255,255,${0.11 + glow / 23})`);
      grad.addColorStop(0.5, `rgba(180,255,255,${0.82 + glow / 28})`);
      grad.addColorStop(0.55, `rgba(100,255,255,${0.11 + glow / 23})`);
      grad.addColorStop(0.9, "rgba(60,255,200,0.1)");
      grad.addColorStop(1, "rgba(20,255,180,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, height / 2 - 2, width, 4);
    }

    const timer = setInterval(draw, 22);
    return () => clearInterval(timer);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        margin: "32px auto",
        width: "88vw",
        height: 7,
        maxWidth: "1120px",
        zIndex: 9,
        pointerEvents: "none",
        filter: "brightness(2) blur(0.5px)",
        transition: "width 0.2s",
      }}
    />
  );
}

export default function App() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        fontFamily: "Roboto, sans-serif, 'Noto Sans TC', 'Noto Sans SC'",
      }}
    >
      <MatrixRain />
      <header
        style={{
          position: "relative",
          zIndex: 3,
          marginTop: 44,
          textAlign: "center",
          color: "#26ffa7",
        }}
      >
        <h1 style={{ fontSize: "2.7em", letterSpacing: "0.16em" }}>
          Muse × Beam · Blog
        </h1>
        <LaserLine />
      </header>

      <main
        style={{
          maxWidth: 900,
          margin: "42px auto",
          background: "rgba(30,38,46,0.82)",
          borderRadius: 30,
          boxShadow: "0 4px 64px 0 #26ffa770",
          padding: "36px",
          zIndex: 3,
          position: "relative",
          color: "#fff",
          fontSize: "1.09em",
          lineHeight: 2,
          letterSpacing: "0.04em",
          textAlign: "left",
        }}
      >
        <article>
          <h2 style={{ color: "#26ffa7", textAlign: "center" }}>《豐盛》</h2>
          {`    

    你現在能允許多少快感，你便能接受到多少豐盛。這是能量頻率層級上最赤裸的真相。


    在你身體的最深處，潛藏著一條被忽略的力量動脈，一條連接生命慾望與物質豐盛的隱密河道。那股力量，正是我們從小被教導要隱藏、忽視、甚至壓抑的本能之源：性能量。

它不是羞恥，也不是誘惑，而是一股沉睡於身體深處、驅動你創造、決策、行動甚至生存的原始力量。這力量，就藏在下腹與骨盆之間，那片總被我們忽略、壓抑、甚至感到羞愧的地帶。

它是一具與生俱來的生命引擎，一旦遭到壓抑，金錢的能量也會隨之封鎖；而當你允許它甦醒、流動、擴張，財富就會像春水一樣，自然湧來。

真正的豐盛，不是邏輯的演算，不是自律的比賽，也不是勤奮的代價。它來自你是否願意放下控制，允許原始能量穿越體內，讓身體自然回歸它本來擁有的豐盛節奏。

今天，我們將揭開這個長久被壓抑的秘密：性能量，就是金錢能量的源頭。理解它，只是開始；真正的轉變，從允許它流動的那一刻開始。

當你以神聖的意識擁抱自己的肉身，這具肉身便會引領你走向豐盛的大門。

美國作家戴維·迪达（David Deida），是一位長期研究靈性修持與親密關係動力的學者，特別關注性能量在人類生命歷程與覺醒過程中的作用。他致力於揭示身體、愛與意識三者之間的深層連結，並指出性能量如何影響個體的生命方向、親密連結與內在成長。

他以1997年出版的《優質男性之道》一書，震撼探討了性、愛與靈性成長之間的本質關聯。此書多年來深刻影響了許多內在探索者，為我們理解性能量與金錢的深層關係奠定了根基。

迪達指出：金錢的流動並不只是你行動的結果，而是你身體深處是否敞開，是否願意迎接快感與生命力進入你的存在。

換句話說，金錢的真正源頭不在於你做了什麼，而在於你「是誰」，你是否是一個能讓能量流經的載體。

金錢是一種能量，會主動尋找最能承載它的身心狀態。如果你的存在處於緊縮、封閉、防衛的模式，金錢就會像潮水避開峭壁一樣，選擇繞道而行。但如果你能在親密、愛與感官中放鬆、敞開，願意承接更大份量的快感與生命能量，那你也將同時成為豐盛願意流入的容器。

豐盛，不是一場與時間與意志的比拼，它是一場「誰能承受更大能量敞開」的覺醒測驗。能夠讓更多能量自由穿越你身體的人，自然也能讓更多金錢駐足其間。

當代社會對性的話題，始終抱持著壓抑與回避的態度。從教育到家庭，從社會習俗到宗教道德，性能量長期被標籤為危險、骯髒或羞恥的象徵。這樣的文化氛圍，讓無數人成長過程中習慣將對快感與身體的覺知封鎖起來。

於是，性能量無法自然流動，形成堵塞，不僅影響親密關係，也在不知不覺中封閉了金錢的通道。

正如戴維·迪達在《優質男性之道》中所揭示的，如果性能量被壓抑，身體會逐漸進入一種持續緊縮的狀態。你的骨盆變得僵硬、腹部收緊，呼吸不再自然流暢，這些不是單純的生理現象，而是神經系統對長期防衛的真實反應。

你會發現自己不自覺地屏住氣息，肩膀總是緊繃，內在情緒充滿警覺與防衛。這樣的身體狀態，會向宇宙發出一種持續的訊號：「我在危險中，我需要保護，我無法承接更多。」

而這正是金錢最不願靠近的場域。金錢如水，渴望流動與滋養，而非進入一片龜裂緊繃的沙地。

更深層的真相是，我們的身體不是金錢的障礙，而是金錢能否進入的通道本身。如果這條通道關閉，世界的給予也會自動被阻斷。

真正的轉機來自能量的質變。你需要的不是再撐一口氣，不是逼自己更堅強，而是溫柔地鬆開控制，讓身體回到可以流動、可以承接的狀態。

這種鬆開不是放棄，而是一種比努力更具力量的「允許」。當你允許那條早已沉睡的生命能量之河重新甦醒時，真正的豐盛才會循著你的頻率而來。

豐盛，本就是生命最自然的脈動。當你學會允許快感，就是在學會允許生命的所有禮物奔向你。

那一刻，快感不只是身體的顫動，而是你對整個生命說出的「我願意」。願意接住你從前無法接住的一切，願意承認你配得、你渴望、你敞開。

不再用努力來證明價值，而是用存在去接收天賦。從此，生命不再是掙扎，而是流動；金錢不再是追逐，而是共舞。

你不再是焦慮之中計算成本與回報的人，而是一位在愛與信任中綻放的創造者，一個終於準備好承接一切豐盛的靈魂。

不再懼怕、不再壓抑、不再懷疑自己是否值得，而是坦然站在愛的中央，溫柔地打開雙手，允許這個世界用它所有的美好回應你。

當你允許愛與自由的快感如潮水般流經你的全身，金錢也會悄然應聲而至，因為它本就在等待你這份深層的敞開與接納。
`}
        </article>
      </main>

      <footer style={{ color: "#ceffe9", textAlign: "center", opacity: 0.75 }}>
        © 2025 Muse × Beam
      </footer>
    </div>
  );
}
