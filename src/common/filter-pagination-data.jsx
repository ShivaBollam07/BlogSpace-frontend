import axios from "axios";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = {} }) => {
    let obj;

    if (state !== null && !create_new_arr) {
        obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
        try {
            const { data: { totalDocs } } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send);
            obj = { results: data, page: 1, totalDocs };
        } catch (err) {
            console.error("Error fetching blogs:", err);
            // Handle the error, e.g., throw an error or return a default value
            obj = { results: [], page: 1, totalDocs: 0 };
        }
    }

    return obj;
};
