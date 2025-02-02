import BookingForm from "@/components/booking-form";
import BookingList from "@/components/booking-list";
import "@/styles.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 mb-6">
        <h1 className="text-xl font-semibold">社内施設予約システム</h1>
      </header>
      <main className="container mx-auto px-4">
        <div className="bg-white shadow-sm rounded-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">新規予約</h2>
          <BookingForm />
        </div>
        <div className="bg-white shadow-sm rounded-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">設備一覧</h2>
          <BookingList />
        </div>
      </main>
    </div>
  );
}
