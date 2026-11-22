CARD_DATABASE.push(
  // ==================== BOOSTER 03 ====================
  {
    id: 'BT03_01',
    name: 'คิริชิจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'N',
    maxCopies: 2,
    power: 3,
    leaderLock: 'L01',
    image: 'images/BT/BT03/1.png',
    ability: 'KIRISHI_JIT_REVIVE_SUMMON',
    desc: 'ออโต้ : เมื่อยูนิทนี้ลงสนาม สามารถอัญเชิญยูนิท “บาคุจิต” จากนรกหรือกองได้1ใบ\nออโต้ / 1 เทิร์น : เมื่อยูนิทนี้ถูกทำลาย อัญเชิญยูนิทนี้ลงสนาม\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น',
    effects: [
      {
        id: 'bt03_01_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'SEARCH_DECK_OR_GRAVE', cardId: 'M01', destination: 'BOARD', optional: true }
        ]
      }
    ]
  },
  {
    id: 'BT03_02',
    name: 'โอจิจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'R',
    maxCopies: 2,
    power: 2,
    leaderLock: 'L01',
    image: 'images/BT/BT03/2.png',
    ability: 'OJI_JIT_AURA_GRAVE',
    desc: 'ต่อเนื่อง : เมื่อยูนิทนี้อยู่บนสนาม ยูนิทที่มีชื่อ “จิต” พลังโจมตีเพิ่ม 1\nสั่งใช้งานในนรก / 1 เกม : เมื่ออีกฝั่งสั่งโจมตีสามารถทำลายยูนิทนั้นแล้วยกเลิกการโจมตีนั้นได้ และอัญเชิญยูนิทนี้ลงสนาม\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น'
  },
  {
    id: 'BT03_03',
    name: 'อาซุยจิต',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'N',
    maxCopies: 2,
    power: 3,
    leaderLock: 'L01',
    image: 'images/BT/BT03/3.png',
    ability: 'ASUI_JIT_DISCARD_CALL',
    desc: 'ต่อเนื่อง : เมื่อมีจำนวนการ์ดบนมือน้อยกว่าฝ่ายตรงข้าม ยูนิทนี้เพิ่มพลังโจมตี 1 หน่วย\nออโต้ : ไม่ถูกทำลายจากความสามารถของการ์ด\nออโต้ : เมื่อถูกทิ้งสามารถอัญเชิญการ์ดใบลงสนาม\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น'
  },
  {
    id: 'BT03_04',
    name: 'เดจิต 5%',
    type: 'Monster',
    tribe: 'ฮีโร่',
    rarity: 'SR',
    maxCopies: 2,
    power: 4,
    leaderLock: 'L01',
    image: 'images/BT/BT03/4.png',
    ability: 'DEJIT_FIVE_PERCENT',
    desc: 'ออโต้ : เมื่อยูนิทนี้ลงสนามทำลายยูนิทฝั่งตรงข้ามทั้งหมด\nต่อเนื่อง : ถ้าเรามีการ์ดบนมือน้อยกว่าฝั่งตรงข้าม ยูนิทนี้พลังโจมตีลดลง 3 หน่วย และไม่ถูกทำลายจากความสามารถการ์ด\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น',
    effects: [
      {
        id: 'bt03_04_summon',
        trigger: 'ON_SUMMON',
        steps: [
          { block: 'DESTROY_UNIT', target: 'OPPONENT', select: 'ALL' }
        ]
      }
    ]
  },
  {
    id: 'BT03_05',
    name: 'ถีบสวน',
    type: 'ReactionSpell',
    tribe: 'ฮีโร่',
    rarity: 'SR',
    maxCopies: 2,
    leaderLock: 'L01',
    image: 'images/BT/BT03/5.png',
    ability: 'RETALIATE_KICK',
    desc: 'เมื่อยูนิทหรือลีดเดอร์ของคุณถูกโจมตี สามารถเปลี่ยนเป้าหมายเป็นยูนิทหรือลีดเดอร์ของฝั่งตรงข้าม ถ้าเลือกเป้าหมายเป็นลีดเดอร์ ผู้ร่ายต้องทิ้งการ์ดบนมือ 1 ใบ\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น'
  },
  {
    id: 'BT03_06',
    name: 'โอ้ยใครเกาะหลัง!!!',
    type: 'NormalSpell',
    tribe: 'ฮีโร่',
    rarity: 'N',
    maxCopies: 2,
    leaderLock: 'L01',
    image: 'images/BT/BT03/6.png',
    ability: 'WHO_CLINGS_BACK',
    desc: 'นำยูนิทจากกองลงนรก 1ใบ จั่วการ์ด 2ใบ\n*การ์ดใบนี้อยู่ในเด็คของลีดเดอร์ “มายฮีโร่ เดจิต” ได้เท่านั้น'
  }
);
