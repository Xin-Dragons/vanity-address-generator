import axios from 'axios';

export default async function handler(req, res) {
  let { publicKey } = req.query;

  const options = {
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
    },
    params: {
      publicKey,
      verify: false
    }
  }

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/staking/dandies/get-nfts`, options);
    res.status(200).json(data);
  } catch (err) {
    console.log(err)
    const message = err?.response?.data;
    res.status(500).json({ message });
  }
}