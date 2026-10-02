import type { InfoPanelData, InfoRow } from "./types";

export const visitLangs = ["en", "es", "fr", "zh"] as const;
export type VisitLang = (typeof visitLangs)[number];

export interface VisitCopy {
  lang: VisitLang;
  htmlLang: string;
  endonym: string;
  path: string;
  languageLabel: string;
  title: string;
  intro: string;
  toc: { hours: string; tickets: string; getting: string; access: string; cafe: string };
  hours: { rows: InfoRow[]; note: string };
  tickets: { intro: string; rows: InfoRow[]; cta: string; members: string; membersCta: string };
  getting: { addressLabel: string; items: { title: string; text: string }[] };
  access: {
    intro: string;
    items: { id: string; title: string; text: string; link?: { label: string; href: string } }[];
    calmTitle: string;
    calmText: string;
    calmOn: string;
    calmOff: string;
  };
  cafe: { name: string; text: string; hours: string };
  panel: InfoPanelData;
}

const address = ["Loud House", "3 Dye Works Yard", "London E9 5LH"];
const nb = " "; // French punctuation spacing

const en: VisitCopy = {
  lang: "en",
  htmlLang: "en-GB",
  endonym: "English",
  path: "/visit",
  languageLabel: "Read this page in",
  title: "Plan your visit",
  intro: "Everything you need before you arrive, in one calm place. The art is loud; this page isn't.",
  toc: { hours: "Opening hours", tickets: "Tickets and prices", getting: "Getting here", access: "Access", cafe: "Canteen" },
  hours: {
    rows: [
      { label: "Every day", value: "10:00 – 18:00" },
      { label: "Fridays", value: "10:00 – 21:00" },
      { label: "Quiet hours", value: "Tuesdays and Sundays, 10:00 – 11:00" },
    ],
    note: "Last entry to MORE is 30 minutes before closing. We are closed 24–26 December.",
  },
  tickets: {
    intro: "Entry to the gallery, Soft Machines and The Quiet Room is free. MORE needs a timed ticket: choose a 30-minute entry slot, then stay as long as you like.",
    rows: [
      { label: "Adult", value: "£18" },
      { label: "Concessions", value: "£9", note: "Students, 65+, jobseekers, disabled visitors" },
      { label: "Under-12s", value: "Free" },
      { label: "Members", value: "Free" },
      { label: "Carers", value: "Free", note: "One per disabled visitor" },
    ],
    cta: "Book MORE tickets",
    members: "Members go free every day and can book priority slots.",
    membersCta: "About membership",
  },
  getting: {
    addressLabel: "Address",
    items: [
      { title: "Train", text: "Hackney Wick Overground, 4 minutes' walk. The station and the route to our door are step-free." },
      { title: "Bus", text: "Routes 26, 30 and 488 stop on Wallis Road, 2 minutes' walk." },
      { title: "Bike", text: "40 cycle stands in the yard, including space for adapted and cargo bikes." },
      { title: "Car", text: "No public parking. Four Blue Badge bays can be booked in advance: call 020 7946 0000." },
    ],
  },
  access: {
    intro: "We want everyone to enjoy MORE, including people who find loud spaces hard. Here is what to expect, and how we can help.",
    items: [
      { id: "step-free", title: "Step-free routes", text: "Every room is step-free. The main entrance has a level threshold and lifts serve all floors. The route through MORE is 450 metres, with seating in every room." },
      { id: "quiet-hours", title: "Quiet hours", text: "Tuesdays and Sundays, 10:00 – 11:00. Sound is turned down, Room 4 is brighter and we admit half the usual number of visitors." },
      { id: "sensory-map", title: "Sensory map", text: "Shows where MORE is loud, bright, dark or busy, and where to find quiet seating.", link: { label: "Download the sensory map (PDF, 1 page)", href: "/access/sensory-map.pdf" } },
      { id: "large-print", title: "Large-print guide", text: "Every wall text in large print, online and at the entrance.", link: { label: "Open the large-print guide", href: "/visit/large-print" } },
      { id: "bsl", title: "BSL-interpreted events", text: "Monthly tours in British Sign Language, plus audio-described and touch tours.", link: { label: "See access events", href: "/events?type=access" } },
      { id: "carers", title: "Carers and assistance dogs", text: "Carers go free. Assistance dogs are welcome everywhere." },
      { id: "facilities", title: "Facilities", text: "Accessible toilets on every floor and a Changing Places toilet on the ground floor. Wheelchairs and folding stools to borrow at the entrance." },
    ],
    calmTitle: "Calm mode",
    calmText: "Switch this website to a low-stimulation version: no patterns, no collage, no animation, black text on cream.",
    calmOn: "Turn calm mode on",
    calmOff: "Turn calm mode off",
  },
  cafe: {
    name: "The Canteen",
    text: "Seasonal lunches, good coffee and cake the size of your head. High chairs, baby changing and a quieter back room. No ticket needed.",
    hours: "Every day 10:00 – 17:30; Fridays until 20:30.",
  },
  panel: {
    lang: "en-GB",
    eyebrow: "Plan your visit",
    title: "Loud House",
    dates: "Free entry. MORE is ticketed.",
    hoursHeading: "Opening hours",
    hours: [
      { label: "Every day", value: "10:00 – 18:00" },
      { label: "Fridays", value: "10:00 – 21:00" },
      { label: "Quiet hours", value: "Tue & Sun, 10:00 – 11:00" },
    ],
    pricesHeading: "MORE tickets",
    prices: [
      { label: "Adult", value: "£18" },
      { label: "Concessions", value: "£9" },
      { label: "Under-12s", value: "Free" },
      { label: "Members", value: "Free" },
    ],
    cta: { label: "Book tickets", href: "/tickets" },
    accessHeading: "Access",
    access: [
      { label: "Access information", href: "/visit#access" },
      { label: "Sensory map (PDF)", href: "/access/sensory-map.pdf" },
      { label: "Large-print guide", href: "/visit/large-print" },
    ],
    addressHeading: "Getting here",
    address: ["3 Dye Works Yard, London E9 5LH", "Hackney Wick Overground, 4 min walk"],
    barLabel: "Visit info & tickets",
    closeLabel: "Close",
  },
};

