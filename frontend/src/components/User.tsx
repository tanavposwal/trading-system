import axios from "axios";
import { User as UserType } from "../types";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const UserComponent = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    function fetchUsers() {
      axios.get("http://localhost:3000/data/users").then((res) => {
        setUsers(res.data);
      });
    }

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-3 border rounded-xl">
      <p className="text-xl mt-3 font-bold">User</p>

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
            <tr
              key={user.id + user.balances.stock}
              className="bg-white not-last:border-b">
              <td className="px-6 py-4 underline">
                <Link to={"/user/" + user.id}>{user.name}</Link>
              </td>
              <td className="px-6 py-4">{user.balances.stock}</td>
              <td className="px-6 py-4">${user.balances.cash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserComponent;
