const staticText = {
  en: {
    startTitle: "Discover Your Spirit Animal",
    subtitle: "Where curiosity meets creation — join us at what a WHY Sanctuary",
    nameLabel: "What’s your name, wanderer?",
    startButton: "Begin Your Journey",
    note: "This quiz take around 10-15 minutes to finish, please take your time.",
    quote: "“Not all those who wander are lost.” — Tolkien",
    continue: "Continue",
    back: "Back",
    instruction: "Click to reveal a clue. Click again to continue.",
    qrCaption: "Scan to visit us — where curiosity meets creation.",
    downloadCard: "Download My Spirit Card",
    retake: "Retake Quiz",
    resultPrefix: "Your spirit animal is..."
  },
  th: {
    startTitle: "ค้นหาสัตว์วิญญาณของคุณ",
    subtitle: "สถานที่ที่ความอยากรู้อยากเห็นพบกับการสร้างสรรค์ — มาร่วมกับเราที่ what a WHY Sanctuary",
    nameLabel: "ชื่อของคุณคืออะไร นักเดินทาง?",
    startButton: "เริ่มต้นการเดินทางของคุณ",
    note: "แบบทดสอบนี้ใช้เวลาประมาณ 10-15 นาที โปรดอย่ารีบทำ",
    quote: "“ไม่ใช่ทุกคนที่หลงทางจะสูญหาย” — โทลคีน",
    continue: "ถัดไป",
    instruction: "คลิกตัวเลือกเพื่อดูคำอธิบาย คลิกอีกครั้งเพื่อไปต่อ",
    back: "ก่อนหน้า",
    qrCaption: "สแกนเพื่อเยี่ยมชม — ที่ซึ่งความอยากรู้พบกับการสร้างสรรค์",
    downloadCard: "ดาวน์โหลดการ์ดสัตว์วิญญาณ",
    retake: "ทำแบบทดสอบอีกครั้ง",
    resultPrefix: "สัตว์วิญญาณของคุณคือ..."
  }
};

const urlParams = new URLSearchParams(window.location.search);
const isTestMode = urlParams.get("test") === "true";
const mockName = urlParams.get("name") || "Test User";
const mockMBTI = urlParams.get("mbti") || "ENFP";
const mockAnimal = urlParams.get("animal") || "otter";
const mockKey = mockAnimal.toLowerCase(); // matches prophecy + image

function setLanguage(lang) {
  currentLanguage = lang;

  // Update all <span data-i18n="key"> elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = staticText[lang]?.[key];
    if (value) el.textContent = value;
  });

  // Fallbacks for elements that don’t use data-i18n
  const resultButtons = document.querySelectorAll("#result-screen button");
  if (resultButtons.length > 1) {
    resultButtons[0].innerText = staticText[lang]?.downloadCard || "Download";
    resultButtons[1].innerText = staticText[lang]?.retake || "Retake";
  }

// Live update for instruction on quiz screen
  const liveInstruction = document.getElementById("dynamic-instruction");
  if (liveInstruction && staticText[lang]?.instruction) {
    liveInstruction.innerText = staticText[lang].instruction;
  }


  // Refresh UI based on current state
  if (document.getElementById("quiz-screen")?.style.display !== "none") {
    showQuestion();
  } else if (document.getElementById("result-screen")?.style.display !== "none") {
    showResult();
  }
}

window.onload = function () {
  const savedLang = localStorage.getItem("lang") || "en";
  setLanguage(savedLang); // Ensure language is set before rendering
  
 // === Developer Test Mode Shortcut ===
  if (isTestMode) {
    fetch("prophecy.json")
      .then(res => res.json())
      .then(data => {
        const result = data[mockKey] || {
          title: mockAnimal,
          mbti: mockMBTI,
          prophecy: `You embody the spirit of the ${mockAnimal}.`,
          fact: "Quiet power lies within you."
        };

   // Properly hide/show elements
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("quiz-screen").style.display = "none";
        document.getElementById("main-heading").style.display = "none";
        const resultScreen = document.getElementById("result-screen");
        resultScreen.style.display = "block";
        setTimeout(() => resultScreen.classList.add("show"), 10);

        document.body.classList.add(`animal-${mockKey}`);

        document.getElementById("final-result-name").innerText = `${mockName}, your spirit animal is...`;
        document.getElementById("final-animal-title").innerText = result.title;
        document.getElementById("final-mbti-type").innerText = result.mbti;
        document.getElementById("final-prophecy").innerText = result.prophecy;
        document.getElementById("final-fact").innerText = result.fact;

        // Spirit Card
        document.getElementById("card-animal-title").innerText = result.title.toUpperCase();
        document.getElementById("card-player-name").innerText = mockName;
        document.getElementById("card-mbti-type").innerText = `MBTI: ${result.mbti}`;
        document.getElementById("card-prophecy").innerText = result.prophecy;
        document.getElementById("card-fact").innerText = result.fact;
        document.getElementById("card-animal-image").src = `images/${mockKey}.png`;
        document.getElementById("spirit-card-preview").style.display = "block";

        // Story Card
        document.getElementById("story-animal-title").innerText = result.title.toUpperCase();
        document.getElementById("story-player-name").innerText = mockName;
        document.getElementById("story-mbti-type").innerText = `MBTI: ${result.mbti}`;
        document.getElementById("story-prophecy").innerText = result.prophecy;
        document.getElementById("story-fact").innerText = result.fact;
        document.getElementById("story-animal-image").src = `images/${mockKey}.png`;
        document.getElementById("story-card-preview").style.display = "block";

        // Result background
        setPageBackground({ imageName: "bg-31.jpg", textColor: "#fff" });
      });
    return;
}

  setPageBackground({ imageName: "bg-1.jpg", textColor: "#111" });

  const startBtn = document.getElementById("start-btn");

  if (startBtn) {
    startBtn.addEventListener("click", startQuiz);
  }

  const music = document.getElementById("bg-music");
  const toggleButtons = document.querySelectorAll(".toggle-music");

  // Set correct icon on all mute buttons
  toggleButtons.forEach(btn => {
    btn.textContent = music?.muted ? "🔇" : "🔊";
  });

  // Allow music to play when unmuted on first interaction
  document.body.addEventListener("click", () => {
    if (music && !music.muted) {
      music.play().catch(() => {});
    }
  }, { once: true });
};

let currentQuestion = 0;
let playerName = "";
const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let lastSelectedIndex = null;
const questions = [];

