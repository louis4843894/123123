// 靜途 — Mock Data Store
// All types and mock data for the platform

export type SituationType = 'emergency' | 'preplanning' | 'hasDirection'

export type CaseStatus =
  | 'pending'
  | 'confirmed'
  | 'pickup'
  | 'refrigeration'
  | 'cremation'
  | 'ceremony'
  | 'interment'
  | 'completed'

export interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  required: boolean
}

export interface Vendor {
  id: string
  name: string
  description: string
  region: string[]
  religion: string[]
  rating: number
  reviewCount: number
  priceRange: [number, number]
  services: string[]
  phone: string
  verified: boolean
  yearsInBusiness: number
  image: string
  responseTime: string
}

export interface Case {
  id: string
  caseNumber: string
  deceasedName: string
  familyName: string
  status: CaseStatus
  vendorId: string
  vendorName: string
  totalAmount: number
  paidAmount: number
  createdAt: string
  updatedAt: string
  notes: string[]
  todos: { id: string; text: string; done: boolean }[]
}

export interface FamilyMember {
  id: string
  name: string
  relation: string
  vote?: 'approve' | 'reject' | null
  shareRatio: number
}

export interface Message {
  id: string
  author: string
  role: 'family' | 'vendor' | 'system'
  content: string
  timestamp: string
}

// --- Service Items Catalog ---
export const SERVICE_ITEMS: ServiceItem[] = [
  { id: 's1', name: '遺體接運', description: '24小時接體服務，北中南東全台均可', price: 8000, category: '基礎服務', required: true },
  { id: 's2', name: '遺體冷藏保存 (每日)', description: '專業冷藏設備，確保遺體完好', price: 1500, category: '基礎服務', required: true },
  { id: 's3', name: '遺體美容整容', description: '還原自然神態，讓家屬安心告別', price: 6000, category: '基礎服務', required: false },
  { id: 's4', name: '壽衣 (基本款)', description: '台灣傳統壽衣，尺寸齊全', price: 3500, category: '壽衣禮品', required: false },
  { id: 's5', name: '壽衣 (進階款)', description: '高質感布料，繡花工藝', price: 8000, category: '壽衣禮品', required: false },
  { id: 's6', name: '告別式場地租用 (半日)', description: '莊嚴肅穆的告別廳，附基本音響', price: 15000, category: '告別式服務', required: false },
  { id: 's7', name: '告別式場地租用 (全日)', description: '全日使用，可容納200人以上', price: 25000, category: '告別式服務', required: false },
  { id: 's8', name: '告別式主持人', description: '專業禮儀師主持，引導家屬完成儀式', price: 8000, category: '告別式服務', required: false },
  { id: 's9', name: '花卉佈置 (基本)', description: '白菊花主題佈置，莊重素雅', price: 6000, category: '花卉佈置', required: false },
  { id: 's10', name: '花卉佈置 (精緻)', description: '百合菊花混搭，主花牆呈現', price: 15000, category: '花卉佈置', required: false },
  { id: 's11', name: '火化費用', description: '包含火化申請及基本骨灰罈', price: 12000, category: '火化安葬', required: false },
  { id: 's12', name: '骨灰罈 (陶瓷)', description: '台灣傳統陶瓷骨灰罈', price: 5000, category: '火化安葬', required: false },
  { id: 's13', name: '骨灰罈 (玉石)', description: '優質玉石材質，保存百年', price: 18000, category: '火化安葬', required: false },
  { id: 's14', name: '靈車接送', description: '莊重黑色靈車，含司機服務', price: 5000, category: '接送交通', required: false },
  { id: 's15', name: '家屬接送巴士', description: '30人座空調大巴，含全程接送', price: 8000, category: '接送交通', required: false },
  { id: 's16', name: '訃文印製 (100份)', description: '傳統版式或現代設計可選', price: 2000, category: '文件印製', required: false },
  { id: 's17', name: '告別式攝影錄影', description: '完整記錄，後製精美紀念影片', price: 12000, category: '攝影記念', required: false },
  { id: 's18', name: '法師/牧師誦經儀式', description: '依家屬宗教信仰安排', price: 10000, category: '宗教儀式', required: false },
]

