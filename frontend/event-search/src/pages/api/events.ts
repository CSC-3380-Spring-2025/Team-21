import type { NextApiRequest, NextApiResponse } from "next";
import { URLSearchParams } from "url"; 
import { SerpApiEvent, SerpApiResponse } from "@/types"; 

// how the response should look, array of events or error message
type Data = SerpApiEvent[];
type ErrorResponse = {
  message: string;
};

//Route Handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { query } = req.query;

  // make sure query is a valid query
  if (!query || typeof query !== "string" || query.trim() === "") {
    return res
      .status(400)
      .json({ message: "Missing or invalid 'query' parameter" });
  }

  // make sure .env has the api key
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    console.error("SERPAPI_API_KEY is not defined in environment variables.");
    // change this to something more generic if we ever deploy this
    return res.status(500).json({ message: "You probably forgot the api key it should have to be a seperate file than the one in backed /frontend/event-search/.env" });
  }

  const baseUrl = "https://serpapi.com/search.json";
  const params = new URLSearchParams({
    engine: "google_events",
    q: query,
    api_key: apiKey,
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    console.log(`Fetching events from SerpApi for query: "${query}"`);
    const serpApiResponse = await fetch(url);

    if (!serpApiResponse.ok) {
      let errorBody = "Unknown error from SerpApi";
      try {
        const errorData = await serpApiResponse.json();
        errorBody =
          errorData.error ||
          `SerpApi request failed with status: ${serpApiResponse.status}`;
      } catch (e) {
        errorBody = `SerpApi request failed with status: ${serpApiResponse.status}`;
      }
      console.error("SerpApi Error:", errorBody);
      return res.status(502).json({ message: "Failed to fetch data from external service" }); 
    }

    const data: SerpApiResponse = await serpApiResponse.json();

    if (data.search_metadata?.status === "Error" || data.error) {
      const errorMessage = data.error || "Unknown error returned by SerpApi.";
      console.error("SerpApi returned an error:", errorMessage);
      return res.status(500).json({ message: errorMessage });
    }


    // return the events_results array, or an empty array if it doesn't exist
    res.status(200).json(data.events_results || []);
  } catch (error) {
    console.error("Error in /api/events handler:", error);
    // catch any other unexpected errors during fetch or processing
    res.status(500).json({ message: "Internal Server Error" });
  }
}
