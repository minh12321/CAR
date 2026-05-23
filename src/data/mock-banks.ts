export const BANK_GROUPS = [
  "All",
  "NHTM Nhà nước",
  "NHTMCP lớn",
  "NHTMCP vừa",
  "NHTMCP nhỏ",
];

export const BANKS_BY_GROUP: Record<string, string[]> = {
  "All": [
    "ACB - Á Châu",
    "HDB - HDBank",
    "LPB - LienVietPost Bank",
    "MBB - Quân đội",
    "SHB - Sài Gòn",
    "STB - Sacombank",
    "TCB - Techcombank",
    "TPB - TPBank",
    "VIB - Vibank",
    "VPB - VPBank",
    "EIB - EximBank",
    "MSB - Maritime Bank",
    "NAB - Nam Á Bank",
    "OCB - Phương Đông",
    "ABB - ABBANK",
    "BAB - Bắc Á Bank",
    "BVB - Bảo Việt Bank",
    "KLB - Kiên Long Bank",
    "PGB - Petrolimex Bank",
    "BID - BIDV",
    "CTG - VietinBank",
    "VCB - Vietcombank",
  ],
  "NHTM Nhà nước": [
    "BID - BIDV",
    "CTG - VietinBank",
    "VCB - Vietcombank",
  ],
  "NHTMCP lớn": [
    "ACB - Á Châu",
    "HDB - HDBank",
    "LPB - LienVietPost Bank",
    "MBB - Quân đội",
    "SHB - Sài Gòn",
    "STB - Sacombank",
    "TCB - Techcombank",
    "TPB - TPBank",
    "VIB - Vibank",
    "VPB - VPBank",
  ],
  "NHTMCP vừa": [
    "EIB - EximBank",
    "MSB - Maritime Bank",
    "NAB - Nam Á Bank",
    "OCB - Phương Đông",
  ],
  "NHTMCP nhỏ": [
    "ABB - ABBANK",
    "BAB - Bắc Á Bank",
    "BVB - Bảo Việt Bank",
    "KLB - Kiên Long Bank",
    "PGB - Petrolimex Bank",
  ],
};

export const BANKS = Object.values(BANKS_BY_GROUP).flat();

export const PERIODS = ["2014 - 2025", "2014 - 2019", "2020 - 2025"];

export const METRICS = ["All", "ROE", "ROA"];