const es: VisitCopy = {
  lang: "es",
  htmlLang: "es",
  endonym: "Español",
  path: "/visit/es",
  languageLabel: "Lee esta página en",
  title: "Planifica tu visita",
  intro: "Todo lo que necesitas antes de llegar, en un solo lugar tranquilo. El arte es ruidoso; esta página no.",
  toc: { hours: "Horario", tickets: "Entradas y precios", getting: "Cómo llegar", access: "Accesibilidad", cafe: "Cantina" },
  hours: {
    rows: [
      { label: "Todos los días", value: "10:00 – 18:00" },
      { label: "Viernes", value: "10:00 – 21:00" },
      { label: "Horas tranquilas", value: "Martes y domingos, 10:00 – 11:00" },
    ],
    note: "La última entrada a MORE es 30 minutos antes del cierre. Cerramos del 24 al 26 de diciembre.",
  },
  tickets: {
    intro: "La entrada a la galería, a Soft Machines y a The Quiet Room es gratuita. MORE requiere una entrada con hora: elige una franja de 30 minutos y quédate todo el tiempo que quieras.",
    rows: [
      { label: "Adultos", value: "£18" },
      { label: "Reducida", value: "£9", note: "Estudiantes, mayores de 65, personas desempleadas, visitantes con discapacidad" },
      { label: "Menores de 12", value: "Gratis" },
      { label: "Miembros", value: "Gratis" },
      { label: "Acompañantes", value: "Gratis", note: "Uno por visitante con discapacidad" },
    ],
    cta: "Reserva entradas para MORE",
    members: "Los miembros entran gratis todos los días y pueden reservar franjas prioritarias.",
    membersCta: "Hazte miembro",
  },
  getting: {
    addressLabel: "Dirección",
    items: [
      { title: "Tren", text: "Hackney Wick (Overground), a 4 minutos a pie. La estación y el camino hasta nuestra puerta no tienen escalones." },
      { title: "Autobús", text: "Las líneas 26, 30 y 488 paran en Wallis Road, a 2 minutos a pie." },
      { title: "Bicicleta", text: "40 aparcabicis en el patio, con espacio para bicicletas adaptadas y de carga." },
      { title: "Coche", text: "No hay aparcamiento público. Se pueden reservar cuatro plazas Blue Badge con antelación llamando al 020 7946 0000." },
    ],
  },
  access: {
    intro: "Queremos que todo el mundo disfrute de MORE, también quienes encuentran difíciles los espacios ruidosos. Esto es lo que puedes esperar y cómo podemos ayudarte.",
    items: [
      { id: "step-free", title: "Rutas sin escalones", text: "Todas las salas son accesibles sin escalones. La entrada principal está a nivel y hay ascensores a todas las plantas. El recorrido por MORE mide 450 metros, con asientos en cada sala." },
      { id: "quiet-hours", title: "Horas tranquilas", text: "Martes y domingos, de 10:00 a 11:00. Bajamos el sonido, iluminamos más la Sala 4 y admitimos a la mitad de visitantes." },
      { id: "sensory-map", title: "Mapa sensorial", text: "Muestra dónde MORE es ruidoso, luminoso, oscuro o concurrido, y dónde encontrar asientos tranquilos.", link: { label: "Descargar el mapa sensorial (PDF, en inglés)", href: "/access/sensory-map.pdf" } },
      { id: "large-print", title: "Guía en letra grande", text: "Todos los textos de sala en letra grande, en línea y en la entrada.", link: { label: "Abrir la guía en letra grande (en inglés)", href: "/visit/large-print" } },
      { id: "bsl", title: "Actividades con intérprete de BSL", text: "Visitas mensuales en lengua de signos británica, además de visitas con audiodescripción y visitas táctiles.", link: { label: "Ver actividades accesibles", href: "/events?type=access" } },
      { id: "carers", title: "Acompañantes y perros de asistencia", text: "Los acompañantes entran gratis. Los perros de asistencia son bienvenidos en todas partes." },
      { id: "facilities", title: "Instalaciones", text: "Aseos accesibles en todas las plantas y un aseo Changing Places en la planta baja. Préstamo de sillas de ruedas y taburetes plegables en la entrada." },
    ],
    calmTitle: "Modo tranquilo",
    calmText: "Cambia esta web a una versión de baja estimulación: sin estampados, sin collage, sin animaciones, texto negro sobre fondo crema.",
    calmOn: "Activar el modo tranquilo",
    calmOff: "Desactivar el modo tranquilo",
  },
  cafe: {
    name: "The Canteen",
    text: "Comidas de temporada, buen café y tartas del tamaño de tu cabeza. Tronas, cambiador y una sala trasera más tranquila. No hace falta entrada.",
    hours: "Todos los días 10:00 – 17:30; viernes hasta las 20:30.",
  },
  panel: {
    lang: "es",
    eyebrow: "Planifica tu visita",
    title: "Loud House",
    dates: "Entrada gratuita. MORE requiere entrada.",
    hoursHeading: "Horario",
    hours: [
      { label: "Todos los días", value: "10:00 – 18:00" },
      { label: "Viernes", value: "10:00 – 21:00" },
      { label: "Horas tranquilas", value: "Mar. y dom., 10:00 – 11:00" },
    ],
    pricesHeading: "Entradas para MORE",
    prices: [
      { label: "Adultos", value: "£18" },
      { label: "Reducida", value: "£9" },
      { label: "Menores de 12", value: "Gratis" },
      { label: "Miembros", value: "Gratis" },
    ],
    cta: { label: "Reservar entradas", href: "/tickets" },
    accessHeading: "Accesibilidad",
    access: [
      { label: "Información de accesibilidad", href: "/visit/es#access" },
      { label: "Mapa sensorial (PDF)", href: "/access/sensory-map.pdf" },
      { label: "Guía en letra grande", href: "/visit/large-print" },
    ],
    addressHeading: "Cómo llegar",
    address: ["3 Dye Works Yard, Londres E9 5LH", "Hackney Wick (Overground), a 4 min a pie"],
    barLabel: "Información y entradas",
    closeLabel: "Cerrar",
  },
};

