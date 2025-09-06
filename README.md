# Cobblemon Hub - Pokémon Tournament Website

Website hiện đại để hiển thị **Pokédex** và **luật giải đấu** cho game Minecraft mod **Cobblemon**, với UI/UX tham khảo từ [Cobbledex.info](https://www.cobbledex.info).

## 🚀 Tính năng chính

### 1. **Pokédex Đầy Đủ**
- Grid layout responsive (4 columns desktop, 2 mobile)
- Tìm kiếm và lọc theo thế hệ, hệ
- Chi tiết Pokémon: stats, moves, evolution, sprites
- Type effectiveness chart
- Radar chart cho base stats
- Format legality badges

### 2. **Tournament Rules với Banlist Động**
- 2 format: **2vs2 Doubles** & **1vs1 Singles**
- Tích hợp Smogon API + custom banlist
- Real-time banlist updates
- Clauses và rules chi tiết

### 3. **Global Search**
- Autocomplete search bar
- Tìm kiếm Pokémon, moves, items, rules
- Grouped results theo category

### 4. **User System**
- Authentication với NextAuth.js
- Role-based access control (Viewer/Mod/Admin)
- User profiles và team builder

### 5. **Admin Panel**
- CRUD Tournament Rules
- CRUD EV Training Guides
- User management
- Audit logs

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts (Radar charts)
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL với Prisma ORM
- **External APIs**: PokeAPI, Smogon API
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Deployment**: Vercel + GitHub Actions

## 🎨 Design System

### Phong cách Cobbledex
- **Dark theme** mặc định
- **Font**: Inter
- **Cards**: rounded-2xl, shadow-md, hover:scale-105
- **Type chips**: màu gradient theo hệ
- **Grid responsive**: mobile-first design

### Color Palette
```css
--background: #0a0a0a
--foreground: #fafafa
--card: #111111
--primary: #3b82f6
--border: #262626
```

## 🚀 Cách chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Setup database
```bash
npx prisma generate
npx prisma db push
```

### 3. Chạy development server
```bash
npm run dev
```

### 4. Truy cập website
Mở [http://localhost:3000](http://localhost:3000) trong browser

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── pokedex/           # Pokédex page
│   ├── tournament-rules/  # Tournament rules page
│   └── ...
├── components/            # React components
│   ├── layout/           # Header, Footer, MobileNav
│   ├── pokemon/          # Pokémon-related components
│   ├── search/           # Search components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── pokeapi.ts        # PokeAPI integration
│   └── smogon.ts         # Smogon API integration
└── types/                # TypeScript types
```

## 🔧 API Endpoints

### Rules API
- `GET /api/rules?format={format}` - Lấy banlist
- `POST /api/rules` - Refresh banlist
- `GET /api/rules/check` - Kiểm tra ban status

### PokeAPI Integration
- Tự động sync Pokémon data
- Cache 24 giờ
- Fallback khi API lỗi

## 🎯 Tính năng nâng cao

### Banlist System
- **Smogon Integration**: Tự động sync từ Smogon API
- **Custom Rules**: Banlist cho Cobblemon meta
- **Real-time Updates**: Refresh banlist on-demand
- **Format Support**: 2v2 Doubles, 1v1 Singles

### Type System
- **TypeChip Component**: Gradient colors theo hệ
- **Type Effectiveness**: Chart hiển thị hiệu quả tấn công
- **Type Colors**: 18 types với màu sắc chuẩn

### Responsive Design
- **Mobile-first**: Optimized cho mobile
- **Grid System**: 4 columns desktop, 2 mobile
- **Sticky Header**: Search bar luôn hiển thị
- **Touch-friendly**: Hover effects và transitions

## 🧪 Testing

### Unit Tests (Vitest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### All Tests
```bash
npm run test:all
```

## 🚀 Deployment

### Vercel
1. Connect GitHub repository
2. Auto-deploy từ main branch
3. Environment variables setup

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 📚 Documentation

- [Banlist System](./docs/BANLIST_SYSTEM.md) - Hướng dẫn hệ thống banlist
- [API Reference](./docs/API.md) - API documentation
- [Component Library](./docs/COMPONENTS.md) - Component documentation

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - Xem [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- [Cobbledex.info](https://www.cobbledex.info) - UI/UX inspiration
- [PokeAPI](https://pokeapi.co) - Pokémon data
- [Smogon](https://www.smogon.com) - Competitive rules
- [shadcn/ui](https://ui.shadcn.com) - UI components