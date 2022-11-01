import Head from "next/head";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../services/api/graphql";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { loading, error, data } = useQuery(GET_USERS);

  const renderUsers = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Ops, something goes wrong!</p>;
    }

    return (
      <ul>
        {data.users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>GraphQL Sample</title>
        <meta name="description" content="GraphQL sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {renderUsers()}
    </div>
  );
}
