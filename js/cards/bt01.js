CARD_DATABASE.push(
  // ==================== BOOSTER 01 ====================
  {
    id: 'BT01_01',
    name: 'โมโมจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'R',
    maxCopies: 2,
    power: 2,
    image: 'images/BT/BT01/1.png',
    ability: 'MOMO_JIT_SKILL',
    desc: 'ออโต้ : เมื่อลงสนาม จั่วการ์ด 2ใบ\nสั่งใช้งานจากนรก : ทิ้งการ์ดบนมือ 1ใบคอลการ์ดใบนี้ลงสนาม ความสามารถนี้สามารถใช้งานการ์ดชื่อเดียวกันได้เพียงแค่เทิร์นละ 1 ครั้งเท่านั้น',
    effects: [
      {
        id: 'momo_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'DRAW', side: 'SELF', count: 2 }
        ]
      }
    ]
  },
  {
    id: 'BT01_02',
    name: 'โทโคยาจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'SR',
    maxCopies: 2,
    power: 2,
    leaderLock: 'L01',
    image: 'images/BT/BT01/2.png',
    ability: 'TOKOYA_JIT_SKILL',
    desc: 'ออโต้ / 1 เทิร์น : เมื่อยูนิทนี้ถูกเลสโดยความสามารถการ์ด สามารถสแตร์นยูนิทนี้ได้\nออโต้ / 1 เทิร์น : เมื่อยูนิทนี้สแตร์นด้วยความสามารถการ์ด พลังโจมตียูนิทนี้เพิ่ม 2 หน่วย จนจบเทิร์น\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น'
  },
  {
    id: 'BT01_03',
    name: 'จิตไนท์อาย รู้อนาคต',
    type: 'NormalSpell',
    rarity: 'N',
    maxCopies: 2,
    image: 'images/BT/BT01/3.png',
    ability: 'JIT_FUTURE_SIGHT',
    desc: 'นำการ์ดจากนรก 5 ใบหรือมากกว่า กลับเข้ากอง แล้วจั่วการ์ด 2 ใบ',
    effects: [
      {
        id: 'jit_future_sight_cast',
        trigger: 'CAST_SPELL',
        steps: [
          { block: 'RECYCLE_GRAVE_DRAW', minGrave: 5, count: 2 }
        ]
      }
    ]
  },
  {
    id: 'BT01_07',
    name: 'ผู้หวนคืน ลาพิเน่',
    type: 'Monster',
    tribe: 'วันสิ้นโลก',
    rarity: 'N',
    maxCopies: 2,
    power: 2,
    image: 'images/BT/BT01/7.png',
    ability: 'LAPINE_FUTURE_CALL',
    desc: 'ออโต้ / 1 เทิร์น : หลังจากจบโจมตีครั้งที่ 3 ในเทิร์นนี้ ทิ้งการ์ดบนมือ 1 ใบใช้ความสามารถ “อนาคต” จากนรกหรือกองได้'
  },
  {
    id: 'BT01_08',
    name: 'ผู้บัญชาการ เอล่า',
    type: 'Monster',
    tribe: 'วันสิ้นโลก',
    rarity: 'SR',
    maxCopies: 2,
    power: 2,
    image: 'images/BT/BT01/8.png',
    ability: 'COMMANDER_ELA',
    desc: 'ต่อเนื่อง : ถ้ายูนิทนี้อยู่บนสนามความสามารถของการ์ดบนสนามฝั่งตรงข้ามจะไม่ทำงาน และ เมื่อมีการคอลยูนิตจากนรก ฝั่งตรงข้ามทิ้งการ์ดบนมือ 1 ใบ'
  },
  {
    id: 'BT01_09',
    name: 'เพื่อนร่วมเดินทาง มิวเท็น',
    type: 'Monster',
    tribe: 'วันสิ้นโลก',
    rarity: 'R',
    maxCopies: 2,
    power: 2,
    image: 'images/BT/BT01/9.png',
    ability: 'MUTEN_PROTECTION',
    desc: 'ต่อเนื่อง : เมื่อยูนิทนี้อยู่บนสนามยูนิทฝั่งเราทุกใบจะไม่ถูกทำลายจากความสามารถ และ เมื่อมี “โอนามิ ผู้ทำลายโลก” อยู่บนสนามฝั่งเรายูนิททุกใบฝั่งเราได้รับพลังโจมตีเพิ่ม 1 หน่วย'
  },
  {
    id: 'BT01_10',
    name: 'นักเรียนใหม่ โฮมุระ',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'R',
    maxCopies: 2,
    power: 2,
    image: 'images/BT/BT01/10.png',
    ability: 'NEW_STUDENT_HOMURA',
    desc: 'ออโต้ : เมื่อมีการทิ้งการ์ดบนมือ ทำลายยูนิทฝั่งตรงข้าม 1 ใบ'
  },
  {
    id: 'BT01_11',
    name: 'คิวเบย์',
    type: 'Monster',
    tribe: 'สาวน้อยเวทมนตร์',
    rarity: 'N',
    maxCopies: 2,
    power: 1,
    image: 'images/BT/BT01/11.png',
    ability: 'KYUBEY_SEARCH',
    desc: 'สั่งใช้งานจากบนมือ : ทิ้งการ์ดใบนี้ ค้นหาการ์ดยูนิทเผ่า “สาวน้อยเวทมนตร์” จากกอง 2 ใบ ขึ้นมือ'
  },
  {
    id: 'BT01_12',
    name: 'ความรักที่แท้จริง',
    type: 'NormalSpell',
    rarity: 'SR',
    maxCopies: 2,
    image: 'images/BT/BT01/12.png',
    ability: 'TRUE_LOVE_SPELL',
    desc: 'นำการ์ดใบนี้เข้าสู่มิติมืด\nยูนิทบนสนามเราจะไม่ถูกทำลายจากความสามารถของอีกฝั่งจนจบเกม'
  }
);
