/**
 * Sample data for local development. Tours reuse the course photos in
 * public/img/tours (tour-<n>-*.jpg); all copy, people and coordinates here
 * are written for this repo. People are fictional.
 */

const PASSWORD = 'test1234';

// photo: public/img/users/<file>
const users = [
  { key: 'admin', name: 'Ava Admin', email: 'admin@natours.io', role: 'admin', photo: 'user-1.jpg' },
  { key: 'demo', name: 'Demo Traveller', email: 'demo@natours.io', role: 'user', photo: 'user-2.jpg' },

  { key: 'lg1', name: 'Miyah Myles', email: 'miyah@natours.io', role: 'lead-guide', photo: 'user-3.jpg' },
  { key: 'lg2', name: 'Lourdes Browning', email: 'lourdes@natours.io', role: 'lead-guide', photo: 'user-4.jpg' },
  { key: 'lg3', name: 'Steve T. Scaife', email: 'steve@natours.io', role: 'lead-guide', photo: 'user-5.jpg' },
  { key: 'g1', name: 'Kate Morrison', email: 'kate@natours.io', role: 'guide', photo: 'user-6.jpg' },
  { key: 'g2', name: 'Aarav Lynn', email: 'aarav@natours.io', role: 'guide', photo: 'user-7.jpg' },
  { key: 'g3', name: 'Jennifer Hardy', email: 'jennifer@natours.io', role: 'guide', photo: 'user-8.jpg' },
  { key: 'g4', name: 'Leo Gillespie', email: 'leo@natours.io', role: 'guide', photo: 'user-9.jpg' },

  { key: 'u1', name: 'Sophie Louise Hart', email: 'sophie@example.com', role: 'user', photo: 'user-10.jpg' },
  { key: 'u2', name: 'Cristian Vega', email: 'cristian@example.com', role: 'user', photo: 'user-11.jpg' },
  { key: 'u3', name: 'Laura Wilson', email: 'laura@example.com', role: 'user', photo: 'user-12.jpg' },
  { key: 'u4', name: 'Ben Hadley', email: 'ben@example.com', role: 'user', photo: 'user-13.jpg' },
  { key: 'u5', name: 'Alexander Jones', email: 'alex@example.com', role: 'user', photo: 'user-14.jpg' },
  { key: 'u6', name: 'Ayla Cornell', email: 'ayla@example.com', role: 'user', photo: 'user-15.jpg' },
  { key: 'u7', name: 'Chris Ellis', email: 'chris@example.com', role: 'user', photo: 'user-16.jpg' },
  { key: 'u8', name: 'Eliana Stout', email: 'eliana@example.com', role: 'user', photo: 'user-17.jpg' },
  { key: 'u9', name: 'Cody Winters', email: 'cody@example.com', role: 'user', photo: 'user-18.jpg' },
  { key: 'u10', name: 'Isabel Nunez', email: 'isabel@example.com', role: 'user', photo: 'user-19.jpg' },
  { key: 'u11', name: 'Max Carlson', email: 'max@example.com', role: 'user', photo: 'user-20.jpg' }
];

