-- PandalPass: expanded Kolkata Durga Puja demo seed data
-- MySQL 8 / Aiven
-- Replaces ALL existing content rows. Intentionally preserves `users` and user accounts.
-- Crowd, coordinates, route estimates, prices and fictional food vendors are synthetic demo data.
-- Real pandal names and selected 2026 themes/awards are based on public 2026 listings.
-- Run: mysql -h HOST -u USER -p DATABASE < pandalpass_seed_2026.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;
START TRANSACTION;

-- Clear dependent rows first. Do not delete or modify `users`.
DELETE FROM pandal_tags;
DELETE FROM pandals;
DELETE FROM starts;
DELETE FROM foods;
DELETE FROM vibes;
DELETE FROM time_options;
DELETE FROM travel_modes;
DELETE FROM map_areas;
DELETE FROM settings;

INSERT INTO pandals (id, name, area, tagline, crowd, x, y) VALUES
(1,'Tala Prattoy','Tala','Contemporary installation-led storytelling','heavy',170,42),
(2,'Tala Barowari Durgotsab Samity','Tala','Heritage-inspired Durgabari presentation','moderate',198,62),
(3,'Kumartuli Park Sarbojanin','Kumartuli','Riverine heritage and artisan craft','heavy',188,100),
(4,'Kumartuli Sarbojanin','Kumartuli','Traditional idol-making neighbourhood spirit','moderate',155,125),
(5,'Ahiritola Sarbojanin','Ahiritola','Expressive traditional sculpture by the river','heavy',125,145),
(6,'Bagbazar Sarbojanin','Bagbazar','Classic North Kolkata community puja','heavy',92,112),
(7,'Jagat Mukherjee Park','Bagbazar','Old-para character and intimate artistry','moderate',110,85),
(8,'Sovabazar Rajbari','Shobhabazar','Historic bonedi bari worship and heritage','low',145,72),
(9,'Hatibagan Sarbojanin','Hatibagan','Heritage lanes with a high-energy evening','heavy',220,120),
(10,'Hatibagan Nabin Pally','Hatibagan','Creative neighbourhood spectacle','heavy',245,145),
(11,'Nalin Sarkar Street Durgotsav','Shyambazar','Bold contemporary theme and local warmth','moderate',205,92),
(12,'Kashi Bose Lane Durga Puja','Hedua','Art-forward community celebration','moderate',230,175),
(13,'Sikdar Bagan Sadharan Durgotsab','Shyambazar','Classic North Kolkata pandal hopping','heavy',185,150),
(14,'Manicktala Chaltabagan Lohapatty','Manicktala','Craft-led storytelling and intricate detail','heavy',285,190),
(15,'Chorbagan Sarbojanin Durgotsab','Jorasanko','Heritage architecture and thoughtful design','moderate',255,220),
(16,'College Square Sarbojanin','College Street','Iconic lakeside reflections and classic idol','heavy',185,255),
(17,'Mohammad Ali Park','Central Kolkata','Grand traditional scale and festive energy','heavy',225,275),
(18,'Santosh Mitra Square','Bowbazar','2026 Serar Sera winner; Vande Mataram theme','heavy',260,305),
(19,'Taltala Sarbojanin','Taltala','Central Kolkata tradition and evening buzz','moderate',290,330),
(20,'Sealdah Athletic Club','Sealdah','Urban craft, lighting and community spirit','moderate',330,285),
(21,'Beliaghata 33 Pally','Beliaghata','Neighbourhood artistry and lively evenings','moderate',390,285),
(22,'Sreebhumi Sporting Club','Lake Town','Large-scale immersive themed presentation','heavy',470,95),
(23,'Dum Dum Park Bharat Chakra','Dum Dum Park','Conceptual storytelling and detailed craft','heavy',420,125),
(24,'Dum Dum Park Tarun Sangha','Dum Dum Park','Folk-art influences and community energy','moderate',445,155),
(25,'FD Block Sarbojanin','Salt Lake Sector I','Open avenues, light art and family-friendly visit','moderate',475,230),
(26,'Baisakhi Abasik Brinda','Salt Lake Sector I','Neighbourhood celebration with a relaxed pace','low',510,205),
(27,'AJ Block Sarbojanin','Salt Lake Sector II','Community-led contemporary presentation','low',535,255),
(28,'GD Block Sarbojanin','Salt Lake Sector III','Spacious family circuit and festive lighting','moderate',555,300),
(29,'Suruchi Sangha','New Alipore','Elegant artistic presentation and refined craft','heavy',105,365),
(30,'Alipore Sarbojanin','Alipore','Narrative-driven theme and neighbourhood charm','moderate',145,335),
(31,'Chetla Agrani Club','Chetla','Riverside ritual and ambitious design','heavy',185,395),
(32,'Badamtala Ashar Sangha','Kalighat','Award-winning theme-puja tradition','heavy',230,385),
(33,'66 Pally Sarbojanin Durgotsab','Kalighat','Popular south Kolkata evening stop','heavy',265,355),
(34,'Mudiali Club','Lake Gardens','2026 best-idol recognition; folklore of heritage','moderate',160,435),
(35,'Shibmandir Sarbojanin','Lake Gardens','Luminous installation and thoughtful craft','moderate',195,460),
(36,'Deshapriya Park Durgotsab','Deshapriya Park','Large-scale spectacle and iconic south circuit','heavy',305,355),
(37,'Ekdalia Evergreen Club','Ballygunge','Traditional artistry with a celebrated legacy','heavy',355,365),
(38,'Singhi Park Sarbojanin','Ballygunge','Crowd-favourite theme and high-energy ambience','heavy',390,395),
(39,'Ballygunge Cultural Association','Ballygunge','Elegant traditional presentation','moderate',345,425),
(40,'Maddox Square','Ballygunge','Open maidan atmosphere and classic community puja','moderate',315,455),
(41,'Hindustan Club','Gariahat','Bold thematic presentation near the shopping belt','heavy',420,345),
(42,'Tridhara Sammilani','Rashbehari','Large-format theme puja and artistic detailing','heavy',275,420),
(43,'Jodhpur Park 95 Pally','Jodhpur Park','Immersive theme and strong neighbourhood identity','heavy',360,485),
(44,'Bosepukur Sitala Mandir','Kasba','Experimental art and contemporary storytelling','moderate',445,445),
(45,'Santoshpur Lake Pally','Santoshpur','Lakeside neighbourhood celebration','moderate',505,420),
(46,'Naktala Udayan Sangha','Naktala','Dhaak, dance and vibrant south-east circuit','heavy',455,515),
(47,'Naba Durga','Garia','Emerging south-east destination and community craft','moderate',520,485),
(48,'Behala Nutan Dal','Behala','Traditional artistry and family-friendly lanes','moderate',70,470),
(49,'Behala Friends','Behala','Community warmth and creative installations','low',105,500),
(50,'Barisha Club','Barisha','South-west heritage and neighbourhood pride','moderate',40,525),
(51,'25 Pally Club','Khidirpur','2026 best-pandal recognition for pavilion design','heavy',190,300),
(52,'Santoshpur Avenue South','Santoshpur','2026 best-lighting recognition','moderate',545,455),
(53,'Brindaban Garden Durgapuja Samity','North Kolkata','2026 Serar Sera runner-up; immersive thematic layout','moderate',305,85),
(54,'Ahiritola 20 Pally','Ahiritola','Local craft and a compact heritage-lane visit','moderate',95,175),
(55,'Naba Bagbazar Sarbojanin','Bagbazar','Neighbourhood tradition and family-friendly visit','low',65,90),
(56,'Rajdanga Naba Uday Sangha','Kasba','Contemporary theme and south-east circuit','moderate',475,390);