const fr: VisitCopy = {
  lang: "fr",
  htmlLang: "fr",
  endonym: "Français",
  path: "/visit/fr",
  languageLabel: "Lire cette page en",
  title: "Préparer votre visite",
  intro: `Tout ce qu'il faut savoir avant de venir, réuni dans un endroit calme. L'art est bruyant${nb}; cette page ne l'est pas.`,
  toc: { hours: "Horaires", tickets: "Billets et tarifs", getting: "Venir à Loud House", access: "Accessibilité", cafe: "Cantine" },
  hours: {
    rows: [
      { label: "Tous les jours", value: "10 h – 18 h" },
      { label: "Le vendredi", value: "10 h – 21 h" },
      { label: "Heures calmes", value: "Mardi et dimanche, 10 h – 11 h" },
    ],
    note: "Dernière entrée à MORE 30 minutes avant la fermeture. Fermé du 24 au 26 décembre.",
  },
  tickets: {
    intro: `L'entrée de la galerie, de Soft Machines et de The Quiet Room est gratuite. MORE nécessite un billet horodaté${nb}: choisissez un créneau d'entrée de 30 minutes, puis restez aussi longtemps que vous le souhaitez.`,
    rows: [
      { label: "Plein tarif", value: "£18" },
      { label: "Tarif réduit", value: "£9", note: "Étudiants, plus de 65 ans, demandeurs d'emploi, visiteurs en situation de handicap" },
      { label: "Moins de 12 ans", value: "Gratuit" },
      { label: "Membres", value: "Gratuit" },
      { label: "Accompagnateurs", value: "Gratuit", note: "Un par visiteur en situation de handicap" },
    ],
    cta: "Réserver des billets pour MORE",
    members: "Les membres entrent gratuitement tous les jours et peuvent réserver des créneaux prioritaires.",
    membersCta: "Devenir membre",
  },
  getting: {
    addressLabel: "Adresse",
    items: [
      { title: "Train", text: "Hackney Wick (Overground), à 4 minutes à pied. La gare et le trajet jusqu'à notre porte sont de plain-pied." },
      { title: "Bus", text: "Les lignes 26, 30 et 488 s'arrêtent sur Wallis Road, à 2 minutes à pied." },
      { title: "Vélo", text: "40 arceaux dans la cour, avec de la place pour les vélos adaptés et les vélos cargo." },
      { title: "Voiture", text: `Pas de parking public. Quatre places Blue Badge peuvent être réservées à l'avance${nb}: appelez le 020 7946 0000.` },
    ],
  },
  access: {
    intro: "Nous voulons que tout le monde profite de MORE, y compris les personnes pour qui les espaces bruyants sont difficiles. Voici à quoi vous attendre et comment nous pouvons vous aider.",
    items: [
      { id: "step-free", title: "Parcours de plain-pied", text: "Toutes les salles sont de plain-pied. L'entrée principale est sans marche et des ascenseurs desservent tous les étages. Le parcours de MORE fait 450 mètres, avec des sièges dans chaque salle." },
      { id: "quiet-hours", title: "Heures calmes", text: "Le mardi et le dimanche, de 10 h à 11 h. Le son est baissé, la salle 4 est plus éclairée et nous accueillons moitié moins de visiteurs." },
      { id: "sensory-map", title: "Carte sensorielle", text: "Indique où MORE est bruyant, lumineux, sombre ou fréquenté, et où trouver des sièges au calme.", link: { label: "Télécharger la carte sensorielle (PDF, en anglais)", href: "/access/sensory-map.pdf" } },
      { id: "large-print", title: "Guide en gros caractères", text: "Tous les textes de salle en gros caractères, en ligne et à l'entrée.", link: { label: "Ouvrir le guide en gros caractères (en anglais)", href: "/visit/large-print" } },
      { id: "bsl", title: "Événements interprétés en BSL", text: "Visites mensuelles en langue des signes britannique, ainsi que des visites audiodécrites et tactiles.", link: { label: "Voir les événements accessibles", href: "/events?type=access" } },
      { id: "carers", title: "Accompagnateurs et chiens d'assistance", text: "Les accompagnateurs entrent gratuitement. Les chiens d'assistance sont les bienvenus partout." },
      { id: "facilities", title: "Équipements", text: "Toilettes accessibles à chaque étage et toilettes Changing Places au rez-de-chaussée. Prêt de fauteuils roulants et de tabourets pliants à l'entrée." },
    ],
    calmTitle: "Mode calme",
    calmText: `Passez ce site en version à faible stimulation${nb}: sans motifs, sans collage, sans animation, texte noir sur fond crème.`,
    calmOn: "Activer le mode calme",
    calmOff: "Désactiver le mode calme",
  },
  cafe: {
    name: "The Canteen",
    text: "Déjeuners de saison, bon café et gâteaux grands comme votre tête. Chaises hautes, table à langer et une arrière-salle plus calme. Aucun billet nécessaire.",
    hours: `Tous les jours 10 h – 17 h 30${nb}; le vendredi jusqu'à 20 h 30.`,
  },
  panel: {
    lang: "fr",
    eyebrow: "Préparer votre visite",
    title: "Loud House",
    dates: "Entrée libre. MORE est payant.",
    hoursHeading: "Horaires",
    hours: [
      { label: "Tous les jours", value: "10 h – 18 h" },
      { label: "Le vendredi", value: "10 h – 21 h" },
      { label: "Heures calmes", value: "Mar. et dim., 10 h – 11 h" },
    ],
    pricesHeading: "Billets pour MORE",
    prices: [
      { label: "Plein tarif", value: "£18" },
      { label: "Tarif réduit", value: "£9" },
      { label: "Moins de 12 ans", value: "Gratuit" },
      { label: "Membres", value: "Gratuit" },
    ],
    cta: { label: "Réserver des billets", href: "/tickets" },
    accessHeading: "Accessibilité",
    access: [
      { label: "Informations d'accessibilité", href: "/visit/fr#access" },
      { label: "Carte sensorielle (PDF)", href: "/access/sensory-map.pdf" },
      { label: "Guide en gros caractères", href: "/visit/large-print" },
    ],
    addressHeading: "Venir",
    address: ["3 Dye Works Yard, Londres E9 5LH", "Hackney Wick (Overground), à 4 min à pied"],
    barLabel: "Infos pratiques et billets",
    closeLabel: "Fermer",
  },
};

