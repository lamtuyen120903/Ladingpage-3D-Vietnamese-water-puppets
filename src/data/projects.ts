export interface Project {
  id: string
  title: string
  category: 'analysis' | 'automation' | 'ai'
  shortDescription: string
  storyText: string
  tools: string[]
  images: string[]
  videos: string[]
  websiteUrl: string
  featured: boolean
}

export const projects: Project[] = [
  // ====== ANALYSIS ======
  {
    id: 'telegram-data',
    title: 'Thu thap du lieu Telegram',
    category: 'analysis',
    shortDescription: 'Thu thap thong tin tu Telegram channel va group bang Telethon, tra ve n8n de phan tich bang AI.',
    storyText: `Boi canh: Can theo doi hang chuc kenh va nhom Telegram de nam bat xu huong thi truong va thong tin doi thu theo thoi gian thuc.\n\nMuc tieu: Xay dung pipeline tu dong thu thap tin nhan, phan loai noi dung, va trich xuat insight bang AI.\n\nCach lam: Dung Telethon ket noi API Telegram, n8n lam orchestration layer, AI model phan tich sentiment va phan loai noi dung. Du lieu duoc luu vao Google Sheets de theo doi.\n\nKet qua: Giam 90% thoi gian thu thap thu cong. Cung cap bao cao insight hang ngay tu dong.`,
    tools: ['Telethon', 'n8n', 'AI/LLM', 'Google Sheets', 'Python'],
    images: ['/placeholder-telegram-1.jpg', '/placeholder-telegram-2.jpg'],
    videos: [],
    websiteUrl: '',
    featured: true,
  },
  {
    id: 'x-apify',
    title: 'Thu thap du lieu X bang Apify',
    category: 'analysis',
    shortDescription: 'Tu dong scrape du lieu tu X (Twitter) thong qua Apify, tra ve n8n de phan tich.',
    storyText: `Boi canh: Can theo doi cac cuoc trao doi tren X ve cac chu de cu the de ho tro ra quyet dinh marketing va noi dung.\n\nMuc tieu: Tu dong hoa viec thu thap tweet, profile, va engagement metrics tu X.\n\nCach lam: Su dung Apify Actor de scrape du lieu X, n8n xu ly va lam sach du lieu, AI phan tich xu huong va sentiment.\n\nKet qua: Co kha nang theo doi real-time cac chu de quan trong, tao bao cao tu dong hang tuan.`,
    tools: ['Apify', 'n8n', 'AI/LLM', 'Google Sheets'],
    images: ['/placeholder-x-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: false,
  },
  {
    id: 'social-tracking',
    title: 'Theo doi so lieu social & web',
    category: 'analysis',
    shortDescription: 'He thong theo doi va phan tich chi so social media va website theo thoi gian thuc.',
    storyText: `Boi canh: Quan ly nhieu kenh social media va website cung luc, can dashboard tong hop de theo doi hieu qua.\n\nMuc tieu: Tao he thong tu dong thu thap metrics tu nhieu nguon, hien thi tren dashboard de an.\n\nCach lam: Ket noi API cua cac nen tang (Facebook, Instagram, Google Analytics), xu ly du lieu qua n8n, hien thi tren Google Sheets/Data Studio.\n\nKet qua: Dashboard real-time cho phep theo doi hieu qua noi dung, toi uu chien luoc dang bai.`,
    tools: ['Google Analytics', 'Facebook API', 'n8n', 'Google Sheets', 'Data Studio'],
    images: ['/placeholder-social-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: false,
  },
  {
    id: 'appsheet-student',
    title: 'App quan ly hoc sinh bang AppSheet',
    category: 'analysis',
    shortDescription: 'Ung dung quan ly thong tin hoc sinh, diem danh va theo doi tien do hoc tap.',
    storyText: `Boi canh: Trung tam giao duc can cong cu don gian de quan ly thong tin hoc sinh ma khong can lap trinh phuc tap.\n\nMuc tieu: Xay dung app mobile-friendly cho giao vien va quan ly su dung hang ngay.\n\nCach lam: Dung AppSheet ket noi Google Sheets lam database, thiet ke UI than thien, tao cac flow diem danh va thong bao tu dong.\n\nKet qua: Giao vien tiet kiem 2 gio/ngay cho viec quan ly hanh chinh. 100% diem danh duoc so hoa.`,
    tools: ['AppSheet', 'Google Sheets', 'Google Apps Script'],
    images: ['/placeholder-appsheet-1.jpg', '/placeholder-appsheet-2.jpg'],
    videos: [],
    websiteUrl: '',
    featured: true,
  },
  {
    id: 'tour-form',
    title: 'Form danh gia tour du lich',
    category: 'analysis',
    shortDescription: 'He thong form thu thap va danh gia chat luong tour du lich bang Google Apps Script.',
    storyText: `Boi canh: Cong ty du lich can he thong danh gia tour tu dong thay vi thu thap feedback bang giay.\n\nMuc tieu: So hoa toan bo quy trinh danh gia tour, tu thu thap den bao cao.\n\nCach lam: Thiet ke Google Form voi logic phan nhanh, dung Apps Script xu ly du lieu, tao bao cao tu dong gui email cho quan ly.\n\nKet qua: Toc do xu ly feedback tang 5 lan. Quan ly nhan bao cao tong hop ngay sau moi tour.`,
    tools: ['Google Forms', 'Google Apps Script', 'Google Sheets'],
    images: ['/placeholder-tour-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: false,
  },

  // ====== AUTOMATION ======
  {
    id: 'telegram-post',
    title: 'Tu dong dang bai Telegram channel',
    category: 'automation',
    shortDescription: 'He thong tu dong dang bai len Telegram channel theo lich trinh va noi dung dat truoc.',
    storyText: `Boi canh: Quan ly nhieu Telegram channel, can dang bai deu dan ma khong ton thoi gian thu cong.\n\nMuc tieu: Tu dong hoa toan bo quy trinh tu viet noi dung den dang bai.\n\nCach lam: Content duoc chuan bi trong Google Sheets, n8n doc va xu ly theo lich trinh, gui len Telegram Bot API.\n\nKet qua: Dang 30+ bai/ngay tren nhieu channel ma khong can thao tac thu cong.`,
    tools: ['n8n', 'Telegram Bot API', 'Google Sheets'],
    images: ['/placeholder-tg-post-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: true,
  },
  {
    id: 'telegram-group-internal',
    title: 'Tu dong dang bai Telegram group noi bo',
    category: 'automation',
    shortDescription: 'Dang thong bao va noi dung tu dong vao group Telegram nhan vien noi bo.',
    storyText: `Boi canh: Nhan vien can nhan thong bao va noi dung noi bo hang ngay mot cach nhat quan.\n\nMuc tieu: Tu dong gui thong bao, nhac lich, va noi dung dao tao vao group noi bo.\n\nCach lam: n8n ket noi Google Calendar va Sheets, tu dong gui tin nhan co dinh dang vao group qua Telegram Bot.\n\nKet qua: 100% thong bao duoc gui dung gio, giam 80% thoi gian quan ly truyen thong noi bo.`,
    tools: ['n8n', 'Telegram Bot API', 'Google Calendar', 'Google Sheets'],
    images: ['/placeholder-tg-group-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: false,
  },
  {
    id: 'fb-auto-post',
    title: 'Tu dong dang Facebook tu Google Sheets',
    category: 'automation',
    shortDescription: 'He thong tu dong dang bai len Facebook Page tu noi dung trong Google Sheets.',
    storyText: `Boi canh: Doi marketing can dang bai deu dan tren Facebook nhung mat nhieu thoi gian thao tac thu cong.\n\nMuc tieu: Cho phep doi content chi can nhap noi dung vao Sheets, bai se tu dong len Facebook.\n\nCach lam: Google Sheets lam CMS, n8n doc noi dung theo lich, goi Facebook Graph API de dang bai voi hinh anh.\n\nKet qua: Tiet kiem 3 gio/ngay cho doi marketing. Bai dang dung gio, khong bi sot.`,
    tools: ['n8n', 'Facebook Graph API', 'Google Sheets'],
    images: ['/placeholder-fb-post-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: true,
  },
  {
    id: 'fb-to-zalo-wp',
    title: 'Dong bo Fanpage sang Zalo va Wordpress',
    category: 'automation',
    shortDescription: 'Tu dong lay bai tu Facebook Fanpage va dang len Zalo OA va Wordpress.',
    storyText: `Boi canh: Noi dung tren Fanpage can duoc dong bo sang nhieu kenh khac ma khong can copy-paste thu cong.\n\nMuc tieu: Moi bai dang tren Fanpage se tu dong xuat hien tren Zalo OA va website Wordpress.\n\nCach lam: n8n webhook lang nghe Facebook Fanpage, xu ly noi dung va hinh anh, gui len Zalo OA API va Wordpress REST API.\n\nKet qua: Noi dung dong bo tren 3 kenh chi voi 1 lan dang. Toc do phan phoi tang 3 lan.`,
    tools: ['n8n', 'Facebook API', 'Zalo OA API', 'Wordpress REST API'],
    images: ['/placeholder-sync-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: false,
  },
  {
    id: 'n8n-media',
    title: 'Workflow n8n cho media va web',
    category: 'automation',
    shortDescription: 'Xay dung he thong workflow tu dong hoa cho cac hoat dong media va web.',
    storyText: `Boi canh: Cac hoat dong media va web (xu ly hinh, dang bai, thong bao, bao cao) dang lam thu cong, roi rac.\n\nMuc tieu: Tao he thong workflow thong nhat, tu dong hoa toan bo chuoi cong viec.\n\nCach lam: Thiet ke cac workflow n8n ket noi nhieu dich vu: image processing, CMS, social media, email, va notification.\n\nKet qua: Giam 70% thoi gian van hanh. He thong chay 24/7 khong can giam sat.`,
    tools: ['n8n', 'Webhook', 'REST API', 'Google Suite'],
    images: ['/placeholder-n8n-1.jpg', '/placeholder-n8n-2.jpg'],
    videos: [],
    websiteUrl: '',
    featured: true,
  },
  {
    id: 'n8n-bingx',
    title: 'Flow n8n cho BingX',
    category: 'automation',
    shortDescription: 'Workflow tu dong cho nen tang BingX, tu theo doi den thong bao.',
    storyText: `Boi canh: Can theo doi va tu dong hoa mot so thao tac tren nen tang BingX.\n\nMuc tieu: Xay dung flow tu dong theo doi, xu ly du lieu, va gui thong bao.\n\nCach lam: Ket noi BingX API voi n8n, tao cac trigger va action tu dong, gui thong bao qua Telegram.\n\nKet qua: Phan hoi nhanh hon, khong bo lo thong tin quan trong.`,
    tools: ['n8n', 'BingX API', 'Telegram Bot'],
    images: ['/placeholder-bingx-1.jpg'],
    videos: [],
    websiteUrl: '',
    featured: false,
  },

  // ====== AI ======
  {
    id: 'threejs-hackathon',
    title: 'Website ThreeJS cho Hackathon',
    category: 'ai',
    shortDescription: 'Website 3D tuong tac xay dung cho Hackathon Commandos bang Three.js.',
    storyText: `Boi canh: Tham gia Hackathon can tao mot san pham web an tuong trong thoi gian ngan.\n\nMuc tieu: Xay dung website 3D tuong tac de trinh bay y tuong, tao trai nghiem khac biet.\n\nCach lam: Su dung Three.js va React Three Fiber, thiet ke scene 3D, toi uu hieu nang cho web.\n\nKet qua: San pham tao an tuong manh tai Hackathon. Website chay muot tren ca desktop va mobile.`,
    tools: ['Three.js', 'React Three Fiber', 'React', 'TypeScript', 'Vite'],
    images: ['/placeholder-hackathon-1.jpg', '/placeholder-hackathon-2.jpg'],
    videos: [],
    websiteUrl: '',
    featured: true,
  },
  {
    id: 'ai-video',
    title: 'Lam video voi AI',
    category: 'ai',
    shortDescription: 'San xuat video bang cong cu AI — OiiOii va Claude skills.',
    storyText: `Boi canh: Can tao video content nhanh chong ma khong can ekip quay phim truyen thong.\n\nMuc tieu: Su dung AI de tao video tu script den san pham hoan chinh.\n\nCach lam: Dung Claude de viet script va storyboard, OiiOii de tao video tu AI, chinh sua va xuat ban.\n\nKet qua: Tao duoc video chat luong trong vai gio thay vi vai ngay. Chi phi giam 80%.`,
    tools: ['OiiOii', 'Claude', 'AI Video Generation', 'Claude Skills'],
    images: ['/placeholder-video-1.jpg'],
    videos: ['/placeholder-video-demo.mp4'],
    websiteUrl: '',
    featured: true,
  },
  {
    id: 'ai-shopping-assistant',
    title: 'Tro ly mua sam AI',
    category: 'ai',
    shortDescription: 'Do an tot nghiep — Xay dung tro ly mua sam thong minh bang n8n va Lovable.',
    storyText: `Boi canh: Do an tot nghiep voi de tai ung dung AI vao thuong mai dien tu.\n\nMuc tieu: Xay dung chatbot tro ly mua sam co kha nang hieu ngu canh, goi y san pham, va ho tro dat hang.\n\nCach lam: Su dung n8n lam backend orchestration, Lovable lam frontend, ket noi AI model de xu ly ngon ngu tu nhien va de xuat san pham.\n\nKet qua: Chatbot co the tu van san pham voi do chinh xac 85%. Do an dat diem cao.`,
    tools: ['n8n', 'Lovable', 'AI/LLM', 'REST API', 'React'],
    images: ['/placeholder-shopping-1.jpg', '/placeholder-shopping-2.jpg'],
    videos: [],
    websiteUrl: '',
    featured: true,
  },
]

export function getProjectsByCategory(category: Project['category']): Project[] {
  return projects.filter((p) => p.category === category)
}
