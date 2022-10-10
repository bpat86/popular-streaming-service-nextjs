import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "POST") {
    // Destroy the session
    req.session.destroy();
    res.status(200).json({ message: "Success", isLoggedIn: false });
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["POST"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