const zh: VisitCopy = {
  lang: "zh",
  htmlLang: "zh-Hans",
  endonym: "中文",
  path: "/visit/zh",
  languageLabel: "阅读语言",
  title: "参观指南",
  intro: "来访前需要了解的一切，都集中在这个安静的页面上。艺术很喧闹，这个页面不会。",
  toc: { hours: "开放时间", tickets: "门票与价格", getting: "交通", access: "无障碍服务", cafe: "餐厅" },
  hours: {
    rows: [
      { label: "每天", value: "10:00 – 18:00" },
      { label: "周五", value: "10:00 – 21:00" },
      { label: "安静时段", value: "周二和周日 10:00 – 11:00" },
    ],
    note: "MORE 最晚入场时间为闭馆前 30 分钟。12 月 24 日至 26 日闭馆。",
  },
  tickets: {
    intro: "美术馆、Soft Machines 和 The Quiet Room 均可免费参观。MORE 需要预约分时门票：选择一个 30 分钟的入场时段，入场后可随意停留。",
    rows: [
      { label: "成人", value: "£18" },
      { label: "优惠票", value: "£9", note: "学生、65 岁以上人士、求职者、残障访客" },
      { label: "12 岁以下", value: "免费" },
      { label: "会员", value: "免费" },
      { label: "陪同人员", value: "免费", note: "每位残障访客可有一名陪同人员免费入场" },
    ],
    cta: "预订 MORE 门票",
    members: "会员每天免费入场，并可预订优先时段。",
    membersCta: "了解会员",
  },
  getting: {
    addressLabel: "地址",
    items: [
      { title: "火车", text: "Hackney Wick 地上铁站（Overground），步行 4 分钟。车站及前往入口的路线均无台阶。" },
      { title: "公交", text: "26、30 和 488 路公交车停靠 Wallis Road，步行 2 分钟。" },
      { title: "自行车", text: "院内有 40 个自行车停车位，包括适用于无障碍自行车和货运自行车的车位。" },
      { title: "驾车", text: "无公共停车场。可致电 020 7946 0000 提前预约四个蓝色徽章（Blue Badge）无障碍车位。" },
    ],
  },
  access: {
    intro: "我们希望每个人都能享受 MORE，包括觉得喧闹环境难以适应的访客。以下是参观时的注意事项，以及我们可以提供的帮助。",
    items: [
      { id: "step-free", title: "无台阶路线", text: "所有展厅均无台阶。正门入口与地面齐平，电梯通往各层。MORE 的参观路线全长 450 米，每个展厅都设有座椅。" },
      { id: "quiet-hours", title: "安静时段", text: "每周二和周日 10:00 – 11:00：调低音量，调亮 4 号展厅的灯光，入场人数减半。" },
      { id: "sensory-map", title: "感官地图", text: "标示 MORE 中嘈杂、明亮、昏暗或拥挤的区域，以及安静的休息座位。", link: { label: "下载感官地图（PDF，英文）", href: "/access/sensory-map.pdf" } },
      { id: "large-print", title: "大字版导览", text: "所有展墙文字的大字版本，可在线阅读，也可在入口处领取。", link: { label: "打开大字版导览（英文）", href: "/visit/large-print" } },
      { id: "bsl", title: "英国手语（BSL）传译活动", text: "每月举办英国手语导览，另有口述影像导览和触摸导览。", link: { label: "查看无障碍活动", href: "/events?type=access" } },
      { id: "carers", title: "陪同人员与辅助犬", text: "陪同人员免费入场。辅助犬可进入所有区域。" },
      { id: "facilities", title: "设施", text: "每层均设无障碍卫生间，底层设有 Changing Places 卫生间。入口处可借用轮椅和折叠凳。" },
    ],
    calmTitle: "安静模式",
    calmText: "将本网站切换为低刺激版本：没有图案、没有拼贴、没有动画，米色背景上的黑色文字。",
    calmOn: "开启安静模式",
    calmOff: "关闭安静模式",
  },
  cafe: {
    name: "The Canteen",
    text: "时令午餐、好咖啡，还有和你的脸一样大的蛋糕。提供儿童高脚椅、婴儿换尿布台和一间更安静的后厅。无需门票。",
    hours: "每天 10:00 – 17:30；周五营业至 20:30。",
  },
  panel: {
    lang: "zh-Hans",
    eyebrow: "参观指南",
    title: "Loud House",
    dates: "免费入场。MORE 需购票。",
    hoursHeading: "开放时间",
    hours: [
      { label: "每天", value: "10:00 – 18:00" },
      { label: "周五", value: "10:00 – 21:00" },
      { label: "安静时段", value: "周二、周日 10:00 – 11:00" },
    ],
    pricesHeading: "MORE 门票",
    prices: [
      { label: "成人", value: "£18" },
      { label: "优惠票", value: "£9" },
      { label: "12 岁以下", value: "免费" },
      { label: "会员", value: "免费" },
    ],
    cta: { label: "预订门票", href: "/tickets" },
    accessHeading: "无障碍服务",
    access: [
      { label: "无障碍信息", href: "/visit/zh#access" },
      { label: "感官地图（PDF）", href: "/access/sensory-map.pdf" },
      { label: "大字版导览", href: "/visit/large-print" },
    ],
    addressHeading: "交通",
    address: ["3 Dye Works Yard, London E9 5LH", "Hackney Wick 地上铁站，步行 4 分钟"],
    barLabel: "参观信息与门票",
    closeLabel: "关闭",
  },
};

export const visitCopy: Record<VisitLang, VisitCopy> = { en, es, fr, zh };
export { address as galleryAddress };