INSERT INTO pandal_tags (pandal_id, tag, position) VALUES
(1,'insta',0),(1,'iconic',1),(1,'energy',2),
(2,'family',0),(2,'iconic',1),
(3,'iconic',0),(3,'insta',1),(3,'family',2),
(4,'family',0),(4,'quiet',1),
(5,'iconic',0),(5,'insta',1),
(6,'iconic',0),(6,'family',1),(6,'energy',2),
(7,'quiet',0),(7,'family',1),
(8,'quiet',0),(8,'family',1),
(9,'iconic',0),(9,'energy',1),
(10,'insta',0),(10,'energy',1),
(11,'insta',0),(11,'iconic',1),
(12,'family',0),(12,'insta',1),
(13,'iconic',0),(13,'energy',1),
(14,'iconic',0),(14,'insta',1),(14,'energy',2),
(15,'quiet',0),(15,'iconic',1),
(16,'iconic',0),(16,'family',1),(16,'insta',2),
(17,'iconic',0),(17,'energy',1),
(18,'iconic',0),(18,'insta',1),(18,'energy',2),
(19,'family',0),(19,'quiet',1),
(20,'family',0),(20,'insta',1),
(21,'family',0),(21,'quiet',1),
(22,'iconic',0),(22,'insta',1),(22,'energy',2),
(23,'insta',0),(23,'iconic',1),
(24,'family',0),(24,'energy',1),
(25,'family',0),(25,'insta',1),
(26,'quiet',0),(26,'family',1),
(27,'quiet',0),(27,'family',1),
(28,'family',0),(28,'insta',1),
(29,'iconic',0),(29,'insta',1),
(30,'family',0),(30,'quiet',1),
(31,'iconic',0),(31,'insta',1),(31,'energy',2),
(32,'iconic',0),(32,'insta',1),
(33,'iconic',0),(33,'energy',1),
(34,'iconic',0),(34,'family',1),
(35,'quiet',0),(35,'insta',1),
(36,'iconic',0),(36,'energy',1),(36,'insta',2),
(37,'iconic',0),(37,'family',1),
(38,'iconic',0),(38,'energy',1),(38,'insta',2),
(39,'family',0),(39,'iconic',1),
(40,'family',0),(40,'quiet',1),
(41,'iconic',0),(41,'energy',1),
(42,'iconic',0),(42,'insta',1),(42,'energy',2),
(43,'insta',0),(43,'iconic',1),
(44,'insta',0),(44,'family',1),
(45,'quiet',0),(45,'family',1),
(46,'energy',0),(46,'family',1),
(47,'family',0),(47,'insta',1),
(48,'family',0),(48,'quiet',1),
(49,'quiet',0),(49,'family',1),
(50,'family',0),(50,'quiet',1),
(51,'iconic',0),(51,'insta',1),
(52,'insta',0),(52,'family',1),
(53,'iconic',0),(53,'insta',1),
(54,'family',0),(54,'quiet',1),
(55,'quiet',0),(55,'family',1),
(56,'insta',0),(56,'energy',1);

