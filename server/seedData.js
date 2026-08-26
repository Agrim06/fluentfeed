const db = require('./db');
const { calculateDifficulty } = require('./services/difficultyService');

function getPastDates(daysCount = 5) {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const dates = getPastDates(5);

const seedArticles = [
  {
    title: "Next-Generation Autonomous Systems Transform Modern Space Exploration",
    description: "Deep-space robotics and adaptive machine learning models are enabling spacecraft to make critical navigational decisions without terrestrial ground intervention.",
    category: "Technology",
    publishedAt: dates[0],
    source: "TechPulse Global",
    image: "https://images.unsplash.com/photo-1517976487502-5f7994df5686?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/tech/autonomous-systems-space-2026",
    content: `Autonomous systems are rapidly redefining the technological frontier of outer space exploration. For decades, deep-space probes and robotic rovers relied heavily on direct telecommunications with ground control teams stationed on Earth. However, as missions venture further into the solar system, communication latencies—ranging from several minutes to hours—render real-time human intervention virtually impossible during high-stakes maneuvers.

To surmount these formidable challenges, aerospace engineers have developed sophisticated on-board neural networks capable of executing real-time situational awareness, fault detection, and terrain navigation. These autonomous algorithms allow rovers to evaluate jagged topography, calculate optimal traversal routes, and identify geological specimens of high scientific interest with unprecedented efficiency. By analyzing multispectral imagery and sensor telemetry directly on edge-computing hardware, modern spacecraft can avoid catastrophic hazards independently.

Furthermore, autonomous decision-making extends beyond surface navigation to mission-critical trajectory corrections and power optimization. Advanced propulsion systems can now dynamically modulate fuel expenditure based on micro-gravitational variations, ensuring prolonged operational longevity. This technological paradigm shift minimizes human error, lowers operational overhead, and substantially elevates the scientific yield of exploratory voyages.

Industry researchers emphasize that these autonomous breakthroughs will form the foundational infrastructure for future manned missions to Mars and deep lunar habitats. In environments where communication blackouts are frequent, the ability of robotic companions and habitat life-support computers to autonomously stabilize volatile systems is not merely an operational luxury, but an imperative prerequisite for human survival. As machine learning algorithms become more robust and resilient against cosmic radiation, the boundary between human oversight and autonomous stewardship will continue to evolve smoothly.`,
    quizzes: [
      {
        question: "Why has real-time human intervention become impractical for deep-space missions?",
        options: [
          "Extreme communication latency between Earth and distant spacecraft",
          "A complete lack of satellite relay infrastructure on Earth",
          "Strict international regulations banning telecommunications",
          "The inability of earthbound computers to process spacecraft signals"
        ],
        correctAnswer: "Extreme communication latency between Earth and distant spacecraft",
        explanation: "The article highlights that communication latencies ranging from minutes to hours render real-time human commands impossible during critical maneuvers."
      },
      {
        question: "What primary task do onboard neural networks perform on modern planetary rovers?",
        options: [
          "Real-time situational awareness, route optimization, and terrain navigation",
          "Transmitting raw uncompressed radio waves back to terrestrial stations",
          "Replacing physical rover wheels with magnetic levitation devices",
          "Generating artificial gravity within the rover cabin"
        ],
        correctAnswer: "Real-time situational awareness, route optimization, and terrain navigation",
        explanation: "Edge algorithms analyze sensory telemetry to evaluate topography and choose safe travel paths without waiting for human intervention."
      },
      {
        question: "Vocabulary: What is the most accurate synonym for 'surmount' as used in paragraph 2?",
        options: [
          "Overcome",
          "Abandon",
          "Complicate",
          "Postpone"
        ],
        correctAnswer: "Overcome",
        explanation: "'Surmount' means to successfully overcome a difficulty or obstacle."
      },
      {
        question: "How do dynamic propulsion systems enhance mission longevity according to the text?",
        options: [
          "By dynamically modulating fuel consumption based on gravitational variations",
          "By replacing chemical fuel with disposable solar sails exclusively",
          "By shutting down all electrical systems during interplanetary travel",
          "By utilizing gravitational pull from deep space comets"
        ],
        correctAnswer: "By dynamically modulating fuel consumption based on gravitational variations",
        explanation: "Dynamic modulation of propellant based on micro-gravitational fields minimizes waste and preserves fuel reserves."
      }
    ]
  },
  {
    title: "Global Supply Chains Pivot Toward Sustainable Decarbonization Hubs",
    description: "Multinational corporations are restructuring maritime freight routes and industrial warehouses to comply with aggressive net-zero emissions targets.",
    category: "Business",
    publishedAt: dates[0],
    source: "Financial Horizon",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/biz/supply-chains-decarbonization-2026",
    content: `Global logistics and international trade networks are undergoing a profound structural metamorphosis. Spurred by stringent environmental regulations, escalating carbon pricing mechanisms, and heightened consumer awareness, corporate leaders are fundamentally revamping their end-to-end supply chains. The primary focus of this strategic realignment is the transition toward sustainable decarbonization hubs that integrate clean energy, electrified transportation, and circular material flows.

Historically, logistics optimization revolved almost exclusively around cost minimization and rapid turnaround schedules. However, environmental sustainability has swiftly emerged as a core commercial determinant. Major maritime shipping conglomerates are replacing conventional heavy bunker fuel with low-carbon alternatives such as green methanol and liquified e-methane. Concurrently, regional distribution centers are installing colossal rooftop solar arrays and localized battery energy storage systems to achieve complete operational self-sufficiency.

Implementing these eco-friendly transformations requires substantial capital investment and complex logistical synchronization. Enterprises must establish digital traceability systems to monitor Scope 3 carbon emissions across multiple tiers of overseas suppliers. While the initial capital expenditure remains significant, corporate executives report that energy-efficient infrastructure yields substantial long-term operational cost reductions, while safeguarding against punitive regulatory penalties.

Moreover, financial institutions and institutional investors are increasingly tethering corporate lending rates to verified ESG performance metrics. Companies that demonstrate transparent decarbonization milestones enjoy preferential borrowing rates, whereas laggards face steep capital costs and reputational fallout. As sustainable logistics becomes the benchmark of corporate competitiveness, proactive businesses are capturing market share by aligning economic profitability with ecological stewardship.`,
    quizzes: [
      {
        question: "What historical metric previously dictated supply chain optimization before sustainability became paramount?",
        options: [
          "Cost minimization and rapid turnaround times",
          "Strict compliance with zero-waste mandates",
          "Exclusive reliance on domestic rail transit",
          "Total avoidance of maritime freight lanes"
        ],
        correctAnswer: "Cost minimization and rapid turnaround times",
        explanation: "Paragraph 2 states that logistics optimization historically focused almost solely on lowering expenses and speeding up deliveries."
      },
      {
        question: "Which alternative fuels are shipping conglomerates adopting to reduce maritime emissions?",
        options: [
          "Green methanol and liquified e-methane",
          "Standard leaded petroleum and refined coal",
          "Compressed natural air and steam engines",
          "Untreated vegetable oil and kerosene"
        ],
        correctAnswer: "Green methanol and liquified e-methane",
        explanation: "Shipping operators are shifting away from heavy bunker oil to cleaner fuels like green methanol and e-methane."
      },
      {
        question: "Vocabulary: What does the term 'metamorphosis' signify in the context of the opening paragraph?",
        options: [
          "A comprehensive structural transformation",
          "A gradual economic recession",
          "A minor temporary fluctuation",
          "A total abandonment of commercial trade"
        ],
        correctAnswer: "A comprehensive structural transformation",
        explanation: "'Metamorphosis' denotes a striking and complete transformation in structure, form, or character."
      },
      {
        question: "How are financial institutions incentivizing corporate decarbonization according to the article?",
        options: [
          "By linking favorable lending rates to verified ESG metrics",
          "By acquiring controlling equity stakes in logistics companies",
          "By subsidizing the manufacturing of traditional diesel engines",
          "By eliminating all audit requirements for overseas supply chains"
        ],
        correctAnswer: "By linking favorable lending rates to verified ESG metrics",
        explanation: "Financial entities offer preferential borrowing rates to corporations that reach validated emissions reduction targets."
      }
    ]
  },
  {
    title: "International Athletic Federation Adopts Advanced Biometric Recovery Protocols",
    description: "Elite training regimens are embracing micro-sensor analytics and metabolic tracking to prevent injuries and optimize athletic performance.",
    category: "Sports",
    publishedAt: dates[1],
    source: "Athletic Science Review",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/sports/biometric-recovery-protocols-2026",
    content: `The methodology underpinning high-performance sports training is experiencing a scientific revolution. Where athletic excellence was once attributed solely to raw physical discipline and intuitive coaching, elite sports organizations are now deploying cutting-edge biometric analytics. By capturing and parsing physiological data in real time, sports scientists can personalize recovery schedules, eliminate overtraining syndrome, and maximize neuromuscular readiness.

Central to this modern athletic paradigm are non-invasive wearable sensors. These miniature telemetry units monitor continuous heart rate variability, galvanic skin response, intramuscular oxygen saturation, and blood lactate concentration. Rather than relying on subjective athlete feedback, coaching staff can observe precise biochemical markers that signal impending muscle strain or excessive cellular fatigue before clinical injuries manifest.

Recovery protocols have consequently transformed from standardized regimens into highly dynamic interventions. Athletes now utilize precision cryotherapy chambers, adaptive pneumatic compression boots, and targeted sleep architecture modulation tailored to their daily metabolic burn. Nutritionists also leverage instant glucose monitoring to calibrate post-workout carbohydrate replenishment with mathematical accuracy, replenishing glycogen reserves without causing digestive distress.

While sports purists occasionally debate whether excessive data reliance diminishes the spontaneous artistry of competition, sports federations emphasize athlete welfare. Career longevity among elite competitors has increased noticeably, with fewer career-ending soft tissue injuries documented across participating leagues. As biometric technologies advance, the integration of data science and physiological conditioning will remain an indispensable cornerstone of world-class athleticism.`,
    quizzes: [
      {
        question: "What is the primary benefit of tracking real-time biochemical markers in athletes?",
        options: [
          "Detecting cellular fatigue and preventing injuries before they occur",
          "Eliminating the need for physical conditioning altogether",
          "Allowing athletes to bypass anti-doping verification tests",
          "Automating referee decision-making during competitive matches"
        ],
        correctAnswer: "Detecting cellular fatigue and preventing injuries before they occur",
        explanation: "Real-time biometric data allows medical teams to detect excessive fatigue and impending strain before physical injuries take place."
      },
      {
        question: "Which parameters are monitored by the wearable telemetry sensors described in the text?",
        options: [
          "Heart rate variability, skin response, and oxygen saturation",
          "Core body weight and auditory perception levels only",
          "Neurological memory retention and vision acuity",
          "External ambient wind velocity and stadium humidity"
        ],
        correctAnswer: "Heart rate variability, skin response, and oxygen saturation",
        explanation: "Wearable units track heart rate variability, galvanic skin response, intramuscular oxygen saturation, and lactate levels."
      },
      {
        question: "Vocabulary: In paragraph 3, what does 'calibrated' most closely mean?",
        options: [
          "Carefully adjusted and measured with precision",
          "Disregarded and left unmonitored",
          "Hastily gathered without calculation",
          "Exaggerated for dramatic effect"
        ],
        correctAnswer: "Carefully adjusted and measured with precision",
        explanation: "'Calibrate' means to carefully adjust, measure, or standardize against precise parameters."
      },
      {
        question: "What positive outcome has been observed regarding elite athletes' careers?",
        options: [
          "Increased career longevity and fewer severe soft tissue injuries",
          "Universal retirement at a much earlier age",
          "Complete elimination of all coaching personnel",
          "A mandatory reduction in competitive match duration"
        ],
        correctAnswer: "Increased career longevity and fewer severe soft tissue injuries",
        explanation: "The article concludes that data-driven recovery has led to extended careers and fewer career-ending soft tissue injuries."
      }
    ]
  },
  {
    title: "Global Summit Reaches Landmark Accord on Transboundary Water Security",
    description: "Delegates from fifty nations ratify an unprecedented framework to preserve shared freshwater basins and mitigate climate-induced hydrological risks.",
    category: "World",
    publishedAt: dates[1],
    source: "Diplomatic Chronicle",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/world/transboundary-water-summit-2026",
    content: `International diplomacy achieved a historic milestone today as representatives from fifty nations ratified the Global Transboundary Water Management Framework. Negotiated over three arduous years of multilateral deliberations, the treaty establishes binding protocols for the equitable allocation, ecological conservation, and conflict-free stewardship of shared river basins and cross-border aquifers.

Freshwater scarcity has emerged as one of the most volatile geopolitical flashpoints of the twenty-first century. Accelerating climate volatility, prolonged continental droughts, and unregulated upstream dam construction have severely strained diplomatic relations across several major continents. The newly established accord addresses these vulnerabilities by mandating automated hydrological data sharing, mutual environmental impact assessments, and joint watershed restoration initiatives.

A cornerstone provision of the treaty is the creation of the International Water Dispute Tribunal. This permanent judicial body is empowered to arbitrate resource disputes between riparian states before localized tensions escalate into international friction. Furthermore, developed signatories have pledged multi-billion dollar climate resilience funds to assist developing states in constructing modern desalination facilities, wastewater reclamation plants, and drip-irrigation networks.

Environmental activists and policy scholars have lauded the framework as a triumph of proactive diplomacy. By treating freshwater as a shared planetary commons rather than an instrument of geopolitical leverage, the treaty provides a robust blueprint for international cooperation in an era of environmental uncertainty. The international community now turns its focus toward the rigorous implementation and enforcement of the treaty's ambitious mandates.`,
    quizzes: [
      {
        question: "What is the primary objective of the Global Transboundary Water Management Framework?",
        options: [
          "Ensuring equitable allocation and ecological preservation of shared water basins",
          "Privatizing international municipal drinking water supplies",
          "Restricting all scientific access to transboundary river systems",
          "Banning the construction of all modern agricultural irrigation systems"
        ],
        correctAnswer: "Ensuring equitable allocation and ecological preservation of shared water basins",
        explanation: "The treaty sets binding protocols for fair distribution, environmental protection, and peaceful governance of shared freshwater systems."
      },
      {
        question: "What function does the International Water Dispute Tribunal serve under the accord?",
        options: [
          "Arbitrating resource disputes between riparian nations before tensions escalate",
          "Levying punitive trade sanctions on all developing countries",
          "Selling water exploration licenses to private corporations",
          "Managing individual household utility billing globally"
        ],
        correctAnswer: "Arbitrating resource disputes between riparian nations before tensions escalate",
        explanation: "The tribunal acts as an impartial arbitration body to resolve disputes over shared water bodies peacefully."
      },
      {
        question: "Vocabulary: What does the adjective 'arduous' mean in the first paragraph?",
        options: [
          "Extremely difficult and demanding great effort",
          "Quick, effortless, and casual",
          "Boring and totally insignificant",
          "Unplanned and accidental"
        ],
        correctAnswer: "Extremely difficult and demanding great effort",
        explanation: "'Arduous' describes a task or process involving strenuous effort, difficulty, and perseverance."
      },
      {
        question: "How will the climate resilience fund assist developing signatory states?",
        options: [
          "Funding desalination facilities, wastewater reclamation, and drip irrigation",
          "Purchasing fossil fuels for coastal energy plants",
          "Rebuilding industrial coal mines along river banks",
          "Encouraging unregulated upstream river damming"
        ],
        correctAnswer: "Funding desalination facilities, wastewater reclamation, and drip irrigation",
        explanation: "The financial fund supports infrastructure including desalination plants, wastewater treatment, and efficient irrigation."
      }
    ]
  },
  {
    title: "Quantum Cryptography Standards Formally Deployed Across Financial Networks",
    description: "Banking consortiums implement post-quantum encryption protocols to safeguard critical monetary assets against emergent computational threats.",
    category: "Technology",
    publishedAt: dates[2],
    source: "CyberDefense Weekly",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/tech/quantum-cryptography-banking-2026",
    content: `Global financial institutions have officially initiated the rollout of post-quantum cryptography (PQC) across their core transactional backbones. Driven by rapid advancements in quantum computing hardware, cybersecurity authorities warned that standard public-key algorithms, such as RSA and elliptic curve cryptography, could soon become vulnerable to polynomial-time quantum attacks.

To preempt potential catastrophic vulnerabilities, international banking consortiums have collaborated with standards agencies to standardize lattice-based cryptographic algorithms. These mathematical algorithms rely on multi-dimensional geometric lattices that remain computationally intractable for both classical and quantum computers. By updating cryptographic suites across Automated Clearing House networks, interbank wire transfers, and digital payment gateways, institutions ensure long-term transaction integrity.

Transitioning legacy banking mainframes to quantum-resistant standards is a monumental technical undertaking. Financial engineers must carefully balance computational overhead and ciphertext size with real-time throughput requirements. Low-latency payment networks process tens of thousands of transactions per second; any latency introduced by larger cryptographic key sizes must be mitigated through custom hardware acceleration modules.

Security analysts emphasize the urgency of adopting a 'harvest now, decrypt later' defense posture. Hostile actors have reportedly been intercepting and archiving encrypted financial communications with the intention of deciphering them once scalable quantum hardware becomes commercially operational. By encrypting ongoing communications with certified post-quantum algorithms today, banking networks neutralize future interception risks and protect the confidentiality of global financial records.`,
    quizzes: [
      {
        question: "Why are traditional cryptographic methods like RSA vulnerable in the quantum era?",
        options: [
          "Quantum computers can solve underlying mathematical problems in polynomial time",
          "Traditional algorithms require too much electrical power to operate",
          "They are only compatible with obsolete operating systems",
          "They cannot be transmitted through modern fiber-optic cables"
        ],
        correctAnswer: "Quantum computers can solve underlying mathematical problems in polynomial time",
        explanation: "Quantum algorithms can break standard public-key encryption math that classical computers find infeasible."
      },
      {
        question: "What mathematical foundation do the new post-quantum cryptographic standards rely on?",
        options: [
          "Multi-dimensional geometric lattices",
          "Simple single-digit prime factorization",
          "Unencrypted plain text serialization",
          "Random word substitution ciphers"
        ],
        correctAnswer: "Multi-dimensional geometric lattices",
        explanation: "Lattice-based cryptography provides complex mathematical problems that are intractable for quantum computers."
      },
      {
        question: "Vocabulary: What does 'intractable' mean in the second paragraph?",
        options: [
          "Extremely hard or impossible to solve",
          "Easily decoded and understood",
          "Completely transparent and clear",
          "Fast to calculate on simple devices"
        ],
        correctAnswer: "Extremely hard or impossible to solve",
        explanation: "'Intractable' means hard to manage, solve, or manipulate computationally."
      },
      {
        question: "What threat does the 'harvest now, decrypt later' strategy refer to?",
        options: [
          "Adversaries storing encrypted data today to crack when quantum machines mature",
          "Farmers harvesting crops before seasonal storms strike",
          "Banks deleting old financial databases to save storage space",
          "Software developers rewriting code without compiling tests"
        ],
        correctAnswer: "Adversaries storing encrypted data today to crack when quantum machines mature",
        explanation: "Adversaries intercept and save encrypted streams now, waiting for quantum computers to decrypt them later."
      }
    ]
  },
  {
    title: "Venture Capital Flows Rebound Around Artificial Intelligence Infrastructure",
    description: "Private equity firms and angel investors shift capital from consumer software applications toward foundational data center hardware and clean energy grids.",
    category: "Business",
    publishedAt: dates[2],
    source: "Capital Market Insights",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/biz/vc-ai-infrastructure-2026",
    content: `Venture capital investment patterns are experiencing a distinct strategic recalibration. After months of cautious market sentiment and compressed valuations across generic software startups, investment firms are deploying record capital reserves into physical infrastructure. Investors are targeting hardware startups, specialized silicon foundries, advanced liquid cooling systems, and dedicated clean-energy generation facilities essential for sustaining computing workloads.

The exponential escalation in model complexity has precipitated an unprecedented demand for computational energy and specialized silicon chips. General-purpose data centers are struggling to meet the power density and thermal dissipation requirements demanded by next-generation accelerator clusters. Consequently, venture capital syndicates are prioritizing companies developing novel optical interconnects, high-bandwidth memory architectures, and modular nuclear micro-reactors designed to power remote computing facilities off-grid.

This strategic migration toward hard-tech and energy infrastructure reflects a broader recognition that computational capability is fundamentally tethered to physical constraints. While software applications can scale with minimal marginal cost, their underlying execution requires enormous material capital. Founders possessing expertise in semiconductor fabrication, electrical engineering, and thermal physics are receiving premium valuations and competitive term sheets.

Market analysts anticipate that this capital allocation trend will stimulate extensive cross-sector innovation over the coming decade. As energy companies partner directly with compute providers and chip architects, the convergence of physical and digital industries will accelerate. Far from being a speculative frenzy, the focus on foundational infrastructure provides durable support for sustainable technological growth.`,
    quizzes: [
      {
        question: "Where are venture capital firms currently redirecting their investment funds?",
        options: [
          "Physical computing infrastructure, silicon chips, and clean energy",
          "Traditional brick-and-mortar retail stores",
          "Unregulated speculative digital currencies exclusively",
          "Print newspaper publishing companies"
        ],
        correctAnswer: "Physical computing infrastructure, silicon chips, and clean energy",
        explanation: "Capital is shifting from generic software to specialized hardware, cooling, data centers, and dedicated clean power."
      },
      {
        question: "Why are traditional data centers struggling with modern computing workloads?",
        options: [
          "They cannot accommodate the extreme power density and cooling requirements",
          "They are located too close to residential neighborhoods",
          "They lack connectivity to the public internet",
          "Their server racks are physically too small for standard cables"
        ],
        correctAnswer: "They cannot accommodate the extreme power density and cooling requirements",
        explanation: "Modern accelerator clusters produce massive heat and power demand exceeding standard facility limits."
      },
      {
        question: "Vocabulary: What does the word 'recalibration' signify in paragraph 1?",
        options: [
          "A careful change, adjustment, or realignment of direction",
          "A complete cessation of all commercial business",
          "An accidental mistake made during financial auditing",
          "A refusal to participate in negotiations"
        ],
        correctAnswer: "A careful change, adjustment, or realignment of direction",
        explanation: "'Recalibration' means the process of adjusting or re-evaluating something to match new conditions."
      },
      {
        question: "What types of founders are currently commanding premium valuations from investors?",
        options: [
          "Founders with expertise in semiconductors, electrical engineering, and physics",
          "Founders with experience in non-technical social media marketing",
          "Founders who avoid using physical computer hardware",
          "Founders focused solely on basic consumer coupon apps"
        ],
        correctAnswer: "Founders with expertise in semiconductors, electrical engineering, and physics",
        explanation: "Investors value hard-tech talent in silicon fabrication, electrical systems, and thermal dynamics."
      }
    ]
  },
  {
    title: "Youth Academy Revolution Propels Unheralded Team to Continental Championship",
    description: "A disciplined commitment to grassroots player development and tactical agility produces one of the most stunning underdog victories in soccer history.",
    category: "Sports",
    publishedAt: dates[3],
    source: "Global Football Digest",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/sports/youth-academy-continental-championship-2026",
    content: `In an era dominated by astronomical transfer fees and billionaire-backed superclubs, a modest regional football club has captured the imagination of the sporting world. By defeating the reigning European champions in a thrilling continental final, the underdog squad proved that cohesive teamwork, visionary grassroots development, and tactical adaptability can triumph over lavish financial expenditure.

The foundation of this historic triumph was laid nearly a decade ago when club directors resolved to allocate their modest revenues into a state-of-the-art youth academy. Rather than competing in bidding wars for superstar veterans, the club cultivated homegrown talent with an emphasis on tactical intelligence, positional fluidity, and psychological resilience. Eight of the eleven starters in the final match were academy graduates who had played together since childhood.

Tactically, the manager deployed an aggressive pressing system combined with rapid vertical transitions. The players executed disciplined spatial coverage, frustrating their opponents' star-studded forward line while capitalizing ruthlessly on counter-attacking opportunities. The deciding goal, scored in the eighty-seventh minute by a nineteen-year-old local prodigy, sparked joyous celebrations among the club's passionate supporters.

Sports commentators and football economists have hailed the victory as a revitalizing triumph for competitive integrity. The club's success serves as an inspiring blueprint for smaller sporting organizations worldwide, illustrating that patient structural investment and cultural authenticity can overcome immense commercial disparity. As the trophies are hoisted, the footballing world celebrates a timeless triumph of spirit, strategy, and community pride.`,
    quizzes: [
      {
        question: "What core strategy enabled the underdog football club to win the championship?",
        options: [
          "Long-term grassroots youth development and tactical cohesion",
          "Breaking international transfer records to sign superstar veterans",
          "Paying exorbitant fees to borrow international stadium facilities",
          "Refusing to participate in regular league fixtures"
        ],
        correctAnswer: "Long-term grassroots youth development and tactical cohesion",
        explanation: "The club focused on building a premier youth academy and cultivating homegrown, tactically fluid players."
      },
      {
        question: "How many players in the starting eleven were graduates of the club's own academy?",
        options: [
          "Eight players",
          "Two players",
          "All eleven players",
          "Zero players"
        ],
        correctAnswer: "Eight players",
        explanation: "The text notes that eight out of the eleven starters were academy graduates who grew up playing together."
      },
      {
        question: "Vocabulary: What does the adjective 'unheralded' mean in the headline context?",
        options: [
          "Not previously praised, celebrated, or expected to achieve fame",
          "Extremely famous and widely acknowledged by all",
          "Officially banned by sports governing authorities",
          "Financially bankrupt and without staff"
        ],
        correctAnswer: "Not previously praised, celebrated, or expected to achieve fame",
        explanation: "'Unheralded' means not previously announced, celebrated, or expected to achieve success."
      },
      {
        question: "What wider lesson do football economists draw from the club's success?",
        options: [
          "Patient structural investment and teamwork can overcome huge financial disparities",
          "Football clubs should eliminate all youth training systems",
          "Championship matches should be decided by coin tosses",
          "Only billionaire owners can create competitive sporting clubs"
        ],
        correctAnswer: "Patient structural investment and teamwork can overcome huge financial disparities",
        explanation: "The victory proves that cultural integrity and youth investment can defeat lavish monetary expenditure."
      }
    ]
  },
  {
    title: "International Renewable Energy Treaty Unlocks Massive Sub-Saharan Grid Expansion",
    description: "Multilateral financing accords enable cross-border high-voltage solar corridors, bringing sustainable electricity to millions across East and West Africa.",
    category: "World",
    publishedAt: dates[3],
    source: "Global Development Journal",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/world/sub-saharan-renewable-grid-2026",
    content: `A monumental international collaboration has culminated in the ratification of the Pan-African Clean Energy Interconnection Treaty. The historic agreement brings together international development banks, national governments, and private infrastructure consortia to construct a vast, interconnected high-voltage direct current (HVDC) electricity grid powered entirely by utility-scale solar and wind farms across the Sahel and Great Rift Valley.

For decades, energy poverty has remained a stubborn barrier to industrialization, healthcare delivery, and educational advancement across rural Sub-Saharan regions. Isolated national grids suffered from chronic underinvestment and frequent outages. The new cross-border transmission network resolves these deficiencies by pooling renewable resources across varying time zones and weather patterns, ensuring consistent, resilient baseload power across national boundaries.

Under the financing framework, concessionary loans and sovereign guarantees protect local economies from unsustainable debt burdens. Simultaneously, regional vocational institutions are launching specialized apprenticeship programs to train hundreds of thousands of local technicians in solar photovoltaic maintenance, battery system operation, and high-voltage grid management. This guarantees that long-term economic dividends and employment opportunities remain rooted in local communities.

International observers describe the treaty as a transformative catalyst for continental socioeconomic development. By leapfrogging fossil-fuel dependency in favor of decentralized renewable architecture, the participating nations are forging a sustainable model for low-carbon industrialization. With construction of the primary transmission corridors commencing next quarter, millions of households are poised to gain clean, affordable electricity for the very first time.`,
    quizzes: [
      {
        question: "What technology will power the new Pan-African transmission grid?",
        options: [
          "Utility-scale solar and wind farms using high-voltage direct current lines",
          "Traditional coal-fired thermal power stations",
          "Heavy diesel generators installed in individual villages",
          "Imported natural gas transported by container trucks"
        ],
        correctAnswer: "Utility-scale solar and wind farms using high-voltage direct current lines",
        explanation: "The grid connects large solar and wind installations across the region using efficient HVDC transmission."
      },
      {
        question: "How does the cross-border network ensure reliable power despite weather variations?",
        options: [
          "By pooling renewable generation across different time zones and weather patterns",
          "By cutting power supply to neighboring countries during cloudy days",
          "By relying entirely on imported emergency electricity from Europe",
          "By requiring households to store power in disposable batteries"
        ],
        correctAnswer: "By pooling renewable generation across different time zones and weather patterns",
        explanation: "Sharing power across diverse zones and weather conditions balances fluctuations and ensures resilient electricity."
      },
      {
        question: "Vocabulary: What is the meaning of 'concessionary' as used in paragraph 3?",
        options: [
          "Offered on favorable terms and below market interest rates",
          "Extremely expensive and designed to maximize profit",
          "Given without any legal documentation or oversight",
          "Mandatory and enforced through international military force"
        ],
        correctAnswer: "Offered on favorable terms and below market interest rates",
        explanation: "'Concessionary loans' are financial credits provided at terms substantially more generous than market rates."
      },
      {
        question: "How will the initiative ensure that local communities benefit economically?",
        options: [
          "Through training apprentices in solar maintenance and grid management",
          "By requiring all residents to purchase shares in foreign energy firms",
          "By exporting all generated power to external continents",
          "By replacing all local workers with automated robotic systems"
        ],
        correctAnswer: "Through training apprentices in solar maintenance and grid management",
        explanation: "Vocational schools will train local technicians to operate and maintain the infrastructure, creating local jobs."
      }
    ]
  },
  {
    title: "Neuroplasticity Discoveries Reshape Language Acquisition in Adult Learners",
    description: "Cognitive neuroscientists reveal how multimodal immersion and spaced retrieval trigger rapid synaptic rewiring in mature brains.",
    category: "Technology",
    publishedAt: dates[4],
    source: "Cognitive Science Review",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/tech/neuroplasticity-language-learning-2026",
    content: `Groundbreaking research published by an international consortium of cognitive neuroscientists is challenging long-held assumptions regarding adult language acquisition. For decades, the conventional 'critical period hypothesis' maintained that human brains lose the neurobiological plasticity required for effortless language mastery after early adolescence. However, modern functional neuroimaging reveals that the adult brain retains remarkable capacity for linguistic restructuring when stimulated with optimized learning methodologies.

The key to unlocking mature neuroplasticity lies in the strategic combination of contextual immersion, spaced cognitive retrieval, and active communicative engagement. Rather than memorizing isolated grammar tables and vocabulary lists in isolation, adult learners who interact with rich, narrative-driven content activate interconnected neural pathways spanning the auditory cortex, hippocampus, and Broca's area. This multisensory engagement stimulates the secretion of brain-derived neurotrophic factor (BDNF), a vital protein that reinforces synaptic connections.

Furthermore, dynamic comprehension testing—such as contextual multiple-choice queries and instant explanatory feedback—accelerates memory consolidation. When a learner actively retrieves the meaning of a word in a real-world news scenario, the brain strengthens dendritic spines associated with that semantic concept. In contrast, passive reading without active interrogation produces significantly weaker long-term retention.

These neuroscientific findings are directly inspiring the architecture of modern educational platforms. By pairing authentic journalistic content with adaptive comprehension quizzes, digital learning environments simulate the natural cognitive conditions under which human brains acquire language. As neuroscience and educational software continue to converge, adult learners worldwide can master secondary languages with unprecedented speed and confidence.`,
    quizzes: [
      {
        question: "What traditional linguistic assumption does the new neuroimaging research challenge?",
        options: [
          "That adult brains cannot effectively rewire for language learning after adolescence",
          "That children learn languages faster than computers",
          "That listening to audiobooks causes memory loss in adults",
          "That writing by hand is superior to digital typing"
        ],
        correctAnswer: "That adult brains cannot effectively rewire for language learning after adolescence",
        explanation: "The study disproves the strict belief that mature brains lose the neuroplasticity needed for language mastery."
      },
      {
        question: "Which biological factor is secreted during multisensory learning to reinforce synaptic connections?",
        options: [
          "Brain-derived neurotrophic factor (BDNF)",
          "Pure crystalline adrenaline",
          "Synthetic dopamine supplements",
          "Hydrochloric digestive acid"
        ],
        correctAnswer: "Brain-derived neurotrophic factor (BDNF)",
        explanation: "BDNF is the essential protein highlighted in the text that promotes synaptic consolidation and learning."
      },
      {
        question: "Vocabulary: What does 'consolidation' mean in the third paragraph?",
        options: [
          "The process of making something physically or mentally stronger and more solid",
          "The act of dividing a group into conflicting factions",
          "A temporary loss of conscious awareness",
          "An immediate erase of stored computer files"
        ],
        correctAnswer: "The process of making something physically or mentally stronger and more solid",
        explanation: "'Consolidation' in neuroscience refers to the stabilization and strengthening of memory traces after initial learning."
      },
      {
        question: "Why is active retrieval via quizzes more effective than passive reading alone?",
        options: [
          "It activates and strengthens dendritic spines associated with semantic concepts",
          "It reduces the amount of sleep an individual requires at night",
          "It eliminates the need to understand article vocabulary",
          "It forces the brain to shut down unnecessary sensory receptors"
        ],
        correctAnswer: "It activates and strengthens dendritic spines associated with semantic concepts",
        explanation: "Active retrieval prompts the brain to solidify neural pathways corresponding to the recalled knowledge."
      }
    ]
  },
  {
    title: "Global Central Banks Coordinate Framework on Cross-Border Digital Currencies",
    description: "Financial authorities establish interoperability guidelines to streamline international remittances and lower transaction friction worldwide.",
    category: "Business",
    publishedAt: dates[4],
    source: "International Monetary Review",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://fluentfeed.internal/biz/cbdc-interoperability-framework-2026",
    content: `Central bankers and financial regulators from major economies have unveiled a comprehensive architectural framework for cross-border Central Bank Digital Currencies (CBDCs). The initiative aims to modernize the aging correspondent banking architecture, which has long been characterized by sluggish multi-day settlement times, opaque foreign exchange fees, and high intermediary costs.

Under the newly formulated blueprint, participating central banks will connect their sovereign wholesale digital currencies through unified multi-currency settlement corridors. By utilizing shared cryptographic ledgers and automated liquidity pools, cross-border commercial payments and individual remittances can settle instantaneously, twenty-four hours a day, without passing through numerous correspondent intermediary banks.

A critical priority throughout the technical design phase was ensuring robust consumer privacy while maintaining strict anti-money laundering and know-your-customer compliance. The system implements zero-knowledge cryptographic proofs, allowing financial institutions to verify the legitimacy of transactions and sanction compliance without disclosing sensitive personal identity data or commercial trade secrets to third parties.

Financial analysts estimate that seamless cross-border CBDC interoperability could save businesses and migrant workers tens of billions of dollars annually in unnecessary friction costs. Moreover, small and medium enterprises in emerging markets will gain direct access to international commercial markets without needing expensive overseas banking relationships. As pilot testing commences across participating trade corridors, the global financial system takes a decisive stride toward a frictionless digital economy.`,
    quizzes: [
      {
        question: "What main problems in the correspondent banking system does the CBDC framework address?",
        options: [
          "Sluggish multi-day settlement times, opaque fees, and high intermediary costs",
          "A total shortage of physical paper banknotes in domestic ATMs",
          "The complete absence of central banks in developed nations",
          "Strict government prohibitions against international trade"
        ],
        correctAnswer: "Sluggish multi-day settlement times, opaque fees, and high intermediary costs",
        explanation: "The initiative resolves long settlement delays, high fees, and excessive intermediary overhead."
      },
      {
        question: "How does the system preserve user privacy while complying with financial regulations?",
        options: [
          "By employing zero-knowledge cryptographic proofs",
          "By deleting all transaction records every twenty-four hours",
          "By allowing users to transact without any digital identification",
          "By publishing all banking transactions on public message boards"
        ],
        correctAnswer: "By employing zero-knowledge cryptographic proofs",
        explanation: "Zero-knowledge proofs verify compliance and legitimacy without exposing sensitive private identification data."
      },
      {
        question: "Vocabulary: What does the term 'interoperability' refer to in this financial context?",
        options: [
          "The ability of different systems and currencies to work together smoothly",
          "A complete trade blockade between competing nations",
          "The physical printing of multi-colored currency notes",
          "The manual counting of vault gold reserves"
        ],
        correctAnswer: "The ability of different systems and currencies to work together smoothly",
        explanation: "'Interoperability' is the ability of different computerized systems or software to exchange and make use of information."
      },
      {
        question: "Who stands to benefit significantly from direct access to international markets under this system?",
        options: [
          "Small and medium enterprises in emerging economies and migrant workers",
          "Only multinational oil conglomerates with private banking licenses",
          "Foreign currency speculators operating illegal exchanges",
          "Commercial airlines operating international freight flights only"
        ],
        correctAnswer: "Small and medium enterprises in emerging economies and migrant workers",
        explanation: "The system empowers small businesses in developing nations and migrant workers sending remittances."
      }
    ]
  }
];

function seedDatabase() {
  const insertArticle = db.prepare(`
    INSERT OR IGNORE INTO articles (
      title, description, content, image, source, category, publishedAt, articleUrl, difficulty, wordCount, readingTime
    ) VALUES (
      @title, @description, @content, @image, @source, @category, @publishedAt, @articleUrl, @difficulty, @wordCount, @readingTime
    )
  `);

  const insertQuiz = db.prepare(`
    INSERT INTO quizzes (
      articleId, question, options, correctAnswer, explanation
    ) VALUES (
      @articleId, @question, @options, @correctAnswer, @explanation
    )
  `);

  const checkCount = db.prepare('SELECT COUNT(*) as count FROM articles').get();
  if (checkCount.count > 0) {
    return;
  }

  const transaction = db.transaction((articles) => {
    for (const art of articles) {
      const stats = calculateDifficulty(art.content);
      const articleRow = {
        title: art.title,
        description: art.description,
        content: art.content,
        image: art.image,
        source: art.source,
        category: art.category,
        publishedAt: art.publishedAt,
        articleUrl: art.articleUrl,
        difficulty: stats.difficulty,
        wordCount: stats.wordCount,
        readingTime: stats.readingTime
      };

      const result = insertArticle.run(articleRow);
      const articleId = result.lastInsertRowid;

      if (articleId && art.quizzes) {
        for (const q of art.quizzes) {
          insertQuiz.run({
            articleId,
            question: q.question,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          });
        }
      }
    }
  });

  transaction(seedArticles);
}

module.exports = {
  seedDatabase,
  getPastDates
};
