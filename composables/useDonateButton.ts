export const useDonateButton = () => {
  const donateButtonVisible = useState("donateButton", () => false)

  const showDonateButton = () => {
    donateButtonVisible.value = true
  }

  const hideDonateButton = () => {
    donateButtonVisible.value = false
  }

  return { donateButtonVisible, showDonateButton, hideDonateButton }
}
