<template>
  <Sidebar class="text-white">
    <SidebarHeader>
      <NuxtLink
        :to="$localePath('/')"
        class="flex gap-2 items-center px-2 py-3"
      >
        <NuxtImg
          :src="(appConfig.logo as any).whiteLargeText"
          alt="An-Nadaa"
          class="w-auto h-8"
        />
      </NuxtLink>
    </SidebarHeader>
    <!-- <SidebarSeparator /> -->
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu class="space-y-2">
            <SidebarMenuItem v-for="item in navItems" :key="item.title">
              <NuxtLink :to="$localePath(item.url)">
                <div
                  class="flex gap-2 items-center px-2 py-4 rounded-md"
                  :class="{ 'bg-sidebar-accent': isActive(item.url) }"
                >
                  <component :is="item.icon" />
                  <span class="font-light">{{ item.title }}</span>
                </div>
              </NuxtLink>
              <!-- <SidebarMenuButton
                asChild
                :data-active="isActive(item.url)"
                :is-active="isActive(item.url)"
              > -->
              <!-- </SidebarMenuButton> -->
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div class="flex-1" />
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in utilityItems" :key="item.title">
              <SidebarMenuButton
                asChild
                :data-active="isActive(item.url)"
                :is-active="isActive(item.url)"
              >
                <NuxtLink :to="$localePath(item.url)">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <!-- <SidebarSeparator /> -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="flex gap-3 items-center px-2 py-2">
            <div
              class="flex justify-center items-center w-10 h-10 text-sm font-medium text-white bg-gray-600 rounded-full"
            >
              {{ userInitials }}
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-sm font-medium text-white truncate">
                {{ userDisplayName }}
              </span>
              <span class="text-xs truncate text-white/70">
                {{ userEmail }}
              </span>
            </div>
            <button
              type="button"
              class="flex justify-center items-center w-8 h-8 text-white rounded-md transition-colors outline-hidden hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
              <span class="sr-only">Logout</span>
            </button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import {
  BarChart3,
  Bell,
  Layers,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// const { logout } = useStrapiAuth()
const { clear, user: userSession } = useUserSession()
const user = computed(() => userSession.value.user)
const route = useRoute()
const router = useRouter()
// const user = useStrapiUser()
const appConfig = useAppConfig()

// Navigation items
const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Donation History",
    url: "/donations",
    icon: Layers,
  },
  {
    title: "Updates",
    url: "/updates",
    icon: Bell,
  },
]

// Utility items
const utilityItems = [
  {
    title: "Support",
    url: "/support",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value) return "U"
  const name = user.value.username || user.value.email || ""
  const parts = name.split(" ")
  if (parts.length >= 2) {
    const first = parts[0]?.[0]
    const second = parts[1]?.[0]
    if (first && second) {
      return (first + second).toUpperCase()
    }
  }
  return name[0]?.toUpperCase() || "U"
})

// Get user display name
const userDisplayName = computed(() => {
  if (!user.value) return "User"
  return user.value.username || user.value.email?.split("@")[0] || "User"
})

// Get user email
const userEmail = computed(() => {
  if (!user.value) return ""
  return user.value.email || ""
})

// Check if route is active
const isActive = (url: string) => {
  return route.path === url || route.path.startsWith(url + "/")
}

// Handle logout
const handleLogout = async () => {
  clear()
  await router.push("/login")
}
</script>
