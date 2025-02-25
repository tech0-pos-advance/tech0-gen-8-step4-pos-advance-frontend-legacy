'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchUser } from "@/components/search/actions";

export default function PlaceSearchComponent() {
    const router = useRouter();
    // const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const user_token = "user"   // useSearchParams().get("token");
    const formRef = useRef(null);

    useEffect(() => {
        if (user_token) { // user_tokenが存在する場合のみfetchを実行
          // const fetchAndSetUser = async () => {
          //     const userData = await fetchUser(user_token);
          //     setUserName(userData.user_name);
              setToken(user_token);
              console.log(user_token);
          };
          // fetchAndSetUser();
    }, [user_token]); // 依存配列にuser_tokenを追加

    // 登録画面に遷移する関数
    const handleSubmit = async (e) => {
      e.preventDefault();

      // formRef.currentがnullでないことを確認
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const facility_type = formData.get('facility_type');
        const location = formData.get('location');
        const capacity = formData.get('capacity');
        router.push(`/?token=${token}&facility_type=${facility_type}&location=${location}&capacity=${capacity}`);
    };
  }

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <div className="container">
              <table className="w-full border-collapse border border-gray-300 text-gray-900">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    施設種別
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                  収容人数
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    地域・エリア
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                        id="facility_type"
                        name="facility_type"
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        defaultValue=""  // ここでデフォルトを設定
                    >
                      <option value="" disabled>選択してください</option>
                      <option value="training_room">training_room</option>
                      <option value="external_office">external_office</option>
                      <option value="meeting_room">meeting_room</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      id="capacity"
                      name="capacity"
                      type="number" required
                      placeholder="例: 30"
                      step="1"  // 小数を禁止
                    />
                    <span className="ml-2 text-gray-600">人以上</span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                  <select
                        id="location"
                        name="location"
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        defaultValue=""  // ここでデフォルトを設定
                    >
                      <option value="" disabled>選択してください</option>
                      <option value="東京">東京</option>
                      <option value="大阪">大阪</option>
                      <option value="渋谷">渋谷</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline text-center">
                        検索
                    </button>
                  </td>
                </tr>
              </tbody>
              </table>
            </div>
        </form>
    );
}