INSERT INTO starts (name, x, y, position) VALUES
('Barasat',260,18,0),
('Madhyamgram',300,35,1),
('Dum Dum',265,90,2),
('Belgachia',215,85,3),
('Shyambazar',190,125,4),
('Sovabazar',155,105,5),
('Kumartuli',165,145,6),
('Howrah',65,215,7),
('Bidhannagar',420,205,8),
('Salt Lake Sector V',500,255,9),
('New Town',565,145,10),
('Esplanade',245,285,11),
('Sealdah',330,270,12),
('Park Street',290,330,13),
('Park Circus',355,320,14),
('Gariahat',385,395,15),
('Ballygunge',340,420,16),
('Tollygunge',220,475,17),
('New Alipore',130,385,18),
('Behala',55,495,19),
('Joka',25,545,20),
('Garia',500,520,21),
('Jadavpur',395,490,22),
('Howrah Maidan',45,255,23);

INSERT INTO foods (id, icon, name, kind, area, price, position) VALUES
('bhog-bari','cookingPot','Annapurna Bhog Counter','Khichuri, labra, beguni, chutney and payesh','Kumartuli',160,0),
('phuchka-lab','soup','Phuchka Lab','Aloo-masala phuchka, tok jol and doi phuchka','College Street',80,1),
('telebhaja-club','utensils','Telebhaja Club','Beguni, peyaji, fuluri and kasundi','Shyambazar',70,2),
('roll-karkhana','sandwich','Roll Karkhana','Egg roll, double egg chicken roll and paneer roll','Park Circus',130,3),
('kathi-corner','sandwich','Kathi Corner 24','Classic chicken, egg and aloo kathi rolls','Esplanade',120,4),
('mishti-lab','cakeSlice','Mishti Lab','Nolen gur sandesh, baked rosogolla and mishti doi','Gariahat',150,5),
('bengal-thala','fish','Bangla Thala Ghar','Rice, shukto, dal, seasonal bhaja and fish curry','Ballygunge',290,6),
('mughlai-adda','cookingPot','Mughlai Adda','Mughlai paratha, chicken stew and alur dom','College Street',180,7),
('tangra-wok','utensils','Tangra Wok Stop','Chilli chicken, hakka noodles and fried rice','Tangra',220,8),
('cha-cutlet','coffee','Cha & Cutlet Adda','Bengali fish fry, chicken cutlet and milk tea','Salt Lake',110,9),
('biriyani-bucket','cookingPot','Kolkata Biriyani House','Aromatic biriyani, aloo, egg and chicken chaap','Park Circus',240,10),
('ghugni-gully','soup','Ghugni Gully','Gorom ghugni, chopped onion, green chilli and toast','Bagbazar',55,11),
('luchi-alurdom','cookingPot','Luchi Alur Dom Stop','Koraishutir kochuri, luchi and alur dom','Hatibagan',100,12),
('dimer-devil','utensils','Dimer Devil Point','Kolkata-style egg devil and kasundi','Lake Town',90,13),
('momo-mela','utensils','Momo Mela','Steamed, pan-fried and spicy kurkure momos','Dum Dum',130,14),
('chowmein-chowk','utensils','Chowmein Chowk','Street-style chowmein and chilli paneer','Lake Town',140,15),
('ice-cream-rickshaw','iceCream','Kulfi Cart','Matka kulfi, kesar pista and malai kulfi','Deshapriya Park',70,16),
('jalebi-junction','cakeSlice','Jalebi Junction','Hot jalebi, rabri and malpua','Kalighat',90,17),
('puchka-princep','soup','Puchka & Chaat Express','Phuchka, papri chaat and aloo kabli','Maidan',85,18),
('south-snackbox','sandwich','Southside Snackbox','Chicken pakora, veg chop and lemon soda','Tollygunge',100,19),
('fish-fry-factory','fish','Fish Fry Factory','Bhetki fry, fish fingers and kasundi','Behala',190,20),
('doi-fuchka','soup','Doi Phuchka House','Doi phuchka, dahi bara and sweet chutney','Garia',100,21),
('pithe-puli','cakeSlice','Pithe Puli Corner','Patishapta, gokul pithe and coconut naru','New Alipore',120,22),
('sherbet-station','coffee','Nimbu Soda Station','Fresh lime soda, aam panna and gondhoraj sherbet','Ballygunge',50,23),
('kebab-kiosk','utensils','Kebab Kiosk','Chicken tikka, seekh kebab and roomali roti','Park Circus',220,24),
('bhapa-pitha-cart','cakeSlice','Bhapa Pitha Cart','Steamed rice cakes with coconut and date jaggery','Behala',60,25),
('churmur-chowk','soup','Churmur Chowk','Churmur, aloo kabli and tok doi chaat','Gariahat',70,26),
('coffee-cabin','coffee','Coffee Cabin','Cold coffee, hot chocolate and quick sandwiches','Salt Lake',130,27),
('roll-and-rice','sandwich','Roll & Rice Kitchen','Paneer roll, egg roll and fried rice bowls','New Town',160,28),
('sweet-bengal','cakeSlice','Sweet Bengal Cart','Rosogolla, chomchom, mihidana and kesar doi','Esplanade',100,29);

