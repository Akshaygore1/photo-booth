import { client } from "./lib/appwrite";

function App() {
  async function sendPing() {
    if (status === "loading") return;
    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      console.log(log);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <button onClick={sendPing}>Send Ping</button>
      </div>
    </>
  );
}

export default App;