questions.push(
  // Intro Scene
  {
    text: {
      en: `You awaken in a world bathed in golden light, shimmering around you.

The ground beneath you feels soft and warm, like moss kissed by morning dew.

Overhead, a sky of endless blue stretches beyond sight, the world stirs, rivers hum, 
forests murmur, mountains beckon, while a gentle breeze carries its endless song.`,
      th: `เธอตื่นขึ้นมาในโลกที่อาบไปด้วยแสงสีทองระยิบระยับพร่างพราวไปทั่วรอบกาย 

ผืนพสุธาภายใต้นำพาความรู้สึกที่อ่อนโยนและอบอุ่น ราวกับกำลังย่ำอยู่บนมอสที่ถูกพร่างพรมด้วยหยาดน้ำค้างแห่งอรุณรุ่ง 

เมื่อเงยหน้าขึ้นมองเหนือศีรษะจะพบกับท้องนภาสีฟ้าใสที่ดูกว้างใหญ่ไร้ขอบเขต โลกที่กำลังเคลื่อนไหว สายน้ำที่กำลังบรรเลงเพลงแผ่วเบา พร้อมเสียงกระซิบถ้อยคำจากพงไพร ภูเขาลูกใหญ่ทอดคำเชื้อเชิญ และเพลิดเพลินด้วยสายลมที่ขับกล่อมบทเพลงที่ไม่มีวันจบสิ้น`
    },
    isTransition: true,
    transitionId: "transition-1",
    bg: "bg-1.jpg"
  },

  // Transition: Awakening
  {
    text: {
      en: `You remember nothing of how you arrived.

No name. No form. Only a sense of possibility and a faint stirring deep within you

You know you must begin a journey.

Before you rise, you feel something calling from within, a strength waiting to be chosen.

You must choose the spirit that will guide your first steps.`,
      th: `เธอไม่อาจจดจำได้เลยว่ามาอยู่ในที่แห่งนี้ได้อย่างไร 

ไร้ซึ่งนาม ไร้ซึ่งลักษณะ มีเพียงความรู้สึกจางๆของความเป็นไปได้ที่มากมาย และความปั่นป่วนที่ก่อตัวอยู่ภายใน

เธอรู้เพียงว่า ถึงเวลาแล้วที่ต้องเริ่มการเดินทางครั้งใหม่

แต่ก่อนที่เธอจะเริ่มออกเดินทาง เธอรู้สึกถึงบางอย่างที่ก่อตัวขึ้นและกำลังร่ำร้องและรอคอยให้ถูกเลือก 

เธอจะต้องเลือกมัน เพราะมันจะเป็นผู้เปิดทางสู่เส้นทางแรกของการเดินทางของเธอ`
    },
    isTransition: true,
    transitionId: "transition-2",
    bg: "bg-2.jpg"
  },

  // Q1
  {
    text: {
      en: "What instinct would you choose to guide your first steps into the unknown?",
      th: "เธอคิดว่าสัญชาตญาณใดที่เธอจะเลือกเพื่อนำทางเธอ ในก้าวแรกของการเดินทางไปยังดินแดนที่เธอไม่รู้จัก"
    },
    options: {
      en: ["Keen perception", "Unbreakable endurance", "Fluid intuition", "Bold courage"],
      th: ["การรับรู้ที่เฉียบแหลม", "ความอดทนอันแข็งแกร่ง", "สัญชาติญานอันลื่นไหล", "ความกล้าหาญเป็นเลิศ"]
    },
    explanations: {
      en: [
        "to see hidden paths and silent dangers before others.",
        "to weather storms and survive any hardship.",
        "to sense opportunities and shift when needed.",
        "to leap forward, trusting your strength to see you through."
      ],
      th: ["เพื่อมองหาหนทางที่ถูกซ่อนไว้และอันตรายทั้งปวง", 
                      "เพื่อฝันฝ่าพายุและอุปสรรคทั้งปวง", 
                      "เพื่อใขว่คว้าโอกาสในยามที่มาถึง", 
           "เพื่อก้าวไปข้างหน้า เชื่อมั่นในความแข็งแกร่งของตน"]
    },
    mbti: [["S", "I"], ["S", "J"], ["N", "P"], ["N", "E"]],
    questionId: "question-1",
    bg: "bg-3.jpg"
  },

  // Transition: Pick a route
  {
    text: {
      en: `With your guiding instinct chosen, you take your first steps.

The world around you stretches vast and wild, but somehow welcoming.

Ahead, four paths present themselves, each calling softly to something deep within you.`,
      th: `เมื่อเลือกแล้ว เธอก็ก้าวเท้าแรกออกไป โลกเบื้องที่ปรากฎดูกว้างใหญ่และไร้ขอบเขต 

แต่ถึงอย่างไร ภาพเบื้องหน้ากลับให้ความรู้สึกถึงการต้อนรับที่ดูอบอุ่นอย่างน่าประหลาด ข้างหน้าเธอ มีเส้นทางที่สายทอดยาวออกไป 

แต่ละเส้นทางดูเหมือนกำลังเอ่ยเรียกเธออย่างลึกซึ้งและอ่อนโยน`
    },
    isTransition: true,
    transitionId: "transition-3",
    bg: "bg-4.jpg"
  },

  // Q2
  {
    text: {
      en: "Where does your spirit pull you?",
      th: "เส้นทางใดที่จิตวิญญาณของเธอกำลังเรียกร้องให้เธอไปค้นพบ"
    },
    options: {
      en: ["Quiet glade", "Rocky ridge", "Shimmering river", "Misty trail"],
      th: ["ป่าโปร่งอันแสนเงียบสงบ", "สันเขาหินชันขรุขระ", "ลำน้ำที่สะท้อนแสงแวววาวระยิบระยับ", "เส้นทางที่ปกคลุมไปด้วยหมอก"]
    },
    explanations: {
      en: [
        "Filled with dappled sunlight and whispering leaves through an ancient tree.",
        "High and windswept, with endless views.",
        "Whispering tales of distant lands as it flows.",
        "Disappearing into a mysterious forest, alive with secrets."
      ],
      th: ["ป่าไม้ที่อาบไปด้วยแสงแดดสลัวสาดส่องลอดเข้ามา ผสมผสานไปกับเสียงกระซิบแผ่วเบาจากเหล่าใบไม้ ผ่านต้นไม้แห่งกาลเวลา", 
                      "ภูเขาที่ดูสูงเสียดฟ้า รอบล้อมด้วยสายลมที่แกร่งกล้า เปิดเผยให้เห็นทัศนียภาพที่ทอดยาวจนสุดลูกหูลูกตา", 
                      "เสียงสายธารไหลราวกับกำลังขับขานเรื่องราวจากดินแดนที่อยู่ไกลออกไป", 
                      "ป่าลึกลับคลับคล้ายว่ามีชีวิตและเต็มไปด้วยความลับซ่อนเร้นราวกับมีแรงดึงดูดเชิญชวนให้เลือนหายเข้าไป"]
    },
    mbti: ["S", "N", "S", "N"],
    questionId: "question-2",
    bg: "bg-4.jpg"
  },

  // Transition: Unexpected companion
  {
    text: {
      en: `As you move closer to your chosen place, you notice a few objects lying half-buried in the soft earth. 

Relics of travelers who passed this way long before you.

Their shapes gleam faintly under the sun.`,
      th: `เมื่อเธอเริ่มเดินทางเข้าใกล้จุดหมายที่เธอเลือกไว้ สายตาเธอสะดุดเข้ากับวัตถุกลุ่มหนึ่งที่บางส่วนถูกฝังอยู่ในผืนดินนุ่มละมุน 

และเมื่อพินิจพิจารณาดูแล้ว คาดว่าคงจะเป็นสิ่งหลงเหลือจากนักเดินทางผู้ล่วงผ่านมาก่อน 

รูปทรงของมันเปล่งแสงเรืองรองภายใต้แสงตะวัน`
    },
    isTransition: true,
    transitionId: "transition-4",
    bg: "bg-5.jpg"
  },

  // Q3
  {
    text: {
      en: "One object draws you most. Which do you claim as your companion for the journey?",
      th: "มีวัตถุชิ้นหนึ่งดึงดูดเธอเข้าหา เธอจะเลือกสิ่งใดเป็นคู่หูสำหรับการเดินทางครั้งนี้"
    },
    options: {
      en: ["Shield of bark", "Versatile woven scarf", "Sturdy coil of rope", "Luminous compass"],
      th: ["โล่จากเปลือกไม้", "ผ้าผันคอถัก", "ม้วนเชือกที่แข็งแรง", "เข็มทิศที่เรืองรอง"]
    },
    explanations: {
      en: [
        "weathered by time — a symbol of protection and quiet strength.",
        "light yet durable — a shield against cold, sun, and storm.",
        "worn but reliable — a tool ready for any challenge.",
        "pulsing faintly with light — ever pointing toward unseen horizons."
      ],
      th: ["ฝันฝ่ากาลเวลา – สัญลักษณ์แห่งความแข็งแกร่งและการปกป้อง", 
                      "เบาแต่แกร่งกล้า – เพื่อปกป้องเธอจากความหนาว แดด และ ลมพายุ", 
                      "แม้เก่าแต่เชื่อถือได้ – พร้อมรับเมื่อกับความท้าทายทุกรูปแบบ", 
                      "กะพริบเรืองรองไปด้วยแสง – ชี้ทางไปยังขอบฟ้าอันลี้ลับ"]
    },
    mbti: ["J", "P", "T", "N"],
    questionId: "question-3",
    bg: "bg-6.jpg"
  },

  // Transition: into the world
  {
    text: {
      en: `The moment your fingers brush the object, a subtle warmth spreads through you.
Your journey has truly begun.

You move forward, leaving behind the safe beginnings, stepping into the unknown, trusting your instinct, your environment, and your chosen companion.`,
      th: `วัตถุในมือเธอแผ่ความอบอุ่นยามเมื่อนิ้วสัมผัส การเดินทางของเธอได้เริ่มต้นขึ้นแล้ว 

เธอก้าวไปข้างหน้า จากจุดเริ่มต้นอันปลอดภัยไปยังแดนลี้ลับ เชื่อมั่นในสัญชาตญาณและการตัดสินใจของตนเอง`
    },
    isTransition: true,
    transitionId: "transition-5",
    bg: "bg-7.jpg"
  },

  // Transition: Journey Begins
  {
    text: {
      en: `Your chosen object rests in your grasp, comforting and sure.

The world, though beautiful, now shows signs of wildness.

Thickening mists, chill winds, distant rumbles you can’t quite place.

Ahead, your path forks and twists, and you realize — this land is not simply to be admired.

It must be understood.

It must be navigated.

And so, your journey truly begins.`,
      th: `เธอถือวัตถุที่เลือกไว้ในมือที่ตอนนี้กำลังมอบความรู้สึกอุ่นใจและปลอดภัยให้แก่เธอ

ถึงแม้ว่าโลกจะมีรูปโฉมงดงามเพียงใด มันกลับเริ่มเผยสัญญาณของความปั่นป่วนและความดุร้ายออกมา
 
หมอกเริ่มหนาขึ้น ลมเย็นพัดโชย เสียงคำรามที่ไม่สามารถระบุที่มาได้
 
เส้นทางเบื้องหน้าแยกออกจากกันและบิดเบี้ยว มันทำให้เธอในตอนนี้ตระหนักได้ว่า ดินแดนแห่งนี้ไม่ได้มีไว้เพียงชื่นชม
 
แต่มันต้องได้รับการเข้าใจ
จำเป็นต้องฝ่าฟันไปให้ได้

และแล้ว การเดินทางของเธอก็เริ่มต้นขึ้นอย่างแท้จริง`
    },
    isTransition: true,
    transitionId: "transition-6",
    bg: "bg-8.jpg"
  },

 // Q4
  {
    text: {
      en: "Hunger stirs within you, and the sky darkens toward dusk. How do you seek nourishment and shelter?",
      th: "ความหิวโหยก่อตัวขึ้น ขอบฟ้าสีเข้มเมื่ออาทิตย์อัสดง เธอจะทำอย่างไรเพื่อหาอาหารและที่หลบภัย"
    },
    options: {
      en: ["Methodically scout the surroundings", "Follow your instincts", "Build a rough shelter", "Keep moving boldly"],
      th: ["สำรวจรอบตัวอย่างเป็นระบบ", "เชื่อมั่นในสัญชาตญาณ", "สร้างที่พักชั่วคราว", "ก้าวต่อไปอย่างมั่นใจ"]
    },
    explanations: {
      en: [
        "Prioritizing known patterns — berries, dens, sheltered spots.",
        "Trusting subtle signs — shifting winds, bird cries, scents on the breeze.",
        "Safety over food, you can hunt or forage later.",
        "Find a better place entirely rather than settle here."
      ],
      th: ["เชื่อมั่นในความรู้ของตน หาพุ่มผลไม้ โพรง ที่หลบภัย", 
                      "รู้สึกถึงร่องรอยต่างๆ ลมที่พัดไหว เสียงนกร้อง กลิ่นในสายลม", 
                      "ความปลอดภัยมาก่อนเสมอ เธอสามารถออกล่าและหาของป่าในภายหลัง", 
                      "มุ่งหน้าต่อไปหาที่ที่ดีกว่าแทนที่จะปักหลักที่นี่"]
    },
    mbti: [["S", "J"], ["N", "P"], ["J", "T"], ["E", "P"]],
    questionId: "question-4",
    bg: "bg-9.jpg"
  },

  // Transition: Night descent
  {
    text: {
      en: `Night descends swiftly, and with it comes the unexpected.

Not all dangers are hidden in shadows.

Some roar loud enough to shake the trees.`,
      th: ` รัตติกาลย่างกรายฉับพลัน พาสิ่งอันไม่คาดฝันเคลื่อนมา

ไม่ใช่ทุกภัยจะเป็นเพียงเงาลวงตา บางสิ่งแผดเสียงกล้าจนพฤกษาสั่นสะเทือน`
    },
    isTransition: true,
    transitionId: "transition-7",
    bg: "bg-10.jpg"
  },

  // Q5
  {
    text: {
      en: "A sudden storm roars across the land, winds lashing, branches cracking. How do you react?",
      th: "พายุโหมกระหน่ำทั่วดินแดน ลมตีเกรี้ยวกราด กิ่งไม้เลื่อนลั่น เธอจะทำอย่างไร"
    },
    options: {
      en: ["Seek immediate shelter", "Improvise with your object", "Push forward", "Try to climb higher"],
      th: ["หาที่หลบภัยโดยเร็ว", "ประยุกต์ใช้สิ่งของในมือ", "รีบมุ่งไปข้างหน้า", "ปืนหายอดสูง"]
    },
    explanations: {
      en: [
        "even a hollow log or thick bush will do.",
        "create a makeshift shield using your scarf, rope, or bark.",
        "storms pass fast; endurance is key.",
        "find better vantage to assess the storm’s path."
      ],
      th: ["พุ่มไม้หนาหรือแม้แต่งท่อนไม้กลวงก็เพียงพอ", 
                      "สร้างที่พักชั่วคราวจากอุปกรณ์ของเธอ", 
                      "พายุผ่านมาและไป จงเชื่อในความแข็งแกร่งของตน", 
                      "หาจุดสังเกตที่ดีเพื่อประเมินสถานการณ์"]
    },
    mbti: [["I", "J"], ["T", "P"], ["S", "J"], ["E", "N"]],
    questionId: "question-5",
    bg: "bg-11.jpg"
  },

  // Transition: Forge a path
  {
    text: {
      en: `When the storm subsides, the world feels freshly scrubbed but also more confusing.

Trails have washed away.

Landmarks are half-hidden under mist and fallen debris.

It’s time to decide how to continue.`,
      th: `เมื่อพายุสงบลง โลกพลันรู้สึกเหมือนใหม่แต่ก็สับสน ร่องรอยต่างๆเลือนหาย

จุดสังเกตถูกฝังใต้หมอกมัวและซากปรักหักพัง เธอต้องตัดสินใจแล้วว่าจะทำอย่างไร`
    },
    isTransition: true,
    transitionId: "transition-8",
    bg: "bg-12.jpg"
  },

  // Q6
  {
    text: {
      en: "With your original path erased, how do you choose your new direction?",
      th: "เมื่อหนทางแรกเริ่มของเธอเลือนหาย เธอจะเลือกเส้นทางใหม่อย่างไร"
    },
    options: {
      en: ["Use logic", "Trust intuition", "Follow signs left by others", "Create a new path"],
      th: ["ใช้หลักการและตรรกะ", "เชื่อมั่นในสัญชาตญาณ", "ไปตามร่องรอยของนักเดินทางคนอื่น", "สร้างทางใหม่ของเธอ"]
    },
    explanations: {
      en: [
        "retrace steps, find familiar markers, rebuild the trail carefully.",
        "feelings, gut sense of where to go, glimpses of hidden pathways.",
        "claw marks, footprints, broken branches.",
        "the old way is lost, new opportunities await."
      ],
      th: ["ย้อนรอยเส้นทาง มองหาจุดสังเกต สร้างหนทางอย่างระวัง", 
                     "ความรู้สึก สัญชาตญาณในการมุ่งไปข้างหน้า เงาเลือนลางของเส้นทางที่ซ่อนอยู่", 
                     "รอยเล็บ รอยเท้า กิ่งไม้หัก", 
           "หนทางเก่าสูญหายไป โอกาสใหม่กำลังรออยู่"]
    },
    mbti: [["T", "S"], ["N", "F"], ["S", "J"], ["N", "P"]],
    questionId: "question-6",
    bg: "bg-12.jpg"
  },

  // Transition: To boldly go
  {
    text: {
      en: `You press forward, your chosen instincts guiding you more than memory now.

Around you, the world murmurs strange sounds, fleeting lights, glimpses of other wanderers.

Ahead, challenges are no longer merely about survival.

They’re about choosing who you will become on this journey.`,
      th: `เธอเดินหน้าต่อไป โดยปล่อยให้สัญชาตญาณที่เธอเลือกเป็นผู้นำพา มากกว่าความทรงจำที่ครอบงำใจในตอนนี้

โลกรอบตัวพึมพำเสียงแปลกประหลาด แสงระยิบระยับวาบผ่านสะท้อนภาพเลือนลางของนักเดินทางคนอื่นๆ

สิ่งที่รออยู่เบื้องหน้า มิได้เป็นเพียงแค่การเอาชีวิตรอดอีกต่อไป แต่มันคือการเลือกเส้นทาง เลือกว่าจะกลายเป็นใครในการเดินทางครั้งนี้`
    },
    isTransition: true,
    transitionId: "transition-9",
    bg: "bg-13.jpg"
  },

  // Transition: In the mist
  {
    text: {
      en: `Days or was it only hours?

Past a blur of mist and golden light, you learn quickly that the world is not what it first seemed.

Strange shapes shimmer at the edges of vision.

Stones hum beneath your paws.

Shadows drift where no trees grow.

But none of it feels threatening, only inviting.

As if the world itself watches and wonders what you will become.`,
      th: `เป็นวันหรือเป็นเพียงไม่กี่ชั่วโมงกันแน่

ท่ามกลางม่านหมอกและแสงทองที่พร่าเลือน
 
เธอเรียนรู้ได้อย่างรวดเร็วว่าโลกไม่ใช่อย่างที่เห็นในตอนแรก

รูปร่างแปลกประหลาดแวววับอยู่ที่ขอบสายตา

ก้อนหินส่งเสียงฮัมใต้ฝ่าเท้าของเธอ เงามืดลอยผ่านบริเวณไร้ต้นไม้ใดใด 

แต่ทุกสิ่งไร้ซึ่งการคุกคาม มีเพียงความเชื้อเชิญอบอุ่นที่แผ่ซ่าน

ราวกับโลกทั้งใบกำลังจ้องมองและเฝ้ารอดูว่า เธอจะกลายเป็นสิ่งใดในที่สุด`
    },
    isTransition: true,
    transitionId: "transition-10",
    bg: "bg-14.jpg"
  },

  // Q7
  {
    text: {
      en: `You come upon a crossroad, four paths branch before you, each calling in a different way.
Which path do you choose?`,
      th: `เธอเดินมาถึงทางแยก เบื้องหน้าเธอปรากฎเส้นทางสี่สายแยกออกจากกัน แต่ละเส้นทางล้วนส่งเสียงเรียกร้องเธอในรูปแบบที่แตกต่างกัน

เธอจะเลือกหนทางใด`
    },
    options: {
      en: ["Sunlit meadow", "Riverbank trail", "Narrow cliff ledge", "Shaded tunnel"],
      th: ["ทุ่งหญ้าที่อาบด้วยแสงแห่งตะวัน", "ทางเดินเลียบริมธาร", "ขอบผาแคบชัน", "อุโมงค์ในเงาสลัว"]
    },
    explanations: {
      en: [
        "open and familiar.",
        "winding, full of soft sounds and reflections.",
        "risky, but a faster way ahead.",
        "through ancient roots, mysterious, unseen."
      ],
      th: ["เส้นทางโล่งโปร่งและให้ความรู้สึกคุ้นเคย", 
                      "คดเคี้ยว และคลอไปด้วยเสียงแผ่วเบาและภาพเงาสะท้อน", 
                      "อาจจะดูเสี่ยงอันตรายแต่เป็นทางลัดที่จะพาไปข้างหน้าอย่างรวดเร็ว", 
                      "เส้นทางลอดผ่านรากไม้เก่าแก่ ลึกลับ และยากจะมองเห็น"]
    },
    mbti: [["S", "J"], ["F", "N"], ["T", "J"], ["N", "P"]],
    questionId: "question-7",
    bg: "bg-15.jpg"
  },

  // Transition: Obstacle
  {
    text: {
      en: `Whichever path you choose, you soon find an obstacle blocking your way.

A broken bridge stretches across a deep ravine.

Mist coils at the bottom, glowing faintly blue.`,
      th: `ไม่ว่าเธอจะเลือกทางใด เธอพลันพบอุปสรรคหนึ่งขวางกั้น

สะพานที่ผุพังทอดข้ามหุบเหวลึก หมอกม้วนตัวส่องประกายสีฟ้า ณ เบื้องล่าง`
    },
    isTransition: true,
    transitionId: "transition-11",
    bg: "bg-16.jpg"
  },

  // Q8
  {
    text: {
      en: "The bridge is old, unstable, and parts of it have crumbled away. How do you proceed?",
      th: "สะพานนั้นเก่าและไม่มั่นคง บางส่วนผุพังไปแล้ว​ เธอจะก้าวต่อไปอย่างไร"
    },
    options: {
      en: ["Test step by step", "Seek alternate route", "Reinforce with your tool", "Leap across boldly"],
      th: ["ทดสอบก้าวทีละก้าว", "มองหาทางข้ามอื่น", "หาทางเสริมความแข็งแรงของสะพาน", "ก้าวข้ามอย่างหาญกล้า"]
    },
    explanations: {
      en: [
        "Trusting caution and observation",
        "Safer but longer route",
        "Use your creativity",
        "Trusting speed and daring"
      ],
      th: ["ใช้ความระมัดระวังและการสังเกตอันเป็นเลิศ", 
                      "แม้จะไกลกว่าแต่ปลอดภัย", 
                      "ใช้ความสร้างสรรค์ของเธอ", 
                      "เชื่อมั่นในความไวและความกล้าหาญ"]
    },
    mbti: [["J", "T"], ["J", "S"], ["T", "P"], ["E", "P"]],
    questionId: "question-8",
    bg: "bg-16.jpg"
  },

  // Transition: Mysterious door
  {
    text: {
      en: `Beyond the ravine, twilight falls again.

Then, you spot something impossible glinting between tree roots.

A stone archway, untouched by moss or time.

Within it swirls a mist of shimmering silver and violet, beckoning.`,
      th: `เธอพ้นจากจากหุบเหว ราตรีมาเยือนอีกครั้ง 

เมื่อนั้นเธอพลันสังเกตเห็นบางสิ่งที่น่าอัศจรรย์เปล่งประกายอยู่ในระหว่างรากไม้ 

โค้งหินที่ไม่ถูกกาลเวลาแตะต้อง ภายในสุกสกาวไปด้วยหมอกสีเงินและม่วง`
    },
    isTransition: true,
    transitionId: "transition-12",
    bg: "bg-17.jpg"
  },

// Q9
  {
    text: {
      en: "Before you, a mystical archway appears and hums with power. You know it's a shortcut but to where? What do you do?",
      th: "ซุ้มประตูลึกลับปรากฎตรงหน้าเธอ มันเปล่งพลังงานบางอย่าง เธอรู้ทันใดว่านี่คือทางลัด แต่มันจะนำเธอไปที่ไหนกันล่ะ แล้วเธอจะทำอย่างไรดี"
    },
    options: {
      en: ["Study it carefully", "Step through boldly", "Search for other signs", "Listen to instincts"],
      th: ["ศึกษาอย่างระมัดระวัง", "ก้าวผ่านอย่างกล้าหาญ", "มองหาร่องรอยอื่นๆ", "เชื่อมั่นในสัญชาตญาณ"]
    },
    explanations: {
      en: [
        "gather clues, observe reactions, test before trusting.",
        "a shortcut is worth the risk!",
        "maybe there’s a safer way.",
        "if it feels right, you will step; if not, you will move on."
      ],
      th: ["รวบรวมข้อมูล สังเกตการตอบสนอง ทดสอบจึงจะเชื่อมั่น", 
                      "ทางลัดนั้นคุ้มค่าเสมอ", 
                      "อาจมีหนทางอื่นที่ปลอดภัย", 
                      "ก้าวไปถ้าเธอรู้สึกว่าใช่ ผ่านไปหากเธอไม่มั่นใจกับมัน"]
    },
    mbti: [["S", "J"], ["E", "N"], ["S", "J"], ["N", "F"]],
    questionId: "question-9",
    bg: "bg-17.jpg"
  },

  // Transition: Through the door
  {
    text: {
      en: `Whether you braved the archway or found another way,
you emerge changed.
Faster, sharper, more certain.

And now, the world stirs again.

Not with danger, but with encounters.

You are not alone here.`,
      th: `ไม่ว่าเธอจะหาญกล้าฝ่าไปหรือค้นพบทางอื่น เธอเปลี่ยนมาเป็นคนใหม่ 

ว่องไว เฉียบแหลมและมั่นใจมากขึ้น 

แต่ในทันใด โลกพลันเปลี่ยนหมุนอีกครั้ง 

ไม่ใช่ด้วยภัยอันตรายแต่ด้วยการเผชิญหน้าใหม่ๆ 

เธอไม่ได้อยู่ลำพังอีกแล้ว.`
    },
    isTransition: true,
    transitionId: "transition-13",
    bg: "bg-18.jpg"
  },

  // Transition: Test
  {
    text: {
      en: `As you move deeper into this ever-shifting world, you sense others nearby.

Some are bold, some cautious.

Some wear feathers, some fur.

Some shimmer like the mist itself.

They too are travelers, dreamers, wanderers of forgotten paths.

The choices you make now will shape not just your journey but the kind of connections you forge along the way.`,
      th: `เมื่อเธอก้าวลึกเข้าไปในโลกที่หมุนเวียนเปลี่ยนแปลงไม่สิ้นสุด เธอรับรู้ถึงตัวตนของนักเดินทางคนอื่น

บางคนเปี่ยมด้วยความกล้าหาญ บางคนย่างเท้าอย่างระมัดระวัง

บางคนสวมขนนก บางคนสวมขนสัตว์

บางคนเปล่งประกายราวกับเป็นส่วนหนึ่งของหมอก

พวกเขาล้วนเป็นนักเดินทาง ผู้เปี่ยมด้วยความฝัน ผู้หลงในเส้นทางที่ถูกลืม เช่นเดียวกัน

ทางเลือกที่เธอทำในตอนนี้ ไม่เพียงแต่กำหนดเส้นทางของเธอเท่านั้น แต่ยังหล่อหลอมสายสัมพันธ์ที่เธอจะสร้างขึ้นระหว่างทางอีกด้วย
`
    },
    isTransition: true,
    transitionId: "transition-14",
    bg: "bg-19.jpg"
  },

  // Q10
  {
    text: {
      en: `In a clearing, you come across a creature you’ve never seen before — a silver-furred being with wise eyes, carrying bundles of herbs and strange tools. It watches you silently. How do you respond?`,
      th: `ทามกลางลานโล่ง เธอพบเจอสิ่งมีชีวิตอันน่าฉงนที่ไม่คุ้นตา ขนสีเงินและแววตาอันลุ่มลึกและชาญฉลาด พกพามาด้วยสมุนไพรมากมายและเครื่องมืออันประหลาด มันจ้องมองเธออย่างเงียบๆ เธอจะตอบรับอย่างไร`
    },
    options: {
      en: ["Ask for guidance or wisdom", "Watch quietly from distance", "Offer it something", "Challenge it with riddle"],
      th: ["ถามหาคำแนะนำหรือภูมิปัญญา", "สังเกตอย่างเงียบๆ", "มอบสิ่งของให้", "ท้าทายตัวตนนั้นด้วยคำถาม"]
    },
    explanations: {
      en: [
        "approach it respectfully and carefully.",
        "observe first, act later.",
        "offer food, item, or knowledge to show friendliness.",
        "playful riddle or question, test its intentions boldly"
      ],
      th: ["เข้าหาอย่างเคารพและระมัดระวัง", 
                      "ลองมองดูก่อนแล้วจึงตอบสนอง", 
                      "เสนออาหาร สิ่งของหรือความรู้เพื่อแสดงความเป็นมิตร", 
                      "ทดสอบเจตนารมณ์ของมันด้วยคำถามและและบทกลอนอันน่าฉงน"]
    },
    mbti: [["F", "I"], ["I", "J"], ["F", "E"], ["T", "E"]],
    questionId: "question-10",
    bg: "bg-20.jpg"
  },

  // Transition: Encounter
  {
    text: {
      en: `The silver-furred being smiles — or maybe it’s just the wind playing tricks — and leaves you with a choice.

Follow a trail to a group of travelers, or journey on alone.`,
      th: `สิ่งมีชีวิตสีเงินยิ้มให้เธอ หรืออาจเป็นเพียงสายลมที่เล่นกลกับเธอก็เป็นได้ 

เธอถูกทิ้งไว้กับทางเลือกที่สำคัญ จะตามรอยไปยังคณะนักผจญภัยที่รออยู่หรือจะเดินทางต่อไปเพียงลำพัง`
    },
    isTransition: true,
    transitionId: "transition-15",
    bg: "bg-20.jpg"
  },

  // Transition: Gathering
  {
    text: {
      en: `Before you lies a gathering of different creatures.

Wolves in cloaks, birds with golden eyes, fish that swim through the air like whispers.

They seem open but uncertain.`,
      th: "คณะผจญภัยชุมนุมอยู่ตรงหน้าเธอ พลันมีสิ่งมีชีวิตอันหลากหลาย หมาป่าในชุดคลุม ปักษาที่มีนัยน์ตาสีทอง มัจฉาที่ว่ายวนในอากาศราวกับเสียงกระซิบ ความสนเท่ห์อบอวลไปทั่ว"
    },
    isTransition: true,
    transitionId: "transition-16",
    bg: "bg-21.jpg"
  },

  // Q11
  {
    text: {
      en: "A gathering awaits, what do you do?",
      th: "การชุมนุมรออยู่ เธอจจะทำอย่างไร"
    },
    options: {
      en: ["Join them openly", "Observe then join", "Stay independent", "Talk to a few"],
      th: ["เปิดใจเข้าร่วม", "สังเกตแล้วจึงเข้าร่วม", "อยู่อย่างสันโดษ", "เข้าหาเพียงบางคน"]
    },
    explanations: {
      en: [
        "There’s safety and joy in the community.",
        "Observe for a while, cautiously join if it feels right.",
        "Your path is your own to walk.",
        "Still avoid being drawn fully into the group."
      ],
      th: ["การรวมกลุ่มเต็มไปด้วยความปลอดภัยและความสนุกสนาน", 
                       "เฝ้ามองอย่างเงียบๆ เข้าร่วมอย่างระมัดระวังและปล่อยไปตามความรู้สึก", 
                       "เส้นทางของเธอ มีเพียงเธอเท่านั้นที่จะเดินมันได้", 
                       "อย่าปล่อยให้ตัวตนของเธอถูกหลอมหลวมจนสูญเสียตัวเองไป"]
    },
    mbti: [["E", "F"], ["I", "F"], ["I", "T"], ["E", "T"]],
    questionId: "question-11",
    bg: "bg-21.jpg"
  },

  // Transition: Campfire
  {
    text: {
      en: `Whether you walk beside others or apart, the road leads to one final encounter.

A gathering at twilight — a council of wanderers, sharing news, dreams, and songs of their journeys.

And you are invited to speak.`,
      th: `ไม่ว่าเธอจะเดินเคียงข้างผู้อื่นหรือเดินเพียงลำพัง หนทางนี้ล้วนมุ่งสู่จุดมุ่งหมายเดียวกัน

เมื่อยามอัสดงลับฟ้า เหล่าผู้พเนจรมารวมตัวกัน แบ่งปันข่าวสาร ความฝัน และบทเพลงจากการเดินทางของตน 

และเธอก็ได้รับการเชื้อเชิญให้ร่วมขับขานเรื่องราวของเธอเช่นกัน`
    },
    isTransition: true,
    transitionId: "transition-17",
    bg: "bg-22.jpg"
  },

  // Q12 (Tie-breaker)
  {
    text: {
      en: "Around the flickering campfire, you are invited to speak. What do you share?",
      th: "รอบกองไฟที่ลุกไหววูบวาบ  เธอได้รับเชิญให้บอกเล่าเรื่องราวของเธอ สิ่งใดที่เธอจะเลือกแบ่งปันออกไป"
    },
    options: {
      en: ["A thoughtful story", "A heartfelt feeling", "A lively tale", "A clever theory"],
      th: ["เรื่องราวชวนครุ่นคิด", "ความรู้สึกที่เอ่อล้นออกมาจากใจ", "นิทานที่มีชีวิตชีวา", "ทฤษฎีอันเฉียบแหลม"]
    },
    explanations: {
      en: [
        "carefully consider a story or wisdom you’ve gathered on your journey.",
        "raw and real, from the deepest part of your spirit.",
        "a daring and adventure, full of laughter and color.",
        "an idea, theory, or plan for future journeys."
      ],
      th: ["ขบคิดอย่างลึกซึ้งถึงเรื่องราวหรือความรู้ที่งอกงามขึ้นระหว่างการเดินทาง", 
                       "ถ้อยคำจากส่วนลึกสุดของจิตวิญญาณที่เปล่งออกมาอย่างบริสุทธิ์ ไร้การเสแสร้ง", 
                       "การผจญภัยที่กล้าหาญ เต็มไปด้วยเสียงหัวเราะและสีสัน", 
                       "แนวคิด ทฤษฎี หรือแผนการสำหรับการเดินทางในวันข้างหน้า"]
    },
    mbti: ["T", "F", "E", "N"],
    questionId: "question-12",
    bg: "bg-23.jpg"
  },

  // Transition: Day’s end
  {
    text: {
      en: `As the firelight fades and the wanderers drift into the night,
you realize 

it is not just the journey that has shaped you, but the choices you made when others crossed your path.

Ahead lies your final great decision, the one that will set your path in the stars.`,
      th: `เมื่อแสงไฟเริ่มโรยแรง และเหล่าผู้พเนจรค่อย ๆ ละลายหายไปในม่านราตรี เธอจึงตระหนักได้ว่า 

ไม่ใช่แค่การเดินทางเท่านั้นที่หล่อหลอมเธอ แต่รวมถึงทางเลือกที่เธอเลือกในยามที่เผชิญกับสิ่งต่างๆ 

เบื้องหน้ามีการตัดสินใจที่สำคัญรอคอยอยู่ สิ่งนี้จะทอดสะพานของเธอไปในหมู่ดาว`
    },
    isTransition: true,
    transitionId: "transition-18",
    bg: "bg-24.jpg"
  },

  // Transition: A crossroad
  {
    text: {
      en: `The fires have dimmed.
The wanderers have gone.

Only you remain, standing on the threshold between the world you have known and the world you are destined to create.

Before you rise four great paths woven from mist, starlight, and memory.

Each feels true.

But you can walk only one.`,
      th: `เปลวไฟมอดแสงลงแล้ว ผู้พเนจรทั้งหลายก็ลับหายไป หลงเหลือเพียงเธอ ที่ยืนอยู่บนรอยต่อระหว่างดินแดนที่เธอเคยรู้จักกับดินแดนแห่งใหม่ที่เธอถูกลิขิตให้รังสรรค์ขึ้นเอง 

เบื้องหน้า คือสี่เส้นทางอันยิ่งใหญ่ ถักทอจากม่านหมอก แสงดาว และเศษเสี้ยวความทรงจำ

แต่ละเส้นทางล้วนรู้สึกว่า ใช่  ทว่าเธอสามารถเลือกเดินได้เพียงหนึ่งเดียวเท่านั้น`
    },
    isTransition: true,
    transitionId: "transition-19",
    bg: "bg-25.jpg"
  },

// Q13
  {
    text: {
      en: "You stand at the Crossroads of Becoming. Which path calls your spirit?",
      th: "เธอยืนอยู่ ณ แยกทางแห่งการเปลี่ยนแปลง เส้นทางใดเรียกขานจิตวิญญาณของเธอ"
    },
    options: {
      en: [
        "Path of endurance and loyalty",
        "Path of exploration and discovery",
        "Path of wisdom and structure",
        "Path of passion and wonder"
      ],
      th: ["ทางแห่งความอดทนและความซี่อสัตย์", "ทางแห่งการสำรวจและการค้นพบ", "ทางแห่งปัญญาและตรรกะ", "ทางแห่งความหลงใหลและความมหัศจรรย์"]
    },
    explanations: {
      en: [
        "Where communities thrive and grow together.",
        "Venturing into the unknown with fearless curiosity.",
        "Building foundations that will endure beyond your lifetime.",
        "Where creativity and dreams shape reality."
      ],
      th: ["ที่ซึ่งชุมชนเจริญรุ่งเรืองและเติบโตไปด้วยกัน", 
                       "การผจญภัยสู่สิ่งที่ไม่รู้จักด้วยความอย่างรู้อยากเห็นอย่างกล้าหาญ", 
                       "สร้างรากฐานที่คงอยู่ไปล่วงเลยกว่าชั่วชีวิตของเธอ", 
                       "ที่ซึ่งความคิดสร้างสรรค์และความฝันหล่อหลอมความเป็นจริง"]
    },
    mbti: [["S", "J"], ["N", "P"], ["T", "J"], ["N", "F"]],
    questionId: "question-13",
    bg: "bg-25.jpg"
  },

  // Transition: Final choices
  {
    text: {
      en: `You step forward.
Your heart is certain, your object glinting faintly with remembered light.

The path rises to meet you.

But just before the mists close around you, one final choice appears.

It’s simple, but powerful.`,
      th: `เธอก้าวเดินไปข้างหน้า ด้วยหัวใจอันแน่วแน่ วัตถุในมือเธอส่องแสงประกายเรืองรองอย่างเลือนลานดั่งแสงแห่งความทรงจำ 

หนทางข้างหน้าค่อยๆ เอื้อมรับเธอ แต่ก่อนที่ม่านหมอกจะโอบล้อมเธฮ 

ทางเลือกสุดท้ายก็ปรากฎออกมา มันดูเรียบง่ายแต่เปี่ยมล้นด้วยพลัง`
    },
    isTransition: true,
    transitionId: "transition-20",
    bg: "bg-26.jpg"
  },

  // Q14 (Tie-breaker)
  {
    text: {
      en: "In the final moments before you fully claim your destiny, what do you trust most to guide you forward?",
      th: "ในห้วงเวลาสุดท้ายก่อนที่เธอจะได้ลิขิตชะตาของตนเอง เธอจะเชื่อมั่นในสิ่งใดเพื่อเป็นแสงนำทางในหนทางข้างหน้า"
    },
    options: {
      en: [
        "Unwavering determination",
        "Boundless curiosity",
        "Careful wisdom",
        "Vivid imagination"
      ],
      th: ["ความมุ่งมั่นอย่างไม่สั่นคลอน", "ความใฝ่รู้ที่ไร้ขอบเขต", "ภูมิปัญญาอันรอบคอบ", "จินตนาการอันมีชีวิตชีวา"]
    },
    explanations: {
      en: [
        "Strength comes from commitment.",
        "Life is richest when explored without fear.",
        "The surest way forward is through understanding.",
        "The greatest journeys are those dreamed into existence."
      ],
      th: ["ความแข็งแกร่งที่แท้จริงเกิดจากความมุ่งมั่น", 
                       "ชีวิตจะเปี่ยมคุณค่าเมื่อออกสำรวจโดยไร้ซึ่งความหวาดกลัว", 
                       "หนทางข้างหน้าที่มั่นคงที่สุดล้วนต้องผ่านความเข้าใจ", 
                       "การเดินทางที่ยิ่งใหญ่ที่สุดคือการเดินทางที่ถูกหล่อหลอมขึ้นจากความใฝ่ฝัน"]
    },
    mbti: [["J", "T"], ["P", "I"], ["J", "T"], ["N", "F"]],
    questionId: "question-14",
    bg: "bg-26.jpg"
  },

  // Transition: Your new form
  {
    text: {
      en: `As you choose, the world shifts around you 

not ending, not beginning, but unfolding.

You are no longer simply a traveler.

And somewhere, deep within the mist, a figure "your true form" stirs and smiles.`,
      th: `ขณะที่เธอตัดสินใจ โลกก็เคลื่อนไหวไปรอบๆตัวเธอ

ไม่ใช่จุดสิ้นสุด ไม่ใช่จุดเริ่มต้น หากแต่เป็นห้วงเวลาแห่งการคลี่คลายของทุกสรรพสิ่ง

เธอไม่ใช่นักเดินทางธรรมดาอีกต่อไป
และ ณ ที่ใดสักแห่ง ภายใต้ม่านหมอกอันหนาแน่น เงาร่างหนึ่ง ตัวตนที่แท้จริงของเธอ ค่อย ๆ ขยับ แล้วเผยรอยยิ้มออกมา`
    },
    isTransition: true,
    transitionId: "transition-21",
    bg: "bg-27.jpg"
  },

  // Transition: Final reflection
  {
    text: {
      en: `As you step fully into your new self,
the world — kind and curious — offers you one final gift.

A memento of your journey, something to carry forward, a reminder of who you chose to become.`,
      th: `เมื่อเธอก้าวเข้าสู่ตัวตนใหม่ของเธอ

โลกใบนี้ ที่อ่อนโยนและเปี่ยมด้วยความใคร่รู้ ยื่นมอบของขวัญชิ้นสุดท้ายแก่เธอ

ของขวัญซึ่งเป็นเสมือนเครื่องเตือนใจถึงการเดินทางที่เธอได้ผ่านพ้น
จะเป็นสิ่งที่เธอจะพกพาไว้ เพื่อระลึกถึงตัวตนที่เธอได้เลือกจะเป็น`
    },
    isTransition: true,
    transitionId: "transition-22",
    bg: "bg-28.jpg"
  },

  // Q15 (Final reflection)
  {
    text: {
      en: "What memento do you choose to carry with you?",
      th: "เครื่องเตือนใจใดที่เธอเลือกจะนำติดตัวไป"
    },
    options: {
      en: [
        "Token etched with unknown constellations",
        "Smooth river stone",
        "Feather from a starlight",
        "Braided vine ring"
      ],
      th: ["เครื่องรางจำรึกลายกลุ่มดาวนิรนาม", "ก้อนหินจากแม่น้ำที่เนียนเรียบ", "ขนนกจากแสงแห่งดวงดาว", "แหวนจากเถาวัลย์ถัก"]
    },
    explanations: {
      en: [
        "A reminder to always seek new horizons.",
        "Humming softly, a promise of enduring strength.",
        "A call to never lose your sense of wonder.",
        "A symbol of connections formed and memories kept."
      ],
      th: ["เพื่อเตือนใจให้เธอออกไปยังขอบฟ้าใหม่อยู่เสมอ", 
                       "ส่งเสียงอย่างอบอุ่น ย้ำเตือนถึงความแข็งแกร่งของเธอ", 
                       "เพื่อย้ำเตือนเธอเไม่ให้สิ้นในความใฝ่รู้", 
                       "สัญลักษณ์แห่งสายสัมพันธ์และความทรงจำที่เธอสร้างขึ้น"]
    },
    mbti: [null, null, null, null],
    questionId: "question-15",
    bg: "bg-30.jpg"
  },

  // Transition: New journey awaits
  {
    text: {
      en: `You tuck the memento close to your heart.

The mist parts.

Your path is yours now, woven from instinct, choice, courage, and dreams.

And somewhere far above, among stars unseen, your true self smiles.`,
      th: `เธอเก็บของที่ระลึกไว้ในดวงใจ

ม่านหมอกค่อยๆ เลือนลางและจางหาย

เส้นทางเบื้องหน้าเป็นของเธออย่างแท้จริง เส้นทางนี้ที่ถูกถักทอขึ้นมาจากสัญชาตญาณ ทางเลือก  ความกล้าหาญ และความฝัน 

และ ณ ที่ใดสักแห่ง บนฟากฟ้าอันไกลโพ้น ท่ามกลางดวงดาวที่ยังไม่มีใครพบเจอ ตัวตนที่แท้จริงของเธอกำลังยิ้มอยู่`    },
    isTransition: true,
    transitionId: "transition-23",
    bg: "bg-31.jpg"
  }
);


