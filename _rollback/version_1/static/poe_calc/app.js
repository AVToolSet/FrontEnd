const POE_TYPES = {
  none: { label: "No PoE", watts: 0, rank: 0 },
  poe: { label: "PoE", watts: 15.4, rank: 1 },
  "poe-plus": { label: "PoE+", watts: 30, rank: 2 },
  "poe-plus-plus-60": { label: "PoE++ Type 3", watts: 60, rank: 3 },
  "poe-plus-plus-90": { label: "PoE++ Type 4", watts: 90, rank: 4 },
};

const STORAGE_KEY = "poe-calculator-draft-v1";

const SWITCH_CATALOG = {
  aruba: {
    label: "HP Aruba",
    lastUpdated: "official HPE Aruba Instant On datasheets and product references current in 2025-2026",
    models: [
      { family: "Instant On 1830", model: "8G Class4 PoE (65W)", poeBudget: 65, poeType: "poe-plus", poePorts: 4, source: "HPE Aruba Instant On 1830 data sheet" },
      { family: "Instant On 1830", model: "24G Class4 PoE (195W)", poeBudget: 195, poeType: "poe-plus", poePorts: 12, source: "HPE Aruba Instant On 1830 data sheet" },
      { family: "Instant On 1830", model: "48G Class4 PoE (370W)", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "HPE Aruba Instant On 1830 data sheet" },
      { family: "Instant On 1930", model: "JL681A 8G Class4 PoE 2SFP", poeBudget: 124, poeType: "poe-plus", poePorts: 8, source: "Aruba Instant On 1930 Product Information Reference" },
      { family: "Instant On 1930", model: "JL683B 24G Class4 PoE 4SFP/SFP+ 195W", poeBudget: 195, poeType: "poe-plus", poePorts: 24, source: "Aruba Instant On 1930 Product Information Reference" },
      { family: "Instant On 1930", model: "JL684B 24G Class4 PoE 4SFP/SFP+ 370W", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Aruba Instant On 1930 Product Information Reference" },
      { family: "Instant On 1930", model: "JL686B 48G Class4 PoE 4SFP/SFP+ 370W", poeBudget: 370, poeType: "poe-plus", poePorts: 48, source: "Aruba Instant On 1930 Product Information Reference" },
      { family: "Instant On 1960", model: "JL807A 24G PoE 370W", poeBudget: 370, poeType: "poe-plus-plus-60", poePorts: 24, source: "HPE Aruba Instant On 1960 data sheet" },
      { family: "Instant On 1960", model: "JL809A 48G PoE 600W", poeBudget: 600, poeType: "poe-plus-plus-60", poePorts: 48, source: "HPE Aruba Instant On 1960 data sheet" },
      { family: "Instant On 1960", model: "S0F35A 12-port Multi-Gig PoE 480W", poeBudget: 480, poeType: "poe-plus-plus-60", poePorts: 12, source: "HPE Aruba Instant On 1960 data sheet" }
    ]
  },
  netgear: {
    label: "NETGEAR",
    lastUpdated: "current NETGEAR product pages and datasheets crawled in 2026",
    models: [
      { family: "Unmanaged Essentials", model: "GS305P", poeBudget: 63, poeType: "poe-plus", poePorts: 4, source: "NETGEAR GS305P product page" },
      { family: "Unmanaged Essentials", model: "GS305PP", poeBudget: 83, poeType: "poe-plus", poePorts: 4, source: "NETGEAR GS305PP product page" },
      { family: "Plus / Easy Smart", model: "GS305EP", poeBudget: 63, poeType: "poe-plus", poePorts: 4, source: "NETGEAR GS305EP/GS305EPP/GS308EP/GS308EPP/GS316EP/GS316EPP datasheet" },
      { family: "Plus / Easy Smart", model: "GS305EPP", poeBudget: 120, poeType: "poe-plus", poePorts: 4, source: "NETGEAR GS305EP/GS305EPP/GS308EP/GS308EPP/GS316EP/GS316EPP datasheet" },
      { family: "Unmanaged Essentials", model: "GS308LP", poeBudget: 60, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS308LP product page" },
      { family: "Unmanaged Essentials", model: "GS308PP", poeBudget: 83, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS308PP product page" },
      { family: "FlexPoE Unmanaged", model: "GS108LP", poeBudget: 60, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS108LP/GS108PP/GS116LP/GS116PP datasheet" },
      { family: "FlexPoE Unmanaged", model: "GS108PP", poeBudget: 123, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS108LP/GS108PP/GS116LP/GS116PP datasheet" },
      { family: "Insight Smart Cloud", model: "GC108P", poeBudget: 64, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GC108P/GC108PP datasheet" },
      { family: "Insight Smart Cloud", model: "GC108PP", poeBudget: 126, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GC108P/GC108PP datasheet" },
      { family: "Plus / Easy Smart", model: "GS308EP", poeBudget: 62, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS305EP/GS305EPP/GS308EP/GS308EPP/GS316EP/GS316EPP datasheet" },
      { family: "Plus / Easy Smart", model: "GS308EPP", poeBudget: 123, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS305EP/GS305EPP/GS308EP/GS308EPP/GS316EP/GS316EPP datasheet" },
      { family: "Insight Smart Cloud", model: "GC110P", poeBudget: 62, poeType: "poe", poePorts: 8, source: "NETGEAR GC110/GC110P/GC510P/GC510PP datasheet" },
      { family: "Insight Smart Cloud", model: "GC510P", poeBudget: 134, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GC110/GC110P/GC510P/GC510PP datasheet" },
      { family: "Insight Smart Cloud", model: "GC510PP", poeBudget: 195, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GC110/GC110P/GC510P/GC510PP datasheet" },
      { family: "Smart Cloud", model: "GS110TP", poeBudget: 55, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS110TP product page" },
      { family: "Smart Cloud", model: "GS110TPP", poeBudget: 120, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GS110TPP datasheet" },
      { family: "AV Line M4250", model: "GSM4210PD M4250-9G1F-PoE+", poeBudget: 110, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GSM4210PD product page" },
      { family: "AV Line M4250", model: "GSM4210PX M4250-8G2XF-PoE+", poeBudget: 220, poeType: "poe-plus", poePorts: 8, source: "NETGEAR GSM4210PX product page" },
      { family: "AV Line M4250", model: "GSM4230P M4250-26G4F-PoE+", poeBudget: 300, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GSM4230P product page" },
      { family: "AV Line M4250", model: "GSM4230PX M4250-26G4XF-PoE+", poeBudget: 480, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GSM4230PX product page" },
      { family: "AV Line M4250", model: "GSM4248UX M4250-40G8XF-PoE++", poeBudget: 2880, poeType: "poe-plus-plus-90", poePorts: 40, source: "NETGEAR GSM4248UX product page" },
      { family: "AV Line M4300", model: "GSM4328PB M4300-28G PoE+", poeBudget: 630, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GSM4328PB product page" },
      { family: "AV Line M4300", model: "GSM4352PA M4300-52G PoE+", poeBudget: 480, poeType: "poe-plus", poePorts: 48, source: "NETGEAR GSM4352PA product page" },
      { family: "AV Line M4300", model: "XSM4316PB M4300-16X PoE+", poeBudget: 500, poeType: "poe-plus", poePorts: 16, source: "NETGEAR XSM4316PB product page" },
      { family: "AV Line M4350", model: "MSM4320 M4350-16M4V", poeBudget: 530, poeType: "poe-plus-plus-90", poePorts: 16, source: "NETGEAR MSM4320 product page" },
      { family: "AV Line M4350", model: "MSM4332 M4350-24M4X4V", poeBudget: 522, poeType: "poe-plus-plus-90", poePorts: 28, source: "NETGEAR MSM4332 product page" },
      { family: "Multi-Gig Unmanaged", model: "MS108UP", poeBudget: 230, poeType: "poe-plus-plus-60", poePorts: 8, source: "NETGEAR MS108UP product page / datasheet" },
      { family: "Multi-Gig Smart", model: "MS510TXUP", poeBudget: 295, poeType: "poe-plus-plus-60", poePorts: 8, source: "NETGEAR MS510TXUP product page" },
      { family: "FlexPoE Unmanaged", model: "GS116LP", poeBudget: 76, poeType: "poe-plus", poePorts: 16, source: "NETGEAR GS108LP/GS108PP/GS116LP/GS116PP datasheet" },
      { family: "FlexPoE Unmanaged", model: "GS116PP", poeBudget: 183, poeType: "poe-plus", poePorts: 16, source: "NETGEAR GS108LP/GS108PP/GS116LP/GS116PP datasheet" },
      { family: "Unmanaged Essentials", model: "GS316P", poeBudget: 115, poeType: "poe-plus", poePorts: 16, source: "NETGEAR GS316P product page" },
      { family: "Unmanaged Essentials", model: "GS316PP", poeBudget: 183, poeType: "poe-plus", poePorts: 16, source: "NETGEAR GS316PP product page" },
      { family: "Plus / Easy Smart", model: "GS316EP", poeBudget: 180, poeType: "poe-plus", poePorts: 15, source: "NETGEAR GS305EP/GS305EPP/GS308EP/GS308EPP/GS316EP/GS316EPP datasheet" },
      { family: "Plus / Easy Smart", model: "GS316EPP", poeBudget: 231, poeType: "poe-plus", poePorts: 15, source: "NETGEAR GS305EP/GS305EPP/GS308EP/GS308EPP/GS316EP/GS316EPP datasheet" },
      { family: "Unmanaged Essentials", model: "GS324P", poeBudget: 190, poeType: "poe-plus", poePorts: 16, source: "NETGEAR GS324P product page" },
      { family: "Smart Cloud", model: "GS724TPv2", poeBudget: 190, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GS724TPv2/GS724TPP datasheet" },
      { family: "Smart Cloud", model: "GS724TPP", poeBudget: 380, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GS724TPv2/GS724TPP datasheet" },
      { family: "Smart Cloud", model: "GS728TP", poeBudget: 190, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GS728TP/GS728TPP/GS752TP/GS752TPP datasheet" },
      { family: "Smart Cloud", model: "GS728TPP", poeBudget: 380, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GS728TPP product page / datasheet" },
      { family: "Unmanaged Essentials", model: "GS348PP", poeBudget: 380, poeType: "poe-plus", poePorts: 24, source: "NETGEAR GS348PP product page" },
      { family: "Smart Cloud", model: "GS752TP", poeBudget: 380, poeType: "poe-plus", poePorts: 48, source: "NETGEAR GS728TP/GS728TPP/GS752TP/GS752TPP datasheet" },
      { family: "Smart Cloud", model: "GS752TPP", poeBudget: 760, poeType: "poe-plus", poePorts: 48, source: "NETGEAR GS728TP/GS728TPP/GS752TP/GS752TPP datasheet" }
    ]
  },
  cisco: {
    label: "Cisco",
    lastUpdated: "March 21, 2025 / May 25, 2024",
    models: [
      { family: "Business 250", model: "CBS250-8PP-D", poeBudget: 45, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-8PP-E-2G", poeBudget: 45, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-8P-E-2G", poeBudget: 60, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-8FP-E-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-16P-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 16, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-24PP-4G", poeBudget: 100, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-24P-4G", poeBudget: 195, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-24FP-4G", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-48PP-4G", poeBudget: 195, poeType: "poe-plus", poePorts: 48, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-48P-4G", poeBudget: 370, poeType: "poe-plus", poePorts: 48, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-24P-4X", poeBudget: 195, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-24FP-4X", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 250", model: "CBS250-48P-4X", poeBudget: 370, poeType: "poe-plus", poePorts: 48, source: "Cisco Business 250 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-8P-2G", poeBudget: 67, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-8P-E-2G", poeBudget: 60, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-8FP-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-8FP-E-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-16P-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 16, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-16P-E-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 16, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-16FP-2G", poeBudget: 240, poeType: "poe-plus", poePorts: 16, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-24P-4G", poeBudget: 195, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-24FP-4G", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-48P-4G", poeBudget: 370, poeType: "poe-plus", poePorts: 48, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-48FP-4G", poeBudget: 740, poeType: "poe-plus", poePorts: 48, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-24P-4X", poeBudget: 195, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-24FP-4X", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-48P-4X", poeBudget: 370, poeType: "poe-plus", poePorts: 48, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-48FP-4X", poeBudget: 740, poeType: "poe-plus", poePorts: 48, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-8MGP-2X", poeBudget: 124, poeType: "poe-plus", poePorts: 8, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-8MP-2X", poeBudget: 375, poeType: "poe-plus-plus-60", poePorts: 8, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-24MGP-4X", poeBudget: 375, poeType: "poe-plus-plus-60", poePorts: 24, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-12NP-4X", poeBudget: 375, poeType: "poe-plus-plus-60", poePorts: 12, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-24NGP-4X", poeBudget: 375, poeType: "poe-plus-plus-60", poePorts: 24, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Business 350", model: "CBS350-48NGP-4X", poeBudget: 740, poeType: "poe-plus-plus-60", poePorts: 48, source: "Cisco Business 350 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-8P-E-2G", poeBudget: 67, poeType: "poe-plus", poePorts: 8, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-8FP-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 8, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-16P-2G", poeBudget: 120, poeType: "poe-plus", poePorts: 16, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-24P-4G", poeBudget: 195, poeType: "poe-plus", poePorts: 24, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-24FP-4G", poeBudget: 375, poeType: "poe-plus", poePorts: 24, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-48P-4G", poeBudget: 375, poeType: "poe-plus", poePorts: 48, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-24P-4X", poeBudget: 195, poeType: "poe-plus", poePorts: 24, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-24FP-4X", poeBudget: 375, poeType: "poe-plus", poePorts: 24, source: "Cisco Catalyst 1200 Series Data Sheet" },
      { family: "Catalyst 1200", model: "C1200-48P-4X", poeBudget: 375, poeType: "poe-plus", poePorts: 48, source: "Cisco Catalyst 1200 Series Data Sheet" },
    ],
  },
  ubiquiti: {
    label: "Ubiquiti",
    lastUpdated: "official Ubiquiti Store product pages crawled in 2026",
    models: [
      { family: "UniFi Standard", model: "USW-24-POE", poeBudget: 95, poeType: "poe-plus", poePorts: 16, source: "Ubiquiti Switch 24 PoE product page" },
      { family: "UniFi Standard", model: "USW-48-POE", poeBudget: 195, poeType: "poe-plus", poePorts: 32, source: "Ubiquiti Switch 48 PoE product page" },
      { family: "UniFi Pro", model: "USW-Pro-8-PoE", poeBudget: 120, poeType: "poe-plus-plus-60", poePorts: 8, source: "Ubiquiti Switch Pro 8 PoE product page" },
      { family: "UniFi Pro", model: "USW-Pro-48-POE", poeBudget: 600, poeType: "poe-plus-plus-60", poePorts: 48, source: "Ubiquiti Switch Pro 48 PoE product page" },
      { family: "UniFi Enterprise", model: "USW-Enterprise-24-PoE", poeBudget: 400, poeType: "poe-plus", poePorts: 24, source: "Ubiquiti Enterprise 24 PoE product page" },
      { family: "UniFi Ultra", model: "USW-Ultra", poeBudget: 42, poeType: "poe-plus", poePorts: 7, source: "Ubiquiti Switch Ultra product page" },
      { family: "UniFi Ultra", model: "USW-Ultra-210W", poeBudget: 202, poeType: "poe-plus", poePorts: 7, source: "Ubiquiti Switch Ultra 210W product page" },
      { family: "Enterprise Campus", model: "ECS-24-PoE", poeBudget: 1050, poeType: "poe-plus-plus-90", poePorts: 24, source: "Ubiquiti Enterprise Campus 24 PoE product page" },
      { family: "Enterprise Campus", model: "ECS-48-PoE", poeBudget: 2150, poeType: "poe-plus-plus-90", poePorts: 48, source: "Ubiquiti Enterprise Campus 48 PoE product page" }
    ]
  },
  juniper: {
    label: "Juniper",
    lastUpdated: "official Juniper EX docs/pages crawled in 2026",
    models: [
      { family: "EX2300", model: "EX2300-C-12P", poeBudget: 124, poeType: "poe-plus", poePorts: 12, source: "Juniper EX2300 System Overview" },
      { family: "EX2300", model: "EX2300-24P", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Juniper EX2300 System Overview" },
      { family: "EX2300", model: "EX2300-24MP", poeBudget: 380, poeType: "poe-plus", poePorts: 24, source: "Juniper EX2300 System Overview" },
      { family: "EX2300", model: "EX2300-48P", poeBudget: 740, poeType: "poe-plus", poePorts: 48, source: "Juniper EX2300 System Overview" },
      { family: "EX2300", model: "EX2300-48MP", poeBudget: 740, poeType: "poe-plus", poePorts: 48, source: "Juniper EX2300 System Overview" },
      { family: "EX3400", model: "EX3400-24P", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Juniper EX3400 datasheet" },
      { family: "EX3400", model: "EX3400-48P", poeBudget: 740, poeType: "poe-plus", poePorts: 48, source: "Juniper EX3400 datasheet" },
      { family: "EX4100", model: "EX4100-24P (1 PSU)", poeBudget: 740, poeType: "poe-plus", poePorts: 24, source: "Juniper PoE on EX Series guide" },
      { family: "EX4100", model: "EX4100-48P (1 PSU)", poeBudget: 740, poeType: "poe-plus", poePorts: 48, source: "Juniper PoE on EX Series guide" },
      { family: "EX4100", model: "EX4100-24MP (1 PSU)", poeBudget: 740, poeType: "poe-plus-plus-90", poePorts: 24, source: "Juniper PoE on EX Series guide" },
      { family: "EX4100", model: "EX4100-48MP (1 PSU)", poeBudget: 740, poeType: "poe-plus-plus-90", poePorts: 48, source: "Juniper PoE on EX Series guide" },
      { family: "EX4100-F", model: "EX4100-F-12P", poeBudget: 180, poeType: "poe-plus", poePorts: 12, source: "Juniper PoE on EX Series guide" },
      { family: "EX4100-F", model: "EX4100-F-24P", poeBudget: 370, poeType: "poe-plus", poePorts: 24, source: "Juniper PoE on EX Series guide" },
      { family: "EX4100-F", model: "EX4100-F-48P", poeBudget: 740, poeType: "poe-plus", poePorts: 48, source: "Juniper PoE on EX Series guide" },
      { family: "EX4400", model: "EX4400-24P", poeBudget: 1440, poeType: "poe-plus-plus-90", poePorts: 24, source: "Juniper EX4400 Ethernet Switch page" },
      { family: "EX4400", model: "EX4400-48P", poeBudget: 1800, poeType: "poe-plus-plus-90", poePorts: 48, source: "Juniper EX4400 Ethernet Switch page" },
      { family: "EX4400", model: "EX4400-24MP", poeBudget: 1800, poeType: "poe-plus-plus-90", poePorts: 24, source: "Juniper EX4400 Multigigabit Switch page" },
      { family: "EX4400", model: "EX4400-48MP", poeBudget: 2200, poeType: "poe-plus-plus-90", poePorts: 48, source: "Juniper EX4400 Multigigabit Switch page" }
    ]
  }
};

const elements = {
  switchName: document.querySelector("#switch-name"),
  brand: document.querySelector("#brand"),
  modelSelect: document.querySelector("#model-select"),
  modelSelectGroup: document.querySelector("#model-select-group"),
  manualModelGroup: document.querySelector("#manual-model-group"),
  model: document.querySelector("#model"),
  budget: document.querySelector("#poe-budget"),
  switchType: document.querySelector("#switch-poe-type"),
  portCount: document.querySelector("#port-count"),
  exportCsv: document.querySelector("#export-csv"),
  resetForm: document.querySelector("#reset-form"),
  catalogNote: document.querySelector("#catalog-note"),
  portsContainer: document.querySelector("#ports-container"),
  rowTemplate: document.querySelector("#port-row-template"),
  statusCard: document.querySelector("#status-card"),
  statusDot: document.querySelector("#status-dot"),
  statusLabel: document.querySelector("#status-label"),
  statusMessage: document.querySelector("#status-message"),
  summaryName: document.querySelector("#summary-name"),
  summaryModel: document.querySelector("#summary-model"),
  summaryBudget: document.querySelector("#summary-budget"),
  summaryUsage: document.querySelector("#summary-usage"),
  summaryHeadroom: document.querySelector("#summary-headroom"),
  meterFill: document.querySelector("#meter-fill"),
  meterText: document.querySelector("#meter-text"),
};

const formatWatts = (value) => `${value.toFixed(1)}W`;

function saveState() {
  const rows = [...elements.portsContainer.querySelectorAll(".port-row")].map((row) => ({
    deviceName: row.querySelector(".device-name").value,
    poeType: row.querySelector(".device-poe-type").value,
  }));

  const draft = {
    switchName: elements.switchName.value,
    brand: elements.brand.value,
    modelSelect: elements.modelSelect.value,
    model: elements.model.value,
    budget: elements.budget.value,
    switchType: elements.switchType.value,
    portCount: elements.portCount.value,
    rows,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to load PoE draft", error);
    return null;
  }
}

function csvSafe(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function defaultCatalogModelIndex(brand) {
  if (!SWITCH_CATALOG[brand]) {
    return "";
  }

  return "0";
}

function downloadCsvInBrowser(fileName, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createPortRow(index) {
  const fragment = elements.rowTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".port-row");
  const badge = fragment.querySelector(".port-badge");
  const nameInput = fragment.querySelector(".device-name");
  const typeSelect = fragment.querySelector(".device-poe-type");

  row.dataset.portIndex = String(index);
  badge.textContent = `Port ${index + 1}`;
  nameInput.setAttribute("aria-label", `Device name for port ${index + 1}`);
  typeSelect.setAttribute("aria-label", `PoE type for port ${index + 1}`);

  typeSelect.addEventListener("change", updateCalculator);
  nameInput.addEventListener("input", updateCalculator);

  return fragment;
}

function syncPortRows() {
  const requestedCount = Math.max(1, Number.parseInt(elements.portCount.value, 10) || 1);
  const currentCount = elements.portsContainer.children.length;

  if (currentCount < requestedCount) {
    for (let index = currentCount; index < requestedCount; index += 1) {
      elements.portsContainer.appendChild(createPortRow(index));
    }
  } else if (currentCount > requestedCount) {
    for (let index = currentCount; index > requestedCount; index -= 1) {
      elements.portsContainer.lastElementChild.remove();
    }
  }
}

function getStatus(usagePercent) {
  if (usagePercent > 100) {
    return { state: "red", label: "Red", color: "#cf3f2e" };
  }

  if (usagePercent > 90) {
    return { state: "yellow", label: "Yellow", color: "#d39a16" };
  }

  return { state: "green", label: "Green", color: "#238a4c" };
}

function renderModelOptions() {
  const brand = elements.brand.value;
  const catalog = SWITCH_CATALOG[brand];

  if (!catalog) {
    elements.modelSelect.innerHTML = '<option value="">Manual entry</option>';
    elements.modelSelect.disabled = true;
    elements.catalogNote.textContent = "Use manual entry to define a switch that is not in the built-in catalog.";
    return;
  }

  const options = catalog.models
    .map((item, index) => {
      const poeTypeLabel = POE_TYPES[item.poeType]?.label || item.poeType;
      return `<option value="${index}">${item.family} | ${item.model} | ${poeTypeLabel} | ${item.poeBudget}W | ${item.poePorts} PoE ports</option>`;
    })
    .join("");

  elements.modelSelect.innerHTML = options;
  elements.modelSelect.disabled = false;
  elements.catalogNote.textContent = `${catalog.label} models are sourced from official vendor product pages, datasheets, and hardware references. Catalog reference dates: ${catalog.lastUpdated}.`;
}

function syncInputMode() {
  const isManual = elements.brand.value === "custom";

  elements.manualModelGroup.hidden = !isManual;
  elements.modelSelectGroup.hidden = isManual;
  elements.model.readOnly = !isManual;

  if (!isManual) {
    applySelectedCatalogModel();
  }
}

function applySelectedCatalogModel() {
  const brand = elements.brand.value;
  const catalog = SWITCH_CATALOG[brand];

  if (!catalog) {
    return;
  }

  const selectedModel = catalog.models[Number.parseInt(elements.modelSelect.value, 10) || 0];

  if (!selectedModel) {
    return;
  }

  elements.model.value = selectedModel.model;
  elements.budget.value = selectedModel.poeBudget;
  elements.switchType.value = selectedModel.poeType;
  elements.portCount.value = selectedModel.poePorts;
}

async function exportToCsv() {
  const rows = [...elements.portsContainer.querySelectorAll(".port-row")];
  const budget = Math.max(0, Number.parseFloat(elements.budget.value) || 0);
  const totalUsage = rows.reduce((sum, row) => {
    const type = row.querySelector(".device-poe-type").value;
    return sum + POE_TYPES[type].watts;
  }, 0);
  const headroom = budget - totalUsage;
  const switchName = elements.switchName.value.trim();
  const model = elements.model.value.trim();
  const manufacturer = elements.brand.value === "custom"
    ? "Custom / Manual Entry"
    : (SWITCH_CATALOG[elements.brand.value]?.label || elements.brand.value);

  const lines = [
    ["Switch Name", switchName || "Not set"],
    ["Manufacturer", manufacturer],
    ["Model", model || "Not set"],
    ["Switch PoE Type", POE_TYPES[elements.switchType.value].label],
    ["PoE Budget (W)", budget.toFixed(1)],
    ["Total PoE Ports", String(elements.portCount.value)],
    ["Total Device Usage (W)", totalUsage.toFixed(1)],
    ["Headroom (W)", headroom.toFixed(1)],
    [],
    ["Port", "Device", "PoE Type", "Estimated Draw (W)", "Compatible"],
  ];

  rows.forEach((row, index) => {
    const deviceName = row.querySelector(".device-name").value.trim();
    const poeType = row.querySelector(".device-poe-type").value;
    const compatible = POE_TYPES[poeType].rank <= POE_TYPES[elements.switchType.value].rank;

    lines.push([
      `Port ${index + 1}`,
      deviceName || "",
      POE_TYPES[poeType].label,
      POE_TYPES[poeType].watts.toFixed(1),
      compatible ? "Yes" : "No",
    ]);
  });

  const csv = lines
    .map((line) => line.map(csvSafe).join(","))
    .join("\r\n");

  const fileStem = (switchName || model || "poe_calculator_export")
    .replace(/[<>:"/\\|?*]+/g, "_")
    .replace(/\s+/g, "_");
  const fileName = `${fileStem}.csv`;

  if (window.pywebview?.api?.save_csv) {
    const result = await window.pywebview.api.save_csv(fileName, csv);

    if (!result?.ok && result?.message !== "Save cancelled.") {
      window.alert(result?.message || "CSV export failed.");
    }

    return;
  }

  downloadCsvInBrowser(fileName, csv);
}

function resetForm() {
  elements.switchName.value = "";
  elements.brand.value = "cisco";
  renderModelOptions();
  elements.modelSelect.value = defaultCatalogModelIndex("cisco");
  syncInputMode();

  const rows = [...elements.portsContainer.querySelectorAll(".port-row")];
  rows.forEach((row) => {
    row.querySelector(".device-name").value = "";
    row.querySelector(".device-poe-type").value = "none";
  });

  updateCalculator();
}

function restoreState() {
  const draft = loadState();
  if (!draft) {
    return;
  }

  elements.switchName.value = draft.switchName || "";
  elements.brand.value = draft.brand || "cisco";
  renderModelOptions();
  elements.modelSelect.value = draft.modelSelect || defaultCatalogModelIndex(elements.brand.value);
  syncInputMode();
  elements.model.value = draft.model || elements.model.value;
  elements.budget.value = draft.budget || elements.budget.value;
  elements.switchType.value = draft.switchType || elements.switchType.value;
  elements.portCount.value = draft.portCount || elements.portCount.value;
  syncPortRows();

  (draft.rows || []).forEach((savedRow, index) => {
    const row = elements.portsContainer.children[index];
    if (!row) {
      return;
    }
    row.querySelector(".device-name").value = savedRow.deviceName || "";
    row.querySelector(".device-poe-type").value = savedRow.poeType || "none";
  });
}

function updatePortCompatibility() {
  const switchRank = POE_TYPES[elements.switchType.value].rank;
  const rows = [...elements.portsContainer.querySelectorAll(".port-row")];

  rows.forEach((row) => {
    const typeSelect = row.querySelector(".device-poe-type");
    const wattsOutput = row.querySelector(".device-watts");
    const supportNote = row.querySelector(".support-note");
    const selectedType = POE_TYPES[typeSelect.value];
    const isCompatible = selectedType.rank <= switchRank;

    wattsOutput.textContent = formatWatts(selectedType.watts);
    supportNote.textContent = isCompatible ? "Compatible" : "Switch type too low";
    supportNote.classList.toggle("warning", !isCompatible);
  });
}

function updateCalculator() {
  syncPortRows();
  updatePortCompatibility();

  const budget = Math.max(0, Number.parseFloat(elements.budget.value) || 0);
  const rows = [...elements.portsContainer.querySelectorAll(".port-row")];
  const totalUsage = rows.reduce((sum, row) => {
    const type = row.querySelector(".device-poe-type").value;
    return sum + POE_TYPES[type].watts;
  }, 0);

  const usagePercent = budget > 0 ? (totalUsage / budget) * 100 : (totalUsage > 0 ? Infinity : 0);
  const status = getStatus(usagePercent);
  const headroom = budget - totalUsage;
  const model = elements.model.value.trim();
  const switchName = elements.switchName.value.trim();
  const brandLabel = elements.brand.value === "custom"
    ? "Custom switch"
    : (SWITCH_CATALOG[elements.brand.value]?.label || "Switch");
  const incompatibleCount = rows.filter((row) => {
    const type = row.querySelector(".device-poe-type").value;
    return POE_TYPES[type].rank > POE_TYPES[elements.switchType.value].rank;
  }).length;

  elements.statusCard.dataset.state = status.state;
  elements.statusDot.style.backgroundColor = status.color;
  elements.statusDot.style.boxShadow = `0 0 0 8px ${status.color}22`;
  elements.statusLabel.textContent = status.label;
  elements.summaryName.textContent = switchName || "Not set";
  elements.summaryModel.textContent = model ? `${brandLabel} ${model}` : "Not set";
  elements.summaryBudget.textContent = formatWatts(budget);
  elements.summaryUsage.textContent = formatWatts(totalUsage);
  elements.meterFill.style.width = `${Math.min(Number.isFinite(usagePercent) ? usagePercent : 100, 100)}%`;
  elements.meterFill.style.backgroundColor = status.color;

  if (Number.isFinite(usagePercent)) {
    elements.meterText.textContent = `${usagePercent.toFixed(1)}% of the switch PoE budget is currently assigned.`;
  } else {
    elements.meterText.textContent = "No switch budget is set, so any PoE load will exceed the available power.";
  }

  if (status.state === "red") {
    const compatibilityNote = incompatibleCount > 0 ? ` ${incompatibleCount} port(s) also require a higher PoE type than the switch supports.` : "";
    elements.statusMessage.textContent = `Assigned devices exceed the switch budget by ${formatWatts(Math.abs(headroom))}.${compatibilityNote}`;
    elements.summaryHeadroom.textContent = `${formatWatts(Math.abs(headroom))} over budget`;
    return;
  }

  if (status.state === "yellow") {
    elements.statusMessage.textContent = `The switch is still within budget, but only ${formatWatts(headroom)} of PoE headroom remains.${incompatibleCount > 0 ? ` ${incompatibleCount} port(s) need a higher PoE type.` : ""}`;
  } else {
    elements.statusMessage.textContent = `The switch has ${formatWatts(headroom)} of PoE headroom remaining.${incompatibleCount > 0 ? ` ${incompatibleCount} port(s) need a higher PoE type.` : ""}`;
  }

  elements.summaryHeadroom.textContent = `${formatWatts(headroom)} headroom`;
  saveState();
}

elements.brand.addEventListener("change", () => {
  renderModelOptions();
  syncInputMode();
  updateCalculator();
});

elements.modelSelect.addEventListener("change", () => {
  applySelectedCatalogModel();
  updateCalculator();
});

[elements.switchName, elements.model, elements.budget, elements.switchType, elements.portCount].forEach((input) => {
  input.addEventListener("input", updateCalculator);
  input.addEventListener("change", updateCalculator);
});

elements.exportCsv.addEventListener("click", exportToCsv);
elements.resetForm.addEventListener("click", resetForm);

renderModelOptions();
syncInputMode();
restoreState();
syncPortRows();
updateCalculator();