// --- Vendors ---
export const VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: '慈恩禮儀',
    description: '深耕台北二十年，以溫柔細膩著稱，提供全方位殯葬服務。榮獲台北市優良業者認證。',
    region: ['台北市', '新北市', '基隆市'],
    religion: ['佛教', '道教', '基督教', '無宗教'],
    rating: 4.8,
    reviewCount: 127,
    priceRange: [80000, 250000],
    services: ['遺體接運', '告別式', '火化', '塔位'],
    phone: '02-2345-6789',
    verified: true,
    yearsInBusiness: 22,
    image: '/vendors/cieen.jpg',
    responseTime: '30分鐘內',
  },
  {
    id: 'v2',
    name: '永懷禮儀社',
    description: '專注中台灣市場，在地服務最貼心。客製化方案，尊重每個家庭的需求與信仰。',
    region: ['台中市', '彰化縣', '南投縣'],
    religion: ['佛教', '道教', '民間信仰'],
    rating: 4.6,
    reviewCount: 89,
    priceRange: [60000, 180000],
    services: ['遺體接運', '告別式', '火化', '公墓'],
    phone: '04-2345-6789',
    verified: true,
    yearsInBusiness: 15,
    image: '/vendors/yonghuai.jpg',
    responseTime: '1小時內',
  },
  {
    id: 'v3',
    name: '善終國際禮儀',
    description: '結合傳統與現代，提供數位紀念服務。旗下設有專屬告別廳，空間寬敞莊嚴。',
    region: ['台北市', '新北市', '桃園市', '新竹市'],
    religion: ['佛教', '道教', '基督教', '天主教', '無宗教'],
    rating: 4.9,
    reviewCount: 213,
    priceRange: [120000, 500000],
    services: ['遺體接運', '告別式', '火化', '塔位', '數位紀念'],
    phone: '02-8765-4321',
    verified: true,
    yearsInBusiness: 30,
    image: '/vendors/shanzong.jpg',
    responseTime: '15分鐘內',
  },
  {
    id: 'v4',
    name: '南台禮儀服務',
    description: '高雄在地老字號，家族事業傳承三代，深受當地家庭信任。',
    region: ['高雄市', '台南市', '屏東縣'],
    religion: ['佛教', '道教', '民間信仰', '基督教'],
    rating: 4.5,
    reviewCount: 156,
    priceRange: [50000, 160000],
    services: ['遺體接運', '告別式', '火化', '公墓', '塔位'],
    phone: '07-2345-6789',
    verified: true,
    yearsInBusiness: 35,
    image: '/vendors/nantai.jpg',
    responseTime: '45分鐘內',
  },
]

// --- Mock Cases ---
export const MOCK_CASES: Case[] = [
  {
    id: 'c1',
    caseNumber: 'JT-2024-0892',
    deceasedName: '陳木生',
    familyName: '陳家',
    status: 'cremation',
    vendorId: 'v1',
    vendorName: '慈恩禮儀',
    totalAmount: 185000,
    paidAmount: 50000,
    createdAt: '2024-11-28',
    updatedAt: '2024-12-01',
    notes: [
      '業者已完成遺體接運，目前安置於冷藏室。',
      '告別式訂於 12/5 上午 10:00 舉行，地點：台北市中山堂。',
      '火化申請已送出，預計 12/6 完成。',
    ],
    todos: [
      { id: 't1', text: '準備死亡證明書正本 3 份', done: true },
      { id: 't2', text: '準備亡者身分證及戶籍謄本', done: true },
      { id: 't3', text: '確認告別式出席家屬名單', done: false },
      { id: 't4', text: '準備訃文收件人名單', done: false },
      { id: 't5', text: '繳納訂金 NT$50,000（已完成）', done: true },
      { id: 't6', text: '確認骨灰罈樣式', done: false },
    ],
  },
]

// --- Case Status Map ---
export const CASE_STATUS_STEPS: { key: CaseStatus; label: string; description: string }[] = [
  { key: 'pending', label: '案件建立', description: '案件已建立，等待業者確認' },
  { key: 'confirmed', label: '業者確認', description: '業者已確認並指派負責人' },
  { key: 'pickup', label: '遺體接運', description: '遺體接運中' },
  { key: 'refrigeration', label: '冷藏保存', description: '遺體安置於冷藏設施' },
  { key: 'cremation', label: '火化中', description: '火化作業進行中' },
  { key: 'ceremony', label: '告別式', description: '告別式儀式準備或進行中' },
  { key: 'interment', label: '安葬', description: '骨灰安置入塔或墓地' },
  { key: 'completed', label: '案件完成', description: '所有服務已完成' },
]

