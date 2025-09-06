# Hệ thống Banlist Động - Pokémon Tournament Hub

## Tổng quan

Hệ thống banlist động cho phép quản lý và hiển thị danh sách cấm cho các format thi đấu khác nhau, kết hợp dữ liệu từ Smogon API với banlist custom.

## Tính năng chính

### 1. Tích hợp Smogon API
- Tự động đồng bộ banlist từ Smogon cho các format được hỗ trợ
- Cache dữ liệu trong 24 giờ để tối ưu hiệu suất
- Fallback về banlist custom khi Smogon API không khả dụng

### 2. Banlist Custom
- File `/data/rulesets.json` chứa banlist custom cho Cobblemon meta
- Hỗ trợ 2 format: 2vs2 Doubles và 1vs1 Singles
- Bao gồm các loại ban: Pokémon, Moves, Abilities, Items

### 3. API Endpoints

#### GET `/api/rules?format={format}`
Lấy banlist cho format cụ thể.

**Parameters:**
- `format`: "2v2" hoặc "1v1"

**Response:**
```json
{
  "format": "2v2",
  "clauses": ["Species Clause", "Sleep Clause", ...],
  "bannedPokemon": ["Arceus", "Mewtwo", ...],
  "bannedMoves": ["Fissure", "Sheer Cold", ...],
  "bannedAbilities": ["Moody"],
  "bannedItems": ["Focus Sash", "King's Rock", ...]
}
```

#### POST `/api/rules`
Làm mới cache và trả về banlist mới.

**Body:**
```json
{
  "action": "refresh",
  "format": "2v2"
}
```

#### GET `/api/rules/check?format={format}&pokemon={name}&move={name}&ability={name}&item={name}`
Kiểm tra trạng thái ban của một entity cụ thể.

**Response:**
```json
{
  "format": "2v2",
  "results": {
    "pokemon": true,
    "move": false,
    "ability": false,
    "item": true
  }
}
```

## Cấu trúc dữ liệu

### Format hỗ trợ
- **2v2**: 2vs2 Doubles (All Gen) - dựa trên Smogon Doubles OU
- **1v1**: 1vs1 Singles (All Gen) - dựa trên Smogon 1v1

### Banlist Custom

#### Pokémon Auto-ban
- Tất cả Legendary, Mythical, Ultra Beast, Paradox
- Pseudo-Legendaries (Dragonite, Tyranitar, Salamence, Metagross, Garchomp, Hydreigon, Goodra, Kommo-o, Dragapult, Baxcalibur)
- Pokémon đặc biệt OP: Annihilape, Espathra, Chi-Yu, Flutter Mane, Zacian, Calyrex, Miraidon, Koraidon, Arceus

#### Moves Auto-ban
- OHKO moves: Fissure, Sheer Cold, Guillotine, Horn Drill
- Baton Pass
- Perish Song
- Double Team, Minimize
- Swagger

#### Abilities Auto-ban
- Moody

#### Items Auto-ban
- Focus Sash
- Bright Powder, Lax Incense
- King's Rock, Razor Fang
- Quick Claw

## Sử dụng trong UI

### Tournament Rules Page
- Hiển thị banlist theo format được chọn
- Tìm kiếm và lọc theo loại (Pokémon, Moves, Abilities, Items)
- Nút refresh để cập nhật banlist từ Smogon
- Hiển thị thời gian cập nhật cuối cùng

### FormatLegalityBadge Component
```tsx
// Kiểm tra ban status động
<FormatLegalityBadge 
  format="2v2" 
  pokemonName="Arceus" 
/>

// Hoặc sử dụng status tĩnh
<FormatLegalityBadge 
  status="Banned" 
  format="2v2" 
/>
```

## Cấu hình

### SmogonService
- Cache duration: 24 giờ
- Base URL: `https://pkmn.github.io/smogon/data`
- Format mapping: 2v2 → doublesou, 1v1 → 1v1

### Error Handling
- Fallback về banlist custom khi Smogon API lỗi
- Toast notifications cho user feedback
- Console logging cho debugging

## Phát triển

### Thêm format mới
1. Cập nhật `availableFormats` trong `tournament-rules/page.tsx`
2. Thêm format vào `data/rulesets.json`
3. Cập nhật `formatMap` trong `SmogonService`

### Thêm loại ban mới
1. Cập nhật interface `BanlistData`
2. Thêm field mới vào `data/rulesets.json`
3. Cập nhật UI để hiển thị loại ban mới

### Custom banlist logic
Chỉnh sửa file `data/rulesets.json` để thêm/xóa items khỏi banlist custom.
