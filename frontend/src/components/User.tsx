import axios from "axios";
import { User as UserType } from "../types";
import { useEffect, useState } from "react";

const UserComponent = () => {
  
  const [users, setUsers] = useState<UserType[]>([])
  useEffect(() => {
    axios.get("http://localhost:3000/data/users").then((res) => {
      setUsers(res.data);
    });
  })

  return (
    <div className="m-5 flex flex-col items-center justify-center gap-3">
      <p className="text-xl font-bold">User</p>

      <table className="w-fit text-sm text-left rtl:text-right text-gray-600">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Portfolio</th>
          <th className="px-6 py-3">Balance</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr className="bg-white border-b">
            <td className="px-6 py-4">{user.name}</td>
            <td className="px-6 py-4">{user.balances.GOOGLE}</td>
            <td className="px-6 py-4">${user.balances.USD}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
};

export default UserComponent;
