// pages/api/verif.js
export default async function handler(req, res) {
    const { email, token } = req.query;
    
    try {
        const apiRes = await fetch(`https://api.upos-conn.com/auth/v1/posAuth-verif/${email}/${token}`);
        const data = await apiRes.json();
        res.status(400).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
