import { useRef } from "react";
import '../style/preview.css';


export const Preview = ({ name, desgination, mail, phone, imageUrl }) => {
  const previewRef = useRef();

  const handleDownload = () => {
    const content = previewRef.current.outerHTML;    
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "email-signature.html";
    link.click();
  };

  return (
    <div>
      <div
        ref={previewRef}
        style={{
          padding: "10px",
          maxWidth: "600px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <tbody>
            <tr>
              <td
                rowSpan="2"
                style={{
                  width: "8%",
                  padding: "10px",
                  verticalAlign: "top",
                }}
              >
                <img
                  src={imageUrl || "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"}
                  alt="Employee"
                  style={{
                    width: "125px",
                    maxWidth: "150px",
                    height: "125px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </td>
              <td
                style={{
                  width: "30%",
                  padding: "10px",
                  verticalAlign: "top",
                  textAlign: "left",
                  borderBottom: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#211f54",
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "18px",
                    color: "#F27804",
                    fontWeight: "500",
                  }}
                >
                  {desgination}
                </p>
              </td>
              <td
                style={{
                  width: "20%",
                  padding: "10px",
                  textAlign: "center",
                  verticalAlign: "center",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <img
                  src="https://s3.ezgif.com/tmp/ezgif-3-e6e2bc58a1.png"
                  alt="Company Logo"
                  style={{ width: "80%", height: "auto" }}
                />
              </td>
            </tr>

            <tr>
              <td
                colSpan="2"
                style={{
                  padding: "10px",
                  textAlign: "left",
                  verticalAlign: "top",
                }}
              >
                {mail && (
                  <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#333" }}>
                    <img src="https://t4.ftcdn.net/jpg/09/16/95/19/360_F_916951976_YIe5OWVsXK1pnPtxVNhhF4ERDE7igNoC.jpg" alt="mail-icon" style={{ width: "20px", verticalAlign: "middle", marginRight: "8px",}} />
                    <a href={`mailto:${mail}`} style={{ textDecoration: "none", color: "#333" }}>
                      {mail}
                    </a>
                  </p>
                )}
                {phone && (
                  <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#555" }}>
                    <img src="https://i.pinimg.com/474x/88/a9/d0/88a9d0c252977e827f7f3862e8de6714.jpg" alt="phone-icon" style={{ width: "20px", verticalAlign: "middle", marginRight: "8px" }} />
                    <a href={`tel:${phone}`} style={{ textDecoration: "none", color: "#555" }}>
                      {phone}
                    </a>
                  </p>
                )}
                <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#555" }}>
                  <img src="https://i.pinimg.com/originals/d8/10/55/d81055d32cf810a6d527b5eb9ae20f08.png" alt="website-icon" style={{ width: "20px", verticalAlign: "middle", marginRight: "8px" }} />
                  <a href="https://careers.talentship.io/" style={{ textDecoration: "none", color: "#555" }}>
                    www.talentship.io
                  </a>
                </p>
              </td>
            </tr>

            <tr>
              <td
                colSpan="3"
                style={{
                  padding: "10px",
                  textAlign: "left",
                  verticalAlign: "top",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#333333",
                  backgroundColor: "#FFFAF5",
                }}
              >
                <h4>Confidentiality:</h4>
                <p
                  style={{
                    margin: "0",
                    lineHeight: "1.5",
                    fontWeight: "400",
                    fontSize: "12px",
                    color: "#666666",
                  }}
                >
                  This email contains highly confidential information intended
                  solely for the named recipient. Any unauthorized disclosure,
                  distribution, or copying of this message or its contents is
                  strictly prohibited. If you have received this message in error,
                  please notify the sender immediately and delete it without
                  delay. Your understanding and cooperation in maintaining the
                  confidentiality of this information are greatly appreciated.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <button
          className="download-btn"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#F27804",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleDownload}
        >
          Download Signature
        </button>
      </div>
    </div>
  );
};
