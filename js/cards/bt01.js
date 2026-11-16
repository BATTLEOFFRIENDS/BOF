CARD_DATABASE.push(
  // ==================== BOOSTER 01: ชุดเสริมเด็คจิต & เด็คคาเงโร่ ====================
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
    desc: 'ออโต้ : เมื่อลงสนาม จั่วการ์ด 2 ใบ\nสั่งใช้งานจากนรก : ทิ้งการ์ดบนมือ 1 ใบ คอลการ์ดใบนี้ลงสนาม ความสามารถนี้สามารถใช้งานการ์ดชื่อเดียวกันได้เพียงแค่เทิร์นละ 1 ครั้งเท่านั้น',
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
    name: 'โทโคะยาจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'SR',
    maxCopies: 2,
    power: 2,
    image: 'images/BT/BT01/2.png',
    ability: 'TOKOYA_JIT_SKILL',
    desc: 'ออโต้ / 1 เทิร์น : เมื่อยูนิทนี้ถูกเลสโดยความสามารถการ์ด สามารถสแตร์นยูนิทนี้ได้\nออโต้ / 1 เทิร์น : เมื่อยูนิทนี้สแตร์นด้วยความสามารถการ์ด พลังโจมตียูนิทนี้เพิ่ม 1 หน่วย จนจบเทิร์น'
  },
  {
    id: 'BT01_03',
    name: 'จิตไนท์อาย รู้อนาคต',
    type: 'NormalSpell',
    rarity: 'R',
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
    id: 'BT01_04',
    name: 'ดราโกนิค เบลดมาสเตอร์ไทเท็น',
    type: 'Monster',
    tribe: 'คาเงโร่',
    rarity: 'SR',
    maxCopies: 1,
    power: 3,
    image: 'images/BT/BT01/4.png',
    ability: 'BLADEMASTER_TAITEN',
    desc: 'ต่อเนื่อง : เมื่อมีการ์ดที่มีชื่อ " ดราโกนิค เบลดมาสเตอร์ " ในชื่อ 2 ใบหรือมากกว่าในนรก การ์ดนี้ไม่ถูกทำลายโดนความสามารถ\nออโต้ / 1 เทิร์น : เมื่อยูนิทนี้โจมตีและทำลายยูนิทฝั่งตรงข้ามสำเร็จ ฝั่งตรงข้ามทิ้งการ์ดบนมือ 1 ใบ และเพิ่มพลังชีวิตลีดเดอร์เรา 1 หน่วย\nใส่ได้ 1 ใบในเด็ค',
    effects: [
      {
        id: 'taiten_on_battle_destroy',
        trigger: 'ON_BATTLE_DESTROY',
        oncePerTurn: true,
        steps: [
          { block: 'HEAL_LEADER', side: 'SELF', amount: 1 }
        ]
      }
    ]
  },
  {
    id: 'BT01_05',
    name: 'ดราโกนิค โอเวอร์ลอร์ด THE ACE',
    type: 'Monster',
    tribe: 'คาเงโร่',
    rarity: 'R',
    maxCopies: 2,
    power: 2,
    image: 'images/BT/BT01/5.png',
    ability: 'OVERLORD_THE_ACE',
    desc: 'ออโต้ : เมื่อยูนิทนี้ทำลายยูนิทฝั่งตรงข้ามได้จากการต่อสู้ ทำลายยูนิทฝั่งตรงข้าม 1 ใบ\nสั่งใช้งานในนรก / 1 เทิร์น : เมื่อยูนิทของเราถูกทำลาย สามารถอัญเชิญยูนิทนี้ลงสนามฝั่งเรา',
    effects: [
      {
        id: 'overlord_ace_kill_unit',
        trigger: 'ON_BATTLE_DESTROY',
        steps: [
          { block: 'DESTROY_UNIT', target: 'OPPONENT', count: 1, select: 'CHOOSE' }
        ]
      }
    ]
  },
  {
    id: 'BT01_06',
    name: 'มังกรมารผู้ใช้เวทย์ แรคช่า',
    type: 'NormalSpell',
    rarity: 'R',
    maxCopies: 2,
    image: 'images/BT/BT01/6.png',
    ability: 'RAKSHA_SPELL',
    desc: 'ทิ้งการ์ดบนมือเรา 1 ใบ เลือกยูนิทฝั่งเรา 1 ใบได้รับความสามารถจนจบเทิร์น ออโต้ : เมื่อยูนิทนี้ทำลายยูนิทจากการโจมตีสำเร็จ ทำความเสียหายใส่ลีดเดอร์ฝั่งตรงข้าม 1 หน่วย\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “คาเงโร่“ ได้เท่านั้น',
    effects: [
      {
        id: 'raksha_cast',
        trigger: 'CAST_SPELL',
        costs: [{ type: 'DISCARD_HAND', count: 1 }],
        steps: [
          { block: 'GRANT_STATUS', status: 'BURN_ON_KILL', target: 'ALLY', count: 1 }
        ]
      }
    ]
  }
);
