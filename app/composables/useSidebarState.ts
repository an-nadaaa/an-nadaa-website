import { useSidebarStore } from "@/stores/sidebar"

export const useSidebarState = () => {
  const sidebarStore = useSidebarStore()

  return {
    isOpen: computed(() => sidebarStore.isOpen),
    isCollapsed: computed(() => sidebarStore.isCollapsed),
    isExpanded: computed(() => sidebarStore.isExpanded),
    toggle: sidebarStore.toggle,
    open: sidebarStore.open,
    close: sidebarStore.close,
  }
}
