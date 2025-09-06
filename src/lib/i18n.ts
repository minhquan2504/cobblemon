// Internationalization utilities
export type Locale = "vi" | "en"

export const defaultLocale: Locale = "vi"
export const supportedLocales: Locale[] = ["vi", "en"]

export const localeNames: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English"
}

export const translations = {
  vi: {
    // Navigation
    "nav.pokedex": "Pokédex",
    "nav.tournament-rules": "Luật Giải Đấu",
    "nav.rank-rules": "Luật Rank",
    "nav.ev-training": "EV Training",
    "nav.profile": "Hồ sơ cá nhân",
    "nav.admin": "Quản trị",
    "nav.settings": "Cài đặt",
    "nav.logout": "Đăng xuất",
    "nav.login": "Đăng nhập",
    "nav.register": "Đăng ký",
    
    // Search
    "search.placeholder": "Tìm kiếm Pokémon, moves, items...",
    "search.no-results": "Không tìm thấy kết quả cho",
    "search.pokemon": "Pokémon",
    "search.move": "Move",
    "search.item": "Item",
    "search.format": "Format",
    
    // Pokemon
    "pokemon.stats": "Stats",
    "pokemon.moves": "Moves",
    "pokemon.evolution": "Evolution",
    "pokemon.abilities": "Abilities",
    "pokemon.radar": "Radar",
    "pokemon.type-chart": "Type Chart",
    "pokemon.comparison": "So sánh Pokémon",
    "pokemon.hp": "HP",
    "pokemon.atk": "Tấn công",
    "pokemon.def": "Phòng thủ",
    "pokemon.spa": "Tấn công đặc biệt",
    "pokemon.spd": "Phòng thủ đặc biệt",
    "pokemon.spe": "Tốc độ",
    
    // Type Chart
    "type-chart.title": "Type Chart",
    "type-chart.attacking": "Tấn công",
    "type-chart.defending": "Phòng thủ",
    "type-chart.select-type": "Chọn type để",
    "type-chart.effectiveness": "Hiệu quả",
    "type-chart.no-effect": "No Effect",
    "type-chart.not-very-effective": "Not Very Effective",
    "type-chart.normal": "Normal",
    "type-chart.super-effective": "Super Effective",
    
    // Format Legality
    "legality.allowed": "Allowed",
    "legality.banned": "Banned",
    "legality.conditional": "Conditional",
    
    // User Profile
    "profile.title": "Hồ sơ cá nhân",
    "profile.subtitle": "Quản lý thông tin cá nhân và team Pokémon",
    "profile.personal-info": "Thông tin cá nhân",
    "profile.teams": "Teams của tôi",
    "profile.create-team": "Tạo team mới",
    "profile.team-name": "Tên team",
    "profile.team-description": "Mô tả (tùy chọn)",
    "profile.pokemon-count": "Pokémon",
    "profile.total-teams": "Tổng teams",
    "profile.total-pokemon": "Tổng Pokémon",
    "profile.role.admin": "Quản trị viên",
    "profile.role.mod": "Điều hành viên",
    "profile.role.viewer": "Người xem",
    
    // Admin Panel
    "admin.title": "Admin Panel",
    "admin.subtitle": "Quản lý hệ thống và nội dung",
    "admin.overview": "Tổng quan",
    "admin.users": "Người dùng",
    "admin.rules": "Tournament Rules",
    "admin.guides": "EV Guides",
    "admin.audit": "Audit Logs",
    "admin.total-users": "Tổng người dùng",
    "admin.tournament-rules": "Tournament Rules",
    "admin.ev-guides": "EV Guides",
    "admin.recent-activity": "Hoạt động gần đây",
    "admin.create-rule": "Tạo rule mới",
    "admin.create-guide": "Tạo guide mới",
    "admin.rule-name": "Tên rule",
    "admin.rule-format": "Format",
    "admin.rule-description": "Mô tả",
    "admin.guide-title": "Tiêu đề",
    "admin.guide-pokemon": "Pokémon",
    "admin.guide-ev": "EV Spread",
    "admin.guide-description": "Mô tả",
    
    // Common
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.delete": "Xóa",
    "common.edit": "Sửa",
    "common.create": "Tạo",
    "common.close": "Đóng",
    "common.loading": "Đang tải...",
    "common.error": "Có lỗi xảy ra",
    "common.success": "Thành công",
    "common.confirm": "Xác nhận",
    "common.yes": "Có",
    "common.no": "Không"
  },
  en: {
    // Navigation
    "nav.pokedex": "Pokédex",
    "nav.tournament-rules": "Tournament Rules",
    "nav.rank-rules": "Rank Rules",
    "nav.ev-training": "EV Training",
    "nav.profile": "Profile",
    "nav.admin": "Admin",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.login": "Login",
    "nav.register": "Register",
    
    // Search
    "search.placeholder": "Search Pokémon, moves, items...",
    "search.no-results": "No results found for",
    "search.pokemon": "Pokémon",
    "search.move": "Move",
    "search.item": "Item",
    "search.format": "Format",
    
    // Pokemon
    "pokemon.stats": "Stats",
    "pokemon.moves": "Moves",
    "pokemon.evolution": "Evolution",
    "pokemon.abilities": "Abilities",
    "pokemon.radar": "Radar",
    "pokemon.type-chart": "Type Chart",
    "pokemon.comparison": "Compare Pokémon",
    "pokemon.hp": "HP",
    "pokemon.atk": "Attack",
    "pokemon.def": "Defense",
    "pokemon.spa": "Sp. Attack",
    "pokemon.spd": "Sp. Defense",
    "pokemon.spe": "Speed",
    
    // Type Chart
    "type-chart.title": "Type Chart",
    "type-chart.attacking": "Attacking",
    "type-chart.defending": "Defending",
    "type-chart.select-type": "Select type to",
    "type-chart.effectiveness": "Effectiveness",
    "type-chart.no-effect": "No Effect",
    "type-chart.not-very-effective": "Not Very Effective",
    "type-chart.normal": "Normal",
    "type-chart.super-effective": "Super Effective",
    
    // Format Legality
    "legality.allowed": "Allowed",
    "legality.banned": "Banned",
    "legality.conditional": "Conditional",
    
    // User Profile
    "profile.title": "Personal Profile",
    "profile.subtitle": "Manage your personal information and Pokémon teams",
    "profile.personal-info": "Personal Information",
    "profile.teams": "My Teams",
    "profile.create-team": "Create New Team",
    "profile.team-name": "Team Name",
    "profile.team-description": "Description (optional)",
    "profile.pokemon-count": "Pokémon",
    "profile.total-teams": "Total Teams",
    "profile.total-pokemon": "Total Pokémon",
    "profile.role.admin": "Administrator",
    "profile.role.mod": "Moderator",
    "profile.role.viewer": "Viewer",
    
    // Admin Panel
    "admin.title": "Admin Panel",
    "admin.subtitle": "Manage system and content",
    "admin.overview": "Overview",
    "admin.users": "Users",
    "admin.rules": "Tournament Rules",
    "admin.guides": "EV Guides",
    "admin.audit": "Audit Logs",
    "admin.total-users": "Total Users",
    "admin.tournament-rules": "Tournament Rules",
    "admin.ev-guides": "EV Guides",
    "admin.recent-activity": "Recent Activity",
    "admin.create-rule": "Create New Rule",
    "admin.create-guide": "Create New Guide",
    "admin.rule-name": "Rule Name",
    "admin.rule-format": "Format",
    "admin.rule-description": "Description",
    "admin.guide-title": "Title",
    "admin.guide-pokemon": "Pokémon",
    "admin.guide-ev": "EV Spread",
    "admin.guide-description": "Description",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No"
  }
}

export function getTranslation(key: string, locale: Locale = defaultLocale): string {
  const keys = key.split(".")
  let value: unknown = translations[locale] as unknown
  
  for (const k of keys) {
    if (value !== null && typeof value === "object" && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k]
    } else {
      value = undefined
      break
    }
  }
  
  return typeof value === "string" ? value : key
}

export function useTranslation(locale: Locale = defaultLocale) {
  return (key: string) => getTranslation(key, locale)
}
