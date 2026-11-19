CARD_DATABASE.push(
  // ==================== MONSTER & SPELL: เด็คคิลเลอร์ (ENTITY) ====================
  {
    id: 'KL01',
    name: 'THE JUDGMENT',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'SR',
    maxCopies: 1,
    power: 3,
    image: 'images/Killer/2.png',
    ability: 'THE_JUDGMENT_SKILL',
    desc: 'สั่งใช้งานจากบนมือ : นำยูนิทเผ่า “ENTITY” จากนรกกลับเข้ากอง 5 ใบ จากนั้นสลับกองการ์ด เพื่ออัญเชิญยูนิทนี้\nต่อเนื่อง : ถ้าลีดเดอร์ของเรามีพลังชีวิตมากกว่าลีดเดอร์อีกฝั่ง ยูนิทบนสนามฝั่งเราทุกใบไม่ถูกทำลายจากความสามารถของการ์ด\nออโต้ : เมื่อยูนิทนี้ลงสนามลีดเดอร์ของอีกฝั่งเสียพลังชีวิต 2 หน่วย\n*การ์ดใบนี้ไม่สามารถอัญเชิญแบบปกติได้',
    effects: [
      {
        id: 'kl01_on_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'DAMAGE_LEADER', side: 'OPPONENT', amount: 2 }
        ]
      }
    ]
  },
  {
    id: 'KL02',
    name: 'THE SLASHER',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'N',
    maxCopies: 2,
    power: 2,
    image: 'images/Killer/3.png',
    ability: 'THE_SLASHER_SKILL',
    desc: 'สั่งใช้งานในนรก / 1 เทิร์น : เมื่อลีดเดอร์ฝั่งตรงข้ามเสียพลังชีวิตสามารถอัญเชิญยูนิทนี้ลงบนสนามได้\nออโต้ / 1 เทิร์น : เมื่อฝ่ายตรงข้ามจั่วการ์ด ลีดเดอร์ของฝั่งตรงข้ามเสียพลังชีวิต 1 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  },
  {
    id: 'KL03',
    name: 'THE GHOUL',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'N',
    maxCopies: 2,
    power: 1,
    image: 'images/Killer/4.png',
    ability: 'THE_GHOUL_SKILL',
    desc: 'ออโต้ / 1 เทิร์น : เมื่อยูนิทนี้โจมตีสามารถทิ้งการ์ดบนมือ 1 ใบ ทำลายยูนิทฝั่งตรงข้าม 1 ใบ\nออโต้ : เมื่อยูนิทนี้โจมตีลีดเดอร์ของฝั่งตรงข้ามสำเร็จ ลีดเดอร์ของเราได้รับพลังชีวิต 1 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น',
    effects: [
      {
        id: 'kl03_hit_leader',
        trigger: 'ON_HIT_LEADER',
        steps: [
          { block: 'HEAL_LEADER', side: 'SELF', amount: 1 }
        ]
      }
    ]
  },
  {
    id: 'KL04',
    name: 'THE TRAPPER',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'N',
    maxCopies: 2,
    power: 3,
    image: 'images/Killer/5.png',
    ability: 'THE_TRAPPER_SKILL',
    desc: 'ต่อเนื่อง : ไม่ถูกทำลายจากความสามารถของการ์ด\nออโต้ : เมื่อถูกทิ้งสามารถอัญเชิญการ์ดใบนี้ลงสนาม\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  },
  {
    id: 'KL05',
    name: 'THE BLIGHT',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'N',
    maxCopies: 2,
    power: 3,
    image: 'images/Killer/6.png',
    ability: 'THE_BLIGHT_SKILL',
    desc: 'ต่อเนื่อง : ไม่สามารถถูกลดพลังโจมตีได้\nออโต้ : เมื่อยูนิทนี้ทำลายยูนิทฝ่ายตรงข้ามได้ สามารถทิ้งการ์ด 1 ใบ เพื่อทำลายยูนิทฝ่ายตรงข้ามที่พลังโจมตีน้อยกว่าหรือเท่ากับยูนิทนี้ 2 ใบ\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  },
  {
    id: 'KL06',
    name: 'THE GHOST FACE',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'N',
    maxCopies: 2,
    power: 0,
    image: 'images/Killer/7.png',
    ability: 'THE_GHOST_FACE_SKILL',
    desc: 'ต่อเนื่อง : พลังโจมตีเพิ่ม 1 หน่วย ตามจำนวนการ์ดในนรกของฝั่งตรงข้ามทุกๆ 2 ใบ\nออโต้ : เมื่อยูนิทนี้ลงสนามสุ่มทิ้งการ์ดบนมือฝั่งตรงข้าม 1 ใบ\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  },
  {
    id: 'KL07',
    name: 'THE XENOMORPH',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'N',
    maxCopies: 2,
    power: 2,
    image: 'images/Killer/8.png',
    ability: 'THE_XENOMORPH_SKILL',
    desc: 'สั่งใช้งานในนรก / 1 เทิร์น : เมื่อลีดเดอร์ของเราเสียพลังชีวิตสามารถอัญเชิญยูนิทนี้ลงบนสนามได้\nออโต้ : เมื่อลงสนาม สามารถทิ้งการ์ด 1 ใบ ลีดเดอร์ของเราได้รับพลังชีวิต 1 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  },
  {
    id: 'KL08',
    name: 'THE EXECUTIONER',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'R',
    maxCopies: 1,
    power: 2,
    image: 'images/Killer/9.png',
    ability: 'THE_EXECUTIONER_SKILL',
    desc: 'สั่งใช้งานในนรก / 1 เทิร์น : เมื่อลีดเดอร์ของเราเสียพลังชีวิตสามารถอัญเชิญยูนิทนี้ลงบนสนามได้\nออโต้ : เมื่อยูนิทนี้ลงสนามนำการ์ดใบบนสุดของกองการ์ดฝั่งตรงข้าม 1 ใบลงนรก\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น',
    effects: [
      {
        id: 'kl08_on_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'MILL_DECK', side: 'OPPONENT', count: 1 }
        ]
      }
    ]
  },
  {
    id: 'KL09',
    name: 'THE NURSE',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'R',
    maxCopies: 1,
    power: 3,
    image: 'images/Killer/10.png',
    ability: 'THE_NURSE_SKILL',
    desc: 'ออโต้ : เมื่อยูนิทนี้โจมตี เมื่ออีกฝั่งจะป้องกันต้องใช้ยูนิท 2 ใบ แทน 1 ใบ ถ้าทำไม่ได้จะป้องกันการโจมตีของยูนิทนี้ไม่ได้\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  },
  {
    id: 'KL10',
    name: 'THE UNKNOWN',
    type: 'Monster',
    tribe: 'ENTITY',
    rarity: 'R',
    maxCopies: 1,
    power: 3,
    image: 'images/Killer/11.png',
    ability: 'THE_UNKNOWN_SKILL',
    desc: 'ต่อเนื่อง : ถ้าการ์ดใบนี้อยู่ในนรก และในนรกของเรามีน้อยกว่าการ์ดในนรกของฝั่งตรงข้าม ยูนิทบนสนามเราไม่สามารถถูกยกเลิกความสามารถได้\nออโต้ : เมื่อฝ่ายตรงจะโจมตีต้องเลือกยูนิทเป็นเป้าหมายก่อนเสมอ\nออโต้ : เมื่อยูนิทนี้ถูกทำลาย สามารถจั่วการ์ด 1 ใบ\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น',
    effects: [
      {
        id: 'kl10_on_destroy',
        trigger: 'ON_DESTROY',
        steps: [
          { block: 'DRAW', side: 'SELF', count: 1 }
        ]
      }
    ]
  },
  {
    id: 'KL11',
    name: 'DIVINE LIGHT',
    type: 'ReactionSpell',
    rarity: 'SR',
    maxCopies: 2,
    image: 'images/Killer/12.png',
    ability: 'SPELL_DIVINE_LIGHT',
    desc: 'เมื่อยูนิทหรือลีดเดอร์ของเราถูกโจมตี สามารถทิ้งการ์ด 1 ใบจากมือ ยกเลิกการโจมตีนั้น และถ้าการ์ดที่ถูกทิ้งเป็นการ์ดเผ่า “ENTITY” ลีดเดอร์ของฝั่งตรงข้ามเสียพลังชีวิต 1 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  },
  {
    id: 'KL12',
    name: 'OMNIPRESENT EVIL',
    type: 'NormalSpell',
    rarity: 'N',
    maxCopies: 1,
    image: 'images/Killer/13.png',
    desc: 'ฝั่งตรงข้ามจั่วการ์ดจากกอง 2 ใบ และลีดเดอร์ของฝั่งตรงข้ามเสียพลังชีวิต 1 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น',
    effects: [
      {
        id: 'kl12_cast',
        trigger: 'CAST_SPELL',
        steps: [
          { block: 'DRAW', side: 'OPPONENT', count: 2 },
          { block: 'DAMAGE_LEADER', side: 'OPPONENT', amount: 1 }
        ]
      }
    ]
  },
  {
    id: 'KL13',
    name: 'ONE-EYED TERROR',
    type: 'NormalSpell',
    rarity: 'N',
    maxCopies: 1,
    image: 'images/Killer/14.png',
    ability: 'SPELL_ONE_EYED_TERROR',
    desc: 'ออโต้ : เมื่อการ์ดใบนี้ถูกทิ้ง ลีดเดอร์ทั้ง 2 ฝั่ง เสียพลังชีวิต 1 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “ENTITY” ได้เท่านั้น'
  }
);

DECK_LISTS.L11 = [
  'KL01',
  'KL02', 'KL02',
  'KL03', 'KL03',
  'KL04', 'KL04',
  'KL05', 'KL05',
  'KL06', 'KL06',
  'KL07', 'KL07',
  'KL08',
  'KL09',
  'KL10',
  'KL11', 'KL11',
  'KL12',
  'KL13'
];
