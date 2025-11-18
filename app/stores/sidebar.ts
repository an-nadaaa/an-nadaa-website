import { defineStore } from "pinia"

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isOpen: true, // Default to open
  }),

  getters: {
    isCollapsed: (state) => !state.isOpen,
    isExpanded: (state) => state.isOpen,
  },

  actions: {
    toggle() {
      this.isOpen = !this.isOpen
    },

    open() {
      this.isOpen = true
    },

    close() {
      this.isOpen = false
    },

    setState(isOpen: boolean) {
      this.isOpen = isOpen
    },
  },
})
