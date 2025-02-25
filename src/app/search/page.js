import PlaceSearch from "@/components/search/place-search";
import "@/styles.css";

export default function Search() {
    return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white p-4 mb-6">
        <h1 className="text-xl font-semibold">社内施設予約システム</h1>
        </header>
        <main className="container mx-auto px-4">
        <div className="bg-white shadow-sm rounded-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">社内会議室、レンタルスペース、point0など、使用したいスペースを予約しよう！</h2>
            <PlaceSearch />
        </div>
        </main>
    </div>
);
}
