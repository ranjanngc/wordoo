const words = [
    "able",
    "about",
    "absolute",
    "accept",
    "account",
    "achieve",
    "across",
    "act",
    "active",
    "actual",
    "add",
    "address",
    "admit",
    "advertise",
    "affect",
    "afford",
    "after",
    "afternoon",
    "again",
    "against",
    "age",
    "agent",
    "ago",
    "agree",
    "air",
    "all",
    "allow",
    "almost",
    "along",
    "already",
    "alright",
    "also",
    "although",
    "always",
    "america",
    "amount",
    "and",
    "another",
    "answer",
    "apart",
    "apparent",
    "appear",
    "apply",
    "appoint",
    "approach",
    "appropriate",
    "area",
    "argue",
    "arm",
    "around",
    "arrange",
    "art",
    "ask",
    "associate",
    "assume",
    "attend",
    "authority",
    "available",
    "aware",
    "away",
    "awful",
    "baby",
    "back",
    "bad",
    "bag",
    "balance",
    "ball",
    "bank",
    "bar",
    "base",
    "basis",
    "bear",
    "beat",
    "beauty",
    "because",
    "become",
    "bed",
    "before",
    "begin",
    "behind",
    "believe",
    "benefit",
    "best",
    "bet",
    "between",
    "big",
    "bill",
    "birth",
    "bit",
    "black",
    "bloke",
    "blood",
    "blow",
    "blue",
    "board",
    "boat",
    "body",
    "book",
    "both",
    "bother",
    "bottle",
    "bottom",
    "box",
    "boy",
    "break",
    "brief",
    "brilliant",
    "bring",
    "britain",
    "brother",
    "budget",
    "build",
    "bus",
    "business",
    "busy",
    "but",
    "buy",
    "by",
    "cake",
    "call",
    "can",
    "car",
    "card",
    "care",
    "carry",
    "case",
    "cat",
    "catch",
    "cause",
    "cent",
    "centre",
    "certain",
    "chair",
    "chairman",
    "chance",
    "change",
    "chap",
    "character",
    "charge",
    "cheap",
    "check",
    "child",
    "choice",
    "choose",
    "Christ",
    "Christmas",
    "church",
    "city",
    "claim",
    "class",
    "clean",
    "clear",
    "client",
    "clock",
    "close",
    "closes",
    "clothe",
    "club",
    "coffee",
    "cold",
    "colleague",
    "collect",
    "college",
    "color",
    "come",
    "comment",
    "commit",
    "committee",
    "common",
    "community",
    "company",
    "compare",
    "complete",
    "compute",
    "concern",
    "condition",
    "confer",
    "consider",
    "consult",
    "contact",
    "continue",
    "contract",
    "control",
    "converse",
    "cook",
    "copy",
    "corner",
    "correct",
    "cost",
    "could",
    "council",
    "count",
    "country",
    "county",
    "couple",
    "course",
    "court",
    "cover",
    "create",
    "cross",
    "cup",
    "current",
    "cut",
    "dad",
    "danger",
    "date",
    "day",
    "dead",
    "deal",
    "dear",
    "debate",
    "decide",
    "decision",
    "deep",
    "definite",
    "degree",
    "department",
    "depend",
    "describe",
    "design",
    "detail",
    "develop",
    "die",
    "difference",
    "difficult",
    "dinner",
    "direct",
    "discuss",
    "district",
    "divide",
    "do",
    "doctor",
    "document",
    "dog",
    "door",
    "double",
    "doubt",
    "down",
    "draw",
    "dress",
    "drink",
    "drive",
    "drop",
    "dry",
    "due",
    "during",
    "each",
    "early",
    "east",
    "easy",
    "eat",
    "economy",
    "educate",
    "effect",
    "egg",
    "eight",
    "either",
    "elect",
    "electric",
    "eleven",
    "else",
    "employ",
    "encourage",
    "end",
    "engine",
    "english",
    "enjoy",
    "enough",
    "enter",
    "environment",
    "equal",
    "especial",
    "europe",
    "even",
    "evening",
    "ever",
    "every",
    "evidence",
    "exact",
    "example",
    "except",
    "excuse",
    "exercise",
    "exist",
    "expect",
    "expense",
    "experience",
    "explain",
    "express",
    "extra",
    "eye",
    "face",
    "fact",
    "fair",
    "fall",
    "family",
    "far",
    "farm",
    "fast",
    "father",
    "favour",
    "feed",
    "feel",
    "few",
    "field",
    "fight",
    "figure",
    "file",
    "fill",
    "film",
    "final",
    "finance",
    "find",
    "fine",
    "finish",
    "fire",
    "first",
    "fish",
    "fit",
    "five",
    "flat",
    "floor",
    "fly",
    "follow",
    "food",
    "foot",
    "for",
    "force",
    "forget",
    "form",
    "fortune",
    "forward",
    "four",
    "france",
    "free",
    "friday",
    "friend",
    "from",
    "front",
    "full",
    "fun",
    "function",
    "fund",
    "further",
    "future",
    "game",
    "garden",
    "gas",
    "general",
    "germany",
    "get",
    "girl",
    "give",
    "glass",
    "go",
    "god",
    "good",
    "goodbye",
    "govern",
    "grand",
    "grant",
    "great",
    "green",
    "ground",
    "group",
    "grow",
    "guess",
    "guy",
    "hair",
    "half",
    "hall",
    "hand",
    "hang",
    "happen",
    "happy",
    "hard",
    "hate",
    "hunter",
    "hammer",
    "head",
    "health",
    "hear",
    "heart",
    "heat",
    "heavy",
    "hell",
    "help",
    "here",
    "high",
    "history",
    "hit",
    "hold",
    "holiday",
    "home",
    "honest",
    "hope",
    "horse",
    "hospital",
    "hot",
    "hour",
    "house",
    "how",
    "however",
    "hullo",
    "hundred",
    "husband",
    "idea",
    "identify",
    "fight",
    "imagine",
    "important",
    "improve",
    "introduction",
    "include",
    "income",
    "increase",
    "indeed",
    "individual",
    "industry",
    "inform",
    "inside",
    "instead",
    "insure",
    "interest",
    "into",
    "introduce",
    "invest",
    "involve",
    "issue",
    "ice cream",
    "item",
    "jesus",
    "job",
    "join",
    "judge",
    "jump",
    "just",
    "keep",
    "key",
    "kid",
    "kill",
    "kind",
    "king",
    "kitchen",
    "knock",
    "know",
    "labour",
    "lad",
    "lady",
    "land",
    "language",
    "large",
    "last",
    "late",
    "laugh",
    "law",
    "lay",
    "lead",
    "learn",
    "leave",
    "left",
    "leg",
    "less",
    "jaw",
    "letter",
    "level",
    "box",
    "life",
    "light",
    "like",
    "likely",
    "limit",
    "line",
    "link",
    "list",
    "listen",
    "little",
    "live",
    "load",
    "local",
    "lock",
    "london",
    "long",
    "look",
    "lord",
    "lose",
    "lottery",
    "love",
    "low",
    "luck",
    "lunch",
    "machine",
    "main",
    "major",
    "make",
    "man",
    "manage",
    "many",
    "mark",
    "market",
    "marry",
    "match",
    "matter",
    "money",
    "maybe",
    "mean",
    "meaning",
    "measure",
    "meet",
    "member",
    "mention",
    "middle",
    "might",
    "mile",
    "milk",
    "million",
    "mind",
    "minister",
    "minus",
    "minute",
    "miss",
    "mister",
    "moment",
    "monday",
    "money",
    "month",
    "more",
    "morning",
    "most",
    "mother",
    "motion",
    "move",
    "person",
    "much",
    "music",
    "must",
    "name",
    "nation",
    "nature",
    "near",
    "necessary",
    "need",
    "never",
    "new",
    "news",
    "next",
    "nice",
    "night",
    "nine",
    "name",
    "narrow",
    "empty",
    "normal",
    "north",
    "nothing",
    "note",
    "notice",
    "NFS",
    "number",
    "obvious",
    "occasion",
    "odd",
    "offer",
    "office",
    "often",
    "okay",
    "old",
    "once",
    "one",
    "only",
    "open",
    "operate",
    "opportunity",
    "oppose",
    "order",
    "organize",
    "original",
    "other",
    "otherwise",
    "ought",
    "out",
    "over",
    "own",
    "pack",
    "page",
    "paint",
    "pair",
    "paper",
    "paragraph",
    "pardon",
    "parent",
    "park",
    "part",
    "particular",
    "party",
    "pass",
    "past",
    "pay",
    "pence",
    "pension",
    "people",
    "percent",
    "perfect",
    "perhaps",
    "period",
    "person",
    "photograph",
    "pick",
    "picture",
    "piece",
    "place",
    "plan",
    "play",
    "please",
    "plus",
    "point",
    "police",
    "policy",
    "politic",
    "poor",
    "position",
    "positive",
    "possible",
    "post",
    "pound",
    "power",
    "practice",
    "prepare",
    "present",
    "press",
    "pressure",
    "presume",
    "pretty",
    "previous",
    "price",
    "print",
    "private",
    "probable",
    "problem",
    "proceed",
    "process",
    "produce",
    "product",
    "programme",
    "project",
    "proper",
    "propose",
    "protect",
    "provide",
    "public",
    "pull",
    "purpose",
    "push",
    "put",
    "quality",
    "quarter",
    "question",
    "quick",
    "quid",
    "quiet",
    "quite",
    "radio",
    "rail",
    "raise",
    "range",
    "rate",
    "rather",
    "read",
    "ready",
    "real",
    "really",
    "reason",
    "receive",
    "recent",
    "reckon",
    "recognize",
    "recommend",
    "record",
    "red",
    "reduce",
    "refer",
    "regard",
    "region",
    "relation",
    "remember",
    "report",
    "represent",
    "require",
    "research",
    "resource",
    "respect",
    "responsible",
    "rest",
    "result",
    "return",
    "rid",
    "right",
    "ring",
    "rise",
    "road",
    "role",
    "roll",
    "room",
    "round",
    "rule",
    "run",
    "safe",
    "sale",
    "same",
    "saturday",
    "save",
    "say",
    "scheme",
    "school",
    "science",
    "score",
    "scotland",
    "seat",
    "second",
    "secretary",
    "section",
    "secure",
    "see",
    "seem",
    "self",
    "sell",
    "send",
    "sense",
    "separate",
    "serious",
    "serve",
    "service",
    "set",
    "settle",
    "seven",
    "doll",
    "shall",
    "share",
    "she",
    "sheet",
    "shoe",
    "shoot",
    "shop",
    "short",
    "should",
    "show",
    "shut",
    "sick",
    "side",
    "sign",
    "similar",
    "simple",
    "since",
    "sing",
    "single",
    "sir",
    "sister",
    "sit",
    "site",
    "situate",
    "six",
    "size",
    "sleep",
    "slight",
    "slow",
    "small",
    "smoke",
    "social",
    "society",
    "some",
    "son",
    "soon",
    "sorry",
    "sort",
    "sound",
    "south",
    "space",
    "speak",
    "special",
    "specific",
    "speed",
    "spell",
    "spend",
    "square",
    "staff",
    "stage",
    "stairs",
    "stand",
    "standard",
    "start",
    "state",
    "station",
    "stay",
    "step",
    "stick",
    "still",
    "stop",
    "story",
    "straight",
    "strategy",
    "street",
    "strike",
    "strong",
    "structure",
    "student",
    "study",
    "stuff",
    "stupid",
    "subject",
    "succeed",
    "such",
    "sudden",
    "suggest",
    "suit",
    "summer",
    "sun",
    "sunday",
    "supply",
    "support",
    "suppose",
    "surprise",
    "switch",
    "system",
    "table",
    "take",
    "talk",
    "tape",
    "tax",
    "tea",
    "teach",
    "team",
    "telephone",
    "television",
    "tell",
    "ten",
    "tend",
    "term",
    "terrible",
    "test",
    "thank",
    "therefore",
    "thing",
    "think",
    "thirteen",
    "thirty",
    "thousand",
    "three",
    "through",
    "throw",
    "thursday",
    "tie",
    "time",
    "today",
    "together",
    "tomorrow",
    "tonight",
    "top",
    "total",
    "touch",
    "toward",
    "town",
    "trade",
    "traffic",
    "train",
    "transport",
    "travel",
    "treat",
    "tree",
    "trouble",
    "true",
    "trust",
    "try",
    "tuesday",
    "turn",
    "twelve",
    "twenty",
    "two",
    "type",
    "under",
    "understand",
    "union",
    "unit",
    "unite",
    "university",
    "unless",
    "until",
    "up",
    "upon",
    "use",
    "usual",
    "value",
    "various",
    "very",
    "video",
    "view",
    "village",
    "visit",
    "vote",
    "wage",
    "wait",
    "walk",
    "wall",
    "want",
    "war",
    "warm",
    "wash",
    "waste",
    "watch",
    "water",
    "way",
    "we",
    "wear",
    "wednesday",
    "week",
    "weigh",
    "welcome",
    "well",
    "west",
    "what",
    "when",
    "where",
    "whether",
    "which",
    "while",
    "white",
    "whole",
    "wide",
    "wife",
    "will",
    "win",
    "wind",
    "window",
    "wish",
    "with",
    "within",
    "without",
    "woman",
    "wonder",
    "wood",
    "word",
    "work",
    "world",
    "worry",
    "worse",
    "worth",
    "would",
    "write",
    "wrong",
    "year",
    "yesterday",
    "young",
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Anteater",
    "Antelope",
    "Ape",
    "Armadillo",
    "Donkey",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Capybara",
    "Caribou",
    "Cassowary",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee",
    "Chinchilla",
    "Chough",
    "Clam",
    "Cobra",
    "Cockroach",
    "Cod",
    "Cormorant",
    "Coyote",
    "Crab",
    "Crane",
    "Crocodile",
    "Crow",
    "Curlew",
    "Deer",
    "Dinosaur",
    "Dog",
    "Dogfish",
    "Dolphin",
    "Dotterel",
    "Dove",
    "Dragonfly",
    "Duck",
    "Dugong",
    "Dunlin",
    "Eagle",
    "Echidna",
    "Eel",
    "Eland",
    "Elephant",
    "Elk",
    "Emu",
    "Falcon",
    "Ferret",
    "Finch",
    "Fish",
    "Flamingo",
    "Fly",
    "Fox",
    "Frog",
    "Gaur",
    "Gazelle",
    "Gerbil",
    "Giraffe",
    "Gnat",
    "Gnu",
    "Goat",
    "Goldfinch",
    "Goldfish",
    "Goose",
    "Gorilla",
    "Goshawk",
    "Grasshopper",
    "Grouse",
    "Guanaco",
    "Gull",
    "Hamster",
    "Hare",
    "Hawk",
    "Hedgehog",
    "Heron",
    "Herring",
    "Hippopotamus",
    "Hornet",
    "Horse",
    "Human",
    "Hummingbird",
    "Hyena",
    "Ibex",
    "Ibis",
    "Jackal",
    "Jaguar",
    "Jay",
    "Jellyfish",
    "Kangaroo",
    "Kingfisher",
    "Koala",
    "Kookabura",
    "Kouprey",
    "Kudu",
    "Lapwing",
    "Lark",
    "Lemur",
    "Leopard",
    "Lion",
    "Llama",
    "Lobster",
    "Locust",
    "Loris",
    "Louse",
    "Lyrebird",
    "Magpie",
    "Mallard",
    "Manatee",
    "Mandrill",
    "Mantis",
    "Marten",
    "Meerkat",
    "Mink",
    "Mole",
    "Mongoose",
    "Monkey",
    "Moose",
    "Mosquito",
    "Mouse",
    "Mule",
    "Narwhal",
    "Newt",
    "Nightingale",
    "Octopus",
    "Okapi",
    "Opossum",
    "Oryx",
    "Ostrich",
    "Otter",
    "Owl",
    "Oyster",
    "Panther",
    "Parrot",
    "Partridge",
    "Peafowl",
    "Pelican",
    "Penguin",
    "Pheasant",
    "Pig",
    "Pigeon",
    "Pony",
    "Porcupine",
    "Porpoise",
    "Quail",
    "Quetzal",
    "Rabbit",
    "Raccoon",
    "Rail",
    "Ram",
    "Rat",
    "Raven",
    "Red deer",
    "Red panda",
    "Reindeer",
    "Rhinoceros",
    "Rook",
    "Salamander",
    "Salmon",
    "Sand Dollar",
    "Sandpiper",
    "Sardine",
    "Scorpion",
    "Seahorse",
    "Seal",
    "Shark",
    "Sheep",
    "Shrew",
    "Skunk",
    "Snail",
    "Snake",
    "Sparrow",
    "Spider",
    "Spoonbill",
    "Squid",
    "Squirrel",
    "Starling",
    "Stingray",
    "Stinkbug",
    "Stork",
    "Swallow",
    "Swan",
    "Tapir",
    "Tarsier",
    "Termite",
    "Tiger",
    "Toad",
    "Trout",
    "Turkey",
    "Turtle",
    "Viper",
    "Vulture",
    "Wallaby",
    "Walrus",
    "Wasp",
    "Weasel",
    "Whale",
    "Wildcat",
    "Wolf",
    "Wolverine",
    "Wombat",
    "Woodcock",
    "Woodpecker",
    "Worm",
    "Wren",
    "Yak",
    "Zebra"
]
const random = function() {
    return Math.floor(Math.random() * (words.length - 1 + 1) + 1);
}
const getWords = function(){
    let randomWords = [];
    for(let i=0;i<3;i++){
        const index = random()

        randomWords.push(words[index])
    }
    
    return randomWords
}

export default words
export { getWords }
