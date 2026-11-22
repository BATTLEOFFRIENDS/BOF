CARD_DATABASE.push(
  // ==================== MONSTER & SPELL: เด็คจิต ====================
  {
    id: 'M01',
    name: 'บาคุจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'R', // ระดับความหายาก: N / R / SR / SSR
    power: 2,
    leaderLock: 'L01',
    image: 'images/เด็คจิต/2.png',
    ability: 'BAKU_SKILL',
    desc: 'ต่อเนื่อง : ถ้าบนสนามเรามี “โทโดโรจิต” ยูนิทนี้พลังโจมตี เพิ่ม 2 หน่วย\nออโต้ : เมื่อลงสนามทำลายการ์ดยูนิท 1ใบบนสนามฝั่งตรงข้าม\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น',
    effects: [
      {
        id: 'baku_continuous',
        trigger: 'CONTINUOUS_POWER',
        condition: { type: 'ALLY_ON_BOARD', cardId: 'M02' },
        amount: 2
      },
      {
        id: 'baku_on_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'DESTROY_UNIT', target: 'OPPONENT', count: 1, select: 'CHOOSE' }
        ]
      }
    ]
  },
  {
    id: 'M02',
    name: 'โทโดโรจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'N', // ระดับความหายาก: N / R / SR / SSR
    power: 3,
    leaderLock: 'L01',
    image: 'images/เด็คจิต/3.png',
    ability: 'TODORO_SKILL',
    desc: 'สั่งใช้งาน / 1 เทิร์น : ทิ้งมือ 1 ใบ ฝั่งตรงข้ามนำการ์ดใบบนสุดของกองลงนรก\nสั่งใช้งาน / 1 เทิร์น : นำ “บาคุจิต” จากนรกขึ้นมือ 1 ใบ\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น',
    effects: [
      {
        id: 'todoroMill',
        label: '1) ทิ้งมือ 1 ใบ -> ส่งใบบนสุดกองอีกฝ่ายลงนรก',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        costs: [{ type: 'DISCARD_HAND', count: 1 }],
        steps: [{ block: 'MILL_DECK', side: 'OPPONENT', count: 1 }]
      },
      {
        id: 'todoroRecover',
        label: '2) นำ "บาคุจิต" 1 ใบจากนรกขึ้นมือ',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        steps: [{ block: 'RECOVER_FROM_GRAVE', cardId: 'M01', count: 1 }]
      }
    ]
  },
  {
    id: 'M03',
    name: 'ออลจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'R', // ระดับความหายาก: N / R / SR / SSR
    power: 2,
    image: 'images/เด็คจิต/4.png',
    ability: 'ALL_JIT_HAND_INTERCEPT',
    desc: 'สั่งใช้งานจากบนมือ : เมื่อลีดเดอร์ถูกโจมตี สามารถอัญเชิญการ์ดใบนี้ลงสนาม แล้วเปลี่ยนการโจมตีนั้นมาที่ใบนี้แทน\nต่อเนื่อง : ยูนิทนี้ไม่ถูกทำลายจากความสามารถของการ์ด\nต่อเนื่อง : ยูนิทนี้พลังโจมตีเพิ่ม 1 ตามจำนวนการ์ดที่มีชื่อ “จิต” ทุก 2 ใบในนรกของเรา',
    effects: [
      {
        id: 'all_jit_power_buff',
        trigger: 'CONTINUOUS_POWER',
        condition: { type: 'PER_GRAVE_COUNT', divisor: 2, nameKeyword: 'จิต' },
        amountPerUnit: 1
      }
    ]
  },
  {
    id: 'M04',
    name: 'ออลฟอจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'SR', // ระดับความหายาก: N / R / SR / SSR
    power: 4,
    image: 'images/เด็คจิต/5.png',
    ability: 'ALL_FOR_JIT_GRAVE',
    cannotNormalSummon: true,
    desc: 'ห้ามอัญเชิญปกติ | สั่งใช้งานจากนรก / 1 เกม : เมื่อลีดเดอร์ถูกโจมตี สามารถอัญเชิญการ์ดใบนี้ลงสนาม และทำลายการ์ดทุกใบบนสนามของทุกฝ่าย\nต่อเนื่อง : ยูนิทนี้ไม่ถูกทำลายจากความสามารถของการ์ด\n*ความสามารถของการ์ดใบนี้ใช้ได้ต่อเมื่อ HP ของลีดเดอร์ เหลือ 2 หน่วย\nการ์ใบนี้ไม่สามารถอันเชิญแบบปกติได้'
  },
  {
    id: 'M05',
    name: 'เอ็นเดจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'N', // ระดับความหายาก: N / R / SR / SSR
    power: 2,
    leaderLock: 'L01',
    image: 'images/เด็คจิต/6.png',
    ability: 'ENDE_SKILL',
    desc: 'สั่งใช้งาน : เพิ่มพลังโจมตียูนิทนี้ 2 หน่วย หลังจากจบเทิร์นทำลายการ์ดใบนี้\nออโต้ : เมื่อยูนิทนี้ถูกทำลาย จั่วการ์ด 2 ใบ\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น',
    effects: [
      {
        id: 'endeBoost',
        label: 'เพิ่มพลังโจมตี +2 (ทำลายใบนี้เมื่อจบเทิร์น)',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        steps: [
          { block: 'ADD_POWER', target: 'SELF_UNIT', amount: 2, duration: 'TURN' },
          { block: 'MARK_END_TURN_DESTROY', target: 'SELF_UNIT' },
          { block: 'TRIGGER_ALLY_PASSIVE', allyId: 'M06', amount: 2 }
        ]
      },
      {
        id: 'ende_on_destroy',
        trigger: 'ON_DESTROY',
        steps: [
          { block: 'DRAW', side: 'SELF', count: 2 }
        ]
      }
    ]
  },
  {
    id: 'M06',
    name: 'ฮออ์กส์ฟีม',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'N', // ระดับความหายาก: N / R / SR / SSR
    power: 2,
    leaderLock: 'L01',
    image: 'images/เด็คจิต/7.png',
    ability: 'HAWKS_SKILL',
    desc: 'สั่งใช้งาน : ลดพลังโจมตีของยูนิทนี้ลด 2 หน่วย นำ"เอ็นเดจิต" จากกองหรือนรกขึ้นมือ ถ้ามาจากกองสลับกอง\nออโต้ : เมื่อ "เอ็นเดจิต"ใช้งานความสามารถ ยูนิทนี้พลังโจมตีเพิ่ม 2 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น',
    effects: [
      {
        id: 'hawksSearch',
        label: 'ลดพลังใบนี้ -2 -> ค้นหา "เอ็นเดจิต" จากกอง/นรกขึ้นมือ',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        costs: [{ type: 'REDUCE_SELF_POWER', amount: 2 }],
        steps: [
          { block: 'SEARCH_DECK_OR_GRAVE', cardId: 'M05', destination: 'HAND' }
        ]
      }
    ]
  },
  {
    id: 'S01',
    name: 'โอ้ยใครเหยียบตีน!!!',
    type: 'NormalSpell',
    rarity: 'SR', // ระดับความหายาก: N / R / SR / SSR
    effect: 'SPELL_DISCARD_DESTROY',
    image: 'images/เด็คจิต/8.png',
    desc: 'ทิ้งการ์ดบนมือ 1ใบทำลายยูนิทฝั่งตรงข้าม 1ใบ',
    effects: [
      {
        id: 'spell_s01',
        trigger: 'CAST_SPELL',
        costs: [{ type: 'DISCARD_HAND', count: 1 }],
        steps: [
          { block: 'DESTROY_UNIT', target: 'OPPONENT', count: 1, select: 'CHOOSE' }
        ]
      }
    ]
  },
  {
    id: 'S02',
    name: 'เชี่ย หุ้นตก',
    type: 'NormalSpell',
    rarity: 'R', // ระดับความหายาก: N / R / SR / SSR
    effect: 'SPELL_DEBUFF_ALL_3',
    image: 'images/เด็คจิต/9.png',
    desc: 'ลดพลังโจมตีของยูนิทฝั่งตรงข้ามทุกใบลง 3 หน่วย จนจบเทิร์น',
    effects: [
      {
        id: 'spell_s02',
        trigger: 'CAST_SPELL',
        steps: [
          { block: 'REDUCE_POWER', target: 'ALL_ENEMIES', amount: 3, duration: 'TURN' }
        ]
      }
    ]
  },
  {
    id: 'S03',
    name: 'หนึ่งเดียวเพื่อทุกสิ่ง',
    type: 'NormalSpell',
    rarity: 'N', // ระดับความหายาก: N / R / SR / SSR
    effect: 'SPELL_REST_1_HEAL_1',
    image: 'images/เด็คจิต/10.png',
    desc: 'เลสยูนิทที่สแตนอยู่ฝั่งเรา 1ใบ แล้วเพิ่มพลังชีวิต 2 หน่วย',
    effects: [
      {
        id: 'spell_s03',
        trigger: 'CAST_SPELL',
        costs: [{ type: 'REST_ALLY', count: 1 }],
        steps: [
          { block: 'HEAL_LEADER', side: 'SELF', amount: 2 }
        ]
      }
    ]
  },
  {
    id: 'S04',
    name: 'ทุกสิ่งเพื่อหนึ่งเดียว',
    type: 'NormalSpell',
    rarity: 'N', // ระดับความหายาก: N / R / SR / SSR
    effect: 'SPELL_REST_2_GRANT_BURN',
    image: 'images/เด็คจิต/11.png',
    desc: 'เลสยูนิทฝั่งเรา 2ใบ แล้วเลือกยูนิทฝั่งเรา 1ใบได้รับความสามารถ ออโต้ : เมื่อยูนิทนี้ทำลายยูนิทจากการโจมตีสำเร็จ ทำความเสียหายใส่ลีดเดอร์ฝั่งตรงข้าม 2 หน่วย',
    effects: [
      {
        id: 'spell_s04',
        trigger: 'CAST_SPELL',
        costs: [{ type: 'REST_ALLY', count: 2 }],
        steps: [
          { block: 'GRANT_STATUS', target: 'ALLY', count: 1, status: 'BURN_ON_KILL', amount: 2 }
        ]
      }
    ]
  }
);

DECK_LISTS.L01 = [
  'M01', 'M01', 'M02', 'M02', 'M03', 'M03', 'M04', 'M04', 'M05', 'M05',
  'M06', 'M06', 'S01', 'S01', 'S02', 'S02', 'S03', 'S03', 'S04', 'S04'
];