function startQuiz() {
  const nameInput = document.getElementById("playerName");
  playerName = nameInput?.value?.trim() || "Wanderer";
  document.getElementById("start-screen").style.display = "none";
  document.querySelector(".footer").style.display = "flex";
  document.getElementById("main-heading").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";

  currentQuestion = 0;
  showQuestion();

  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.volume = 0.4;
    // Try playing music after user interaction
    if (!bgMusic.muted) {
      bgMusic.play().catch(e => console.log("Autoplay blocked:", e));
    }
  }
}

function showQuestion() {
  document.body.classList.remove(...Array.from(document.body.classList).filter(cls => cls.startsWith("q-")));
  document.body.classList.add(`q-${currentQuestion + 1}`);

  const q = questions[currentQuestion];
  const questionBox = document.getElementById("question-text");
  const choiceBox = document.getElementById("choices");
  const explanationBox = document.getElementById("explanation-placeholder");
      if (explanationBox) {
    explanationBox.innerText = "";     // clear old text
    explanationBox.classList.remove("show"); // optional: remove show class
    }
  document.getElementById("main-heading").style.display = "none";

  if (q.isTransition) {
    document.getElementById("quiz-screen").classList.add("transition-page");
  } else {
    document.getElementById("quiz-screen").classList.remove("transition-page");
  }

  const rawText = typeof q.text === "object" ? q.text[currentLanguage] || q.text.en : q.text;

  questionBox.innerHTML = q.isTransition
    ? `<div id="question-text" class="transition-text">${rawText.replace(/\n/g, "<br>")}</div>`
    : `<h2 id="question-text" class="question-text glass-text">${rawText.replace(/\n/g, "<br>")}</h2>`;

  choiceBox.innerHTML = "";
  lastSelectedIndex = null;

  setPageBackground({ imageName: q.bg || "bg_default.jpg", textColor: q.textColor || "#f0f0f0" });

  if (q.transitionId) {
    document.body.className = q.transitionId;
  } else if (q.questionId) {
    document.body.className = q.questionId;
  }

  if (q.isTransition) {
    const btn = document.createElement("button");
    btn.innerText = staticText[currentLanguage]?.continue || "Continue";
    btn.classList.add("continue-btn");
    btn.onclick = () => nextQuestion();
    choiceBox.appendChild(btn);
    return;
  }

  const instruction = document.createElement("p");
  instruction.id = "dynamic-instruction";
  instruction.className = "instructions";
  instruction.innerText = staticText[currentLanguage]?.instruction || "Click a choice to reveal a clue.";
  choiceBox.appendChild(instruction);

  const rawOptions = typeof q.options === "object" ? q.options[currentLanguage] || q.options.en : q.options;
  const rawExplanations = typeof q.explanations === "object" ? q.explanations[currentLanguage] || q.explanations.en : q.explanations;

  rawOptions.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.classList.add("quiz-choice");

    btn.onclick = () => {
      const allButtons = document.querySelectorAll(".quiz-choice");
      const existingExplanation = document.querySelector(".explanation");

      if (lastSelectedIndex === index) {
        const mbtiAxis = q.mbti[index];
        if (mbtiAxis) {
          if (Array.isArray(mbtiAxis)) {
            mbtiAxis.forEach(trait => {
              if (scores.hasOwnProperty(trait)) scores[trait]++;
            });
          } else {
            if (scores.hasOwnProperty(mbtiAxis)) scores[mbtiAxis]++;
          }
        }
        nextQuestion();
      } else {
        lastSelectedIndex = index;

        allButtons.forEach((b, i) => {
          b.disabled = false;
          b.classList.remove("selected", "disabled");
        });

        btn.classList.add("selected");

        const explanationBox = document.getElementById("explanation-placeholder");
        explanationBox.innerText = rawExplanations?.[index] || "";
        explanationBox.classList.add("show");
        }
    };
    choiceBox.appendChild(btn);
  });
}

