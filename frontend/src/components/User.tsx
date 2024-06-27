import axios from "axios";
import { User as UserType } from "../types";
import { useEffect, useState } from "react";

const UserComponent = () => {
  
  const [users, setUsers] = useState<UserType[]>([])
  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      setUsers(res.data);
    });
  })

  return (
    <div className="m-5 flex flex-col items-center justify-center gap-3">
      <p className="text-3xl font-bold">User</p>
      <table className="border">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Quantity</th>
          <th className="px-4 py-2">Balance</th>
        </tr>
        {users.map(user => (
          <tr>
            <td className="text-center">{user.name}</td>
            <td className="text-center">{user.balances.GOOGLE}</td>
            <td className="text-center">{user.balances.USD}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default UserComponent;
