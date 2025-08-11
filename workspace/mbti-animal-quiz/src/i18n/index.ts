import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
      start: 'Start',
      next: 'Next',
      continue: 'Continue',
      restart: 'Play again',
      download: 'Download',
      brand: 'Brand',
      yourName: 'Your name',
      language: 'Language',
      music: 'Music',
      on: 'On',
      off: 'Off',
      progress: 'Progress',
    },
    intro: {
      title: 'MBTI Animal Journey',
      description: 'A story-driven multiple-choice journey to reveal your inner animal.',
    },
    quiz: {
      q1: {
        text: 'At dawn, a path splits into three forests. Which calls to you?',
        a: 'The misty grove with hidden whispers',
        b: 'The sunny trail with lively chatter',
        c: 'The silent woods of solitary calm',
        transition: 'You step forward as the trees seem to lean in, listening...'
      },
      q2: {
        text: 'A traveler asks for help. You—',
        a: 'Offer careful advice before acting',
        b: 'Jump in and fix it together',
        c: 'Observe, then decide if it aligns with your path',
        transition: 'The road bends; lanterns flicker like curious eyes.'
      },
      q3: {
        text: 'Night falls. You choose to—',
        a: 'Study the stars and plan',
        b: 'Gather the group and share stories',
        c: 'Find a quiet spot to reflect',
        transition: 'A hush settles. Something awakens in the dark.'
      }
    },
    transition: {
      continue: 'Continue',
    },
    result: {
      title: 'Your Result',
      animal: 'Animal',
      name: 'Name',
      fox: {
        name: 'Fox',
        description: 'Clever, adaptable, and guided by curiosity.',
        funFact: 'Foxes use the Earth’s magnetic field to hunt with accuracy.'
      }
    },
    download: {
      title: 'Download your tarot-like card',
      hint: 'Tap the button to generate an image of your result card.',
    },
    brand: {
      title: 'Brand & Activities',
      description: 'Discover our latest stories, events, and experiences.'
    }
  },
  zh: {
    common: {
      start: '開始',
      next: '下一步',
      continue: '繼續',
      restart: '再玩一次',
      download: '下載',
      brand: '品牌',
      yourName: '你的名字',
      language: '語言',
      music: '音樂',
      on: '開',
      off: '關',
      progress: '進度',
    },
    intro: {
      title: 'MBTI 動物旅程',
      description: '以故事推動的選擇題旅程，揭示你的內在動物。',
    },
    quiz: {
      q1: {
        text: '拂曉時分，三條森林小徑在你前方分開。你被哪一條吸引？',
        a: '迷霧樹林，呢喃隱約',
        b: '陽光小徑，熱鬧喧騰',
        c: '寂靜森林，獨處安穩',
        transition: '你踏出一步，樹木彷彿向你傾身細聽……'
      },
      q2: {
        text: '旅人求助，你會——',
        a: '先給予謹慎建議再行動',
        b: '立刻上前一起解決',
        c: '先觀察，再判斷是否符合你的方向',
        transition: '道路轉彎，燈籠如好奇的眼睛微微閃爍。'
      },
      q3: {
        text: '夜幕降臨，你選擇——',
        a: '觀星並制定計畫',
        b: '圍成一圈分享故事',
        c: '找個安靜處沉思',
        transition: '靜謐瀰漫，黑暗中有某種力量甦醒。'
      }
    },
    transition: {
      continue: '繼續',
    },
    result: {
      title: '你的結果',
      animal: '動物',
      name: '名字',
      fox: {
        name: '狐狸',
        description: '聰穎靈活，受好奇心引導。',
        funFact: '狐狸會利用地球磁場來精準狩獵。'
      }
    },
    download: {
      title: '下載你的塔羅風卡牌',
      hint: '點擊按鈕生成你的結果卡牌圖片。',
    },
    brand: {
      title: '品牌與活動',
      description: '探索我們的最新故事、活動與體驗。'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})