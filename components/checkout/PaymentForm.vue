<template>
  <Card class="w-full mx-auto">
    <CardHeader>
      <CardTitle class="font-normal">Payment Details</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">First Name*</Label>
              <Input
                id="firstName"
                v-model="firstName"
                placeholder="First Name"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name*</Label>
              <Input
                id="lastName"
                v-model="lastName"
                placeholder="Last Name"
                required
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="email">Email*</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="phone">Phone Number</Label>
            <PhoneInput />
          </div>
          <div class="space-y-2">
            <Label for="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              v-model="cardNumber"
              placeholder="Card Number"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" v-model="expiryDate" placeholder="MM/YY" />
            </div>
            <div class="space-y-2">
              <Label for="cvc">CVC</Label>
              <Input id="cvc" v-model="cvc" placeholder="***" />
            </div>
          </div>
          <Button type="submit" class="w-full">Donate</Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const phone = ref("")
const cardNumber = ref("")
const expiryDate = ref("")
const cvc = ref("")

const handleSubmit = () => {
  // Handle form submission logic here
  console.log("Form submitted", {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    cardNumber: cardNumber.value,
    expiryDate: expiryDate.value,
    cvc: cvc.value,
  })
}
</script>