let answerHistory = [];

function nextQuestion() {
  const q = questions[currentQuestion];

  // Save the selected index before moving on
  if (!q.isTransition && lastSelectedIndex !== null) {
    answerHistory[currentQuestion] = lastSelectedIndex;
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;

    const q = questions[currentQuestion];
    const prevIndex = answerHistory[currentQuestion];

    if (!q.isTransition && prevIndex !== null && q.mbti) {
      const traits = q.mbti[prevIndex];
      if (Array.isArray(traits)) {
        traits.forEach(trait => {
          if (scores[trait]) scores[trait]--;
        });
      } else {
        if (scores[traits]) scores[traits]--;
      }
    }

    showQuestion();

    if (!q.isTransition && prevIndex !== null) {
      setTimeout(() => {
  const buttons = document.querySelectorAll(".quiz-choice");
  buttons[prevIndex].classList.add("selected");
  
  const explanationBox = document.getElementById("explanation-placeholder");
  explanationBox.innerText = q.explanations[prevIndex] || "";
  explanationBox.classList.add("show");

  lastSelectedIndex = prevIndex;
    }, 0);

    }
  }
}

function setPageBackground({ imageName = "", textColor = "#222" }) {
  if (imageName) {
    document.body.style.backgroundImage = `url('images/${imageName}')`;
  } else {
    document.body.style.backgroundImage = "";
  }

  document.body.style.backgroundAttachment = "scroll"; // mobile-safe
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center center";

  // Text color (for future theming)
  document.body.style.color = textColor;
}