INSERT INTO vibes (id, icon, label, position) VALUES
('iconic','star','Must-see landmarks',0),
('insta','camera','Photogenic installations',1),
('quiet','leaf','Lower-crowd and relaxed',2),
('family','users','Family-friendly stops',3),
('energy','zap','High-energy festival atmosphere',4);

INSERT INTO time_options (hours, count) VALUES
(2,2),(3,2),(4,3),(5,4),(6,5),(7,5),(8,6),(10,7),(12,8);

INSERT INTO travel_modes (id, icon, label, position) VALUES
('metro','train','Metro-first route',0),
('auto_metro','bus','Auto + Metro combination',1),
('walk','footprints','Walking-focused local circuit',2),
('cab','car','Cab-friendly point-to-point',3);

INSERT INTO map_areas (label, x, y, position) VALUES
('Tala and Belgachia',175,35,0),
('Dum Dum and Lake Town',455,85,1),
('Kumartuli and Ahiritola',125,125,2),
('Bagbazar and Shobhabazar',85,95,3),
('Hatibagan and Shyambazar',220,135,4),
('Manicktala and Ultadanga',300,185,5),
('College Street and Sealdah',270,260,6),
('Bowbazar and Central Kolkata',250,305,7),
('Esplanade and Maidan',220,345,8),
('Salt Lake Sector I',475,215,9),
('Salt Lake Sector II',520,255,10),
('Salt Lake Sector III',555,300,11),
('Ballygunge and Gariahat',370,405,12),
('Kalighat and Rashbehari',270,380,13),
('Lake Gardens and Jodhpur Park',250,465,14),
('New Alipore and Chetla',145,395,15),
('Behala and Barisha',55,505,16),
('Garia and Naktala',490,515,17),
('Kasba and Santoshpur',485,430,18),
('Khidirpur and Alipore',165,300,19),
('Park Circus and Tangra',355,315,20),
('Howrah and Shibpur',45,235,21);

