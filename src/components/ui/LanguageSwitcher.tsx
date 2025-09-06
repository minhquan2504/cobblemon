"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { Locale, supportedLocales, localeNames } from "@/lib/i18n"

interface LanguageSwitcherProps {
  currentLocale: Locale
  onLocaleChange: (locale: Locale) => void
}

export function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLocales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onLocaleChange(locale)}
            className={currentLocale === locale ? "bg-muted" : ""}
          >
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
