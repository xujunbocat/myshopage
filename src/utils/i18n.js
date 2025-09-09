// 翻译数据缓存
const translations = new Map();

// 加载翻译文件
async function loadTranslations(locale) {
  if (translations.has(locale)) {
    return translations.get(locale);
  }

  try {
    const response = await import(`../i18n/${locale}.json`);
    const data = response.default;
    translations.set(locale, data);
    return data;
  } catch (error) {
    console.warn(`Translation file for locale ${locale} not found, falling back to English`);
    if (locale !== 'en') {
      return await loadTranslations('en');
    }
    return {};
  }
}

// 获取翻译函数
export async function getTranslations(locale = 'en') {
  const data = await loadTranslations(locale);
  
  // 返回一个翻译函数
  return {
    t: (key) => {
      const keys = key.split('.');
      let value = data;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // 如果找不到翻译，返回原始key
        }
      }
      
      return value || key;
    },
    data
  };
}

// 根据分数获取评价文本（多语言版本）
export function getRatingText(rating, locale = 'en') {
  const ratingKey = (() => {
    if (rating >= 9.0) return 'excellent';
    if (rating >= 8.0) return 'great';
    if (rating >= 7.0) return 'good';
    if (rating >= 6.0) return 'fair';
    return 'ok';
  })();

  // 这里需要在模板中使用时调用翻译函数
  return ratingKey;
}

// 简单的字符串哈希函数，用于生成一致的随机种子
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// 根据语言和内容ID获取本地化作者名字（保证一致性）
export function getLocalizedAuthors(locale = 'en', contentId = null) {
  // 英语作者头像文件名（作为基准）
  const avatarFileNames = {
    male: [
      "RichardWhitman", "JamesCaldwell", "EdwardHastings", "ThomasRidley",
      "CharlesPennington", "WalterGreaves", "HaroldBeckett", "FranklinMorse",
      "DouglasAtwood", "RobertEllsworth"
    ],
    female: [
      "MargaretWinslow", "SusanEllery", "ElizabethCrane", "JudithCarver",
      "EleanorPrescott", "DianeWhitmore", "ClaraBainbridge", "KathleenFoster",
      "BarbaraHollings", "JoanneWhitfield"
    ]
  };

  const authors = {
    en: {
      male: [
        "Richard Whitman", "James Caldwell", "Edward Hastings", "Thomas Ridley",
        "Charles Pennington", "Walter Greaves", "Harold Beckett", "Franklin Morse",
        "Douglas Atwood", "Robert Ellsworth"
      ],
      female: [
        "Margaret Winslow", "Susan Ellery", "Elizabeth Crane", "Judith Carver",
        "Eleanor Prescott", "Diane Whitmore", "Clara Bainbridge", "Kathleen Foster",
        "Barbara Hollings", "Joanne Whitfield"
      ]
    },
    de: {
      male: [
        "Klaus Mueller", "Hans Wagner", "Friedrich Schmidt", "Wolfgang Becker",
        "Helmut Fischer", "Dieter Weber", "Guenther Schulz", "Manfred Richter",
        "Heinz Hoffmann", "Gerhard Klein"
      ],
      female: [
        "Ingrid Neumann", "Petra Braun", "Sabine Kraus", "Monika Lehmann",
        "Ursula Wolf", "Brigitte Zimmermann", "Christiane Hartmann", "Gisela Koch",
        "Marlies Bauer", "Renate Schroeder"
      ]
    },
    fr: {
      male: [
        "Pierre Dubois", "Jean Martin", "Michel Durand", "Alain Moreau",
        "Philippe Leroy", "Claude Simon", "Bernard Laurent", "Henri Fournier",
        "Andre Girard", "Jacques Bonnet"
      ],
      female: [
        "Marie Dupont", "Francoise Roux", "Sylvie Blanc", "Monique Fabre",
        "Catherine Vincent", "Nicole Morel", "Dominique Garnier", "Chantal Robin",
        "Isabelle Mercier", "Veronique Leclerc"
      ]
    },
    es: {
      male: [
        "Carlos Rodriguez", "Miguel Gonzalez", "Antonio Martinez", "Jose Lopez",
        "Francisco Sanchez", "Manuel Fernandez", "David Perez", "Juan Garcia",
        "Pedro Jimenez", "Luis Moreno"
      ],
      female: [
        "Maria Garcia", "Carmen Rodriguez", "Josefa Martinez", "Isabel Lopez",
        "Ana Gonzalez", "Dolores Sanchez", "Pilar Fernandez", "Teresa Perez",
        "Rosa Jimenez", "Antonia Moreno"
      ]
    },
    it: {
      male: [
        "Giuseppe Rossi", "Antonio Russo", "Mario Ferrari", "Francesco Esposito",
        "Alessandro Bianchi", "Giovanni Romano", "Stefano Colombo", "Marco Ricci",
        "Andrea Marino", "Roberto Greco"
      ],
      female: [
        "Maria Rossi", "Anna Russo", "Giuseppina Ferrari", "Rosa Esposito",
        "Angela Bianchi", "Giovanna Romano", "Teresa Colombo", "Lucia Ricci",
        "Carmela Marino", "Caterina Greco"
      ]
    }
  };

  const localeAuthors = authors[locale] || authors.en;
  const allAuthors = [...localeAuthors.male, ...localeAuthors.female];
  const allAvatars = [...avatarFileNames.male, ...avatarFileNames.female];

  // 如果有内容ID，使用它生成一致的随机选择
  let authorIndex;
  if (contentId) {
    const hash = simpleHash(contentId.toString());
    authorIndex = hash % allAuthors.length;
  } else {
    // 回退到随机选择
    authorIndex = Math.floor(Math.random() * allAuthors.length);
  }

  const selectedAuthor = allAuthors[authorIndex];
  const [firstName, lastName] = selectedAuthor.split(" ");
  
  // 使用对应的英语头像文件名
  const avatarFileName = allAvatars[authorIndex];

  return {
    first_name: firstName,
    last_name: lastName,
    avatar: `/author/${avatarFileName}.jpg`
  };
}

// 格式化本地化日期
export function formatLocalizedDate(date, locale = 'en') {
  const localeMap = {
    en: 'en-US',
    de: 'de-DE', 
    fr: 'fr-FR',
    es: 'es-ES',
    it: 'it-IT'
  };

  return new Intl.DateTimeFormat(localeMap[locale] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
} 