// coordinates are [lng, lat] (GeoJSON order)
const tours = [
  {
    n: 1,
    name: 'The Forest Hiker',
    duration: 5,
    maxGroupSize: 25,
    difficulty: 'easy',
    price: 397,
    summary: 'Breathtaking hike through the Canadian Banff National Park',
    description:
      'Five unhurried days on the trails of Banff, from turquoise glacial lakes to quiet larch forests. Each day covers 8–14 km with plenty of time for photos, picnics and wildlife spotting.\nNights are spent in a cosy mountain lodge with home-cooked dinners, and a certified guide leads every hike, so it is a great first multi-day adventure.',
    startDates: ['2026-11-21', '2027-04-18', '2027-07-12'],
    startLocation: { coordinates: [-115.570154, 51.178456], address: '224 Banff Ave, Banff, AB, Canada', description: 'Banff, CAN' },
    locations: [
      { coordinates: [-116.214531, 51.417611], description: 'Lake Louise', day: 1 },
      { coordinates: [-116.186722, 51.321742], description: 'Moraine Lake', day: 3 },
      { coordinates: [-117.490309, 51.261937], description: 'Rogers Pass', day: 5 }
    ],
    guides: ['lg1', 'g1']
  },
  {
    n: 2,
    name: 'The Sea Explorer',
    duration: 7,
    maxGroupSize: 15,
    difficulty: 'medium',
    price: 497,
    priceDiscount: 447,
    summary: 'Exploring the jaw-dropping US east coast by foot and by boat',
    description:
      'A week along Florida’s coast: kayak through mangrove tunnels, snorkel a living reef in the Keys and watch the sunset from a sailboat off Key West.\nYou will need to be comfortable in the water; everything else (gear, boats, permits and local guides) is taken care of.',
    startDates: ['2026-12-05', '2027-03-20', '2027-06-14'],
    startLocation: { coordinates: [-80.185942, 25.774772], address: '301 Biscayne Blvd, Miami, FL, USA', description: 'Miami, USA' },
    locations: [
      { coordinates: [-80.128473, 25.781842], description: 'Miami Beach', day: 1 },
      { coordinates: [-80.647885, 24.909047], description: 'Islamorada', day: 3 },
      { coordinates: [-81.0784, 24.707496], description: 'Marathon', day: 5 },
      { coordinates: [-81.768719, 24.552242], description: 'Key West', day: 7 }
    ],
    guides: ['lg2', 'g2']
  },
  {
    n: 3,
    name: 'The Snow Adventurer',
    duration: 4,
    maxGroupSize: 10,
    difficulty: 'difficult',
    price: 997,
    summary: 'Exciting adventure in the snow with snowboarding and skiing',
    description:
      'Four high-energy days in the Colorado Rockies: backcountry skiing, a snowboard clinic with pro instructors and a sunrise snowshoe climb.\nSmall groups keep the pace right for confident intermediate skiers and above. All avalanche safety gear is included.',
    startDates: ['2027-01-05', '2027-02-12', '2027-12-10'],
    startLocation: { coordinates: [-106.822318, 39.190872], address: '419 S Mill St, Aspen, CO, USA', description: 'Aspen, USA' },
    locations: [
      { coordinates: [-106.855385, 39.182677], description: 'Aspen Highlands', day: 1 },
      { coordinates: [-106.516623, 39.60499], description: 'Beaver Creek', day: 3 }
    ],
    guides: ['lg3', 'g3']
  },
  {
    n: 4,
    name: 'The City Wanderer',
    duration: 9,
    maxGroupSize: 20,
    difficulty: 'easy',
    price: 1197,
    summary: "Discover the city's hidden gems on foot, by bike and by ferry",
    description:
      'Nine days exploring New York the way locals do: food markets in Queens, street art in Bushwick, sunrise on the Brooklyn Bridge and a ferry hop out to the islands.\nExpect a mix of guided walks and free afternoons, with a comfortable Manhattan hotel as your base.',
    startDates: ['2027-03-11', '2027-05-02', '2027-09-15'],
    startLocation: { coordinates: [-73.985141, 40.75894], address: 'Manhattan, New York, NY, USA', description: 'NYC, USA' },
    locations: [
      { coordinates: [-73.967696, 40.781821], description: 'Central Park', day: 1 },
      { coordinates: [-73.990682, 40.702867], description: 'Brooklyn Bridge Park', day: 3 },
      { coordinates: [-74.044502, 40.689247], description: 'Statue of Liberty', day: 6 },
      { coordinates: [-73.878305, 40.753564], description: 'Jackson Heights, Queens', day: 8 }
    ],
    guides: ['lg1', 'g2', 'g4']
  },
  {
    n: 5,
    name: 'The Park Camper',
    duration: 10,
    maxGroupSize: 15,
    difficulty: 'medium',
    price: 1497,
    summary: 'Breathing in nature in America’s most spectacular national parks',
    description:
      'Ten days, three legendary parks. Camp under the granite walls of Yosemite, walk among the giant sequoias and end at the edge of the Grand Canyon.\nAll camping gear, park fees and meals are included; you bring a sleeping bag and a sense of adventure.',
    startDates: ['2027-06-19', '2027-07-20', '2027-08-18'],
    startLocation: { coordinates: [-119.538329, 37.865101], address: 'Yosemite Valley, CA, USA', description: 'Yosemite, USA' },
    locations: [
      { coordinates: [-119.538329, 37.865101], description: 'Yosemite Valley', day: 1 },
      { coordinates: [-118.751414, 36.564779], description: 'Sequoia National Park', day: 4 },
      { coordinates: [-112.112999, 36.056198], description: 'Grand Canyon South Rim', day: 8 }
    ],
    guides: ['lg2', 'g1', 'g3']
  },
  {
    n: 6,
    name: 'The Sports Lover',
    duration: 14,
    maxGroupSize: 8,
    difficulty: 'difficult',
    price: 2997,
    summary: 'Surfing, skating, parajumping, rock climbing and more, all in one tour',
    description:
      'Two weeks of pure adrenaline down the California coast: surf lessons in Santa Cruz, climbing in Joshua Tree, a tandem skydive over San Diego and more.\nThis tour is for fit, experienced adventurers; certified instructors and every piece of equipment are included.',
    startDates: ['2027-07-19', '2027-09-06', '2028-03-18'],
    startLocation: { coordinates: [-118.803461, 34.006072], address: 'Malibu, CA, USA', description: 'California, USA' },
    locations: [
      { coordinates: [-122.030796, 36.974117], description: 'Santa Cruz', day: 1 },
      { coordinates: [-116.166868, 33.873415], description: 'Joshua Tree', day: 6 },
      { coordinates: [-117.161084, 32.715738], description: 'San Diego', day: 12 }
    ],
    guides: ['lg3', 'g4']
  },
  {
    n: 7,
    name: 'The Wine Taster',
    duration: 5,
    maxGroupSize: 8,
    difficulty: 'easy',
    price: 1997,
    summary: 'Exquisite wines, scenic views and exclusive barrel tastings',
    description:
      'Five relaxed days in Napa and Sonoma with private barrel tastings, a vineyard picnic and a hot-air balloon ride at dawn.\nEvenings are spent at a boutique inn with a chef-led dinner, and a driver is always on hand, so there is no need to plan who stays sober.',
    startDates: ['2027-02-12', '2027-04-14', '2027-09-01'],
    startLocation: { coordinates: [-122.286865, 38.297539], address: 'Napa, CA, USA', description: 'Napa, USA' },
    locations: [
      { coordinates: [-122.399677, 38.401733], description: 'Yountville', day: 1 },
      { coordinates: [-122.458036, 38.291859], description: 'Sonoma', day: 3 },
      { coordinates: [-122.579432, 38.578757], description: 'Calistoga', day: 5 }
    ],
    guides: ['lg1', 'g3']
  },
  {
    n: 8,
    name: 'The Star Gazer',
    duration: 9,
    maxGroupSize: 8,
    difficulty: 'medium',
    price: 1597,
    priceDiscount: 1397,
    summary: 'The most remote and stunning dark-sky places in the world',
    description:
      'Nine nights under some of the darkest skies on the planet, from Death Valley to the canyons of southern Utah.\nAn astronomer joins the group with a portable observatory, and days are spent on easy desert hikes and slow mornings.',
    startDates: ['2027-03-23', '2027-10-25', '2028-01-30'],
    startLocation: { coordinates: [-115.172652, 36.110904], address: 'Las Vegas, NV, USA', description: 'Las Vegas, USA' },
    locations: [
      { coordinates: [-116.933325, 36.505389], description: 'Death Valley', day: 1 },
      { coordinates: [-112.170305, 37.593038], description: 'Bryce Canyon', day: 4 },
      { coordinates: [-111.00082, 38.28634], description: 'Capitol Reef', day: 7 }
    ],
    guides: ['lg2', 'g2']
  },
  {
    n: 9,
    name: 'The Northern Lights',
    duration: 3,
    maxGroupSize: 12,
    difficulty: 'easy',
    price: 1497,
    summary: 'Enjoy the Northern Lights in one of the best places in the world',
    description:
      'Three nights in Iceland timed for the aurora season: geothermal lagoons, black-sand beaches and northern-lights hunts led by local experts who know where the skies will be clear.\nIt is a short trip that is easy to add to a longer holiday, with warm clothing provided for the night excursions.',
    startDates: ['2026-12-16', '2027-01-16', '2027-12-12'],
    startLocation: { coordinates: [-21.942432, 64.146582], address: 'Reykjavík, Iceland', description: 'Reykjavík, ISL' },
    locations: [
      { coordinates: [-22.449382, 63.880409], description: 'Blue Lagoon', day: 1 },
      { coordinates: [-19.042869, 63.401918], description: 'Reynisfjara Beach', day: 2 },
      { coordinates: [-20.121327, 64.255246], description: 'Þingvellir National Park', day: 3 }
    ],
    guides: ['lg3', 'g1']
  }
];

