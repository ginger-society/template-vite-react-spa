import "./app.css";

export function App() {
  return (
    <div className="App">
      <h1>
        SSO page, this will redirect automatically.
        <br />
        For dev : please add a localStorage using devtools with key name :{" "}
        <strong>token</strong>
      </h1>
    </div>
  );
}
