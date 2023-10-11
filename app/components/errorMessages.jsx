function MessageHandling(message) {
  if (message === "") {
    return "Sorry, something went wrong. Please try again later";
  }
  return message;
}

export function ErrorMessage({ message }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        color: "#ec0000",
        fontSize: "20px",
        margin: "-5px auto",
      }}
    >
      {MessageHandling(message)}
    </div>
  );
}
export function ErrorStatus(code) {
  return (
    <div
      style={{
        color: "red",
        fontSize: "20px",
        textAlign: "center",
      }}
    >
      {code} Opps! Something went wrong!
    </div>
  );
}