function getMBTI() {
  const axis = [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]];
  return axis.map(([a, b]) => {
    if (scores[a] > scores[b]) return a;
    if (scores[b] > scores[a]) return b;
    return tieBreaker(a, b); // tie-break logic
  }).join("");
}

function tieBreaker(a, b) {
  const primary = { E: 12, I: 12, T: 14, F: 14, J: 12, P: 12, S: 14, N: 14 };
  const qIndex = primary[a];
  const q = questions[qIndex];

  if (!q || !q.mbti) return randomChoice(a, b);

  const matchedAxis = q.mbti.filter(
    
pair => Array.isArray(pair) && (pair.includes(a) || pair.includes(b))
  );

  const countA = matchedAxis.reduce((sum, traits) => sum + traits.filter(t => t === a).length, 0);
  const countB = matchedAxis.reduce((sum, traits) => sum + traits.filter(t => t === b).length, 0);

  if (countA > countB) return a;
  if (countB > countA) return b;

  return randomChoice(a, b);
}


function randomChoice(a, b) {
  return Math.random() < 0.5 ? a : b;
}

function showResult() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("main-heading").style.display = "none";

const resultScreen = document.getElementById("result-screen");
resultScreen.style.display = "block";

// Trigger fade-in effect
setTimeout(() => resultScreen.classList.add("show"), 10);

  const result = getMBTI();
  console.log("Final MBTI:", result);
  document.getElementById("final-mbti-type").innerText = `Your MBTI Type is ${result}`;
  
  fetch("prophecy.json")
    .then(res => res.json())
    .then(data => {
      const animal = data[result];

      if (!animal) {
        alert("Oops! No prophecy found for " + result);
        return;
      }

      const [namePart, titlePart] = animal.animal.split("—").map(s => s.trim());
      document.getElementById("final-result-name").innerText = `${playerName}, your spirit animal is ...`;
      document.getElementById("final-animal-title").innerText = namePart.toUpperCase();
      document.getElementById("final-animal-subtitle").innerText = titlePart || "";
      document.getElementById("final-animal-image").src = `images/animals/${result.toLowerCase()}.png`;
      document.getElementById("card-animal-image").src = `images/animals/${namePart.toLowerCase()}.png`;
      document.getElementById("social-animal-image").src = `images/animals/${namePart.toLowerCase()}.png`;
      document.getElementById("final-animal-image").src = `images/animals/${namePart.toLowerCase()}.png`;
      document.getElementById("final-prophecy").innerText = animal.prophecy;
      document.getElementById("final-fact").innerText = animal.fun_fact;


      // Show both card previews
      document.getElementById("portrait-card").style.display = "block";
      document.getElementById("social-card").style.display = "block";

      // Populate Portrait Card
      document.getElementById("card-animal-title").innerText = namePart.toUpperCase();
      document.getElementById("card-animal-subtitle").innerText = titlePart || "";
      document.getElementById("card-player-name").innerText = playerName;
      document.getElementById("card-mbti-type").innerText = `MBTI: ${result}`;
      document.getElementById("card-prophecy").innerText = animal.prophecy;
      document.getElementById("card-fact").innerText = animal.fun_fact;
      document.getElementById("card-animal-image").src = `images/animals/${namePart.toLowerCase()}.png`;

      // Populate Social Card
      document.getElementById("social-animal-title").innerText = namePart.toUpperCase();
      document.getElementById("social-animal-subtitle").innerText = titlePart || "";
      document.getElementById("social-player-name").innerText = playerName;
      document.getElementById("social-mbti-type").innerText = `MBTI: ${result}`;
      document.getElementById("social-prophecy").innerText = animal.prophecy;
      document.getElementById("social-fact").innerText = animal.fun_fact;
      document.getElementById("social-animal-image").src = `images/animals/${namePart.toLowerCase()}.png`;
      document.getElementById("portrait-card-wrapper").style.display = "block";
      document.getElementById("social-card-wrapper").style.display = "block";
    });

  // Set result background if you want a special one
  setPageBackground({ imageName: "bg-31.jpg", textColor: "#fff" });
}

