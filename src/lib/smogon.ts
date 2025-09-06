export type DataSource = "Smogon" | "Custom"

export type SmogonFormat = {
  name: string
  ruleset: string[]
  banlist: string[]
  clauses: string[]
  source?: DataSource
}

export interface BanlistEntry {
  name: string
  source: DataSource
}

export interface BanlistData {
  format: string
  ruleset: string[]
  clauses: string[]
  bannedPokemon: BanlistEntry[]
  bannedMoves: BanlistEntry[]
  bannedAbilities: BanlistEntry[]
  bannedItems: BanlistEntry[]
}

interface CustomFormat {
  name?: string
  description?: string
  clauses: string[]
  bannedPokemon: string[]
  bannedMoves: string[]
  bannedAbilities: string[]
  bannedItems: string[]
}

interface CustomRulesets {
  formats: Record<string, CustomFormat>
}

export class SmogonService {
  private static readonly SMOGON_FORMATS_BASE_URL = 'https://pkmn.github.io/smogon/formats'
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private static cache: Map<string, { data: unknown; timestamp: number }> = new Map()

  /**
   * Lấy dữ liệu format từ Smogon theo id, chuẩn hóa về SmogonFormat
   */
  static async getSmogonFormatById(formatId: string): Promise<SmogonFormat | null> {
    try {
      const cacheKey = `smogon-format-${formatId}`
      const cached = this.cache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data as SmogonFormat
      }

      const response = await fetch(`${this.SMOGON_FORMATS_BASE_URL}/${formatId}.json`)
      if (!response.ok) {
        throw new Error(`Smogon API error: ${response.status}`)
      }

      const raw = (await response.json()) as { name?: string; ruleset?: string[]; banlist?: string[] }
      const ruleset = Array.isArray(raw.ruleset) ? raw.ruleset : []
      const clauses = ruleset.filter(rule => rule.toLowerCase().includes('clause'))

      const result: SmogonFormat = {
        name: raw.name ?? formatId,
        ruleset,
        banlist: Array.isArray(raw.banlist) ? raw.banlist : [],
        clauses,
        source: "Smogon",
      }

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() })
      return result

    } catch (error) {
      console.error(`Lỗi khi lấy dữ liệu format Smogon ${formatId}:`, error)
      return null
    }
  }

  /**
   * Lấy banlist từ Smogon cho format app ('1v1' | '2v2')
   */
  static async getSmogonBanlist(format: string): Promise<string[]> {
    try {
      const map: Record<string, string> = {
        '1v1': 'gen9-1v1',
        '2v2': 'gen9vgc2024series12',
      }
      const formatId = map[format]
      if (!formatId) return []

      const smogon = await this.getSmogonFormatById(formatId)
      return smogon?.banlist ?? []

    } catch (error) {
      console.error('Lỗi khi lấy banlist Smogon:', error)
      return []
    }
  }

  /**
   * Kết hợp banlist từ Smogon với custom banlist
   */
  static async getCombinedBanlist(format: string): Promise<BanlistData> {
    try {
      // Lấy custom banlist
      const customModule = await import('@/data/rulesets.json')
      const customRulesets: CustomRulesets =
        (customModule as { default?: CustomRulesets })?.default ??
        (customModule as unknown as CustomRulesets)
      const customFormat = customRulesets.formats[format]
      
      if (!customFormat) {
        throw new Error(`Format ${format} không tồn tại trong custom rulesets`)
      }

      // Lấy banlist & clauses từ Smogon
      const map: Record<string, string> = {
        '1v1': 'gen9-1v1',
        '2v2': 'gen9vgc2024series12',
      }
      const formatId = map[format]
      const smogonFormat = formatId ? await this.getSmogonFormatById(formatId) : null
      const smogonBanlist = smogonFormat?.banlist ?? []

      // OP list bổ sung riêng cho 2v2 (Cobblemon)
      const vgcOpList: string[] = [
        'Annihilape', 'Dragapult', 'Garchomp', 'Chi-Yu', 'Flutter Mane', 'Iron Bundle'
      ]
      const customExtraPokemon = format === '2v2' ? vgcOpList : []
      
      // Kết hợp banlist (ưu tiên custom banlist, bổ sung từ Smogon)
      const combinedBannedPokemonSet = new Set<string>([...customFormat.bannedPokemon, ...customExtraPokemon])
      smogonBanlist.forEach(item => {
        if (
          !combinedBannedPokemonSet.has(item) &&
          !customFormat.bannedMoves.includes(item) &&
          !customFormat.bannedAbilities.includes(item) &&
          !customFormat.bannedItems.includes(item)
        ) {
          combinedBannedPokemonSet.add(item)
        }
      })

      // Tạo entries có nguồn
      const toEntries = (items: string[], src: DataSource): BanlistEntry[] => items.map(name => ({ name, source: src }))

      const customPokemonSet = new Set<string>([...customFormat.bannedPokemon, ...customExtraPokemon])
      const smogonOnlyPokemon = Array.from(combinedBannedPokemonSet).filter(p => !customPokemonSet.has(p))

      return {
        format,
        ruleset: Array.isArray(smogonFormat?.ruleset) ? smogonFormat!.ruleset : [],
        clauses: Array.from(new Set([...(customFormat.clauses || []), ...(smogonFormat?.clauses || [])])),
        bannedPokemon: [
          ...toEntries([...customFormat.bannedPokemon, ...customExtraPokemon], 'Custom'),
          ...toEntries(smogonOnlyPokemon, 'Smogon'),
        ],
        bannedMoves: toEntries(customFormat.bannedMoves, 'Custom'),
        bannedAbilities: toEntries(customFormat.bannedAbilities, 'Custom'),
        bannedItems: toEntries(customFormat.bannedItems, 'Custom'),
      }

    } catch (error) {
      console.error(`Lỗi khi kết hợp banlist cho format ${format}:`, error)
      
      // Fallback về custom banlist nếu có lỗi
      const customModule = await import('@/data/rulesets.json')
      const customRulesets: CustomRulesets =
        (customModule as { default?: CustomRulesets })?.default ??
        (customModule as unknown as CustomRulesets)
      const customFormat = customRulesets.formats[format]
      
      if (customFormat) {
        const toEntries = (items: string[], src: DataSource): BanlistEntry[] => items.map(name => ({ name, source: src }))
        return {
          format,
          ruleset: [],
          clauses: customFormat.clauses,
          bannedPokemon: toEntries(customFormat.bannedPokemon, 'Custom'),
          bannedMoves: toEntries(customFormat.bannedMoves, 'Custom'),
          bannedAbilities: toEntries(customFormat.bannedAbilities, 'Custom'),
          bannedItems: toEntries(customFormat.bannedItems, 'Custom')
        }
      }

      throw error
    }
  }

  /**
   * Kiểm tra xem một Pokémon có bị ban trong format không
   */
  static async isPokemonBanned(pokemonName: string, format: string): Promise<boolean> {
    try {
      const banlist = await this.getCombinedBanlist(format)
      return banlist.bannedPokemon.some(entry => entry.name === pokemonName)
    } catch (error) {
      console.error(`Lỗi khi kiểm tra ban status cho ${pokemonName}:`, error)
      return false
    }
  }

  /**
   * Kiểm tra xem một move có bị ban trong format không
   */
  static async isMoveBanned(moveName: string, format: string): Promise<boolean> {
    try {
      const banlist = await this.getCombinedBanlist(format)
      return banlist.bannedMoves.some(entry => entry.name === moveName)
    } catch (error) {
      console.error(`Lỗi khi kiểm tra ban status cho move ${moveName}:`, error)
      return false
    }
  }

  /**
   * Làm mới cache
   */
  static clearCache(): void {
    this.cache.clear()
  }
}
