CARD_DATABASE.push(
  // ==================== MONSTER & SPELL: เด็คมาโดกะ ====================
  {
    id: 'MD01',
    name: 'โทโมเอะ มามิ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'R',
    power: 2,
    image: 'images/มาโดกะ/2.png',
    desc: 'สั่งใช้งาน / 1 เทิร์น: ทิ้งการ์ดบนมือ 1 ใบ อัญเชิญ “เบเบ้” จากในกองหรือนรก ไม่เกิน 1 ใบ แล้วพลังโจมตียูนิทนี้เพิ่มขึ้น 1 หน่วย',
    effects: [
      {
        id: 'mami_summon_bebe',
        label: 'ทิ้งมือ 1 ใบ -> อัญเชิญ "เบเบ้" จากกองหรือนรก & พลัง +1',
        trigger: 'ACTIVATE_MAIN',
        oncePerTurn: true,
        costs: [{ type: 'DISCARD_HAND', count: 1 }],
        steps: [
          { block: 'SEARCH_DECK_OR_GRAVE', destination: 'BOARD', cardId: 'MD06' },
          { block: 'ADD_POWER', target: 'SELF_UNIT', amount: 1, duration: 'PERM' }
        ]
      }
    ]
  },
  {
    id: 'MD02',
    name: 'มิกิ ซายากะ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'N',
    power: 2,
    image: 'images/มาโดกะ/3.png',
    desc: 'ออโต้ : เมื่อลงสนาม ทำลายยูนิทบนสนามฝั่งตรงข้าม 1 ใบ\nออโต้ : ถ้าบนสนามมี “ซากุระ เคียวโกะ” เมื่อจบเทิร์นสแตร์นการ์ดใบนี้',
    effects: [
      {
        id: 'sayaka_on_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'DESTROY_UNIT', target: 'OPPONENT', count: 1, select: 'CHOOSE' }
        ]
      }
    ]
  },
  {
    id: 'MD03',
    name: 'คานาเมะ มาโดกะ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'R',
    power: 2,
    image: 'images/มาโดกะ/4.png',
    ability: 'MADOKA_PROTECT',
    desc: 'ออโต้ : ถ้าในมิติมืดมี “SOUL GEM” อยู่เมื่อยูนิทนี้โจมตีสำเร็จบังคับฝั่งตรงข้ามเลือกทิ้งการ์ดบนมือตนเอง 1 ใบ\nสั่งใช้งาน / 1 เทิร์น : ถ้ายูนิต “อาเคมิ โฮมุระ” หรือยูนิทนี้จะออกจากสนามสามารถทิ้งการ์ดบนมือ 1 ใบ ยูนิทนั้นจะยังคงอยู่บนสนาม'
  },
  {
    id: 'MD04',
    name: 'อาเคมิ โฮมุระ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'N',
    power: 2,
    image: 'images/มาโดกะ/5.png',
    ability: 'HOMURA_REDUCE',
    desc: 'ออโต้ / 1 เทิร์น : เมื่อยูนิทฝั่งตรงข้ามโจมตีสามารถทิ้งการ์ดกี่ใบก็ได้ยูนิตที่โจมตีมานั้น ลดพลังตามการ์ดที่ถูกทิ้งไป'
  },
  {
    id: 'MD05',
    name: 'ซากุระ เคียวโกะ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'N',
    power: 1,
    image: 'images/มาโดกะ/6.png',
    ability: 'KYOKO_ATTACK',
    desc: 'ออโต้ : เมื่อยูนิทนี้โจมตี สามารถนำการ์ดจากนรกเรา 1 ใบ กลับเข้ากองแล้วพลังโจมตียูนิทนี้เพิ่มขึ้น 1 หน่วย'
  },
  {
    id: 'MD06',
    name: 'เบเบ้',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'N',
    power: 2,
    image: 'images/มาโดกะ/7.png',
    ability: 'BEBE_SUMMON_DRAW',
    desc: 'ออโต้ : เมื่อลงสนามด้วยความสามารถการ์ดเราจั่วการ์ด 1 ใบ'
  },
  {
    id: 'MD07',
    name: 'โมโมเอะ นางิสะ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'R',
    power: 2,
    image: 'images/มาโดกะ/8.png',
    ability: 'NAGISA_INTERRUPT',
    desc: 'สั่งใช้งานจากบนมือ : ถ้าฝั่งตรงข้ามโจมตีเป็นครั้งที่ 2 อัญเชิญการ์ดใบนี้ลงสนาม แล้วแล้วบังคับการ์ดฝั่งตรงข้ามที่สแตร์นอยู่ให้เปลี่ยนเป็นสภาพเลส'
  },
  {
    id: 'MD08',
    name: 'อาคุมะ โฮมุระ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'SR',
    maxCopies: 1,
    power: 3,
    image: 'images/มาโดกะ/9.png',
    ability: 'AKUMA_HOMURA_SUMMON',
    desc: 'สั่งใช้งานจากบนมือ : เมื่อบนสนามเราทำการโจมตี 2–3 ครั้งในเทิร์นนี้ สามารถอัญเชิญการ์ดใบนี้ลงสนามโดยนำการ์ดบนสนามเราลงนรก 1 ใบ แล้วทำลายการ์ดบนสนามอีกฝ่าย 1 ใบ'
  },
  {
    id: 'MD09',
    name: 'Ultimate Madoka',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'SR',
    maxCopies: 1,
    power: 0,
    cannotNormalSummon: true,
    image: 'images/มาโดกะ/10.png',
    ability: 'ULTIMATE_MADOKA',
    desc: 'สั่งใช้งาน จากมิติมืด : เมื่อในนรกมีการ์ดเผ่า สาวน้อยเวทมนตร์ ที่ชื่อต่างกัน 6 ใบ สามารถอัญเชิญการ์ดใบนี้ลงสนามโดยนำการ์ดบนสนามทั้งหมดกลับขึ้นมือแล้วพลังโจมตีของยูนิทนี้จะเพิ่มขึ้นเท่ากับการ์ดที่ถูกนำกลับขึ้นมือ และการ์ดใบนี้ไม่สามารถถูกทำลาย ไม่ถูกส่งกลับขึ้นมือ ความสามารถไม่ถูกยกเลิก เมื่อจบการต่อสู้ นำการ์ดในดรอปกลับเข้ากองทั้งหมดแล้วนำการ์ดบนมือเรา 2 ใบลงมาบนสนามในสภาพสแตร์นและนำการ์ดใบนี้กลับเข้าสู่มิติมืด'
  },
  {
    id: 'MD10',
    name: 'หัวใจของสาวน้อยเวทมนตร์',
    type: 'NormalSpell',
    rarity: 'N',
    image: 'images/มาโดกะ/11.png',
    ability: 'SPELL_MADOKA_HEART',
    desc: 'เลือกการ์ดในกองลงนรก 2 ใบ สับกองแล้วจั่ว 1 ใบ'
  },
  {
    id: 'MD11',
    name: 'Soul Gem',
    type: 'NormalSpell',
    rarity: 'N',
    maxCopies: 1,
    image: 'images/มาโดกะ/12.png',
    ability: 'SPELL_SOUL_GEM',
    desc: 'นำการ์ดใบนี้เข้าสู่มิติมืด\nส่งการ์ดที่มีชื่อ “ULTIMATE MADOKA” จากมือ,กอง,นรก ไปมิติมืด ถ้าจากมือให้จั่วการ์ด 1 ใบ'
  },
  {
    id: 'MD12',
    name: 'กฎแห่งวัฏจักร',
    type: 'ReactionSpell',
    rarity: 'N',
    image: 'images/มาโดกะ/13.png',
    ability: 'SPELL_LAW_OF_CYCLES',
    desc: 'เมื่อยูนิทฝั่งตรงข้ามโจมตี\nเลือกสแตร์นการ์ด 1 ใบ บนสนามเรา การ์ดที่เลือกจะไม่ถูกนำออกจากสนาม 1 ครั้ง และบังคับฝั่งตรงข้ามโจมตีการ์ดที่เลือกนั้น'
  }
);

DECK_LISTS.L07 = [
  'MD01', 'MD01', 'MD02', 'MD02', 'MD03', 'MD03', 'MD04', 'MD04', 'MD05', 'MD05',
  'MD06', 'MD06', 'MD07', 'MD07', 'MD08', 'MD09', 'MD10', 'MD11', 'MD12', 'MD12'
];
