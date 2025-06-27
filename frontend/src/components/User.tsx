import axios from "axios";
import { User as UserType } from "../types";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

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
    <Card className="w-full shadow-xl bg-card text-card-foreground">
      <CardHeader className="pb-2 border-b border-border">
        <CardTitle className="text-lg font-semibold">Users</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Name
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Stock Holdings
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Cash Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-muted/60 transition-colors">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                  <Link
                    to="/user/$id"
                    params={{ id: user.id }}
                    className="hover:underline text-primary">
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
      </CardContent>
    </Card>
  );
};

export default UserList;