// [userKey, tourN, rating, text] — every reviewer is also given a booking.
const reviews = [
  ['u1', 1, 5, 'Lake Louise at sunrise was unreal. Miyah knew every trail and every bird call.'],
  ['u2', 1, 5, 'Perfect pace for a first multi-day hike. The lodge dinners were a highlight.'],
  ['u3', 1, 4, 'Beautiful scenery, a bit chilly in the mornings, so bring layers!'],
  ['u4', 2, 5, 'Snorkelling the reef off Islamorada was the best day of my year.'],
  ['u5', 2, 4, 'Great mix of kayaking and sailing. Key West sunset cruise was magic.'],
  ['u6', 3, 5, 'Challenging and absolutely worth it. The avalanche training was top-notch.'],
  ['u7', 3, 4, 'Tough days on the slopes, but the small group made it feel personal.'],
  ['u8', 4, 5, 'I have been to NYC before but never like this. The Queens food tour!'],
  ['u9', 4, 4, 'Loved the free afternoons. Good balance of guided and solo time.'],
  ['u10', 4, 5, 'Sunrise on the Brooklyn Bridge with no crowds, worth the early alarm.'],
  ['u11', 5, 5, 'Sleeping under Half Dome is something I will never forget.'],
  ['u1', 5, 4, 'Very well organised camping. Sequoias are even bigger than you imagine.'],
  ['u2', 6, 5, 'The skydive over San Diego topped off two weeks of pure adrenaline.'],
  ['u3', 7, 5, 'Balloon ride over the vineyards at dawn, simply stunning.'],
  ['u4', 7, 5, 'Every tasting felt exclusive. Fantastic food and wine throughout.'],
  ['u5', 8, 5, 'Never seen so many stars. The astronomer made it fascinating.'],
  ['u6', 8, 4, 'Remote and peaceful. Bryce Canyon at night is otherworldly.'],
  ['u7', 9, 5, 'We saw the aurora two nights out of three! Guides were brilliant.'],
  ['u8', 9, 4, 'Short but packed. Reynisfjara was wild and beautiful.']
];

// Extra bookings without reviews (so "My bookings" isn't empty for the demo user)
const bookings = [
  ['demo', 1],
  ['demo', 9]
];

module.exports = { PASSWORD, users, tours, reviews, bookings };
