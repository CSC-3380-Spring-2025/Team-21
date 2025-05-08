// types for serpapi calls and stuff
export type SerpApiEvent = {
    title: string;
    date: {
      start_date: string;
      when: string; // 
    };
    address: string[]; 
    link: string; 
    description: string; 
  
    thumbnail?: string | null; 
    ticket_info?: {
      source: string; 
      link: string; 
      link_type: string; 
    }[];
    venue?: {
      name: string;
      rating?: number;
      reviews?: number; 
      link: string; 
    };
    event_location_map?: {
      image: string; 
      link: string; 
      serpapi_link: string; 
    };
  };
  
  
  export type ApiErrorResponse = {
    message: string;
  };
  
  export type SerpApiResponse = {
    search_metadata: {
      id: string;
      status: string;
    };
    search_parameters: {
      engine: string;
      q: string;
    };
    events_results?: SerpApiEvent[];
    error?: string; 
  }
  // Event used from python backend and not directly from serpapi
  export type Event = {
    eventid: number;
    eventname: string;
    eventdate: string;
    eventlocation: string;
    eventdescription: string;
    eventthumbnail?: string | null;
    thumbnail?: string | null;
    ticketLink?: string;
    latitude: number;
    longitude: number;
  };