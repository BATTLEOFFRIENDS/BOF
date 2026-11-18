CARD_DATABASE.push(
  // ==================== MONSTER & SPELL: เด็ครางดาว ====================
  {
    id: 'RD01',
    name: 'TRAILBLAZER',
    type: 'Monster',
    tribe: 'รางดาว',
    rarity: 'N',
    power: 2,
    image: 'images/รางดาว/2.png',
    ability: 'TRAILBLAZER_SKILL',
    desc: 'ออโต้ : เมื่อลงสนาม จั่วการ์ด 2 ใบ\nสั่งใช้งาน / 1 เทิร์น : นำการ์ดจากนรกเราไม่เกิน 2 ใบ กลับเข้ากอง',
    effects: [
      {
        id: 'rd01_on_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'DRAW', side: 'SELF', count: 2 }
        ]
      },
      {
        id: 'rd01_recycle',
        label: 'นำการ์ดจากนรกเราไม่เกิน 2 ใบ กลับเข้ากอง',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true
      }
    ]
  },
  {
    id: 'RD02',
    name: 'MARCH 7TH',
    type: 'Monster',
    tribe: 'รางดาว',
    rarity: 'N',
    power: 1,
    image: 'images/รางดาว/3.png',
    ability: 'MARCH_7TH_SHIELD',
    desc: 'สั่งใช้งาน / 1 เทิร์น : เลือกยูนิทบนสนามฝั่งเรา 1 ใบ ยูนิทนั้นจะไม่ถูกทำลาย 1 ครั้ง จนจบเทิร์นฝั่งตรงข้าม',
    effects: [
      {
        id: 'rd02_shield',
        label: 'เลือกยูนิทฝั่งเรา 1 ใบ ไม่ถูกทำลาย 1 ครั้ง จนจบเทิร์นฝั่งตรงข้าม',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        steps: [
          { block: 'GRANT_STATUS', target: 'ALLY', status: 'INDESTRUCTIBLE', count: 1 }
        ]
      }
    ]
  },
  {
    id: 'RD03',
    name: 'DAN HENG',
    type: 'Monster',
    tribe: 'รางดาว',
    rarity: 'N',
    power: 2,
    image: 'images/รางดาว/4.png',
    ability: 'DAN_HENG_ATTACK',
    desc: 'ออโต้ : เมื่อลงสนาม เลือกทำลายยูนิทอีกฝั่งตรงข้าม 1 ใบ\nออโต้ / 1 เทิร์น : เมื่อการ์ดนี้ทำลายยูนิทสำเร็จ สแตร์นยูนิทนี้',
    effects: [
      {
        id: 'rd03_on_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'DESTROY_UNIT', target: 'OPPONENT', count: 1, select: 'CHOOSE' }
        ]
      },
      {
        id: 'rd03_on_kill',
        trigger: 'ON_KILL_UNIT',
        oncePerTurn: true,
        steps: [
          { block: 'STAND_SELF' }
        ]
      }
    ]
  },
  {
    id: 'RD04',
    name: 'DAN HENG จ้าวทรนงคงปฐพี',
    type: 'Monster',
    tribe: 'รางดาว',
    rarity: 'R',
    power: 1,
    image: 'images/รางดาว/5.png',
    ability: 'DAN_HENG_IL',
    desc: 'ต่อเนื่อง : ถ้ายูนิทนี้อยู่บนสนาม ยูนิททุกใบฝั่งเราจะไม่ถูกทำลายจากความสามารถ\nออโต้ : เมื่อจบเทิร์นเรา สแตร์นยูนิทนี้'
  },
  {
    id: 'RD05',
    name: 'HIMEKO',
    type: 'Monster',
    tribe: 'รางดาว',
    rarity: 'SR',
    power: 2,
    image: 'images/รางดาว/6.png',
    ability: 'HIMEKO_ORBIT_CANNON',
    desc: 'ออโต้ : เมื่อมีการร่ายเวทมนตร์ ยูนิทนี้ พลังโจมตีเพิ่ม 2 หน่วย จนจบเทิร์น\nสั่งใช้งาน / 1 เทิร์น : ทิ้งการ์ดบนมือ 1 ใบ ทำลายยูนิทฝั่งตรงข้าม 1 ใบ',
    effects: [
      {
        id: 'rd05_destroy',
        label: 'ทิ้งการ์ดบนมือ 1 ใบ -> ทำลายยูนิทฝั่งตรงข้าม 1 ใบ',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        costs: [{ type: 'DISCARD_HAND', count: 1 }],
        steps: [
          { block: 'DESTROY_UNIT', target: 'OPPONENT', count: 1, select: 'CHOOSE' }
        ]
      }
    ]
  },
  {
    id: 'RD06',
    name: 'WELT',
    type: 'Monster',
    tribe: 'รางดาว',
    rarity: 'SR',
    power: 1,
    image: 'images/รางดาว/7.png',
    ability: 'WELT_BLACK_HOLE',
    desc: 'ต่อเนื่อง : ถ้ายูนิทนี้อยู่บนสนาม จะยกเลิกความสามารถไม่ถูกทำลายของยูนิทฝั่งตรงข้ามทุกใบ\nสั่งใช้งาน / 1 เทิร์น : ทิ้งการ์ดบนมือ 1 ใบ ลดพลังโจมตีของยูนิทฝั่งตรงข้ามทุกใบลง 2 หน่วย จนจบเทิร์น',
    effects: [
      {
        id: 'rd06_debuff',
        label: 'ทิ้งการ์ดบนมือ 1 ใบ -> ลดพลังโจมตีของยูนิทฝั่งตรงข้ามทุกใบลง 2 หน่วย จนจบเทิร์น',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        costs: [{ type: 'DISCARD_HAND', count: 1 }],
        steps: [
          { block: 'REDUCE_POWER', target: 'ALL_ENEMIES', amount: 2, duration: 'TURN' }
        ]
      }
    ]
  },
  {
    id: 'RD07',
    name: 'SUNDAY',
    type: 'Monster',
    tribe: 'รางดาว',
    rarity: 'R',
    power: 1,
    image: 'images/รางดาว/8.png',
    ability: 'SUNDAY_ORDER',
    desc: 'ต่อเนื่อง : ถ้าการ์ดใบนี้อยู่ในนรก ยูนิทบนสนามฝั่งเราทุกใบพลังโจมตีเพิ่ม 1 หน่วย\nออโต้ : เมื่อการ์ดใบนี้ถูกทิ้งจากบนมือ นำยูนิทไม่เกิน 1 ใบ จากนรกนำขึ้นมือ'
  },
  {
    id: 'RD08',
    name: 'WARP TRACKER',
    type: 'NormalSpell',
    rarity: 'N',
    image: 'images/รางดาว/9.png',
    desc: 'นำยูนิทเผ่า “รางดาว” ไม่เกิน 2 ใบจากกองขึ้นมือ',
    effects: [
      {
        id: 'rd08_spell',
        trigger: 'CAST_SPELL',
        steps: [
          { block: 'SEARCH_DECK', filterTribe: 'รางดาว', filterType: 'MONSTER', count: 2, upTo: true }
        ]
      }
    ]
  },
  {
    id: 'RD09',
    name: 'ASTRAL EXPRESS',
    type: 'NormalSpell',
    rarity: 'N',
    image: 'images/รางดาว/10.png',
    desc: 'ยูนิทเผ่า “รางดาว” บนสนามฝั่งเราทุกใบพลังโจมตีเพิ่ม 1 หน่วยจนจบเทิร์น',
    effects: [
      {
        id: 'rd09_spell',
        trigger: 'CAST_SPELL',
        steps: [
          { block: 'ADD_POWER', target: 'ALL_ALLIES', filterTribe: 'รางดาว', amount: 1, duration: 'TURN' }
        ]
      }
    ]
  },
  {
    id: 'RD10',
    name: 'POM POM',
    type: 'ReactionSpell',
    rarity: 'R',
    image: 'images/รางดาว/11.png',
    ability: 'SPELL_POM_POM',
    desc: 'เมื่อยูนิทหรือลีดเดอร์ของเราถูกโจมตี สามารถทิ้งการ์ด 1 ใบจากมือ ยกเลิกการโจมตีนั้น และถ้าการ์ดที่ถูกทิ้งเป็นการ์ดเผ่า “รางดาว” เพิ่มพลังชีวิต 1 หน่วย'
  }
);

DECK_LISTS.L10 = [
  'RD01', 'RD01',
  'RD02', 'RD02',
  'RD03', 'RD03',
  'RD04', 'RD04',
  'RD05', 'RD05',
  'RD06', 'RD06',
  'RD07', 'RD07',
  'RD08', 'RD08',
  'RD09', 'RD09',
  'RD10', 'RD10'
];
