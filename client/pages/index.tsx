import Head from "next/head";
import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { SIGN_UP, GET_USERS } from "../services/api/graphql";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [signUp, { data, loading }] = useMutation(SIGN_UP);
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_USERS, {
    skip: !data?.signUp?.authToken || loading,
  });

  useEffect(() => {
    if (data?.signUp?.authToken) {
      localStorage.setItem("token", data?.signUp?.authToken);
    }
  }, [data?.signUp?.authToken]);

  const renderUsers = () => {
    if (usersLoading) {
      return <p>Loading...</p>;
    }

    if (usersError) {
      return <p>Ops, something goes wrong!</p>;
    }

    return (
      <ul>
        {usersData.users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  };

  const handleSignUp = () => {
    signUp({
      variables: {
        input: {
          email: `test-${Math.random()}@gmail.com`,
          name: "test",
          password: "password",
        },
      },
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>GraphQL Sample</title>
        <meta name="description" content="GraphQL sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={handleSignUp}>Sign up</button>

      {data?.signUp?.authToken && !loading ? renderUsers() : null}
    </div>
  );
}
