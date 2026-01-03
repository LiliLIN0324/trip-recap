
import { Memory } from './types';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Forbidden City Snow',
    images: [
      'https://images.unsplash.com/photo-1552554706-73b162698b78?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599571234909-29ed5d13c1d6?auto=format&fit=crop&q=80&w=800'
    ],
    date: '2025-01-05',
    location: { lat: 39.9163, lng: 116.3972, name: 'Beijing, Forbidden City' },
    activityType: 'Travel',
    description: 'White snow on red walls. Experienced the most authentic winter atmosphere in the Forbidden City.',
  },
  {
    id: '2',
    title: 'Bund Sleepless Night',
    images: [
      'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548919973-5dea585937d5?auto=format&fit=crop&q=80&w=800'
    ],
    date: '2025-02-14',
    location: { lat: 31.2400, lng: 121.4900, name: 'Shanghai, The Bund' },
    activityType: 'Social',
    description: 'The lights on both sides of the Huangpu River are the most charming heartbeat of this city.',
  },
  {
    id: '3',
    title: 'Chengdu Hotpot Night',
    images: [
      'https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800'
    ],
    date: '2025-03-10',
    location: { lat: 30.6574, lng: 104.0764, name: 'Chengdu, Taikoo Li' },
    activityType: 'Food',
    description: 'Boiling red oil is the heat of life. Sitting for a drink at the end of Yulin Road.',
  },
  {
    id: '4',
    title: 'Broken Bridge Snow',
    images: [
      'https://images.unsplash.com/photo-1596434300655-e48d3ff3dd5e?auto=format&fit=crop&q=80&w=800'
    ],
    date: '2025-03-20',
    location: { lat: 30.2596, lng: 120.1534, name: 'Hangzhou, West Lake' },
    activityType: 'Nature',
    description: 'The water is shimmering and the weather is good, and the mountains are misty and the rain is strange.',
  }
];

export const ACTIVITY_COLORS: Record<string, string> = {
  Travel: '#ff00ff',
  Food: '#00ffff',
  Sport: '#00ff00',
  Work: '#ffffff',
  Leisure: '#ffff00',
  Social: '#ff0055',
  Nature: '#33ffaa',
};

export const TRANSLATIONS = {
  en: {
    capacity: "CAPACITY",
    nodes: "NODES",
    recap: "RECAP",
    decoding: "DECODING",
    map: "MAP",
    history: "HISTORY",
    gallery: "GALLERY",
    stats: "STATS",
    accessCore: "Access_Core",
    connectLife: "CONNECT_TO\nYOUR_LIFE.",
    protocol: "Archive Initiated // 2025 Odyssey",
    decodeScroll: "DECODE_SCROLL",
    totalMemories: "Total Memories",
    countries: "Countries",
    peakMonth: "Peak Month",
    topType: "Top Type",
    activityInsights: "Activity Insights",
    activityDistribution: "Activity Distribution",
    memoriesPerMonth: "Memories per Month",
    memoryStream: "Memory Stream",
    momentCount: "Photos",
    timestamp: "TIMESTAMP",
    coordinates: "COORDINATES",
    modality: "MODALITY",
    description: "DESCRIPTION",
    identifier: "IDENTIFIER",
    abort: "ABORT",
    commit: "COMMIT_MEMORY",
    recode: "RECODE_ARCHIVE",
    wipe: "WIPE",
    recode_btn: "RECODE",
    analyze: "AI_DECODE",
    analyzing: "ANALYZING...",
    add_files: "ADD_FILES",
    upload_moment: "Upload Moment",
    lang: "EN"
  },
  zh: {
    capacity: "记忆总数",
    nodes: "足迹点",
    recap: "年度回顾",
    decoding: "正在解码",
    map: "地图",
    history: "时间轴",
    gallery: "图库",
    stats: "统计",
    accessCore: "进入核心",
    connectLife: "连接_\n你的生活",
    protocol: "档案已启动 // 2025 征程",
    decodeScroll: "滑动解码",
    totalMemories: "记忆总数",
    countries: "探索城市",
    peakMonth: "最活跃月份",
    topType: "核心活动",
    activityInsights: "活动洞察",
    activityDistribution: "活动分布",
    memoriesPerMonth: "每月记忆数量",
    memoryStream: "记忆之流",
    momentCount: "张照片",
    timestamp: "时间戳",
    coordinates: "地理坐标",
    modality: "活动类型",
    description: "描述信息",
    identifier: "条目标题",
    abort: "中止",
    commit: "提交记忆",
    recode: "更新档案",
    wipe: "擦除",
    recode_btn: "重编",
    analyze: "AI 识别",
    analyzing: "分析中...",
    add_files: "添加文件",
    upload_moment: "上传瞬间",
    lang: "中文"
  }
};
