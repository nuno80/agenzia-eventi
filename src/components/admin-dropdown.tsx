"use client";

import Link from "next/link";

import {
  Activity,
  BarChart,
  Calendar,
  ChevronDown,
  Home,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-sm font-medium hover:text-cyan"
        >
          <Home className="h-4 w-4" />
          Admin
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Dashboard principale */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Dashboard principale</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Gestione Utenti */}
        <DropdownMenuItem asChild>
          <Link href="/admin/users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Gestione Utenti</span>
          </Link>
        </DropdownMenuItem>

        {/* Gestione Eventi */}
        <DropdownMenuItem asChild>
          <Link href="/admin/events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Gestione Eventi</span>
            <span className="ml-auto rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
              Nuovo
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Altre opzioni admin */}
        <DropdownMenuItem asChild>
          <Link href="/admin/stats" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Statistiche dettagliate</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/admin/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Impostazioni</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
