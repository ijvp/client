export interface FacebookBusiness {
	business_id: string,
	business_name: string
};

export interface GoogleClient {
	client_id: string,
	client_name: string,
};

export interface Store {
	id: string,
	name: string,
	google_client: GoogleClient,
	facebook_business: FacebookBusiness
};

