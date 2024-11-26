import axios from "axios";
import { User as UserType } from "../types";
import { useEffect, useState } from "react";

const UserComponent = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    function fetchUsers() {
      axios.get("http://localhost:3000/data/users").then((res) => {
        setUsers(res.data);
      });
    }

    fetchUsers();
    const interval = setInterval(fetchUsers, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-5 pt-3 flex flex-col items-center justify-center gap-3 border-l border-t border-r">
      <p className="text-xl font-bold">User</p>

      <table className="w-full text-sm text-left rtl:text-right text-gray-600 max-h-[30vh] overflow-y-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Portfolio</th>
            <th className="px-6 py-3">Balance</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id+user.balances.stock} className="bg-white border-b">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.balances.cash}</td>
              <td className="px-6 py-4">${user.balances.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserComponent;