function downloadResponsiveCard() {
  const isMobile = window.innerWidth < 768;
  const type = isMobile ? "social" : "portrait";
  downloadCard(type);
}

function downloadCard(type = "portrait") {
  const cardId = type === "social" ? "social-card" : "portrait-card";
  const cardElement = document.getElementById(cardId);
  if (!cardElement) {
	alert("Card not found.");
	return;
  }

  html2canvas(cardElement).then(canvas => {
	const link = document.createElement("a");
	const timestamp = new Date().toISOString().split("T")[0];
	link.download = `spirit-${type}-card-${timestamp}.png`;
	link.href = canvas.toDataURL("image/png");
	link.click();
  });
}

function goToBrand() {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("brand-screen").style.display = "block";
}


function goToDownload() {
  document.getElementById("brand-screen").style.display = "none";
  document.getElementById("download-screen").style.display = "block";

  const isMobile = window.innerWidth < 768; // True for mobile devices

  if (isMobile) {
    document.getElementById("portrait-card-wrapper").style.display = "none";
    document.getElementById("social-card-wrapper").style.display = "block";
  } else {
    document.getElementById("portrait-card-wrapper").style.display = "block";
    document.getElementById("social-card-wrapper").style.display = "none";
  }
}

window.addEventListener("resize", () => {
  const isMobile = window.innerWidth < 768;
  const portrait = document.getElementById("portrait-card-wrapper");
  const social = document.getElementById("social-card-wrapper");

  if (portrait && social && document.getElementById("download-screen").style.display === "block") {
    portrait.style.display = isMobile ? "none" : "block";
    social.style.display = isMobile ? "block" : "none";
  }
});