// --- Family Members ---
export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'f1', name: '陳大明', relation: '長子', vote: 'approve', shareRatio: 40 },
  { id: 'f2', name: '陳美玲', relation: '長女', vote: 'approve', shareRatio: 30 },
  { id: 'f3', name: '陳志豪', relation: '次子', vote: null, shareRatio: 30 },
]

// --- Messages ---
export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    author: '慈恩禮儀',
    role: 'vendor',
    content: '您好，我們已收到您的委托，現場負責人王先生已於今日下午 3:00 完成遺體接運，目前安置妥當，請放心。',
    timestamp: '2024-11-28 15:30',
  },
  {
    id: 'm2',
    author: '陳大明',
    role: 'family',
    content: '感謝您，請問告別式的花卉佈置可以換成百合花嗎？家父生前很喜歡。',
    timestamp: '2024-11-28 17:45',
  },
  {
    id: 'm3',
    author: '慈恩禮儀',
    role: 'vendor',
    content: '當然可以，百合花會加收 NT$3,000 差價，我們會在報價單中更新。',
    timestamp: '2024-11-28 18:10',
  },
  {
    id: 'm4',
    author: '系統通知',
    role: 'system',
    content: '合約草稿已上傳，請家屬代表於 48 小時內完成電子簽名。',
    timestamp: '2024-11-29 09:00',
  },
]

// --- Vendor Cases for Vendor Portal ---
export const VENDOR_CASES = [
  {
    id: 'c1',
    caseNumber: 'JT-2024-0892',
    familyName: '陳家',
    status: 'cremation' as CaseStatus,
    assignedTo: '王大維',
    totalAmount: 185000,
    paidAmount: 50000,
    createdAt: '2024-11-28',
    deadline: '2024-12-06',
  },
  {
    id: 'c2',
    caseNumber: 'JT-2024-0891',
    familyName: '林家',
    status: 'ceremony' as CaseStatus,
    assignedTo: '李小雯',
    totalAmount: 240000,
    paidAmount: 120000,
    createdAt: '2024-11-25',
    deadline: '2024-12-03',
  },
  {
    id: 'c3',
    caseNumber: 'JT-2024-0887',
    familyName: '黃家',
    status: 'completed' as CaseStatus,
    assignedTo: '王大維',
    totalAmount: 120000,
    paidAmount: 120000,
    createdAt: '2024-11-20',
    deadline: '2024-11-28',
  },
]

// --- Admin Stats ---
export const ADMIN_STATS = {
  totalCases: 892,
  activeCases: 47,
  pendingVendorApprovals: 8,
  monthlyRevenue: 4280000,
  platformFeeRate: 0.05,
  avgCaseValue: 168000,
  topRegion: '台北市',
  conversionRate: 0.38,
}

export const MONTHLY_DATA = [
  { month: '6月', cases: 62, revenue: 3200000 },
  { month: '7月', cases: 71, revenue: 3650000 },
  { month: '8月', cases: 68, revenue: 3480000 },
  { month: '9月', cases: 75, revenue: 3920000 },
  { month: '10月', cases: 82, revenue: 4100000 },
  { month: '11月', cases: 89, revenue: 4280000 },
]

export const REGION_DATA = [
  { region: '台北市', cases: 210, percentage: 24 },
  { region: '新北市', cases: 178, percentage: 20 },
  { region: '高雄市', cases: 145, percentage: 16 },
  { region: '台中市', cases: 132, percentage: 15 },
  { region: '桃園市', cases: 98, percentage: 11 },
  { region: '其他', cases: 129, percentage: 14 },
]

// Pending vendor approvals
export const PENDING_VENDORS = [
  {
    id: 'pv1',
    name: '安詳禮儀有限公司',
    region: '新竹市',
    appliedAt: '2024-11-30',
    licenseNumber: 'TC-2024-0234',
    contactName: '葉志明',
    status: 'pending',
  },
  {
    id: 'pv2',
    name: '蓮花殯葬服務',
    region: '宜蘭縣',
    appliedAt: '2024-11-29',
    licenseNumber: 'TC-2024-0231',
    contactName: '吳惠芬',
    status: 'pending',
  },
  {
    id: 'pv3',
    name: '青松禮儀有限公司',
    region: '台南市',
    appliedAt: '2024-11-28',
    licenseNumber: 'TC-2024-0228',
    contactName: '許建華',
    status: 'pending',
  },
]
