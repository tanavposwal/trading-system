import axios from "axios";
import { User as UserType } from "../types";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const UserList = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    function fetchUsers() {
      axios.get("http://localhost:3000/users").then((res) => {
        setUsers(res.data);
      });
    }

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg w-full shadow-lg">
      <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
        Users
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Stock Holdings
              </th>
              <th scope="col" className="px-6 py-3">
                Cash Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  <Link
                    to="/user/$id"
                    params={{ id: user.id }}
                    className="hover:underline">
                    {user.name}
                  </Link>
                </th>
                <td className="px-6 py-4 font-mono">{user.balances.stock}</td>
                <td className="px-6 py-4 font-mono">
                  ${user.balances.cash.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
