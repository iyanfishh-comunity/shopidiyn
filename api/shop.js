export default async function handler(req, res) {
  const binId = process.env.JSONBIN_BIN_ID;
  const masterKey = process.env.JSONBIN_MASTER_KEY;
  const binUrl = `https://api.jsonbin.io/v3/b/${binId}`;

  if (!binId || !masterKey) {
    return res.status(500).json({ error: 'Konfigurasi server belum diset di Vercel' });
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${binUrl}/latest`, {
        headers: { "X-Master-Key": masterKey, "X-Bin-Meta": "false" }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  
  if (req.method === 'PUT' || req.method === 'POST') {
    try {
      const response = await fetch(binUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": masterKey
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}