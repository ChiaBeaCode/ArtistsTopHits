export function ErrorMessage() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          color: "red",
          fontSize: "18px",
          margin: "10px auto",
        }}
      >
        Sorry! We could not find that artist!
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
  