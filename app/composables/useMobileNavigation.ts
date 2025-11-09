export const useMobileNavigation = () => {
  const mobileNavigationVisible = useState("mobileNavigation", () => false)

  const showMobileNavigation = () => {
    mobileNavigationVisible.value = true
  }

  const hideMobileNavigation = () => {
    mobileNavigationVisible.value = false
  }

  return { mobileNavigationVisible, showMobileNavigation, hideMobileNavigation }
}
