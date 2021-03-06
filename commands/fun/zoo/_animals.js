module.exports = {
  ANIMALS: [
    "dog",
    "cat",
    "mouse",
    "hamster",
    "rabbit",
    "fox",
    "bear",
    "panda_face",
    "polar_bear",
    "koala",
    "tiger",
    "lion_face",
    "cow",
    "pig",
    "frog",
    "monkey_face",
    "chicken",
    "penguin",
    "bird",
    "baby_chick",
    "duck",
    "dodo",
    "eagle",
    "owl",
    "bat",
    "boar",
    "horse",
    "unicorn",
    "bee",
    "bug",
    "butterfly",
    "snail",
    "worm",
    "lady_beetle",
    "ant",
    "fly",
    "mosquito",
    "cockroach",
    "beetle",
    "cricket",
    "spider",
    "scorpion",
    "turtle",
    "snake",
    "lizard",
    "t_rex",
    "sauropod",
    "octopus",
    "squid",
    "shrimp",
    "lobster",
    "crab",
    "blowfish",
    "tropical_fish",
  ],
  displayName(name) {
    name = name.replace(/_face/g, "").replace(/_/g, " ");
    return name.charAt(0).toUpperCase() + name.slice(1);
  },
};