INSERT INTO settings (name, value) VALUES
('site', JSON_OBJECT(
  'name','PandalPass',
  'festival','Durga Pujo 2026',
  'dataMode','synthetic_demo',
  'planningNote','Crowd, coordinates, travel estimates and prices are synthetic planning data; verify on-ground conditions independently.',
  'festivalWindow','2026-10-16 to 2026-10-21',
  'storage',JSON_OBJECT('prefs','pandalpass.prefs','pass','pandalpass.pass')
)),
('defaultPrefs', JSON_OBJECT(
  'start','Shyambazar',
  'vibes',JSON_ARRAY('iconic','insta','family'),
  'hours',6,
  'mode','auto_metro',
  'food',true
)),
('home', JSON_OBJECT(
  'pickIds',JSON_ARRAY(18,3,22,29,32,36,46,51),
  'foodCount',6
)),
('pandalGlyphs',JSON_ARRAY('landmark','flame','flower','palette','sparkles','church','crown')),
('crowdLabels',JSON_OBJECT('low','Relaxed','moderate','Steady','heavy','Very busy')),
('tagLabels',JSON_OBJECT(
  'iconic','Must-see',
  'insta','Photogenic',
  'quiet','Lower crowd',
  'family','Family friendly',
  'energy','High energy'
)),
('engine',JSON_OBJECT(
  'distanceScale',0.045,
  'startClock',1050,
  'stayBase',22,
  'stayStep',3,
  'waitStep',3,
  'minLegMins',5,
  'foodOffset',2,
  'foodWalkMins',9,
  'foodWalkKm',0.7,
  'foodStayMins',38,
  'crowdBase',JSON_OBJECT('low',8,'moderate',19,'heavy',34),
  'travel',JSON_OBJECT(
    'cab',JSON_OBJECT('label','Cab','icon','cab','baseMins',7,'minsPerKm',3.2,'baseCost',70,'costPerKm',19),
    'walk',JSON_OBJECT('label','Walk','icon','walk','maxKm',1.8,'minsPerKm',13,'cost',0),
    'auto',JSON_OBJECT('label','Auto','icon','auto','maxKm',4.5,'baseMins',6,'minsPerKm',3.4,'baseCost',35,'costPerKm',11),
    'metro',JSON_OBJECT('label','Metro + walk','icon','metro','baseMins',11,'minsPerKm',2.8,'walkKm',0.35,'cost',25)
  )
)),
('dataProvenance',JSON_OBJECT(
  'pandalNames','Public Kolkata Durga Puja 2026 directories and award coverage',
  '2026Awards','Telegraph India report dated 2026-10-18',
  'syntheticFields',JSON_ARRAY('crowd','x','y','food vendors','food prices','route engine estimates'),
  'warning','Food entries are fictional demo vendors, not verified businesses. Do not present synthetic crowd estimates as live reports.'
));

COMMIT;
