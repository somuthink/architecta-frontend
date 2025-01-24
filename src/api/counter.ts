import axios from "axios";

export async function get(): Promise<number> {
    const res = await axios.get(`/counter`);
    return res.data;
}
