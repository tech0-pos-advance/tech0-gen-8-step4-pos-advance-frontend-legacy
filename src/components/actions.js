"use server"

const bookings = []
let nextId = 1

export async function addBooking(booking) {
  const newBooking = {
    id: nextId++,
    ...booking,
    createdAt: new Date().toISOString(),
  }

  // 重複チェック
  const isDuplicate = bookings.some(
    (b) => b.facility === booking.facility && b.date === booking.date && b.timeSlot === booking.timeSlot,
  )

  if (isDuplicate) {
    throw new Error("指定された時間帯は既に予約されています")
  }

  bookings.push(newBooking)
  return newBooking
}

export async function getBookings() {
  // 日付でソート
  return [...bookings].sort((a, b) => new Date(a.date) - new Date(b.date) || a.timeSlot.localeCompare(b.timeSlot))
}

export async function cancelBooking(bookingId) {
  const index = bookings.findIndex((b) => b.id === bookingId)
  if (index === -1) {
    throw new Error("予約が見つかりません")
  }
  bookings.splice(index, 1)
}