function retakeQuiz() {
  // Reset state
  currentQuestion = 0;
  playerName = "";
  lastSelectedIndex = null;
  answerHistory = [];
  for (let key in scores) scores[key] = 0;

  // Hide all pages
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("brand-screen").style.display = "none";
  document.getElementById("download-screen").style.display = "none";

  // Hide card previews
  document.getElementById("portrait-card").style.display = "none";
  document.getElementById("social-card").style.display = "none";

  // Reset input
  const nameInput = document.getElementById("playerName");
  if (nameInput) nameInput.value = "";

  // Show start screen again
  setPageBackground({ imageName: "bg-1.jpg", textColor: "#111" });
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("main-heading").style.display = "block";
  document.querySelector(".footer").style.display = "flex";
  window.scrollTo(0, 0);
}

window.retakeQuiz = retakeQuiz;


function toggleMusic() {
  const music = document.getElementById("bg-music");
  if (!music) return;

  music.muted = !music.muted;

  const buttons = document.querySelectorAll(".toggle-music");
  buttons.forEach(btn => {
    btn.textContent = music.muted ? "🔇" : "🔊";
  });

  if (!music.muted) {
    music.play().catch(err => console.warn("Play blocked:", err));
  }
}

window.startQuiz = startQuiz;
window.toggleMusic = toggleMusic;
window.downloadCard = downloadCard;



